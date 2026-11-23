import { NextRequest } from 'next/server';
import { getAdapterRegistry, getRouterConfig } from '@/lib/api/ai-config.server';
import { ModelRouter } from '@hypermind/ai-providers';
import { MODELS } from '@/lib/models';
import { checkRateLimit } from '../../../../middleware/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const modelId = params.id;

  // Rate limiting (120 rpm per IP)
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous';

  const rateLimitResult = checkRateLimit(`model-status:${clientIp}`, {
    windowMs: 60_000,
    maxRequests: 120,
  });

  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded', retryAfterMs: rateLimitResult.retryAfterMs },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000)),
        },
      }
    );
  }

  // 1. Check if model exists in catalog
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) {
    return Response.json(
      { error: `Model '${modelId}' not found in model catalog`, modelId },
      { status: 404 }
    );
  }

  // 2. Resolve adapter & circuit breaker status
  const registry = getAdapterRegistry();
  const routerConfig = getRouterConfig();
  const router = new ModelRouter(registry, routerConfig);
  const breaker = router.getCircuitBreakerState(model.provider);

  // Check if circuit breaker is currently OPEN
  if (breaker.state === 'OPEN') {
    return Response.json({
      modelId,
      provider: model.provider,
      status: 'down',
      healthy: false,
      latencyMs: 0,
      circuitBreaker: breaker.state,
      message: 'Circuit breaker is OPEN due to repeated upstream failures',
      lastChecked: new Date().toISOString(),
    });
  }

  // Look up adapter for this model or its provider
  const adapter =
    registry.getAdapterForModel(model.id) ||
    registry.getAdapter(model.provider) ||
    (registry.hasAdapter('openai-compat') ? registry.getAdapter('openai-compat') : undefined);

  if (!adapter) {
    return Response.json({
      modelId,
      provider: model.provider,
      status: 'unavailable',
      healthy: false,
      latencyMs: 0,
      circuitBreaker: breaker.state,
      message: 'Provider adapter is not configured or lacks API credentials',
      lastChecked: new Date().toISOString(),
    });
  }

  // 3. Perform lightweight health check with timeout
  const startTime = Date.now();
  let healthy = true;
  let latencyMs = 0;
  let errorMessage: string | undefined;

  try {
    if (typeof adapter.checkProviderHealth === 'function') {
      const healthRes = await Promise.race([
        adapter.checkProviderHealth(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Health check timed out')), 5000)
        ),
      ]);
      healthy = healthRes.healthy;
      latencyMs = healthRes.latencyMs || Date.now() - startTime;
      if (!healthy) {
        errorMessage = healthRes.error ? sanitizeErrorMessage(healthRes.error) : 'Health check failed';
      }
    } else if (typeof adapter.healthCheck === 'function') {
      const isOk = await Promise.race([
        adapter.healthCheck(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Health check timed out')), 5000)
        ),
      ]);
      healthy = Boolean(isOk);
      latencyMs = Date.now() - startTime;
    } else {
      healthy = true;
      latencyMs = Date.now() - startTime;
    }
  } catch (err) {
    healthy = false;
    latencyMs = Date.now() - startTime;
    errorMessage = err instanceof Error ? sanitizeErrorMessage(err.message) : 'Health check timed out';
  }

  const status = healthy
    ? breaker.state === 'HALF_OPEN'
      ? 'degraded'
      : 'available'
    : 'down';

  return Response.json({
    modelId,
    provider: model.provider,
    status,
    healthy,
    latencyMs,
    circuitBreaker: breaker.state,
    ...(errorMessage ? { error: errorMessage } : {}),
    lastChecked: new Date().toISOString(),
  });
}

/**
 * Strips any potential sensitive keys or tokens from error messages
 */
function sanitizeErrorMessage(msg: string): string {
  return msg
    .replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=[REDACTED]')
    .replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
    .replace(/sk-[a-zA-Z0-9_\-]+/gi, '[REDACTED_API_KEY]');
}

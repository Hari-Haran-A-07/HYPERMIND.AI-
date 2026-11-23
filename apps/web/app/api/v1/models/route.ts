import { NextRequest } from 'next/server';
import { getConfiguredProviders } from '@/lib/api/ai-config.server';
import { checkRateLimit } from '../../middleware/rate-limit';
import { MODELS, PROVIDERS } from '@/lib/models';

export async function GET(req: NextRequest) {
  // Rate limiting (120 rpm)
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous';

  const rateLimitResult = checkRateLimit(`models:${clientIp}`, {
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

  const configuredProviders = getConfiguredProviders();

  // Determine provider configuration status including openai-compat mapped providers
  const isProviderConfigured = (providerId: string): boolean => {
    if (configuredProviders.includes(providerId)) return true;
    if (
      configuredProviders.includes('openai-compat') &&
      ['deepseek', 'open-weight', 'nvidia'].includes(providerId)
    ) {
      return true;
    }
    return false;
  };

  // Mark models with runtime configuration and availability status
  const modelsWithStatus = MODELS.map((model) => {
    const configured = isProviderConfigured(model.provider);
    return {
      ...model,
      available: configured && model.status === 'available',
      providerConfigured: configured,
    };
  });

  return Response.json({
    models: modelsWithStatus,
    providers: PROVIDERS.map((p) => ({
      ...p,
      configured: isProviderConfigured(p.id),
    })),
    configuredProviders,
  });
}

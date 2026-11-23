import { NextRequest } from 'next/server';
import { getAdapterRegistry, getRouterConfig } from '@/lib/api/ai-config.server';
import { ModelRouter, UsageTracker } from '@hypermind/ai-providers';
import { validateChatRequest } from '../../middleware/validate';
import { checkRateLimit } from '../../middleware/rate-limit';
import activeGenerations from './active-generations';

export async function POST(req: NextRequest) {
  // 1. Generate correlation ID
  const requestId = crypto.randomUUID();

  // 2. Rate limiting (60 rpm per IP)
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous';

  const rateLimitResult = checkRateLimit(clientIp, { windowMs: 60_000, maxRequests: 60 });
  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfterMs: rateLimitResult.retryAfterMs,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000)),
          'X-Request-Id': requestId,
        },
      }
    );
  }

  // 3. Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON body' },
      {
        status: 400,
        headers: { 'X-Request-Id': requestId },
      }
    );
  }

  const validation = validateChatRequest(body);
  if (!validation.valid || !validation.data) {
    return Response.json(
      { error: 'Validation failed', details: validation.errors },
      {
        status: 400,
        headers: { 'X-Request-Id': requestId },
      }
    );
  }

  const {
    content,
    modelId,
    conversationId,
    conversationHistory,
    systemPrompt,
    temperature,
    maxTokens,
  } = validation.data;

  // 4. Build messages array
  const messages = [
    ...(conversationHistory || []).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content },
  ];

  // 5. Create AbortController for cancellation
  const abortController = new AbortController();
  const messageId = crypto.randomUUID();
  activeGenerations.set(messageId, abortController);

  // If client disconnects early, abort active generation
  if (req.signal) {
    req.signal.addEventListener('abort', () => {
      abortController.abort();
      activeGenerations.delete(messageId);
    });
  }

  // 6. Create SSE response stream
  const registry = getAdapterRegistry();
  const routerConfig = getRouterConfig();
  const router = new ModelRouter(registry, routerConfig);
  const usageTracker = new UsageTracker();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const startTime = Date.now();
      let tokenIndex = 0;

      function sendSSE(event: string, data: object) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        // Route the request (may auto-select or use user's explicit model)
        const result = await router.routeRequest(
          {
            model: modelId || '',
            messages,
            systemPrompt,
            temperature,
            maxTokens,
            signal: abortController.signal,
            abortSignal: abortController.signal,
          },
          modelId
        );

        // Send metadata event
        sendSSE('metadata', {
          conversationId: conversationId || crypto.randomUUID(),
          messageId,
          modelId: result.routing.selectedModel,
          provider: result.routing.selectedProvider,
          reason: result.routing.reason,
          startedAt: new Date().toISOString(),
        });

        // Send fallback notification if failover occurred
        if (result.routing.reason === 'fallback' && result.routing.originalModel) {
          sendSSE('fallback', {
            originalModel: result.routing.originalModel,
            fallbackModel: result.routing.selectedModel,
            reason: `Provider for ${result.routing.originalModel} unavailable, using ${result.routing.selectedModel}`,
          });
        }

        // Stream tokens
        let totalContent = '';
        let lastUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
        let finishReason: string = 'stop';

        for await (const chunk of result.stream) {
          if (abortController.signal.aborted) {
            finishReason = 'cancelled';
            break;
          }

          const deltaText = chunk.deltaText || chunk.delta || chunk.text || '';
          if (deltaText) {
            totalContent += deltaText;
            sendSSE('token', { delta: deltaText, index: tokenIndex++ });
          }

          if (chunk.usage) {
            lastUsage = chunk.usage;
          }

          if (chunk.finishReason) {
            finishReason = chunk.finishReason;
          }
        }

        // Calculate token counts & cost estimate
        const promptTokens =
          lastUsage.promptTokens ||
          Math.ceil(messages.map((m) => m.content).join(' ').length / 4);
        const completionTokens =
          lastUsage.completionTokens || Math.ceil(totalContent.length / 4);
        const totalTokens = promptTokens + completionTokens;
        const latencyMs = Date.now() - startTime;
        const costUsd = usageTracker.calculateCost(
          result.routing.selectedModel,
          promptTokens,
          completionTokens
        );

        // Send done event
        sendSSE('done', {
          promptTokens,
          completionTokens,
          totalTokens,
          costUsd,
          finishReason,
          latencyMs,
        });
      } catch (error) {
        const isAborted = abortController.signal.aborted;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        sendSSE('error', {
          code: isAborted ? 'CANCELLED' : 'PROVIDER_ERROR',
          message: isAborted ? 'Generation cancelled by user' : errorMessage,
          recoverable: !isAborted,
        });
      } finally {
        activeGenerations.delete(messageId);
        try {
          controller.close();
        } catch {
          // Controller might already be closed if stream completed or disconnected
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Request-Id': requestId,
      'X-Message-Id': messageId,
    },
  });
}

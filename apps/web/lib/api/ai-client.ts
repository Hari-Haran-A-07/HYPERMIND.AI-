/**
 * Frontend AI Client
 *
 * Handles communication with the backend /api/v1/chat SSE endpoint.
 * Processes Server-Sent Events and yields tokens for progressive rendering.
 *
 * SECURITY: This client calls the Next.js API route which proxies to AI providers.
 * API keys are NEVER exposed to the browser.
 */

export interface StreamChatOptions {
  content: string;
  modelId?: string;
  conversationId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface SSEMetadata {
  conversationId: string;
  messageId: string;
  modelId: string;
  provider: string;
  reason: 'user_selected' | 'auto_routed' | 'fallback';
  startedAt: string;
}

export interface SSEDone {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  finishReason: 'stop' | 'length' | 'content_filter' | 'error' | 'cancelled';
  latencyMs: number;
}

export interface SSEFallback {
  originalModel: string;
  fallbackModel: string;
  reason: string;
}

export interface SSEError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface StreamCallbacks {
  onMetadata?: (metadata: SSEMetadata) => void;
  onToken?: (delta: string, index: number) => void;
  onFallback?: (fallback: SSEFallback) => void;
  onError?: (error: SSEError) => void;
  onDone?: (done: SSEDone) => void;
}

/**
 * Stream a chat message via the backend SSE endpoint.
 * Returns the messageId for cancellation purposes.
 */
export async function streamChat(
  options: StreamChatOptions,
  callbacks: StreamCallbacks
): Promise<{ messageId: string | null }> {
  let messageId: string | null = null;

  try {
    const response = await fetch('/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: options.content,
        modelId: options.modelId,
        conversationId: options.conversationId,
        conversationHistory: options.conversationHistory,
        systemPrompt: options.systemPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      }),
      signal: options.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: 'Unknown error' }));
      callbacks.onError?.({
        code: `HTTP_${response.status}`,
        message: errorBody.error || `Request failed with status ${response.status}`,
        recoverable: response.status === 429 || response.status >= 500,
      });
      return { messageId: null };
    }

    // Extract message ID from response headers
    messageId = response.headers.get('x-message-id');

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError?.({
        code: 'NO_STREAM',
        message: 'Response body is not readable',
        recoverable: false,
      });
      return { messageId };
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE frames from buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete last line

      let currentEvent = '';
      let currentData = '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          currentData = line.slice(6).trim();
        } else if (line === '' && currentEvent && currentData) {
          // Complete SSE frame — process it
          try {
            const parsed = JSON.parse(currentData);
            processSSEEvent(currentEvent, parsed, callbacks);
          } catch {
            // Skip malformed JSON
          }
          currentEvent = '';
          currentData = '';
        }
      }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // User cancelled — this is expected behavior
      return { messageId };
    }

    callbacks.onError?.({
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Network request failed',
      recoverable: true,
    });
  }

  return { messageId };
}

function processSSEEvent(
  event: string,
  data: Record<string, unknown>,
  callbacks: StreamCallbacks
): void {
  switch (event) {
    case 'metadata':
      callbacks.onMetadata?.(data as unknown as SSEMetadata);
      break;
    case 'token':
      callbacks.onToken?.(data.delta as string, data.index as number);
      break;
    case 'fallback':
      callbacks.onFallback?.(data as unknown as SSEFallback);
      break;
    case 'error':
      callbacks.onError?.(data as unknown as SSEError);
      break;
    case 'done':
      callbacks.onDone?.(data as unknown as SSEDone);
      break;
  }
}

/**
 * Cancel an active generation by messageId.
 */
export async function cancelGeneration(messageId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/v1/chat/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch available models from the backend.
 */
export async function fetchModels(): Promise<{
  models: Array<Record<string, unknown>>;
  providers: Array<Record<string, unknown>>;
  configuredProviders: string[];
} | null> {
  try {
    const response = await fetch('/api/v1/models');
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Check health status of a specific model.
 */
export async function checkModelHealth(modelId: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`/api/v1/models/${modelId}/status`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

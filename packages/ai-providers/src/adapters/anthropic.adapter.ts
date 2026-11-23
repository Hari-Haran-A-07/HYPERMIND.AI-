/**
 * @file anthropic.adapter.ts
 * @description Provider adapter for Anthropic Claude models (Sonnet 4, Opus 4, 3.5 Haiku, 3.5 Sonnet).
 * @package @hypermind/ai-providers
 */

import type {
  ProviderAdapter,
  ChatCompletionRequest,
  UnifiedChatChunk,
  ChatCompletionResponse,
  ModelDefinition,
} from '../interfaces/provider-adapter.interface';
import type { UsageEstimate, ProviderId } from '@hypermind/shared-types';

export class AnthropicAdapter implements ProviderAdapter {
  readonly name = 'anthropic';
  readonly providerName = 'Anthropic';
  private readonly apiKey: string;
  private readonly baseUrl: string;

  get providerId(): string {
    return this.name;
  }

  readonly supportedModels: string[] = [
    'claude-sonnet-4-20250514',
    'claude-opus-4-20250514',
    'claude-3-5-haiku-20241022',
    'claude-3-5-sonnet-20241022',
  ];

  readonly models: ModelDefinition[] = [
    {
      id: 'claude-sonnet-4-20250514',
      apiModelId: 'claude-sonnet-4-20250514',
      name: 'Claude Sonnet 4',
      provider: 'anthropic',
      providerName: 'Anthropic',
      description: 'Frontier code and reasoning powerhouse with expanded context.',
      contextWindow: '200K',
      contextWindowTokens: 200000,
      maxOutputTokens: 8192,
      capabilities: ['reasoning', 'code', 'vision', 'tools', 'general'],
      costPer1MInput: 3.0,
      costPer1MOutput: 15.0,
      status: 'available',
      iconColor: '#D97757',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
    {
      id: 'claude-opus-4-20250514',
      apiModelId: 'claude-opus-4-20250514',
      name: 'Claude Opus 4',
      provider: 'anthropic',
      providerName: 'Anthropic',
      description: 'Extreme-depth reasoning, mathematical proofing, and complex logic.',
      contextWindow: '200K',
      contextWindowTokens: 200000,
      maxOutputTokens: 8192,
      capabilities: ['reasoning', 'code', 'general'],
      costPer1MInput: 15.0,
      costPer1MOutput: 75.0,
      status: 'available',
      iconColor: '#D97757',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
    {
      id: 'claude-3-5-haiku-20241022',
      apiModelId: 'claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      provider: 'anthropic',
      providerName: 'Anthropic',
      description: 'Ultra-fast inference with exceptional coding capability at low latency.',
      contextWindow: '200K',
      contextWindowTokens: 200000,
      maxOutputTokens: 8192,
      capabilities: ['fast', 'code', 'general'],
      costPer1MInput: 0.8,
      costPer1MOutput: 4.0,
      status: 'available',
      iconColor: '#D97757',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
  ];

  constructor(apiKey: string, baseUrl = 'https://api.anthropic.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getAvailableModels(): string[] {
    return [...this.supportedModels];
  }

  hasModel(modelId: string): boolean {
    const id = modelId.toLowerCase();
    return (
      id.includes('claude') ||
      this.supportedModels.includes(modelId) ||
      this.models.some((m) => m.id === modelId || m.apiModelId === modelId)
    );
  }

  estimateUsage(request: { model?: string; messages: Array<{ role: string; content: string }> }): UsageEstimate {
    const model = request.model || 'claude-sonnet-4-20250514';
    const totalChars = request.messages.reduce((sum, m) => sum + (m.content || '').length, 0);
    const estimatedInputTokens = Math.max(1, Math.ceil(totalChars / 4));
    const estimatedOutputTokens = 500;

    let inputRate = 3.0;
    let outputRate = 15.0;
    if (model.includes('opus')) {
      inputRate = 15.0;
      outputRate = 75.0;
    } else if (model.includes('haiku')) {
      inputRate = 0.8;
      outputRate = 4.0;
    }

    const estimatedCostUsd =
      (estimatedInputTokens * inputRate + estimatedOutputTokens * outputRate) / 1_000_000;

    return {
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
      model,
      provider: 'anthropic' as ProviderId,
    };
  }

  private resolveModelId(modelId?: string): string {
    if (!modelId) return 'claude-sonnet-4-20250514';
    if (modelId === 'claude-3-5-sonnet' || modelId === 'claude-sonnet-4') return 'claude-sonnet-4-20250514';
    if (modelId === 'claude-opus-4') return 'claude-opus-4-20250514';
    if (modelId === 'claude-3-5-haiku') return 'claude-3-5-haiku-20241022';
    return modelId;
  }

  async *streamMessage(
    request: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncGenerator<UnifiedChatChunk> {
    const model = this.resolveModelId(request.model || request.modelId);
    const systemMessage = request.systemPrompt || request.messages.find((m) => m.role === 'system')?.content;

    const messages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      }));

    const body: Record<string, unknown> = {
      model,
      messages,
      max_tokens: request.maxTokens || 4096,
      stream: true,
      temperature: request.temperature ?? 0.7,
    };

    if (systemMessage) {
      body.system = systemMessage;
    }

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Anthropic API error (${response.status}): ${errText}`);
    }

    if (!response.body) {
      throw new Error('Anthropic API returned empty response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.slice(5).trim();
          if (!dataStr || dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              yield {
                deltaText: parsed.delta.text,
                delta: parsed.delta.text,
                text: parsed.delta.text,
              };
            } else if (parsed.type === 'message_delta') {
              yield {
                finishReason: parsed.delta?.stop_reason,
                usage: parsed.usage
                  ? {
                      promptTokens: 0,
                      completionTokens: parsed.usage.output_tokens || 0,
                      totalTokens: parsed.usage.output_tokens || 0,
                    }
                  : undefined,
              };
            }
          } catch {
            // Ignore parse errors on individual SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async sendMessage(
    request: ChatCompletionRequest,
    signal?: AbortSignal
  ): Promise<ChatCompletionResponse> {
    const start = Date.now();
    const model = this.resolveModelId(request.model || request.modelId);
    const systemMessage = request.systemPrompt || request.messages.find((m) => m.role === 'system')?.content;

    const messages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      }));

    const body: Record<string, unknown> = {
      model,
      messages,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature ?? 0.7,
    };

    if (systemMessage) {
      body.system = systemMessage;
    }

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Anthropic API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    const content = data.content?.[0]?.text || '';

    return {
      id: data.id,
      content,
      model,
      provider: this.name,
      finishReason: data.stop_reason,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      latencyMs: Date.now() - start,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await this.sendMessage({
        messages: [{ role: 'user', content: 'ping' }],
        maxTokens: 5,
      });
      return Boolean(res.content);
    } catch {
      return false;
    }
  }
}

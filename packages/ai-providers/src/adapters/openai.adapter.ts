/**
 * @file openai.adapter.ts
 * @description Provider adapter for OpenAI models (GPT-4o, GPT-4o-mini).
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

export class OpenAIAdapter implements ProviderAdapter {
  readonly name = 'openai';
  readonly providerName = 'OpenAI';
  private readonly apiKey: string;
  private readonly baseUrl: string;

  get providerId(): string {
    return this.name;
  }

  readonly supportedModels: string[] = ['gpt-4o', 'gpt-4o-mini'];

  readonly models: ModelDefinition[] = [
    {
      id: 'gpt-4o',
      apiModelId: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'openai',
      providerName: 'OpenAI',
      description: 'Omni-modal flagship model with native audio, vision, fast inference.',
      contextWindow: '128K',
      contextWindowTokens: 128000,
      maxOutputTokens: 4096,
      capabilities: ['vision', 'tools', 'reasoning', 'multimodal', 'general'],
      costPer1MInput: 2.5,
      costPer1MOutput: 10.0,
      status: 'available',
      iconColor: '#10A37F',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
    {
      id: 'gpt-4o-mini',
      apiModelId: 'gpt-4o-mini',
      name: 'GPT-4o-mini',
      provider: 'openai',
      providerName: 'OpenAI',
      description: 'Cost-efficient small model designed for high-throughput, low-latency daily tasks.',
      contextWindow: '128K',
      contextWindowTokens: 128000,
      maxOutputTokens: 4096,
      capabilities: ['fast', 'vision', 'tools', 'general'],
      costPer1MInput: 0.15,
      costPer1MOutput: 0.6,
      status: 'available',
      iconColor: '#10A37F',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
  ];

  constructor(apiKey: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getAvailableModels(): string[] {
    return [...this.supportedModels];
  }

  hasModel(modelId: string): boolean {
    const id = modelId.toLowerCase();
    return (
      id.startsWith('gpt') ||
      id.startsWith('o1') ||
      id.startsWith('o3') ||
      this.supportedModels.includes(modelId) ||
      this.models.some((m) => m.id === modelId)
    );
  }

  estimateUsage(request: { model?: string; messages: Array<{ role: string; content: string }> }): UsageEstimate {
    const model = request.model || 'gpt-4o';
    const totalChars = request.messages.reduce((sum, m) => sum + (m.content || '').length, 0);
    const estimatedInputTokens = Math.max(1, Math.ceil(totalChars / 4));
    const estimatedOutputTokens = 500;
    const isMini = model.includes('mini');
    const inputRate = isMini ? 0.15 : 2.5;
    const outputRate = isMini ? 0.6 : 10.0;
    const estimatedCostUsd =
      (estimatedInputTokens * inputRate + estimatedOutputTokens * outputRate) / 1_000_000;

    return {
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
      model,
      provider: 'openai' as ProviderId,
    };
  }

  async *streamMessage(
    request: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncGenerator<UnifiedChatChunk> {
    const model = request.model || request.modelId || 'gpt-4o';
    const messages = [...request.messages];

    if (request.systemPrompt && !messages.some((m) => m.role === 'system')) {
      messages.unshift({ role: 'system', content: request.systemPrompt });
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
        stream: true,
        stream_options: { include_usage: true },
      }),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    if (!response.body) {
      throw new Error('OpenAI API returned empty response body');
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
            const delta = parsed.choices?.[0]?.delta?.content || '';
            const finishReason = parsed.choices?.[0]?.finish_reason;
            const usage = parsed.usage
              ? {
                  promptTokens: parsed.usage.prompt_tokens || 0,
                  completionTokens: parsed.usage.completion_tokens || 0,
                  totalTokens: parsed.usage.total_tokens || 0,
                }
              : undefined;

            yield {
              deltaText: delta,
              delta,
              text: delta,
              finishReason,
              usage,
            };
          } catch {
            // Ignore parse errors on individual lines
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
    const model = request.model || request.modelId || 'gpt-4o';
    const messages = [...request.messages];

    if (request.systemPrompt && !messages.some((m) => m.role === 'system')) {
      messages.unshift({ role: 'system', content: request.systemPrompt });
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
      }),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    const choice = data.choices?.[0];

    return {
      id: data.id,
      content: choice?.message?.content || '',
      model,
      provider: this.name,
      finishReason: choice?.finish_reason,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
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

/**
 * @file openai-compatible.adapter.ts
 * @description Provider adapter for OpenAI-compatible endpoints (DeepSeek, Together AI, Fireworks, Groq, NVIDIA NIM).
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

export interface OpenAICompatOptions {
  apiKey: string;
  baseURL?: string;
  providerLabel?: string;
  models?: Array<string | ModelDefinition>;
}

export class OpenAICompatibleAdapter implements ProviderAdapter {
  readonly name: string;
  readonly providerName: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  readonly models: ModelDefinition[];
  readonly supportedModels: string[];

  get providerId(): string {
    return this.name;
  }

  constructor(
    nameOrOptions: string | OpenAICompatOptions = 'openai-compat',
    apiKeyArg?: string,
    baseUrlArg = 'https://api.together.xyz/v1',
    modelsArg?: ModelDefinition[]
  ) {
    if (typeof nameOrOptions === 'object' && nameOrOptions !== null) {
      const opts = nameOrOptions;
      this.name = 'openai-compat';
      this.providerName = opts.providerLabel || 'OpenAI Compatible';
      this.apiKey = opts.apiKey;
      this.baseUrl = (opts.baseURL || 'https://api.together.xyz/v1').replace(/\/+$/, '');

      if (opts.models && opts.models.length > 0) {
        if (typeof opts.models[0] === 'string') {
          this.supportedModels = opts.models as string[];
          this.models = (opts.models as string[]).map((id) => ({
            id,
            apiModelId: id,
            name: id,
            provider: 'openai-compat',
            providerName: this.providerName,
            description: `OpenAI compatible model ${id}`,
            contextWindow: '128K',
            contextWindowTokens: 128000,
            maxOutputTokens: 4096,
            capabilities: ['code', 'general'],
            costPer1MInput: 0.88,
            costPer1MOutput: 0.88,
            status: 'available',
            iconColor: '#8B5CF6',
            supportsStreaming: true,
            supportsSystemPrompt: true,
          }));
        } else {
          this.models = opts.models as ModelDefinition[];
          this.supportedModels = this.models.map((m) => m.id);
        }
      } else {
        this.models = this.getDefaultModels();
        this.supportedModels = this.models.map((m) => m.id);
      }
    } else {
      this.name = nameOrOptions;
      this.providerName = 'OpenAI Compatible';
      this.apiKey = apiKeyArg || '';
      this.baseUrl = baseUrlArg.replace(/\/+$/, '');
      this.models = modelsArg || this.getDefaultModels();
      this.supportedModels = this.models.map((m) => m.id);
    }
  }

  private getDefaultModels(): ModelDefinition[] {
    return [
      {
        id: 'openai/gpt-oss-120b',
        apiModelId: 'openai/gpt-oss-120b',
        name: 'GPT-OSS 120B',
        provider: 'openai-compat',
        providerName: 'Open Weight',
        description: 'Frontier open-weight model with 120B active parameters for coding and general tasks.',
        contextWindow: '128K',
        contextWindowTokens: 128000,
        maxOutputTokens: 4096,
        capabilities: ['code', 'general', 'reasoning'],
        costPer1MInput: 0.88,
        costPer1MOutput: 0.88,
        status: 'available',
        iconColor: '#8B5CF6',
        supportsStreaming: true,
        supportsSystemPrompt: true,
      },
      {
        id: 'deepseek-r1',
        apiModelId: 'deepseek-reasoner',
        name: 'DeepSeek-R1',
        provider: 'deepseek',
        providerName: 'DeepSeek',
        description: 'Specialized reinforced chain-of-thought open reasoning model.',
        contextWindow: '64K',
        contextWindowTokens: 64000,
        maxOutputTokens: 8192,
        capabilities: ['reasoning', 'code', 'general'],
        costPer1MInput: 0.55,
        costPer1MOutput: 2.19,
        status: 'available',
        iconColor: '#0066FF',
        supportsStreaming: true,
        supportsSystemPrompt: true,
      },
      {
        id: 'deepseek-v3',
        apiModelId: 'deepseek-chat',
        name: 'DeepSeek-V3',
        provider: 'deepseek',
        providerName: 'DeepSeek',
        description: '671B MoE architecture delivering frontier-grade general capabilities.',
        contextWindow: '128K',
        contextWindowTokens: 128000,
        maxOutputTokens: 8192,
        capabilities: ['general', 'code', 'fast'],
        costPer1MInput: 0.14,
        costPer1MOutput: 0.28,
        status: 'available',
        iconColor: '#0066FF',
        supportsStreaming: true,
        supportsSystemPrompt: true,
      },
      {
        id: 'llama-3-1-70b',
        apiModelId: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        name: 'Llama 3.1 70B',
        provider: 'openai-compat',
        providerName: 'Meta',
        description: 'Industry standard open model with high reasoning and tool accuracy.',
        contextWindow: '128K',
        contextWindowTokens: 128000,
        maxOutputTokens: 4096,
        capabilities: ['general', 'code', 'reasoning'],
        costPer1MInput: 0.52,
        costPer1MOutput: 0.75,
        status: 'available',
        iconColor: '#0081FB',
        supportsStreaming: true,
        supportsSystemPrompt: true,
      },
      {
        id: 'mistral-large',
        apiModelId: 'mistralai/Mistral-Large-2407',
        name: 'Mistral Large',
        provider: 'openai-compat',
        providerName: 'Mistral AI',
        description: 'Frontier multilingual and reasoning powerhouse.',
        contextWindow: '128K',
        contextWindowTokens: 128000,
        maxOutputTokens: 4096,
        capabilities: ['reasoning', 'code', 'general'],
        costPer1MInput: 2.0,
        costPer1MOutput: 6.0,
        status: 'available',
        iconColor: '#FF7000',
        supportsStreaming: true,
        supportsSystemPrompt: true,
      },
    ];
  }

  getAvailableModels(): string[] {
    return [...this.supportedModels];
  }

  hasModel(modelId: string): boolean {
    const id = modelId.toLowerCase();
    return (
      id.includes('deepseek') ||
      id.includes('llama') ||
      id.includes('mistral') ||
      id.includes('gpt-oss') ||
      this.supportedModels.includes(modelId) ||
      this.models.some((m) => m.id === modelId || m.apiModelId === modelId)
    );
  }

  estimateUsage(request: { model?: string; messages: Array<{ role: string; content: string }> }): UsageEstimate {
    const model = request.model || this.supportedModels[0] || 'openai/gpt-oss-120b';
    const totalChars = request.messages.reduce((sum, m) => sum + (m.content || '').length, 0);
    const estimatedInputTokens = Math.max(1, Math.ceil(totalChars / 4));
    const estimatedOutputTokens = 500;
    const inputRate = 0.88;
    const outputRate = 0.88;
    const estimatedCostUsd =
      (estimatedInputTokens * inputRate + estimatedOutputTokens * outputRate) / 1_000_000;

    return {
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
      model,
      provider: 'openai-compat' as ProviderId,
    };
  }

  private resolveModelId(modelId?: string): string {
    if (!modelId) return this.models[0]?.apiModelId || 'openai/gpt-oss-120b';
    const match = this.models.find((m) => m.id === modelId);
    return match?.apiModelId || modelId;
  }

  async *streamMessage(
    request: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncGenerator<UnifiedChatChunk> {
    const model = this.resolveModelId(request.model || request.modelId);
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
      throw new Error(`${this.name} API error (${response.status}): ${errText}`);
    }

    if (!response.body) {
      throw new Error(`${this.name} API returned empty response body`);
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
    const model = this.resolveModelId(request.model || request.modelId);
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
      throw new Error(`${this.name} API error (${response.status}): ${errText}`);
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

/**
 * Backward compatibility alias for OpenAICompatibleAdapter.
 */
export { OpenAICompatibleAdapter as OpenAICompatAdapter };

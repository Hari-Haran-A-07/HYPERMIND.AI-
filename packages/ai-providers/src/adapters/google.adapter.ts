/**
 * @file google.adapter.ts
 * @description Provider adapter for Google Gemini models (Gemini 2.5 Flash, Gemini 2.5 Pro, 2.0 Flash).
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

export class GoogleAdapter implements ProviderAdapter {
  readonly name = 'google';
  readonly providerName = 'Google';
  private readonly apiKey: string;
  private readonly baseUrl: string;

  get providerId(): string {
    return this.name;
  }

  readonly supportedModels: string[] = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1-5-flash',
    'gemini-1-5-pro',
  ];

  readonly models: ModelDefinition[] = [
    {
      id: 'gemini-2.5-flash',
      apiModelId: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      provider: 'google',
      providerName: 'Google',
      description: 'Ultra-fast multimodal reasoning with extreme throughput efficiency.',
      contextWindow: '1M',
      contextWindowTokens: 1000000,
      maxOutputTokens: 8192,
      capabilities: ['fast', 'multimodal', 'vision', 'general'],
      costPer1MInput: 0.15,
      costPer1MOutput: 0.6,
      status: 'available',
      iconColor: '#4285F4',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
    {
      id: 'gemini-2.5-pro',
      apiModelId: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      provider: 'google',
      providerName: 'Google',
      description: 'Deep multimodal understanding across text, audio, images, and long context.',
      contextWindow: '2M',
      contextWindowTokens: 2000000,
      maxOutputTokens: 8192,
      capabilities: ['multimodal', 'reasoning', 'vision', 'code', 'general'],
      costPer1MInput: 1.25,
      costPer1MOutput: 10.0,
      status: 'available',
      iconColor: '#4285F4',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
    {
      id: 'gemini-2.0-flash',
      apiModelId: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'google',
      providerName: 'Google',
      description: 'Second-generation Flash model optimized for sub-second responses.',
      contextWindow: '1M',
      contextWindowTokens: 1000000,
      maxOutputTokens: 8192,
      capabilities: ['fast', 'multimodal', 'general'],
      costPer1MInput: 0.1,
      costPer1MOutput: 0.4,
      status: 'available',
      iconColor: '#4285F4',
      supportsStreaming: true,
      supportsSystemPrompt: true,
    },
  ];

  constructor(apiKey: string, baseUrl = 'https://generativelanguage.googleapis.com/v1beta') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getAvailableModels(): string[] {
    return [...this.supportedModels];
  }

  hasModel(modelId: string): boolean {
    const id = modelId.toLowerCase();
    return (
      id.includes('gemini') ||
      this.supportedModels.includes(modelId) ||
      this.models.some((m) => m.id === modelId)
    );
  }

  estimateUsage(request: { model?: string; messages: Array<{ role: string; content: string }> }): UsageEstimate {
    const model = request.model || 'gemini-2.5-flash';
    const totalChars = request.messages.reduce((sum, m) => sum + (m.content || '').length, 0);
    const estimatedInputTokens = Math.max(1, Math.ceil(totalChars / 4));
    const estimatedOutputTokens = 500;
    const isPro = model.includes('pro');
    const inputRate = isPro ? 1.25 : 0.15;
    const outputRate = isPro ? 10.0 : 0.6;
    const estimatedCostUsd =
      (estimatedInputTokens * inputRate + estimatedOutputTokens * outputRate) / 1_000_000;

    return {
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
      model,
      provider: 'google' as ProviderId,
    };
  }

  private resolveModelId(modelId?: string): string {
    if (!modelId) return 'gemini-2.5-flash';
    if (modelId === 'gemini-1-5-flash') return 'gemini-2.5-flash';
    if (modelId === 'gemini-1-5-pro') return 'gemini-2.5-pro';
    return modelId;
  }

  private formatContents(request: ChatCompletionRequest) {
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const msg of request.messages) {
      if (msg.role === 'system') continue;
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    const systemInstruction =
      request.systemPrompt || request.messages.find((m) => m.role === 'system')?.content;

    return { contents, systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined };
  }

  async *streamMessage(
    request: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncGenerator<UnifiedChatChunk> {
    const model = this.resolveModelId(request.model || request.modelId);
    const { contents, systemInstruction } = this.formatContents(request);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = systemInstruction;
    }

    const url = `${this.baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Google Gemini API error (${response.status}): ${errText}`);
    }

    if (!response.body) {
      throw new Error('Google Gemini API returned empty response body');
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
          if (!dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);
            const candidate = parsed.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || '';
            const finishReason = candidate?.finishReason;
            const usageMetadata = parsed.usageMetadata;

            yield {
              deltaText: text,
              delta: text,
              text,
              finishReason,
              usage: usageMetadata
                ? {
                    promptTokens: usageMetadata.promptTokenCount || 0,
                    completionTokens: usageMetadata.candidatesTokenCount || 0,
                    totalTokens: usageMetadata.totalTokenCount || 0,
                  }
                : undefined,
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
    const { contents, systemInstruction } = this.formatContents(request);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = systemInstruction;
    }

    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Google Gemini API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    const candidate = data.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text || '';
    const usageMetadata = data.usageMetadata;

    return {
      content,
      model,
      provider: this.name,
      finishReason: candidate?.finishReason,
      usage: {
        promptTokens: usageMetadata?.promptTokenCount || 0,
        completionTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
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

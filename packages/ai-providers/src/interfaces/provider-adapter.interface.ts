/**
 * Unified AI Provider Adapter Interface
 * 
 * All provider adapters must implement this interface to ensure
 * consistent behavior across Google Gemini, Anthropic Claude,
 * OpenAI, and OpenAI-compatible providers.
 */

import type { ModelDefinition, UsageEstimate } from '@hypermind/shared-types';

export { type ModelDefinition, type UsageEstimate };

export interface UnifiedChatChunk {
  deltaText?: string;
  delta?: string;
  text?: string;
  finishReason?: 'stop' | 'length' | 'content_filter' | string | null;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ProviderMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: Array<{ type: string; name?: string; url?: string; [key: string]: unknown }>;
}

export interface ChatCompletionRequest {
  model?: string;              // API model ID string
  modelId?: string;            // Alias for model
  messages: ProviderMessage[];
  systemPrompt?: string;
  temperature?: number;       // 0.0 - 2.0
  maxTokens?: number;
  stream?: boolean;
  signal?: AbortSignal;       // For cancellation
  abortSignal?: AbortSignal;  // Alias for signal
}

export interface ChatCompletionResponse {
  id?: string;
  content: string;
  model: string;
  provider?: string;
  finishReason?: 'stop' | 'length' | 'content_filter' | string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs?: number;
}

export interface ProviderHealthStatus {
  healthy: boolean;
  latencyMs: number;
  error?: string;
}

export interface ProviderAdapter {
  /** Provider identifier */
  readonly name: string;
  readonly providerId?: string;
  /** Human-readable provider name */
  readonly providerName?: string;
  /** List of model IDs this adapter supports */
  readonly supportedModels: string[];
  readonly models?: ModelDefinition[];
  
  /** Send a complete (non-streaming) message */
  sendMessage(request: ChatCompletionRequest, signal?: AbortSignal): Promise<ChatCompletionResponse>;
  
  /** Stream a message, yielding chunks as they arrive */
  streamMessage(request: ChatCompletionRequest, signal?: AbortSignal): AsyncGenerator<UnifiedChatChunk>;
  
  /** Get list of available/supported models */
  getAvailableModels?(): string[];
  
  /** Check if the provider is healthy and reachable */
  checkProviderHealth?(): Promise<ProviderHealthStatus>;
  healthCheck?(): Promise<boolean>;
  
  /** Estimate token usage and cost before sending */
  estimateUsage?(request: ChatCompletionRequest): { estimatedInputTokens: number; estimatedCostUsd: number } | UsageEstimate;

  hasModel?(modelId: string): boolean;
}

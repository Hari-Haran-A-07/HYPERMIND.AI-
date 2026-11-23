/**
 * @file model-router.ts
 * @description Intelligent model router featuring circuit breaker resilience, deterministic fallback chains,
 * exponential backoff with full jitter, and task-based automatic intent routing.
 * @package @hypermind/ai-providers
 */

import { AdapterRegistry } from '../adapters/adapter-registry';
import { IntentClassifier, ClassificationResult } from './intent-classifier';
import { UsageTracker } from '../usage/usage-tracker';
import type {
  ProviderAdapter,
  ChatCompletionRequest,
  UnifiedChatChunk,
  ChatCompletionResponse,
} from '../interfaces/provider-adapter.interface';
import type { UsageEstimate, ProviderId } from '@hypermind/shared-types';

/**
 * Operational timeout, retry, and circuit breaker configuration for the ModelRouter.
 */
export interface RouterConfig {
  /** Time-to-first-token timeout in milliseconds (default: 8000) */
  ttftTimeoutMs: number;
  /** Extended timeout in milliseconds for reasoning models (default: 25000) */
  reasoningTimeoutMs: number;
  /** Maximum retry attempts per model before triggering fallback (default: 2) */
  maxRetries: number;
  /** Base delay in milliseconds for exponential backoff (default: 500) */
  retryBaseMs: number;
  /** Maximum delay cap in milliseconds for backoff jitter (default: 3000) */
  retryMaxMs: number;
  /** Number of consecutive failures to open the circuit breaker (default: 3) */
  circuitBreakerThreshold: number;
  /** Cooldown duration in milliseconds before moving from OPEN to HALF_OPEN (default: 60000) */
  circuitBreakerCooldownMs: number;
}

/**
 * Constructor options format compatible with earlier Day 2-3 specifications.
 */
export interface ModelRouterOptions {
  registry: AdapterRegistry;
  defaultModel?: string;
  config?: Partial<RouterConfig>;
}

/**
 * Detailed routing decision telemetry explaining why a specific model was activated.
 */
export interface RoutingDecision {
  /** Model ID selected to handle completion */
  selectedModel: string;
  /** Provider ID hosting the model */
  selectedProvider: string;
  /** Rationale for this routing choice */
  reason: 'user_selected' | 'auto_routed' | 'fallback';
  /** Intent and complexity classification results (if auto-routed) */
  classification?: ClassificationResult;
  /** List of candidate models attempted that failed prior to this selection */
  fallbackChain?: string[];
  /** Originally requested model identifier if failover occurred */
  originalModel?: string;
}

/**
 * Result payload containing an active token stream generator and routing decision metadata.
 */
export interface StreamResult {
  stream: AsyncGenerator<UnifiedChatChunk>;
  routing: RoutingDecision;
}

/**
 * Internal circuit breaker state entry tracked per provider.
 */
export interface CircuitBreakerEntry {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  consecutiveFailures: number;
  lastFailureTime: number;
  lastSuccessTime: number;
}

/**
 * Deterministic fallback sequences for models when circuit is OPEN or retries exhaust.
 */
export const DEFAULT_FALLBACK_MAP: Record<string, string[]> = {
  // Claude Sonnet 4 -> GPT-4o -> Gemini 2.5 Pro
  'claude-sonnet-4-20250514': ['gpt-4o', 'gemini-2.5-pro'],
  'claude-sonnet-4': ['gpt-4o', 'gemini-2.5-pro'],
  'claude-3-5-sonnet': ['gpt-4o', 'gemini-2.5-pro'],
  'claude-3-5-sonnet-20241022': ['gpt-4o', 'gemini-2.5-pro'],

  // Claude Opus 4 -> Claude Sonnet 4 -> GPT-4o
  'claude-opus-4-20250514': ['claude-sonnet-4-20250514', 'gpt-4o'],
  'claude-opus-4': ['claude-sonnet-4-20250514', 'gpt-4o'],

  // GPT-4o -> Claude Sonnet 4 -> Gemini 2.5 Pro
  'gpt-4o': ['claude-sonnet-4-20250514', 'gemini-2.5-pro'],

  // GPT-4o-mini -> Gemini 2.5 Flash -> Claude 3.5 Haiku
  'gpt-4o-mini': ['gemini-2.5-flash', 'claude-3-5-haiku-20241022'],

  // Gemini 2.5 Flash -> GPT-4o-mini -> Claude 3.5 Haiku
  'gemini-2.5-flash': ['gpt-4o-mini', 'claude-3-5-haiku-20241022'],
  'gemini-2.0-flash': ['gpt-4o-mini', 'claude-3-5-haiku-20241022'],
  'gemini-1-5-flash': ['gpt-4o-mini', 'claude-3-5-haiku-20241022'],

  // Gemini 2.5 Pro -> Claude Sonnet 4 -> GPT-4o
  'gemini-2.5-pro': ['claude-sonnet-4-20250514', 'gpt-4o'],
  'gemini-1-5-pro': ['claude-sonnet-4-20250514', 'gpt-4o'],

  // GPT-OSS 120B -> GPT-4o -> Claude Sonnet 4
  'openai/gpt-oss-120b': ['gpt-4o', 'claude-sonnet-4-20250514'],
  'gpt-oss-120b': ['gpt-4o', 'claude-sonnet-4-20250514'],

  // DeepSeek R1 -> Claude Sonnet 4 -> GPT-4o
  'deepseek-r1': ['claude-sonnet-4-20250514', 'gpt-4o'],
  'deepseek-v3': ['claude-sonnet-4-20250514', 'gpt-4o'],
};

/**
 * Task-based model selection mapping when user has not specified a model.
 */
const AUTO_ROUTING_MODELS: Record<
  'reasoning' | 'code' | 'fast' | 'multimodal' | 'general',
  string
> = {
  code: 'claude-sonnet-4-20250514',
  reasoning: 'claude-opus-4-20250514',
  fast: 'gemini-2.5-flash',
  multimodal: 'gemini-2.5-pro',
  general: 'claude-sonnet-4-20250514',
};

/**
 * Intelligent Model Router
 *
 * Routes AI requests to the optimal model based on:
 * - User-selected model (highest priority — never silently changed)
 * - Task classification (automatic selection)
 * - Provider health and availability
 * - Fallback chains when providers fail
 * - Circuit breaker pattern
 */
export class ModelRouter {
  private registry: AdapterRegistry;
  private classifier: IntentClassifier;
  private usageTracker: UsageTracker;
  private config: RouterConfig;
  private circuitBreakers: Map<string, CircuitBreakerEntry> = new Map();
  private defaultModel = 'claude-sonnet-4-20250514';

  constructor(
    registryOrOptions: AdapterRegistry | ModelRouterOptions,
    config?: Partial<RouterConfig>
  ) {
    if ('registry' in registryOrOptions && registryOrOptions.registry instanceof AdapterRegistry) {
      this.registry = registryOrOptions.registry;
      if (registryOrOptions.defaultModel) {
        this.defaultModel = registryOrOptions.defaultModel;
      }
      this.config = {
        ttftTimeoutMs: 8000,
        reasoningTimeoutMs: 25000,
        maxRetries: 2,
        retryBaseMs: 500,
        retryMaxMs: 3000,
        circuitBreakerThreshold: 3,
        circuitBreakerCooldownMs: 60000,
        ...registryOrOptions.config,
        ...config,
      };
    } else {
      this.registry = registryOrOptions as AdapterRegistry;
      this.config = {
        ttftTimeoutMs: 8000,
        reasoningTimeoutMs: 25000,
        maxRetries: 2,
        retryBaseMs: 500,
        retryMaxMs: 3000,
        circuitBreakerThreshold: 3,
        circuitBreakerCooldownMs: 60000,
        ...config,
      };
    }

    this.classifier = new IntentClassifier();
    this.usageTracker = new UsageTracker();
  }

  /**
   * Main routing method - resolves model and returns a streaming result.
   */
  async routeRequest(
    request: ChatCompletionRequest,
    userSelectedModel?: string
  ): Promise<StreamResult> {
    const isUserExplicit = Boolean(userSelectedModel && userSelectedModel.trim());
    let primaryModel: string;
    let classification: ClassificationResult | undefined;

    if (isUserExplicit) {
      primaryModel = userSelectedModel!.trim();
    } else {
      // Auto-routing based on task classification
      const latestMessage = request.messages[request.messages.length - 1]?.content || '';
      const attachments = request.messages.flatMap((m) => m.attachments || []);
      classification = this.classifier.classify(latestMessage, attachments);
      const recommendedType = this.classifier.getRecommendedModelType(classification);
      primaryModel = AUTO_ROUTING_MODELS[recommendedType] || this.defaultModel;
    }

    // Build deterministic candidate chain
    const candidateChain = this.buildCandidateChain(primaryModel);
    const modelsTried: string[] = [];
    let lastError: Error | null = null;

    for (const candidateModel of candidateChain) {
      const providerId = this.resolveProviderForModel(candidateModel);
      const breaker = this.getCircuitBreakerState(providerId);

      // Skip provider if circuit is OPEN
      if (breaker.state === 'OPEN') {
        modelsTried.push(candidateModel);
        continue;
      }

      const adapter = this.registry.getAdapterForModel(candidateModel) || this.registry.getAdapter(providerId);
      if (!adapter) {
        modelsTried.push(candidateModel);
        continue;
      }

      // Attempt execution with exponential backoff and retries
      for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
        if (attempt > 0) {
          await this.sleepWithJitter(attempt);
        }

        try {
          const timeoutMs = this.getTimeoutForModel(candidateModel);
          const reqWithModel: ChatCompletionRequest = {
            ...request,
            model: candidateModel,
            modelId: candidateModel,
          };

          // Race first token against TTFT timeout
          const streamIterator = adapter.streamMessage(reqWithModel, request.abortSignal);
          const firstChunkResult = await this.awaitFirstChunkWithTimeout(
            streamIterator,
            timeoutMs,
            candidateModel,
            request.abortSignal
          );

          // Success: reset circuit breaker
          this.recordSuccess(providerId);

          const isFallback = candidateModel !== primaryModel;
          const routing: RoutingDecision = {
            selectedModel: candidateModel,
            selectedProvider: providerId,
            reason: isFallback ? 'fallback' : isUserExplicit ? 'user_selected' : 'auto_routed',
            classification,
            fallbackChain: modelsTried.length > 0 ? [...modelsTried] : undefined,
            originalModel: isFallback ? primaryModel : undefined,
          };

          const wrappedStream = this.createPipedGenerator(firstChunkResult, streamIterator);

          return {
            stream: wrappedStream,
            routing,
          };
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (request.abortSignal?.aborted) {
            throw lastError;
          }
        }
      }

      this.recordFailure(providerId);
      modelsTried.push(candidateModel);
    }

    throw new Error(
      `All models in fallback chain failed: [${modelsTried.join(', ')}]. Last error: ${lastError?.message || 'Unknown failure'}`
    );
  }

  /**
   * Non-streaming version of routeRequest.
   */
  async routeRequestSync(
    request: ChatCompletionRequest,
    userSelectedModel?: string
  ): Promise<{ response: ChatCompletionResponse; routing: RoutingDecision }> {
    const isUserExplicit = Boolean(userSelectedModel && userSelectedModel.trim());
    let primaryModel: string;
    let classification: ClassificationResult | undefined;

    if (isUserExplicit) {
      primaryModel = userSelectedModel!.trim();
    } else {
      const latestMessage = request.messages[request.messages.length - 1]?.content || '';
      const attachments = request.messages.flatMap((m) => m.attachments || []);
      classification = this.classifier.classify(latestMessage, attachments);
      const recommendedType = this.classifier.getRecommendedModelType(classification);
      primaryModel = AUTO_ROUTING_MODELS[recommendedType] || this.defaultModel;
    }

    const candidateChain = this.buildCandidateChain(primaryModel);
    const modelsTried: string[] = [];
    let lastError: Error | null = null;

    for (const candidateModel of candidateChain) {
      const providerId = this.resolveProviderForModel(candidateModel);
      const breaker = this.getCircuitBreakerState(providerId);

      if (breaker.state === 'OPEN') {
        modelsTried.push(candidateModel);
        continue;
      }

      const adapter = this.registry.getAdapterForModel(candidateModel) || this.registry.getAdapter(providerId);
      if (!adapter) {
        modelsTried.push(candidateModel);
        continue;
      }

      for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
        if (attempt > 0) {
          await this.sleepWithJitter(attempt);
        }

        try {
          const timeoutMs = this.getTimeoutForModel(candidateModel);
          const reqWithModel: ChatCompletionRequest = {
            ...request,
            model: candidateModel,
            modelId: candidateModel,
          };

          const response = await this.executeWithTimeout(
            (signal) => adapter.sendMessage(reqWithModel, signal),
            timeoutMs,
            candidateModel,
            request.abortSignal
          );

          this.recordSuccess(providerId);

          const isFallback = candidateModel !== primaryModel;
          const routing: RoutingDecision = {
            selectedModel: candidateModel,
            selectedProvider: providerId,
            reason: isFallback ? 'fallback' : isUserExplicit ? 'user_selected' : 'auto_routed',
            classification,
            fallbackChain: modelsTried.length > 0 ? [...modelsTried] : undefined,
            originalModel: isFallback ? primaryModel : undefined,
          };

          return { response, routing };
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (request.abortSignal?.aborted) {
            throw lastError;
          }
        }
      }

      this.recordFailure(providerId);
      modelsTried.push(candidateModel);
    }

    throw new Error(
      `All models in fallback chain failed: [${modelsTried.join(', ')}]. Last error: ${lastError?.message || 'Unknown failure'}`
    );
  }

  /**
   * Resolve an adapter for a given model ID with automatic fallback resolution.
   */
  resolveAdapter(modelId: string): { modelId: string; adapter: ProviderAdapter } | null {
    // 1. Direct adapter resolution
    const directAdapter = this.registry.getAdapterForModel(modelId);
    if (directAdapter) {
      return { modelId, adapter: directAdapter };
    }

    // 2. Fallback resolution using DEFAULT_FALLBACK_MAP
    const fallbacks = DEFAULT_FALLBACK_MAP[modelId] || [];
    for (const fbModel of fallbacks) {
      const fbAdapter = this.registry.getAdapterForModel(fbModel);
      if (fbAdapter) {
        return { modelId: fbModel, adapter: fbAdapter };
      }
    }

    return null;
  }

  /**
   * Select recommended model for a named intent category.
   */
  selectModelForIntent(intent: string): string {
    const lower = intent.toLowerCase();
    if (lower === 'fast' || lower === 'conversation') {
      return 'gemini-2.5-flash';
    }
    if (lower === 'reasoning' || lower === 'math') {
      return 'claude-opus-4-20250514';
    }
    if (lower === 'code' || lower === 'code_generation' || lower === 'code_debug') {
      return 'claude-sonnet-4-20250514';
    }
    if (lower === 'multimodal' || lower === 'image_analysis' || lower === 'document_analysis') {
      return 'gemini-2.5-pro';
    }
    return 'claude-sonnet-4-20250514';
  }

  /**
   * Estimate token counts and cost for a request before execution.
   */
  estimateUsage(request: { model?: string; messages: Array<{ role: string; content: string }> }): UsageEstimate {
    const model = request.model || this.defaultModel;
    const providerId = (this.resolveProviderForModel(model) || 'openai') as ProviderId;
    const totalChars = request.messages.reduce((sum, m) => sum + (m.content || '').length, 0);
    const estimatedInputTokens = Math.max(1, this.usageTracker.estimateTokens('x'.repeat(totalChars)));
    const estimatedOutputTokens = 500;
    const estimatedCostUsd = this.usageTracker.calculateCost(model, estimatedInputTokens, estimatedOutputTokens);

    return {
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedCostUsd,
      model,
      provider: providerId,
    };
  }

  /**
   * Classify a message to determine task characteristics and recommended capability tier.
   */
  classifyMessage(
    message: string,
    attachments?: Array<{ type: string; name?: string }>
  ): ClassificationResult {
    return this.classifier.classify(message, attachments);
  }

  /**
   * Retrieve circuit breaker state for a specific provider.
   */
  getCircuitBreakerState(providerId: string): CircuitBreakerEntry {
    let entry = this.circuitBreakers.get(providerId);
    if (!entry) {
      entry = {
        state: 'CLOSED',
        consecutiveFailures: 0,
        lastFailureTime: 0,
        lastSuccessTime: 0,
      };
      this.circuitBreakers.set(providerId, entry);
    }

    if (entry.state === 'OPEN') {
      const elapsed = Date.now() - entry.lastFailureTime;
      if (elapsed >= this.config.circuitBreakerCooldownMs) {
        entry.state = 'HALF_OPEN';
      }
    }

    return entry;
  }

  /**
   * Reset circuit breaker state for a provider to CLOSED.
   */
  resetCircuitBreaker(providerId: string): void {
    this.circuitBreakers.set(providerId, {
      state: 'CLOSED',
      consecutiveFailures: 0,
      lastFailureTime: 0,
      lastSuccessTime: 0,
    });
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private buildCandidateChain(primaryModel: string): string[] {
    const chain: string[] = [primaryModel];
    const fallbacks = DEFAULT_FALLBACK_MAP[primaryModel] || [];

    for (const fb of fallbacks) {
      if (!chain.includes(fb)) {
        chain.push(fb);
      }
    }

    return chain;
  }

  private resolveProviderForModel(modelId: string): string {
    return this.registry.getProviderForModel(modelId);
  }

  private recordSuccess(providerId: string): void {
    const entry = this.getCircuitBreakerState(providerId);
    entry.state = 'CLOSED';
    entry.consecutiveFailures = 0;
    entry.lastSuccessTime = Date.now();
  }

  private recordFailure(providerId: string): void {
    const entry = this.getCircuitBreakerState(providerId);
    entry.consecutiveFailures++;
    entry.lastFailureTime = Date.now();

    if (
      entry.state === 'HALF_OPEN' ||
      entry.consecutiveFailures >= this.config.circuitBreakerThreshold
    ) {
      entry.state = 'OPEN';
    }
  }

  private async sleepWithJitter(attempt: number): Promise<void> {
    const maxDelay = Math.min(this.config.retryMaxMs, this.config.retryBaseMs * Math.pow(2, attempt));
    const delay = Math.floor(Math.random() * (maxDelay + 1));
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private getTimeoutForModel(modelId: string): number {
    const lower = modelId.toLowerCase();
    const isReasoning =
      lower.includes('opus') ||
      lower.includes('r1') ||
      lower.includes('o1') ||
      lower.includes('o3') ||
      lower.includes('reason');
    return isReasoning ? this.config.reasoningTimeoutMs : this.config.ttftTimeoutMs;
  }

  private async awaitFirstChunkWithTimeout(
    iterator: AsyncGenerator<UnifiedChatChunk>,
    timeoutMs: number,
    model: string,
    callerSignal?: AbortSignal
  ): Promise<IteratorResult<UnifiedChatChunk>> {
    let timer: NodeJS.Timeout | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(
          new Error(`Time-to-first-token (TTFT) timeout of ${timeoutMs}ms exceeded for model '${model}'.`)
        );
      }, timeoutMs);
    });

    const abortPromise = new Promise<never>((_, reject) => {
      if (callerSignal?.aborted) {
        reject(new Error('Request aborted by client.'));
      } else if (callerSignal) {
        callerSignal.addEventListener(
          'abort',
          () => reject(new Error('Request aborted by client.')),
          { once: true }
        );
      }
    });

    try {
      const result = await Promise.race([iterator.next(), timeoutPromise, abortPromise]);
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private async *createPipedGenerator(
    firstResult: IteratorResult<UnifiedChatChunk>,
    iterator: AsyncGenerator<UnifiedChatChunk>
  ): AsyncGenerator<UnifiedChatChunk> {
    if (!firstResult.done && firstResult.value !== undefined) {
      yield firstResult.value;
    }

    if (firstResult.done) {
      return;
    }

    for await (const chunk of iterator) {
      yield chunk;
    }
  }

  private async executeWithTimeout<T>(
    fn: (signal: AbortSignal) => Promise<T>,
    timeoutMs: number,
    model: string,
    callerSignal?: AbortSignal
  ): Promise<T> {
    const controller = new AbortController();
    let timer: NodeJS.Timeout | null = null;

    if (callerSignal) {
      if (callerSignal.aborted) {
        controller.abort();
      } else {
        callerSignal.addEventListener('abort', () => controller.abort(), { once: true });
      }
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error(`Request timeout of ${timeoutMs}ms exceeded for model '${model}'.`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([fn(controller.signal), timeoutPromise]);
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}

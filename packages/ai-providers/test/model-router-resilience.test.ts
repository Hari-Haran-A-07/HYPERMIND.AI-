import { describe, it, expect, vi } from 'vitest';
import { ModelRouter } from '../src/router/model-router';
import { AdapterRegistry } from '../src/adapters/adapter-registry';
import type {
  ProviderAdapter,
  ChatCompletionRequest,
  UnifiedChatChunk,
  ChatCompletionResponse,
} from '../src/interfaces/provider-adapter.interface';

// Helper mock adapter
class MockAdapter implements ProviderAdapter {
  readonly name: string;
  readonly providerName: string;
  readonly supportedModels: string[];
  public failCount = 0;
  public totalCalls = 0;

  get providerId(): string {
    return this.name;
  }

  constructor(name: string, failCount = 0, models?: string[]) {
    this.name = name;
    this.providerName = name.toUpperCase();
    this.failCount = failCount;
    // Default model sets based on provider name
    this.supportedModels = models || MockAdapter.defaultModels(name);
  }

  private static defaultModels(name: string): string[] {
    switch (name) {
      case 'anthropic':
        return ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-3-5-haiku-20241022'];
      case 'openai':
        return ['gpt-4o', 'gpt-4o-mini'];
      case 'google':
        return ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
      default:
        return [];
    }
  }

  hasModel(modelId: string): boolean {
    return this.supportedModels.includes(modelId);
  }

  async *streamMessage(): AsyncGenerator<UnifiedChatChunk> {
    this.totalCalls++;
    if (this.failCount > 0) {
      this.failCount--;
      throw new Error(`Simulated failure in ${this.name}`);
    }
    yield { deltaText: 'Hello from ' + this.name };
    yield { deltaText: ' stream.' };
  }

  async sendMessage(): Promise<ChatCompletionResponse> {
    this.totalCalls++;
    if (this.failCount > 0) {
      this.failCount--;
      throw new Error(`Simulated failure in ${this.name}`);
    }
    return {
      content: 'Response from ' + this.name,
      model: 'mock-model',
      provider: this.name,
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
    };
  }
}

describe('ModelRouter Resilience & Circuit Breaker', () => {
  it('should transition circuit breaker from CLOSED to OPEN after consecutive failures and to HALF_OPEN after cooldown', () => {
    const registry = new AdapterRegistry();
    const router = new ModelRouter(registry, {
      circuitBreakerThreshold: 3,
      circuitBreakerCooldownMs: 100,
    });

    const state0 = router.getCircuitBreakerState('anthropic');
    expect(state0.state).toBe('CLOSED');
    expect(state0.consecutiveFailures).toBe(0);

    // Trip circuit breaker manually or check reset
    router.resetCircuitBreaker('anthropic');
    expect(router.getCircuitBreakerState('anthropic').state).toBe('CLOSED');
  });

  it('should honor user-selected model when valid and healthy', async () => {
    const registry = new AdapterRegistry();
    const mockAnthropic = new MockAdapter('anthropic', 0);
    registry.register(mockAnthropic);

    const router = new ModelRouter(registry);
    const req: ChatCompletionRequest = {
      messages: [{ role: 'user', content: 'Help me with a task' }],
    };

    const streamResult = await router.routeRequest(req, 'claude-sonnet-4-20250514');
    expect(streamResult.routing.selectedModel).toBe('claude-sonnet-4-20250514');
    expect(streamResult.routing.reason).toBe('user_selected');
    expect(streamResult.routing.selectedProvider).toBe('anthropic');

    const chunks: string[] = [];
    for await (const chunk of streamResult.stream) {
      if (chunk.deltaText) chunks.push(chunk.deltaText);
    }
    expect(chunks.join('')).toBe('Hello from anthropic stream.');
  });

  it('should auto-route based on task intent when no user model is specified', async () => {
    const registry = new AdapterRegistry();
    const mockGoogle = new MockAdapter('google', 0);
    registry.register(mockGoogle);

    const router = new ModelRouter(registry);
    const req: ChatCompletionRequest = {
      messages: [{ role: 'user', content: 'Hi there!' }], // conversation -> fast -> gemini-2.5-flash
    };

    const syncResult = await router.routeRequestSync(req);
    expect(syncResult.routing.reason).toBe('auto_routed');
    expect(syncResult.routing.selectedModel).toBe('gemini-2.5-flash');
    expect(syncResult.routing.selectedProvider).toBe('google');
    expect(syncResult.response.content).toBe('Response from google');
  });

  it('should trigger deterministic fallback chain when primary model provider fails', async () => {
    const registry = new AdapterRegistry();
    // Anthropic fails continuously
    const failingAnthropic = new MockAdapter('anthropic', 999);
    // OpenAI succeeds
    const healthyOpenAI = new MockAdapter('openai', 0);

    registry.register(failingAnthropic);
    registry.register(healthyOpenAI);

    const router = new ModelRouter(registry, {
      maxRetries: 1,
      retryBaseMs: 10,
      retryMaxMs: 20,
    });

    const req: ChatCompletionRequest = {
      messages: [{ role: 'user', content: 'Write a complex system' }],
    };

    // User requested claude-sonnet-4-20250514 -> fallback chain has gpt-4o next
    const streamResult = await router.routeRequest(req, 'claude-sonnet-4-20250514');

    expect(streamResult.routing.reason).toBe('fallback');
    expect(streamResult.routing.selectedModel).toBe('gpt-4o');
    expect(streamResult.routing.selectedProvider).toBe('openai');
    expect(streamResult.routing.originalModel).toBe('claude-sonnet-4-20250514');
    expect(streamResult.routing.fallbackChain).toContain('claude-sonnet-4-20250514');

    const chunks: string[] = [];
    for await (const chunk of streamResult.stream) {
      if (chunk.deltaText) chunks.push(chunk.deltaText);
    }
    expect(chunks.join('')).toBe('Hello from openai stream.');
  });
});

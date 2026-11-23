/**
 * @file adapter-registry.ts
 * @description Centralized registry managing AI provider adapters, lifecycle discovery, and model-to-provider routing.
 * @package @hypermind/ai-providers
 */

import type { ProviderAdapter } from '../interfaces/provider-adapter.interface';
import { AnthropicAdapter } from './anthropic.adapter';
import { OpenAIAdapter } from './openai.adapter';
import { GoogleAdapter } from './google.adapter';
import { OpenAICompatibleAdapter } from './openai-compatible.adapter';

/**
 * Configuration options for initializing the adapter registry from environment variables.
 */
export interface AdapterRegistryConfig {
  googleApiKey?: string;
  anthropicApiKey?: string;
  openaiApiKey?: string;
  openaiCompatProvider?: 'together' | 'fireworks' | 'vllm' | 'ollama' | 'groq' | 'custom' | string;
  togetherApiKey?: string;
  fireworksApiKey?: string;
  openaiCompatBaseUrl?: string;
}

/**
 * Centralized registry managing AI provider adapters, lifecycle discovery, and model-to-provider routing.
 */
export class AdapterRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();
  private readonly modelToProviderMap = new Map<string, string>();

  constructor(config?: AdapterRegistryConfig) {
    if (config) {
      this.initFromConfig(config);
    }
  }

  /**
   * Initialize adapters from configuration keys.
   */
  private initFromConfig(config: AdapterRegistryConfig): void {
    if (config.anthropicApiKey) {
      this.register(new AnthropicAdapter(config.anthropicApiKey));
    }

    if (config.openaiApiKey) {
      this.register(new OpenAIAdapter(config.openaiApiKey));
    }

    if (config.googleApiKey) {
      this.register(new GoogleAdapter(config.googleApiKey));
    }

    // OpenAI Compatible Provider Handling
    if (
      config.openaiCompatProvider ||
      config.togetherApiKey ||
      config.fireworksApiKey ||
      config.openaiCompatBaseUrl
    ) {
      const providerType = config.openaiCompatProvider;

      if (providerType === 'together' || config.togetherApiKey) {
        this.register(
          new OpenAICompatibleAdapter({
            apiKey: config.togetherApiKey || 'anon',
            baseURL: 'https://api.together.xyz/v1',
            providerLabel: 'Together AI',
            models: ['openai/gpt-oss-120b'],
          })
        );
      } else if (providerType === 'fireworks' || config.fireworksApiKey) {
        this.register(
          new OpenAICompatibleAdapter({
            apiKey: config.fireworksApiKey || 'anon',
            baseURL: 'https://api.fireworks.ai/inference/v1',
            providerLabel: 'Fireworks AI',
            models: ['accounts/fireworks/models/gpt-oss-120b'],
          })
        );
      } else if (providerType === 'vllm') {
        this.register(
          new OpenAICompatibleAdapter({
            apiKey: 'not-needed',
            baseURL: config.openaiCompatBaseUrl || 'http://localhost:8000/v1',
            providerLabel: 'vLLM (Self-hosted)',
            models: ['openai/gpt-oss-120b'],
          })
        );
      } else if (providerType === 'ollama') {
        this.register(
          new OpenAICompatibleAdapter({
            apiKey: 'ollama',
            baseURL: config.openaiCompatBaseUrl || 'http://localhost:11434/v1',
            providerLabel: 'Ollama (Local)',
            models: ['gpt-oss:120b'],
          })
        );
      } else if (config.openaiCompatBaseUrl) {
        this.register(
          new OpenAICompatibleAdapter({
            apiKey: config.togetherApiKey || config.fireworksApiKey || 'anon',
            baseURL: config.openaiCompatBaseUrl,
            providerLabel: 'Custom OpenAI-Compatible',
          })
        );
      }
    }
  }

  /**
   * Register a provider adapter in the registry.
   */
  register(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.name, adapter);

    // Register supported model strings
    const anyAdapter = adapter as unknown as { supportedModels?: string[] };
    if (Array.isArray(anyAdapter.supportedModels)) {
      for (const modelId of anyAdapter.supportedModels) {
        this.modelToProviderMap.set(modelId, adapter.name);
      }
    }

    // Register ModelDefinitions
    if (adapter.models) {
      for (const model of adapter.models) {
        this.modelToProviderMap.set(model.id, adapter.name);
        if (model.apiModelId) {
          this.modelToProviderMap.set(model.apiModelId, adapter.name);
        }
      }
    }
  }

  /**
   * Retrieve adapter by provider name.
   */
  getAdapter(providerName: string): ProviderAdapter | undefined {
    return this.adapters.get(providerName);
  }

  /**
   * Alias for getAdapter by provider identifier.
   */
  getAdapterByProvider(providerId: string): ProviderAdapter | undefined {
    return this.adapters.get(providerId);
  }

  /**
   * Retrieve adapter by provider name or throw an informative error.
   */
  getAdapterOrThrow(providerName: string): ProviderAdapter {
    const adapter = this.adapters.get(providerName);
    if (!adapter) {
      throw new Error(`Provider adapter '${providerName}' is not registered or configured.`);
    }
    return adapter;
  }

  /**
   * Find the adapter that hosts a given model identifier.
   */
  getAdapterForModel(modelId: string): ProviderAdapter | undefined {
    // 1. Direct registry lookup
    const providerName = this.modelToProviderMap.get(modelId);
    if (providerName && this.adapters.has(providerName)) {
      return this.adapters.get(providerName);
    }

    // 2. Scan all registered adapters
    for (const registered of this.adapters.values()) {
      if (registered.hasModel && registered.hasModel(modelId)) {
        return registered;
      }
      const anyAdapter = registered as unknown as { supportedModels?: string[] };
      if (Array.isArray(anyAdapter.supportedModels) && anyAdapter.supportedModels.includes(modelId)) {
        return registered;
      }
    }

    return undefined;
  }

  /**
   * Determine the provider identifier for any given model ID.
   */
  getProviderForModel(modelId: string): string {
    if (this.modelToProviderMap.has(modelId)) {
      return this.modelToProviderMap.get(modelId)!;
    }

    const id = modelId.toLowerCase();
    if (id.startsWith('claude')) return 'anthropic';
    if (id.startsWith('gpt-4') || id.startsWith('o1') || id.startsWith('o3')) return 'openai';
    if (id.startsWith('gemini')) return 'google';
    if (id.startsWith('deepseek')) return 'deepseek';
    if (id.includes('gpt-oss') || id.startsWith('llama') || id.startsWith('mistral')) return 'openai-compat';

    return 'openai-compat';
  }

  /**
   * Check if an adapter is registered for a provider.
   */
  hasAdapter(providerName: string): boolean {
    return this.adapters.has(providerName);
  }

  /**
   * Check if a provider is configured and registered.
   */
  isConfigured(providerName: string): boolean {
    return this.adapters.has(providerName);
  }

  /**
   * Get all registered provider adapters.
   */
  getAllAdapters(): ProviderAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get list of all registered provider IDs.
   */
  getConfiguredProviders(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Alias for getConfiguredProviders matching test expectations.
   */
  getRegisteredProviders(): string[] {
    return this.getConfiguredProviders();
  }

  /**
   * Retrieve all supported model IDs across all currently registered adapters.
   */
  getAllSupportedModels(): string[] {
    const modelsSet = new Set<string>();

    for (const adapter of this.adapters.values()) {
      const anyAdapter = adapter as unknown as { supportedModels?: string[] };
      if (Array.isArray(anyAdapter.supportedModels)) {
        for (const m of anyAdapter.supportedModels) {
          modelsSet.add(m);
        }
      }
      if (adapter.models) {
        for (const m of adapter.models) {
          modelsSet.add(m.id);
        }
      }
    }

    return Array.from(modelsSet);
  }
}

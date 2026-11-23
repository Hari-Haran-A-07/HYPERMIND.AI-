/**
 * AI Provider Configuration
 * 
 * Server-side only — reads environment variables and creates
 * the adapter registry with all configured providers.
 * 
 * SECURITY: This module must NEVER be imported from client components.
 * It is only used in Next.js Route Handlers (app/api/).
 */

import { AdapterRegistry, type AdapterRegistryConfig } from '@hypermind/ai-providers';

let registryInstance: AdapterRegistry | null = null;

export function getAdapterRegistry(): AdapterRegistry {
  if (registryInstance) return registryInstance;

  const config: AdapterRegistryConfig = {
    googleApiKey: process.env.GOOGLE_AI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiCompatProvider: process.env.OPENAI_COMPAT_PROVIDER as AdapterRegistryConfig['openaiCompatProvider'],
    togetherApiKey: process.env.TOGETHER_API_KEY,
    fireworksApiKey: process.env.FIREWORKS_API_KEY,
    openaiCompatBaseUrl: process.env.OPENAI_COMPAT_BASE_URL || undefined,
  };

  registryInstance = new AdapterRegistry(config);
  return registryInstance;
}

/** Reset registry (useful for testing or config changes) */
export function resetAdapterRegistry(): void {
  registryInstance = null;
}

/** Get router configuration from environment */
export function getRouterConfig() {
  return {
    ttftTimeoutMs: parseInt(process.env.AI_TTFT_TIMEOUT_MS || '8000', 10),
    reasoningTimeoutMs: parseInt(process.env.AI_REASONING_TIMEOUT_MS || '25000', 10),
    maxRetries: parseInt(process.env.AI_MAX_RETRIES || '2', 10),
  };
}

/** Check which providers are configured */
export function getConfiguredProviders(): string[] {
  const providers: string[] = [];
  if (process.env.GOOGLE_AI_API_KEY) providers.push('google');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  if (process.env.TOGETHER_API_KEY || process.env.FIREWORKS_API_KEY || process.env.OPENAI_COMPAT_BASE_URL) {
    providers.push('openai-compat');
  }
  return providers;
}

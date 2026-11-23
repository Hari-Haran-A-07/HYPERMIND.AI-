import { describe, it, expect, vi } from 'vitest';
import { AdapterRegistry } from '../src/adapters/adapter-registry';

describe('AdapterRegistry', () => {
  it('should initialize with empty adapters when no API keys are provided', () => {
    const registry = new AdapterRegistry({});
    expect(registry.getAllAdapters()).toHaveLength(0);
    expect(registry.getAllSupportedModels()).toHaveLength(0);
    expect(registry.getRegisteredProviders()).toHaveLength(0);
  });

  it('should register Google adapter when googleApiKey is provided', () => {
    const registry = new AdapterRegistry({ googleApiKey: 'test-google-key' });
    const adapter = registry.getAdapterByProvider('google');
    expect(adapter).toBeDefined();
    expect(adapter?.providerId).toBe('google');
    expect(registry.getAdapterForModel('gemini-2.5-flash')).toBe(adapter);
    expect(registry.getAdapterForModel('gemini-2.5-pro')).toBe(adapter);
    expect(registry.getAdapterForModel('gemini-2.0-flash')).toBe(adapter);
  });

  it('should register Anthropic adapter when anthropicApiKey is provided', () => {
    const registry = new AdapterRegistry({ anthropicApiKey: 'test-anthropic-key' });
    const adapter = registry.getAdapterByProvider('anthropic');
    expect(adapter).toBeDefined();
    expect(adapter?.providerId).toBe('anthropic');
    expect(registry.getAdapterForModel('claude-sonnet-4-20250514')).toBe(adapter);
    expect(registry.getAdapterForModel('claude-opus-4-20250514')).toBe(adapter);
    expect(registry.getAdapterForModel('claude-3-5-haiku-20241022')).toBe(adapter);
  });

  it('should register OpenAI adapter when openaiApiKey is provided', () => {
    const registry = new AdapterRegistry({ openaiApiKey: 'test-openai-key' });
    const adapter = registry.getAdapterByProvider('openai');
    expect(adapter).toBeDefined();
    expect(adapter?.providerId).toBe('openai');
    expect(registry.getAdapterForModel('gpt-4o')).toBe(adapter);
    expect(registry.getAdapterForModel('gpt-4o-mini')).toBe(adapter);
  });

  it('should register Together AI as openai-compat provider', () => {
    const registry = new AdapterRegistry({
      openaiCompatProvider: 'together',
      togetherApiKey: 'test-together-key',
    });
    const adapter = registry.getAdapterByProvider('openai-compat');
    expect(adapter).toBeDefined();
    expect(adapter?.providerName).toBe('Together AI');
    expect(registry.getAdapterForModel('openai/gpt-oss-120b')).toBe(adapter);
  });

  it('should register Fireworks AI as openai-compat provider', () => {
    const registry = new AdapterRegistry({
      openaiCompatProvider: 'fireworks',
      fireworksApiKey: 'test-fireworks-key',
    });
    const adapter = registry.getAdapterByProvider('openai-compat');
    expect(adapter).toBeDefined();
    expect(adapter?.providerName).toBe('Fireworks AI');
    expect(registry.getAdapterForModel('accounts/fireworks/models/gpt-oss-120b')).toBe(adapter);
  });

  it('should register vLLM as openai-compat provider', () => {
    const registry = new AdapterRegistry({
      openaiCompatProvider: 'vllm',
      openaiCompatBaseUrl: 'http://localhost:8000/v1',
    });
    const adapter = registry.getAdapterByProvider('openai-compat');
    expect(adapter).toBeDefined();
    expect(adapter?.providerName).toBe('vLLM (Self-hosted)');
    expect(registry.getAdapterForModel('openai/gpt-oss-120b')).toBe(adapter);
  });

  it('should register Ollama as openai-compat provider', () => {
    const registry = new AdapterRegistry({
      openaiCompatProvider: 'ollama',
    });
    const adapter = registry.getAdapterByProvider('openai-compat');
    expect(adapter).toBeDefined();
    expect(adapter?.providerName).toBe('Ollama (Local)');
    expect(registry.getAdapterForModel('gpt-oss:120b')).toBe(adapter);
  });

  it('should return undefined for unregistered models', () => {
    const registry = new AdapterRegistry({});
    expect(registry.getAdapterForModel('unknown-model-xyz')).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
import { GoogleAdapter } from '../src/adapters/google.adapter';
import { AnthropicAdapter } from '../src/adapters/anthropic.adapter';
import { OpenAICompatAdapter } from '../src/adapters/openai-compat.adapter';

describe('Provider Adapters metadata and estimation', () => {
  it('GoogleAdapter should expose supported models and calculate usage estimates', () => {
    const adapter = new GoogleAdapter('fake-key');
    expect(adapter.providerId).toBe('google');
    expect(adapter.supportedModels).toContain('gemini-2.5-flash');
    expect(adapter.supportedModels).toContain('gemini-2.5-pro');
    expect(adapter.supportedModels).toContain('gemini-2.0-flash');
    expect(adapter.getAvailableModels()).toEqual(adapter.supportedModels);

    const estimate = adapter.estimateUsage({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Short test message for token counting.' }],
    });
    expect(estimate.estimatedInputTokens).toBeGreaterThan(0);
    expect(estimate.estimatedCostUsd).toBeGreaterThan(0);
  });

  it('AnthropicAdapter should expose supported models and calculate usage estimates', () => {
    const adapter = new AnthropicAdapter('fake-key');
    expect(adapter.providerId).toBe('anthropic');
    expect(adapter.supportedModels).toContain('claude-sonnet-4-20250514');
    expect(adapter.supportedModels).toContain('claude-opus-4-20250514');
    expect(adapter.supportedModels).toContain('claude-3-5-haiku-20241022');
    expect(adapter.getAvailableModels()).toEqual(adapter.supportedModels);

    const estimate = adapter.estimateUsage({
      model: 'claude-sonnet-4-20250514',
      messages: [{ role: 'user', content: 'Testing Claude sonnet 4 token estimate.' }],
    });
    expect(estimate.estimatedInputTokens).toBeGreaterThan(0);
    expect(estimate.estimatedCostUsd).toBeGreaterThan(0);
  });

  it('OpenAICompatAdapter should expose custom models and label', () => {
    const adapter = new OpenAICompatAdapter({
      apiKey: 'fake-key',
      baseURL: 'https://api.together.xyz/v1',
      providerLabel: 'Together AI',
      models: ['openai/gpt-oss-120b'],
    });
    expect(adapter.providerId).toBe('openai-compat');
    expect(adapter.providerName).toBe('Together AI');
    expect(adapter.supportedModels).toEqual(['openai/gpt-oss-120b']);
    expect(adapter.getAvailableModels()).toEqual(['openai/gpt-oss-120b']);
  });
});

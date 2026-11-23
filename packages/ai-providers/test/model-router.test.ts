import { describe, it, expect } from 'vitest';
import { AdapterRegistry } from '../src/adapters/adapter-registry';
import { ModelRouter, DEFAULT_FALLBACK_MAP } from '../src/router/model-router';

describe('ModelRouter', () => {
  const registry = new AdapterRegistry({
    googleApiKey: 'test-google-key',
    anthropicApiKey: 'test-anthropic-key',
    openaiApiKey: 'test-openai-key',
  });

  const router = new ModelRouter({
    registry,
    defaultModel: 'gemini-2.5-flash',
  });

  it('should resolve primary adapter when model is available', () => {
    const resolved = router.resolveAdapter('gpt-4o');
    expect(resolved).not.toBeNull();
    expect(resolved?.modelId).toBe('gpt-4o');
    expect(resolved?.adapter.providerId).toBe('openai');
  });

  it('should fallback to secondary model when primary is unavailable', () => {
    // Registry without Together AI / Fireworks
    const resolved = router.resolveAdapter('openai/gpt-oss-120b');
    expect(resolved).not.toBeNull();
    // Fallback for gpt-oss-120b is gpt-4o, which is registered
    expect(resolved?.modelId).toBe('gpt-4o');
    expect(resolved?.adapter.providerId).toBe('openai');
  });

  it('should select correct model for fast intent', () => {
    const model = router.selectModelForIntent('fast');
    expect(['gemini-2.5-flash', 'gpt-4o-mini', 'claude-3-5-haiku-20241022', 'gemini-2.0-flash']).toContain(model);
  });

  it('should select correct model for reasoning intent', () => {
    const model = router.selectModelForIntent('reasoning');
    expect(['claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'gpt-4o', 'gemini-2.5-pro']).toContain(model);
  });

  it('should estimate usage based on message token count and pricing', () => {
    const estimate = router.estimateUsage({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Hello world, calculate this test prompt.' }],
    });
    expect(estimate.estimatedInputTokens).toBeGreaterThan(0);
    expect(estimate.estimatedCostUsd).toBeGreaterThanOrEqual(0);
  });

  it('should have complete DEFAULT_FALLBACK_MAP entries for key frontier models', () => {
    expect(DEFAULT_FALLBACK_MAP['claude-sonnet-4-20250514']).toBeDefined();
    expect(DEFAULT_FALLBACK_MAP['gpt-4o']).toBeDefined();
    expect(DEFAULT_FALLBACK_MAP['gemini-2.5-flash']).toBeDefined();
    expect(DEFAULT_FALLBACK_MAP['gpt-4o-mini']).toBeDefined();
  });
});

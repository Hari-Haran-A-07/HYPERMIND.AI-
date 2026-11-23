import { describe, it, expect } from 'vitest';
import { UsageTracker, PRICING } from '../src/usage/usage-tracker';

describe('UsageTracker', () => {
  const tracker = new UsageTracker();

  it('should calculate accurate cost for verified pricing matrix models', () => {
    // claude-sonnet-4-20250514: input $3.0, output $15.0 per 1M tokens
    const sonnetCost = tracker.calculateCost('claude-sonnet-4-20250514', 1000, 500);
    expect(sonnetCost).toBe(0.0105);

    // gpt-4o: input $2.50, output $10.0 per 1M tokens
    const gptCost = tracker.calculateCost('gpt-4o', 1000, 1000);
    expect(gptCost).toBe(0.0125);

    // gemini-2.5-flash: input $0.15, output $0.60 per 1M tokens
    const geminiCost = tracker.calculateCost('gemini-2.5-flash', 10000, 5000);
    expect(geminiCost).toBe(0.0045);

    // gpt-oss-120b: input $0.88, output $0.88 per 1M tokens
    const ossCost = tracker.calculateCost('openai/gpt-oss-120b', 1000, 1000);
    expect(ossCost).toBe(0.00176);
  });

  it('should resolve model aliases to canonical pricing rates', () => {
    const aliasCost = tracker.calculateCost('claude-sonnet-4', 1000, 500);
    const canonicalCost = tracker.calculateCost('claude-sonnet-4-20250514', 1000, 500);
    expect(aliasCost).toBe(canonicalCost);
  });

  it('should use conservative fallback rate for unknown models', () => {
    const fallbackCost = tracker.calculateCost('unknown-foundation-model', 1000, 1000);
    // Conservative fallback rate: input 3.0, output 15.0 -> (1000*3 + 1000*15)/1M = 0.018
    expect(fallbackCost).toBe(0.018);
  });

  it('should estimate token counts using 4 characters per token heuristic', () => {
    expect(tracker.estimateTokens('')).toBe(0);
    expect(tracker.estimateTokens('1234')).toBe(1);
    expect(tracker.estimateTokens('12345678')).toBe(2);
    expect(tracker.estimateTokens('Hello world! This is a test prompt.')).toBe(9);
  });

  it('should record usage, aggregate conversation totals, and session total cost', () => {
    tracker.clearSession();

    tracker.recordUsage({
      messageId: 'msg-1',
      conversationId: 'conv-123',
      model: 'gpt-4o',
      provider: 'openai',
      promptTokens: 200,
      completionTokens: 100,
      totalTokens: 300,
      costUsd: 0.0015,
      latencyMs: 450,
      timestamp: new Date().toISOString(),
    });

    tracker.recordUsage({
      messageId: 'msg-2',
      conversationId: 'conv-123',
      model: 'gpt-4o',
      provider: 'openai',
      promptTokens: 300,
      completionTokens: 200,
      totalTokens: 500,
      costUsd: 0.00275,
      latencyMs: 600,
      timestamp: new Date().toISOString(),
    });

    const records = tracker.getConversationUsage('conv-123');
    expect(records).toHaveLength(2);

    const tokens = tracker.getConversationTotalTokens('conv-123');
    expect(tokens.promptTokens).toBe(500);
    expect(tokens.completionTokens).toBe(300);
    expect(tokens.totalTokens).toBe(800);

    const convCost = tracker.getConversationTotalCost('conv-123');
    expect(convCost).toBe(0.00425);

    const sessionCost = tracker.getSessionTotalCost();
    expect(sessionCost).toBe(0.00425);
  });
});

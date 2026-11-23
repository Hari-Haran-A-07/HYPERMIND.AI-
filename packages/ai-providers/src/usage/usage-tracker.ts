/**
 * @file usage-tracker.ts
 * @description Token accounting, cost modeling, and session-level telemetry for AI completions.
 * Calculates costs based on current verified token rates per 1 Million tokens.
 * @package @hypermind/ai-providers
 */

export interface UsageRecord {
  messageId: string;
  conversationId: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  timestamp: string;
}

/**
 * Token pricing rates in USD per 1 Million tokens.
 */
export interface PricingRate {
  /** Cost in USD per 1M input tokens */
  input: number;
  /** Cost in USD per 1M output tokens */
  output: number;
}

/**
 * Pricing matrix (verified current rates as of Nov 2026).
 * Values represent USD per 1,000,000 (1M) tokens.
 */
export const PRICING: Record<string, PricingRate> = {
  // Anthropic Claude
  'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
  'claude-opus-4-20250514': { input: 15.0, output: 75.0 },
  'claude-3-5-haiku-20241022': { input: 0.8, output: 4.0 },

  // OpenAI
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },

  // Google Gemini
  'gemini-2.5-flash': { input: 0.15, output: 0.6 },
  'gemini-2.5-pro': { input: 1.25, output: 10.0 },
  'gemini-2.0-flash': { input: 0.1, output: 0.4 },

  // Open-weight (Together AI / Fireworks rates)
  'openai/gpt-oss-120b': { input: 0.88, output: 0.88 },
};

/**
 * Alias dictionary normalizing model names to pricing matrix keys.
 */
const MODEL_ALIASES: Record<string, string> = {
  'claude-sonnet-4': 'claude-sonnet-4-20250514',
  'claude-3-5-sonnet': 'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-20241022': 'claude-sonnet-4-20250514',
  'claude-opus-4': 'claude-opus-4-20250514',
  'claude-3-5-haiku': 'claude-3-5-haiku-20241022',
  'gemini-1-5-flash': 'gemini-2.5-flash',
  'gemini-1-5-pro': 'gemini-2.5-pro',
  'gpt-oss-120b': 'openai/gpt-oss-120b',
  'deepseek-r1': 'claude-3-5-haiku-20241022', // Fallback rate estimate
};

/**
 * Conservative default rate used when a model is not recognized in the matrix.
 */
const CONSERVATIVE_FALLBACK_RATE: PricingRate = { input: 3.0, output: 15.0 };

/**
 * Token counting and cost tracking engine managing per-session usage records and estimates.
 */
export class UsageTracker {
  private sessionUsage: Map<string, UsageRecord[]> = new Map();

  /**
   * Retrieve pricing rate per 1M tokens for a specified model.
   * Resolves canonical names, aliases, and defaults to conservative estimate if unknown.
   */
  getPricing(model: string): PricingRate {
    if (PRICING[model]) {
      return PRICING[model];
    }

    const canonical = MODEL_ALIASES[model];
    if (canonical && PRICING[canonical]) {
      return PRICING[canonical];
    }

    // Try case-insensitive matching
    const lower = model.toLowerCase();
    for (const [key, rate] of Object.entries(PRICING)) {
      if (key.toLowerCase() === lower) {
        return rate;
      }
    }

    return CONSERVATIVE_FALLBACK_RATE;
  }

  /**
   * Calculate exact cost in USD from input prompt tokens and output completion tokens.
   *
   * @param model Model identifier
   * @param promptTokens Actual input tokens consumed
   * @param completionTokens Actual output tokens generated
   * @returns Total cost in USD rounded to 6 decimal places
   */
  calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    const rate = this.getPricing(model);
    const cost = (promptTokens * rate.input + completionTokens * rate.output) / 1_000_000;
    // Round to 6 decimal places to prevent floating point inaccuracies
    return Math.round(cost * 1_000_000) / 1_000_000;
  }

  /**
   * Record telemetry for a completed chat message.
   * Stored in session map keyed by conversationId.
   */
  recordUsage(record: UsageRecord): void {
    const conversationId = record.conversationId || 'default';
    const existing = this.sessionUsage.get(conversationId) || [];
    existing.push(record);
    this.sessionUsage.set(conversationId, existing);
  }

  /**
   * Retrieve all usage records associated with a conversation thread.
   */
  getConversationUsage(conversationId: string): UsageRecord[] {
    return this.sessionUsage.get(conversationId) || [];
  }

  /**
   * Aggregate total cost in USD across all recorded messages in the active session.
   */
  getSessionTotalCost(): number {
    let total = 0;
    for (const records of this.sessionUsage.values()) {
      for (const record of records) {
        total += record.costUsd;
      }
    }
    return Math.round(total * 1_000_000) / 1_000_000;
  }

  /**
   * Aggregate total tokens consumed for a specific conversation.
   */
  getConversationTotalTokens(
    conversationId: string
  ): { promptTokens: number; completionTokens: number; totalTokens: number } {
    const records = this.getConversationUsage(conversationId);
    let promptTokens = 0;
    let completionTokens = 0;

    for (const record of records) {
      promptTokens += record.promptTokens;
      completionTokens += record.completionTokens;
    }

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };
  }

  /**
   * Aggregate total cost in USD for a specific conversation.
   */
  getConversationTotalCost(conversationId: string): number {
    const records = this.getConversationUsage(conversationId);
    let total = 0;
    for (const record of records) {
      total += record.costUsd;
    }
    return Math.round(total * 1_000_000) / 1_000_000;
  }

  /**
   * Rough token estimation from text using the industry-standard 4 characters per token heuristic.
   *
   * @param text String content to estimate
   * @returns Estimated token count
   */
  estimateTokens(text: string): number {
    if (!text || text.length === 0) return 0;
    return Math.ceil(text.length / 4);
  }

  /**
   * Pre-execution cost estimate from prompt text and optional estimated output length.
   */
  estimateCost(model: string, promptText: string, estimatedOutputChars = 500): number {
    const promptTokens = this.estimateTokens(promptText);
    const completionTokens = this.estimateTokens('x'.repeat(estimatedOutputChars));
    return this.calculateCost(model, promptTokens, completionTokens);
  }

  /**
   * Retrieve a flat list of all records across all conversations in the session.
   */
  getAllRecords(): UsageRecord[] {
    const all: UsageRecord[] = [];
    for (const records of this.sessionUsage.values()) {
      all.push(...records);
    }
    return all;
  }

  /**
   * Clear all recorded session telemetry.
   */
  clearSession(): void {
    this.sessionUsage.clear();
  }
}

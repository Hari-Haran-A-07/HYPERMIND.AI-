/**
 * @file provider.types.ts
 * @description Core types and interfaces for AI model providers, models, health checks, and usage telemetry.
 * @package @hypermind/shared-types
 */

/**
 * Unique identifier for supported LLM providers.
 */
export type ProviderId = 'google' | 'anthropic' | 'openai' | 'openai-compat' | 'deepseek';

/**
 * Capability tags supported by models for routing and feature availability.
 */
export type ModelCapability =
  | 'reasoning'
  | 'code'
  | 'vision'
  | 'fast'
  | 'multimodal'
  | 'tools'
  | 'general';

/**
 * Operational status of an AI model in the platform.
 */
export type ModelStatus = 'available' | 'preview' | 'coming-soon' | 'degraded' | 'unavailable';

/**
 * Circuit breaker states for provider failover and resilience management.
 */
export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Comprehensive metadata and technical specification for an AI model.
 */
export interface ModelDefinition {
  /** Internal unique display/routing ID (e.g. 'claude-sonnet-4') */
  id: string;
  /** Exact provider API model identifier string (e.g. 'claude-sonnet-4-20250514') */
  apiModelId: string;
  /** Human-readable display name for the model */
  name: string;
  /** The provider offering this model */
  provider: ProviderId;
  /** Display name of the provider (e.g. 'Anthropic') */
  providerName: string;
  /** Concise description of model strengths and use cases */
  description: string;
  /** Human-formatted context window length (e.g. '200K') */
  contextWindow: string;
  /** Exact context window capacity in tokens */
  contextWindowTokens: number;
  /** Maximum supported completion/output token count */
  maxOutputTokens: number;
  /** List of functional capabilities supported by this model */
  capabilities: ModelCapability[];
  /** Input token cost in USD per 1 Million tokens */
  costPer1MInput: number;
  /** Output token cost in USD per 1 Million tokens */
  costPer1MOutput: number;
  /** Current operational availability status */
  status: ModelStatus;
  /** Primary accent color code (HEX or HSL) for UI badges and icons */
  iconColor: string;
  /** Optional background or text badge color styling */
  badgeColor?: string;
  /** Optional descriptive badge text (e.g. 'Flagship', 'Fast') */
  badge?: string;
  /** Flag indicating if the model should be highlighted as popular */
  isPopular?: boolean;
  /** Whether the model supports server-sent streaming responses */
  supportsStreaming: boolean;
  /** Whether the model natively supports system prompt instructions */
  supportsSystemPrompt: boolean;
  /** Whether the model supports visual/image inputs */
  supportsImages?: boolean;
}

/**
 * Configuration and state representation for an external AI provider integration.
 */
export interface ProviderConfig {
  /** Unique provider identifier */
  id: ProviderId;
  /** Provider display name */
  name: string;
  /** Name of the icon or icon identifier */
  icon: string;
  /** Brand color associated with the provider */
  color: string;
  /** Brief description of the provider service */
  description: string;
  /** Whether the provider is enabled globally in the workspace */
  isEnabled: boolean;
  /** Whether an active, valid API key has been configured for the provider */
  apiKeyConfigured: boolean;
}

/**
 * Health, latency, and circuit breaker status for an AI provider.
 */
export interface ProviderHealth {
  /** Provider identifier */
  provider: ProviderId;
  /** Current operational health state */
  status: 'healthy' | 'degraded' | 'down';
  /** Round-trip ping/probe latency in milliseconds */
  latencyMs: number;
  /** Current circuit breaker state */
  circuitBreaker: CircuitBreakerState;
  /** ISO 8601 timestamp of the last health check */
  lastChecked: string;
  /** Number of consecutive failed requests or probes */
  consecutiveFailures: number;
  /** Measured percentage of successful uptime (0 - 100) */
  uptimePercent: number;
}

/**
 * Pre-execution token and cost estimate for a chat completion request.
 */
export interface UsageEstimate {
  /** Estimated input prompt tokens */
  estimatedInputTokens: number;
  /** Estimated output completion tokens */
  estimatedOutputTokens: number;
  /** Estimated total cost in USD */
  estimatedCostUsd: number;
  /** Model ID for which estimate was calculated */
  model: string;
  /** Provider of the model */
  provider: ProviderId;
}

/**
 * Post-execution telemetry and billing audit record for a generated message.
 */
export interface UsageRecord {
  /** Unique ID of the resulting message */
  messageId: string;
  /** Conversation thread ID */
  conversationId: string;
  /** Target model identifier used */
  model: string;
  /** Provider ID that handled the execution */
  provider: ProviderId;
  /** Actual input tokens consumed */
  promptTokens: number;
  /** Actual output tokens generated */
  completionTokens: number;
  /** Total tokens consumed (prompt + completion) */
  totalTokens: number;
  /** Calculated total cost in USD */
  costUsd: number;
  /** Request duration / latency in milliseconds */
  latencyMs: number;
  /** ISO 8601 timestamp of execution completion */
  timestamp: string;
}

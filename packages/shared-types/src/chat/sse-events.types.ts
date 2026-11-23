/**
 * @file sse-events.types.ts
 * @description Strongly typed Server-Sent Events (SSE) streaming protocol schema.
 * @package @hypermind/shared-types
 */

/**
 * Event types dispatched over the SSE chat completion stream.
 */
export type SSEEventType =
  | 'metadata'
  | 'token'
  | 'tool_call'
  | 'tool_result'
  | 'error'
  | 'done'
  | 'fallback';

/**
 * Stream initiation metadata event dispatched prior to token emission.
 */
export interface SSEMetadataEvent {
  type: 'metadata';
  /** Target conversation identifier */
  conversationId: string;
  /** Unique message identifier assigned to the assistant completion */
  messageId: string;
  /** Internal ID of the model serving the completion */
  modelId: string;
  /** Provider handling the generation */
  provider: string;
  /** ISO 8601 timestamp when streaming started */
  startedAt: string;
}

/**
 * Incremental token chunk event streamed as generation proceeds.
 */
export interface SSETokenEvent {
  type: 'token';
  /** New generated text delta */
  delta: string;
  /** Sequential chunk index (0-based) */
  index: number;
}

/**
 * Error event emitted when an unhandled or stream-interrupting failure occurs.
 */
export interface SSEErrorEvent {
  type: 'error';
  /** Machine-readable error classification code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Whether the client can retry or recover from this error */
  recoverable: boolean;
}

/**
 * Final stream completion event with full usage metrics and termination rationale.
 */
export interface SSEDoneEvent {
  type: 'done';
  /** Total prompt / input tokens consumed */
  promptTokens: number;
  /** Total completion / output tokens generated */
  completionTokens: number;
  /** Grand total token consumption */
  totalTokens: number;
  /** Calculated total cost in USD */
  costUsd: number;
  /** Final reason why generation stopped */
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  /** Total round-trip latency in milliseconds */
  latencyMs: number;
}

/**
 * Model failover event emitted when circuit breaker or rate limits divert to a backup model.
 */
export interface SSEFallbackEvent {
  type: 'fallback';
  /** Requested model that failed or triggered the circuit breaker */
  originalModel: string;
  /** Backup model that took over the generation request */
  fallbackModel: string;
  /** Explanation of why fallback was initiated */
  reason: string;
}

/**
 * Union of all valid Server-Sent Events emitted during streaming chat responses.
 */
export type SSEEvent =
  | SSEMetadataEvent
  | SSETokenEvent
  | SSEErrorEvent
  | SSEDoneEvent
  | SSEFallbackEvent;

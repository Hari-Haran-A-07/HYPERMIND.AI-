/**
 * @file message.types.ts
 * @description Type definitions for chat messages, conversations, attachments, and chat requests.
 * @package @hypermind/shared-types
 */

/**
 * Message participant role.
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Lifecycle and transport state of a chat message.
 */
export type MessageStatus = 'sending' | 'streaming' | 'sent' | 'error' | 'cancelled';

/**
 * Attachment payload metadata attached to a chat message.
 */
export interface ChatAttachment {
  /** Unique attachment identifier */
  id: string;
  /** Display filename */
  name: string;
  /** Human-readable or formatted file size (e.g. '1.2 MB') */
  size: string;
  /** MIME type or file extension category */
  type: string;
  /** Optional public or presigned URL to the attachment asset */
  url?: string;
}

/**
 * Represents a single message within a chat conversation thread.
 */
export interface ChatMessage {
  /** Unique message identifier */
  id: string;
  /** Role of the sender */
  role: MessageRole;
  /** Text content of the message */
  content: string;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** Model ID used to generate this message (assistant responses) */
  modelId?: string;
  /** Provider ID that generated this message */
  provider?: string;
  /** Optional file attachments */
  attachments?: ChatAttachment[];
  /** Current delivery or streaming status */
  status?: MessageStatus;
  /** Token consumption and cost telemetry */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUsd: number;
    latencyMs: number;
  };
  /** Error information if message generation failed */
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
  /** Whether this message was generated via a fallback model */
  isFallback?: boolean;
  /** Reason why fallback was triggered */
  fallbackReason?: string;
}

/**
 * Represents a persistent chat conversation session.
 */
export interface Conversation {
  /** Unique conversation identifier */
  id: string;
  /** Conversation display title */
  title: string;
  /** Default or currently active model identifier */
  modelId: string;
  /** ISO 8601 last update timestamp */
  updatedAt: string;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** Whether the conversation is pinned in the navigation sidebar */
  isPinned?: boolean;
  /** Chronological message sequence */
  messages: ChatMessage[];
  /** Optional short preview snippet */
  snippet?: string;
  /** Custom system prompt applied to this conversation */
  systemPrompt?: string;
}

/**
 * Incoming request payload for initiating or continuing a chat completion.
 */
export interface ChatRequest {
  /** Prompt text sent by the user */
  content: string;
  /** Target model identifier to process the prompt */
  modelId?: string;
  /** Parent conversation identifier (if appending to existing thread) */
  conversationId?: string;
  /** Historical context passed alongside the prompt */
  conversationHistory?: Array<{ role: MessageRole; content: string }>;
  /** Optional system instruction override */
  systemPrompt?: string;
  /** Sampling temperature (0.0 - 2.0) */
  temperature?: number;
  /** Upper bound on tokens to generate */
  maxTokens?: number;
  /** Whether to stream the response via Server-Sent Events (SSE) */
  stream?: boolean;
  /** Optional file or image attachments */
  attachments?: ChatAttachment[];
}

/**
 * Chat Store — Zustand state management for AI chat sessions
 *
 * Manages streaming state, active generation tracking, message history,
 * and usage metrics. Works with the SSE-based AI client.
 */

import { create } from 'zustand';
import {
  streamChat,
  cancelGeneration,
  type StreamChatOptions,
  type SSEMetadata,
  type SSEDone,
  type SSEFallback,
  type SSEError,
} from '@/lib/api/ai-client';
import type { ChatMessage } from '@/lib/mock-data';

export interface MessageUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
}

export interface ChatState {
  // Streaming state
  isStreaming: boolean;
  streamingMessageId: string | null;
  streamingContent: string;
  activeServerMessageId: string | null; // For cancellation

  // Metadata
  lastMetadata: SSEMetadata | null;
  lastUsage: MessageUsage | null;
  lastFallback: SSEFallback | null;
  lastError: SSEError | null;

  // Abort controller for client-side cancellation
  abortController: AbortController | null;

  // Actions
  startStreaming: (
    options: Omit<StreamChatOptions, 'signal'>,
    onToken: (content: string) => void,
    onComplete: (finalContent: string, usage: MessageUsage | null, metadata: SSEMetadata | null) => void,
    onError: (error: SSEError) => void
  ) => Promise<void>;

  stopStreaming: () => Promise<void>;
  resetError: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  // Initial state
  isStreaming: false,
  streamingMessageId: null,
  streamingContent: '',
  activeServerMessageId: null,
  lastMetadata: null,
  lastUsage: null,
  lastFallback: null,
  lastError: null,
  abortController: null,

  startStreaming: async (options, onToken, onComplete, onError) => {
    // Abort any existing stream
    const existingController = get().abortController;
    if (existingController) {
      existingController.abort();
    }

    const abortController = new AbortController();
    const streamingMessageId = `ast-${Date.now()}`;
    let accumulatedContent = '';
    let metadata: SSEMetadata | null = null;
    let usage: MessageUsage | null = null;

    set({
      isStreaming: true,
      streamingMessageId,
      streamingContent: '',
      activeServerMessageId: null,
      abortController,
      lastError: null,
      lastFallback: null,
    });

    const result = await streamChat(
      {
        ...options,
        signal: abortController.signal,
      },
      {
        onMetadata: (meta) => {
          metadata = meta;
          set({ lastMetadata: meta, activeServerMessageId: result?.messageId || null });
        },
        onToken: (delta) => {
          accumulatedContent += delta;
          set({ streamingContent: accumulatedContent });
          onToken(accumulatedContent);
        },
        onFallback: (fallback) => {
          set({ lastFallback: fallback });
        },
        onError: (error) => {
          set({ lastError: error, isStreaming: false });
          onError(error);
        },
        onDone: (done) => {
          usage = {
            promptTokens: done.promptTokens,
            completionTokens: done.completionTokens,
            totalTokens: done.totalTokens,
            costUsd: done.costUsd,
            latencyMs: done.latencyMs,
          };
          set({
            lastUsage: usage,
            isStreaming: false,
            streamingMessageId: null,
            streamingContent: '',
            abortController: null,
            activeServerMessageId: null,
          });
          onComplete(accumulatedContent, usage, metadata);
        },
      }
    );

    // Update server message ID for cancellation
    if (result.messageId) {
      set({ activeServerMessageId: result.messageId });
    }
  },

  stopStreaming: async () => {
    const { abortController, activeServerMessageId } = get();

    // Client-side abort
    if (abortController) {
      abortController.abort();
    }

    // Server-side cancel
    if (activeServerMessageId) {
      await cancelGeneration(activeServerMessageId).catch(() => {
        /* ignore cancel errors */
      });
    }

    set({
      isStreaming: false,
      streamingMessageId: null,
      streamingContent: '',
      abortController: null,
      activeServerMessageId: null,
    });
  },

  resetError: () => {
    set({ lastError: null });
  },
}));

export default useChatStore;

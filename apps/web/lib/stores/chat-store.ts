/**
 * Chat Store — Zustand state management for AI chat sessions
 *
 * Manages streaming simulation, message history, and UI state.
 * Uses mock data until backend integration is implemented.
 */

import { create } from 'zustand';

export interface ChatState {
  /** Whether a response is currently streaming */
  isStreaming: boolean;
  /** ID of the message being streamed */
  streamingMessageId: string | null;
  /** Accumulated streaming content */
  streamingContent: string;

  /** Actions */
  startStreaming: (messageId: string) => void;
  appendContent: (delta: string) => void;
  stopStreaming: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  isStreaming: false,
  streamingMessageId: null,
  streamingContent: '',

  startStreaming: (messageId: string) => {
    set({
      isStreaming: true,
      streamingMessageId: messageId,
      streamingContent: '',
    });
  },

  appendContent: (delta: string) => {
    set((state) => ({
      streamingContent: state.streamingContent + delta,
    }));
  },

  stopStreaming: () => {
    set({
      isStreaming: false,
      streamingMessageId: null,
      streamingContent: '',
    });
  },

  reset: () => {
    set({
      isStreaming: false,
      streamingMessageId: null,
      streamingContent: '',
    });
  },
}));

export default useChatStore;

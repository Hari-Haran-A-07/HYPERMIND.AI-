'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Share2,
  Download,
  ArrowLeft,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  getConversationById,
  MOCK_CONVERSATIONS,
  ChatMessage,
  Conversation,
} from '@/lib/mock-data';
import { getModelById, getDefaultModel, resolveApiModelId } from '@/lib/models';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput, ChatAttachmentItem } from '@/components/chat/chat-input';
import { ModelBadge } from '@/components/chat/model-badge';
import { useUIStore } from '@/lib/stores/ui-store';
import { useChatStore } from '@/lib/stores/chat-store';
import type { SSEError } from '@/lib/api/ai-client';

interface ChatDetailPageProps {
  params?: {
    id?: string;
  };
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const router = useRouter();
  const routeParams = useParams();
  const id = (routeParams?.id as string) || params?.id || 'conv-1';

  // Retrieve initial conversation or fallback
  const initialConversation = getConversationById(id) || MOCK_CONVERSATIONS[0];

  const [conversation, setConversation] = useState<Conversation>(initialConversation);
  const [messages, setMessages] = useState<ChatMessage[]>(initialConversation.messages);

  const selectedModelId = useUIStore((state) => state.selectedModelId);
  const currentModel = getModelById(conversation.modelId || selectedModelId) || getDefaultModel();

  // Chat store for streaming state
  const isStreaming = useChatStore((state) => state.isStreaming);
  const startStreaming = useChatStore((state) => state.startStreaming);
  const stopStreaming = useChatStore((state) => state.stopStreaming);
  const lastFallback = useChatStore((state) => state.lastFallback);

  // Update conversation if id param changes
  useEffect(() => {
    const found = getConversationById(id);
    if (found) {
      setConversation(found);
      setMessages(found.messages);
    }
  }, [id]);

  // Show fallback notification
  useEffect(() => {
    if (lastFallback) {
      toast.warning(
        `Model fallback: ${lastFallback.originalModel} → ${lastFallback.fallbackModel}`,
        {
          description: lastFallback.reason,
          duration: 5000,
          icon: <AlertTriangle className="w-4 h-4" />,
        }
      );
    }
  }, [lastFallback]);

  // Handle sending new user message with real AI streaming
  const handleSendMessage = useCallback(
    (content: string, attachments?: ChatAttachmentItem[]) => {
      if (!content.trim() && (!attachments || attachments.length === 0)) return;

      const userMessage: ChatMessage = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        attachments: attachments?.map((att) => ({
          id: att.id,
          name: att.name,
          size: att.size,
          type: att.type,
        })),
        status: 'sent',
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);

      // Create placeholder assistant message for streaming
      const assistantMessageId = `ast-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        modelId: currentModel.id,
        createdAt: new Date().toISOString(),
        content: '',
        status: 'streaming',
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Build conversation history for context
      const conversationHistory = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-20) // Last 20 messages for context window management
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      // Resolve the actual API model ID from the display ID
      const apiModelId = resolveApiModelId(selectedModelId || currentModel.id);

      // Start real streaming
      startStreaming(
        {
          content,
          modelId: apiModelId,
          conversationId: id,
          conversationHistory,
          systemPrompt: 'You are HYPERMIND AI, an advanced multi-model intelligence platform. Provide helpful, accurate, and well-structured responses. Use markdown formatting when appropriate.',
        },
        // onToken — update assistant message content progressively
        (accumulatedContent) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedContent, status: 'streaming' as const }
                : msg
            )
          );
        },
        // onComplete — finalize the message
        (finalContent, usage, metadata) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: finalContent,
                    status: 'sent' as const,
                    modelId: metadata?.modelId
                      ? metadata.modelId
                      : currentModel.id,
                  }
                : msg
            )
          );

          // Show usage toast if available
          if (usage && usage.totalTokens > 0) {
            toast.info(
              `${usage.totalTokens.toLocaleString()} tokens · ${usage.latencyMs.toLocaleString()}ms`,
              { duration: 3000 }
            );
          }
        },
        // onError — show error and update message
        (error: SSEError) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: msg.content || `⚠️ Error: ${error.message}`,
                    status: 'sent' as const,
                  }
                : msg
            )
          );

          if (error.recoverable) {
            toast.error('AI response failed', {
              description: `${error.message}. You can try again.`,
              duration: 5000,
            });
          } else {
            toast.error('AI response failed', {
              description: error.message,
              duration: 8000,
            });
          }
        }
      );
    },
    [messages, currentModel, selectedModelId, id, startStreaming]
  );

  // Handle stop/cancel generation
  const handleStop = useCallback(() => {
    stopStreaming();

    // Mark any streaming message as sent
    setMessages((prev) =>
      prev.map((msg) =>
        msg.status === 'streaming'
          ? { ...msg, status: 'sent' as const }
          : msg
      )
    );
  }, [stopStreaming]);

  // Handle regenerate assistant message
  const handleRegenerate = useCallback(
    (messageId: string) => {
      // Find the user message that preceded this assistant message
      const msgIndex = messages.findIndex((m) => m.id === messageId);
      if (msgIndex < 0) return;

      // Find the most recent user message before this assistant message
      let userContent = '';
      for (let i = msgIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          userContent = messages[i].content;
          break;
        }
      }

      if (!userContent) {
        toast.error('Could not find the original user message to regenerate');
        return;
      }

      // Remove the old assistant message
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      // Re-send the user message content
      handleSendMessage(userContent);
      toast.info('Regenerating response...', { duration: 2000 });
    },
    [messages, handleSendMessage]
  );

  // Handle edit user message
  const handleEdit = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );
    toast.success('Message updated');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Conversation link copied to clipboard');
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(messages, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${conversation.title}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Chat transcript exported');
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background text-foreground">
      {/* Top Header Bar */}
      <header className="h-14 px-4 sm:px-6 border-b border-border/70 flex items-center justify-between shrink-0 bg-card/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/chat"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Back to new chat"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="font-semibold text-xs sm:text-sm text-foreground truncate max-w-[200px] sm:max-w-md">
              {conversation.title}
            </h1>
            <ModelBadge
              modelId={conversation.modelId}
              size="xs"
              showProvider={false}
              interactive={true}
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/chat"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share conversation"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExport}
            aria-label="Export conversation"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Message Feed */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          messages={messages}
          isGenerating={isStreaming}
          onRegenerate={handleRegenerate}
          onEdit={handleEdit}
        />
      </main>

      {/* Message Composer Footer */}
      <footer className="p-3 sm:p-4 bg-background border-t border-border/40 shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
          onStop={handleStop}
        />
        <div className="flex items-center justify-between max-w-4xl mx-auto px-2 pt-2 text-[10px] text-muted-foreground">
          <span>Active context: {currentModel.contextWindow} tokens</span>
          <span className="font-mono">HYPERMIND Autonomous Engine v2.4</span>
        </div>
      </footer>
    </div>
  );
}

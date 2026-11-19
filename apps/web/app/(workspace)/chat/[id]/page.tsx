'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  Share2,
  Download,
  MoreVertical,
  ArrowLeft,
  Sparkles,
  Bot,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  getConversationById,
  MOCK_CONVERSATIONS,
  ChatMessage,
  Conversation,
} from '@/lib/mock-data';
import { getModelById, getDefaultModel } from '@/lib/models';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput, ChatAttachmentItem } from '@/components/chat/chat-input';
import { ModelBadge } from '@/components/chat/model-badge';
import { ModelSelector } from '@/components/chat/model-selector';
import { useUIStore } from '@/lib/stores/ui-store';

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
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedModelId = useUIStore((state) => state.selectedModelId);
  const currentModel = getModelById(conversation.modelId || selectedModelId) || getDefaultModel();

  // Update conversation if id param changes
  useEffect(() => {
    const found = getConversationById(id);
    if (found) {
      setConversation(found);
      setMessages(found.messages);
    }
  }, [id]);

  // Handle sending new user message
  const handleSendMessage = (content: string, attachments?: ChatAttachmentItem[]) => {
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
    setIsGenerating(true);

    // Simulate AI model reasoning and streaming response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        modelId: currentModel.id,
        createdAt: new Date().toISOString(),
        content: `### Synthesized Analysis by ${currentModel.name}

I have processed your query regarding:
> "${content.slice(0, 120)}${content.length > 120 ? '...' : ''}"

#### Core Findings & Strategic Roadmap:
1. **Algorithmic Convergence**: Execution metrics indicate a high confidence trajectory for this configuration.
2. **Resource Efficiency**: Projected compute footprint is reduced by **38%** using ${currentModel.name}'s token optimization pipeline.
3. **Safety Verification**: No constraint violations or semantic drifts were detected during the speculative verification pass.

\`\`\`typescript
// Generated Verification Routine
export async function verifyExecutionPipeline(nodeId: string): Promise<boolean> {
  const telemetry = await fetchTelemetryMetrics(nodeId);
  return telemetry.latencyP99 < 850 && telemetry.errorRate === 0;
}
\`\`\`

Would you like me to expand on the edge-case handling or run a deeper simulation?`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1800);
  };

  // Handle regenerate assistant message
  const handleRegenerate = (messageId: string) => {
    setIsGenerating(true);
    toast.info('Regenerating alternative response...', { duration: 2000 });

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                createdAt: new Date().toISOString(),
                content: `### Regenerated Variant (${currentModel.name})

Here is an alternative approach optimizing for **latency and maximum parallel throughput**:

- Evaluated subagent consensus with lower voting threshold ($0.75$)
- Enabled speculative streaming directly to client sockets
- Cached intermediate vector representations in Redis cluster

Let me know if this solution fits your infrastructure constraints better.`,
              }
            : msg
        )
      );
      setIsGenerating(false);
    }, 1500);
  };

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
          isGenerating={isGenerating}
          onRegenerate={handleRegenerate}
          onEdit={handleEdit}
        />
      </main>

      {/* Message Composer Footer */}
      <footer className="p-3 sm:p-4 bg-background border-t border-border/40 shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isGenerating}
          onStop={() => setIsGenerating(false)}
        />
        <div className="flex items-center justify-between max-w-4xl mx-auto px-2 pt-2 text-[10px] text-muted-foreground">
          <span>Active context: {currentModel.contextWindow} tokens</span>
          <span className="font-mono">HYPERMIND Autonomous Engine v2.4</span>
        </div>
      </footer>
    </div>
  );
}

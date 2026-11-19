'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/lib/mock-data';
import { MessageItem } from '@/components/chat/message-item';

interface MessageListProps {
  messages: ChatMessage[];
  isGenerating?: boolean;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  className?: string;
}

function formatGroupDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date('2026-11-18T20:30:00Z');
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function MessageList({
  messages,
  isGenerating = false,
  onRegenerate,
  onEdit,
  className,
}: MessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll to bottom on message updates
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isGenerating]);

  // Track scroll position to show/hide "Scroll to bottom" button
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceFromBottom > 150);
  };

  // Group messages with date separators
  const groupedMessages = useMemo(() => {
    const items: Array<{ type: 'date'; date: string } | { type: 'message'; message: ChatMessage }> = [];
    let lastDate = '';

    messages.forEach((msg) => {
      const msgDate = formatGroupDate(msg.createdAt);
      if (msgDate !== lastDate) {
        items.push({ type: 'date', date: msgDate });
        lastDate = msgDate;
      }
      items.push({ type: 'message', message: msg });
    });

    return items;
  }, [messages]);

  return (
    <div className={cn('relative flex-1 w-full overflow-hidden flex flex-col', className)}>
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-2 focus:outline-none scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center text-muted-foreground space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border shadow-sm">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">No messages in this conversation yet</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Send a message below to begin collaborating with your selected AI model.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-3">
            {groupedMessages.map((item, index) => {
              if (item.type === 'date') {
                return (
                  <div key={`date-${item.date}-${index}`} className="flex items-center my-6">
                    <div className="flex-1 border-t border-border/50" />
                    <span className="px-3 text-[11px] font-medium font-mono uppercase tracking-wider text-muted-foreground bg-background">
                      {item.date}
                    </span>
                    <div className="flex-1 border-t border-border/50" />
                  </div>
                );
              }

              return (
                <MessageItem
                  key={item.message.id}
                  message={item.message}
                  onRegenerate={onRegenerate}
                  onEdit={onEdit}
                />
              );
            })}

            {/* Generating / Streaming Indicator */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 py-4 px-4 text-xs text-muted-foreground"
              >
                <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">Thinking</span>
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => scrollToBottom('smooth')}
            aria-label="Scroll to newest messages"
            className={cn(
              'absolute bottom-4 right-6 z-20 p-2.5 rounded-full',
              'bg-card border border-border text-foreground shadow-lg hover:shadow-glow',
              'hover:bg-secondary transition-all active:scale-95'
            )}
          >
            <ArrowDown className="w-4 h-4 text-primary" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

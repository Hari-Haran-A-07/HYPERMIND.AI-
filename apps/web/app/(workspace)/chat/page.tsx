'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Network,
  TrendingUp,
  Code2,
  Brain,
  Atom,
  ShieldCheck,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUGGESTED_PROMPTS, SuggestedPrompt } from '@/lib/mock-data';
import { ModelSelector } from '@/components/chat/model-selector';
import { ChatInput, ChatAttachmentItem } from '@/components/chat/chat-input';
import { useUIStore } from '@/lib/stores/ui-store';
import { getModelById, getDefaultModel } from '@/lib/models';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Network,
  TrendingUp,
  Code2,
  Brain,
  Atom,
  ShieldCheck,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export default function NewChatPage() {
  const router = useRouter();
  const selectedModelId = useUIStore((state) => state.selectedModelId);
  const currentModel = getModelById(selectedModelId) || getDefaultModel();

  const handlePromptClick = (item: SuggestedPrompt) => {
    // Navigate to conversation with prompt context or load conv-1
    router.push(`/chat/conv-1`);
  };

  const handleSendMessage = (content: string, attachments?: ChatAttachmentItem[]) => {
    // Navigate to active conversation
    router.push(`/chat/conv-1`);
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] justify-between px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full">
      {/* Top Model Quick Bar */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Active Engine
          </span>
          <ModelSelector />
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>Multi-Agent Swarm Ready</span>
        </div>
      </div>

      {/* Center Welcome Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-6"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/10 border border-primary/40 flex items-center justify-center shadow-glow">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-primary/20 blur-xl -z-10" />
        </motion.div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3 max-w-2xl"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            HYPERMIND <span className="text-primary">AI</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            One Platform. Multiple Intelligence. Infinite Possibilities.
            <br />
            Select a frontier model or launch a pre-configured reasoning task below.
          </p>
        </motion.div>

        {/* Suggested Prompt Cards Grid (2x3) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-10 text-left"
        >
          {SUGGESTED_PROMPTS.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Sparkles;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                onClick={() => handlePromptClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePromptClick(item);
                  }
                }}
                className={cn(
                  'group relative p-4 rounded-2xl cursor-pointer',
                  'border border-border/70 bg-card/70 hover:bg-card hover:border-primary/50',
                  'transition-all duration-200 shadow-sm hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary/40'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full border border-border/40">
                    {item.category}
                  </span>
                </div>

                <h2 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  {item.title}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary" />
                </h2>

                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Composer Input at Bottom */}
      <div className="pt-4 pb-2 w-full">
        <ChatInput onSendMessage={handleSendMessage} />
        <p className="text-center text-[11px] text-muted-foreground/70 mt-2.5">
          HYPERMIND AI synthesizes responses across verified frontier engines. Verify critical outputs.
        </p>
      </div>
    </div>
  );
}

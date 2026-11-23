'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  RotateCw,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  User,
  Sparkles,
  Brain,
  FileCode,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn, formatRelativeTime } from '@/lib/utils';
import { ChatMessage } from '@/lib/mock-data';
import { getModelById, getDefaultModel } from '@/lib/models';
import { MarkdownRenderer } from '@/components/chat/markdown-renderer';
import { ModelBadge } from '@/components/chat/model-badge';

interface MessageItemProps {
  message: ChatMessage;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  isStreaming?: boolean;
}

export function MessageItem({
  message,
  onRegenerate,
  onEdit,
  isStreaming = false,
}: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  const isUser = message.role === 'user';
  const model = getModelById(message.modelId || '') || getDefaultModel();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied to clipboard', { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy message');
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group relative w-full py-4 px-2 sm:px-4 transition-colors',
        isUser ? 'flex justify-end' : 'flex justify-start'
      )}
    >
      <div
        className={cn(
          'flex gap-3 sm:gap-4 max-w-full',
          isUser ? 'flex-row-reverse max-w-[85%] sm:max-w-[78%]' : 'flex-row w-full max-w-3xl'
        )}
      >
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground shadow-sm">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm transition-transform group-hover:scale-105"
              style={{
                boxShadow: `0 0 10px ${model.iconColor}30`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: model.iconColor }}
              />
            </div>
          )}
        </div>

        {/* Message Content & Metadata */}
        <div
          className={cn(
            'flex flex-col min-w-0 space-y-1.5',
            isUser ? 'items-end' : 'items-start flex-1'
          )}
        >
          {/* Header Bar */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {!isUser && (
              <ModelBadge
                modelId={model.id}
                size="xs"
                showProvider={false}
                interactive={false}
              />
            )}
            <span className="font-mono text-[11px] opacity-70">
              {formatRelativeTime(message.createdAt)}
            </span>
          </div>

          {/* User Attachments (if any) */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border/70 text-xs text-foreground"
                >
                  {att.name.endsWith('.ts') || att.name.endsWith('.py') ? (
                    <FileCode className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className="font-medium truncate max-w-[150px]">
                    {att.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({att.size})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Body Content */}
          {isEditing ? (
            <div className="w-full space-y-2 mt-1">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-card border border-primary/60 text-foreground text-sm focus:outline-none min-h-[100px]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save & Resubmit
                </button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-2xl text-sm leading-relaxed',
                isUser
                  ? 'bg-secondary/70 border border-border/60 text-foreground px-4 py-3 rounded-tr-sm shadow-sm'
                  : 'text-foreground w-full pt-1'
              )}
            >
              <MarkdownRenderer content={message.content} />
              {/* Streaming cursor indicator */}
              {!isUser && message.status === 'streaming' && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-primary/80 animate-pulse rounded-sm align-text-bottom" />
              )}
            </div>
          )}

          {/* Hover Action Buttons — hidden during streaming */}
          <div
            className={cn(
              'flex items-center gap-1 pt-1 transition-opacity duration-150',
              message.status === 'streaming'
                ? 'opacity-0 pointer-events-none'
                : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100',
              isUser ? 'justify-end' : 'justify-start'
            )}
          >
            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              title="Copy message"
              aria-label="Copy message"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success stroke-[2.5]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Assistant specific actions */}
            {!isUser && onRegenerate && (
              <button
                type="button"
                onClick={() => onRegenerate(message.id)}
                title="Regenerate response"
                aria-label="Regenerate response"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}

            {!isUser && (
              <>
                <button
                  type="button"
                  onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
                  title="Helpful response"
                  aria-label="Helpful response"
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    feedback === 'liked'
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFeedback(feedback === 'disliked' ? null : 'disliked')
                  }
                  title="Unhelpful response"
                  aria-label="Unhelpful response"
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    feedback === 'disliked'
                      ? 'text-destructive bg-destructive/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* User specific action: Edit */}
            {isUser && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit message"
                aria-label="Edit message"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

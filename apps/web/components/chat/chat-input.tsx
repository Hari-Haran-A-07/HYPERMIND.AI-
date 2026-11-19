'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Paperclip,
  Mic,
  MicOff,
  X,
  FileCode,
  FileText,
  Sparkles,
  StopCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModelSelector } from '@/components/chat/model-selector';
import { useUIStore } from '@/lib/stores/ui-store';
import { getModelById, getDefaultModel } from '@/lib/models';

export interface ChatAttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface ChatInputProps {
  onSendMessage?: (content: string, attachments?: ChatAttachmentItem[]) => void;
  isLoading?: boolean;
  onStop?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  onStop,
  placeholder,
  className,
  disabled = false,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachmentItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedModelId = useUIStore((state) => state.selectedModelId);
  const currentModel = getModelById(selectedModelId) || getDefaultModel();

  // Auto-resize textarea height
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 52), 200);
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [content, adjustTextareaHeight]);

  // Handle submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = content.trim();

    if ((trimmed || attachments.length > 0) && !isLoading && !disabled) {
      if (onSendMessage) {
        onSendMessage(trimmed, attachments);
      }
      setContent('');
      setAttachments([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = '52px';
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Mock file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ChatAttachmentItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'text/plain',
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  // Drag and drop mock
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles: ChatAttachmentItem[] = Array.from(e.dataTransfer.files).map(
        (file) => ({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || 'text/plain',
        })
      );
      setAttachments((prev) => [...prev, ...droppedFiles]);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate speech recognition preview after short delay
      setTimeout(() => {
        setContent((prev) =>
          prev
            ? `${prev} How can we optimize this distributed system for low latency?`
            : 'How can we optimize this distributed system for low latency?'
        );
        setIsRecording(false);
      }, 2500);
    }
  };

  const canSubmit = (content.trim().length > 0 || attachments.length > 0) && !disabled;
  const computedPlaceholder =
    placeholder ||
    `Ask ${currentModel.name} anything, paste code, or type / for commands...`;

  return (
    <div
      className={cn('relative w-full max-w-4xl mx-auto', className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag & Drop Visual Overlay */}
      <AnimatePresence>
        {isDraggingOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-card/95 border-2 border-dashed border-primary backdrop-blur-md p-6 text-center shadow-glow"
          >
            <Sparkles className="w-8 h-8 text-primary animate-bounce mb-2" />
            <p className="font-semibold text-sm text-foreground">
              Drop files to analyze with {currentModel.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports code, documents, logs, and images
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Composer Box */}
      <div
        className={cn(
          'relative flex flex-col rounded-2xl border transition-all duration-200',
          'bg-card/90 backdrop-blur-xl shadow-lg',
          'border-border/80 hover:border-border',
          'focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-glow',
          disabled && 'opacity-60 pointer-events-none'
        )}
      >
        {/* Attachment Badges Bar */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto no-scrollbar">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border/60 text-xs text-foreground shrink-0 shadow-sm"
              >
                {file.name.endsWith('.ts') ||
                file.name.endsWith('.py') ||
                file.name.endsWith('.js') ? (
                  <FileCode className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="font-medium truncate max-w-[140px]">
                  {file.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({file.size})
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.id)}
                  className="p-0.5 hover:text-destructive rounded transition-colors ml-1"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={computedPlaceholder}
          disabled={disabled || isLoading}
          rows={1}
          className={cn(
            'w-full px-4 pt-3.5 pb-2 rounded-t-2xl resize-none text-sm text-foreground bg-transparent',
            'placeholder:text-muted-foreground focus:outline-none leading-relaxed',
            'min-h-[52px] max-h-[200px]'
          )}
        />

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2 border-t border-border/30">
          {/* Left Actions: Attachments, Voice, Model Pill */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Model Quick-Switch Pill */}
            <ModelSelector
              side="top"
              align="start"
              trigger={
                <button
                  type="button"
                  aria-label="Change AI Model"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium',
                    'bg-secondary/70 hover:bg-secondary text-foreground border border-border/50',
                    'transition-colors duration-150 shadow-sm'
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: currentModel.iconColor }}
                  />
                  <span className="truncate max-w-[110px] sm:max-w-[160px]">
                    {currentModel.name}
                  </span>
                </button>
              }
            />

            {/* Paperclip Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file or code"
              className={cn(
                'p-1.5 sm:px-2 sm:py-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/70',
                'transition-colors duration-150 inline-flex items-center gap-1.5 text-xs'
              )}
            >
              <Paperclip className="w-4 h-4" />
              <span className="hidden sm:inline">Attach</span>
            </button>

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleRecording}
              aria-label={isRecording ? 'Stop recording voice' : 'Dictate with voice'}
              className={cn(
                'p-1.5 sm:px-2 sm:py-1 rounded-xl transition-colors duration-150 inline-flex items-center gap-1.5 text-xs',
                isRecording
                  ? 'text-destructive bg-destructive/15 animate-pulse'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
              )}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Voice</span>
                </>
              )}
            </button>
          </div>

          {/* Right Action: Submit Button / Stop Button */}
          <div className="flex items-center gap-2 shrink-0">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generation"
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'bg-destructive/90 hover:bg-destructive text-destructive-foreground',
                  'transition-all duration-150 shadow-sm'
                )}
              >
                <StopCircle className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!canSubmit}
                aria-label="Send message"
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                  canSubmit
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/30 cursor-pointer active:scale-95'
                    : 'bg-muted text-muted-foreground/50 cursor-not-allowed'
                )}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      autoResize = false,
      minRows = 3,
      maxRows = 12,
      error = false,
      onChange,
      value,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Merge forwarded ref and internal ref
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current;
      if (!textarea || !autoResize) return;

      textarea.style.height = 'auto';
      const lineHeight = 20; // fallback approx line height in px
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows ? maxRows * lineHeight : Infinity;
      const scrollHeight = textarea.scrollHeight;

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [autoResize, minRows, maxRows]);

    React.useEffect(() => {
      if (autoResize) {
        adjustHeight();
      }
    }, [autoResize, adjustHeight, value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        adjustHeight();
      }
      onChange?.(e);
    };

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors motion-reduce:transition-none',
          autoResize && 'resize-none',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={internalRef}
        rows={minRows}
        onChange={handleChange}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/chat/code-block';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'text-foreground leading-relaxed text-sm sm:text-[15px] space-y-3',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath as any]}
        rehypePlugins={[rehypeKatex as any]}
        components={{
          // Code & Syntax Highlighting
          code({ node, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const isInline = !match && !String(children).includes('\n');

            if (!isInline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, '')}
                />
              );
            }

            if (!isInline && !match) {
              // Multiline code block without language
              return (
                <CodeBlock
                  language="text"
                  code={String(children).replace(/\n$/, '')}
                />
              );
            }

            // Inline code
            return (
              <code
                className="px-1.5 py-0.5 rounded text-[13px] font-mono bg-muted/80 text-primary border border-border/60"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Headings
          h1({ children }) {
            return (
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-5 mb-2 pb-1 border-b border-border/50">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mt-4 mb-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground mt-3 mb-1.5">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-sm sm:text-base font-semibold text-foreground mt-2 mb-1">
                {children}
              </h4>
            );
          },

          // Paragraphs
          p({ children }) {
            return <p className="leading-relaxed mb-2.5 last:mb-0">{children}</p>;
          },

          // Lists
          ul({ children }) {
            return (
              <ul className="list-disc pl-5 space-y-1 mb-3 marker:text-primary">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal pl-5 space-y-1 mb-3 marker:text-primary marker:font-semibold">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed pl-1">{children}</li>;
          },

          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="my-3 pl-4 border-l-2 border-primary/70 bg-muted/30 py-1.5 pr-3 rounded-r-lg italic text-muted-foreground">
                {children}
              </blockquote>
            );
          },

          // Tables
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-border/70 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-secondary/70 border-b border-border/70 text-foreground font-semibold">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-border/50 bg-card/40">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-muted/40 transition-colors">{children}</tr>
            );
          },
          th({ children }) {
            return <th className="p-3 font-semibold text-foreground">{children}</th>;
          },
          td({ children }) {
            return (
              <td className="p-3 text-muted-foreground align-top">{children}</td>
            );
          },

          // Links
          a({ href, children }) {
            const isExternal = href?.startsWith('http') || href?.startsWith('//');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="w-3 h-3 inline-block shrink-0" />}
              </a>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-4 border-t border-border/60" />;
          },

          // Strong & Emphasis
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-foreground/90">{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

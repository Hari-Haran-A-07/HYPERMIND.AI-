'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal, FileCode, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  code: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  language = 'text',
  code,
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [linesVisible, setLinesVisible] = useState(showLineNumbers);

  const cleanCode = code ? code.trimEnd() : '';
  const lines = cleanCode.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      toast.success('Code copied to clipboard', {
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  // Pretty display for language
  const normalizedLang = language.toLowerCase();
  const displayLang =
    normalizedLang === 'tsx' || normalizedLang === 'ts'
      ? 'TypeScript'
      : normalizedLang === 'jsx' || normalizedLang === 'js'
      ? 'JavaScript'
      : normalizedLang === 'py' || normalizedLang === 'python'
      ? 'Python'
      : normalizedLang === 'rs' || normalizedLang === 'rust'
      ? 'Rust'
      : normalizedLang === 'go'
      ? 'Go'
      : normalizedLang === 'sql'
      ? 'SQL'
      : normalizedLang === 'sh' || normalizedLang === 'bash' || normalizedLang === 'shell'
      ? 'Shell'
      : normalizedLang === 'json'
      ? 'JSON'
      : normalizedLang === 'yaml' || normalizedLang === 'yml'
      ? 'YAML'
      : normalizedLang;

  return (
    <div
      className={cn(
        'group relative my-4 rounded-xl border border-border/70 overflow-hidden shadow-md',
        'bg-[#0d1117] text-[#c9d1d9] font-mono text-xs sm:text-[13px]',
        className
      )}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-border/40 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-semibold text-xs text-[#e6edf3] tracking-wide">
            {filename || displayLang}
          </span>
          {filename && (
            <span className="text-[11px] text-[#8b949e] font-normal">
              ({displayLang})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Line Numbers */}
          <button
            type="button"
            onClick={() => setLinesVisible(!linesVisible)}
            title={linesVisible ? 'Hide line numbers' : 'Show line numbers'}
            aria-label="Toggle line numbers"
            className={cn(
              'p-1 rounded text-[#8b949e] hover:text-[#e6edf3] transition-colors',
              linesVisible && 'text-primary/90'
            )}
          >
            <Hash className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-sans font-medium',
              'transition-all duration-150',
              copied
                ? 'bg-success/20 text-success'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success stroke-[2.5]" />
                <span className="text-[11px] text-success">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-4 leading-relaxed font-mono">
        <pre className="flex">
          {linesVisible && (
            <div
              className="select-none pr-4 text-right text-[#484f58] font-mono border-r border-[#30363d]/50 shrink-0 mr-4"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <code className="flex-1 font-mono">{cleanCode}</code>
        </pre>
      </div>
    </div>
  );
}

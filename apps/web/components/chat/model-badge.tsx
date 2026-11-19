'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getModelById, getDefaultModel } from '@/lib/models';
import { useUIStore } from '@/lib/stores/ui-store';

interface ModelBadgeProps {
  modelId?: string;
  showProvider?: boolean;
  showContext?: boolean;
  size?: 'xs' | 'sm' | 'md';
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

export function ModelBadge({
  modelId,
  showProvider = true,
  showContext = false,
  size = 'sm',
  onClick,
  className,
  interactive = false,
}: ModelBadgeProps) {
  const currentStoreModelId = useUIStore((state) => state.selectedModelId);
  const toggleModelSelector = useUIStore((state) => state.toggleModelSelector);

  const activeId = modelId || currentStoreModelId;
  const model = getModelById(activeId) || getDefaultModel();

  const isClickable = interactive || !!onClick;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (interactive) {
      toggleModelSelector();
    }
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1.5',
    sm: 'px-2.5 py-1 text-xs gap-2',
    md: 'px-3 py-1.5 text-sm gap-2.5',
  };

  const dotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(e as any);
              }
            }
          : undefined
      }
      aria-label={`Model: ${model.name} (${model.providerName})`}
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        'bg-secondary/60 text-foreground border border-border/60 backdrop-blur-sm',
        'transition-all duration-150 select-none',
        sizeClasses[size],
        isClickable && [
          'cursor-pointer hover:bg-secondary/90 hover:border-border',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'active:scale-95',
        ],
        className
      )}
    >
      {/* Colored Status Dot */}
      <span
        className={cn('rounded-full shrink-0 shadow-sm transition-transform', dotSizes[size])}
        style={{
          backgroundColor: model.iconColor,
          boxShadow: `0 0 8px ${model.iconColor}60`,
        }}
      />

      {/* Model Name */}
      <span className="font-semibold tracking-tight text-foreground truncate">
        {model.name}
      </span>

      {/* Provider Name */}
      {showProvider && (
        <span className="text-muted-foreground font-normal">
          by {model.providerName}
        </span>
      )}

      {/* Context Window */}
      {showContext && (
        <span className="font-mono text-[10px] text-muted-foreground bg-muted/80 px-1 py-0.2 rounded border border-border/40">
          {model.contextWindow}
        </span>
      )}
    </div>
  );
}

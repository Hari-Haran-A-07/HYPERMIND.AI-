import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={title}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center min-h-[320px]',
        className
      )}
    >
      {/* Icon badge circle with violet/10 glow */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm mb-4 transition-transform hover:scale-105 duration-200">
        <Icon className="h-8 w-8 stroke-[1.75]" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button
            onClick={onAction}
            className="rounded-xl shadow-sm hover:shadow-glow transition-all"
          >
            {actionLabel}
          </Button>
        </div>
      )}

      {/* Optional custom child elements */}
      {children && <div className="mt-6 w-full max-w-md">{children}</div>}
    </div>
  );
}

export default EmptyState;

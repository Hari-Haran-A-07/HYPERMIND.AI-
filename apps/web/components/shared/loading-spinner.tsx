import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  centered?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function LoadingSpinner({
  size = 'md',
  label,
  centered = false,
  className,
  ...props
}: LoadingSpinnerProps) {
  const content = (
    <div
      role="status"
      aria-label={label || 'Loading...'}
      className={cn(
        'inline-flex flex-col items-center justify-center gap-2 text-muted-foreground',
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          'animate-spin text-primary motion-reduce:animate-none',
          sizeMap[size]
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs sm:text-sm font-medium tracking-tight text-muted-foreground animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Loading, please wait...'}</span>
    </div>
  );

  if (centered) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 w-full h-full min-h-[200px]">
        {content}
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;

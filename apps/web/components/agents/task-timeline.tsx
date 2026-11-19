'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Timer,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TaskStatus = 'queued' | 'executing' | 'complete' | 'failed';

export interface TaskTimelineItem {
  id?: string;
  step: string;
  description: string;
  status: TaskStatus;
  duration?: string;
  timestamp?: string;
  details?: string;
}

export interface TaskTimelineProps {
  tasks: TaskTimelineItem[];
  title?: string;
  className?: string;
  emptyMessage?: string;
}

const statusConfig: Record<
  TaskStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    dotBg: string;
    dotBorder: string;
    lineBg: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    label: string;
  }
> = {
  queued: {
    icon: Clock,
    dotBg: 'bg-sky-500/20 text-sky-400',
    dotBorder: 'border-sky-500/40',
    lineBg: 'bg-sky-500/20',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/30',
    label: 'Queued',
  },
  executing: {
    icon: Loader2,
    dotBg: 'bg-amber-500/20 text-amber-400',
    dotBorder: 'border-amber-500/50',
    lineBg: 'bg-amber-500/30',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    label: 'Executing',
  },
  complete: {
    icon: CheckCircle2,
    dotBg: 'bg-emerald-500/20 text-emerald-400',
    dotBorder: 'border-emerald-500/40',
    lineBg: 'bg-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    label: 'Completed',
  },
  failed: {
    icon: XCircle,
    dotBg: 'bg-rose-500/20 text-rose-400',
    dotBorder: 'border-rose-500/40',
    lineBg: 'bg-rose-500/30',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    label: 'Failed',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export function TaskTimeline({
  tasks,
  title,
  className,
  emptyMessage = 'No tasks in the execution queue.',
}: TaskTimelineProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-card/40 text-center text-muted-foreground',
          className
        )}
      >
        <Clock className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 text-card-foreground',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
          <h4 className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            <span>{title}</span>
          </h4>
          <span className="text-xs text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'step' : 'steps'} recorded
          </span>
        </div>
      )}

      <motion.ol
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-5"
        aria-label="Agent task execution timeline"
      >
        {tasks.map((task, index) => {
          const config = statusConfig[task.status] || statusConfig.queued;
          const Icon = config.icon;
          const isLast = index === tasks.length - 1;

          return (
            <motion.li
              key={task.id || `${task.step}-${index}`}
              variants={itemVariants}
              className="relative flex items-start gap-4 group"
            >
              {/* Connecting vertical line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-4 top-8 -bottom-5 w-[2px] -translate-x-1/2 rounded-full',
                    config.lineBg
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Status Dot / Indicator */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-105',
                  config.dotBg,
                  config.dotBorder
                )}
              >
                {task.status === 'executing' ? (
                  <Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Icon className="h-4 w-4" aria-hidden="true" />
                )}

                {/* Pulsing halo for executing */}
                {task.status === 'executing' && (
                  <span className="absolute -inset-1 rounded-full bg-amber-400/20 animate-ping" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 rounded-lg border border-border/50 bg-secondary/30 p-3.5 transition-colors group-hover:border-border group-hover:bg-secondary/50">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs tracking-wide text-foreground">
                      {task.step}
                    </span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase',
                        config.badgeBorder,
                        config.badgeBg,
                        config.badgeText
                      )}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Duration and timestamp */}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {task.duration && (
                      <span className="flex items-center gap-1 font-mono">
                        <Timer className="h-3 w-3" />
                        {task.duration}
                      </span>
                    )}
                    {task.timestamp && (
                      <span className="text-muted-foreground/70">
                        {task.timestamp}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {task.description}
                </p>

                {task.details && (
                  <div className="mt-2.5 rounded border border-border/40 bg-background/60 p-2 font-mono text-[11px] text-muted-foreground">
                    {task.details}
                  </div>
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}

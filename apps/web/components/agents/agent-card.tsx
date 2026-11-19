'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Play, Settings, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AgentStatus = 'idle' | 'active' | 'waiting';
export type AgentColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'indigo'
  | 'pink'
  | 'teal'
  | 'amber'
  | 'red';

export interface AgentTaskSummary {
  id: string;
  name: string;
  status: 'queued' | 'executing' | 'complete' | 'failed';
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: AgentColor;
  capabilities: string[];
  status: AgentStatus;
  taskCount: number;
  lastActive: string;
  recentTasks?: AgentTaskSummary[];
}

export interface AgentCardProps {
  agent: Agent;
  onLaunch?: (agent: Agent) => void;
  onConfigure?: (agent: Agent) => void;
  onViewTasks?: (agent: Agent) => void;
  className?: string;
}

const colorStyles: Record<
  AgentColor,
  {
    accentBar: string;
    iconBg: string;
    iconText: string;
    badgeBorder: string;
    badgeText: string;
    badgeBg: string;
    glow: string;
  }
> = {
  blue: {
    accentBar: 'bg-sky-500',
    iconBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    iconText: 'text-sky-400',
    badgeBorder: 'border-sky-500/20',
    badgeText: 'text-sky-300',
    badgeBg: 'bg-sky-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(14,165,233,0.15)]',
  },
  green: {
    accentBar: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    iconText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]',
  },
  orange: {
    accentBar: 'bg-orange-500',
    iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    iconText: 'text-orange-400',
    badgeBorder: 'border-orange-500/20',
    badgeText: 'text-orange-300',
    badgeBg: 'bg-orange-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(249,115,22,0.15)]',
  },
  purple: {
    accentBar: 'bg-purple-500',
    iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    iconText: 'text-purple-400',
    badgeBorder: 'border-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBg: 'bg-purple-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.15)]',
  },
  indigo: {
    accentBar: 'bg-indigo-500',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    iconText: 'text-indigo-400',
    badgeBorder: 'border-indigo-500/20',
    badgeText: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]',
  },
  pink: {
    accentBar: 'bg-pink-500',
    iconBg: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    iconText: 'text-pink-400',
    badgeBorder: 'border-pink-500/20',
    badgeText: 'text-pink-300',
    badgeBg: 'bg-pink-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(236,72,153,0.15)]',
  },
  teal: {
    accentBar: 'bg-teal-500',
    iconBg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    iconText: 'text-teal-400',
    badgeBorder: 'border-teal-500/20',
    badgeText: 'text-teal-300',
    badgeBg: 'bg-teal-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(20,184,166,0.15)]',
  },
  amber: {
    accentBar: 'bg-amber-500',
    iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    iconText: 'text-amber-400',
    badgeBorder: 'border-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBg: 'bg-amber-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]',
  },
  red: {
    accentBar: 'bg-rose-500',
    iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    iconText: 'text-rose-400',
    badgeBorder: 'border-rose-500/20',
    badgeText: 'text-rose-300',
    badgeBg: 'bg-rose-500/5',
    glow: 'hover:shadow-[0_0_24px_rgba(244,63,94,0.15)]',
  },
};

export function AgentCard({
  agent,
  onLaunch,
  onConfigure,
  onViewTasks,
  className,
}: AgentCardProps) {
  const Icon = agent.icon;
  const colors = colorStyles[agent.color] || colorStyles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
        'transition-all duration-300 shadow-sm hover:border-border/80',
        colors.glow,
        className
      )}
    >
      {/* Top Colored Accent Bar */}
      <div className={cn('h-1.5 w-full', colors.accentBar)} />

      <div className="flex flex-col flex-1 p-5">
        {/* Header: Icon, Name & Status indicator */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                colors.iconBg
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight text-foreground group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {agent.taskCount} tasks completed
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border border-border/50 bg-secondary/60"
            title={`Status: ${agent.status}`}
          >
            {agent.status === 'active' && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 capitalize">Active</span>
              </>
            )}
            {agent.status === 'waiting' && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-amber-400 capitalize">Waiting</span>
              </>
            )}
            {agent.status === 'idle' && (
              <>
                <span className="inline-flex rounded-full h-2 w-2 bg-muted-foreground/60" />
                <span className="text-muted-foreground capitalize">Idle</span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mb-4">
          {agent.description}
        </p>

        {/* Capability Badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors',
                colors.badgeBorder,
                colors.badgeText,
                colors.badgeBg
              )}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Spacer to push metadata & footer down */}
        <div className="flex-1" />

        {/* Metadata info */}
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Active {agent.lastActive}</span>
          </div>
          {onViewTasks && (
            <button
              type="button"
              onClick={() => onViewTasks(agent)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors underline-offset-2 hover:underline"
            >
              <CheckCircle2 className="h-3 w-3 text-primary" />
              <span>Timeline</span>
            </button>
          )}
        </div>

        {/* Actions Footer */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onConfigure?.(agent)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            aria-label={`Configure ${agent.name}`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Configure</span>
          </button>
          <button
            type="button"
            onClick={() => onLaunch?.(agent)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 active:scale-[0.98]"
            aria-label={`Launch ${agent.name}`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

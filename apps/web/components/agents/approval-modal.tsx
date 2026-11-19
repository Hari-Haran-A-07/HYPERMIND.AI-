'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  X,
  ShieldAlert,
  Coins,
  Cpu,
  Target,
  FileCode2,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ActionApprovalDetails {
  agentName: string;
  actionType: string;
  target: string;
  parameters: Record<string, unknown> | string;
  estimatedCost: string;
  riskLevel: RiskLevel;
  summary?: string;
  timestamp?: string;
}

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (details?: ActionApprovalDetails) => void;
  onReject: (details?: ActionApprovalDetails) => void;
  details?: ActionApprovalDetails;
}

const defaultDetails: ActionApprovalDetails = {
  agentName: 'Security & Coding Agent',
  actionType: 'Execute Automated Database Migration & Deploy Script',
  target: 'production-primary-cluster.us-east-1',
  parameters: {
    command: 'terraform apply -auto-approve && psql -f /migrations/042_schema_v2.sql',
    timeoutSeconds: 300,
    rollbackOnFailure: true,
    writeAccessRequired: true,
  },
  estimatedCost: '$0.42 (18.4k tokens + compute)',
  riskLevel: 'high',
  summary:
    'The agent has detected an outdated schema in production and prepared a migration plan. Proceeding will apply schema migrations directly to production databases.',
  timestamp: 'Just now',
};

const riskBadgeConfig: Record<
  RiskLevel,
  { label: string; badgeClass: string; textClass: string; iconClass: string }
> = {
  low: {
    label: 'Low Risk',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    textClass: 'text-emerald-400',
    iconClass: 'text-emerald-400',
  },
  medium: {
    label: 'Medium Risk',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    textClass: 'text-amber-400',
    iconClass: 'text-amber-400',
  },
  high: {
    label: 'High Risk',
    badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    textClass: 'text-rose-400',
    iconClass: 'text-rose-400',
  },
};

export function ApprovalModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  details = defaultDetails,
}: ApprovalModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const risk = riskBadgeConfig[details.riskLevel] || riskBadgeConfig.medium;

  const formattedParams =
    typeof details.parameters === 'string'
      ? details.parameters
      : JSON.stringify(details.parameters, null, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approval-modal-title"
        >
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl rounded-2xl border border-amber-500/30 bg-card p-6 shadow-2xl text-card-foreground z-10"
          >
            {/* Ambient amber glow in top corner */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Close approval modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header with Amber Warning Icon */}
            <div className="flex items-start gap-4 mb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-sm">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Human-in-the-Loop Intercept
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                      risk.badgeClass
                    )}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    {risk.label}
                  </span>
                </div>
                <h2
                  id="approval-modal-title"
                  className="text-lg font-bold tracking-tight text-foreground"
                >
                  Action Requires Human Approval
                </h2>
                <p className="text-xs text-muted-foreground">
                  Agent:{' '}
                  <span className="font-semibold text-foreground">
                    {details.agentName}
                  </span>
                </p>
              </div>
            </div>

            {/* Summary Message */}
            {details.summary && (
              <div className="mb-4 rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs leading-relaxed text-muted-foreground">
                {details.summary}
              </div>
            )}

            {/* Details Grid */}
            <div className="space-y-3 rounded-xl border border-border/70 bg-background/50 p-4 mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Action Type */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Cpu className="h-3.5 w-3.5" />
                    <span className="font-medium">Action Type</span>
                  </div>
                  <p className="font-semibold text-foreground break-words">
                    {details.actionType}
                  </p>
                </div>

                {/* Target */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    <span className="font-medium">Target Resource</span>
                  </div>
                  <p className="font-mono text-[11px] text-foreground bg-secondary/50 px-2 py-1 rounded border border-border/50 truncate">
                    {details.target}
                  </p>
                </div>

                {/* Estimated Cost */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Coins className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-medium">Estimated Impact & Cost</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    {details.estimatedCost}
                  </p>
                </div>
              </div>

              {/* Parameters / Payload */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span className="font-medium">Action Parameters & Payload</span>
                </div>
                <pre className="max-h-36 overflow-auto rounded-lg border border-border/60 bg-background/90 p-3 font-mono text-[11px] leading-snug text-muted-foreground">
                  <code>{formattedParams}</code>
                </pre>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => onReject(details)}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive"
              >
                Reject & Terminate
              </button>
              <button
                type="button"
                onClick={() => onApprove(details)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve Action
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

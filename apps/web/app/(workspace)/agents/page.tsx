'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Globe,
  Code2,
  Calculator,
  GraduationCap,
  Briefcase,
  Palette,
  BarChart3,
  Film,
  Shield,
  Search,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
  ListFilter,
  X,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AgentCard,
  Agent,
  AgentStatus,
  AgentColor,
} from '@/components/agents/agent-card';
import {
  TaskTimeline,
  TaskTimelineItem,
} from '@/components/agents/task-timeline';
import {
  ApprovalModal,
  ActionApprovalDetails,
} from '@/components/agents/approval-modal';

// Detailed mock tasks for each agent
const mockAgentTasks: Record<string, TaskTimelineItem[]> = {
  research: [
    {
      id: 'r-1',
      step: 'Search & Crawl',
      description: 'Crawled 42 academic sources and pre-print archives.',
      status: 'complete',
      duration: '4.2s',
      timestamp: '10:14 AM',
    },
    {
      id: 'r-2',
      step: 'Fact Verification',
      description: 'Cross-verifying empirical citations against peer-reviewed journals.',
      status: 'executing',
      duration: 'In progress',
      timestamp: '10:15 AM',
      details: 'Matching claim embeddings against CrossRef and arXiv database.',
    },
    {
      id: 'r-3',
      step: 'Synthesis & Citation Graph',
      description: 'Generate LaTeX citation bibliography and structured summary.',
      status: 'queued',
      duration: 'Est. 6s',
    },
  ],
  coding: [
    {
      id: 'c-1',
      step: 'AST Parsing',
      description: 'Parsed 14 files in the monorepo workspace.',
      status: 'complete',
      duration: '1.1s',
      timestamp: '09:42 AM',
    },
    {
      id: 'c-2',
      step: 'Unit Test Generation',
      description: 'Generated 18 comprehensive Vitest test suites with 98% branch coverage.',
      status: 'complete',
      duration: '6.4s',
      timestamp: '09:44 AM',
    },
    {
      id: 'c-3',
      step: 'Refactoring & Typecheck',
      description: 'Resolved strict null-safety and eliminated 4 circular imports.',
      status: 'complete',
      duration: '3.8s',
      timestamp: '09:45 AM',
    },
  ],
  security: [
    {
      id: 's-1',
      step: 'Vulnerability Scan',
      description: 'Static analysis of package.json and rust crate dependencies.',
      status: 'complete',
      duration: '2.5s',
      timestamp: '11:02 AM',
    },
    {
      id: 's-2',
      step: 'Database Migration Policy Audit',
      description: 'Found high-risk write operation on production database.',
      status: 'executing',
      duration: 'Halted for approval',
      timestamp: '11:05 AM',
      details: 'Awaiting operator sign-off before executing schema migration.',
    },
    {
      id: 's-3',
      step: 'Penetration Simulation',
      description: 'Simulate privilege escalation vector on auth endpoints.',
      status: 'queued',
      duration: 'Est. 12s',
    },
  ],
  cinema: [
    {
      id: 'cin-1',
      step: 'Script Scene Breakdown',
      description: 'Extracted 12 cinematic scenes and emotional beats from screenplay.',
      status: 'complete',
      duration: '3.1s',
      timestamp: '08:30 AM',
    },
    {
      id: 'cin-2',
      step: 'Lens & Shot Framing Calculation',
      description: 'Computed 35mm anamorphic camera angles and lighting setups.',
      status: 'executing',
      duration: 'Generating',
      timestamp: '08:32 AM',
    },
  ],
};

const initialAgents: Agent[] = [
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Deep web research and citation synthesis across scholarly and real-time sources.',
    icon: Globe,
    color: 'blue' as AgentColor,
    capabilities: ['web search', 'fact verification', 'report generation'],
    status: 'active' as AgentStatus,
    taskCount: 9,
    lastActive: '2m ago',
    recentTasks: [
      { id: '1', name: 'Synthesizing Quantum ML Literature', status: 'executing', timestamp: '2m ago' },
      { id: '2', name: 'Fact-checked Medical Dataset', status: 'complete', timestamp: '1h ago' },
    ],
  },
  {
    id: 'coding',
    name: 'Coding Agent',
    description: 'Autonomous code generation, intelligent review, automated debugging, and architectural refactoring.',
    icon: Code2,
    color: 'green' as AgentColor,
    capabilities: ['code gen', 'code review', 'testing', 'refactoring'],
    status: 'active' as AgentStatus,
    taskCount: 14,
    lastActive: 'Just now',
    recentTasks: [
      { id: '1', name: 'Generated OAuth2 session layer', status: 'complete', timestamp: 'Just now' },
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics Agent',
    description: 'Advanced mathematical computation, formal symbolic proofs, and numerical visualization.',
    icon: Calculator,
    color: 'orange' as AgentColor,
    capabilities: ['algebra', 'calculus', 'statistics', 'visualization'],
    status: 'idle' as AgentStatus,
    taskCount: 5,
    lastActive: '3h ago',
  },
  {
    id: 'education',
    name: 'Education Agent',
    description: 'Personalized adaptive learning pathways, automated quiz generation, and conceptual explanations.',
    icon: GraduationCap,
    color: 'purple' as AgentColor,
    capabilities: ['curriculum design', 'quiz generation', 'explanations'],
    status: 'idle' as AgentStatus,
    taskCount: 4,
    lastActive: '5h ago',
  },
  {
    id: 'business',
    name: 'Business Agent',
    description: 'Strategic market analysis, competitive intelligence, and executive financial modeling.',
    icon: Briefcase,
    color: 'indigo' as AgentColor,
    capabilities: ['market analysis', 'financial modeling', 'presentations'],
    status: 'waiting' as AgentStatus,
    taskCount: 6,
    lastActive: '12m ago',
  },
  {
    id: 'creative',
    name: 'Creative Agent',
    description: 'Multidisciplinary creative writing, narrative storytelling, and rapid content ideation.',
    icon: Palette,
    color: 'pink' as AgentColor,
    capabilities: ['writing', 'storytelling', 'copywriting', 'brainstorming'],
    status: 'idle' as AgentStatus,
    taskCount: 3,
    lastActive: '1d ago',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis Agent',
    description: 'High-throughput data cleaning, statistical pattern recognition, and interactive charting.',
    icon: BarChart3,
    color: 'teal' as AgentColor,
    capabilities: ['data cleaning', 'statistical analysis', 'charting'],
    status: 'idle' as AgentStatus,
    taskCount: 8,
    lastActive: '4h ago',
  },
  {
    id: 'cinema-production',
    name: 'Cinema Production Agent',
    description: 'Film and video production assistance, script breakdown, shot planning, and storyboard curation.',
    icon: Film,
    color: 'amber' as AgentColor,
    capabilities: ['scriptwriting', 'shot planning', 'storyboarding'],
    status: 'active' as AgentStatus,
    taskCount: 5,
    lastActive: '8m ago',
  },
  {
    id: 'security',
    name: 'Security Agent',
    description: 'Automated vulnerability scanning, source code auditing, threat modeling, and regulatory compliance.',
    icon: Shield,
    color: 'red' as AgentColor,
    capabilities: ['code audit', 'threat modeling', 'compliance'],
    status: 'waiting' as AgentStatus,
    taskCount: 7,
    lastActive: '4m ago',
  },
];

export default function AgentsDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AgentStatus>('all');
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [selectedAgentForTimeline, setSelectedAgentForTimeline] = useState<Agent | null>(null);

  // Approval modal item details
  const [approvalDetails, setApprovalDetails] = useState<ActionApprovalDetails>({
    agentName: 'Security Agent',
    actionType: 'Apply High-Privilege Production Patch',
    target: 'db-cluster-primary-01.us-east.hypermind.internal',
    parameters: {
      action: 'ALTER TABLE users ADD COLUMN security_stamp VARCHAR(64)',
      lockTimeout: '5000ms',
      isolationLevel: 'SERIALIZABLE',
      rollbackPlan: 'DROP COLUMN IF EXISTS security_stamp',
    },
    estimatedCost: '$0.00 (Infrastructure script run)',
    riskLevel: 'high',
    summary:
      'Security Agent detected an urgent vulnerability mitigation requiring immediate schema augmentation. This modifies active tables.',
  });

  // Calculate live stats
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const tasksCompleted = agents.reduce((acc, a) => acc + a.taskCount, 0);
  const pendingApproval = agents.filter((a) => a.status === 'waiting').length;

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some((cap) =>
          cap.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus =
        statusFilter === 'all' ? true : agent.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, statusFilter]);

  const handleLaunchAgent = (agent: Agent) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agent.id
          ? {
              ...a,
              status: 'active' as AgentStatus,
              taskCount: a.taskCount + 1,
              lastActive: 'Just now',
            }
          : a
      )
    );
    toast.success(`Launched ${agent.name}`, {
      description: 'Agent initiated execution pipeline and initialized resources.',
    });
  };

  const handleConfigureAgent = (agent: Agent) => {
    toast.info(`Configure ${agent.name}`, {
      description: 'Agent parameters, autonomy boundaries, and API keys are ready for configuration.',
    });
  };

  const handleOpenTimeline = (agent: Agent) => {
    setSelectedAgentForTimeline(agent);
  };

  const handleApproveAction = (details?: ActionApprovalDetails) => {
    setIsApprovalOpen(false);
    toast.success('Action approved', {
      description: `Executed '${details?.actionType || 'Action'}' on target resource.`,
    });
    // Transition waiting security agent to active
    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'security'
          ? { ...a, status: 'active', taskCount: a.taskCount + 1 }
          : a
      )
    );
  };

  const handleRejectAction = (details?: ActionApprovalDetails) => {
    setIsApprovalOpen(false);
    toast.error('Action rejected & terminated', {
      description: `Operator terminated task '${details?.actionType || 'Action'}'.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Banner / Header */}
      <div className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
                <Brain className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  AI Agent Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Orchestrate, monitor, and deploy autonomous specialized intelligence agents.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              {pendingApproval > 0 && (
                <button
                  type="button"
                  onClick={() => setIsApprovalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Review Approvals ({pendingApproval})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  toast.info('New Agent Builder', {
                    description: 'Custom agent blueprint generator will be available in next release.',
                  })
                }
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Plus className="h-4 w-4" />
                <span>Deploy Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Stats Row */}
        <section
          aria-label="Dashboard statistics"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Total Agents */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Agents
              </span>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                {totalAgents}
              </p>
              <p className="text-[11px] text-muted-foreground">9 specialized models</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/50 text-foreground">
              <Brain className="h-5 w-5" />
            </div>
          </div>

          {/* Active Agents */}
          <div className="rounded-xl border border-emerald-500/30 bg-card p-4 sm:p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Active Now
              </span>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 font-mono">
                {activeAgents}
              </p>
              <p className="text-[11px] text-muted-foreground">Running concurrent jobs</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tasks Completed
              </span>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                {tasksCompleted}
              </p>
              <p className="text-[11px] text-muted-foreground">All-time executions</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/50 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          {/* Pending Approval */}
          <div
            onClick={() => setIsApprovalOpen(true)}
            className="cursor-pointer rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 sm:p-5 flex items-center justify-between shadow-sm hover:border-amber-500/60 transition-all"
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                Pending Approval
              </span>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-400 font-mono">
                {pendingApproval}
              </p>
              <p className="text-[11px] text-amber-300/80">Requires human intervention</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 border border-border/80 p-3 rounded-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by agent name, capability, or domain..."
              className="w-full rounded-lg border border-border/80 bg-background/80 py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-muted-foreground flex items-center gap-1 pl-1 pr-1.5 font-medium">
              <ListFilter className="h-3.5 w-3.5" />
              <span>Status:</span>
            </span>
            {(['all', 'active', 'idle', 'waiting'] as const).map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Agents Grid */}
        <section aria-label="Specialized AI agents list">
          {filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/30">
              <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No agents match your criteria</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Try searching for another keyword or clear the status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-4 text-xs font-semibold text-primary underline underline-offset-4"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onLaunch={handleLaunchAgent}
                  onConfigure={handleConfigureAgent}
                  onViewTasks={handleOpenTimeline}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Task Timeline Slide-over / Modal */}
      <AnimatePresence>
        {selectedAgentForTimeline && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgentForTimeline(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl text-card-foreground z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
                    {React.createElement(selectedAgentForTimeline.icon, {
                      className: 'h-5 w-5 text-primary',
                    })}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      {selectedAgentForTimeline.name} Timeline
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Live execution steps & checkpoint verification
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAgentForTimeline(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <TaskTimeline
                  tasks={
                    mockAgentTasks[selectedAgentForTimeline.id] || [
                      {
                        step: 'Task Execution Initialization',
                        description: `Agent ${selectedAgentForTimeline.name} initialized runtime environment.`,
                        status: 'complete',
                        duration: '0.8s',
                        timestamp: selectedAgentForTimeline.lastActive,
                      },
                      {
                        step: 'Routine Processing',
                        description: 'Processing active operational queue with zero errors.',
                        status:
                          selectedAgentForTimeline.status === 'active'
                            ? 'executing'
                            : 'complete',
                        duration: '1.4s',
                      },
                    ]
                  }
                />
              </div>

              <div className="mt-4 pt-3 border-t border-border/70 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAgentForTimeline(null)}
                  className="rounded-lg bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80"
                >
                  Close Timeline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Human Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onApprove={handleApproveAction}
        onReject={handleRejectAction}
        details={approvalDetails}
      />
    </div>
  );
}

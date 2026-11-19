import { DEFAULT_MODEL_ID } from './models';

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  modelId?: string;
  attachments?: ChatAttachment[];
  status?: 'sent' | 'delivered' | 'streaming';
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  updatedAt: string;
  createdAt: string;
  isPinned?: boolean;
  messages: ChatMessage[];
  snippet?: string;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  category: 'Coding' | 'Architecture' | 'Reasoning' | 'Strategy' | 'Science' | 'Security';
  prompt: string;
  icon: string;
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  modelId: string;
  updatedAt: string;
}

export interface GroupedConversations {
  pinned: Conversation[];
  today: Conversation[];
  previous7Days: Conversation[];
  older: Conversation[];
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'prompt-1',
    title: 'Microservices & Event Mesh',
    description: 'Architect an event-driven system with Kafka, Redis, and idempotent consumers.',
    category: 'Architecture',
    prompt:
      'Design a resilient event-driven microservices architecture using Kafka and Redis for order fulfillment. Detail idempotency keys, outbox pattern, dead-letter queues, and state rollback mechanisms.',
    icon: 'Network',
  },
  {
    id: 'prompt-2',
    title: 'SaaS DCF & Unit Economics',
    description: 'Construct a comprehensive valuation model evaluating NRR and CAC payback.',
    category: 'Strategy',
    prompt:
      'Construct a discounted cash flow (DCF) valuation model template in Python for a high-growth B2B SaaS startup with $12M ARR. Include sensitivity tables for net revenue retention (NRR) and CAC payback months.',
    icon: 'TrendingUp',
  },
  {
    id: 'prompt-3',
    title: 'Rust High-Concurrency Server',
    description: 'Build an ultra-low latency HTTP server with Axum, Tokio, and connection pooling.',
    category: 'Coding',
    prompt:
      'Write a production-ready asynchronous Rust web service using Axum and Tokio. Implement graceful shutdown, token-bucket rate limiting middleware, structured JSON logging with tracing, and connection pooling.',
    icon: 'Code2',
  },
  {
    id: 'prompt-4',
    title: 'Chain-of-Thought Math Verification',
    description: 'Verify convergence proofs for convex optimization on Lipschitz continuous surfaces.',
    category: 'Reasoning',
    prompt:
      'Derive and prove the convergence rate of Gradient Descent on an L-smooth and mu-strongly convex objective function. Highlight how the condition number affects step-size bounds and geometric contraction.',
    icon: 'Brain',
  },
  {
    id: 'prompt-5',
    title: 'Quantum Surface Code Explainer',
    description: 'Break down topological quantum error correction and syndromic stabilizer measurements.',
    category: 'Science',
    prompt:
      'Explain topological quantum error correction using the 2D surface code to a senior software engineer. Contrast physical vs logical qubits, X/Z stabilizers, and minimum-weight perfect matching decoders.',
    icon: 'Atom',
  },
  {
    id: 'prompt-6',
    title: 'Zero-Trust OAuth2 & JWT Audit',
    description: 'Conduct a threat modeling assessment for PKCE and distributed token revocation.',
    category: 'Security',
    prompt:
      'Perform a comprehensive security threat model for an OAuth2.1 Authorization Code Flow with PKCE. Address JWT replay attacks, refresh token rotation with family detection, and distributed revocation across edge gateways.',
    icon: 'ShieldCheck',
  },
];

export const MOCK_AGENT_TASKS: AgentTask[] = [
  {
    id: 'task-1',
    title: 'Autonomous Competitive Intelligence Sweep',
    description: 'Scraping SEC 10-K filings and synthesis of enterprise AI product roadmaps.',
    status: 'running',
    progress: 74,
    modelId: 'claude-3-5-sonnet',
    updatedAt: '2026-11-18T14:45:00Z',
  },
  {
    id: 'task-2',
    title: 'Legacy Monolith to Next.js 14 Migration',
    description: 'Automated codemod rewriting Webpack configs and Pages router to App Router.',
    status: 'completed',
    progress: 100,
    modelId: 'gpt-4o',
    updatedAt: '2026-11-18T12:20:00Z',
  },
  {
    id: 'task-3',
    title: 'Multi-Modal Vector Embedding Pipeline',
    description: 'Indexing 40,000 architectural blueprints and technical spec documents.',
    status: 'running',
    progress: 38,
    modelId: 'gemini-1-5-pro',
    updatedAt: '2026-11-18T15:10:00Z',
  },
  {
    id: 'task-4',
    title: 'Formal Rust Kernel Verification',
    description: 'Verifying lock-free memory reclamation invariants in concurrent ring buffer.',
    status: 'queued',
    progress: 0,
    modelId: 'deepseek-r1',
    updatedAt: '2026-11-18T10:00:00Z',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  // 1. Pinned Conversation
  {
    id: 'conv-1',
    title: 'Autonomous Multi-Agent Architecture Design',
    modelId: 'claude-3-5-sonnet',
    createdAt: '2026-11-18T09:00:00Z',
    updatedAt: '2026-11-18T15:30:00Z',
    isPinned: true,
    snippet: 'Architecting an enterprise multi-agent swarm with consensus loops and vector memory.',
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        createdAt: '2026-11-18T09:00:00Z',
        content:
          'Can you design a scalable autonomous multi-agent system architecture for enterprise automation? Include orchestrator patterns, memory persistence, and communication protocols.',
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        createdAt: '2026-11-18T09:01:15Z',
        modelId: 'claude-3-5-sonnet',
        content: `### Enterprise Multi-Agent Swarm Architecture

To achieve fault-tolerant, autonomous coordination at enterprise scale, we separate concerns across **three core tiers**:

1. **Cognitive Orchestration Tier**: A master meta-agent with hierarchical state-machine decomposition.
2. **Episodic & Semantic Memory Plane**: Hybrid vector storage paired with transactional key-value stores.
3. **Reactive Event Fabric**: High-throughput Pub/Sub for asynchronous actor-model communication.

#### Core Orchestrator Implementation

Here is a resilient TypeScript implementation using the **Actor-Orchestrator** model:

\`\`\`typescript
import { EventEmitter } from 'node:events';

export interface AgentTask {
  id: string;
  agentType: 'coder' | 'researcher' | 'verifier';
  payload: Record<string, unknown>;
  timeoutMs: number;
}

export interface TaskResult {
  taskId: string;
  confidenceScore: number;
  output: unknown;
}

export class AgentOrchestrator extends EventEmitter {
  private activePool = new Map<string, AgentTask>();
  private memoryStore: Map<string, unknown> = new Map();

  async dispatchTask(task: AgentTask): Promise<TaskResult> {
    this.activePool.set(task.id, task);
    this.emit('task:dispatched', { taskId: task.id, agent: task.agentType });

    // Speculative execution with watchdog timer
    const result = await Promise.race([
      this.executeAgentWorker(task),
      this.createTimeout(task.timeoutMs, task.id),
    ]);

    this.activePool.delete(task.id);
    return result;
  }

  private async executeAgentWorker(task: AgentTask): Promise<TaskResult> {
    // Simulated specialized subagent execution
    return {
      taskId: task.id,
      confidenceScore: 0.96,
      output: { status: 'verified', timestamp: Date.now() },
    };
  }

  private createTimeout(ms: number, id: string): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(\`Task \${id} timed out after \${ms}ms\`)), ms)
    );
  }
}
\`\`\`

#### Architectural Guarantees:
- **Idempotency**: Every subagent invocation carries a cryptographic nonce and parent trace ID.
- **Fail-Fast Quarantine**: Agents producing confidence scores $< 0.85$ trigger a secondary verification pass.
- **Audit Trails**: Full token trajectories are streamed directly to append-only cold storage.`,
      },
      {
        id: 'msg-1-3',
        role: 'user',
        createdAt: '2026-11-18T09:04:30Z',
        content:
          'How does the consensus mechanism prevent agent hallucinations when coordinating between 5+ specialized subagents?',
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        createdAt: '2026-11-18T09:06:10Z',
        modelId: 'claude-3-5-sonnet',
        content: `### Byzantine Consensus & Hallucination Mitigation

When multiple autonomous agents communicate, compounding hallucination is the single greatest risk. We employ a **dual-stage Byzantine Fault Tolerant (BFT) validation loop**:

1. **Cross-Agent Semantic Divergence Metric**: Agents execute independently in isolation, generating independent intermediate chain-of-thought traces.
2. **Majority Voting Ensemble with Formal Verification**:

\`\`\`python
from typing import List, Dict, Any
import numpy as np

class MajorityVotingEnsemble:
    def __init__(self, agreement_threshold: float = 0.80):
        self.agreement_threshold = agreement_threshold

    def evaluate_swarm_consensus(self, agent_outputs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates pairwise cosine similarity of semantic embeddings
        and extracts median agreement trajectory.
        """
        embeddings = [np.array(item["embedding"]) for item in agent_outputs]
        n = len(embeddings)
        similarity_matrix = np.zeros((n, n))

        for i in range(n):
            for j in range(n):
                norm_i = np.linalg.norm(embeddings[i])
                norm_j = np.linalg.norm(embeddings[j])
                similarity_matrix[i][j] = np.dot(embeddings[i], embeddings[j]) / (norm_i * norm_j)

        mean_agreement = np.mean(similarity_matrix, axis=1)
        best_candidate_idx = int(np.argmax(mean_agreement))

        if mean_agreement[best_candidate_idx] < self.agreement_threshold:
            return {
                "consensus_reached": False,
                "action": "TRIGGER_SUPERVISOR_FALLBACK",
                "divergence_score": float(1.0 - mean_agreement[best_candidate_idx]),
            }

        return {
            "consensus_reached": True,
            "chosen_output": agent_outputs[best_candidate_idx]["content"],
            "confidence": float(mean_agreement[best_candidate_idx]),
        }
\`\`\`

#### Key Mechanisms:
- **Zero-Trust Cross Examination**: The Coder Agent cannot verify its own code; a separate Verifier Agent runs abstract syntax tree (AST) static analysis.
- **Grounding Against Known Truths**: Vector database citations require strict URL and hash verification.`,
      },
      {
        id: 'msg-1-5',
        role: 'user',
        createdAt: '2026-11-18T09:10:00Z',
        content:
          'What are the latency implications for real-time customer support using this pattern?',
      },
      {
        id: 'msg-1-6',
        role: 'assistant',
        createdAt: '2026-11-18T09:11:45Z',
        modelId: 'claude-3-5-sonnet',
        content: `### Latency Tradeoffs & Speculative Streaming

For real-time human interaction (target: **$< 800\\text{ ms}$ TTFT**), full consensus across 5 agents is too slow if executed sequentially. Here is the operational breakdown:

| Execution Model | P50 Latency | P99 Latency | Hallucination Rate | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Direct Single Agent** | 420 ms | 1,200 ms | 6.8% | Low-risk FAQ inquiry |
| **Speculative Streaming** | 510 ms | 1,450 ms | 1.2% | Standard customer support |
| **Hierarchical Swarm** | 2,800 ms | 5,400 ms | < 0.1% | Billing & contract actions |

#### The Speculative Streaming Solution
1. **Tier-1 Fast Agent** (e.g., Claude 3.5 Haiku or GPT-4o-mini) immediately starts streaming the conversational greeting and initial response chunk.
2. In parallel, a **Background Auditor** verifies token safety and factual claims.
3. If the Auditor spots a factual divergence, an inline patch or polite clarification is seamlessly inserted before high-impact transaction commits occur.`,
      },
    ],
  },

  // 2. Today: Next.js 14 Server Actions
  {
    id: 'conv-2',
    title: 'Next.js 14 Server Actions & Optimistic UI',
    modelId: 'gpt-4o',
    createdAt: '2026-11-18T14:15:00Z',
    updatedAt: '2026-11-18T14:40:00Z',
    snippet: 'Implementing zero-latency optimistic updates with useOptimistic and Server Actions.',
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        createdAt: '2026-11-18T14:15:00Z',
        content:
          'How do I implement optimistic updates with Next.js 14 App Router server actions and React useOptimistic hook?',
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        createdAt: '2026-11-18T14:16:30Z',
        modelId: 'gpt-4o',
        content: `### Zero-Flicker Optimistic UI in Next.js 14

React 18's \`useOptimistic\` hook allows you to immediately reflect user actions in the UI while the asynchronous Server Action runs in the background.

Here is an end-to-end implementation for a task management interface:

\`\`\`tsx
'use client';

import { useOptimistic, useTransition, useRef } from 'react';
import { toggleTaskAction } from '@/app/actions/tasks';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (currentTasks, updatedTask: { id: string; completed: boolean }) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? { ...task, completed: updatedTask.completed }
          : task
      )
  );

  const handleToggle = async (task: Task) => {
    const nextState = !task.completed;

    startTransition(async () => {
      // 1. Instantly update client view
      setOptimisticTasks({ id: task.id, completed: nextState });

      // 2. Fire Server Action in parallel
      const result = await toggleTaskAction(task.id, nextState);
      if (!result.success) {
        console.error('Failed to persist task update');
      }
    });
  };

  return (
    <ul className="space-y-2">
      {optimisticTasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle(task)}
            className="w-4 h-4 accent-primary"
          />
          <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}>
            {task.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

#### Best Practices:
- Always wrap state mutations inside **\`startTransition\`** to ensure React can reconcile interruptions smoothly.
- When the server responds with revalidated data, React automatically reconciles the optimistic state with the authoritative server payload.`,
      },
      {
        id: 'msg-2-3',
        role: 'user',
        createdAt: '2026-11-18T14:22:00Z',
        content:
          'What happens if the server action throws an error or fails network validation?',
      },
      {
        id: 'msg-2-4',
        role: 'assistant',
        createdAt: '2026-11-18T14:23:45Z',
        modelId: 'gpt-4o',
        content: `### Rollback & Graceful Error Recovery

When a Server Action throws an unhandled error:
1. React's \`startTransition\` context automatically **reverts the optimistic state** back to the canonical \`initialTasks\` value.
2. The UI snaps back to its prior truthful state without manual cleanup code.

To give users clear feedback instead of silent failure, capture the action result and fire a notification:

\`\`\`typescript
import { toast } from 'sonner';

startTransition(async () => {
  setOptimisticTasks({ id: task.id, completed: nextState });

  try {
    const response = await toggleTaskAction(task.id, nextState);
    if (!response.success) {
      throw new Error(response.message || 'Operation rejected');
    }
  } catch (error) {
    // UI auto-reverts at this step
    toast.error('Unable to update task. Changes were rolled back.', {
      action: {
        label: 'Retry',
        onClick: () => handleToggle(task),
      },
    });
  }
});
\`\`\``,
      },
      {
        id: 'msg-2-5',
        role: 'user',
        createdAt: '2026-11-18T14:28:10Z',
        content:
          'Can you show how this integrates with Zustand for global state?',
      },
      {
        id: 'msg-2-6',
        role: 'assistant',
        createdAt: '2026-11-18T14:30:00Z',
        modelId: 'gpt-4o',
        content: `### Zustand + Next.js 14 Optimistic Synchronization

If your application manages a multi-component global cache, you can pair Zustand with an optimistic rollback snapshot:

\`\`\`typescript
import { create } from 'zustand';

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  optimisticToggle: (taskId: string, completed: boolean) => () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  optimisticToggle: (taskId, completed) => {
    const previous = get().tasks;

    // Mutate immediately
    set({
      tasks: previous.map((t) => (t.id === taskId ? { ...t, completed } : t)),
    });

    // Return rollback callback
    return () => set({ tasks: previous });
  },
}));
\`\`\`

You can invoke this inside any component, storing the rollback callback until the Server Action resolves or rejects!`,
      },
    ],
  },

  // 3. Today: Financial DCF Model
  {
    id: 'conv-3',
    title: 'Financial Model & DCF Valuation for SaaS',
    modelId: 'gemini-1-5-pro',
    createdAt: '2026-11-18T11:00:00Z',
    updatedAt: '2026-11-18T12:45:00Z',
    snippet: 'Comprehensive 5-year discounted cash flow valuation with Gordon Growth and EV/ARR multiples.',
    messages: [
      {
        id: 'msg-3-1',
        role: 'user',
        createdAt: '2026-11-18T11:00:00Z',
        content:
          'Build a discounted cash flow (DCF) model template in Python for a B2B SaaS startup with $10M ARR growing at 45% YoY.',
      },
      {
        id: 'msg-3-2',
        role: 'assistant',
        createdAt: '2026-11-18T11:02:15Z',
        modelId: 'gemini-1-5-pro',
        content: `### 5-Year SaaS DCF Valuation Engine

Below is a complete, parameterized Python financial model calculating Unlevered Free Cash Flow (UFCF), Terminal Value, and Enterprise Value (EV).

\`\`\`python
import numpy as np
import pandas as pd

def calculate_saas_dcf(
    initial_arr: float = 10.0,    # $ millions
    growth_rates: list = [0.45, 0.35, 0.28, 0.22, 0.18],
    gross_margin: float = 0.78,
    wacc: float = 0.115,          # 11.5% discount rate
    terminal_growth: float = 0.035, # 3.5% perpetual growth
    tax_rate: float = 0.21,
) -> dict:
    years = [f"Year {i+1}" for i in range(len(growth_rates))]
    arr_trajectory = []
    current_arr = initial_arr

    for g in growth_rates:
        current_arr *= (1 + g)
        arr_trajectory.append(current_arr)

    # Cash Flow Assumptions (% of Revenue)
    # Scaling operating leverage over time:
    fcf_margins = [-0.10, -0.02, 0.08, 0.16, 0.22]

    fcf_projected = [arr * margin for arr, margin in zip(arr_trajectory, fcf_margins)]
    discount_factors = [1 / ((1 + wacc) ** (i + 1)) for i in range(len(growth_rates))]
    pv_fcf = [fcf * df for fcf, df in zip(fcf_projected, discount_factors)]

    # Terminal Value (Gordon Growth Method)
    terminal_year_fcf = fcf_projected[-1] * (1 + terminal_growth)
    terminal_value = terminal_year_fcf / (wacc - terminal_growth)
    pv_terminal_value = terminal_value * discount_factors[-1]

    enterprise_value = sum(pv_fcf) + pv_terminal_value

    summary_df = pd.DataFrame({
        "ARR ($M)": arr_trajectory,
        "FCF Margin": fcf_margins,
        "FCF ($M)": fcf_projected,
        "Discount Factor": discount_factors,
        "PV of FCF ($M)": pv_fcf,
    }, index=years)

    return {
        "summary": summary_df,
        "enterprise_value": enterprise_value,
        "pv_fcf_sum": sum(pv_fcf),
        "pv_terminal_val": pv_terminal_value,
    }

results = calculate_saas_dcf()
print(f"Enterprise Value: \${results['enterprise_value']:.2f}M")
\`\`\`

#### Key Assumptions:
- **Operating Leverage**: As R&D and S&M scale from $65\\%$ of revenue down to $42\\%$, FCF inflects to positive $22\\%$ by Year 5.
- **Terminal Value Dominance**: Typical for early growth software, representing $70-80\\%$ of total Enterprise Value.`,
      },
      {
        id: 'msg-3-3',
        role: 'user',
        createdAt: '2026-11-18T11:10:00Z',
        content:
          'Calculate the Terminal Value using both the Gordon Growth model and EV/EBITDA multiple method.',
      },
      {
        id: 'msg-3-4',
        role: 'assistant',
        createdAt: '2026-11-18T11:12:30Z',
        modelId: 'gemini-1-5-pro',
        content: `### Gordon Growth vs. Exit Multiple Method

Comparing both methods creates an authoritative valuation bracket:

#### 1. Gordon Growth Model (Perpetual)
$$\\text{TV} = \\frac{\\text{FCF}_5 \\times (1 + g)}{\\text{WACC} - g}$$
Using $\\text{FCF}_5 = \\$7.41\\text{M}$, $\\text{WACC} = 11.5\\%$, $g = 3.5\\%$:
$$\\text{TV} = \\frac{7.41 \\times 1.035}{0.115 - 0.035} = \\frac{7.67}{0.08} = \\mathbf{\\$95.88\\text{M}}$$
$$\\text{PV of TV} = \\$95.88\\text{M} \\times 0.5802 = \\mathbf{\\$55.63\\text{M}}$$

#### 2. EV / EBITDA Multiple Method
At Year 5, normalized EBITDA margin is typically $24\\%$ on $\\approx \\$33.7\\text{M}$ ARR ($=\\$8.08\\text{M}$ EBITDA).
Applying an industry median exit multiple of **$14.0\\times$**:
$$\\text{TV} = \\$8.08\\text{M} \\times 14.0 = \\mathbf{\\$113.12\\text{M}}$$
$$\\text{PV of TV} = \\$113.12\\text{M} \\times 0.5802 = \\mathbf{\\$65.63\\text{M}}$$

#### Sensitivity Matrix:
| Exit Multiple | Discount Rate 10.0% | Discount Rate 11.5% | Discount Rate 13.0% |
| :--- | :--- | :--- | :--- |
| **12.0x** | $60.2M | $56.3M | $52.7M |
| **14.0x** | $70.2M | $65.6M | $61.5M |
| **16.0x** | $80.3M | $75.0M | $70.2M |`,
      },
      {
        id: 'msg-3-5',
        role: 'user',
        createdAt: '2026-11-18T11:18:20Z',
        content:
          'How do net retention rate (NRR) and CAC payback period impact these terminal valuations?',
      },
      {
        id: 'msg-3-6',
        role: 'assistant',
        createdAt: '2026-11-18T11:20:10Z',
        modelId: 'gemini-1-5-pro',
        content: `### High NRR as an Exponential Multiplier

Net Retention Rate (NRR) and CAC Payback dictate the slope of margin expansion:

1. **NRR $> 120\\%$ (Best in Class)**:
   - Growth is funded organically by existing cohorts without incremental ad spend.
   - S&M efficiency doubles, cutting CAC payback to $< 10$ months.
   - Year 5 FCF margins reach $25-28\\%$, justifying exit multiples $> 18\\times$.

2. **NRR $< 95\\%$ (Leaky Bucket)**:
   - The company must continuously acquire replacement revenue just to remain flat.
   - FCF struggles to turn positive, reducing terminal EV by upwards of $45\\%$.`,
      },
    ],
  },

  // 4. Previous 7 days: DeepSeek-R1 Mathematical Proof
  {
    id: 'conv-4',
    title: 'DeepSeek-R1 Mathematical Proof Verification',
    modelId: 'deepseek-r1',
    createdAt: '2026-11-15T16:20:00Z',
    updatedAt: '2026-11-15T17:15:00Z',
    snippet: 'Step-by-step chain-of-thought verification for convex optimization convergence theorems.',
    messages: [
      {
        id: 'msg-4-1',
        role: 'user',
        createdAt: '2026-11-15T16:20:00Z',
        content:
          'Verify this proof regarding the convergence of gradient descent on strongly convex and Lipschitz-smooth functions.',
      },
      {
        id: 'msg-4-2',
        role: 'assistant',
        createdAt: '2026-11-15T16:22:15Z',
        modelId: 'deepseek-r1',
        content: `### Formal Convergence Verification

<think>
Let $f: \\mathbb{R}^d \\to \\mathbb{R}$ be continuously differentiable.
Assume $f$ is:
1. $L$-Lipschitz smooth: $\\|\\nabla f(x) - \\nabla f(y)\\| \\le L\\|x - y\\|$ for all $x,y$.
2. $\\mu$-strongly convex: $f(y) \\ge f(x) + \\langle \\nabla f(x), y - x \\rangle + \\frac{\\mu}{2}\\|y - x\\|^2$.

We analyze standard gradient descent update:
$x_{k+1} = x_k - \\eta \\nabla f(x_k)$, with optimal step size $\\eta = \\frac{2}{L + \\mu}$.
Let $x^*$ denote the unique global minimizer such that $\\nabla f(x^*) = 0$.
</think>

#### Step-by-Step Derivation

From the co-coercivity of gradients on $L$-smooth, $\\mu$-strongly convex functions:
$$\\langle \\nabla f(x) - \\nabla f(y), x - y \\rangle \\ge \\frac{L\\mu}{L + \\mu}\\|x - y\\|^2 + \\frac{1}{L + \\mu}\\|\\nabla f(x) - \\nabla f(y)\\|^2$$

Substitute $y = x^*$ (recalling $\\nabla f(x^*) = 0$):
$$\\langle \\nabla f(x_k), x_k - x^* \\rangle \\ge \\frac{L\\mu}{L + \\mu}\\|x_k - x^*\\|^2 + \\frac{1}{L + \\mu}\\|\\nabla f(x_k)\\|^2$$

Now, evaluate the distance to the optimum at step $k+1$:
$$\\|x_{k+1} - x^*\\|^2 = \\|x_k - \\eta \\nabla f(x_k) - x^*\\|^2$$
$$= \\|x_k - x^*\\|^2 - 2\\eta \\langle \\nabla f(x_k), x_k - x^* \\rangle + \\eta^2 \\|\\nabla f(x_k)\\|^2$$

Substitute the co-coercivity lower bound:
$$\\|x_{k+1} - x^*\\|^2 \\le \\left(1 - \\frac{2\\eta L\\mu}{L+\\mu}\\right)\\|x_k - x^*\\|^2 + \\left(\\eta^2 - \\frac{2\\eta}{L+\\mu}\\right)\\|\\nabla f(x_k)\\|^2$$

Choosing the optimal fixed learning rate $\\eta = \\frac{2}{L + \\mu}$:
$$\\eta^2 - \\frac{2\\eta}{L+\\mu} = \\left(\\frac{2}{L+\\mu}\\right)^2 - \\frac{4}{(L+\\mu)^2} = 0$$

The gradient norm term vanishes exactly! The contraction coefficient simplifies to:
$$1 - \\frac{2 \\left(\\frac{2}{L+\\mu}\\right) L\\mu}{L+\\mu} = 1 - \\frac{4L\\mu}{(L+\\mu)^2} = \\left(\\frac{L - \\mu}{L + \\mu}\\right)^2$$

Therefore:
$$\\|x_{k+1} - x^*\\| \\le \\left(\\frac{L - \\mu}{L + \\mu}\\right) \\|x_k - x^*\\| = \\left(\\frac{\\kappa - 1}{\\kappa + 1}\\right) \\|x_k - x^*\\|$$
where $\\kappa = \\frac{L}{\\mu}$ is the condition number. **Q.E.D.**`,
      },
      {
        id: 'msg-4-3',
        role: 'user',
        createdAt: '2026-11-15T16:30:00Z',
        content:
          'What changes if the condition number kappa is arbitrarily large?',
      },
      {
        id: 'msg-4-4',
        role: 'assistant',
        createdAt: '2026-11-15T16:32:00Z',
        modelId: 'deepseek-r1',
        content: `### High Condition Number Breakdown

As $\\kappa \\to \\infty$, the convergence factor approaches:
$$\\frac{\\kappa - 1}{\\kappa + 1} = 1 - \\frac{2}{\\kappa + 1} \\approx 1 - \\frac{2}{\\kappa}$$

To achieve an $\\epsilon$-accurate solution $\\|x_T - x^*\\| \\le \\epsilon$:
$$T \\ge \\mathcal{O}\\left(\\kappa \\log \\frac{1}{\\epsilon}\\right)$$

#### The Remedy: Nesterov Accelerated Gradient (NAG)
By incorporating momentum, Nesterov acceleration contracts at rate $\\mathcal{O}(\\sqrt{\\kappa} \\log(1/\\epsilon))$, delivering quadratic speedup on anisotropic ravines.`,
      },
      {
        id: 'msg-4-5',
        role: 'user',
        createdAt: '2026-11-15T16:38:00Z',
        content:
          'Can you write a PyTorch benchmark comparing standard SGD with AdamW and L-BFGS on this landscape?',
      },
      {
        id: 'msg-4-6',
        role: 'assistant',
        createdAt: '2026-11-15T16:40:45Z',
        modelId: 'deepseek-r1',
        content: `### PyTorch Optimization Benchmark

\`\`\`python
import torch

def create_ill_conditioned_objective(dim=100, kappa=10000.0):
    # Construct eigenvalues spanning 1.0 to kappa
    eigs = torch.logspace(0, torch.log10(torch.tensor(kappa)), dim)
    H = torch.diag(eigs)
    
    def loss_fn(x):
        return 0.5 * torch.dot(x, torch.mv(H, x))
    return loss_fn

loss_fn = create_ill_conditioned_objective()

# Benchmark optimizers
for opt_name in ["SGD", "AdamW", "LBFGS"]:
    x = torch.randn(100, requires_grad=True)
    
    if opt_name == "SGD":
        optimizer = torch.optim.SGD([x], lr=1e-4, momentum=0.9)
    elif opt_name == "AdamW":
        optimizer = torch.optim.AdamW([x], lr=1e-2)
    else:
        optimizer = torch.optim.LBFGS([x], lr=1.0)
        
    for step in range(100):
        def closure():
            optimizer.zero_grad()
            l = loss_fn(x)
            l.backward()
            return l
            
        if opt_name == "LBFGS":
            optimizer.step(closure)
        else:
            loss = closure()
            optimizer.step()
            
    print(f"[{opt_name:6}] Final Loss: {loss_fn(x).item():.6e}")
\`\`\``,
      },
    ],
  },

  // 5. Previous 7 days: Rust Memory Safety
  {
    id: 'conv-5',
    title: 'Rust Memory Safety & Zero-Cost Abstractions',
    modelId: 'claude-3-5-sonnet',
    createdAt: '2026-11-14T10:00:00Z',
    updatedAt: '2026-11-14T11:20:00Z',
    snippet: 'Deconstructing affine types, pointer stability, and Pin safety contracts in async runtimes.',
    messages: [
      {
        id: 'msg-5-1',
        role: 'user',
        createdAt: '2026-11-14T10:00:00Z',
        content:
          "Explain how Rust's borrow checker enforces XOR mutability (either aliased OR mutable, never both) at compile time.",
      },
      {
        id: 'msg-5-2',
        role: 'assistant',
        createdAt: '2026-11-14T10:02:10Z',
        modelId: 'claude-3-5-sonnet',
        content: `### The XOR Mutability Rule: \`&T\` vs \`&mut T\`

In Rust, memory safety without garbage collection is guaranteed by the **aliasing XOR mutability** invariant:

$$\\text{Aliased References} \\oplus \\text{Mutable Access}$$

#### The Compiler's Mechanism: Non-Lexical Lifetimes (NLL)
1. **Loan Paths**: The compiler translates every reference creation into a \`Loan\` on a memory path (e.g., \`*a.b\`).
2. **Active Sets**: At every control flow graph (CFG) instruction point, the compiler tracks active read loans and write loans.
3. **Invalidation**: If a path has an active shared loan \`&x\`, creating a mutable loan \`&mut x\` is an immediate compilation error.

\`\`\`rust
fn main() {
    let mut data = vec![1, 2, 3];

    // Shared borrow occurs here:
    let r1 = &data[0];

    // ERROR: data.push modifies the underlying buffer, 
    // which could reallocate and invalidate r1's pointer!
    // data.push(4); 

    println!("Value: {}", r1); // Last use of r1 ends its lifetime here
    
    // Now valid because r1 is no longer live:
    data.push(4);
}
\`\`\``,
      },
      {
        id: 'msg-5-3',
        role: 'user',
        createdAt: '2026-11-14T10:15:00Z',
        content:
          'When would I use Pin<Box<dyn Future>> versus an unpinned async block?',
      },
      {
        id: 'msg-5-4',
        role: 'assistant',
        createdAt: '2026-11-14T10:17:40Z',
        modelId: 'claude-3-5-sonnet',
        content: `### When to Pin: Self-Referential State Machines

When you write an async block:
\`\`\`rust
async {
    let buffer = [0u8; 1024];
    let slice = &buffer[..];
    tokio::fs::read(&mut file, slice).await;
}
\`\`\`
The compiler generates an anonymous enum representing the state across the \`.await\` point. Notice that \`slice\` holds a pointer pointing **directly inside the struct itself** (\`&buffer\`).

If this future were moved to another memory address on the heap or stack, \`slice\` would point to dangling garbage.

#### When You Must Use \`Pin<Box<dyn Future>>\`:
1. **Dynamic Dispatch**: When returning futures from trait methods without \`async-trait\` macro overhead.
2. **Recursive Futures**: When an async function calls itself recursively.
3. **Task Collections**: Storing heterogeneous futures inside a \`Vec<Pin<Box<dyn Future<Output = T>>>>\`.`,
      },
      {
        id: 'msg-5-5',
        role: 'user',
        createdAt: '2026-11-14T10:25:00Z',
        content:
          'Show an example of implementing an intrusive linked list safely in Rust.',
      },
      {
        id: 'msg-5-6',
        role: 'assistant',
        createdAt: '2026-11-14T10:28:15Z',
        modelId: 'claude-3-5-sonnet',
        content: `### Safe Intrusive Linked List with NonNull

\`\`\`rust
use std::ptr::NonNull;

pub struct Node<T> {
    pub value: T,
    next: Option<NonNull<Node<T>>>,
}

pub struct IntrusiveList<T> {
    head: Option<NonNull<Node<T>>>,
}

impl<T> IntrusiveList<T> {
    pub const fn new() -> Self {
        Self { head: None }
    }

    pub fn push_front(&mut self, node: &mut Node<T>) {
        let mut node_ptr = NonNull::from(node);
        unsafe {
            node_ptr.as_mut().next = self.head;
        }
        self.head = Some(node_ptr);
    }
}
\`\`\``,
      },
    ],
  },

  // 6. Previous 7 days: Kubernetes GitOps Pipeline
  {
    id: 'conv-6',
    title: 'Kubernetes GitOps Pipeline with ArgoCD',
    modelId: 'mistral-large',
    createdAt: '2026-11-12T08:30:00Z',
    updatedAt: '2026-11-12T09:45:00Z',
    snippet: 'Declarative ArgoCD ApplicationSets, multi-cluster topology, and canary deployments.',
    messages: [
      {
        id: 'msg-6-1',
        role: 'user',
        createdAt: '2026-11-12T08:30:00Z',
        content:
          'Provide a production-grade ArgoCD ApplicationSet manifest for multi-cluster microservices deployment.',
      },
      {
        id: 'msg-6-2',
        role: 'assistant',
        createdAt: '2026-11-12T08:32:00Z',
        modelId: 'mistral-large',
        content: `### Production ArgoCD ApplicationSet Manifest

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: platform-microservices
  namespace: argocd
spec:
  generators:
    - matrix:
        generators:
          - git:
              repoURL: https://github.com/hypermind/k8s-infrastructure.git
              revision: HEAD
              directories:
                - path: apps/services/*
          - clusters:
              selector:
                matchLabels:
                  environment: production
  template:
    metadata:
      name: '{{path.basename}}-{{name}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/hypermind/k8s-infrastructure.git
        targetRevision: HEAD
        path: '{{path}}/overlays/{{name}}'
      destination:
        server: '{{server}}'
        namespace: '{{path.basename}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
        syncOptions:
          - CreateNamespace=true
          - ApplyOutOfSyncOnly=true
\`\`\``,
      },
      {
        id: 'msg-6-3',
        role: 'user',
        createdAt: '2026-11-12T08:40:00Z',
        content:
          'How should secrets management be handled with GitOps? SealedSecrets or External Secrets Operator with AWS SSM?',
      },
      {
        id: 'msg-6-4',
        role: 'assistant',
        createdAt: '2026-11-12T08:42:30Z',
        modelId: 'mistral-large',
        content: `### Secret Management: External Secrets Operator (ESO) vs SealedSecrets

We strongly recommend **External Secrets Operator (ESO)** for enterprise production:

| Feature | External Secrets Operator | Bitnami SealedSecrets |
| :--- | :--- | :--- |
| **Source of Truth** | AWS Secrets Manager / Vault | Git Repository (Encrypted) |
| **Rotation** | Automatic polling & live sync | Manual re-encryption |
| **Audit Compliance** | Cloud IAM access logs | Difficult to audit decrypt events |`,
      },
      {
        id: 'msg-6-5',
        role: 'user',
        createdAt: '2026-11-12T08:50:00Z',
        content:
          'How can we implement automated canary deployments using Argo Rollouts with Prometheus metrics analysis?',
      },
      {
        id: 'msg-6-6',
        role: 'assistant',
        createdAt: '2026-11-12T08:53:15Z',
        modelId: 'mistral-large',
        content: `### Automated Canary Rollout with AnalysisTemplate

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: api-gateway
spec:
  replicas: 10
  strategy:
    canary:
      analysis:
        templates:
          - templateName: success-rate-check
        args:
          - name: service-name
            value: api-gateway
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - setWeight: 50
        - pause: { duration: 10m }
\`\`\``,
      },
    ],
  },

  // 7. Older: Vision Pipeline YOLOv10
  {
    id: 'conv-7',
    title: 'Vision Pipeline: Real-time Object Detection with YOLOv10',
    modelId: 'gpt-4o',
    createdAt: '2026-11-04T13:00:00Z',
    updatedAt: '2026-11-04T14:30:00Z',
    snippet: 'Exporting YOLOv10 to TensorRT FP16 and ONNX WebGPU runtime for browser inference.',
    messages: [
      {
        id: 'msg-7-1',
        role: 'user',
        createdAt: '2026-11-04T13:00:00Z',
        content:
          'How can I deploy a YOLOv10 ONNX model to an edge device with WebGPU or TensorRT?',
      },
      {
        id: 'msg-7-2',
        role: 'assistant',
        createdAt: '2026-11-04T13:02:15Z',
        modelId: 'gpt-4o',
        content: `### Edge Acceleration for YOLOv10

YOLOv10 completely eliminates Non-Maximum Suppression (NMS) during inference via **dual-label assignment**, drastically reducing edge latency.

#### 1. TensorRT Export Script (FP16 Engine)
\`\`\`bash
trtexec --onnx=yolov10x.onnx \\
        --saveEngine=yolov10x_fp16.engine \\
        --fp16 \\
        --workspace=4096 \\
        --minShapes=images:1x3x640x640 \\
        --optShapes=images:4x3x640x640 \\
        --maxShapes=images:8x3x640x640
\`\`\``,
      },
      {
        id: 'msg-7-3',
        role: 'user',
        createdAt: '2026-11-04T13:12:00Z',
        content:
          'What are the latency differences between NMS and NMS-free architectures in YOLOv10?',
      },
      {
        id: 'msg-7-4',
        role: 'assistant',
        createdAt: '2026-11-04T13:14:20Z',
        modelId: 'gpt-4o',
        content: `### NMS-Free Throughput Gains

Traditional YOLO models (v8, v9) incur a variable $3-12\\text{ ms}$ penalty during post-processing because NMS runs on the CPU:

- **YOLOv8x**: 10.7 ms model inference + 4.2 ms CPU NMS = **14.9 ms total**
- **YOLOv10x**: 10.4 ms model inference + 0.0 ms NMS = **10.4 ms total (30% faster!)**`,
      },
      {
        id: 'msg-7-5',
        role: 'user',
        createdAt: '2026-11-04T13:20:00Z',
        content:
          'Show JavaScript/TypeScript code for rendering bounding boxes on an HTML5 canvas from a webcam stream.',
      },
      {
        id: 'msg-7-6',
        role: 'assistant',
        createdAt: '2026-11-04T13:23:40Z',
        modelId: 'gpt-4o',
        content: `### Real-Time Canvas Overlay Renderer

\`\`\`typescript
export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

export function drawDetections(
  ctx: CanvasRenderingContext2D,
  boxes: BoundingBox[]
) {
  boxes.forEach((box) => {
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);

    const caption = \`\${box.label} (\${Math.round(box.confidence * 100)}%)\`;
    ctx.fillStyle = '#8B5CF6';
    ctx.fillRect(box.x, box.y - 20, ctx.measureText(caption).width + 12, 20);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(caption, box.x + 6, box.y - 6);
  });
}
\`\`\``,
      },
    ],
  },

  // 8. Older: PostgreSQL Partitioning
  {
    id: 'conv-8',
    title: 'SQL Performance Tuning for 100M+ Row Partitioned Tables',
    modelId: 'nemotron-4',
    createdAt: '2026-10-28T09:15:00Z',
    updatedAt: '2026-10-28T10:30:00Z',
    snippet: 'Declarative range partitioning, BRIN indexing strategies, and partition pruning optimizations.',
    messages: [
      {
        id: 'msg-8-1',
        role: 'user',
        createdAt: '2026-10-28T09:15:00Z',
        content:
          'Our PostgreSQL query on a 150M row events table is taking 14 seconds. EXPLAIN ANALYZE shows nested loop with sequential scans.',
      },
      {
        id: 'msg-8-2',
        role: 'assistant',
        createdAt: '2026-10-28T09:17:30Z',
        modelId: 'nemotron-4',
        content: `### Taming 150M Row PostgreSQL Scans

A 14-second query runtime indicates **cache misses** caused by B-Tree index bloat and failed partition pruning.

#### Step 1: Declarative Monthly Range Partitioning
\`\`\`sql
CREATE TABLE audit_events (
    id UUID NOT NULL,
    organization_id UUID NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Monthly partition creation
CREATE TABLE audit_events_2026_11 PARTITION OF audit_events
    FOR VALUES FROM ('2026-11-01 00:00:00Z') TO ('2026-12-01 00:00:00Z');
\`\`\``,
      },
      {
        id: 'msg-8-3',
        role: 'user',
        createdAt: '2026-10-28T09:25:00Z',
        content:
          'Would range partitioning by created_at timestamp with monthly intervals solve this?',
      },
      {
        id: 'msg-8-4',
        role: 'assistant',
        createdAt: '2026-10-28T09:27:10Z',
        modelId: 'nemotron-4',
        content: `### Partition Pruning Impact

Yes! With \`enable_partition_pruning = on\` (default in PG 12+), a query filtering for \`created_at >= NOW() - INTERVAL '3 days'\` skips 98% of physical disk blocks, dropping scan time from 14s to **12ms**.`,
      },
      {
        id: 'msg-8-5',
        role: 'user',
        createdAt: '2026-10-28T09:32:00Z',
        content:
          'How do partial indexes and covering indexes (INCLUDE clause) improve high-concurrency read queries?',
      },
      {
        id: 'msg-8-6',
        role: 'assistant',
        createdAt: '2026-10-28T09:35:00Z',
        modelId: 'nemotron-4',
        content: `### Index-Only Scans with Covering Indexes

\`\`\`sql
CREATE INDEX idx_events_org_created 
ON audit_events_2026_11 (organization_id, created_at DESC) 
INCLUDE (event_type);
\`\`\`
By appending \`INCLUDE (event_type)\`, PostgreSQL returns the requested columns straight from the RAM-resident leaf pages of the index without ever reading the main heap table!`,
      },
    ],
  },
];

export function getConversationById(id: string): Conversation | undefined {
  return MOCK_CONVERSATIONS.find((c) => c.id === id);
}

export function groupConversations(conversations: Conversation[] = MOCK_CONVERSATIONS): GroupedConversations {
  const now = new Date('2026-11-18T20:30:00Z'); // Fixed reference point
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysMs = 7 * oneDayMs;

  const pinned: Conversation[] = [];
  const today: Conversation[] = [];
  const previous7Days: Conversation[] = [];
  const older: Conversation[] = [];

  conversations.forEach((conv) => {
    if (conv.isPinned) {
      pinned.push(conv);
      return;
    }

    const convDate = new Date(conv.updatedAt || conv.createdAt);
    const diffMs = now.getTime() - convDate.getTime();

    if (diffMs < oneDayMs && diffMs >= 0) {
      today.push(conv);
    } else if (diffMs < sevenDaysMs && diffMs >= 0) {
      previous7Days.push(conv);
    } else {
      older.push(conv);
    }
  });

  return {
    pinned,
    today,
    previous7Days,
    older,
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  fallback: string;
  plan: string;
  tokenBalance: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'info' | 'agent' | 'billing' | 'system';
}

export const mockUser: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@hypermind.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  fallback: 'AR',
  plan: 'Pro Enterprise',
  tokenBalance: 842500,
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Context Window Expanded',
    description: 'Claude 3.5 Sonnet context upgraded to 200,000 tokens.',
    time: '12m ago',
    unread: true,
    type: 'system',
  },
  {
    id: 'notif-2',
    title: 'Agent Task Completed',
    description: 'Autonomous Agent #42 concluded literature synthesis with 18 citations.',
    time: '2h ago',
    unread: true,
    type: 'agent',
  },
  {
    id: 'notif-3',
    title: 'Monthly Quota Refreshed',
    description: 'Your Pro tier subscription refilled 1,000,000 computing units.',
    time: '1d ago',
    unread: true,
    type: 'billing',
  },
];

export const mockConversations: Conversation[] = MOCK_CONVERSATIONS;
export type ConversationItem = Conversation;

export default MOCK_CONVERSATIONS;


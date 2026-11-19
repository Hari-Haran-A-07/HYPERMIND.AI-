'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Play,
  Check,
  Bot,
  Compass,
  Code2,
  FileText,
  Eye,
  Mic,
  Cpu,
  Palette,
  Film,
  Brain,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Terminal,
  Layers,
  ChevronRight,
  Copy,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Stagger variants for hero text
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const featureGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// 12 features requested
const FEATURES = [
  {
    icon: Bot,
    title: 'Chat',
    description:
      'Fluid multi-turn conversational intelligence with deep reasoning, adaptive persona, and dynamic context windows.',
    badge: 'Dual-Engine',
  },
  {
    icon: Compass,
    title: 'Research',
    description:
      'Autonomous deep-dive research engine that traverses academic literature, synthesizes papers, and generates citations.',
    badge: 'Autonomous',
  },
  {
    icon: Code2,
    title: 'Code',
    description:
      'Full-stack code generation, debugging, refactoring, and multi-file project scaffolding with instant execution previews.',
    badge: 'Multi-Language',
  },
  {
    icon: FileText,
    title: 'Documents',
    description:
      'Ingest gigabyte-scale PDFs, spreadsheets, and documentation with hybrid neural search and instant answering.',
    badge: '2M Tokens',
  },
  {
    icon: Eye,
    title: 'Vision',
    description:
      'Multimodal visual understanding, OCR, technical diagram analysis, and image generation inspection in real time.',
    badge: 'High-Res OCR',
  },
  {
    icon: Mic,
    title: 'Voice',
    description:
      'Real-time ultra-low latency voice duplex with human-grade prosody, multilingual translation, and audio transcripts.',
    badge: 'Sub-150ms',
  },
  {
    icon: Cpu,
    title: 'Agents',
    description:
      'Autonomous goal-driven agents capable of multi-step planning, tool invocation, web scraping, and task completion.',
    badge: 'Self-Correcting',
  },
  {
    icon: Palette,
    title: 'Creative Studio',
    description:
      'Next-gen generative canvas for high-fidelity concept art, marketing copy, storyboard ideation, and asset creation.',
    badge: 'Generative Canvas',
  },
  {
    icon: Film,
    title: 'Cinema',
    description:
      'High-definition video generation, storyboard sequencing, frame interpolation, and automated scene scripting.',
    badge: '4K Cinematic',
  },
  {
    icon: Brain,
    title: 'Memory',
    description:
      'Infinite hierarchical memory that retains your project context, preferences, and knowledge graphs across sessions.',
    badge: 'Vector Graph',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Real-time token economics, latency heatmaps, model benchmark comparisons, and usage tracking dashboards.',
    badge: 'Real-Time Stats',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    description:
      'Zero data retention guarantees, end-to-end client encryption, enterprise SOC2 compliance, and private VPC deployment.',
    badge: 'SOC2 & HIPAA',
  },
];

// Leading models showcase data
const MODEL_PROVIDERS = [
  {
    name: 'OpenAI',
    color: 'bg-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'rgba(52, 211, 153, 0.15)',
    flagship: 'GPT-4o & o1 Reasoning',
    specs: '128k context • Flagship multimodal',
    rank: '#1 General Logic',
  },
  {
    name: 'Anthropic',
    color: 'bg-amber-400',
    border: 'border-amber-500/30',
    glow: 'rgba(251, 191, 36, 0.15)',
    flagship: 'Claude 3.5 Sonnet',
    specs: '200k context • Frontier code mastery',
    rank: '#1 Coding Benchmark',
  },
  {
    name: 'Google',
    color: 'bg-sky-400',
    border: 'border-sky-500/30',
    glow: 'rgba(56, 189, 248, 0.15)',
    flagship: 'Gemini 1.5 Pro',
    specs: '2M context • Audio & video native',
    rank: '#1 Massive Context',
  },
  {
    name: 'DeepSeek',
    color: 'bg-violet-400',
    border: 'border-violet-500/30',
    glow: 'rgba(167, 139, 250, 0.15)',
    flagship: 'DeepSeek R1 & V3',
    specs: '671B MoE • Frontier open reasoning',
    rank: '#1 Open Weight Math',
  },
  {
    name: 'NVIDIA',
    color: 'bg-lime-400',
    border: 'border-lime-500/30',
    glow: 'rgba(163, 230, 53, 0.15)',
    flagship: 'Nemotron 70B & Llama 3.3',
    specs: 'Optimized TensorRT-LLM inference',
    rank: '#1 Throughput & Speed',
  },
];

export default function MarketingPage() {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');

  const handleCopyCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative overflow-hidden w-full">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Full Viewport Height)
          ========================================================================= */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-12 pb-24 overflow-hidden">
        {/* Subtle animated mesh & grid background (CSS only) */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          aria-hidden="true"
        >
          {/* Radial light gradient 1 (Top Center) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/20 blur-[130px] rounded-full opacity-60" />
          {/* Radial light gradient 2 (Accent) */}
          <div className="absolute top-48 left-1/3 -translate-x-1/2 w-[500px] h-[350px] bg-accent/15 blur-[120px] rounded-full opacity-50" />
          {/* Radial light gradient 3 (Info/Blue) */}
          <div className="absolute top-64 right-1/4 w-[450px] h-[300px] bg-info/10 blur-[110px] rounded-full opacity-40" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
              maskImage:
                'radial-gradient(ellipse 80% 65% at 50% 30%, #000 60%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 65% at 50% 30%, #000 60%, transparent 100%)',
            }}
          />
        </div>

        {/* Hero Content Staggered Animations */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center z-10"
        >
          {/* Shimmer Badge */}
          <motion.div variants={heroItemVariants} className="mb-6">
            <div className="group relative inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/60 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/60 hover:shadow-glow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-muted-foreground">
                HYPERMIND v1.0 — Universal AI Intelligence
              </span>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Frontier
              </span>
            </div>
          </motion.div>

          {/* Display Title with 3 staggered lines */}
          <motion.div variants={heroItemVariants} className="space-y-1 sm:space-y-2 mb-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground">
              One Platform.
            </h1>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
              <span className="text-gradient">Multiple Intelligence.</span>
            </h2>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
              <span className="text-gradient">Infinite Possibilities.</span>
            </h2>
          </motion.div>

          {/* Subtitle: 2 lines in muted color */}
          <motion.p
            variants={heroItemVariants}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Orchestrate GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and DeepSeek R1 within one unified neural workspace.
            Cross-verify reasoning, automate complex pipelines, and build the future faster.
          </motion.p>

          {/* CTA Buttons Group */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              className="relative w-full sm:w-auto px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <span>Start Free</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-medium border-border/70 hover:border-primary/50 hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300"
            >
              <Link href="#workspace-preview" className="flex items-center justify-center gap-2">
                <Play className="h-4 w-4 fill-current text-primary" />
                <span>Watch Demo</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Mock Workspace Preview Card */}
        <motion.div
          id="workspace-preview"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mt-16 sm:mt-20 mx-auto"
        >
          {/* Card Ambient Glow Aura */}
          <div
            className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 via-accent/30 to-info/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"
            aria-hidden="true"
          />

          {/* Workspace Card Shell */}
          <div className="relative rounded-2xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl overflow-hidden text-left">
            {/* Top Workspace App Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-secondary/30 px-4 py-3">
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-destructive/80" />
                <span className="h-3 w-3 rounded-full bg-warning/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ml-3 hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/50 px-2 py-0.5 text-xs text-muted-foreground font-mono">
                  <Terminal className="h-3 w-3 text-primary" />
                  hypermind-workspace-main
                </span>
              </div>

              {/* Model Badges Active in Session */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span>Consensus Engine: Dual-Model</span>
                </div>
                <div className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <span className="text-emerald-400 font-semibold">142.4 tok/s</span>
                  <span>•</span>
                  <span>14ms TTFT</span>
                </div>
              </div>
            </div>

            {/* Inner Chat Interface Container */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* User Message Bubble */}
              <div className="flex items-start gap-3.5 sm:gap-4 max-w-2xl ml-auto flex-row-reverse">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-accent to-primary text-primary-foreground font-semibold text-xs shadow-sm">
                  JD
                </div>
                <div className="space-y-1 text-right">
                  <div className="rounded-2xl rounded-tr-sm bg-primary/95 text-primary-foreground px-4 py-3 shadow-md text-sm sm:text-base leading-relaxed text-left">
                    Analyze cross-model consensus on KV-cache compression across Mixture-of-Experts architectures, then draft an optimized CUDA kernel snippet.
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono pr-1">
                    Just now · Context: 200k Tokens Active
                  </span>
                </div>
              </div>

              {/* Assistant Message Bubble */}
              <div className="flex items-start gap-3.5 sm:gap-4 max-w-3xl">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div className="space-y-3.5 w-full">
                  {/* Synthesis Status Strip */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-amber-400" />
                      Claude 3.5 Sonnet + DeepSeek R1 Synthesized
                    </span>
                    <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium">
                      99.4% Agreement Score
                    </span>
                  </div>

                  {/* Collapsible Reasoning Preview */}
                  <div className="rounded-xl border border-border/60 bg-secondary/25 p-3.5 text-xs text-muted-foreground font-mono leading-relaxed space-y-1">
                    <div className="flex items-center justify-between text-foreground font-sans font-semibold text-xs">
                      <span className="flex items-center gap-1.5">
                        <Brain className="h-3.5 w-3.5 text-primary" />
                        Co-Reasoning Trace (0.8s)
                      </span>
                      <span className="text-[10px] text-muted-foreground">8 Experts Consulted</span>
                    </div>
                    <p className="text-muted-foreground/90 pt-1">
                      DeepSeek R1 isolated the memory footprint bottleneck during dynamic routing. Claude 3.5 proposed page-locked KV eviction with block-level quantization.
                    </p>
                  </div>

                  {/* Assistant Text Response */}
                  <div className="rounded-2xl rounded-tl-sm border border-border/60 bg-secondary/40 p-4 sm:p-5 text-sm sm:text-base leading-relaxed space-y-3">
                    <p className="text-foreground/90">
                      Here is the consensus synthesis. In large-scale MoE topologies, memory bus contention during expert gating is mitigated by pinning frequent KV pages in SRAM and offloading sparse tokens asynchronously:
                    </p>

                    {/* Simulated Code Editor */}
                    <div className="rounded-xl border border-border/80 bg-background/90 overflow-hidden font-mono text-xs sm:text-sm">
                      <div className="flex items-center justify-between border-b border-border/60 bg-secondary/40 px-3.5 py-2">
                        <span className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Code2 className="h-3.5 w-3.5 text-primary" />
                          moe_kv_eviction.cu
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-3.5 overflow-x-auto text-xs leading-5">
                        <div>
                          <span className="text-accent font-semibold">__global__ void</span>{' '}
                          <span className="text-info font-medium">compress_kv_cache_moe</span>(
                        </div>
                        <div className="pl-4 text-muted-foreground">
                          <span className="text-primary font-semibold">const half* __restrict__</span> k_in,
                        </div>
                        <div className="pl-4 text-muted-foreground">
                          <span className="text-primary font-semibold">int8_t* __restrict__</span> k_quant_out,
                        </div>
                        <div className="pl-4 text-muted-foreground">
                          <span className="text-accent font-semibold">const int</span> expert_active_mask
                        </div>
                        <div>) &#123;</div>
                        <div className="pl-4 text-emerald-400/90">
                          // Vectorized warp-level quantized eviction
                        </div>
                        <div className="pl-4 text-foreground/80">
                          <span className="text-accent">int</span> tid = blockIdx.x * blockDim.x + threadIdx.x;
                        </div>
                        <div className="pl-4 text-foreground/80">
                          <span className="text-accent">if</span> (expert_active_mask & (1 &lt;&lt; (tid % 8))) &#123;
                        </div>
                        <div className="pl-8 text-foreground/80">
                          k_quant_out[tid] = <span className="text-info">__half2int_rn</span>(k_in[tid]);
                        </div>
                        <div className="pl-4 text-foreground/80">&#125;</div>
                        <div>&#125;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURES GRID SECTION (4x3 Grid)
          ========================================================================= */}
      <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Layers className="h-3.5 w-3.5" />
              Comprehensive Capability Matrix
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              The Complete AI Ecosystem
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every frontier modality and cognitive engine combined into one cohesive platform. Experience zero friction between thought, code, and creation.
            </p>
          </div>

          {/* 12 Feature Cards in 4x3 Grid */}
          <motion.div
            variants={featureGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={cardVariant}
                  className="group relative rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:bg-card/90 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Icon & Badge Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-border/70 bg-secondary/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle Interactive Footer */}
                  <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="font-medium">Explore capability</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MODEL SHOWCASE SECTION
          ========================================================================= */}
      <section id="models" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
              <Zap className="h-3.5 w-3.5" />
              Zero Lock-In
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Every Leading AI Model. One Interface.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              No need for five different subscriptions. HYPERMIND unifies all industry-standard intelligence engines with seamless switching and cross-verification.
            </p>
          </div>

          {/* Provider Badges Row & Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {MODEL_PROVIDERS.map((provider) => (
              <div
                key={provider.name}
                className={cn(
                  'relative rounded-2xl border bg-card/60 backdrop-blur-sm p-5 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                  provider.border
                )}
              >
                {/* Provider Header with Colored Dot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2.5 w-2.5 rounded-full', provider.color)} />
                    <span className="font-bold text-foreground text-sm tracking-tight">
                      {provider.name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                    Frontier
                  </span>
                </div>

                {/* Model Highlights */}
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-foreground">
                    {provider.flagship}
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    {provider.specs}
                  </div>
                </div>

                {/* Rank Tag */}
                <div className="pt-2 border-t border-border/40">
                  <span className="text-[11px] font-medium text-primary">
                    {provider.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PRICING SECTION
          ========================================================================= */}
      <section id="pricing" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Transparent Economics
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Start completely free, or upgrade to Pro to unlock unlimited frontier models, autonomous agents, and infinite memory.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center p-1 rounded-full border border-border bg-card/80 backdrop-blur-sm mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all',
                  billingCycle === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={cn(
                  'px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all flex items-center gap-1.5',
                  billingCycle === 'annual'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>Annual</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 text-[10px] font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur-sm p-8 flex flex-col justify-between hover:border-border transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Free</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ideal for students and individuals exploring AI intelligence.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
                    $0
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3.5 text-sm text-muted-foreground border-t border-border/50 pt-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>50 messages / day</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>3 models (GPT-4o mini, Claude Haiku, Gemini)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Basic code & document analysis</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-muted-foreground/60">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    <span>Standard speed & shared capacity</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full py-6 text-base font-semibold border-border/80 hover:border-primary/50"
                >
                  <Link href="/register">Start Free</Link>
                </Button>
              </div>
            </div>

            {/* Pro Tier (HIGHLIGHTED / RECOMMENDED) */}
            <div className="relative rounded-3xl border-2 border-primary bg-card/90 backdrop-blur-md p-8 flex flex-col justify-between shadow-glow lg:-translate-y-2 transition-all duration-300">
              {/* Most Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-bold text-primary-foreground shadow-md uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                Most Popular
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Pro</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For developers, researchers, and power users demanding frontier speed.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
                    {billingCycle === 'annual' ? '$23' : '$29'}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3.5 text-sm text-foreground/90 border-t border-border/50 pt-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-semibold text-foreground">Unlimited messages & no caps</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>All frontier models (GPT-4o, Claude 3.5, Gemini Pro, DeepSeek R1)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Advanced autonomous agents & tool execution</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Creative Studio & Cinema 4K generation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Priority compute & 200k+ token context</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Early access to new research checkpoints</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  asChild
                  className="w-full py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                >
                  <Link href="/register">Get Started with Pro</Link>
                </Button>
              </div>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur-sm p-8 flex flex-col justify-between hover:border-border transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Enterprise</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For organizations requiring custom throughput, security, and SLAs.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
                    Custom
                  </span>
                  <span className="text-sm text-muted-foreground">/quote</span>
                </div>

                <ul className="space-y-3.5 text-sm text-muted-foreground border-t border-border/50 pt-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Custom token throughput & reserved capacity</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Single Sign-On (SAML/SSO) & SCIM directory sync</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Comprehensive audit logs & SOC2 Type II reports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>99.99% enterprise uptime SLA guarantee</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Private VPC deployment & dedicated architect</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full py-6 text-base font-semibold border-border/80 hover:border-primary/50"
                >
                  <Link href="/register">Contact Enterprise</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CTA SECTION
          ========================================================================= */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-border/40 overflow-hidden text-center">
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[130px] rounded-full opacity-70" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Instant Access
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Ready to Experience the Future of AI?
          </h2>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unleash the full spectrum of universal intelligence today. Join forward-thinking creators and engineering teams shaping the next paradigm.
          </p>

          <div className="pt-4 flex flex-col items-center gap-3">
            <Button
              asChild
              size="lg"
              className="px-10 py-7 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
            >
              <Link href="/register" className="flex items-center gap-2">
                <span>Start Free</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">
              No credit card required · Instant 60-second setup
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

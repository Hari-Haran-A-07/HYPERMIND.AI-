'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clapperboard,
  Film,
  Video,
  Sparkles,
  Wand2,
  Lightbulb,
  ArrowRight,
  Info,
  Sparkle,
  Compass,
  Palette,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudioModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge: string;
  gradient: string;
  borderHover: string;
  features: string[];
}

const studioModules: StudioModule[] = [
  {
    id: 'storyboard',
    title: 'Cinematic Storyboard Studio',
    description: 'Plan scenes, shots, and visual narratives with frame-by-frame precision and AI guidance.',
    icon: Film,
    href: '/studio/storyboard',
    badge: 'Pre-Production',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderHover: 'group-hover:border-amber-500/50',
    features: ['Script Breakdown', 'Shot Framing', 'Camera Angles', 'Scene Timeline'],
  },
  {
    id: 'video',
    title: 'AI Video Studio',
    description: 'Text-to-video and image-to-video workflows with neural cinematography and motion pacing.',
    icon: Video,
    href: '/studio/video',
    badge: 'Neural Video',
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    borderHover: 'group-hover:border-sky-500/50',
    features: ['Text-to-Video', 'Image-to-Video', 'Multi-Track Timeline', 'Aspect Presets'],
  },
  {
    id: 'animation',
    title: 'Animation Studio',
    description: '2D/3D animation planning and design with keyframe interpolation and rig orchestration.',
    icon: Sparkles,
    href: '/studio/animation',
    badge: '2D & 3D Rigs',
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    borderHover: 'group-hover:border-purple-500/50',
    features: ['Keyframe Scrubbing', '2D/3D Mode', 'Asset Graph', 'Curve Editor'],
  },
  {
    id: 'vfx',
    title: 'Visual Effects Workspace',
    description: 'VFX compositing, particle simulations, lighting setups, and shot delivery tracking.',
    icon: Wand2,
    href: '/studio/vfx',
    badge: 'Post-Production',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderHover: 'group-hover:border-emerald-500/50',
    features: ['Node Compositing', 'Particle Systems', 'Shot Tracking', 'Render Queue'],
  },
  {
    id: 'film',
    title: 'Film Production Assistant',
    description: 'Screenplay formatting, dialogue polishing, scene breakdowns, and shoot scheduling.',
    icon: Clapperboard,
    href: '/studio/film',
    badge: 'Screenwriting',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderHover: 'group-hover:border-rose-500/50',
    features: ['Script Formatting', 'AI Script Doctor', 'Character Arcs', 'Call Sheets'],
  },
  {
    id: 'research',
    title: 'Creative Research Lab',
    description: 'Mood boards, color palettes, visual references, and open-ended creative concepting.',
    icon: Lightbulb,
    href: '/studio/storyboard',
    badge: 'Conceptual',
    gradient: 'from-indigo-500/20 via-primary/10 to-transparent',
    borderHover: 'group-hover:border-indigo-500/50',
    features: ['Mood Boards', 'Lighting References', 'Color Psychology', 'Style Transfer'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function StudioHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-card/30 py-12 md:py-16">
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-10 h-64 w-64 rounded-full bg-accent/10 blur-[90px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkle className="h-3.5 w-3.5 fill-primary" />
            <span>Next-Gen Hollywood-Grade AI Workspaces</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary shadow-glow">
              <Clapperboard className="h-7 w-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              HYPERMIND Creative & Cinema Studio
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            Design, plan, and produce cinematic content with AI assistance. From script breakdown to neural rendering, empower your storytelling pipeline.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Informational Banner (Blue info) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="flex items-start gap-3.5 rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-sky-200"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
            <Info className="h-4 w-4" />
          </div>
          <div className="text-xs sm:text-sm space-y-0.5">
            <p className="font-semibold text-sky-300">
              Interactive Design Preview Environment
            </p>
            <p className="text-sky-200/80 leading-relaxed">
              These modules are product interface designs. Actual generation and rendering require engine integration in future development stages.
            </p>
          </div>
        </motion.div>

        {/* 6 Studio Module Cards (3x2 on desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {studioModules.map((module) => {
            const Icon = module.icon;

            return (
              <motion.div
                key={module.id}
                variants={cardVariants}
                className="group relative rounded-2xl p-[1px] transition-all duration-300"
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-border opacity-60 transition-opacity duration-300 group-hover:opacity-100 group-hover:scale-[1.01]" />

                {/* Inner Card */}
                <div className="relative flex flex-col justify-between h-full rounded-2xl bg-card p-6 transition-all duration-300 group-hover:bg-card/90">
                  {/* Subtle corner gradient */}
                  <div
                    className={cn(
                      'pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-tr-2xl bg-gradient-to-bl opacity-40 group-hover:opacity-80 transition-opacity',
                      module.gradient
                    )}
                  />

                  <div>
                    {/* Top Row: Icon and Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-secondary/80 text-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                        {module.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {module.title}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {module.description}
                    </p>

                    {/* Features checklist */}
                    <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                        Capabilities Included:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {module.features.map((feat) => (
                          <div
                            key={feat}
                            className="flex items-center gap-1.5 text-[11px] text-muted-foreground group-hover:text-foreground/90 transition-colors"
                          >
                            <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Launch Button Link */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <Link
                      href={module.href}
                      className="inline-flex w-full items-center justify-between rounded-xl bg-secondary/60 hover:bg-primary hover:text-primary-foreground px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-200 group-hover:shadow-md"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

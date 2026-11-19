'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Wand2,
  Sparkles,
  Info,
  Flame,
  Sun,
  CloudFog,
  Camera,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Sliders,
  ChevronRight,
  GitBranch,
  MonitorPlay,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type VFXProjectStatus = 'In Progress' | 'Planning' | 'Review';
type EffectCategory = 'Particles' | 'Lighting' | 'Environment' | 'Camera';

interface VFXProject {
  id: string;
  title: string;
  shotCount: number;
  status: VFXProjectStatus;
  leadArtist: string;
  gradientBg: string;
}

interface ShotTrackItem {
  id: string;
  name: string;
  status: 'Complete' | 'In Progress' | 'Pending Review' | 'Awaiting Plate';
  assignee: string;
  elements: string[];
  notes: string;
}

const mockProjects: VFXProject[] = [
  {
    id: 'proj-1',
    title: 'Neo-Tokyo Skyline Matte & Rain',
    shotCount: 12,
    status: 'In Progress',
    leadArtist: 'Elena Rostova',
    gradientBg: 'from-sky-950 via-indigo-950 to-slate-950',
  },
  {
    id: 'proj-2',
    title: 'Cybernetic Eye HUD Synthesis',
    shotCount: 8,
    status: 'Review',
    leadArtist: 'Marcus Vance',
    gradientBg: 'from-cyan-950 via-teal-950 to-slate-950',
  },
  {
    id: 'proj-3',
    title: 'Corridor Blast & Debris Simulation',
    shotCount: 16,
    status: 'Planning',
    leadArtist: 'Sarah Lin',
    gradientBg: 'from-amber-950 via-rose-950 to-slate-950',
  },
];

const categoryEffects: Record<EffectCategory, { name: string; type: string }[]> = {
  Particles: [
    { name: 'Micro Atmospheric Dust & Smoke', type: 'Fluid Dynamics' },
    { name: 'Electrical Welding Sparks', type: 'GPU Particle Emitter' },
    { name: 'Volumetric Mist & Rain Stream', type: 'VDB Simulation' },
    { name: 'Thermal Ember Dispersion', type: 'Force Field' },
  ],
  Lighting: [
    { name: '35mm Anamorphic Streak Flare', type: 'Optical Convolution' },
    { name: 'Dynamic Rim Light Injector', type: 'Ray Traced Normal' },
    { name: 'Subsurface Bioluminescence Caustics', type: 'Shader Pass' },
    { name: 'Neon Hologram Strobe Flicker', type: 'Waveform Trigger' },
  ],
  Environment: [
    { name: 'Deep Sky Replacement (ACEScg)', type: 'Matte Painting' },
    { name: 'Glitch Cyber Hologram Matrix', type: 'Displacement Map' },
    { name: 'Window Rain Streaks & Condensation', type: 'Refractive Pass' },
    { name: 'Volumetric Cloud Depth Matte', type: 'Z-Depth Key' },
  ],
  Camera: [
    { name: 'Physical Chromatic Aberration', type: 'Lens Distortion' },
    { name: 'Dual-Pass Optical Glow & Diffusion', type: 'Frequency Separation' },
    { name: 'Realistic 35mm Film Grain 500T', type: 'Grain Synthesis' },
    { name: 'Sub-Pixel Vector Motion Blur', type: 'Velocity Buffer' },
  ],
};

const mockShots: ShotTrackItem[] = [
  {
    id: 'VFX_010',
    name: 'EXT_Skyline_Establishing_010',
    status: 'In Progress',
    assignee: 'Elena Rostova',
    elements: ['Sky Matte', 'Rain Particles', 'Holo Billboards'],
    notes: 'Match grain intensity to A-camera anamorphic lens pack.',
  },
  {
    id: 'VFX_022',
    name: 'INT_Lab_CyberEye_Macro_022',
    status: 'Pending Review',
    assignee: 'Marcus Vance',
    elements: ['Eye HUD Overlay', 'Pupil Caustics', 'Focus Pull'],
    notes: 'Color grading approved by DP. Ready for final supervisor pass.',
  },
  {
    id: 'VFX_035',
    name: 'INT_Corridor_Explosion_035',
    status: 'In Progress',
    assignee: 'Sarah Lin',
    elements: ['Blast Debris', 'Fire Simulation', 'Heat Haze'],
    notes: 'Rerunning pyro smoke sim with finer voxel grid resolution.',
  },
  {
    id: 'VFX_044',
    name: 'EXT_Rooftop_Chasm_Jump_044',
    status: 'Awaiting Plate',
    assignee: 'Unassigned',
    elements: ['Wire Removal', 'Background Plate Match'],
    notes: 'Awaiting second unit stunt plate upload from on-set team.',
  },
  {
    id: 'VFX_050',
    name: 'EXT_Skiff_Escape_Landing_050',
    status: 'Complete',
    assignee: 'Elena Rostova',
    elements: ['Thruster Glow', 'Dust Kickup', 'Lens Flares'],
    notes: 'Final composite rendered and delivered to editing suite.',
  },
];

export default function VFXWorkspacePage() {
  const [selectedCategory, setSelectedCategory] = useState<EffectCategory>('Particles');
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [compositorMode, setCompositorMode] = useState<'Layers' | 'Node Graph'>('Layers');

  const statusBadge = (status: VFXProjectStatus) => {
    switch (status) {
      case 'In Progress':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'Review':
        return 'border-sky-500/30 bg-sky-500/10 text-sky-400';
      case 'Planning':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
    }
  };

  const shotStatusBadge = (status: ShotTrackItem['status']) => {
    switch (status) {
      case 'Complete':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'In Progress':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'Pending Review':
        return 'border-sky-500/30 bg-sky-500/10 text-sky-400';
      case 'Awaiting Plate':
        return 'border-muted-foreground/30 bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/studio"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Back to Studio Hub"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    Visual Effects Workspace
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Node compositing, neural simulation passes, and shot lifecycle tracking
                  </p>
                </div>
              </div>
            </div>

            <span className="text-xs font-mono text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-lg border border-border">
              Color Space: ACES 1.3 / OCIO v2.2
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Informational Banner */}
        <div className="flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sky-200">
          <Info className="h-4 w-4 shrink-0 text-sky-400" />
          <p className="text-xs sm:text-sm">
            This module is a design preview. Actual processing requires engine integration in later development stages.
          </p>
        </div>

        {/* 3 Mock VFX Project Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Active VFX Sequences & Shot Packages
            </h2>
            <span className="text-xs text-muted-foreground font-mono">3 Active Projects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProjects.map((proj) => {
              const isSelected = activeProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={cn(
                    'relative rounded-2xl border p-4 transition-all cursor-pointer bg-card',
                    isSelected
                      ? 'border-primary ring-1 ring-primary/40 shadow-glow'
                      : 'border-border hover:border-border/80'
                  )}
                >
                  {/* Thumbnail Placeholder */}
                  <div
                    className={cn(
                      'w-full h-24 rounded-xl bg-gradient-to-br border border-border/50 flex flex-col justify-between p-2.5 mb-3',
                      proj.gradientBg
                    )}
                  >
                    <span
                      className={cn(
                        'self-end rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase',
                        statusBadge(proj.status)
                      )}
                    >
                      {proj.status}
                    </span>
                    <span className="text-[10px] font-mono text-white/70">
                      {proj.shotCount} VFX Shots
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground">{proj.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>Lead: {proj.leadArtist}</span>
                    <span className="text-primary text-[11px] font-medium flex items-center gap-0.5">
                      View details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Interface: Left Effects Library & Right Compositing Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Effects Library Panel (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Neural FX Library</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">OpenVFX Preset Pack</span>
            </div>

            {/* Category Filter Tabs */}
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'Particles', icon: Flame },
                  { id: 'Lighting', icon: Sun },
                  { id: 'Environment', icon: CloudFog },
                  { id: 'Camera', icon: Camera },
                ] as const
              ).map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border p-2 text-xs font-medium transition-all text-left',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border/70 bg-secondary/20 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Effects List in Category */}
            <div className="space-y-2 pt-1">
              {categoryEffects[selectedCategory].map((effect) => (
                <div
                  key={effect.name}
                  className="rounded-xl border border-border/70 bg-secondary/30 p-2.5 hover:border-primary/40 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {effect.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {effect.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <span>+ Custom GLSL / HLSL Shader</span>
            </button>
          </div>

          {/* Compositing Area Viewport (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Compositing Workspace Canvas
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Plate: VFX_010_Raw_LogC4.exr
                </span>
              </div>

              {/* View Switcher: Layers vs Node Graph */}
              <div className="flex items-center rounded-lg border border-border bg-secondary/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setCompositorMode('Layers')}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    compositorMode === 'Layers'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Layers className="h-3 w-3 inline mr-1" />
                  Layers
                </button>
                <button
                  type="button"
                  onClick={() => setCompositorMode('Node Graph')}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    compositorMode === 'Node Graph'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <GitBranch className="h-3 w-3 inline mr-1" />
                  Node Graph
                </button>
              </div>
            </div>

            {/* Compositing Placeholder Canvas */}
            <div className="relative w-full aspect-video rounded-2xl border border-border bg-gradient-to-tr from-slate-950 via-teal-950/40 to-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
              {/* Header Info */}
              <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded font-mono text-[10px] border border-white/10">
                  VIEWER 1 • 3840 x 2160 • 16-BIT FLOAT
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded font-mono text-[10px] border border-white/10">
                  EXPOSURE: +0.25 EV
                </span>
              </div>

              {/* Canvas Center Graphic */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 backdrop-blur-md shadow-glow">
                  {compositorMode === 'Layers' ? (
                    <Layers className="h-8 w-8" />
                  ) : (
                    <GitBranch className="h-8 w-8" />
                  )}
                </div>
                <div className="text-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <p className="text-xs font-bold text-white">
                    {compositorMode === 'Layers'
                      ? 'Multi-Pass Layer Composite Stack'
                      : 'Nodal Execution Tree (14 Active Nodes)'}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5 font-mono">
                    Deep Compositing • Cryptomatte ID Passes Linked
                  </p>
                </div>
              </div>

              {/* Bottom Composite Stack Indicators */}
              <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-white">
                <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
                  Plate 01
                </span>
                <span className="text-white/40">→</span>
                <span className="bg-sky-500/30 backdrop-blur-md px-2 py-0.5 rounded border border-sky-500/40 text-sky-200">
                  Z-Depth Matte
                </span>
                <span className="text-white/40">→</span>
                <span className="bg-emerald-500/30 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-200">
                  Particle FX
                </span>
                <span className="text-white/40">→</span>
                <span className="bg-purple-500/30 backdrop-blur-md px-2 py-0.5 rounded border border-purple-500/40 text-purple-200">
                  Bloom / Lens Grain
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shot Tracking Table */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              VFX Shot Delivery & Pipeline Tracking
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              {mockShots.length} Production Shots Assigned
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/70 text-muted-foreground uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Shot Name</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Lead Assignee</th>
                  <th className="py-2.5 px-3">VFX Elements</th>
                  <th className="py-2.5 px-3">Supervisor Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {mockShots.map((shot) => (
                  <tr key={shot.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {shot.name}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold',
                          shotStatusBadge(shot.status)
                        )}
                      >
                        {shot.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-foreground font-medium">
                      {shot.assignee}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {shot.elements.map((el) => (
                          <span
                            key={el}
                            className="rounded bg-secondary/70 border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {el}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground max-w-xs truncate">
                      {shot.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Box,
  Play,
  Pause,
  Square,
  Repeat,
  Info,
  Maximize2,
  FolderOpen,
  Plus,
  Move,
  RotateCw,
  Scale,
  Activity,
  Sliders,
  Eye,
  Lock,
  ChevronRight,
  Diamond,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AnimationMode = '2D Animation' | '3D Animation';

interface AssetRig {
  id: string;
  name: string;
  type: 'character' | 'prop' | 'environment' | 'fx';
  visible: boolean;
  locked: boolean;
  keyframeCount: number;
}

const initialAssets: AssetRig[] = [
  { id: '1', name: 'Hero Rig: Kael (Bipedal IK)', type: 'character', visible: true, locked: false, keyframeCount: 24 },
  { id: '2', name: 'Sentinel Drone v2 (Mechanical)', type: 'prop', visible: true, locked: false, keyframeCount: 16 },
  { id: '3', name: 'Cybernetic Neon Pulse Rifle', type: 'prop', visible: true, locked: true, keyframeCount: 8 },
  { id: '4', name: 'Parallax Background: Tokyo Dusk', type: 'environment', visible: true, locked: false, keyframeCount: 4 },
  { id: '5', name: 'Volumetric Mist & Rain Particles', type: 'fx', visible: true, locked: false, keyframeCount: 12 },
];

export default function AnimationStudioPage() {
  const [mode, setMode] = useState<AnimationMode>('3D Animation');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentFrame, setCurrentFrame] = useState<number>(42);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Transform property states
  const [posX, setPosX] = useState('0.00');
  const [posY, setPosY] = useState('1.75');
  const [posZ, setPosZ] = useState('-3.20');
  const [rotX, setRotX] = useState('0°');
  const [rotY, setRotY] = useState('45°');
  const [rotZ, setRotZ] = useState('0°');
  const [scaleVal, setScaleVal] = useState('1.00');
  const [interpolation, setInterpolation] = useState('Cubic Bezier (EaseInOut)');

  const selectedAsset = initialAssets.find((a) => a.id === selectedAssetId) || initialAssets[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
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
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    Animation Studio
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Kinematic rigging, keyframe curves, and motion choreography
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-secondary/40 p-1">
              {(['2D Animation', '3D Animation'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                    mode === m
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
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

        {/* 3-Column Layout: Left (Assets) | Center (Canvas) | Right (Properties) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Panel: Character & Rig Hierarchy (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Scene Rigs & Assets</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{initialAssets.length} rigs</span>
              </div>

              <div className="space-y-1.5">
                {initialAssets.map((asset) => {
                  const isSelected = selectedAssetId === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                          : 'border-border/60 bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Box className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{asset.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                        <Eye className="h-3 w-3 hover:text-foreground" />
                        {asset.locked && <Lock className="h-3 w-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Import Rig / Skeleton</span>
            </button>
          </div>

          {/* Center: Animation Canvas Viewport (6 cols) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span>VIEWPORT ({mode === '3D Animation' ? 'PERSPECTIVE' : '2D CANVAS'})</span>
                <span className="text-[10px] text-muted-foreground">• GRID: 0.5M</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                60.0 FPS
              </span>
            </div>

            {/* Canvas Viewport Box */}
            <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl border border-border bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
              {/* Coordinate Grid Mockup Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              {/* Viewport Header Controls */}
              <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
                <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 font-mono text-[10px]">
                  ACTIVE CAMERA: CAM_CHOREOGRAPHY_01
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 font-mono text-[10px]">
                  FRAME: {currentFrame} / 120
                </span>
              </div>

              {/* Center 3D Wireframe / Rig Placeholder */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 backdrop-blur-md text-purple-400 shadow-glow">
                  <Box className="h-12 w-12 animate-pulse" />
                  {/* Coordinate Axes Gizmo Mockup */}
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-0.5 font-mono text-[9px] bg-black/80 px-1.5 py-0.5 rounded text-white border border-white/20">
                    <span className="text-rose-400 font-bold">X</span>
                    <span className="text-emerald-400 font-bold">Y</span>
                    <span className="text-sky-400 font-bold">Z</span>
                  </div>
                </div>
                <div className="text-center bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                  <span className="text-xs font-semibold text-white">
                    {selectedAsset.name}
                  </span>
                </div>
              </div>

              {/* Viewport Footer Bar */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70">
                <span className="font-mono">Shading: Wireframe + Textured MatCap</span>
                <Maximize2 className="h-4 w-4 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Right Panel: Transform & Keyframe Properties (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-primary" />
                <span>Transform & Posing</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Position */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Move className="h-3 w-3" /> Position (X, Y, Z)
                </span>
                <div className="grid grid-cols-3 gap-1.5 font-mono">
                  <input
                    type="text"
                    value={posX}
                    onChange={(e) => setPosX(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={posY}
                    onChange={(e) => setPosY(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={posZ}
                    onChange={(e) => setPosZ(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <RotateCw className="h-3 w-3" /> Rotation Angles
                </span>
                <div className="grid grid-cols-3 gap-1.5 font-mono">
                  <input
                    type="text"
                    value={rotX}
                    onChange={(e) => setRotX(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={rotY}
                    onChange={(e) => setRotY(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={rotZ}
                    onChange={(e) => setRotZ(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Scale */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Scale className="h-3 w-3" /> Uniform Scale
                </span>
                <input
                  type="text"
                  value={scaleVal}
                  onChange={(e) => setScaleVal(e.target.value)}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-center text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Interpolation */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Keyframe Interpolation
                </span>
                <select
                  value={interpolation}
                  onChange={(e) => setInterpolation(e.target.value)}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option>Cubic Bezier (EaseInOut)</option>
                  <option>Linear Progression</option>
                  <option>Constant Step (Stepped)</option>
                  <option>Spring Physics Simulation</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                >
                  <Diamond className="h-3.5 w-3.5 fill-current" />
                  <span>Insert Keyframe (F42)</span>
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg border border-border bg-secondary/50 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear Pose
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Keyframe Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentFrame(0);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                  isLooping
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border bg-secondary/60 text-muted-foreground'
                )}
              >
                <Repeat className="h-3.5 w-3.5" />
              </button>

              <div className="h-5 w-[1px] bg-border mx-1" />

              <span className="font-mono text-xs text-foreground font-semibold">
                Frame {currentFrame} / 120
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span>Timecode: 00:01:18</span>
              <span>Range: 0 - 120</span>
            </div>
          </div>

          {/* Frame Markers Bar */}
          <div className="relative h-6 border-b border-border/60 flex items-center justify-between font-mono text-[10px] text-muted-foreground px-4">
            {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((frame) => (
              <span key={frame}>{frame}</span>
            ))}
          </div>

          {/* Timeline Track with Keyframe Diamonds */}
          <div className="space-y-2 pt-1">
            <div className="relative h-9 rounded-lg border border-border/80 bg-secondary/30 p-2 flex items-center overflow-hidden">
              {/* Playhead line indicator */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-primary z-20 shadow-[0_0_8px_hsl(var(--primary))]"
                style={{ left: `${(currentFrame / 120) * 100}%` }}
              />

              {/* Mock diamond keyframes */}
              {[0, 18, 42, 60, 84, 110].map((kf) => (
                <div
                  key={kf}
                  style={{ left: `${(kf / 120) * 96}%` }}
                  className="absolute z-10 -translate-x-1/2 flex items-center justify-center text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                  title={`Keyframe at frame ${kf}`}
                >
                  <Diamond className="h-3.5 w-3.5 fill-current" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Management Section (Grid of Assets) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Scene Asset Library & Animation Presets
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">4 Available Presets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Walk Cycle (Bipedal)', category: 'Locomotion', duration: '24 Frames' },
              { name: 'Sprint & Wall Leap', category: 'Acrobatic', duration: '48 Frames' },
              { name: 'Weapon Draw & Aim', category: 'Combat Pose', duration: '18 Frames' },
              { name: 'Idle Breathing & Scan', category: 'Ambient Loop', duration: '60 Frames' },
            ].map((preset) => (
              <div
                key={preset.name}
                className="rounded-xl border border-border bg-secondary/20 p-3 hover:border-primary/40 transition-colors cursor-pointer group"
              >
                <div className="h-16 rounded-lg bg-gradient-to-br from-purple-900/40 to-slate-900 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mb-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-foreground truncate">{preset.name}</h3>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{preset.category}</span>
                  <span className="font-mono">{preset.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

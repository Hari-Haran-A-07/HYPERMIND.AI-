'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Video,
  Film,
  Sparkles,
  Info,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  Layers,
  Wand2,
  Sliders,
  Upload,
  Image as ImageIcon,
  Clock,
  Ratio,
  Disc3,
  HelpCircle,
  Music,
  Scissors,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StudioTab = 'text-to-video' | 'image-to-video' | 'scene-editor';
type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';
type DurationOption = '5s' | '10s' | '15s' | '30s';
type VideoStyle = 'Cinematic' | 'Animation' | 'Documentary' | 'Music Video';

const aspectRatios: { id: AspectRatio; label: string; iconBox: string }[] = [
  { id: '16:9', label: '16:9 (Landscape)', iconBox: 'w-6 h-3.5' },
  { id: '9:16', label: '9:16 (Vertical)', iconBox: 'w-3.5 h-6' },
  { id: '1:1', label: '1:1 (Square)', iconBox: 'w-4 h-4' },
  { id: '4:3', label: '4:3 (Classic)', iconBox: 'w-5 h-4' },
];

const durations: DurationOption[] = ['5s', '10s', '15s', '30s'];

const videoStyles: { id: VideoStyle; desc: string }[] = [
  { id: 'Cinematic', desc: 'Anamorphic lens blur, moody contrast, 24fps film grain' },
  { id: 'Animation', desc: 'Vibrant 3D cel-shaded stylization with fluid keyframes' },
  { id: 'Documentary', desc: 'Natural lighting, handheld stabilization, authentic textures' },
  { id: 'Music Video', desc: 'High-speed kinetic transitions, neon flares, rhythmic cuts' },
];

export default function VideoStudioPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>('text-to-video');
  const [prompt, setPrompt] = useState(
    'Hyper-detailed cinematic shot of an astronaut walking across a bioluminescent crystal lake on an exoplanet at twilight, anamorphic 8k, photorealistic lighting.'
  );
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('16:9');
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>('10s');
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('Cinematic');
  const [isPlaying, setIsPlaying] = useState(false);

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
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    AI Video Studio
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Neural cinematography, text-to-video generation, and motion sequencing
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Mode Tabs */}
            <div className="flex items-center rounded-xl border border-border bg-secondary/40 p-1">
              {(
                [
                  { id: 'text-to-video', label: 'Text-to-Video' },
                  { id: 'image-to-video', label: 'Image-to-Video' },
                  { id: 'scene-editor', label: 'Scene Editor' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
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

        {/* Main Split Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Configuration Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
            {activeTab === 'text-to-video' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <span>Neural Prompt Generator</span>
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">Diffusion Model v4</span>
                </div>

                {/* Prompt Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Prompt Description
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to create with camera movement, mood, and subject..."
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                  />
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Aspect Ratio</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{selectedRatio}</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {aspectRatios.map((item) => {
                      const isSelected = selectedRatio === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedRatio(item.id)}
                          className={cn(
                            'flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                              : 'border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          <div
                            className={cn(
                              'border border-current rounded-sm flex items-center justify-center',
                              item.iconBox
                            )}
                          />
                          <span className="text-[11px]">{item.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Clip Duration</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{selectedDuration}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {durations.map((dur) => {
                      const isSelected = selectedDuration === dur;
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={cn(
                            'rounded-xl border py-2 text-xs font-mono font-medium transition-all text-center',
                            isSelected
                              ? 'border-primary bg-primary/15 text-primary font-bold'
                              : 'border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          {dur}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Style Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Cinematic Style Preset
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {videoStyles.map((style) => {
                      const isSelected = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={cn(
                            'flex flex-col items-start rounded-xl border p-2.5 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/40'
                              : 'border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          <span className="text-xs font-bold text-foreground">{style.id}</span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                            {style.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Preview Button (Disabled with Tooltip) */}
                <div className="pt-2">
                  <div className="group relative">
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/40 px-4 py-3 text-xs font-semibold text-primary-foreground/70 cursor-not-allowed shadow-none"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Preview</span>
                    </button>
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-1.5 text-[11px] font-medium text-popover-foreground shadow-lg border border-border opacity-0 transition-opacity group-hover:opacity-100">
                      Requires Engine Integration
                    </div>
                  </div>
                  <p className="text-[11px] text-center text-muted-foreground mt-2">
                    Estimated compute: ~32 sec / 1080p Neural pass
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'image-to-video' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Keyframe Image-to-Video</span>
                  </span>
                </div>

                {/* Upload placeholder */}
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/50 p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs font-semibold text-foreground">Upload Initial Keyframe Image</p>
                  <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG or WebP up to 50MB</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Camera Motion Intent
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Forward Push', 'Orbit Around Subject', 'Slow Pan Right', 'Vertical Pedestal'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        className="rounded-lg border border-border bg-secondary/30 p-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground text-left"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl bg-primary/40 py-2.5 text-xs font-semibold text-primary-foreground/70 cursor-not-allowed"
                >
                  Generate Motion Sequence (Preview Locked)
                </button>
              </div>
            )}

            {activeTab === 'scene-editor' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Scissors className="h-4 w-4 text-primary" />
                    <span>Scene Sequence Manager</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Splice multiple generated AI clips, attach ambient audio beds, and calibrate color lookup tables.
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border bg-secondary/20 flex items-center justify-between">
                    <span className="text-xs font-medium">Clip 01: Bioluminescent Lake</span>
                    <span className="text-xs font-mono text-muted-foreground">00:04</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-secondary/20 flex items-center justify-between">
                    <span className="text-xs font-medium">Clip 02: Space Shuttle Descent</span>
                    <span className="text-xs font-mono text-muted-foreground">00:06</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Video Preview Area (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Master Viewport (HDR Preview)
              </span>
              <span className="text-xs font-mono text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                1080p • 24.000 FPS • ProRES 422
              </span>
            </div>

            {/* Video Player Canvas */}
            <div className="relative w-full aspect-video rounded-2xl border border-border overflow-hidden bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 shadow-2xl flex flex-col justify-between p-4 group">
              {/* Top Bar Over Video */}
              <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md font-mono text-[11px] border border-white/10">
                  REC PLAYBACK
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md font-mono text-[11px] border border-white/10">
                  GAMMA 2.4 / ACEScg
                </span>
              </div>

              {/* Large Center Placeholder with Film Reel Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black/50 border border-white/20 backdrop-blur-md shadow-glow transition-transform group-hover:scale-105">
                  <Disc3 className="h-10 w-10 text-sky-400 animate-spin-slow" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white tracking-wide">
                    Neural Render Preview Engine
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    16:9 • Cinematic Diffusion Pipeline Ready
                  </p>
                </div>
              </div>

              {/* Bottom Video Controls Overlay */}
              <div className="relative z-10 flex items-center justify-between rounded-xl bg-black/70 backdrop-blur-md px-4 py-2 text-white border border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 text-white hover:text-sky-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>
                  <button
                    type="button"
                    className="p-1 text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-xs text-white/80">
                    00:03:14 / 00:10:00
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
                  <Maximize2 className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Multi-Track Timeline (Visual Only) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Non-Linear Editing (NLE) Timeline
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span>Zoom: 100%</span>
              <span>Snap: ON</span>
            </div>
          </div>

          {/* Time Ruler */}
          <div className="relative h-6 border-b border-border/60 font-mono text-[10px] text-muted-foreground flex justify-between px-24">
            <span>00:00</span>
            <span>00:02</span>
            <span>00:04</span>
            <span>00:06</span>
            <span>00:08</span>
            <span>00:10</span>
          </div>

          {/* Timeline Tracks */}
          <div className="space-y-2.5">
            {/* Track 1: Video */}
            <div className="flex items-center gap-3">
              <div className="w-20 shrink-0 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-sky-400" />
                <span>Video 1</span>
              </div>
              <div className="relative flex-1 h-12 rounded-lg border border-sky-500/30 bg-sky-500/10 p-1 flex items-center gap-2 overflow-hidden">
                <div className="h-full w-2/5 rounded bg-gradient-to-r from-sky-600/40 to-blue-600/40 border border-sky-400/40 flex items-center px-3 text-xs font-mono text-sky-200">
                  Shot_01_Crystal_Lake.mp4 [00:04]
                </div>
                <div className="h-full w-3/5 rounded bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-sky-400/40 flex items-center px-3 text-xs font-mono text-sky-200">
                  Shot_02_Exoplanet_Skyline.mp4 [00:06]
                </div>
              </div>
            </div>

            {/* Track 2: Audio */}
            <div className="flex items-center gap-3">
              <div className="w-20 shrink-0 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Music className="h-3.5 w-3.5 text-emerald-400" />
                <span>Audio 1</span>
              </div>
              <div className="relative flex-1 h-10 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1 flex items-center overflow-hidden">
                <div className="h-full w-full rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center px-3 text-xs font-mono text-emerald-300">
                  Cinematic_Atmosphere_Soundtrack.wav (Stereo 48kHz)
                </div>
              </div>
            </div>

            {/* Track 3: Effects */}
            <div className="flex items-center gap-3">
              <div className="w-20 shrink-0 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>FX 1</span>
              </div>
              <div className="relative flex-1 h-8 rounded-lg border border-purple-500/30 bg-purple-500/10 p-1 flex items-center gap-4 overflow-hidden">
                <div className="h-full w-1/3 rounded bg-purple-500/20 border border-purple-500/40 flex items-center px-2 text-[11px] font-mono text-purple-300">
                  LUT_BladeRunner_Warm.cube
                </div>
                <div className="h-full w-1/4 rounded bg-purple-500/20 border border-purple-500/40 flex items-center px-2 text-[11px] font-mono text-purple-300">
                  Anamorphic Lens Flare
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

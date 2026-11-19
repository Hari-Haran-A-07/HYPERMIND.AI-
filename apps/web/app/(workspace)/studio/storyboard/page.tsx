'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Film,
  Camera,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Sparkles,
  Info,
  Clock,
  Layers,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type CameraAngle =
  | 'Wide'
  | 'Medium'
  | 'Close-up'
  | 'Over-the-shoulder'
  | "Bird's eye"
  | 'Dutch angle';

export type ShotType =
  | 'Establishing'
  | 'Action'
  | 'Dialogue'
  | 'Transition'
  | 'Montage';

interface StoryboardScene {
  id: string;
  sceneNumber: number;
  title: string;
  description: string;
  cameraAngle: CameraAngle;
  shotType: ShotType;
  duration: string;
  gradientBg: string;
}

const cameraAngles: CameraAngle[] = [
  'Wide',
  'Medium',
  'Close-up',
  'Over-the-shoulder',
  "Bird's eye",
  'Dutch angle',
];

const shotTypes: ShotType[] = [
  'Establishing',
  'Action',
  'Dialogue',
  'Transition',
  'Montage',
];

const initialScenes: StoryboardScene[] = [
  {
    id: 'scene-1',
    sceneNumber: 1,
    title: 'EXT. NEO-TOKYO METROPOLIS - DUSK',
    description:
      'Sweeping view of towering holographic monoliths piercing dense atmospheric rain. Flying couriers zip between neon canyons.',
    cameraAngle: 'Wide',
    shotType: 'Establishing',
    duration: '00:04',
    gradientBg: 'from-violet-900/60 via-indigo-950/80 to-slate-950',
  },
  {
    id: 'scene-2',
    sceneNumber: 2,
    title: 'INT. UNDERGROUND REBEL LAB - CONTINUOUS',
    description:
      'Kael leans over the flickering neural synthesizer table. Electric violet glow reflects off cracked cybernetic optics.',
    cameraAngle: 'Close-up',
    shotType: 'Dialogue',
    duration: '00:03',
    gradientBg: 'from-cyan-900/60 via-blue-950/80 to-slate-950',
  },
  {
    id: 'scene-3',
    sceneNumber: 3,
    title: 'INT. SYNTHESIS CORRIDOR - NIGHT',
    description:
      'Security sentinels breach the blast bulkhead. Sparks rain down as emergency sirens flash amber warnings across the room.',
    cameraAngle: 'Dutch angle',
    shotType: 'Action',
    duration: '00:02',
    gradientBg: 'from-amber-900/60 via-rose-950/80 to-slate-950',
  },
  {
    id: 'scene-4',
    sceneNumber: 4,
    title: 'EXT. SKYLINE PLATFORM - NIGHT',
    description:
      'Kael leaps across the chasm toward the tethered skiff. The neon metropolis sprawls thousands of feet below.',
    cameraAngle: 'Over-the-shoulder',
    shotType: 'Transition',
    duration: '00:05',
    gradientBg: 'from-emerald-900/60 via-teal-950/80 to-slate-950',
  },
];

const angleColorMap: Record<CameraAngle, string> = {
  Wide: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
  Medium: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  'Close-up': 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  'Over-the-shoulder': 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
  "Bird's eye": 'border-teal-500/30 text-teal-400 bg-teal-500/10',
  'Dutch angle': 'border-amber-500/30 text-amber-400 bg-amber-500/10',
};

const shotTypeColorMap: Record<ShotType, string> = {
  Establishing: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  Action: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  Dialogue: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  Transition: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  Montage: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
};

export default function StoryboardStudioPage() {
  const [scenes, setScenes] = useState<StoryboardScene[]>(initialScenes);
  const [activeSceneId, setActiveSceneId] = useState<string>(initialScenes[0].id);

  // Form states
  const [sceneTitle, setSceneTitle] = useState('');
  const [scriptInput, setScriptInput] = useState('');
  const [selectedAngle, setSelectedAngle] = useState<CameraAngle>('Wide');
  const [selectedShotType, setSelectedShotType] = useState<ShotType>('Establishing');
  const [durationInput, setDurationInput] = useState('00:04');

  const gradientsPool = [
    'from-fuchsia-900/60 via-purple-950/80 to-slate-950',
    'from-rose-900/60 via-orange-950/80 to-slate-950',
    'from-teal-900/60 via-cyan-950/80 to-slate-950',
    'from-amber-900/60 via-yellow-950/80 to-slate-950',
  ];

  const handleAddScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneTitle.trim() || !scriptInput.trim()) {
      toast.error('Missing scene information', {
        description: 'Please provide both a scene title and script description.',
      });
      return;
    }

    const nextNumber = scenes.length > 0 ? Math.max(...scenes.map((s) => s.sceneNumber)) + 1 : 1;
    const newScene: StoryboardScene = {
      id: `scene-${Date.now()}`,
      sceneNumber: nextNumber,
      title: sceneTitle.trim(),
      description: scriptInput.trim(),
      cameraAngle: selectedAngle,
      shotType: selectedShotType,
      duration: durationInput || '00:03',
      gradientBg: gradientsPool[scenes.length % gradientsPool.length],
    };

    setScenes([...scenes, newScene]);
    setActiveSceneId(newScene.id);
    setSceneTitle('');
    setScriptInput('');
    toast.success(`Scene #${nextNumber} added to storyboard!`);
  };

  const handleDeleteScene = (id: string, number: number) => {
    setScenes(scenes.filter((s) => s.id !== id));
    toast.info(`Scene #${number} removed`);
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
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Film className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    Cinematic Storyboard Studio
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Scene planning, camera choreography, and visual narrative continuity
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats / actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                {scenes.length} Scenes / Total runtime:{' '}
                <span className="text-foreground font-semibold">
                  00:{scenes.length * 3 < 10 ? `0${scenes.length * 3}` : scenes.length * 3}
                </span>
              </span>
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

        {/* Split Layout: Left Panel (40%) & Right Panel (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Script & Shot Input (40% -> 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Camera className="h-4 w-4 text-primary" />
                <span>Scene & Shot Director</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">Scene Creator</span>
            </div>

            <form onSubmit={handleAddScene} className="space-y-4">
              {/* Scene Title / Heading */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Scene Heading (Slugline)
                </label>
                <input
                  type="text"
                  value={sceneTitle}
                  onChange={(e) => setSceneTitle(e.target.value)}
                  placeholder="e.g. EXT. NEO-TOKYO METROPOLIS - DUSK"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Shot Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Shot Type
                </label>
                <select
                  value={selectedShotType}
                  onChange={(e) => setSelectedShotType(e.target.value as ShotType)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {shotTypes.map((st) => (
                    <option key={st} value={st}>
                      {st} Shot
                    </option>
                  ))}
                </select>
              </div>

              {/* Camera Angle Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Camera Angle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {cameraAngles.map((angle) => {
                    const isSelected = selectedAngle === angle;
                    return (
                      <button
                        key={angle}
                        type="button"
                        onClick={() => setSelectedAngle(angle)}
                        className={cn(
                          'rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-all text-center',
                          isSelected
                            ? 'border-primary bg-primary/15 text-primary font-semibold shadow-sm'
                            : 'border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        {angle}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Estimate */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Duration (mm:ss)
                </label>
                <input
                  type="text"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  placeholder="00:04"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Script Input / Scene Action */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex justify-between">
                  <span>Script & Action Description</span>
                  <span className="text-[10px] text-muted-foreground">Screenplay format</span>
                </label>
                <textarea
                  rows={4}
                  value={scriptInput}
                  onChange={(e) => setScriptInput(e.target.value)}
                  placeholder="Describe camera movement, lighting, blocking, and emotional beats..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                />
              </div>

              {/* Add Scene Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Plus className="h-4 w-4" />
                <span>Add Scene to Storyboard</span>
              </button>
            </form>
          </div>

          {/* Right Panel: Storyboard Canvas Area (60% -> 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-foreground">
                  Storyboard Sequence Canvas
                </h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {scenes.length} Frames
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const titleInput = document.querySelector('input') as HTMLInputElement;
                  titleInput?.focus();
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Scene</span>
              </button>
            </div>

            {/* 3-column grid of scene cards (responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {scenes.map((scene) => {
                  const isActive = activeSceneId === scene.id;

                  return (
                    <motion.div
                      key={scene.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setActiveSceneId(scene.id)}
                      className={cn(
                        'group flex flex-col justify-between rounded-xl border bg-card p-3.5 transition-all cursor-pointer',
                        isActive
                          ? 'border-primary ring-1 ring-primary/40 shadow-glow'
                          : 'border-border hover:border-border/80'
                      )}
                    >
                      {/* Top Bar: Scene # and Delete */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span className="text-primary">SCENE</span> #{scene.sceneNumber}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScene(scene.id, scene.sceneNumber);
                            }}
                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Delete scene"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Placeholder Image Area with Aspect Ratio & Grid */}
                      <div
                        className={cn(
                          'relative w-full aspect-video rounded-lg overflow-hidden border border-border/60 bg-gradient-to-br flex flex-col justify-between p-2.5 text-slate-300 mb-3',
                          scene.gradientBg
                        )}
                      >
                        {/* Camera Rule-of-Thirds Grid Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                          <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-white/20">
                            <div className="border-r border-b border-white/20" />
                            <div className="border-r border-b border-white/20" />
                            <div className="border-b border-white/20" />
                            <div className="border-r border-b border-white/20" />
                            <div className="border-r border-b border-white/20" />
                            <div className="border-b border-white/20" />
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-[10px] font-mono bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-white/90">
                            {scene.duration}
                          </span>
                          <span className="text-[10px] font-mono bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-white/90">
                            16:9 • 4K
                          </span>
                        </div>

                        {/* Center Icon */}
                        <div className="relative z-10 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <Camera className="h-4 w-4 text-white/80" />
                          </div>
                        </div>

                        {/* Bottom camera specs */}
                        <div className="relative z-10 text-[9px] font-mono tracking-wider text-white/70 truncate">
                          35mm ANAMORPHIC T1.9
                        </div>
                      </div>

                      {/* Badges for Camera Angle and Shot Type */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                            angleColorMap[scene.cameraAngle]
                          )}
                        >
                          {scene.cameraAngle}
                        </span>
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                            shotTypeColorMap[scene.shotType]
                          )}
                        >
                          {scene.shotType}
                        </span>
                      </div>

                      {/* Scene Heading & Description */}
                      <div className="space-y-1">
                        <h3 className="font-mono text-xs font-bold text-foreground line-clamp-1">
                          {scene.title}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
                          {scene.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Timeline Bar with Scene Thumbnails */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Sequence Timeline Scrub Bar
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Continuous Reel • {scenes.length} keyframes
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {scenes.map((scene, idx) => {
              const isActive = activeSceneId === scene.id;

              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneId(scene.id)}
                  className={cn(
                    'relative shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all text-left',
                    isActive
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border/60 bg-secondary/30 hover:border-border'
                  )}
                >
                  <div
                    className={cn(
                      'h-14 w-24 rounded-lg bg-gradient-to-br flex items-center justify-center text-xs font-mono font-bold text-white shadow-inner',
                      scene.gradientBg
                    )}
                  >
                    #{scene.sceneNumber}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[96px]">
                    {scene.duration}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Palette, Eye, Sparkles, Monitor, Type, Sliders } from 'lucide-react';
import { ThemeSelector } from '@/components/shared/theme-selector';

export default function AppearanceSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-border/70 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <Palette className="h-5 w-5" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider">
            Workspace Customization
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Appearance & Themes
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Select from 7 precision-engineered obsidian, light, and neon color palettes
          calibrated for low eye-strain during intense coding and research sessions.
        </p>
      </div>

      {/* 1. Theme Palette Selector Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Color Palette Theme
            </h2>
            <p className="text-xs text-muted-foreground">
              Active theme applies instantly across all workspace windows, editors, and panes.
            </p>
          </div>
          <span className="text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            7 Themes Available
          </span>
        </div>

        {/* 7 Themes Card Grid via ThemeSelector */}
        <ThemeSelector variant="cards" />
      </div>

      {/* 2. Visual Density & Typography Preview */}
      <div className="space-y-4 pt-4 border-t border-border/70">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Typography & Font Metrics
          </h2>
          <p className="text-xs text-muted-foreground">
            HYPERMIND enforces dual-typefaces: Inter for interface prose and JetBrains Mono for code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Interface Font Card */}
          <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                Inter Sans-Serif
              </span>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                UI & Prose
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineered for legibility with optical kerning and contextual alternates.
            </p>
            <div className="pt-2 text-sm font-medium text-foreground bg-background/50 p-3 rounded-xl border border-border/50">
              The quick brown fox jumps over the lazy dog. 0123456789
            </div>
          </div>

          {/* Monospace Code Font Card */}
          <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Monitor className="h-4 w-4 text-accent" />
                JetBrains Mono
              </span>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Code & Terminals
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard coding font with developer programming ligatures and distinct symbols.
            </p>
            <div className="pt-2 text-xs font-mono text-foreground bg-background/50 p-3 rounded-xl border border-border/50 overflow-x-auto">
              const stream = await ai.chat({`{ stream: true }`});
            </div>
          </div>
        </div>
      </div>

      {/* 3. Accessibility & Motion Preferences */}
      <div className="space-y-4 pt-4 border-t border-border/70">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Accessibility & Motion
          </h2>
          <p className="text-xs text-muted-foreground">
            Hardware acceleration and reduced motion enforcement.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/40 flex items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              Respect Operating System Motion Preferences
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When enabled in Windows or macOS accessibility settings, all UI animations,
              sidebar slides, and spin loops will collapse to instantaneous zero-duration transitions.
            </p>
          </div>
          <span className="text-[11px] font-mono font-medium text-success bg-success/15 border border-success/30 px-2.5 py-1 rounded-full shrink-0">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

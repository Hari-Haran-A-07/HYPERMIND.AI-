'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Check, Palette, ChevronDown, Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  swatches: [string, string, string]; // [background, surface/border, primaryAccent]
  iconType: 'dark' | 'light' | 'special';
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Deep obsidian surfaces with electric violet accents',
    swatches: ['#080B11', '#1A2434', '#7C65F6'],
    iconType: 'dark',
  },
  {
    id: 'light',
    name: 'Pure Light',
    description: 'Clean white surfaces with deep violet accents',
    swatches: ['#F8FAFC', '#E2E8F0', '#5B42E0'],
    iconType: 'light',
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    description: 'Navy-black surfaces with cool blue accents',
    swatches: ['#060B18', '#14223E', '#3B82F6'],
    iconType: 'dark',
  },
  {
    id: 'cyber-purple',
    name: 'Cyber Purple',
    description: 'Dark purple surfaces with magenta & neon accents',
    swatches: ['#0E0518', '#251240', '#C026D3'],
    iconType: 'special',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Deep teal & navy surfaces with cyan accents',
    swatches: ['#06131D', '#0E2C3F', '#06B6D4'],
    iconType: 'special',
  },
  {
    id: 'cinematic-black',
    name: 'Cinematic Black',
    description: 'True black surfaces with warm gold accents',
    swatches: ['#050505', '#1F1F1F', '#F59E0B'],
    iconType: 'dark',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Obsidian void canvas with custom-tuned violet',
    swatches: ['#080B11', '#241B42', '#8B5CF6'],
    iconType: 'special',
  },
];

export interface ThemeSelectorProps {
  variant?: 'dropdown' | 'cards';
  className?: string;
  showLabel?: boolean;
}

export function ThemeSelector({
  variant = 'dropdown',
  className,
  showLabel = false,
}: ThemeSelectorProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentThemeId = mounted ? theme || resolvedTheme || 'dark' : 'dark';
  const currentTheme =
    THEME_OPTIONS.find((t) => t.id === currentThemeId) || THEME_OPTIONS[0];

  if (!mounted) {
    if (variant === 'cards') {
      return (
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
          {THEME_OPTIONS.map((t) => (
            <div
              key={t.id}
              className="h-32 rounded-xl border border-border bg-card/50 animate-pulse"
            />
          ))}
        </div>
      );
    }
    return (
      <div className={cn('h-9 w-9 rounded-xl border border-border bg-card/50', className)} />
    );
  }

  // CARD VARIANT (For Settings Page)
  if (variant === 'cards') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = currentThemeId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setTheme(option.id)}
              className={cn(
                'group relative flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-200 select-none outline-none',
                'bg-card/70 hover:bg-card hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'border-primary shadow-glow ring-1 ring-primary/40'
                  : 'border-border/80'
              )}
            >
              {/* Top row: Name & selection radio */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {option.name}
                  </span>
                </div>

                {/* Radio selection indicator */}
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/40'
                      : 'border-border group-hover:border-muted-foreground'
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {option.description}
              </p>

              {/* 3-Color Swatch Preview Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Palette:
                </span>
                <div className="flex items-center gap-1.5 ml-auto">
                  {option.swatches.map((color, idx) => (
                    <span
                      key={idx}
                      className="h-4 w-4 rounded-full border border-white/10 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={`Color ${idx + 1}: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // DROPDOWN VARIANT (For Workspace Header)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Current theme: ${currentTheme.name}. Click to change theme.`}
          className={cn(
            'inline-flex items-center gap-2 h-9 px-2.5 rounded-xl border border-border/80 bg-card/60 hover:bg-muted text-foreground transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm',
            className
          )}
        >
          {/* Swatch dot of current theme */}
          <span
            className="h-3 w-3 rounded-full border border-white/20 shrink-0 shadow-sm"
            style={{ backgroundColor: currentTheme.swatches[2] }}
          />

          {showLabel && (
            <span className="text-xs font-medium text-foreground tracking-tight hidden sm:inline">
              {currentTheme.name}
            </span>
          )}

          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5 bg-card border-border shadow-xl">
        <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Theme Palette
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {THEME_OPTIONS.map((option) => {
          const isSelected = currentThemeId === option.id;

          return (
            <DropdownMenuItem
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={cn(
                'flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs transition-colors',
                isSelected
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-2.5">
                {/* 3 Mini Swatch Dots */}
                <div className="flex items-center -space-x-1">
                  {option.swatches.map((color, idx) => (
                    <span
                      key={idx}
                      className="h-3 w-3 rounded-full border border-background shadow-xs shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span>{option.name}</span>
              </div>

              {isSelected && <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSelector;

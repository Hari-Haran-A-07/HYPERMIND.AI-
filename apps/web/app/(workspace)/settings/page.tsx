'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  Cpu,
  User,
  Shield,
  CreditCard,
  Sliders,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';
import { MODELS, getModelById } from '@/lib/models';
import { mockUser } from '@/lib/mock-data';
import { ThemeSelector } from '@/components/shared/theme-selector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type SettingsTab = 'appearance' | 'models' | 'account';

export default function SettingsHubPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('appearance');

  const { selectedModelId, setSelectedModelId } = useUIStore();
  const currentModel = getModelById(selectedModelId);

  const navItems: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      desc: 'Themes, typography, and contrast',
    },
    {
      id: 'models',
      label: 'Models & Routing',
      icon: Cpu,
      desc: 'Default engine and provider config',
    },
    {
      id: 'account',
      label: 'Account & Plan',
      icon: User,
      desc: 'Profile, usage, and billing',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-border/70 pb-5 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your interface theme, default AI foundation models, and subscription credentials.
        </p>
      </div>

      {/* Main Settings Split: Left Nav + Right Content Area */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Settings Navigation Bar */}
        <nav
          aria-label="Settings navigation"
          className="flex md:flex-col gap-1.5 w-full md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-150 shrink-0 md:shrink select-none',
                  isActive
                    ? 'bg-accent/40 text-foreground border-l-2 border-primary font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-2 border-transparent'
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                    isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{item.label}</span>
                  <span className="hidden md:inline text-[10px] text-muted-foreground/70 truncate">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Right Settings Content Area */}
        <div className="flex-1 w-full min-w-0 bg-card/40 rounded-2xl border border-border/80 p-5 sm:p-7 space-y-8">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    Theme & Color Palette
                  </h2>
                  <Link
                    href="/settings/appearance"
                    className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    Dedicated View <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose your preferred colorway. All 7 themes use custom CSS properties with smooth transitions.
                </p>
              </div>

              {/* Theme selector visual cards */}
              <ThemeSelector variant="cards" />
            </div>
          )}

          {/* TAB 2: MODELS & ROUTING */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">
                  Default AI Intelligence Engine
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select which model initializes when you start a new conversation thread or agent task.
                </p>
              </div>

              {/* Model selection list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {MODELS.map((model) => {
                  const isSelected = selectedModelId === model.id;

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModelId(model.id)}
                      className={cn(
                        'flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-150',
                        'bg-card/70 hover:bg-card hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary',
                        isSelected
                          ? 'border-primary shadow-glow ring-1 ring-primary/40'
                          : 'border-border/70'
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: model.iconColor }}
                          />
                          <span className="font-semibold text-xs sm:text-sm text-foreground">
                            {model.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {model.description}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/50">
                        <span className="bg-muted px-1.5 py-0.5 rounded">
                          {model.contextWindow} context
                        </span>
                        <span className="uppercase tracking-wider">
                          {model.providerName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & PLAN */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">
                  User Profile & Subscription
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your credentials, active membership plan, and token quota metrics.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/40 shadow-glow">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-base">
                      {mockUser.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-base text-foreground">
                      {mockUser.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {mockUser.email}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-medium text-primary bg-primary/15 border border-primary/25 rounded-md px-2 py-0.5">
                      {mockUser.plan}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-border sm:pl-6 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Token Balance
                  </span>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {mockUser.tokenBalance.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-success font-medium">
                    Auto-renews Dec 1, 2026
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

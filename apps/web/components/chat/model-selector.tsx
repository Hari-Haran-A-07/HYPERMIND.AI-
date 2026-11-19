'use client';

import React, { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Compass,
  Zap,
  Cpu,
  Layers,
  Search,
  Check,
  ChevronDown,
  X,
  SlidersHorizontal,
  Flame,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MODELS,
  PROVIDERS,
  AIModel,
  ModelCapability,
  getModelById,
  formatCost,
} from '@/lib/models';
import { useUIStore } from '@/lib/stores/ui-store';

interface ModelSelectorProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  trigger?: React.ReactNode;
}

const PROVIDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  anthropic: Brain,
  openai: Sparkles,
  google: Compass,
  deepseek: Zap,
  nvidia: Cpu,
  'open-weight': Layers,
  mistral: Flame,
};

type TabFilter = 'all' | 'reasoning' | 'code' | 'vision' | 'fast';

const FILTER_TABS: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'reasoning', label: 'Reasoning' },
  { id: 'code', label: 'Code' },
  { id: 'vision', label: 'Vision' },
  { id: 'fast', label: 'Fast' },
];

export function ModelSelector({
  align = 'start',
  side = 'bottom',
  className,
  trigger,
}: ModelSelectorProps) {
  const {
    selectedModelId,
    setSelectedModelId,
    modelSelectorOpen,
    setModelSelectorOpen,
  } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const selectedModel = useMemo(
    () => getModelById(selectedModelId) || MODELS[0],
    [selectedModelId]
  );

  // Filter models based on search query and active capability tab
  const filteredModels = useMemo(() => {
    return MODELS.filter((model) => {
      // Tab filter
      if (activeTab !== 'all') {
        if (!model.capabilities.includes(activeTab as ModelCapability)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = model.name.toLowerCase().includes(query);
        const matchesProvider = model.providerName.toLowerCase().includes(query);
        const matchesDesc = model.description.toLowerCase().includes(query);
        const matchesCaps = model.capabilities.some((cap) =>
          cap.toLowerCase().includes(query)
        );
        return matchesName || matchesProvider || matchesDesc || matchesCaps;
      }

      return true;
    });
  }, [searchQuery, activeTab]);

  // Group filtered models by provider
  const groupedByProvider = useMemo(() => {
    const groups: { providerId: string; providerName: string; models: AIModel[] }[] = [];

    PROVIDERS.forEach((provider) => {
      const models = filteredModels.filter((m) => m.provider === provider.id);
      if (models.length > 0) {
        groups.push({
          providerId: provider.id,
          providerName: provider.name,
          models,
        });
      }
    });

    return groups;
  }, [filteredModels]);

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setModelSelectorOpen(false);
  };

  const ProviderIcon = PROVIDER_ICONS[selectedModel.provider] || Sparkles;

  return (
    <Popover.Root open={modelSelectorOpen} onOpenChange={setModelSelectorOpen}>
      <Popover.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            aria-label={`Select AI model, currently ${selectedModel.name}`}
            className={cn(
              'group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl',
              'bg-card/80 hover:bg-muted/80 text-foreground border border-border/70',
              'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              'shadow-sm hover:shadow-glow',
              modelSelectorOpen && 'border-primary/60 ring-2 ring-primary/30',
              className
            )}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: selectedModel.iconColor }}
            />
            <span className="font-medium text-xs sm:text-sm text-foreground tracking-tight">
              {selectedModel.name}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
              {selectedModel.contextWindow}
            </span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                modelSelectorOpen && 'rotate-180 text-primary'
              )}
            />
          </button>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align={align}
          side={side}
          sideOffset={8}
          className={cn(
            'z-50 w-[92vw] sm:w-[480px] max-h-[85vh] flex flex-col',
            'rounded-2xl border border-border/80 bg-card text-card-foreground',
            'shadow-2xl shadow-background/80 backdrop-blur-xl',
            'focus:outline-none animate-scale-in'
          )}
        >
          {/* Header & Search */}
          <div className="p-3.5 border-b border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Select AI Model
                </h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search models, providers, or capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm',
                  'bg-muted/50 border border-border/70 text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40',
                  'transition-colors duration-150'
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Capability Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
              {FILTER_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 shrink-0',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[380px] sm:max-h-[440px] focus:outline-none">
            {groupedByProvider.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground space-y-2">
                <Info className="w-8 h-8 mx-auto text-muted-foreground/50" />
                <p className="text-xs sm:text-sm">No models found matching your criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                  className="text-xs text-primary underline underline-offset-4"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              groupedByProvider.map((group) => {
                const GroupIcon = PROVIDER_ICONS[group.providerId] || Sparkles;

                return (
                  <div key={group.providerId} className="space-y-1.5">
                    {/* Provider Header */}
                    <div className="flex items-center gap-2 px-1 py-0.5">
                      <GroupIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.providerName}
                      </span>
                    </div>

                    {/* Models within Provider */}
                    <div className="space-y-1.5">
                      {group.models.map((model) => {
                        const isSelected = model.id === selectedModelId;
                        const ModelIcon = PROVIDER_ICONS[model.provider] || Sparkles;

                        return (
                          <div
                            key={model.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleSelectModel(model.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectModel(model.id);
                              }
                            }}
                            className={cn(
                              'group relative w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer',
                              'border border-border/50 bg-background/40 hover:bg-muted/50',
                              isSelected && [
                                'border-primary ring-1 ring-primary/40 bg-primary/10 hover:bg-primary/15',
                                'shadow-glow',
                              ]
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              {/* Left: Icon & Details */}
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/60 transition-transform group-hover:scale-105',
                                    isSelected ? 'bg-primary/20' : 'bg-muted/80'
                                  )}
                                  style={{
                                    boxShadow: isSelected
                                      ? `0 0 12px ${model.iconColor}40`
                                      : undefined,
                                  }}
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: model.iconColor }}
                                  />
                                </div>

                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-xs sm:text-sm text-foreground">
                                      {model.name}
                                    </span>

                                    {/* Badge */}
                                    {model.badge && (
                                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50">
                                        {model.badge}
                                      </span>
                                    )}

                                    {/* Status Badge */}
                                    {model.status !== 'available' && (
                                      <span
                                        className={cn(
                                          'text-[10px] font-medium px-1.5 py-0.2 rounded',
                                          model.status === 'preview'
                                            ? 'bg-warning/20 text-warning border border-warning/30'
                                            : 'bg-muted text-muted-foreground'
                                        )}
                                      >
                                        {model.status}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                                    {model.description}
                                  </p>

                                  {/* Capabilities Badges & Specs */}
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/80 px-1 rounded">
                                      {model.contextWindow} ctx
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                      {formatCost(model.costPer1MInput)} / {formatCost(model.costPer1MOutput)} 1M
                                    </span>

                                    <div className="flex items-center gap-1 ml-auto">
                                      {model.capabilities.slice(0, 3).map((cap) => (
                                        <span
                                          key={cap}
                                          className="text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-muted/60 text-muted-foreground font-mono"
                                        >
                                          {cap}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Selected check indicator */}
                              <div className="shrink-0 pt-0.5">
                                {isSelected ? (
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/40">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-border/60 group-hover:border-primary/40 transition-colors" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer info bar */}
          <div className="p-2.5 px-4 border-t border-border/60 bg-muted/20 rounded-b-2xl flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Enterprise Multi-Model Routing</span>
            <span className="font-mono text-primary">Zero Markup Rates</span>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  MessageSquare,
  Bot,
  Sparkles,
  Settings,
  PlusCircle,
  Upload,
  Palette,
  FileCode,
  Compass,
  FileText,
  Check,
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { mockConversations } from '@/lib/mock-data';
import { getModelById } from '@/lib/models';
import { THEME_OPTIONS } from '@/components/shared/theme-selector';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command';

export function CommandMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const {
    commandMenuOpen,
    setCommandMenuOpen,
    setActiveConversationId,
  } = useUIStore();

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandMenuOpen(!commandMenuOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandMenuOpen, setCommandMenuOpen]);

  const runCommand = (command: () => void) => {
    setCommandMenuOpen(false);
    command();
  };

  return (
    <CommandDialog open={commandMenuOpen} onOpenChange={setCommandMenuOpen}>
      <CommandInput placeholder="Type a command or search conversations..." />
      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty>No results found.</CommandEmpty>

        {/* 1. Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setActiveConversationId(null);
                router.push('/chat');
              })
            }
            className="flex items-center gap-2.5 text-xs py-2.5"
          >
            <PlusCircle className="h-4 w-4 text-primary" />
            <span>New Chat</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push('/chat');
              })
            }
            className="flex items-center gap-2.5 text-xs py-2.5"
          >
            <Upload className="h-4 w-4 text-accent" />
            <span>Upload Document / Context</span>
            <CommandShortcut>⌘U</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 2. Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/chat'))}
            className="flex items-center gap-2.5 text-xs py-2.5"
          >
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>Conversational Chat</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push('/agents'))}
            className="flex items-center gap-2.5 text-xs py-2.5"
          >
            <Bot className="h-4 w-4 text-sky-400" />
            <span>Autonomous Agent Cockpit</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push('/studio'))}
            className="flex items-center gap-2.5 text-xs py-2.5"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Creative Studio Canvas</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push('/settings'))}
            className="flex items-center gap-2.5 text-xs py-2.5"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Settings & Preferences</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 3. Recent Conversations */}
        <CommandGroup heading="Recent Conversations">
          {mockConversations.slice(0, 5).map((conv) => {
            const model = getModelById(conv.modelId);

            return (
              <CommandItem
                key={conv.id}
                onSelect={() =>
                  runCommand(() => {
                    setActiveConversationId(conv.id);
                    router.push('/chat');
                  })
                }
                className="flex items-center justify-between text-xs py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: model.iconColor }}
                  />
                  <span className="truncate max-w-[280px] sm:max-w-[340px]">
                    {conv.title}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">
                  {model.name}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* 4. Themes */}
        <CommandGroup heading="Themes">
          {THEME_OPTIONS.map((themeOption) => {
            const isCurrent = theme === themeOption.id;

            return (
              <CommandItem
                key={themeOption.id}
                onSelect={() =>
                  runCommand(() => {
                    setTheme(themeOption.id);
                  })
                }
                className="flex items-center justify-between text-xs py-2"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full border border-border shrink-0 shadow-xs"
                    style={{ backgroundColor: themeOption.swatches[2] }}
                  />
                  <span>{themeOption.name}</span>
                </div>
                {isCurrent && <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" />}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandMenu;

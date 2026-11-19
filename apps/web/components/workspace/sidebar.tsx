'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  PanelLeftClose,
  Star,
  Clock,
  Calendar,
  Archive,
  MoreHorizontal,
  Pencil,
  Trash2,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';
import {
  mockConversations,
  mockUser,
  groupConversations,
  type ConversationItem,
} from '@/lib/mock-data';
import { getModelById } from '@/lib/models';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  onItemSelect?: () => void;
  className?: string;
  isMobile?: boolean;
}

export function Sidebar({ onItemSelect, className, isMobile = false }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    sidebarOpen,
    toggleSidebar,
    setCommandMenuOpen,
    activeConversationId,
    setActiveConversationId,
  } = useUIStore();

  const [conversations, setConversations] =
    React.useState<ConversationItem[]>(mockConversations);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  // Handle New Chat action
  const handleNewChat = () => {
    setActiveConversationId(null);
    if (onItemSelect) onItemSelect();
    router.push('/chat');
  };

  // Select conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    if (onItemSelect) onItemSelect();
    router.push('/chat');
  };

  // Delete conversation
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  // Rename conversation trigger
  const handleStartRename = (c: ConversationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  // Submit Rename
  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c))
      );
    }
    setEditingId(null);
  };

  // Group conversations into 4 sections using shared groupConversations helper
  const grouped = React.useMemo(() => groupConversations(conversations), [conversations]);

  const sections = [
    { id: 'pinned', title: 'Pinned Threads', icon: Star, items: grouped.pinned, iconColor: 'text-amber-400' },
    { id: 'today', title: 'Today', icon: Clock, items: grouped.today, iconColor: 'text-primary' },
    { id: 'previous-7-days', title: 'Previous 7 Days', icon: Calendar, items: grouped.previous7Days, iconColor: 'text-muted-foreground' },
    { id: 'older', title: 'Older', icon: Archive, items: grouped.older, iconColor: 'text-muted-foreground' },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card border-r border-border text-foreground select-none relative',
        isMobile ? 'w-full' : 'w-[280px] shrink-0',
        className
      )}
    >
      {/* 1. Header: HYPERMIND Wordmark + Collapse button */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-border/70 shrink-0">
        <Link
          href="/chat"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-glow">
            <Zap className="h-4 w-4 fill-current stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-base text-foreground font-sans">
              HYPERMIND
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary/15 text-primary border border-primary/25">
              AI
            </span>
          </div>
        </Link>

        {!isMobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. Primary Actions: New Chat Button & Search Bar */}
      <div className="p-3 space-y-2 shrink-0">
        {/* New Chat Button */}
        <button
          type="button"
          onClick={handleNewChat}
          className={cn(
            'flex items-center justify-between w-full h-10 px-3.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200',
            'bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 active:scale-[0.98]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Chat</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 bg-white/10 px-1.5 py-0.5 rounded">
            ⌘N
          </span>
        </button>

        {/* Search Bar / Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandMenuOpen(true)}
          className={cn(
            'flex items-center justify-between w-full h-9 px-3 rounded-xl text-xs text-muted-foreground transition-colors',
            'border border-border/80 bg-background/50 hover:bg-muted/80 hover:text-foreground hover:border-border',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="truncate">Search or jump to...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground border border-border/60">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Conversation List grouped by sections */}
      <ScrollArea className="flex-1 px-3 py-1">
        <div className="space-y-4 pb-4">
          {sections.map((section) => {
            if (section.items.length === 0) return null;
            const SectionIcon = section.icon;

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <SectionIcon className={cn('h-3.5 w-3.5 shrink-0', section.iconColor)} />
                  <span className="uppercase tracking-wider text-[10px] font-semibold">
                    {section.title}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">
                    {section.items.length}
                  </span>
                </div>

                {/* Section Items */}
                <div className="space-y-0.5">
                  {section.items.map((conv) => {
                    const isActive = activeConversationId === conv.id;
                    const modelInfo = getModelById(conv.modelId);
                    const isEditing = editingId === conv.id;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={cn(
                          'group relative flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150',
                          isActive
                            ? 'bg-accent/40 text-foreground font-medium border-l-2 border-primary shadow-xs'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-2 border-transparent'
                        )}
                      >
                        {/* Conversation Details */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                          {/* Model Badge Dot */}
                          <span
                            className="h-2 w-2 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: modelInfo.iconColor }}
                            title={`Engine: ${modelInfo.name}`}
                          />

                          {/* Editable or Static Title */}
                          {isEditing ? (
                            <input
                              type="text"
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(conv.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              onBlur={() => handleSaveRename(conv.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-6 w-full rounded bg-background px-1.5 text-xs text-foreground outline-none border border-primary"
                            />
                          ) : (
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="truncate text-foreground/90 group-hover:text-foreground">
                                {conv.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 font-mono">
                                {formatRelativeTime(conv.updatedAt)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 3-Dot Hover Menu */}
                        {!isEditing && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Conversation options"
                                  className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36 bg-card border-border shadow-lg p-1">
                                <DropdownMenuItem
                                  onClick={(e) => handleStartRename(conv, e)}
                                  className="gap-2 text-xs cursor-pointer text-foreground"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  <span>Rename</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                                  className="gap-2 text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* 4. Bottom: User Profile Strip */}
      <div className="p-3 border-t border-border/70 shrink-0 bg-card/60">
        <div className="flex items-center justify-between">
          <Link
            href="/settings"
            onClick={() => onItemSelect?.()}
            className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-muted/70 transition-colors group"
          >
            <Avatar className="h-8 w-8 border border-border/80 group-hover:border-primary/50 transition-colors">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                {mockUser.fallback}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 flex-1 text-left">
              <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {mockUser.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate font-mono">
                {mockUser.plan}
              </span>
            </div>
          </Link>

          {/* Settings Gear shortcut */}
          <Link
            href="/settings"
            onClick={() => onItemSelect?.()}
            aria-label="Settings"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

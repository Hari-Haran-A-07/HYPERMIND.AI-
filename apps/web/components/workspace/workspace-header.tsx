'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  PanelLeft,
  Bell,
  Check,
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  Sparkles,
  Command,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';
import { getModelById } from '@/lib/models';
import { mockUser, mockNotifications, type NotificationItem } from '@/lib/mock-data';
import { ThemeSelector } from '@/components/shared/theme-selector';
import { ModelSelector } from '@/components/chat/model-selector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkspaceHeaderProps {
  className?: string;
}

export function WorkspaceHeader({ className }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    sidebarOpen,
    toggleSidebar,
    toggleMobileNav,
    selectedModelId,
    setCommandMenuOpen,
  } = useUIStore();

  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Derive readable page title from current pathname
  const getPageTitle = () => {
    if (pathname.startsWith('/chat')) return 'Conversational Intelligence';
    if (pathname.startsWith('/agents')) return 'Autonomous Agents';
    if (pathname.startsWith('/studio')) return 'Creative Studio';
    if (pathname.startsWith('/research')) return 'Deep Research';
    if (pathname.startsWith('/code')) return 'Code Studio';
    if (pathname.startsWith('/documents')) return 'Document Intelligence';
    if (pathname.startsWith('/settings/appearance')) return 'Appearance Settings';
    if (pathname.startsWith('/settings')) return 'Settings & Preferences';
    return 'HYPERMIND Workspace';
  };

  const selectedModel = getModelById(selectedModelId);

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center justify-between px-3 sm:px-4 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 shrink-0',
        className
      )}
    >
      {/* 1. Left Section: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={toggleMobileNav}
          aria-label="Open mobile navigation"
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop sidebar toggle button (shown when sidebar is collapsed) */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate max-w-[140px] sm:max-w-[260px] md:max-w-none">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* 2. Center Section: Model Selector Pill */}
      <div className="flex items-center justify-center">
        <ModelSelector
          align="center"
          trigger={
            <button
              type="button"
              className={cn(
                'group inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl',
                'bg-background/60 hover:bg-muted border border-border/70 text-foreground transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs hover:shadow-glow'
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs transition-transform group-hover:scale-110"
                style={{ backgroundColor: selectedModel.iconColor }}
              />
              <span className="font-semibold text-xs tracking-tight text-foreground">
                {selectedModel.name}
              </span>
              <span className="hidden lg:inline-block text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                {selectedModel.contextWindow}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          }
        />
      </div>

      {/* 3. Right Section: Theme Selector, Notification Bell, User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Command Menu quick trigger button on tablets/desktop */}
        <button
          type="button"
          onClick={() => setCommandMenuOpen(true)}
          aria-label="Open command palette"
          className="hidden sm:flex h-8 items-center gap-1.5 px-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/50"
        >
          <Command className="h-3.5 w-3.5" />
          <span className="text-[11px] font-mono">⌘K</span>
        </button>

        {/* Theme Selector Dropdown */}
        <ThemeSelector variant="dropdown" />

        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Notifications. ${unreadCount} unread`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/60 hover:bg-muted text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 bg-card border-border shadow-xl">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/60">
              <span className="text-xs font-semibold text-foreground">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-2 rounded-lg text-xs space-y-1 transition-colors',
                    item.unread ? 'bg-accent/20' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="User account menu"
              className="flex items-center gap-1.5 p-0.5 rounded-full ring-offset-background transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {mockUser.fallback}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1.5 bg-card border-border shadow-xl">
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-semibold text-foreground">{mockUser.name}</p>
                <p className="text-[11px] text-muted-foreground truncate font-mono">
                  {mockUser.email}
                </p>
                <span className="inline-block mt-1 text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.2 w-fit">
                  {mockUser.plan}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="gap-2 text-xs cursor-pointer text-foreground"
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/settings/appearance')}
              className="gap-2 text-xs cursor-pointer text-foreground"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Preferences</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="gap-2 text-xs cursor-pointer text-foreground"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Billing & Usage</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push('/login')}
              className="gap-2 text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default WorkspaceHeader;

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/lib/stores/ui-store';
import { Sidebar } from '@/components/workspace/sidebar';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { MobileNav } from '@/components/workspace/mobile-nav';
import { CommandMenu } from '@/components/workspace/command-menu';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        {/* Desktop Collapsible Animated Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="workspace-desktop-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="hidden md:flex flex-col h-full shrink-0 overflow-hidden z-20"
            >
              <Sidebar className="w-[280px] h-full" />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer (<768px Sheet) */}
        <MobileNav />

        {/* Main Content Pane */}
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
          <WorkspaceHeader />
          <main className="flex-1 overflow-y-auto min-w-0 relative">
            {children}
          </main>
        </div>

        {/* Global ⌘K Command Palette */}
        <CommandMenu />
      </div>
    </TooltipProvider>
  );
}

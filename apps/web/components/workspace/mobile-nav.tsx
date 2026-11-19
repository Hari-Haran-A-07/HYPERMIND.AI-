'use client';

import * as React from 'react';
import { useUIStore } from '@/lib/stores/ui-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sidebar } from '@/components/workspace/sidebar';

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent
        side="left"
        className="p-0 w-[300px] sm:w-[320px] max-w-[85vw] border-r border-border bg-card h-full flex flex-col"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>HYPERMIND Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Render Mobile Sidebar */}
        <Sidebar
          isMobile={true}
          onItemSelect={() => setMobileNavOpen(false)}
          className="border-r-0"
        />
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-background bg-gradient-to-b from-background via-background/95 to-secondary/20 text-foreground selection:bg-primary/25 selection:text-primary-foreground">
      {/* Ambient Radial Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-primary/15 blur-[140px] rounded-full opacity-60" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[250px] bg-accent/10 blur-[120px] rounded-full opacity-40" />

        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* HYPERMIND Logo at top */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2 py-1"
          aria-label="Return to HYPERMIND AI Home"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary/80 text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-foreground">
              HYPERMIND
            </span>
            <span className="rounded-md bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
              AI
            </span>
          </div>
        </Link>

        {/* Centered Children Content Card */}
        <div className="w-full">{children}</div>

        {/* Trust & Security Tag */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Protected with 256-bit quantum-ready encryption</span>
        </div>
      </div>
    </div>
  );
}

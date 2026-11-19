'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-background bg-gradient-to-b from-background via-background/95 to-secondary/20 text-foreground selection:bg-primary/25 selection:text-primary-foreground">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-1 py-1"
            aria-label="HYPERMIND AI Home"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary/80 text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
                HYPERMIND
              </span>
              <span className="rounded-md bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground"
            aria-label="Main Navigation"
          >
            <Link
              href="#features"
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md px-1"
            >
              Features
            </Link>
            <Link
              href="#models"
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md px-1"
            >
              Models
            </Link>
            <Link
              href="#pricing"
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md px-1"
            >
              Pricing
            </Link>
            <Link
              href="#docs"
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md px-1"
            >
              Docs
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-border/70 hover:border-primary/50 hover:bg-secondary/60 text-sm font-medium transition-all"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-medium text-sm group"
            >
              <Link href="/login" className="flex items-center gap-1.5">
                <span>Launch Workspace</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-scale-in">
            <nav className="flex flex-col space-y-3 text-base font-medium text-muted-foreground">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#models"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Models
              </Link>
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#docs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 px-2 rounded-md hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                Docs
              </Link>
            </nav>
            <div className="pt-2 flex flex-col gap-2.5 border-t border-border/60">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center"
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center shadow-glow">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Launch Workspace
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 bg-background/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          {/* 4-column Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Platform */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Platform
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Universal Workspace
                  </Link>
                </li>
                <li>
                  <Link
                    href="#models"
                    className="hover:text-primary transition-colors"
                  >
                    Multi-Model Consensus
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Autonomous Agents
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Creative Studio & Cinema
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Infinite Memory Engine
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Models & Providers */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Frontier Models
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>OpenAI GPT-4o</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Anthropic Claude 3.5 Sonnet</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span>Google Gemini 1.5 Pro</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  <span>DeepSeek R1 & V3</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  <span>NVIDIA Nemotron 70B</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Resources
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#docs"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#docs"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Benchmark Suite
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Pricing & Quotas
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Company & Trust
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About HYPERMIND
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Zero Retention Guarantee
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Enterprise Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()} HYPERMIND AI Inc. All rights reserved.</span>
            </div>

            {/* Status Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-3.5 py-1 text-xs text-foreground/80 shadow-sm"
              role="status"
              aria-label="System status: All systems operational"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium text-emerald-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

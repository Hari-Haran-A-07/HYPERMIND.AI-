'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate quick feedback
    setTimeout(() => {
      setIsLoading(false);
      toast.info('Authentication will be available after backend integration', {
        description: 'Frontend auth workflow verified.',
      });
    }, 600);
  };

  const handleOAuthClick = (provider: string) => {
    toast.info(`${provider} sign-in will be available after backend integration`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full rounded-2xl border border-border/80 bg-card/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-primary/5 space-y-6"
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to HYPERMIND AI
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="email"
            className="text-xs font-medium text-foreground block"
          >
            Email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-10 bg-background/60 border-border/80 focus-visible:ring-primary focus-visible:border-primary text-sm"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium text-foreground block"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info('Password reset will be available after backend integration')
              }
              className="text-xs text-primary hover:underline font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-10 h-10 bg-background/60 border-border/80 focus-visible:ring-primary focus-visible:border-primary text-sm"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-0.5 text-left">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-background"
          />
          <label
            htmlFor="remember"
            className="text-xs text-muted-foreground select-none cursor-pointer"
          >
            Remember me on this device
          </label>
        </div>

        {/* Sign In Primary Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-border/60" />
        <span className="absolute bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          or continue with
        </span>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuthClick('Google')}
          className="h-10 border-border/70 hover:border-primary/50 hover:bg-secondary/60 text-xs font-medium flex items-center justify-center gap-2"
        >
          {/* Google SVG Icon */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuthClick('GitHub')}
          className="h-10 border-border/70 hover:border-primary/50 hover:bg-secondary/60 text-xs font-medium flex items-center justify-center gap-2"
        >
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </Button>
      </div>

      {/* Bottom Switch Link */}
      <div className="text-center text-xs text-muted-foreground pt-1">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-primary hover:underline font-semibold transition-colors"
        >
          Sign up
        </Link>
      </div>
    </motion.div>
  );
}

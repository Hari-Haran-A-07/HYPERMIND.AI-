'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Dynamic password strength computation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-muted' };

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) {
      return { score: 1, label: 'Weak', color: 'bg-destructive' };
    }
    if (score <= 3) {
      return { score: 2, label: 'Medium', color: 'bg-warning' };
    }
    return { score: 3, label: 'Strong', color: 'bg-success' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please ensure both passwords are identical.',
      });
      return;
    }

    if (!agreeTerms) {
      toast.error('Terms & Conditions required', {
        description: 'Please accept the Terms of Service to proceed.',
      });
      return;
    }

    setIsLoading(true);

    // Simulate quick feedback
    setTimeout(() => {
      setIsLoading(false);
      toast.info('Authentication will be available after backend integration', {
        description: 'Registration workflow verified successfully.',
      });
    }, 600);
  };

  const handleOAuthClick = (provider: string) => {
    toast.info(`${provider} sign-up will be available after backend integration`);
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
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start your HYPERMIND journey
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="fullName"
            className="text-xs font-medium text-foreground block"
          >
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="fullName"
              type="text"
              required
              placeholder="Ada Lovelace"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9 h-10 bg-background/60 border-border/80 focus-visible:ring-primary focus-visible:border-primary text-sm"
              autoComplete="name"
            />
          </div>
        </div>

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
          <label
            htmlFor="password"
            className="text-xs font-medium text-foreground block"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-10 h-10 bg-background/60 border-border/80 focus-visible:ring-primary focus-visible:border-primary text-sm"
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Strength:</span>
                <span
                  className={cn(
                    'font-medium',
                    strength.score === 1 && 'text-destructive',
                    strength.score === 2 && 'text-warning',
                    strength.score === 3 && 'text-success'
                  )}
                >
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    strength.score >= 1 ? strength.color : 'bg-transparent'
                  )}
                />
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    strength.score >= 2 ? strength.color : 'bg-transparent'
                  )}
                />
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    strength.score >= 3 ? strength.color : 'bg-transparent'
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-medium text-foreground block"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                'pl-9 pr-10 h-10 bg-background/60 border-border/80 focus-visible:ring-primary focus-visible:border-primary text-sm',
                passwordsMismatch && 'border-destructive focus-visible:ring-destructive',
                passwordsMatch && 'border-success focus-visible:ring-success'
              )}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {passwordsMismatch && (
            <p className="text-[11px] text-destructive flex items-center gap-1 pt-0.5">
              <AlertCircle className="h-3 w-3" />
              Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-[11px] text-success flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>

        {/* Terms and Privacy Checkbox */}
        <div className="flex items-start gap-2 pt-1 text-left">
          <input
            id="terms"
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-background"
          />
          <label
            htmlFor="terms"
            className="text-xs text-muted-foreground leading-snug select-none cursor-pointer"
          >
            I agree to the{' '}
            <span className="text-primary hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-primary hover:underline">Privacy Policy</span>
          </label>
        </div>

        {/* Create Account Primary Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Creating account...</span>
            </span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-border/60" />
        <span className="absolute bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          or sign up with
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
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary hover:underline font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}

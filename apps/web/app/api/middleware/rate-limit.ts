/**
 * In-memory sliding window rate limiter.
 * Uses a Map of request timestamps per IP address or identifier.
 * Suitable for single-instance Next.js server, upgradeable to Redis / Upstash for distributed clusters.
 */

const requestLog = new Map<string, number[]>();

export interface RateLimitConfig {
  windowMs: number;    // Window duration in ms
  maxRequests: number; // Max requests allowed in window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

/**
 * Checks if a request identified by `identifier` (e.g. client IP) is within the rate limit.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get existing timestamps, filter to current window
  const timestamps = (requestLog.get(identifier) || []).filter((t) => t > windowStart);
  
  if (timestamps.length >= config.maxRequests) {
    const oldestInWindow = timestamps[0];
    const retryAfterMs = Math.max(0, (oldestInWindow + config.windowMs) - now);
    return { allowed: false, remaining: 0, retryAfterMs };
  }
  
  timestamps.push(now);
  requestLog.set(identifier, timestamps);
  
  return { allowed: true, remaining: config.maxRequests - timestamps.length };
}

/**
 * Reset stored rate limits (useful for test suites and administrative controls).
 */
export function resetRateLimits(): void {
  requestLog.clear();
}

// Periodic cleanup of expired entries (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requestLog.entries()) {
      const filtered = timestamps.filter((t) => t > now - 300_000);
      if (filtered.length === 0) {
        requestLog.delete(key);
      } else {
        requestLog.set(key, filtered);
      }
    }
  }, 300_000);

  // Unref interval if running in Node.js environment to allow graceful process termination
  if (typeof cleanupInterval === 'object' && cleanupInterval !== null && 'unref' in cleanupInterval) {
    (cleanupInterval as NodeJS.Timeout).unref();
  }
}

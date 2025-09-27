// Simple in-memory rate limiter for client-side use
// In production, you might want to use Redis or a more sophisticated solution

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly defaultWindowMs: number = 60 * 1000; // 1 minute
  private readonly defaultMaxRequests: number = 3; // 3 requests per minute

  constructor(
    private windowMs: number = 60 * 1000,
    private maxRequests: number = 3
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  getTimeUntilReset(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  getRemainingRequests(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return this.maxRequests;
    
    const now = Date.now();
    if (now > entry.resetTime) return this.maxRequests;
    
    return Math.max(0, this.maxRequests - entry.count);
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Create rate limiters for different operations
export const confirmationEmailLimiter = new RateLimiter(60 * 1000, 3); // 3 emails per minute
export const passwordResetLimiter = new RateLimiter(60 * 1000, 2); // 2 resets per minute

// Clean up expired entries every 5 minutes
setInterval(() => {
  confirmationEmailLimiter.cleanup();
  passwordResetLimiter.cleanup();
}, 5 * 60 * 1000);

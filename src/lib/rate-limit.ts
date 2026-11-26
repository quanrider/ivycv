export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

export interface DailyRateLimiter {
  consume(ip: string, now?: number): RateLimitResult;
  reset(): void;
}

export function createDailyRateLimiter(opts: {
  limit: number;
  windowMs: number;
}): DailyRateLimiter {
  const { limit, windowMs } = opts;
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    consume(ip: string, now = Date.now()): RateLimitResult {
      const key = ip || 'unknown';
      const entry = buckets.get(key);

      if (!entry || now >= entry.resetAt) {
        const resetAt = now + windowMs;
        if (limit <= 0) {
          return { allowed: false, remaining: 0, limit, resetAt };
        }
        buckets.set(key, { count: 1, resetAt });
        return {
          allowed: true,
          remaining: Math.max(0, limit - 1),
          limit,
          resetAt,
        };
      }

      if (entry.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          limit,
          resetAt: entry.resetAt,
        };
      }

      entry.count += 1;
      return {
        allowed: true,
        remaining: Math.max(0, limit - entry.count),
        limit,
        resetAt: entry.resetAt,
      };
    },

    reset() {
      buckets.clear();
    },
  };
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return '127.0.0.1';
}

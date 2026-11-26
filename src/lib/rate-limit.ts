export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

export interface DailyRateLimiter {
  consume(ip: string, now?: number): RateLimitResult;
  reset(): void;
  size(): number;
}

export function createDailyRateLimiter(opts: {
  limit: number;
  windowMs: number;
}): DailyRateLimiter {
  const { limit, windowMs } = opts;
  const buckets = new Map<string, { count: number; resetAt: number }>();

  function pruneExpired(now: number) {
    if (buckets.size <= 100) return;
    for (const [key, entry] of buckets.entries()) {
      if (now >= entry.resetAt) {
        buckets.delete(key);
      }
    }
  }

  return {
    consume(ip: string, now = Date.now()): RateLimitResult {
      pruneExpired(now);
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

    size() {
      return buckets.size;
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

const DAY_MS = 24 * 60 * 60 * 1000;

export function getConfiguredDailyLimit(): number {
  const parsed = Number(process.env.AI_DAILY_LIMIT ?? '10');
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 10;
}

let sharedAssistLimiter: DailyRateLimiter = createDailyRateLimiter({
  limit: getConfiguredDailyLimit(),
  windowMs: DAY_MS,
});

export function getSharedAssistRateLimiter(): DailyRateLimiter {
  return sharedAssistLimiter;
}

export function resetAssistRateLimiterForTests(limit = 10): void {
  sharedAssistLimiter = createDailyRateLimiter({ limit, windowMs: DAY_MS });
}

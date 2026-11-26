import { describe, it, expect } from 'vitest';
import { createDailyRateLimiter } from '@/lib/rate-limit';

describe('createDailyRateLimiter', () => {
  it('allows up to limit requests per IP, blocks the next, and resets after windowMs', () => {
    const limiter = createDailyRateLimiter({ limit: 2, windowMs: 1000 });
    const t0 = 1_000_000;

    const r1 = limiter.consume('1.2.3.4', t0);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(1);

    const r2 = limiter.consume('1.2.3.4', t0 + 100);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(0);

    const r3 = limiter.consume('1.2.3.4', t0 + 200);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);

    // Different IP is tracked independently
    const otherIp = limiter.consume('5.6.7.8', t0 + 200);
    expect(otherIp.allowed).toBe(true);
    expect(otherIp.remaining).toBe(1);

    // Window expires
    const afterReset = limiter.consume('1.2.3.4', t0 + 1001);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });
});

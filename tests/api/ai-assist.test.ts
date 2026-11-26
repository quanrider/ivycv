import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/lib/gemini', () => ({
  callGeminiJson: vi.fn(),
}));

import { callGeminiJson } from '@/lib/gemini';
import { POST } from '@/app/api/ai/assist/route';
import { resetAssistRateLimiterForTests } from '@/lib/rate-limit';

function makeRequest(body: unknown, ip = '10.0.0.1'): Request {
  return new Request('http://localhost:3000/api/ai/assist', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/ai/assist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAssistRateLimiterForTests(2);
    delete process.env.GEMINI_API_KEY;
  });

  it('returns 503 MISSING_API_KEY when server key is unset and no userApiKey is provided', async () => {
    const res = await POST(
      makeRequest({
        action: 'rewrite_bullet',
        templateId: 'harvard-ocs',
        language: 'vi',
        targetText: 'Hỗ trợ nhóm kinh doanh',
      })
    );
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.code).toBe('MISSING_API_KEY');
  });

  it('bypasses server quota and succeeds with userApiKey even when server GEMINI_API_KEY is unset', async () => {
    vi.mocked(callGeminiJson).mockResolvedValue({
      suggestions: ['Thúc đẩy tăng trưởng doanh số 18% thông qua...'],
      explanation: 'Áp dụng động từ hành động mạnh chuẩn Harvard.',
    });

    const res = await POST(
      makeRequest({
        action: 'rewrite_bullet',
        templateId: 'harvard-ocs',
        language: 'vi',
        targetText: 'Hỗ trợ nhóm kinh doanh',
        userApiKey: 'AIza-user-byok-key',
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.quota.usingByok).toBe(true);
    expect(data.result.suggestions).toHaveLength(1);
    expect(callGeminiJson).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: 'AIza-user-byok-key' })
    );
  });

  it('enforces daily rate limit for server key and returns 429 QUOTA_EXCEEDED', async () => {
    process.env.GEMINI_API_KEY = 'AIza-server-key';
    vi.mocked(callGeminiJson).mockResolvedValue({
      suggestions: ['Engineered caching proxy cutting p99 latency by 40%'],
      explanation: 'Quantified latency impact.',
    });

    const payload = {
      action: 'rewrite_bullet',
      templateId: 'mit-capd',
      language: 'en',
      targetText: 'Worked on caching',
    };

    const r1 = await POST(makeRequest(payload, '203.0.113.10'));
    expect(r1.status).toBe(200);
    expect((await r1.json()).quota.remaining).toBe(1);

    const r2 = await POST(makeRequest(payload, '203.0.113.10'));
    expect(r2.status).toBe(200);
    expect((await r2.json()).quota.remaining).toBe(0);

    const r3 = await POST(makeRequest(payload, '203.0.113.10'));
    expect(r3.status).toBe(429);
    expect((await r3.json()).code).toBe('QUOTA_EXCEEDED');
  });
});

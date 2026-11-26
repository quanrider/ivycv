import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CvContentSchema, CvLanguageSchema } from '@/types/cv';
import { getUniversityById } from '@/data/universities';
import { buildAiPrompt } from '@/lib/ai-prompts';
import { callGeminiJson } from '@/lib/gemini';
import { createDailyRateLimiter, extractClientIp } from '@/lib/rate-limit';

const DAY_MS = 24 * 60 * 60 * 1000;

function getConfiguredLimit(): number {
  const parsed = Number(process.env.AI_DAILY_LIMIT ?? '10');
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 10;
}

let rateLimiter = createDailyRateLimiter({
  limit: getConfiguredLimit(),
  windowMs: DAY_MS,
});

export function __resetRateLimiterForTests(limit = 10): void {
  rateLimiter = createDailyRateLimiter({ limit, windowMs: DAY_MS });
}

const AssistRequestSchema = z.object({
  action: z.enum(['rewrite_bullet', 'review_section', 'review_cv']),
  templateId: z.string().min(1),
  language: CvLanguageSchema.default('vi'),
  content: CvContentSchema.optional(),
  sectionId: z.string().optional(),
  targetText: z.string().optional(),
  userApiKey: z.string().optional(),
});

export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Yêu cầu gửi lên không phải JSON hợp lệ.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const parsed = AssistRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Thiếu thông tin cần thiết để gọi trợ lý AI.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const { action, templateId, language, content, sectionId, targetText, userApiKey } =
    parsed.data;

  const template = getUniversityById(templateId);
  if (!template) {
    return NextResponse.json(
      { error: 'Không tìm thấy mẫu trường đại học tương ứng.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const trimmedUserKey = userApiKey?.trim();
  const usingByok = Boolean(trimmedUserKey);
  let activeApiKey = trimmedUserKey;
  let quotaInfo = {
    remaining: -1,
    limit: getConfiguredLimit(),
    usingByok,
  };

  if (!usingByok) {
    const serverKey = process.env.GEMINI_API_KEY?.trim();
    if (!serverKey) {
      return NextResponse.json(
        {
          error:
            'Máy chủ chưa cấu hình GEMINI_API_KEY miễn phí. Bạn có thể dán API key Gemini riêng (BYOK) để sử dụng AI ngay.',
          code: 'MISSING_API_KEY',
        },
        { status: 503 }
      );
    }

    const clientIp = extractClientIp(request);
    const quota = rateLimiter.consume(clientIp);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: `Bạn đã dùng hết ${quota.limit} lượt AI miễn phí trong ngày. Hãy dán API key Gemini riêng (BYOK) để tiếp tục không giới hạn.`,
          code: 'QUOTA_EXCEEDED',
          quota: { remaining: 0, limit: quota.limit, usingByok: false },
        },
        { status: 429 }
      );
    }

    activeApiKey = serverKey;
    quotaInfo = {
      remaining: quota.remaining,
      limit: quota.limit,
      usingByok: false,
    };
  }

  const { systemInstruction, userPrompt } = buildAiPrompt({
    action,
    template,
    language,
    content,
    sectionId,
    targetText,
  });

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  try {
    const result = await callGeminiJson({
      apiKey: activeApiKey!,
      model,
      systemInstruction,
      userPrompt,
    });

    return NextResponse.json({ result, quota: quotaInfo }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Không thể kết nối tới dịch vụ AI lúc này.';
    return NextResponse.json(
      { error: message, code: 'AI_UPSTREAM_ERROR', quota: quotaInfo },
      { status: 502 }
    );
  }
}

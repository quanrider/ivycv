'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Sparkles,
  KeyRound,
  Check,
  Loader2,
  Lightbulb,
} from 'lucide-react';
import type { CvDocument, UniversityTemplate } from '@/types/cv';
import type { BulletTarget } from './CvFormEditor';

interface ReferenceAiDrawerProps {
  cv: CvDocument;
  template: UniversityTemplate;
  activeTab: 'reference' | 'ai';
  onTabChange: (tab: 'reference' | 'ai') => void;
  bulletTarget: BulletTarget | null;
  byokKey: string | null;
  onOpenByokModal: () => void;
  onApplyBulletSuggestion: (target: BulletTarget, text: string) => void;
}

interface AiResponsePayload {
  result?: {
    suggestions?: string[];
    explanation?: string;
    score?: number;
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    rewrittenExamples?: string[];
  };
  quota?: { remaining: number; limit: number; usingByok: boolean };
  error?: string;
  code?: string;
}

export function ReferenceAiDrawer({
  cv,
  template,
  activeTab,
  onTabChange,
  bulletTarget,
  byokKey,
  onOpenByokModal,
  onApplyBulletSuggestion,
}: ReferenceAiDrawerProps) {
  const [bulletInput, setBulletInput] = useState(bulletTarget?.text ?? '');
  const [selectedSectionId, setSelectedSectionId] = useState(
    cv.content.sections[0]?.id ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiResponsePayload['result'] | null>(null);
  const [quota, setQuota] = useState<AiResponsePayload['quota'] | null>(null);

  useEffect(() => {
    if (bulletTarget) {
      setBulletInput(bulletTarget.text);
    }
  }, [bulletTarget]);

  useEffect(() => {
    if (!cv.content.sections.some((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(cv.content.sections[0]?.id ?? '');
    }
  }, [cv.content.sections, selectedSectionId]);

  async function runAi(action: 'rewrite_bullet' | 'review_section' | 'review_cv') {
    setLoading(true);
    setError(null);
    setAiResult(null);

    const strippedContent = {
      ...cv.content,
      personalInfo: {
        ...cv.content.personalInfo,
        photoDataUrl: undefined,
      },
    };

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          templateId: template.id,
          language: cv.language,
          content: action === 'rewrite_bullet' ? undefined : strippedContent,
          sectionId: action === 'review_section' ? selectedSectionId : undefined,
          targetText: action === 'rewrite_bullet' ? bulletInput : undefined,
          userApiKey: byokKey ?? undefined,
        }),
      });
      const data = (await res.json()) as AiResponsePayload;
      if (data.quota) setQuota(data.quota);
      if (!res.ok) {
        setError(data.error || 'Không thể nhận phản hồi từ trợ lý AI.');
        return;
      }
      setAiResult(data.result ?? null);
    } catch {
      setError('Lỗi kết nối tới máy chủ AI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="flex h-full flex-col rounded-xl border border-stone-200 bg-white shadow-xs">
      <div className="grid grid-cols-2 border-b border-stone-200 p-1.5">
        <button
          type="button"
          onClick={() => onTabChange('reference')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
            activeTab === 'reference'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Tham khảo mẫu gốc
        </button>
        <button
          type="button"
          onClick={() => onTabChange('ai')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Trợ lý AI
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {activeTab === 'reference' ? (
          <>
            <div>
              <div className="text-xs font-bold text-stone-900">
                Chuẩn {template.universityName}
              </div>
              <p className="mt-0.5 text-[11px] text-stone-500">
                {template.officeOrProgram} • {template.field}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                Chú thích cách viết
              </div>
              {template.annotations.map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5"
                >
                  <div className="text-xs font-bold text-stone-900">{ann.title}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-stone-700">
                    {ann.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1.5 text-xs font-bold text-stone-800">
                Động từ hành động ({cv.language === 'vi' ? 'Tiếng Việt' : 'English'})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(cv.language === 'vi'
                  ? template.actionVerbs.vi
                  : template.actionVerbs.en
                ).map((verb) => (
                  <span
                    key={verb}
                    className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-800"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-stone-200 pt-3">
              <div className="text-xs font-bold text-stone-800">
                Trích đoạn mẫu gốc ({template.sampleCv.personalInfo.fullName})
              </div>
              {template.sampleCv.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-[11px]"
                >
                  <div className="font-bold uppercase text-stone-800">{sec.title}</div>
                  {sec.items.map((it) => (
                    <div key={it.id} className="mt-1.5">
                      {it.title ? (
                        <div className="font-semibold text-stone-900">{it.title}</div>
                      ) : null}
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-stone-700">
                        {it.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
              <div className="text-[11px] text-stone-600">
                {byokKey ? (
                  <span className="font-semibold text-emerald-700">
                    Đang dùng API key riêng (không giới hạn)
                  </span>
                ) : quota ? (
                  <span>
                    Còn <strong>{quota.remaining}/{quota.limit}</strong> lượt miễn phí hôm nay
                  </span>
                ) : (
                  <span>Chuẩn: {template.universityName}</span>
                )}
              </div>
              <button
                type="button"
                onClick={onOpenByokModal}
                className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
              >
                <KeyRound className="h-3 w-3" />
                BYOK
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                Viết lại 1 gạch đầu dòng theo chuẩn {template.universityName}
              </label>
              <textarea
                rows={3}
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                placeholder="Dán hoặc chọn một gạch đầu dòng từ trình soạn thảo..."
                className="w-full rounded-lg border border-stone-200 p-2.5 text-xs leading-relaxed outline-none focus:border-indigo-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading || !bulletInput.trim()}
                  onClick={() => runAi('rewrite_bullet')}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Viết lại bullet point
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-stone-200 pt-3">
              <label
                htmlFor="ai-section-select"
                className="block text-xs font-bold text-stone-800"
              >
                Góp ý từng mục CV
              </label>
              <div className="flex gap-2">
                <select
                  id="ai-section-select"
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="flex-1 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-800"
                >
                  {cv.content.sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title || sec.type}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={loading || !selectedSectionId}
                  onClick={() => runAi('review_section')}
                  className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100 disabled:opacity-50"
                >
                  Góp ý mục này
                </button>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => runAi('review_cv')}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Đánh giá toàn bộ CV theo chuẩn {template.universityName}
              </button>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={onOpenByokModal}
                  className="mt-2 font-semibold underline"
                >
                  Cấu hình API key Gemini riêng ngay →
                </button>
              </div>
            ) : null}

            {aiResult ? (
              <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 text-xs">
                {typeof aiResult.score === 'number' ? (
                  <div className="font-bold text-indigo-900">
                    Điểm đánh giá: {aiResult.score}/10
                  </div>
                ) : null}
                {aiResult.summary ? (
                  <p className="leading-relaxed text-stone-800">{aiResult.summary}</p>
                ) : null}
                {aiResult.explanation ? (
                  <p className="leading-relaxed text-stone-700">{aiResult.explanation}</p>
                ) : null}

                {aiResult.suggestions && aiResult.suggestions.length > 0 ? (
                  <div className="space-y-2">
                    <div className="font-bold text-stone-900">Gợi ý viết lại:</div>
                    {aiResult.suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-indigo-200 bg-white p-2.5"
                      >
                        <p className="leading-relaxed text-stone-800">{s}</p>
                        {bulletTarget ? (
                          <button
                            type="button"
                            onClick={() => onApplyBulletSuggestion(bulletTarget, s)}
                            className="mt-2 inline-flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700"
                          >
                            <Check className="h-3 w-3" />
                            Áp dụng vào CV
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {aiResult.strengths && aiResult.strengths.length > 0 ? (
                  <div>
                    <div className="font-bold text-emerald-800">Điểm mạnh:</div>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-stone-700">
                      {aiResult.strengths.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {aiResult.improvements && aiResult.improvements.length > 0 ? (
                  <div>
                    <div className="font-bold text-amber-800">Cần cải thiện:</div>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-stone-700">
                      {aiResult.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {aiResult.rewrittenExamples && aiResult.rewrittenExamples.length > 0 ? (
                  <div>
                    <div className="font-bold text-indigo-900">Ví dụ viết lại đề xuất:</div>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-stone-800">
                      {aiResult.rewrittenExamples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </aside>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  FileEdit,
  Lightbulb,
  Sparkles,
  Info,
} from 'lucide-react';
import type { SectionType, UniversityTemplate } from '@/types/cv';
import { createCvFromTemplate } from '@/data/universities';
import { saveCv } from '@/lib/storage';
import { CvHtmlPreview } from '@/components/cv/CvHtmlPreview';

export function AnnotatedShowcase({ template }: { template: UniversityTemplate }) {
  const router = useRouter();
  const [selectedAnnId, setSelectedAnnId] = useState<string>(
    template.annotations[0]?.id ?? ''
  );
  const [storageError, setStorageError] = useState<string | null>(null);

  const activeAnnotation =
    template.annotations.find((a) => a.id === selectedAnnId) ??
    template.annotations[0];

  const previewCv = {
    id: `preview-${template.id}`,
    title: `Mẫu ${template.universityName}`,
    templateId: template.id,
    language: 'en' as const,
    showPhoto: false,
    updatedAt: '',
    content: template.sampleCv,
  };

  function handleUseTemplate(lang: 'en' | 'vi') {
    const newCv = createCvFromTemplate(template.id, lang);
    const saved = saveCv(newCv);
    if (!saved.ok) {
      setStorageError(saved.error);
      return;
    }
    router.push(`/editor?cv=${encodeURIComponent(newCv.id)}`);
  }

  function handleSectionClick(sectionType: SectionType) {
    const match = template.annotations.find((a) => a.targetSection === sectionType);
    if (match) setSelectedAnnId(match.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/library"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại Thư viện mẫu
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900">
              {template.universityName}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: template.accentColor }}
            >
              {template.officeOrProgram}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">{template.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleUseTemplate('en')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <FileEdit className="h-4 w-4" />
            Dùng mẫu này (Tiếng Anh)
          </button>
          <button
            type="button"
            onClick={() => handleUseTemplate('vi')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
          >
            <FileEdit className="h-4 w-4" />
            Dùng mẫu này (Tiếng Việt)
          </button>
        </div>
      </div>

      {storageError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800">
          {storageError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-2 text-xs text-stone-500">
            Mẹo: Bấm vào từng mục trên bản CV bên dưới hoặc chọn thẻ chú thích bên phải để
            xem phân tích chi tiết cách họ viết.
          </p>
          <CvHtmlPreview
            cv={previewCv}
            template={template}
            highlightedSection={activeAnnotation?.targetSection ?? null}
            onSectionClick={handleSectionClick}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-stone-900">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Phân tích cách viết của {template.universityName}
            </h2>
            <div className="space-y-2">
              {template.annotations.map((ann) => {
                const active = ann.id === activeAnnotation?.id;
                return (
                  <button
                    key={ann.id}
                    type="button"
                    onClick={() => setSelectedAnnId(ann.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      active
                        ? 'border-amber-400 bg-amber-50/70'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{ann.title}</div>
                    {active ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-stone-700">
                        {ann.explanation}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <h2 className="mb-2.5 flex items-center gap-1.5 text-sm font-bold text-stone-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Quy tắc vàng cần nhớ
            </h2>
            <ul className="space-y-2 text-xs leading-relaxed text-stone-700">
              {template.styleRules.map((rule, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-bold text-stone-400">{idx + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-stone-900">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Động từ hành động khuyên dùng
            </h2>
            <div className="space-y-2">
              <div>
                <div className="mb-1 text-[11px] font-semibold text-stone-500">
                  Tiếng Anh (chuẩn gốc)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {template.actionVerbs.en.map((v) => (
                    <span
                      key={v}
                      className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-800"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[11px] font-semibold text-stone-500">
                  Tương đương tiếng Việt
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {template.actionVerbs.vi.map((v) => (
                    <span
                      key={v}
                      className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-800"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-100/70 p-3.5 text-xs text-stone-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
            <p>{template.photoGuidance}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Globe, Sparkles, Camera } from 'lucide-react';
import type { CvFormat, UniversityTemplate } from '@/types/cv';
import { filterUniversities } from '@/data/universities';

export function LibraryGrid({ templates }: { templates: UniversityTemplate[] }) {
  const [format, setFormat] = useState<CvFormat | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const base = filterUniversities({ format, query });
    const allowedIds = new Set(templates.map((t) => t.id));
    return base.filter((t) => allowedIds.has(t.id));
  }, [templates, format, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo trường (Harvard, MIT, Oxford...), ngành hoặc quốc gia..."
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pr-3 pl-9 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { value: 'all' as const, label: 'Tất cả' },
            { value: 'resume-1page' as const, label: 'Resume 1 trang' },
            { value: 'academic-cv' as const, label: 'Academic CV' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormat(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                format === opt.value
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">
          Không tìm thấy mẫu CV nào khớp từ khóa hiện tại.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl) => (
            <article
              key={tpl.id}
              className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: tpl.accentColor }}
                  >
                    <Globe className="h-3 w-3" />
                    {tpl.country}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600">
                    {tpl.format === 'academic-cv' ? 'Academic CV' : 'Resume 1 trang'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900">
                  {tpl.universityName}
                </h3>
                <p className="text-xs font-medium text-stone-500">
                  {tpl.officeOrProgram}
                </p>
                <p className="mt-2 text-xs font-semibold text-stone-700">
                  Ngành tiêu biểu: {tpl.field}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {tpl.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-stone-600">
                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-amber-800">
                    <Sparkles className="h-3 w-3" />
                    {tpl.annotations.length} chú thích phân tích
                  </span>
                  {tpl.photoRecommended ? (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-blue-800">
                      <Camera className="h-3 w-3" />
                      Hỗ trợ ảnh chân dung
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 border-t border-stone-100 pt-4">
                <Link
                  href={`/library/${tpl.slug}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  <span>Xem phân tích & Dùng mẫu</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

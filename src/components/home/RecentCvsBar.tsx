'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { CvDocument } from '@/types/cv';
import { loadSavedCvs } from '@/lib/storage';

export function RecentCvsBar() {
  const [recent, setRecent] = useState<CvDocument[]>([]);

  useEffect(() => {
    setRecent(loadSavedCvs().slice(0, 3));
  }, []);

  if (recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <Clock className="h-4 w-4 text-stone-500" />
            CV bạn đang viết gần đây (lưu trên trình duyệt)
          </h2>
          <Link
            href="/editor"
            className="text-xs font-medium text-stone-600 hover:text-stone-950"
          >
            Mở trình soạn thảo →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {recent.map((cv) => (
            <Link
              key={cv.id}
              href={`/editor?cv=${encodeURIComponent(cv.id)}`}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-sm transition hover:border-stone-400 hover:bg-white"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold text-stone-900">{cv.title}</div>
                <div className="text-xs text-stone-500">
                  {cv.language === 'vi' ? 'Tiếng Việt' : 'English'}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-stone-400" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

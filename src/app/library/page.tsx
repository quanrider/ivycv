import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { LibraryGrid } from '@/components/library/LibraryGrid';
import { UNIVERSITY_TEMPLATES } from '@/data/universities';

export const metadata: Metadata = {
  title: 'Thư viện mẫu CV các trường đại học danh giá | IvyCV',
  description:
    'Tham khảo mẫu CV kèm chú thích cách viết từ Harvard, MIT, Stanford, Oxford, Cambridge và ETH Zurich.',
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
            Thư viện mẫu CV các trường đại học hàng đầu
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-stone-600">
            Mỗi mẫu đều giữ nguyên cấu trúc & văn phong chuẩn quốc tế của trường, đi kèm
            phân tích bằng tiếng Việt giúp bạn hiểu rõ lý do đằng sau từng dòng viết.
          </p>
        </div>

        <LibraryGrid templates={UNIVERSITY_TEMPLATES} />
      </main>
    </div>
  );
}

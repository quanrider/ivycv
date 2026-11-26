import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CvEditorWorkspace } from '@/components/editor/CvEditorWorkspace';

export const metadata: Metadata = {
  title: 'Trình soạn thảo CV chuẩn đại học hàng đầu | IvyCV',
  description:
    'Soạn CV trực tiếp với bảng tham khảo mẫu Harvard, MIT, Stanford, Oxford, Cambridge, ETH Zurich và trợ lý AI.',
};

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-50 text-sm text-stone-500">
          Đang mở trình soạn thảo CV...
        </div>
      }
    >
      <CvEditorWorkspace />
    </Suspense>
  );
}

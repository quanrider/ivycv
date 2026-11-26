import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { AnnotatedShowcase } from '@/components/library/AnnotatedShowcase';
import {
  UNIVERSITY_TEMPLATES,
  getUniversityBySlug,
} from '@/data/universities';

export function generateStaticParams() {
  return UNIVERSITY_TEMPLATES.map((tpl) => ({ slug: tpl.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tpl = getUniversityBySlug(slug);
  if (!tpl) {
    return { title: 'Không tìm thấy mẫu CV | IvyCV' };
  }
  return {
    title: `Mẫu CV chuẩn ${tpl.universityName} (${tpl.officeOrProgram}) | IvyCV`,
    description: tpl.summary,
  };
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getUniversityBySlug(slug);
  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AnnotatedShowcase template={template} />
      </main>
    </div>
  );
}

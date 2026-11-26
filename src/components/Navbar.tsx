import React from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, FileEdit } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-stone-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-base">IvyCV</span>
          <span className="hidden rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600 sm:inline">
            Chuẩn Đại học Top
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          >
            <BookOpen className="h-4 w-4" />
            <span>Thư viện mẫu</span>
          </Link>
          <Link
            href="/editor"
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <FileEdit className="h-4 w-4" />
            <span>Viết CV ngay</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

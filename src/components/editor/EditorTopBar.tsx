'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  Download,
  FileDown,
  FileUp,
  GraduationCap,
  PanelRight,
  Plus,
  Copy,
  Trash2,
} from 'lucide-react';
import type { CvDocument, CvLanguage, UniversityTemplate } from '@/types/cv';

interface EditorTopBarProps {
  cv: CvDocument;
  savedCvs: CvDocument[];
  templates: UniversityTemplate[];
  isExportingPdf: boolean;
  drawerOpen: boolean;
  onTitleChange: (title: string) => void;
  onSelectCv: (cvId: string) => void;
  onCreateNewCv: (templateId: string) => void;
  onDuplicateCv: () => void;
  onDeleteCv: () => void;
  onTemplateChange: (templateId: string) => void;
  onLanguageChange: (language: CvLanguage) => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => void;
  onDownloadPdf: () => void;
  onToggleDrawer: () => void;
}

export function EditorTopBar({
  cv,
  savedCvs,
  templates,
  isExportingPdf,
  drawerOpen,
  onTitleChange,
  onSelectCv,
  onCreateNewCv,
  onDuplicateCv,
  onDeleteCv,
  onTemplateChange,
  onLanguageChange,
  onExportJson,
  onImportJson,
  onDownloadPdf,
  onToggleDrawer,
}: EditorTopBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) {
        onImportJson('');
        return;
      }
      const text = await file.text();
      onImportJson(text);
    } catch {
      onImportJson('');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white px-3 py-2.5 shadow-xs sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white"
            title="Về trang chủ IvyCV"
          >
            <GraduationCap className="h-4 w-4" />
          </Link>

          <input
            type="text"
            aria-label="Tên bản CV"
            value={cv.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-44 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-sm font-semibold text-stone-900 outline-none focus:border-stone-400 focus:bg-white sm:w-56"
          />

          <select
            aria-label="Chọn CV đã lưu"
            value={cv.id}
            onChange={(e) => onSelectCv(e.target.value)}
            className="max-w-40 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-700"
          >
            {savedCvs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onCreateNewCv(cv.templateId)}
              title="Tạo CV mới từ mẫu hiện tại"
              className="rounded-lg border border-stone-200 p-1.5 text-stone-600 hover:bg-stone-100"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDuplicateCv}
              title="Nhân bản CV này"
              className="rounded-lg border border-stone-200 p-1.5 text-stone-600 hover:bg-stone-100"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {savedCvs.length > 1 ? (
              <button
                type="button"
                onClick={onDeleteCv}
                title="Xóa CV hiện tại"
                className="rounded-lg border border-stone-200 p-1.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Chọn mẫu trường đại học"
            value={cv.templateId}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800"
          >
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                Mẫu: {tpl.universityName}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5">
            {(['en', 'vi'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition ${
                  cv.language === lang
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onExportJson}
            title="Xuất sao lưu JSON"
            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sao lưu</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Nhập file JSON"
            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            <FileUp className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Nhập</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" />
            {isExportingPdf ? 'Đang tạo PDF...' : 'Tải PDF (ATS)'}
          </button>

          <button
            type="button"
            onClick={onToggleDrawer}
            title="Bật/tắt bảng Tham khảo & Trợ lý AI"
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              drawerOpen
                ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            <PanelRight className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Tham khảo & AI</span>
          </button>
        </div>
      </div>
    </header>
  );
}

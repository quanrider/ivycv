'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  SECTION_LABELS,
  type CvDocument,
  type SectionType,
  type UniversityTemplate,
} from '@/types/cv';

interface CvHtmlPreviewProps {
  cv: CvDocument;
  template: UniversityTemplate;
  highlightedSection?: SectionType | null;
  onSectionClick?: (sectionType: SectionType) => void;
  showOverflowWarning?: boolean;
}

const A4_HEIGHT_PX = 1122;

export function CvHtmlPreview({
  cv,
  template,
  highlightedSection = null,
  onSectionClick,
  showOverflowWarning = false,
}: CvHtmlPreviewProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isSerif =
    template.layoutVariant === 'classic-serif' ||
    template.layoutVariant === 'academic-cv';
  const isCenteredHeader = template.layoutVariant === 'classic-serif';
  const accent = template.accentColor || '#1e293b';

  const { personalInfo, sections } = cv.content;
  const visibleSections = sections.filter((s) => s.visible);
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    ...personalInfo.links,
  ].filter(Boolean);

  useEffect(() => {
    if (!showOverflowWarning || template.format !== 'resume-1page') {
      setIsOverflowing(false);
      return;
    }
    const el = sheetRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > A4_HEIGHT_PX + 12);
  }, [cv, template.format, showOverflowWarning]);

  return (
    <div className="flex flex-col items-center gap-3">
      {showOverflowWarning && isOverflowing ? (
        <div className="flex w-full max-w-[794px] items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            Mẫu <strong>{template.universityName}</strong> khuyến nghị gói gọn trong{' '}
            <strong>1 trang A4</strong>. Nội dung hiện tại hơi dài — bạn có thể rút gọn
            bullet point hoặc nhờ Trợ lý AI viết súc tích hơn.
          </span>
        </div>
      ) : null}

      <div
        ref={sheetRef}
        className={`w-full max-w-[794px] min-h-[1040px] rounded-sm border border-stone-200 bg-white px-8 py-9 text-[13px] leading-[1.45] text-stone-900 shadow-md sm:px-11 sm:py-10 ${
          isSerif ? 'font-serif' : 'font-sans'
        }`}
      >
        <div
          className={`mb-4 flex items-center gap-4 border-b pb-3 ${
            isCenteredHeader ? 'justify-center text-center' : 'justify-between text-left'
          }`}
          style={{
            borderColor:
              template.layoutVariant === 'classic-serif' ? '#111827' : accent,
            borderBottomWidth: template.layoutVariant === 'modern-tech' ? 2 : 1,
          }}
        >
          <div className={isCenteredHeader ? 'flex-1 text-center' : 'flex-1'}>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                color: template.layoutVariant === 'classic-serif' ? '#111827' : accent,
              }}
            >
              {personalInfo.fullName}
            </h1>
            {personalInfo.headline ? (
              <p className="mt-0.5 text-[13.5px] font-medium text-stone-700">
                {personalInfo.headline}
              </p>
            ) : null}
            {contactParts.length > 0 ? (
              <p className="mt-1 text-xs text-stone-600">
                {contactParts.join('  •  ')}
              </p>
            ) : null}
          </div>

          {cv.showPhoto && personalInfo.photoDataUrl ? (
            <img
              src={personalInfo.photoDataUrl}
              alt="Ảnh chân dung CV"
              className={`h-16 w-16 shrink-0 border border-stone-200 object-cover ${
                template.layoutVariant === 'clean-euro' ? 'rounded-md' : 'rounded-full'
              }`}
            />
          ) : null}
        </div>

        <div className="space-y-4">
          {visibleSections.map((section) => {
            const heading = section.title || SECTION_LABELS[cv.language][section.type];
            const isHighlighted = highlightedSection === section.type;
            return (
              <section
                key={section.id}
                onClick={onSectionClick ? () => onSectionClick(section.type) : undefined}
                className={`rounded transition ${
                  onSectionClick ? 'cursor-pointer hover:bg-stone-50/90' : ''
                } ${
                  isHighlighted
                    ? 'bg-amber-50/80 ring-2 ring-amber-400/80 ring-offset-2'
                    : ''
                }`}
              >
                <h2
                  className="mb-2 border-b border-stone-300 pb-0.5 text-[12.5px] font-bold uppercase tracking-wider"
                  style={{
                    color:
                      template.layoutVariant === 'classic-serif' ? '#111827' : accent,
                  }}
                >
                  {heading}
                </h2>
                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <div key={item.id}>
                      {item.title || item.dateRange ? (
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-bold text-stone-900">{item.title}</span>
                          {item.dateRange ? (
                            <span className="text-xs text-stone-600">
                              {item.dateRange}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      {item.subtitle || item.location ? (
                        <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
                          <span className={isSerif ? 'italic text-stone-700' : 'text-stone-700'}>
                            {item.subtitle}
                          </span>
                          {item.location ? (
                            <span className="text-xs text-stone-500">
                              {item.location}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      {item.bullets.filter((b) => b.trim().length > 0).length > 0 ? (
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-[12.5px] text-stone-800">
                          {item.bullets
                            .filter((b) => b.trim().length > 0)
                            .map((bullet, idx) => (
                              <li key={idx}>{bullet}</li>
                            ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

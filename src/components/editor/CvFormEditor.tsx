'use client';

import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Sparkles,
  Upload,
  Info,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { CvDocument, CvItem, CvSection, UniversityTemplate } from '@/types/cv';
import { compressPhotoToDataUrl, validatePhotoFile } from '@/lib/photo';

export interface BulletTarget {
  sectionId: string;
  itemId: string;
  bulletIndex: number;
  text: string;
}

interface CvFormEditorProps {
  cv: CvDocument;
  template: UniversityTemplate;
  onChange: (next: CvDocument) => void;
  onRequestAiBullet: (target: BulletTarget) => void;
  onError: (message: string) => void;
}

export function CvFormEditor({
  cv,
  template,
  onChange,
  onRequestAiBullet,
  onError,
}: CvFormEditorProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { personalInfo, sections } = cv.content;

  function updatePersonal(patch: Partial<typeof personalInfo>) {
    onChange({
      ...cv,
      content: {
        ...cv.content,
        personalInfo: { ...personalInfo, ...patch },
      },
    });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = validatePhotoFile(file);
    if (!valid.ok) {
      onError(valid.error);
      e.target.value = '';
      return;
    }
    try {
      const compressed = await compressPhotoToDataUrl(file);
      onChange({
        ...cv,
        showPhoto: true,
        content: {
          ...cv.content,
          personalInfo: { ...personalInfo, photoDataUrl: compressed },
        },
      });
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Không thể xử lý ảnh.');
    } finally {
      e.target.value = '';
    }
  }

  function updateSection(sectionId: string, updater: (s: CvSection) => CvSection) {
    onChange({
      ...cv,
      content: {
        ...cv.content,
        sections: sections.map((s) => (s.id === sectionId ? updater(s) : s)),
      },
    });
  }

  function moveSection(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    const copy = [...sections];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    onChange({ ...cv, content: { ...cv.content, sections: copy } });
  }

  function addItem(sectionId: string) {
    const newItem: CvItem = {
      id: `item-${Date.now().toString(36)}`,
      title: '',
      subtitle: '',
      location: '',
      dateRange: '',
      bullets: [''],
    };
    updateSection(sectionId, (s) => ({ ...s, items: [...s.items, newItem] }));
  }

  return (
    <div className="space-y-4 pb-10">
      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
        <h2 className="mb-3 text-sm font-bold text-stone-900">Thông tin cá nhân</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="cv-full-name"
              className="mb-1 block text-xs font-medium text-stone-600"
            >
              Họ và tên
            </label>
            <input
              id="cv-full-name"
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonal({ fullName: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="cv-headline"
              className="mb-1 block text-xs font-medium text-stone-600"
            >
              Tiêu đề / Vị trí mục tiêu
            </label>
            <input
              id="cv-headline"
              type="text"
              value={personalInfo.headline ?? ''}
              onChange={(e) => updatePersonal({ headline: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Email</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonal({ email: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Số điện thoại
            </label>
            <input
              type="text"
              value={personalInfo.phone}
              onChange={(e) => updatePersonal({ phone: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Địa điểm
            </label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => updatePersonal({ location: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Liên kết (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={personalInfo.links.join(', ')}
              onChange={(e) =>
                updatePersonal({
                  links: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="cv-show-photo"
              className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-stone-800"
            >
              <input
                id="cv-show-photo"
                type="checkbox"
                checked={cv.showPhoto}
                onChange={(e) => onChange({ ...cv, showPhoto: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300"
              />
              Hiển thị ảnh chân dung
            </label>

            {cv.showPhoto ? (
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100">
                  <Upload className="h-3 w-3" />
                  Tải ảnh
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {personalInfo.photoDataUrl ? (
                  <button
                    type="button"
                    onClick={() => updatePersonal({ photoDataUrl: undefined })}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Xóa ảnh
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-stone-600">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
            <span>{template.photoGuidance}</span>
          </p>
        </div>
      </section>

      {sections.map((section, sectionIndex) => {
        const isCollapsed = Boolean(collapsed[section.id]);
        return (
          <section
            key={section.id}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [section.id]: !isCollapsed }))
                }
                className="flex items-center gap-1.5 text-sm font-bold text-stone-900"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-stone-400" />
                )}
                <span>{section.title}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveSection(sectionIndex, -1)}
                  disabled={sectionIndex === 0}
                  title="Đưa mục lên trên"
                  className="rounded p-1 text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(sectionIndex, 1)}
                  disabled={sectionIndex === sections.length - 1}
                  title="Đưa mục xuống dưới"
                  className="rounded p-1 text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateSection(section.id, (s) => ({ ...s, visible: !s.visible }))
                  }
                  title={section.visible ? 'Ẩn mục này' : 'Hiện mục này'}
                  className="rounded p-1 text-stone-500 hover:bg-stone-100"
                >
                  {section.visible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            {!isCollapsed ? (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-stone-500">
                    Tiêu đề mục
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateSection(section.id, (s) => ({ ...s, title: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold outline-none focus:border-stone-400"
                  />
                </div>

                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-2 rounded-lg border border-stone-200 bg-stone-50/70 p-3"
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Chức danh / Trường / Tên mục"
                        value={item.title}
                        onChange={(e) =>
                          updateSection(section.id, (s) => ({
                            ...s,
                            items: s.items.map((it) =>
                              it.id === item.id ? { ...it, title: e.target.value } : it
                            ),
                          }))
                        }
                        className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-stone-400"
                      />
                      <input
                        type="text"
                        placeholder="Thời gian (vd: 2024 – Hiện tại)"
                        value={item.dateRange}
                        onChange={(e) =>
                          updateSection(section.id, (s) => ({
                            ...s,
                            items: s.items.map((it) =>
                              it.id === item.id
                                ? { ...it, dateRange: e.target.value }
                                : it
                            ),
                          }))
                        }
                        className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-stone-400"
                      />
                      <input
                        type="text"
                        placeholder="Công ty / Ngành học / Mô tả phụ"
                        value={item.subtitle}
                        onChange={(e) =>
                          updateSection(section.id, (s) => ({
                            ...s,
                            items: s.items.map((it) =>
                              it.id === item.id ? { ...it, subtitle: e.target.value } : it
                            ),
                          }))
                        }
                        className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-stone-400"
                      />
                      <input
                        type="text"
                        placeholder="Địa điểm"
                        value={item.location}
                        onChange={(e) =>
                          updateSection(section.id, (s) => ({
                            ...s,
                            items: s.items.map((it) =>
                              it.id === item.id ? { ...it, location: e.target.value } : it
                            ),
                          }))
                        }
                        className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-stone-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      {item.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-1.5">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) =>
                              updateSection(section.id, (s) => ({
                                ...s,
                                items: s.items.map((it) =>
                                  it.id === item.id
                                    ? {
                                        ...it,
                                        bullets: it.bullets.map((b, i) =>
                                          i === bIdx ? e.target.value : b
                                        ),
                                      }
                                    : it
                                ),
                              }))
                            }
                            placeholder="Động từ hành động + Bối cảnh + Kết quả có số liệu..."
                            className="flex-1 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs leading-relaxed outline-none focus:border-stone-400"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                onRequestAiBullet({
                                  sectionId: section.id,
                                  itemId: item.id,
                                  bulletIndex: bIdx,
                                  text: bullet,
                                })
                              }
                              title="Nhờ AI viết lại dòng này theo chuẩn trường"
                              className="rounded-md border border-indigo-200 bg-indigo-50 p-1.5 text-indigo-700 hover:bg-indigo-100"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSection(section.id, (s) => ({
                                  ...s,
                                  items: s.items.map((it) =>
                                    it.id === item.id
                                      ? {
                                          ...it,
                                          bullets: it.bullets.filter((_, i) => i !== bIdx),
                                        }
                                      : it
                                  ),
                                }))
                              }
                              title="Xóa dòng này"
                              className="rounded-md border border-stone-200 bg-white p-1.5 text-stone-400 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateSection(section.id, (s) => ({
                            ...s,
                            items: s.items.map((it) =>
                              it.id === item.id
                                ? { ...it, bullets: [...it.bullets, ''] }
                                : it
                            ),
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-950"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Thêm gạch đầu dòng
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateSection(section.id, (s) => ({
                            ...s,
                            items: s.items.filter((it) => it.id !== item.id),
                          }))
                        }
                        className="text-xs text-red-600 hover:underline"
                      >
                        Xóa mục con
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(section.id)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-stone-300 py-1.5 text-xs font-medium text-stone-600 hover:border-stone-400 hover:bg-stone-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm mục mới vào {section.title}
                </button>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

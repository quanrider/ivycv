'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SECTION_LABELS,
  type CvDocument,
  type CvLanguage,
} from '@/types/cv';
import {
  UNIVERSITY_TEMPLATES,
  createCvFromTemplate,
  getUniversityById,
} from '@/data/universities';
import {
  clearByokKey,
  deleteCv,
  duplicateCv,
  exportCvToJson,
  importCvFromJson,
  loadByokKey,
  loadSavedCvs,
  saveByokKey,
  saveCv,
} from '@/lib/storage';
import { downloadCvPdf } from '@/lib/pdf/exportPdf';
import { CvHtmlPreview } from '@/components/cv/CvHtmlPreview';
import { EditorTopBar } from './EditorTopBar';
import { CvFormEditor, type BulletTarget } from './CvFormEditor';
import { ReferenceAiDrawer } from './ReferenceAiDrawer';
import { ByokModal } from './ByokModal';

export function CvEditorWorkspace() {
  const searchParams = useSearchParams();
  const requestedCvId = searchParams.get('cv');

  const [savedCvs, setSavedCvs] = useState<CvDocument[]>([]);
  const [cv, setCv] = useState<CvDocument>(() => createCvFromTemplate('harvard-ocs', 'en'));
  const [initialized, setInitialized] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<'reference' | 'ai'>('reference');
  const [bulletTarget, setBulletTarget] = useState<BulletTarget | null>(null);
  const [byokKey, setByokKey] = useState<string | null>(null);
  const [byokModalOpen, setByokModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [banner, setBanner] = useState<{ type: 'error' | 'info'; text: string } | null>(
    null
  );

  useEffect(() => {
    const existing = loadSavedCvs();
    setByokKey(loadByokKey());

    if (existing.length > 0) {
      const target =
        (requestedCvId ? existing.find((item) => item.id === requestedCvId) : null) ??
        existing[0];
      setSavedCvs(existing);
      setCv(target);
    } else {
      const starter = createCvFromTemplate('harvard-ocs', 'en');
      saveCv(starter);
      setSavedCvs([starter]);
      setCv(starter);
    }
    setInitialized(true);
  }, [requestedCvId]);

  useEffect(() => {
    if (!initialized) return;
    const result = saveCv(cv);
    if (!result.ok) {
      setBanner({ type: 'error', text: result.error });
      return;
    }
    setSavedCvs(loadSavedCvs());
  }, [cv, initialized]);

  const template = useMemo(
    () => getUniversityById(cv.templateId) ?? UNIVERSITY_TEMPLATES[0],
    [cv.templateId]
  );

  function handleLanguageChange(language: CvLanguage) {
    setCv((prev) => ({
      ...prev,
      language,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s) => ({
          ...s,
          title: SECTION_LABELS[language][s.type],
        })),
      },
    }));
  }

  function handleTemplateChange(templateId: string) {
    const nextTpl = getUniversityById(templateId);
    setCv((prev) => ({
      ...prev,
      templateId,
      showPhoto: nextTpl ? nextTpl.photoRecommended : prev.showPhoto,
    }));
  }

  function handleCreateNewCv(templateId: string) {
    const fresh = createCvFromTemplate(templateId, cv.language);
    saveCv(fresh);
    setSavedCvs(loadSavedCvs());
    setCv(fresh);
    setBanner({ type: 'info', text: 'Đã tạo bản CV mới từ mẫu đã chọn.' });
  }

  function handleDuplicateCv() {
    const res = duplicateCv(cv.id);
    if (!res.ok) {
      setBanner({ type: 'error', text: res.error });
      return;
    }
    setSavedCvs(loadSavedCvs());
    setCv(res.data);
  }

  function handleDeleteCv() {
    const remaining = deleteCv(cv.id);
    setSavedCvs(remaining);
    if (remaining.length > 0) {
      setCv(remaining[0]);
    } else {
      handleCreateNewCv('harvard-ocs');
    }
  }

  function handleExportJson() {
    const json = exportCvToJson(cv);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cv.title || 'cv-backup').replace(/[\\/:*?"<>|]/g, '')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleImportJson(raw: string) {
    const res = importCvFromJson(raw);
    if (!res.ok) {
      setBanner({ type: 'error', text: res.error });
      return;
    }
    setSavedCvs(loadSavedCvs());
    setCv(res.data);
    setBanner({ type: 'info', text: 'Đã nhập bản sao lưu CV thành công.' });
  }

  async function handleDownloadPdf() {
    setIsExportingPdf(true);
    setBanner(null);
    try {
      await downloadCvPdf(cv, template);
    } catch {
      setBanner({
        type: 'error',
        text: 'Không thể xuất file PDF lúc này. Vui lòng thử lại.',
      });
    } finally {
      setIsExportingPdf(false);
    }
  }

  function handleApplyBullet(target: BulletTarget, text: string) {
    setCv((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((sec) =>
          sec.id === target.sectionId
            ? {
                ...sec,
                items: sec.items.map((it) =>
                  it.id === target.itemId
                    ? {
                        ...it,
                        bullets: it.bullets.map((b, i) =>
                          i === target.bulletIndex ? text : b
                        ),
                      }
                    : it
                ),
              }
            : sec
        ),
      },
    }));
    setBanner({ type: 'info', text: 'Đã áp dụng gợi ý AI vào CV.' });
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <EditorTopBar
        cv={cv}
        savedCvs={savedCvs.length > 0 ? savedCvs : [cv]}
        templates={UNIVERSITY_TEMPLATES}
        isExportingPdf={isExportingPdf}
        drawerOpen={drawerOpen}
        onTitleChange={(title) => setCv((prev) => ({ ...prev, title }))}
        onSelectCv={(id) => {
          const found = savedCvs.find((item) => item.id === id);
          if (found) setCv(found);
        }}
        onCreateNewCv={handleCreateNewCv}
        onDuplicateCv={handleDuplicateCv}
        onDeleteCv={handleDeleteCv}
        onTemplateChange={handleTemplateChange}
        onLanguageChange={handleLanguageChange}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onDownloadPdf={handleDownloadPdf}
        onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
      />

      {banner ? (
        <div
          className={`flex items-center justify-between px-4 py-2 text-xs font-medium ${
            banner.type === 'error'
              ? 'bg-red-50 text-red-800 border-b border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
          }`}
        >
          <span>{banner.text}</span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="underline"
          >
            Đóng
          </button>
        </div>
      ) : null}

      <div
        className={`mx-auto grid w-full max-w-[1680px] flex-1 gap-4 p-4 ${
          drawerOpen
            ? 'lg:grid-cols-[380px_minmax(0,1fr)_340px]'
            : 'lg:grid-cols-[420px_minmax(0,1fr)]'
        }`}
      >
        <div className="max-h-[calc(100vh-88px)] overflow-y-auto pr-1">
          <CvFormEditor
            cv={cv}
            template={template}
            onChange={setCv}
            onRequestAiBullet={(target) => {
              setBulletTarget(target);
              setDrawerOpen(true);
              setDrawerTab('ai');
            }}
            onError={(text) => setBanner({ type: 'error', text })}
          />
        </div>

        <div className="max-h-[calc(100vh-88px)] overflow-y-auto px-1 pb-10">
          <CvHtmlPreview cv={cv} template={template} showOverflowWarning />
        </div>

        {drawerOpen ? (
          <div className="max-h-[calc(100vh-88px)]">
            <ReferenceAiDrawer
              cv={cv}
              template={template}
              activeTab={drawerTab}
              onTabChange={setDrawerTab}
              bulletTarget={bulletTarget}
              byokKey={byokKey}
              onOpenByokModal={() => setByokModalOpen(true)}
              onApplyBulletSuggestion={handleApplyBullet}
            />
          </div>
        ) : null}
      </div>

      <ByokModal
        isOpen={byokModalOpen}
        currentKey={byokKey}
        onClose={() => setByokModalOpen(false)}
        onSave={(key) => {
          saveByokKey(key);
          setByokKey(loadByokKey());
        }}
        onClear={() => {
          clearByokKey();
          setByokKey(null);
        }}
      />
    </div>
  );
}

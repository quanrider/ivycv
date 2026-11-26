import { CvDocumentSchema, type CvDocument } from '@/types/cv';
import { getUniversityById } from '@/data/universities';

const CVS_STORAGE_KEY = 'cv_builder_documents_v1';
const BYOK_STORAGE_KEY = 'cv_builder_byok_key_v1';

export type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function isBrowserStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function loadSavedCvs(): CvDocument[] {
  if (!isBrowserStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(CVS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid: CvDocument[] = [];
    for (const item of parsed) {
      const checked = CvDocumentSchema.safeParse(item);
      if (checked.success) valid.push(checked.data);
    }
    return valid.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

function writeAllCvs(cvs: CvDocument[]): StorageResult<CvDocument[]> {
  if (!isBrowserStorageAvailable()) {
    return { ok: false, error: 'Trình duyệt hiện không hỗ trợ lưu trữ cục bộ.' };
  }
  try {
    window.localStorage.setItem(CVS_STORAGE_KEY, JSON.stringify(cvs));
    return { ok: true, data: cvs };
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    return {
      ok: false,
      error: isQuota
        ? 'Bộ nhớ trình duyệt đã đầy dung lượng. Hãy xóa bớt CV cũ hoặc tắt/nén lại ảnh chân dung trước khi lưu.'
        : 'Không thể lưu CV vào bộ nhớ trình duyệt.',
    };
  }
}

export function saveCv(cv: CvDocument): StorageResult<CvDocument> {
  const checked = CvDocumentSchema.safeParse({
    ...cv,
    updatedAt: new Date().toISOString(),
  });
  if (!checked.success) {
    return { ok: false, error: 'Dữ liệu CV không hợp lệ để lưu.' };
  }

  const existing = loadSavedCvs();
  const idx = existing.findIndex((item) => item.id === checked.data.id);
  const next =
    idx >= 0
      ? existing.map((item) => (item.id === checked.data.id ? checked.data : item))
      : [checked.data, ...existing];

  const written = writeAllCvs(next);
  if (!written.ok) return written;
  return { ok: true, data: checked.data };
}

export function deleteCv(cvId: string): CvDocument[] {
  const next = loadSavedCvs().filter((item) => item.id !== cvId);
  writeAllCvs(next);
  return next;
}

export function duplicateCv(cvId: string): StorageResult<CvDocument> {
  const existing = loadSavedCvs();
  const target = existing.find((item) => item.id === cvId);
  if (!target) {
    return { ok: false, error: 'Không tìm thấy CV cần nhân bản.' };
  }
  const cloned = structuredClone(target);
  cloned.content.sections = cloned.content.sections.map((section) => ({
    ...section,
    id: generateId('sec'),
    items: section.items.map((item) => ({
      ...item,
      id: generateId('item'),
    })),
  }));

  const copy: CvDocument = {
    ...cloned,
    id: generateId('cv'),
    title: `${target.title} (Bản sao)`,
    updatedAt: new Date().toISOString(),
  };
  return saveCv(copy);
}

export function exportCvToJson(cv: CvDocument): string {
  return JSON.stringify(cv, null, 2);
}

export function importCvFromJson(rawJson: string): StorageResult<CvDocument> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return {
      ok: false,
      error: 'Tệp JSON không đúng cú pháp. Vui lòng kiểm tra lại file sao lưu.',
    };
  }

  const checked = CvDocumentSchema.safeParse(parsed);
  if (!checked.success) {
    return {
      ok: false,
      error: 'Cấu trúc tệp JSON không khớp định dạng CV hợp lệ.',
    };
  }

  if (!getUniversityById(checked.data.templateId)) {
    return {
      ok: false,
      error: 'Tệp JSON chứa mã mẫu trường đại học không hợp lệ.',
    };
  }

  const imported: CvDocument = {
    ...checked.data,
    id: generateId('cv'),
    updatedAt: new Date().toISOString(),
  };
  return saveCv(imported);
}

export function loadByokKey(): string | null {
  if (!isBrowserStorageAvailable()) return null;
  try {
    const value = window.localStorage.getItem(BYOK_STORAGE_KEY);
    return value && value.trim().length > 0 ? value.trim() : null;
  } catch {
    return null;
  }
}

export function saveByokKey(key: string): StorageResult<void> {
  if (!isBrowserStorageAvailable()) {
    return { ok: false, error: 'Trình duyệt hiện không hỗ trợ lưu trữ cục bộ.' };
  }
  const trimmed = key.trim();
  if (!trimmed) {
    clearByokKey();
    return { ok: true, data: undefined };
  }
  try {
    window.localStorage.setItem(BYOK_STORAGE_KEY, trimmed);
    return { ok: true, data: undefined };
  } catch {
    return {
      ok: false,
      error: 'Bộ nhớ trình duyệt đã đầy dung lượng, không thể lưu API key.',
    };
  }
}

export function clearByokKey(): void {
  if (!isBrowserStorageAvailable()) return;
  window.localStorage.removeItem(BYOK_STORAGE_KEY);
}

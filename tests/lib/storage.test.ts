import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadSavedCvs,
  saveCv,
  deleteCv,
  duplicateCv,
  exportCvToJson,
  importCvFromJson,
  loadByokKey,
  saveByokKey,
  clearByokKey,
} from '@/lib/storage';
import { createCvFromTemplate } from '@/data/universities';

describe('localStorage CV persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves, loads, duplicates, and deletes CVs', () => {
    const cv = createCvFromTemplate('harvard-ocs', 'en');
    const saved = saveCv(cv);
    expect(saved.ok).toBe(true);
    expect(loadSavedCvs()).toHaveLength(1);

    const dup = duplicateCv(cv.id);
    expect(dup.ok).toBe(true);
    expect(loadSavedCvs()).toHaveLength(2);
    if (dup.ok) {
      expect(dup.data.id).not.toBe(cv.id);
      const remaining = deleteCv(dup.data.id);
      expect(remaining).toHaveLength(1);
    }
  });

  it('exports and re-imports valid CV JSON with a fresh id', () => {
    const cv = createCvFromTemplate('mit-capd', 'vi');
    const json = exportCvToJson(cv);
    const imported = importCvFromJson(json);
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.data.id).not.toBe(cv.id);
      expect(imported.data.templateId).toBe('mit-capd');
      expect(imported.data.language).toBe('vi');
    }
  });

  it('rejects malformed or schema-invalid JSON without corrupting existing stored CVs', () => {
    const existing = createCvFromTemplate('stanford-careered', 'en');
    saveCv(existing);

    const badSyntax = importCvFromJson('{not valid json');
    expect(badSyntax.ok).toBe(false);

    const badSchema = importCvFromJson(JSON.stringify({ id: 'x', title: 'Missing fields' }));
    expect(badSchema.ok).toBe(false);

    expect(loadSavedCvs()).toHaveLength(1);
    expect(loadSavedCvs()[0].id).toBe(existing.id);
  });

  it('catches QuotaExceededError gracefully when saving a CV', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });

    const cv = createCvFromTemplate('eth-zurich-stem', 'en');
    const result = saveCv(cv);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/bộ nhớ|dung lượng/i);
    }
  });

  it('saves, loads, and clears BYOK API key', () => {
    expect(loadByokKey()).toBeNull();
    saveByokKey('AIza-test-key-123');
    expect(loadByokKey()).toBe('AIza-test-key-123');
    clearByokKey();
    expect(loadByokKey()).toBeNull();
  });
});

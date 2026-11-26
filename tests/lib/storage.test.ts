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
      expect(dup.data.content.sections[0].id).not.toBe(cv.content.sections[0].id);
      expect(dup.data.content.sections[0].items[0].id).not.toBe(
        cv.content.sections[0].items[0].id
      );
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

  it('rejects external URLs, SVG photoDataUrl, and unknown templateId on JSON import', () => {
    const cv = createCvFromTemplate('harvard-ocs', 'en');
    cv.content.personalInfo.photoDataUrl = 'https://evil.example/tracker.png';
    expect(importCvFromJson(exportCvToJson(cv)).ok).toBe(false);

    cv.content.personalInfo.photoDataUrl = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=';
    expect(importCvFromJson(exportCvToJson(cv)).ok).toBe(false);

    const badTpl = createCvFromTemplate('harvard-ocs', 'en');
    badTpl.templateId = 'unknown-school-999';
    expect(importCvFromJson(exportCvToJson(badTpl)).ok).toBe(false);
  });

  it('catches QuotaExceededError in saveByokKey without throwing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });

    const res = saveByokKey('AIza-quota-test');
    expect(res.ok).toBe(false);
  });
});

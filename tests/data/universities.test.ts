import { describe, it, expect } from 'vitest';
import {
  UNIVERSITY_TEMPLATES,
  getUniversityBySlug,
  filterUniversities,
  createCvFromTemplate,
} from '@/data/universities';
import { CvDocumentSchema } from '@/types/cv';

describe('University Templates Library', () => {
  it('contains exactly 6 prestigious universities with unique ids and slugs', () => {
    expect(UNIVERSITY_TEMPLATES).toHaveLength(6);
    const slugs = new Set(UNIVERSITY_TEMPLATES.map((t) => t.slug));
    expect(slugs).toEqual(
      new Set(['harvard', 'mit', 'stanford', 'oxford', 'cambridge', 'eth-zurich'])
    );
  });

  it('ensures every template has valid sampleCv, bilingual actionVerbs, and valid annotation targets', () => {
    for (const tpl of UNIVERSITY_TEMPLATES) {
      expect(tpl.styleRules.length).toBeGreaterThanOrEqual(4);
      expect(tpl.actionVerbs.en.length).toBeGreaterThanOrEqual(8);
      expect(tpl.actionVerbs.vi.length).toBeGreaterThanOrEqual(8);
      expect(tpl.annotations.length).toBeGreaterThanOrEqual(4);
      const sectionTypes = new Set(tpl.sampleCv.sections.map((s) => s.type));
      for (const ann of tpl.annotations) {
        expect(sectionTypes.has(ann.targetSection)).toBe(true);
      }
    }
  });

  it('sets photoRecommended=false for US/UK schools and true for ETH Zurich', () => {
    for (const slug of ['harvard', 'mit', 'stanford', 'oxford', 'cambridge']) {
      expect(getUniversityBySlug(slug)?.photoRecommended).toBe(false);
    }
    expect(getUniversityBySlug('eth-zurich')?.photoRecommended).toBe(true);
  });

  it('filters by format and search query', () => {
    const academic = filterUniversities({ format: 'academic-cv' });
    expect(academic.some((t) => t.slug === 'oxford')).toBe(true);
    const mitOnly = filterUniversities({ query: 'MIT' });
    expect(mitOnly.map((t) => t.slug)).toEqual(['mit']);
  });

  it('createCvFromTemplate produces an independent valid CvDocument with template photo default', () => {
    const cv1 = createCvFromTemplate('harvard-ocs', 'en');
    const cv2 = createCvFromTemplate('eth-zurich-stem', 'vi');
    expect(CvDocumentSchema.safeParse(cv1).success).toBe(true);
    expect(cv1.showPhoto).toBe(false);
    expect(cv2.showPhoto).toBe(true);
    expect(cv1.id).not.toBe(cv2.id);
    cv1.content.personalInfo.fullName = 'Changed';
    expect(getUniversityBySlug('harvard')?.sampleCv.personalInfo.fullName).not.toBe(
      'Changed'
    );
  });
});

import {
  SECTION_LABELS,
  type CvDocument,
  type CvFormat,
  type CvLanguage,
  type UniversityTemplate,
} from '@/types/cv';
import { harvardTemplate } from './harvard';
import { mitTemplate } from './mit';
import { stanfordTemplate } from './stanford';
import { oxfordTemplate } from './oxford';
import { cambridgeTemplate } from './cambridge';
import { ethZurichTemplate } from './eth-zurich';

export const UNIVERSITY_TEMPLATES: UniversityTemplate[] = [
  harvardTemplate,
  mitTemplate,
  stanfordTemplate,
  oxfordTemplate,
  cambridgeTemplate,
  ethZurichTemplate,
];

export function getUniversityBySlug(slug: string): UniversityTemplate | undefined {
  return UNIVERSITY_TEMPLATES.find((t) => t.slug === slug);
}

export function getUniversityById(id: string): UniversityTemplate | undefined {
  return UNIVERSITY_TEMPLATES.find((t) => t.id === id);
}

export function filterUniversities(opts: {
  field?: string;
  format?: CvFormat | 'all';
  query?: string;
}): UniversityTemplate[] {
  const { field, format, query } = opts;
  const q = query?.trim().toLowerCase() ?? '';

  return UNIVERSITY_TEMPLATES.filter((t) => {
    if (format && format !== 'all' && t.format !== format) {
      return false;
    }
    if (field && field !== 'all' && !t.field.toLowerCase().includes(field.toLowerCase())) {
      return false;
    }
    if (q) {
      const haystack = `${t.universityName} ${t.officeOrProgram} ${t.field} ${t.country} ${t.summary}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createCvFromTemplate(
  templateId: string,
  language: CvLanguage = 'en'
): CvDocument {
  const template = getUniversityById(templateId) ?? harvardTemplate;
  const clonedContent = structuredClone(template.sampleCv);

  if (language === 'vi') {
    clonedContent.sections = clonedContent.sections.map((section) => ({
      ...section,
      title: SECTION_LABELS.vi[section.type],
    }));
  }

  return {
    id: generateId('cv'),
    title: `CV chuẩn ${template.universityName}`,
    templateId: template.id,
    language,
    showPhoto: template.photoRecommended,
    updatedAt: new Date().toISOString(),
    content: clonedContent,
  };
}

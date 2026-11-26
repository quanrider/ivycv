import { z } from 'zod';

export const CvLanguageSchema = z.enum(['en', 'vi']);
export type CvLanguage = z.infer<typeof CvLanguageSchema>;

export const SectionTypeSchema = z.enum([
  'summary',
  'education',
  'experience',
  'projects',
  'skills',
  'awards',
  'publications',
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

export const LayoutVariantSchema = z.enum([
  'classic-serif',
  'modern-tech',
  'academic-cv',
  'clean-euro',
]);
export type LayoutVariant = z.infer<typeof LayoutVariantSchema>;

export const CvFormatSchema = z.enum(['resume-1page', 'academic-cv']);
export type CvFormat = z.infer<typeof CvFormatSchema>;

const SAFE_PHOTO_DATA_URL = /^data:image\/(jpeg|jpg|png);base64,[A-Za-z0-9+/=]+$/;

export const PersonalInfoSchema = z.object({
  fullName: z.string(),
  headline: z.string().optional(),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  links: z.array(z.string()).default([]),
  photoDataUrl: z
    .string()
    .max(200_000, 'Dung lượng ảnh đã mã hóa quá lớn')
    .regex(SAFE_PHOTO_DATA_URL, 'Ảnh chân dung phải ở định dạng JPG hoặc PNG hợp lệ')
    .optional(),
});
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

export const CvItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().default(''),
  subtitle: z.string().default(''),
  location: z.string().default(''),
  dateRange: z.string().default(''),
  bullets: z.array(z.string()).default([]),
});
export type CvItem = z.infer<typeof CvItemSchema>;

export const CvSectionSchema = z.object({
  id: z.string().min(1),
  type: SectionTypeSchema,
  title: z.string(),
  visible: z.boolean().default(true),
  items: z.array(CvItemSchema).default([]),
});
export type CvSection = z.infer<typeof CvSectionSchema>;

export const CvContentSchema = z.object({
  personalInfo: PersonalInfoSchema,
  sections: z.array(CvSectionSchema),
});
export type CvContent = z.infer<typeof CvContentSchema>;

export const CvDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  templateId: z.string().min(1),
  language: CvLanguageSchema,
  showPhoto: z.boolean().default(false),
  updatedAt: z.string().min(1),
  content: CvContentSchema,
});
export type CvDocument = z.infer<typeof CvDocumentSchema>;

export interface TemplateAnnotation {
  id: string;
  targetSection: SectionType;
  targetIndex?: number;
  title: string;
  explanation: string;
}

export interface UniversityTemplate {
  id: string;
  slug: string;
  universityName: string;
  officeOrProgram: string;
  country: string;
  field: string;
  format: CvFormat;
  layoutVariant: LayoutVariant;
  accentColor: string;
  photoRecommended: boolean;
  photoGuidance: string;
  summary: string;
  styleRules: string[];
  actionVerbs: {
    en: string[];
    vi: string[];
  };
  annotations: TemplateAnnotation[];
  sampleCv: CvContent;
}

export const SECTION_LABELS: Record<CvLanguage, Record<SectionType, string>> = {
  en: {
    summary: 'Summary',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    awards: 'Honors & Awards',
    publications: 'Publications & Research',
  },
  vi: {
    summary: 'Tóm tắt năng lực',
    education: 'Học vấn',
    experience: 'Kinh nghiệm làm việc',
    projects: 'Dự án nổi bật',
    skills: 'Kỹ năng',
    awards: 'Giải thưởng & Danh hiệu',
    publications: 'Công bố & Nghiên cứu',
  },
};

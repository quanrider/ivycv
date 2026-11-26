import { describe, it, expect } from 'vitest';
import { CvDocumentSchema, SECTION_LABELS } from '@/types/cv';

describe('CvDocumentSchema', () => {
  it('validates a complete bilingual-ready CV document with Vietnamese text', () => {
    const result = CvDocumentSchema.safeParse({
      id: 'cv-1',
      title: 'CV Kỹ sư Phần mềm',
      templateId: 'mit-capd',
      language: 'vi',
      showPhoto: false,
      updatedAt: '2026-11-26T00:00:00.000Z',
      content: {
        personalInfo: {
          fullName: 'Nguyễn Văn Đạt',
          email: 'dat@example.com',
          phone: '+84 901 234 567',
          location: 'Hà Nội, Việt Nam',
          links: ['github.com/datnv'],
        },
        sections: [
          {
            id: 'sec-1',
            type: 'experience',
            title: 'Kinh nghiệm làm việc',
            visible: true,
            items: [
              {
                id: 'item-1',
                title: 'Kỹ sư Phần mềm',
                subtitle: 'Công ty ABC',
                location: 'Hà Nội',
                dateRange: '2024 – Hiện tại',
                bullets: ['Giảm 35% độ trễ API bằng chiến lược caching Redis'],
              },
            ],
          },
        ],
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a CV missing required personalInfo.fullName or invalid language', () => {
    const bad = CvDocumentSchema.safeParse({ id: 'cv-2', language: 'fr' });
    expect(bad.success).toBe(false);
  });

  it('provides EN and VI labels for all 7 section types', () => {
    expect(SECTION_LABELS.en.education).toBe('Education');
    expect(SECTION_LABELS.vi.education).toBe('Học vấn');
    expect(Object.keys(SECTION_LABELS.en)).toHaveLength(7);
    expect(Object.keys(SECTION_LABELS.vi)).toHaveLength(7);
  });
});

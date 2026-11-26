// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { generateCvPdfBuffer } from '@/lib/pdf/exportPdf';
import { createCvFromTemplate, getUniversityById } from '@/data/universities';

const SAMPLE_PNG_1X1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2dIAAAAASUVORK5CYII=';

describe('ATS PDF generation with Vietnamese fonts', () => {
  it('renders valid PDF buffers across all 4 layout variants with Vietnamese diacritics and optional photo', async () => {
    const templateIds = [
      'harvard-ocs',
      'mit-capd',
      'oxford-careers',
      'eth-zurich-stem',
    ];

    for (const templateId of templateIds) {
      const template = getUniversityById(templateId)!;
      const cv = createCvFromTemplate(templateId, 'vi');
      cv.content.personalInfo.fullName = 'Nguyễn Minh Quân — Kỹ sư Hệ thống Phân tán';
      cv.content.personalInfo.headline = 'Tối ưu hóa hiệu năng & Kiến trúc phần mềm';
      cv.showPhoto = templateId === 'eth-zurich-stem';
      if (cv.showPhoto) {
        cv.content.personalInfo.photoDataUrl = SAMPLE_PNG_1X1;
      }

      const buf = await generateCvPdfBuffer(cv, template);
      expect(Buffer.isBuffer(buf)).toBe(true);
      expect(buf.length).toBeGreaterThan(1000);
      expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    }
  });
});

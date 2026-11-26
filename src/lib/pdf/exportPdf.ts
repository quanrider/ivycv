import React from 'react';
import { pdf, renderToBuffer } from '@react-pdf/renderer';
import type { CvDocument, UniversityTemplate } from '@/types/cv';
import { registerPdfFonts } from './fonts';
import { CvPdfDocument } from './CvPdfDocument';

export async function generateCvPdfBuffer(
  cv: CvDocument,
  template: UniversityTemplate
): Promise<Buffer> {
  registerPdfFonts('node');
  return renderToBuffer(React.createElement(CvPdfDocument, { cv, template }));
}

export async function downloadCvPdf(
  cv: CvDocument,
  template: UniversityTemplate
): Promise<void> {
  registerPdfFonts('browser');
  const blob = await pdf(React.createElement(CvPdfDocument, { cv, template })).toBlob();
  const url = URL.createObjectURL(blob);
  const safeName = (cv.title || cv.content.personalInfo.fullName || 'CV')
    .replace(/[\\/:*?"<>|]/g, '')
    .trim();
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName || 'CV'}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

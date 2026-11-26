import type React from 'react';
import { pdf, renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import type { CvDocument, UniversityTemplate } from '@/types/cv';
import { registerPdfFonts } from './fonts';
import { CvPdfDocument } from './CvPdfDocument';

function buildDocumentElement(
  cv: CvDocument,
  template: UniversityTemplate
): React.ReactElement<DocumentProps> {
  return CvPdfDocument({ cv, template }) as React.ReactElement<DocumentProps>;
}

export async function generateCvPdfBuffer(
  cv: CvDocument,
  template: UniversityTemplate
): Promise<Buffer> {
  registerPdfFonts('node');
  return renderToBuffer(buildDocumentElement(cv, template));
}

export async function downloadCvPdf(
  cv: CvDocument,
  template: UniversityTemplate
): Promise<void> {
  registerPdfFonts('browser');
  const blob = await pdf(buildDocumentElement(cv, template)).toBlob();
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

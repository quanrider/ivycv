import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LibraryGrid } from '@/components/library/LibraryGrid';
import { AnnotatedShowcase } from '@/components/library/AnnotatedShowcase';
import { CvHtmlPreview } from '@/components/cv/CvHtmlPreview';
import {
  UNIVERSITY_TEMPLATES,
  getUniversityBySlug,
  createCvFromTemplate,
} from '@/data/universities';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('University Library & Shared HTML Preview', () => {
  it('LibraryGrid renders all 6 universities and filters by format and search query', () => {
    render(<LibraryGrid templates={UNIVERSITY_TEMPLATES} />);
    expect(screen.getByText('Harvard University')).toBeInTheDocument();
    expect(screen.getByText('ETH Zurich')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Academic CV/i }));
    expect(screen.getByText('University of Oxford')).toBeInTheDocument();
    expect(screen.queryByText('Harvard University')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Tất cả/i }));
    fireEvent.change(screen.getByPlaceholderText(/Tìm theo trường/i), {
      target: { value: 'Stanford' },
    });
    expect(screen.getByText('Stanford University')).toBeInTheDocument();
    expect(screen.queryByText('ETH Zurich')).not.toBeInTheDocument();
  });

  it('AnnotatedShowcase displays Vietnamese annotation details when clicking an annotation', () => {
    const harvard = getUniversityBySlug('harvard')!;
    render(<AnnotatedShowcase template={harvard} />);

    expect(screen.getByText(harvard.sampleCv.personalInfo.fullName)).toBeInTheDocument();
    const secondAnn = harvard.annotations[1];
    fireEvent.click(screen.getByRole('button', { name: secondAnn.title }));
    expect(screen.getByText(secondAnn.explanation)).toBeInTheDocument();
  });

  it('CvHtmlPreview renders Vietnamese headings and toggles profile photo', () => {
    const eth = getUniversityBySlug('eth-zurich')!;
    const cv = createCvFromTemplate('eth-zurich-stem', 'vi');
    cv.content.personalInfo.photoDataUrl = 'data:image/png;base64,abc';
    cv.showPhoto = true;

    const { rerender } = render(<CvHtmlPreview cv={cv} template={eth} />);
    expect(screen.getByText('Học vấn')).toBeInTheDocument();
    expect(screen.getByAltText(/Ảnh chân dung/i)).toBeInTheDocument();

    rerender(<CvHtmlPreview cv={{ ...cv, showPhoto: false }} template={eth} />);
    expect(screen.queryByAltText(/Ảnh chân dung/i)).not.toBeInTheDocument();
  });
});

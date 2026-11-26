import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CvEditorWorkspace } from '@/components/editor/CvEditorWorkspace';
import { loadSavedCvs } from '@/lib/storage';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock('@/lib/pdf/exportPdf', () => ({
  downloadCvPdf: vi.fn().mockResolvedValue(undefined),
}));

describe('CvEditorWorkspace', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('creates a default Harvard CV when empty and reflects live edits into preview and localStorage', async () => {
    render(<CvEditorWorkspace />);

    const nameInput = screen.getByLabelText(/Họ và tên/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Eleanor Vance');

    fireEvent.change(nameInput, { target: { value: 'Trần Minh Anh' } });
    expect(screen.getAllByText('Trần Minh Anh').length).toBeGreaterThanOrEqual(1);

    await waitFor(() => {
      const saved = loadSavedCvs();
      expect(saved.length).toBeGreaterThanOrEqual(1);
      expect(saved[0].content.personalInfo.fullName).toBe('Trần Minh Anh');
    });
  });

  it('switches CV language EN/VI and toggles photo with convention note', () => {
    render(<CvEditorWorkspace />);

    fireEvent.click(screen.getByRole('button', { name: /^VI$/i }));
    expect(screen.getAllByText('Học vấn').length).toBeGreaterThanOrEqual(1);

    const photoToggle = screen.getByLabelText(/Hiển thị ảnh chân dung/i);
    fireEvent.click(photoToggle);
    expect(screen.getByText(/Chuẩn Harvard OCS/i)).toBeInTheDocument();
  });

  it('runs AI bullet rewrite in the right drawer and applies suggestion back into the CV', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          result: {
            suggestions: [
              'Spearheaded regional market analysis across 5 countries, unlocking $22M revenue',
            ],
            explanation: 'Added stronger Harvard action verb and concrete scope.',
          },
          quota: { remaining: 9, limit: 10, usingByok: false },
        }),
      })
    );

    render(<CvEditorWorkspace />);

    fireEvent.click(screen.getByRole('button', { name: /Trợ lý AI/i }));
    const bulletInput = screen.getByPlaceholderText(/Dán hoặc chọn một gạch đầu dòng/i);
    fireEvent.change(bulletInput, { target: { value: 'Did market research' } });

    fireEvent.click(screen.getByRole('button', { name: /Viết lại bullet point/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Spearheaded regional market analysis across 5 countries, unlocking $22M revenue'
        )
      ).toBeInTheDocument();
    });
  });
});

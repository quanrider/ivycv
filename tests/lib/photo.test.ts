import { describe, it, expect } from 'vitest';
import { validatePhotoFile } from '@/lib/photo';

describe('validatePhotoFile', () => {
  it('accepts jpeg, png, and webp images under 5MB', () => {
    expect(validatePhotoFile({ type: 'image/jpeg', size: 1024 * 500 }).ok).toBe(true);
    expect(validatePhotoFile({ type: 'image/png', size: 1024 * 1024 }).ok).toBe(true);
    expect(validatePhotoFile({ type: 'image/webp', size: 1024 * 200 }).ok).toBe(true);
  });

  it('rejects non-image files and oversized images with Vietnamese messages', () => {
    const badType = validatePhotoFile({ type: 'application/pdf', size: 1000 });
    expect(badType.ok).toBe(false);
    if (!badType.ok) {
      expect(badType.error).toMatch(/ảnh|JPG|PNG|WebP/i);
    }

    const tooBig = validatePhotoFile({ type: 'image/jpeg', size: 6 * 1024 * 1024 });
    expect(tooBig.ok).toBe(false);
    if (!tooBig.ok) {
      expect(tooBig.error).toMatch(/5MB/i);
    }
  });
});

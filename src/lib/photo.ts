const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_RAW_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB

export function validatePhotoFile(file: {
  type: string;
  size: number;
}): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      error: 'Chỉ hỗ trợ ảnh định dạng JPG, PNG hoặc WebP.',
    };
  }
  if (file.size > MAX_RAW_PHOTO_BYTES) {
    return {
      ok: false,
      error: 'Dung lượng ảnh gốc vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn.',
    };
  }
  return { ok: true };
}

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.ceil((base64.length * 3) / 4);
}

export async function compressPhotoToDataUrl(
  file: File,
  maxDimension = 256,
  maxBytes = 40960
): Promise<string> {
  const check = validatePhotoFile(file);
  if (!check.ok) {
    throw new Error(check.error);
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Không thể đọc dữ liệu ảnh.'));
      el.src = imageUrl;
    });

    const side = Math.min(img.width, img.height);
    const sx = Math.floor((img.width - side) / 2);
    const sy = Math.floor((img.height - side) / 2);
    const targetSide = Math.min(maxDimension, side);

    const canvas = document.createElement('canvas');
    canvas.width = targetSide;
    canvas.height = targetSide;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetSide, targetSide);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, targetSide, targetSide);

    let quality = 0.85;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (estimateDataUrlBytes(dataUrl) > maxBytes && quality > 0.35) {
      quality = Number((quality - 0.1).toFixed(2));
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

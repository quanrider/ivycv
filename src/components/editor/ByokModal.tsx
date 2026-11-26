'use client';

import React, { useState } from 'react';
import { KeyRound, X, Trash2 } from 'lucide-react';

interface ByokModalProps {
  isOpen: boolean;
  currentKey: string | null;
  onClose: () => void;
  onSave: (key: string) => void;
  onClear: () => void;
}

export function ByokModal({
  isOpen,
  currentKey,
  onClose,
  onSave,
  onClear,
}: ByokModalProps) {
  const [value, setValue] = useState(currentKey ?? '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold text-stone-900">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            Dùng API key Gemini riêng (BYOK)
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1 text-stone-500 hover:bg-stone-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-stone-600">
          API key của bạn chỉ được lưu cục bộ trên trình duyệt này và gửi trực tiếp khi bạn
          bấm gọi AI (máy chủ không bao giờ lưu lại key của bạn). Khi dùng key riêng, bạn
          không bị giới hạn lượt miễn phí mỗi ngày.
        </p>

        <div className="mt-4">
          <label
            htmlFor="byok-key-input"
            className="mb-1 block text-xs font-semibold text-stone-700"
          >
            Google Gemini API Key
          </label>
          <input
            id="byok-key-input"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="AIza..."
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          {currentKey ? (
            <button
              type="button"
              onClick={() => {
                onClear();
                setValue('');
                onClose();
              }}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa key đã lưu
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(value);
                onClose();
              }}
              className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
            >
              Lưu API key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

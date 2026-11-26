import { Font } from '@react-pdf/renderer';
import path from 'path';

let registeredMode: 'node' | 'browser' | null = null;

function resolveFontSrc(filename: string, mode: 'node' | 'browser'): string {
  if (mode === 'node') {
    return path.join(process.cwd(), 'public', 'fonts', filename);
  }
  return `/fonts/${filename}`;
}

export function registerPdfFonts(
  mode: 'node' | 'browser' = typeof window === 'undefined' ? 'node' : 'browser'
): void {
  if (registeredMode === mode) return;
  registeredMode = mode;

  Font.register({
    family: 'Inter',
    fonts: [
      { src: resolveFontSrc('Inter-Regular.ttf', mode), fontWeight: 400 },
      { src: resolveFontSrc('Inter-Bold.ttf', mode), fontWeight: 700 },
    ],
  });

  Font.register({
    family: 'NotoSerif',
    fonts: [
      { src: resolveFontSrc('NotoSerif-Regular.ttf', mode), fontWeight: 400 },
      { src: resolveFontSrc('NotoSerif-Bold.ttf', mode), fontWeight: 700 },
      {
        src: resolveFontSrc('NotoSerif-Italic.ttf', mode),
        fontWeight: 400,
        fontStyle: 'italic',
      },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);
}

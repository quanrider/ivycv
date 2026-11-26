# University-Standard CV Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public Next.js CV builder differentiated by a curated library of 6 prestigious university CV standards with Vietnamese annotations, pre-filled editable templates, a side-by-side reference & rate-limited/BYOK AI assistant, and 1-click ATS-friendly PDF export.

**Architecture:** Single Next.js (App Router) + TypeScript + Tailwind CSS application. Curated university templates live as typed in-repo data modules; user CVs and optional BYOK keys persist locally in browser `localStorage` with JSON backup/import; a server-side Next.js API route proxies Google Gemini with per-IP daily rate limiting and BYOK bypass; HTML/CSS live preview mirrors 4 `@react-pdf/renderer` PDF layouts using bundled Vietnamese-capable fonts.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Zod, `@react-pdf/renderer`, Lucide React, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-26-cv-builder-design.md`

## Global Constraints

- Project directory: `C:\Users\quann\.gemini\antigravity\scratch\cv-builder`.
- Zero login required; all CV editing, library browsing, local persistence, and PDF export must work 100% without `GEMINI_API_KEY` configured.
- Vietnamese UI by default; authentic English sample CVs paired with Vietnamese annotations; CV editor supports EN and VI section labels and writing.
- Starter collection includes exactly 6 universities: Harvard (OCS), MIT (CAPD), Stanford (CareerEd), Oxford (Careers Service), Cambridge, ETH Zurich.
- Optional profile photo: off by default on US/UK templates with convention note, enabled on ETH Zurich; compressed client-side to `<= 256x256` and `<= 40KB` before storing in `localStorage`.
- AI proxy: Google Gemini (`GEMINI_MODEL` default `gemini-2.5-flash`), default `AI_DAILY_LIMIT=10` per IP per 24h; BYOK keys stored only in browser `localStorage` and never logged or persisted server-side.
- PDF export: `@react-pdf/renderer` with selectable ATS text and locally bundled Vietnamese UTF-8 `.ttf` fonts in `public/fonts/`.

## Review Focus

1. **Malformed or tampered JSON import:** `importCvFromJson` rejects invalid JSON or schema-violating payloads with a readable Vietnamese error and never overwrites existing `localStorage` CVs (tested in Task 3).
2. **`localStorage` `QuotaExceededError` on save:** `saveCv` catches storage quota errors and returns `{ ok: false, error }` without throwing or corrupting stored CVs (tested in Task 3).
3. **Exhausted daily AI quota or missing server `GEMINI_API_KEY`:** `POST /api/ai/assist` returns structured 429 (`QUOTA_EXCEEDED`) / 503 (`MISSING_API_KEY`) prompting BYOK, while requests with `userApiKey` bypass server quota and succeed without server key (tested in Task 4).
4. **Vietnamese CV AI assistance on English university templates:** `buildAiPrompt` injects `template.actionVerbs.vi` and instructs Gemini to respond in Vietnamese while enforcing the selected university's style rules (tested in Task 4).
5. **Vietnamese diacritics and optional photo in PDF export:** `generateCvPdfBlob` renders valid PDF bytes across all 4 `layoutVariant`s with Vietnamese UTF-8 strings and both with/without a compressed photo data URL (tested in Task 5).

---

## File Structure Overview

- `src/types/cv.ts` — Core domain types, Zod schemas, EN/VI section labels.
- `src/data/universities/` — 6 curated university template modules (`harvard.ts`, `mit.ts`, `stanford.ts`, `oxford.ts`, `cambridge.ts`, `eth-zurich.ts`) + `index.ts` query/filter/clone helpers.
- `src/lib/storage.ts` — `localStorage` CV CRUD, JSON export/import validation, BYOK key helpers.
- `src/lib/photo.ts` — Client-side image validation, square resize (`<= 256px`), and JPEG compression (`<= 40KB`).
- `src/lib/rate-limit.ts` — Per-IP sliding/daily in-memory rate limiter.
- `src/lib/ai-prompts.ts` — University-calibrated prompt builder for `rewrite_bullet`, `review_section`, `review_cv`.
- `src/lib/gemini.ts` — Minimal Gemini REST client returning parsed JSON.
- `src/app/api/ai/assist/route.ts` — `POST /api/ai/assist` route handler.
- `public/fonts/` — Bundled `Inter` and `NotoSerif` `.ttf` fonts (Regular + Bold + Italic) with Vietnamese glyphs.
- `src/lib/pdf/fonts.ts`, `src/lib/pdf/CvPdfDocument.tsx`, `src/lib/pdf/exportPdf.ts` — ATS PDF renderer and download helper.
- `src/components/Navbar.tsx`, `src/components/cv/CvHtmlPreview.tsx` — Shared nav and HTML live preview mirroring all 4 layouts.
- `src/app/page.tsx`, `src/app/library/page.tsx`, `src/app/library/[slug]/page.tsx`, `src/components/library/*` — Landing and annotated university showcase.
- `src/app/editor/page.tsx`, `src/components/editor/*` — 3-pane CV editor, side-by-side reference drawer, and AI assistant drawer.

---

### Task 1: Project Scaffolding, Core Types & Zod Schemas

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `.env.example`, `.gitignore`
- Create: `src/types/cv.ts`
- Test: `tests/types/cv.test.ts`

**Interfaces:**
- Consumes: none
- Produces (from `src/types/cv.ts`):
  - Types: `CvLanguage` (`'en' | 'vi'`), `SectionType` (`'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'awards' | 'publications'`), `LayoutVariant` (`'classic-serif' | 'modern-tech' | 'academic-cv' | 'clean-euro'`), `CvFormat` (`'resume-1page' | 'academic-cv'`), `PersonalInfo`, `CvItem`, `CvSection`, `CvContent`, `CvDocument`, `TemplateAnnotation`, `UniversityTemplate`
  - Schemas: `CvContentSchema`, `CvDocumentSchema`
  - Constant: `SECTION_LABELS: Record<CvLanguage, Record<SectionType, string>>`

- [ ] **Step 1: Initialize Next.js project and test runner**
  - Initialize git in `C:\Users\quann\.gemini\antigravity\scratch\cv-builder`.
  - Scaffold Next.js App Router + TypeScript + Tailwind CSS (`package.json` with `next`, `react`, `react-dom`, `zod`, `lucide-react`, `@react-pdf/renderer`; devDeps: `typescript`, `tailwindcss`, `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@types/react`, `@types/node`).
  - Configure `vitest.config.ts` with `@/` path alias matching `tsconfig.json` and `jsdom` environment.
  - Add `.env.example` documenting `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`, `AI_DAILY_LIMIT=10`.
  - Run: `npm install`

- [ ] **Step 2: Write failing schema tests in `tests/types/cv.test.ts`**
  ```ts
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
  ```

- [ ] **Step 3: Run test to verify it fails**
  - Run: `npx vitest run tests/types/cv.test.ts`
  - Expected: FAIL (module `@/types/cv` not found).

- [ ] **Step 4: Implement `src/types/cv.ts`**
  - Define Zod schemas (`PersonalInfoSchema` including optional `photoDataUrl`, `CvItemSchema`, `CvSectionSchema`, `CvContentSchema`, `CvDocumentSchema`), export inferred TypeScript types, `TemplateAnnotation`, `UniversityTemplate`, and `SECTION_LABELS`.

- [ ] **Step 5: Run test to verify it passes**
  - Run: `npx vitest run tests/types/cv.test.ts`
  - Expected: PASS (3 tests).

- [ ] **Step 6: Commit**
  - `git add -A && git commit -m "chore: scaffold Next.js project and add core CV schemas"`

---

### Task 2: Curated 6-University CV Library Data & Query Helpers

**Files:**
- Create: `src/data/universities/harvard.ts`
- Create: `src/data/universities/mit.ts`
- Create: `src/data/universities/stanford.ts`
- Create: `src/data/universities/oxford.ts`
- Create: `src/data/universities/cambridge.ts`
- Create: `src/data/universities/eth-zurich.ts`
- Create: `src/data/universities/index.ts`
- Test: `tests/data/universities.test.ts`

**Interfaces:**
- Consumes: `UniversityTemplate`, `CvDocument`, `CvLanguage`, `CvFormat` from `@/types/cv`
- Produces (from `src/data/universities/index.ts`):
  - `UNIVERSITY_TEMPLATES: UniversityTemplate[]` (length 6)
  - `getUniversityBySlug(slug: string): UniversityTemplate | undefined`
  - `getUniversityById(id: string): UniversityTemplate | undefined`
  - `filterUniversities(opts: { field?: string; format?: CvFormat | 'all'; query?: string }): UniversityTemplate[]`
  - `createCvFromTemplate(templateId: string, language?: CvLanguage): CvDocument`

- [ ] **Step 1: Write failing tests in `tests/data/universities.test.ts`**
  ```ts
  import { describe, it, expect } from 'vitest';
  import {
    UNIVERSITY_TEMPLATES,
    getUniversityBySlug,
    filterUniversities,
    createCvFromTemplate,
  } from '@/data/universities';
  import { CvDocumentSchema } from '@/types/cv';

  describe('University Templates Library', () => {
    it('contains exactly 6 prestigious universities with unique ids and slugs', () => {
      expect(UNIVERSITY_TEMPLATES).toHaveLength(6);
      const slugs = new Set(UNIVERSITY_TEMPLATES.map((t) => t.slug));
      expect(slugs).toEqual(new Set(['harvard', 'mit', 'stanford', 'oxford', 'cambridge', 'eth-zurich']));
    });

    it('ensures every template has valid sampleCv, bilingual actionVerbs, and valid annotation targets', () => {
      for (const tpl of UNIVERSITY_TEMPLATES) {
        expect(tpl.styleRules.length).toBeGreaterThanOrEqual(4);
        expect(tpl.actionVerbs.en.length).toBeGreaterThanOrEqual(8);
        expect(tpl.actionVerbs.vi.length).toBeGreaterThanOrEqual(8);
        expect(tpl.annotations.length).toBeGreaterThanOrEqual(4);
        const sectionTypes = new Set(tpl.sampleCv.sections.map((s) => s.type));
        for (const ann of tpl.annotations) {
          expect(sectionTypes.has(ann.targetSection)).toBe(true);
        }
      }
    });

    it('sets photoRecommended=false for US/UK schools and true for ETH Zurich', () => {
      for (const slug of ['harvard', 'mit', 'stanford', 'oxford', 'cambridge']) {
        expect(getUniversityBySlug(slug)?.photoRecommended).toBe(false);
      }
      expect(getUniversityBySlug('eth-zurich')?.photoRecommended).toBe(true);
    });

    it('filters by format and search query', () => {
      const academic = filterUniversities({ format: 'academic-cv' });
      expect(academic.some((t) => t.slug === 'oxford')).toBe(true);
      const mitOnly = filterUniversities({ query: 'MIT' });
      expect(mitOnly.map((t) => t.slug)).toEqual(['mit']);
    });

    it('createCvFromTemplate produces an independent valid CvDocument with template photo default', () => {
      const cv1 = createCvFromTemplate('harvard-ocs', 'en');
      const cv2 = createCvFromTemplate('eth-zurich-stem', 'vi');
      expect(CvDocumentSchema.safeParse(cv1).success).toBe(true);
      expect(cv1.showPhoto).toBe(false);
      expect(cv2.showPhoto).toBe(true);
      expect(cv1.id).not.toBe(cv2.id);
      cv1.content.personalInfo.fullName = 'Changed';
      expect(getUniversityBySlug('harvard')?.sampleCv.personalInfo.fullName).not.toBe('Changed');
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  - Run: `npx vitest run tests/data/universities.test.ts`
  - Expected: FAIL.

- [ ] **Step 3: Author the 6 curated university modules and `src/data/universities/index.ts`**
  - Each module provides realistic, high-signal English `sampleCv` content matching that university's real career office conventions, Vietnamese `annotations` explaining *what* they write and *how* they phrase bullets, Vietnamese `styleRules`, Vietnamese `photoGuidance`, and `actionVerbs: { en, vi }`.
  - Layout mapping: `harvard` (`classic-serif`), `mit` (`modern-tech`), `stanford` (`modern-tech`), `oxford` (`academic-cv`), `cambridge` (`classic-serif`), `eth-zurich` (`clean-euro`).
  - `createCvFromTemplate` deep-clones `sampleCv`, translates section titles if `language === 'vi'`, sets `showPhoto: template.photoRecommended`, and assigns a unique `id` + ISO `updatedAt`.

- [ ] **Step 4: Run test to verify it passes**
  - Run: `npx vitest run tests/data/universities.test.ts`
  - Expected: PASS (5 tests).

- [ ] **Step 5: Commit**
  - `git add src/data/universities tests/data/universities.test.ts && git commit -m "feat: add 6 curated university CV templates with Vietnamese annotations"`

---

### Task 3: Local Storage Persistence, JSON Backup/Import & Client Photo Compression

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/photo.ts`
- Test: `tests/lib/storage.test.ts`
- Test: `tests/lib/photo.test.ts`

**Interfaces:**
- Consumes: `CvDocument`, `CvDocumentSchema` from `@/types/cv`
- Produces (from `src/lib/storage.ts`):
  - `StorageResult<T> = { ok: true; data: T } | { ok: false; error: string }`
  - `loadSavedCvs(): CvDocument[]`
  - `saveCv(cv: CvDocument): StorageResult<CvDocument>`
  - `deleteCv(cvId: string): CvDocument[]`
  - `duplicateCv(cvId: string): StorageResult<CvDocument>`
  - `exportCvToJson(cv: CvDocument): string`
  - `importCvFromJson(rawJson: string): StorageResult<CvDocument>`
  - `loadByokKey(): string | null`, `saveByokKey(key: string): void`, `clearByokKey(): void`
- Produces (from `src/lib/photo.ts`):
  - `validatePhotoFile(file: { type: string; size: number }): { ok: true } | { ok: false; error: string }`
  - `compressPhotoToDataUrl(file: File, maxDimension?: number, maxBytes?: number): Promise<string>`

- [ ] **Step 1: Write failing tests in `tests/lib/storage.test.ts` and `tests/lib/photo.test.ts`**
  - In `tests/lib/storage.test.ts`:
    - Saves, loads, duplicates, and deletes CVs in `localStorage`.
    - Exports and re-imports valid CV JSON cleanly with a fresh `id`.
    - **Review Focus #1:** `importCvFromJson('{bad json')` and `importCvFromJson('{"id":"x"}')` return `{ ok: false, error }` with Vietnamese message and leave existing stored CVs untouched.
    - **Review Focus #2:** Mocking `Storage.prototype.setItem` to throw `DOMException('QuotaExceededError')` makes `saveCv` return `{ ok: false, error }` without throwing.
    - Saves, loads, and clears BYOK key.
  - In `tests/lib/photo.test.ts`:
    - `validatePhotoFile` accepts `image/jpeg`, `image/png`, `image/webp` under 5MB and rejects `application/pdf` or files > 5MB with Vietnamese error messages.

- [ ] **Step 2: Run tests to verify they fail**
  - Run: `npx vitest run tests/lib/storage.test.ts tests/lib/photo.test.ts`
  - Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/storage.ts` and `src/lib/photo.ts`**
  - `src/lib/storage.ts`: namespaced keys (`cv_builder_documents_v1`, `cv_builder_byok_key_v1`), safe `JSON.parse` + Zod filtering on load, `QuotaExceededError` catch on write.
  - `src/lib/photo.ts`: `validatePhotoFile` checks MIME type and raw size (`<= 5MB`); `compressPhotoToDataUrl` draws onto an offscreen HTML `<canvas>` center-cropped to `<= 256x256` and iterates JPEG quality down until byte length `<= 40960`.

- [ ] **Step 4: Run tests to verify they pass**
  - Run: `npx vitest run tests/lib/storage.test.ts tests/lib/photo.test.ts`
  - Expected: PASS.

- [ ] **Step 5: Commit**
  - `git add src/lib/storage.ts src/lib/photo.ts tests/lib/storage.test.ts tests/lib/photo.test.ts && git commit -m "feat: add localStorage persistence, JSON backup/import, and photo compression"`

---

### Task 4: AI Assistant API Route, Rate Limiter & Prompt Builder

**Files:**
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/ai-prompts.ts`
- Create: `src/lib/gemini.ts`
- Create: `src/app/api/ai/assist/route.ts`
- Test: `tests/lib/rate-limit.test.ts`
- Test: `tests/lib/ai-prompts.test.ts`
- Test: `tests/api/ai-assist.test.ts`

**Interfaces:**
- Consumes: `UniversityTemplate`, `CvContent`, `CvLanguage` from `@/types/cv`; `getUniversityById` from `@/data/universities`
- Produces:
  - `createDailyRateLimiter({ limit, windowMs })` with `consume(ip: string, now?: number): { allowed: boolean; remaining: number; limit: number; resetAt: number }`
  - `AiAction = 'rewrite_bullet' | 'review_section' | 'review_cv'`
  - `buildAiPrompt(input: { action: AiAction; template: UniversityTemplate; language: CvLanguage; content?: CvContent; sectionId?: string; targetText?: string }): { systemInstruction: string; userPrompt: string }`
  - `POST /api/ai/assist` accepting `{ action, templateId, language, content?, sectionId?, targetText?, userApiKey? }` and returning `{ result, quota: { remaining, limit, usingByok } }` or `{ error, code: 'INVALID_REQUEST' | 'QUOTA_EXCEEDED' | 'MISSING_API_KEY' | 'AI_UPSTREAM_ERROR' }`.

- [ ] **Step 1: Write failing tests**
  - `tests/lib/rate-limit.test.ts`: allows up to `limit` requests per IP, blocks `(limit + 1)`th, resets after `windowMs`, tracks IPs independently.
  - `tests/lib/ai-prompts.test.ts`:
    - **Review Focus #4:** When `language === 'vi'`, `systemInstruction` includes `template.universityName`, `template.styleRules`, `template.actionVerbs.vi`, and explicitly instructs output in Vietnamese. When `language === 'en'`, injects `template.actionVerbs.en`.
  - `tests/api/ai-assist.test.ts` (mocking `callGeminiJson`):
    - **Review Focus #3:** Missing `GEMINI_API_KEY` without `userApiKey` returns HTTP 503 with `code: 'MISSING_API_KEY'`.
    - **Review Focus #3:** Exceeding daily limit returns HTTP 429 with `code: 'QUOTA_EXCEEDED'`.
    - **Review Focus #3:** Passing `userApiKey` bypasses rate limit and works even when `process.env.GEMINI_API_KEY` is unset, returning `quota.usingByok: true`.
    - Valid request with server key returns 200 with structured `result` and decremented `quota.remaining`.

- [ ] **Step 2: Run tests to verify they fail**
  - Run: `npx vitest run tests/lib/rate-limit.test.ts tests/lib/ai-prompts.test.ts tests/api/ai-assist.test.ts`
  - Expected: FAIL.

- [ ] **Step 3: Implement `rate-limit.ts`, `ai-prompts.ts`, `gemini.ts`, and `route.ts`**
  - `gemini.ts`: calls Gemini `generateContent` REST endpoint with `responseMimeType: 'application/json'`, parses JSON safely, never logs `apiKey`.
  - `route.ts`: validates body with Zod, resolves `templateId`, applies BYOK or IP rate limit, calls `callGeminiJson`, returns structured JSON.

- [ ] **Step 4: Run tests to verify they pass**
  - Run: `npx vitest run tests/lib/rate-limit.test.ts tests/lib/ai-prompts.test.ts tests/api/ai-assist.test.ts`
  - Expected: PASS.

- [ ] **Step 5: Commit**
  - `git add src/lib/rate-limit.ts src/lib/ai-prompts.ts src/lib/gemini.ts src/app/api/ai/assist/route.ts tests/lib/rate-limit.test.ts tests/lib/ai-prompts.test.ts tests/api/ai-assist.test.ts && git commit -m "feat: add university-calibrated AI assist API with rate limiting and BYOK"`

---

### Task 5: ATS-Friendly PDF Generator & Bundled Vietnamese Fonts

**Files:**
- Create: `public/fonts/Inter-Regular.ttf`, `public/fonts/Inter-Bold.ttf`, `public/fonts/NotoSerif-Regular.ttf`, `public/fonts/NotoSerif-Bold.ttf`, `public/fonts/NotoSerif-Italic.ttf` (downloaded from official Google Fonts / fontsource packages with full Vietnamese glyph support)
- Create: `src/lib/pdf/fonts.ts`
- Create: `src/lib/pdf/CvPdfDocument.tsx`
- Create: `src/lib/pdf/exportPdf.ts`
- Test: `tests/lib/pdf.test.ts`

**Interfaces:**
- Consumes: `CvDocument`, `UniversityTemplate`, `SECTION_LABELS` from `@/types/cv`
- Produces:
  - `registerPdfFonts(basePath?: string): void`
  - `CvPdfDocument({ cv, template }: { cv: CvDocument; template: UniversityTemplate })`
  - `generateCvPdfBuffer(cv: CvDocument, template: UniversityTemplate): Promise<Buffer>` (for server/Node tests)
  - `downloadCvPdf(cv: CvDocument, template: UniversityTemplate): Promise<void>` (client-side 1-click download)

- [ ] **Step 1: Bundle Vietnamese-capable `.ttf` fonts into `public/fonts/`**
  - Copy or download `Inter` (Regular, Bold) and `NotoSerif` (Regular, Bold, Italic) TTF files supporting Vietnamese Latin Extended characters into `public/fonts/` and verify files exist and are non-empty.

- [ ] **Step 2: Write failing PDF generation test in `tests/lib/pdf.test.ts`**
  - **Review Focus #5:** Tests `generateCvPdfBuffer` across all 4 layout variants (`harvard-ocs`, `mit-capd`, `oxford-careers`, `eth-zurich-stem`) with Vietnamese diacritics (`Nguyễn Minh Quân — Kỹ sư Hệ thống Phân tán`) and verifies:
    - Returns a `Buffer` starting with `%PDF-` and length `> 1000`.
    - Succeeds both when `showPhoto: false` and when `showPhoto: true` with a valid 1×1 PNG/JPEG base64 data URL.

- [ ] **Step 3: Run test to verify it fails**
  - Run: `npx vitest run tests/lib/pdf.test.ts`
  - Expected: FAIL.

- [ ] **Step 4: Implement `fonts.ts`, `CvPdfDocument.tsx`, and `exportPdf.ts`**
  - `fonts.ts`: idempotently registers `Inter` and `NotoSerif` with `@react-pdf/renderer` (resolving `public/fonts/...` on Node and `/fonts/...` in browser).
  - `CvPdfDocument.tsx`: renders clean ATS-readable single-column/structured layouts matching `classic-serif`, `modern-tech`, `academic-cv`, and `clean-euro`, respecting `section.visible`, `cv.language`, and optional `showPhoto && personalInfo.photoDataUrl`.
  - `exportPdf.ts`: exposes `generateCvPdfBuffer` (via `renderToBuffer`) and `downloadCvPdf` (via `pdf(...).toBlob()`).

- [ ] **Step 5: Run test to verify it passes**
  - Run: `npx vitest run tests/lib/pdf.test.ts`
  - Expected: PASS.

- [ ] **Step 6: Commit**
  - `git add public/fonts src/lib/pdf tests/lib/pdf.test.ts && git commit -m "feat: add ATS-friendly PDF export with bundled Vietnamese fonts"`

---

### Task 6: Landing Page, Shared HTML Live Preview & Annotated University Library

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/cv/CvHtmlPreview.tsx`
- Create: `src/components/library/LibraryGrid.tsx`
- Create: `src/components/library/AnnotatedShowcase.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/library/page.tsx`
- Create: `src/app/library/[slug]/page.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Test: `tests/components/library.test.tsx`

**Interfaces:**
- Consumes: `UNIVERSITY_TEMPLATES`, `getUniversityBySlug`, `filterUniversities`, `createCvFromTemplate` from `@/data/universities`; `saveCv`, `loadSavedCvs` from `@/lib/storage`; `CvDocument`, `UniversityTemplate` from `@/types/cv`
- Produces:
  - `CvHtmlPreview({ cv, template, highlightedSection?, onSectionClick?, showOverflowWarning? })` — reusable A4 HTML preview shared by `/library/[slug]` and `/editor`, mirroring the 4 layout variants, photo header toggle, and soft 1-page overflow indicator for `resume-1page`.
  - Pages `/`, `/library`, `/library/[slug]` with SEO metadata (`generateMetadata` + `generateStaticParams` for all 6 slugs).

- [ ] **Step 1: Write failing component tests in `tests/components/library.test.tsx`**
  - `LibraryGrid` renders all 6 universities and filters down when clicking "Academic CV" or typing "Harvard".
  - `AnnotatedShowcase` renders the Harvard sample CV and shows Vietnamese annotation explanation when clicking a section annotation pill.
  - `CvHtmlPreview` renders Vietnamese section labels when `cv.language === 'vi'` and shows/hides the profile image based on `cv.showPhoto`.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `npx vitest run tests/components/library.test.tsx`
  - Expected: FAIL.

- [ ] **Step 3: Implement `Navbar`, `CvHtmlPreview`, `LibraryGrid`, `AnnotatedShowcase`, and pages `/`, `/library`, `/library/[slug]`**
  - Clicking "Dùng mẫu này để viết CV" on `/library/[slug]` calls `createCvFromTemplate(template.id)`, saves via `saveCv`, and navigates to `/editor?cv=<id>`.
  - Landing page `/` shows value proposition, featured university cards, and recent local CVs if any exist.

- [ ] **Step 4: Run test to verify it passes**
  - Run: `npx vitest run tests/components/library.test.tsx`
  - Expected: PASS.

- [ ] **Step 5: Commit**
  - `git add src/components/Navbar.tsx src/components/cv src/components/library src/app/page.tsx src/app/library src/app/layout.tsx src/app/globals.css tests/components/library.test.tsx && git commit -m "feat: add landing page, HTML CV preview, and annotated university library"`

---

### Task 7: 3-Pane CV Editor with Side-by-Side Reference & AI Assistant Drawer

**Files:**
- Create: `src/components/editor/EditorTopBar.tsx`
- Create: `src/components/editor/CvFormEditor.tsx`
- Create: `src/components/editor/ReferenceAiDrawer.tsx`
- Create: `src/components/editor/ByokModal.tsx`
- Create: `src/components/editor/CvEditorWorkspace.tsx`
- Create: `src/app/editor/page.tsx`
- Test: `tests/components/editor.test.tsx`

**Interfaces:**
- Consumes: `CvHtmlPreview` from `@/components/cv/CvHtmlPreview`; `UNIVERSITY_TEMPLATES`, `getUniversityById`, `createCvFromTemplate` from `@/data/universities`; `loadSavedCvs`, `saveCv`, `deleteCv`, `duplicateCv`, `exportCvToJson`, `importCvFromJson`, `loadByokKey`, `saveByokKey`, `clearByokKey` from `@/lib/storage`; `validatePhotoFile`, `compressPhotoToDataUrl` from `@/lib/photo`; `downloadCvPdf` from `@/lib/pdf/exportPdf`
- Produces: Complete `/editor` interactive 3-pane workspace.

- [ ] **Step 1: Write failing editor tests in `tests/components/editor.test.tsx`**
  - Loads an existing CV from `localStorage` (or creates a default Harvard CV when empty) and reflects edits to `fullName` immediately in `CvHtmlPreview` and `localStorage`.
  - Toggling language EN/VI updates visible section headings.
  - Toggling `showPhoto` displays US/UK convention note on Harvard template and toggles photo controls.
  - Switching right drawer to "Trợ lý AI", triggering "Viết lại bullet point" (with mocked `fetch` to `/api/ai/assist`), and clicking "Áp dụng vào CV" replaces the target bullet text in the editor.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `npx vitest run tests/components/editor.test.tsx`
  - Expected: FAIL.

- [ ] **Step 3: Implement editor components and `src/app/editor/page.tsx`**
  - `EditorTopBar`: CV title input, saved CV switcher (New from template / Duplicate / Delete), EN/VI toggle, template switcher, JSON Export/Import buttons (showing Vietnamese toast/banner on error), and 1-click "Tải PDF (ATS)" button.
  - `CvFormEditor`: personal info + optional photo upload/remove (using `validatePhotoFile` + `compressPhotoToDataUrl` + `template.photoGuidance` hint), collapsible sections with move up/down, visibility toggle, add/remove items & bullets, and per-bullet sparkle button to jump straight to AI rewrite.
  - `ReferenceAiDrawer`: collapsible right drawer with 2 tabs:
    - Tab 1 (`Tham khảo mẫu gốc`): original university sample sections, Vietnamese annotations, golden rules, and EN/VI action verbs.
    - Tab 2 (`Trợ lý AI`): Rewrite bullet / Review section / Review full CV actions, displays remaining free quota badge, opens `ByokModal` to save/clear personal Gemini API key, and provides 1-click "Áp dụng" for bullet rewrites.

- [ ] **Step 4: Run full test suite and production build**
  - Run: `npx vitest run && npm run build`
  - Expected: All unit & component tests PASS and Next.js production build succeeds with 0 TypeScript or build errors.

- [ ] **Step 5: Commit**
  - `git add src/components/editor src/app/editor tests/components/editor.test.tsx && git commit -m "feat: add 3-pane CV editor with side-by-side university reference and AI drawer"`

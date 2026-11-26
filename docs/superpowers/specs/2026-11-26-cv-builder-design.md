# Design Document: University-Standard CV Builder

**Date:** 2026-11-26  
**Status:** Approved  
**Project Directory:** `C:\Users\quann\.gemini\antigravity\scratch\cv-builder`

---

## 1. Intent & Why

Build a public web application where the creator, their friends, and anyone online can write CVs.

Most online CV builders only offer blank form-fill templates and lock clean PDF export behind paywalls. This product differentiates itself by centering the writing experience on **prestigious university CV standards and real-style examples** (e.g., Harvard, MIT, Stanford, Oxford, Cambridge, ETH Zurich). Users do not just borrow a layout—they can study **what** top university candidates include, **how** they structure sections and phrase achievements, start directly from pre-filled university templates, compare against the annotated reference side-by-side while writing, and get **AI writing assistance** calibrated to the chosen university's style.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Zero-friction public access:** Anyone can open the site, browse university references, create/edit multiple CVs saved locally in the browser, export/import JSON backups, and download ATS-friendly PDFs without creating an account.
- **3-in-1 Core Experience:**
  1. **Annotated University CV Library:** Curated showcase of CV examples from prestigious universities with inline annotations explaining section order, formatting choices, action-verb usage, and quantification patterns.
  2. **Pre-filled Editable Templates:** Clicking "Dùng mẫu này" opens the editor pre-populated with that university's structure and realistic example content so users can edit in place.
  3. **Side-by-Side Reference + Calibrated AI Assistant:** While editing, users can toggle a side panel with (a) the original annotated university reference & rules, and (b) an AI assistant that rewrites bullet points and reviews sections according to the chosen university's guidelines.
- **Accessible AI with Cost Control:** AI works out-of-the-box via a server-side proxy with a daily free quota per IP, plus a Bring-Your-Own-Key (BYOK) option for users who want unlimited AI usage.
- **Bilingual Writing & ATS-Friendly Output:** Vietnamese UI by default; supports writing CVs in both **English** and **Vietnamese**; 1-click PDF export with selectable text, clean structure, and full Vietnamese diacritic support.

### Non-Goals (v1)
- User accounts, login/OAuth, and cloud CV sync across devices (planned as a clean v2 upgrade).
- Admin CMS for uploading new university templates dynamically (v1 stores curated templates as typed data modules in the repo).
- Freeform drag-and-drop canvas editing (e.g., Canva-style arbitrary positioning), which degrades ATS readability and breaks university layout discipline.
- Payments, subscriptions, or paywalled exports.

### Anti-Goals (Failure Modes to Avoid)
- **Broken or rasterized PDFs:** Exporting images-in-PDF (breaks ATS) or broken Vietnamese diacritics.
- **Cluttered editor:** Reference panels or AI popups obscuring the live CV preview or slowing down typing.
- **Generic AI advice:** AI giving vague praise or flashy buzzwords that contradict the selected university's actual CV guidelines.
- **Hard dependency on AI:** Editing, browsing the library, saving locally, and exporting PDFs must work 100% even if no AI key is configured or the AI quota is exhausted.

---

## 3. Constraints

- **Deployment & Ops:** Single Next.js repository deployable to Vercel (or any Node host) with minimal configuration (`GEMINI_API_KEY` and optional `AI_DAILY_LIMIT`).
- **Privacy for BYOK:** User-provided API keys are stored only in browser `localStorage` and forwarded per-request to the API route; the server must never log or persist user keys.
- **Offline/Reliable PDF Fonts:** Fonts supporting both English and Vietnamese (`UTF-8` diacritics) must be bundled locally in `public/fonts/` so PDF generation never fails due to CDN/network issues.
- **Responsive Experience:** Desktop-first for the multi-pane editor (with collapsible panels on smaller laptops); mobile/tablet-friendly for browsing the landing page and university library.

---

## 4. Approaches Considered

| Approach | Summary | Trade-offs |
|---|---|---|
| **1. Next.js App Router Full-stack (Selected)** | Single Next.js + TypeScript + Tailwind CSS app. Client-side editor & `localStorage` persistence, typed in-repo university library, built-in API routes for rate-limited Gemini proxy + BYOK, `@react-pdf/renderer` for ATS PDF export. | **Pros:** Single repo, fast to build & deploy free on Vercel, strong SEO for university template pages, smooth upgrade path to auth + DB later. **Cons:** In-memory serverless rate limiting is best-effort per instance unless paired with Redis later (acceptable for v1). |
| **2. Vite + React SPA + Cloudflare Worker** | Static React frontend paired with a separate Cloudflare Worker for the AI proxy and KV rate limiting. | **Pros:** Very fast static hosting, cheap high-scale edge rate limiting. **Cons:** Two separate codebases/deployments; weaker out-of-the-box SEO for individual university CV pages. |
| **3. Next.js + Supabase from Day 1** | Full-stack Next.js with Postgres DB for dynamic templates and persistent rate limiting from v1. | **Pros:** Dynamic template management and strict rate limiting immediately. **Cons:** Unnecessary setup/schema/account overhead before validating the core writing experience. |

**Decision:** The user selected **Approach 1 (Next.js App Router Full-stack)** for its balance of fast delivery, SEO-friendly library pages, single-repo simplicity, and clean path to cloud sync in v2.

---

## 5. Decisions Made

### Decided by User
- **Target audience:** Public web app (creator, friends, and general public).
- **Core differentiator:** Prestigious university CV reference library explaining *what* they write and *how* they write it.
- **3-in-1 workflow:** Annotated library + pre-filled editable templates + AI writing/review assistant.
- **Persistence & AI access model:** No login required (browser `localStorage` + JSON backup/import), server-side AI proxy with daily free quota + BYOK option for unlimited use.
- **Language & PDF:** Vietnamese UI; authentic English sample CVs paired with Vietnamese annotations and explanations (switching CV language to Vietnamese translates section headings and instructs the AI to write/review in Vietnamese following the university's standards); ATS-friendly PDF export.
- **Profile Photo:** Optional toggleable profile photo supported (off by default for US/UK templates with a note explaining US/UK conventions; enabled/available for European templates like ETH Zurich and Vietnamese CVs).
- **Architecture:** Approach 1 (Next.js Full-stack).

### Proposed Calls (Our Calls — Flagged for User Review)
- **Starter University Collection (6 curated profiles):**
  1. **Harvard University (OCS)** — Business / Consulting / General (classic 1-page serif, strict action-verb + result bullets).
  2. **MIT (CAPD)** — Software Engineering / Computer Science (clean sans-serif, technical skills & projects prominence).
  3. **Stanford University (CareerEd)** — Tech / Product Management (impact-focused, metrics-first bullets).
  4. **University of Oxford (Careers Service)** — Academic / Research CV (multi-section academic structure: Research, Publications, Teaching, Grants).
  5. **University of Cambridge** — Finance / Strategy / Graduate Roles (concise UK-style chronological layout).
  6. **ETH Zurich** — STEM / Engineering (European clean structured CV with language proficiency, optional photo, & technical focus).
- **Live Preview vs. PDF Rendering Strategy:** Use fast HTML/CSS live preview components closely matched to the PDF typography/margins (for zero-lag typing, interactive section highlighting, and a soft 1-page overflow warning on 1-page resume templates), paired with `@react-pdf/renderer` (using bundled Vietnamese-capable fonts in `public/fonts/`) for 1-click ATS-friendly PDF downloads. Minor line-wrap drift between HTML preview and PDF is acceptable in v1.
- **Photo Handling for `localStorage`:** Client-side auto-crop/resize (e.g., max 256×256px JPEG/WebP, <40KB) before storing as a base64 data URL in `personalInfo.photoUrl` so multiple saved CVs and JSON backups stay well within browser `localStorage` limits.
- **Default AI Provider:** Google Gemini API (`gemini-2.5-flash` or configurable via `GEMINI_MODEL` env var) for fast, low-cost, high-quality bilingual EN/VI rewriting (with bilingual action-verb guidance when `language === 'vi'`).
- **Default Server Free Quota:** 10 AI requests per IP per 24 hours (configurable via `AI_DAILY_LIMIT` env var).

---

## 6. Product Structure & Key Flows

### Routes
1. **`/` (Landing Page):** Clear value proposition ("Viết CV theo chuẩn các trường đại học hàng đầu thế giới"), featured university templates preview, quick links to `/library` and resuming recent local CVs in `/editor`.
2. **`/library` (University CV Library):** Filterable gallery by university, field (CS/Tech, Business/Finance, Academic/Research, Engineering), and format (1-page Resume vs. Academic CV).
3. **`/library/[slug]` (Annotated University Showcase):**
   - Full realistic CV preview in that university's typography and layout.
   - Interactive annotations highlighting *why* each section is ordered that way, *how* bullet points are constructed, and a "Quy tắc vàng & Động từ hành động" sidebar.
   - Primary CTA: **"Dùng mẫu này để viết CV"** (creates a new local CV pre-filled with that template's sample data and opens `/editor`).
4. **`/editor` (CV Workspace):**
   - **Top Bar:** CV title, saved CV switcher (create/duplicate/delete), language toggle (EN/VI section labels), template switcher, JSON Export/Import, and **Tải PDF (ATS)** button.
   - **Left Pane (Form Editor):** Collapsible section cards (Thông tin cá nhân, Học vấn, Kinh nghiệm, Dự án, Kỹ năng, Giải thưởng / Công bố) with section reordering, hide/show toggles, and per-bullet quick "Nhờ AI viết lại" action.
   - **Center Pane (Live Preview):** Real-time A4/Letter preview rendered with the selected university's layout and typography.
   - **Right Pane (Collapsible Reference & AI Drawer):**
     - *Tab 1 — Tham khảo mẫu gốc:* Shows the selected university's original example side-by-side with its annotations, style rules, and action-verb bank.
     - *Tab 2 — Trợ lý AI:* Context-aware assistant with 3 actions:
       - **Viết lại bullet point** (applies university's formula: Action Verb + Context + Quantified Impact).
       - **Góp ý từng mục** (critiques the active section against the university's rules).
       - **Đánh giá tổng thể CV** (checks structure, length, clarity, and missing metrics).
       - Displays remaining free daily quota and a "Dùng API key riêng (BYOK)" modal.

### Data Model (High-Level)
- **`UniversityTemplate`**: `id`, `slug`, `universityName`, `officeOrProgram`, `country`, `field`, `format`, `layoutVariant` (`classic-serif` | `modern-tech` | `academic-cv` | `clean-euro`), `photoRecommended: boolean`, `photoGuidance: string`, `styleRules: string[]`, `actionVerbs: { en: string[]; vi: string[] }`, `annotations: { id, targetSection, targetIndex?, title, explanation }[]` (in Vietnamese), `sampleCv: CvContent` (authentic English).
- **`CvDocument`**: `id`, `title`, `templateId`, `language` (`en` | `vi`), `showPhoto: boolean`, `updatedAt`, `content: CvContent` (`personalInfo` including optional compressed `photoDataUrl`, ordered `sections[]` with `visible` flag and typed `items[]`).

### AI API Route (`POST /api/ai/assist`)
- **Input:** `{ action, templateId, language, content, targetText?, userApiKey? }`.
- **Behavior:**
  - Looks up `UniversityTemplate` by `templateId` to inject its exact `styleRules` and `actionVerbs` into the system prompt.
  - If `userApiKey` is present, calls Gemini directly using that key (no server quota deducted).
  - Otherwise, enforces in-memory per-IP daily rate limit and uses `process.env.GEMINI_API_KEY`.
  - Returns structured JSON (e.g., rewritten suggestions + explanation of what changed, or structured review points) plus `{ remainingQuota, limit }`.
  - Graceful error handling when `GEMINI_API_KEY` is missing or quota is reached (guides user to enter BYOK key).

---

## 7. What's Left to the Builder

- Visual design system (refined academic-editorial palette, spacing, typography hierarchy, dark/light polish, responsive breakpoints).
- State management choice for the editor (e.g., Zustand with `persist` middleware or React Context + custom `localStorage` hook with debounced autosave and schema versioning).
- Exact `@react-pdf/renderer` layout components for each `layoutVariant` and font registration.
- Exact Gemini prompt templates and response JSON parsing/validation (e.g., using Zod).
- Test coverage: unit tests for `localStorage` persistence/JSON import validation, rate limiter logic, AI API route handler (mocked Gemini client), and template data integrity.

# Design Specification: Typography, Responsiveness, and Cognitive Decluttering

- **Status**: Approved Design Specification
- **Date**: 2026-10-15
- **Reference**: Untitled UI v8 Token Architecture, WCAG 2.2 Level AAA, WordPix Mobile Review

---

## 1. Context & Motivation

WordPix is an accessible, bilingual (English/Arabic), gamified visual English learning application for adult learners (A1–C1).
Recent audits revealed three core areas requiring architectural elevation:

1. **Typography Fragmentation**: Font references to "Inter" and "Noto Sans Arabic" currently rely on operating-system defaults with no web font packaging, resulting in cross-device font shifts, inconsistent x-heights, and clipped Arabic diacritics. Heavy `font-black` (900) weights dominate headings and strain reading rhythm.
2. **Mobile Navigation Collisions**: During active drills and reading exercises, the global 5-tab bottom navigation bar remains rendered, leading to layout shifts when virtual keyboards open and accidental navigation clicks mid-drill.
3. **Screen Clutter & Cognitive Overload**: Secondary artifacts (such as full release notes cards, competing primary buttons, and academic pedagogy jargon like "minimal pair acoustic discrimination" and "cloze text") create friction for adult learners.

---

## 2. Section 1: Typography & Font Infrastructure

### 2.1 Self-Hosted Variable Font Architecture

To guarantee 100% offline PWA readiness, zero external tracking requests, and zero Cumulative Layout Shift (CLS):

- Install and bundle official variable font packages:
  - `@fontsource-variable/inter` (Latin weights 100–900 with optical sizing)
  - `@fontsource-variable/noto-sans-arabic` (Arabic weights 100–900)
- Fonts are bundled directly into `dist/assets/` via Vite's asset pipeline, automatically respecting the `/wordpix/` base path.
- `index.html` includes `<link rel="preload">` tags for the variable WOFF2 files to eliminate Flash of Invisible Text (FOIT).

### 2.2 Canonical Typographic Hierarchy

Eliminate arbitrary `font-black` (900) styling in favor of Untitled UI v8 compliant semantic styles:

| Style Token            | Desktop Size    | Mobile Size     | Weight         | Line Height | Usage                                             |
| :--------------------- | :-------------- | :-------------- | :------------- | :---------- | :------------------------------------------------ |
| **`.wp-type-display`** | 2.5rem (40px)   | 2.0rem (32px)   | Bold (700)     | 1.15        | Splash screens, milestone celebrations            |
| **`.wp-type-h1`**      | 2.0rem (32px)   | 1.625rem (26px) | Bold (700)     | 1.2         | Page & tab titles (Home, Learn, Practice)         |
| **`.wp-type-h2`**      | 1.5rem (24px)   | 1.25rem (20px)  | Bold (700)     | 1.25        | Primary unit cards, question prompts              |
| **`.wp-type-h3`**      | 1.125rem (18px) | 1.0rem (16px)   | Semibold (600) | 1.3         | Choice options, metric labels                     |
| **`.wp-type-body`**    | 1.0rem (16px)   | 1.0rem (16px)   | Medium (500)   | 1.5         | Word definitions, sentences, instructions         |
| **`.wp-type-body-sm`** | 0.875rem (14px) | 0.875rem (14px) | Medium (500)   | 1.45        | Subtitles, meta badges, hints                     |
| **`.wp-type-caption`** | 0.75rem (12px)  | 0.75rem (12px)  | Semibold (600) | 1.4         | Bottom tab labels, timestamps, keyboard shortcuts |

### 2.3 Arabic Script & Bilingual Ergonomics

- **Line Height**: In RTL (`[dir="rtl"]`), automatic line-height increases to `1.65` (`leading-relaxed`) to prevent diacritics (harakat/tashkeel) from clipping or visually merging with adjacent text lines.
- **Zero Letter-Spacing**: Enforce `letter-spacing: 0` for all Arabic text elements to maintain cursive ligature integrity.
- **Tabular Numbers**: Apply `font-variant-numeric: tabular-nums` to timers, word progress counters, and streak counters to prevent layout jittering.

---

## 3. Section 2: Responsive Layout & "Lesson Focus Mode"

### 3.1 Immersive Lesson Focus Shell

- When navigating to active study or drill routes (`lesson`, `learning-materials`, `figma-pronunciation-lesson`, `skill-exercise`, `hadith-lesson`, `conversation-lesson`, `business-lesson`), the global bottom 5-tab bar is hidden.
- Pinned at the bottom is an anchored **Lesson Action Dock**:
  - **Left (Start)**: Audio Replay / Speed Toggle button (44×44px).
  - **Center**: Step progress indicator (e.g., `Step 3 of 5`).
  - **Right (End)**: Primary **"Check Answer"** / **"Continue"** button (min 48px height, thumb reach).
  - Padded with `pb-[env(safe-area-inset-bottom)]` and `h-dvh` to ensure zero virtual keyboard collisions.

### 3.2 Adaptive Modals & Bottom Sheets

- **Mobile (< 768px)**: Modals (`SettingsModal`, `KeyboardShortcutsModal`) render as native-feeling bottom sheets (`max-h-[85dvh]` with drag handle and internal scrolling).
- **Tablet / Desktop (≥ 768px)**: Modals render as centered elevated dialog cards (`max-w-lg rounded-3xl shadow-wp-md`).

### 3.3 Strict 320px–375px Hardening

- All flex containers containing titles and badges use `min-w-0` and `flex-wrap gap-2` to eliminate horizontal clipping.
- Use `dvh` (`h-dvh` / `min-h-dvh`) everywhere to prevent mobile address bar jumping.
- Strict compliance with WCAG 2.2 AAA 2.5.5 touch target size (≥ 44 × 44 CSS px) and target spacing (≥ 8px).

---

## 4. Section 3: Screen-by-Screen Cognitive Decluttering

### 4.1 Home Dashboard (`HomeDashboard.tsx`)

- **Relocate Release Notes**: Remove `ReleaseNotesCard` from the main scroll feed. Provide a compact **"v0.1.36 What's New"** pill in the top header that opens the release notes sheet on demand.
- **One Clear Lead Action**:
  - If reviews are due/overdue: Elevate the **Daily Review Card** as the primary action (`"Review 10 Due Words"`).
  - If caught up: Elevate **Today's Lesson** (`"Start / Continue Unit"`). Demote `"Study Guide"` to a secondary outline button.
- **Clean Header**: Consolidate greeting, level, and offline indicator into a compact, unified row.
- **Remove Redundant Links**: Remove the bottom full-width "Specialist Curricula" button (specialist curricula live inside the **Learn** tab).

### 4.2 Practice & Review Hub (`SkillExerciseHub.tsx`)

- **Intelligent Review Default**: Replace manual batch-size radio buttons (5, 10, 15, 20) with an intelligent default **"Smart Review (10 words)"** primary CTA and a secondary "Custom size" popover.
- **Plain Language**:
  - _"Minimal Pair Acoustic Discrimination"_ → **"Spot the Sound Difference"** / **"ميّز الفرق الصوتي"**
  - _"Controlled Production / Cloze"_ → **"Fill in the Blank"** / **"أكمل الفراغ"**
  - _"Retrieval Practice"_ → **"Quick Recall"** / **"تذكّر الكلمة"**
- **Modality Badges**: Add clean visual badges (`Listening`, `Speaking`, `Reading`, `Writing`) and realistic duration estimates (e.g. `~3 min`).

### 4.3 Curriculum Browser (`LearningPath.tsx`)

- **Sticky CEFR Quick-Switcher**: Sticky horizontal segmented pill bar (`A1`, `A2`, `B1`, `B2`, `C1`) at the top of the path allowing instant jumping to active levels without scrolling through 200 units.
- **Unified Progress Trail**: Connect units with a clean visual trail clearly indicating states (_Locked_, _Active_, _Mastered_).

### 4.4 Study Guide (`LearningMaterialsScreen.tsx`)

- Replace 6 simultaneous secondary tabs with a clear, step-by-step linear walkthrough.

---

## 5. Non-Negotiable Guardrails Verification

- **WCAG 2.2 Level AAA**: 7:1 contrast on all normal text, 44×44px touch targets, visible focus indicators, `prefers-reduced-motion` backstop.
- **Cloudflare R2 Safety**: Read-only R2 access; no media references modified or deleted.
- **Verification Gates**:
  1. `npx tsc --noEmit` — 0 errors
  2. `npx vitest run` — all unit & component tests green
  3. `pnpm run lint` — 0 ESLint / a11y errors
  4. `npx playwright test` — E2E release gate green

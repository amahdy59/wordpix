# Implementation Plan: Typography, Responsiveness, and Cognitive Decluttering

- **Target Version**: v0.1.37
- **Architecture Spec**: `docs/DESIGN_TYPOGRAPHY_RESPONSIVENESS_POLISH.md`
- **Verification Gate**: `typecheck` -> `test` -> `lint` -> `test:e2e`

---

## Task Breakdown

### Phase 1: Typography & Variable Font Pipeline

#### Task 1: Install & Wire Self-Hosted Variable Fonts

- **Files Touched**:
  - `package.json`
  - `src/styles/fonts.css` (New)
  - `src/styles/theme.css`
  - `index.html`
- **Step 1**: Install `@fontsource-variable/inter` and `@fontsource-variable/noto-sans-arabic` as devDependencies.
- **Step 2**: Create `src/styles/fonts.css` importing the variable font stylesheets from `@fontsource-variable`.
- **Step 3**: Preload the primary WOFF2 files in `index.html` with `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- **Step 4**: Verify Vite build bundling and zero missing font paths (`pnpm run build`).
- **Step 5**: Commit atomically: `feat(typography): self-host Inter and Noto Sans Arabic variable fonts`.

#### Task 2: Implement Canonical Typographic Classes & Arabic Rules

- **Files Touched**:
  - `src/styles/globals.css`
  - `src/styles/theme.css`
- **Step 1**: In `theme.css` and `globals.css`, declare the canonical type utility classes:
  - `.wp-type-display`, `.wp-type-h1`, `.wp-type-h2`, `.wp-type-h3`, `.wp-type-body`, `.wp-type-body-sm`, `.wp-type-caption`.
- **Step 2**: Enforce RTL typography rules:
  - `[dir="rtl"] { line-height: 1.65; letter-spacing: 0 !important; }`
- **Step 3**: Enforce `font-variant-numeric: tabular-nums` on timer, counter, and streak utilities.
- **Step 4**: Write automated test in `src/app/__tests__/typography_system.test.ts` asserting font family fallbacks and CSS custom properties.
- **Step 5**: Run `npx vitest run src/app/__tests__/typography_system.test.ts` to confirm green.
- **Step 6**: Commit atomically: `feat(typography): add canonical type scale and Arabic ligature line-height rules`.

---

### Phase 2: Responsive Shell & Lesson Focus Mode

#### Task 3: Build Anchored `LessonActionDock` Component

- **Files Touched**:
  - `src/app/shared/LessonActionDock.tsx` (New)
  - `src/app/__tests__/lesson_focus_shell.test.tsx` (New)
- **Step 1**: Write test in `lesson_focus_shell.test.tsx` for `LessonActionDock` asserting audio repeat button, step counter, and primary CTA rendering with correct accessible labels.
- **Step 2**: Verify test fails (red).
- **Step 3**: Implement `LessonActionDock.tsx` with `min-h-[48px]` button, `env(safe-area-inset-bottom)` padding, and sticky bottom docking.
- **Step 4**: Verify test passes (green).
- **Step 5**: Commit atomically: `feat(shell): create anchored LessonActionDock for focused drill mode`.

#### Task 4: Integrate Lesson Focus Mode in RouterView & AppShell

- **Files Touched**:
  - `src/app/router/RouterView.tsx`
  - `src/app/shared/AppShell.tsx`
- **Step 1**: In `RouterView.tsx`, ensure `BottomTabBar` is suppressed on active study/drill routes (`lesson`, `learning-materials`, `figma-pronunciation-lesson`, `skill-exercise`, `hadith-lesson`, `conversation-lesson`, `business-lesson`).
- **Step 2**: Ensure safe-area and `dvh` wrappers are consistently applied.
- **Step 3**: Run `npx vitest run src/app/__tests__/lesson_focus_shell.test.tsx` to confirm green.
- **Step 4**: Commit atomically: `feat(shell): enable lesson focus mode and hide global bottom nav in drills`.

---

### Phase 3: Screen-by-Screen Cognitive Decluttering

#### Task 5: Declutter Home Dashboard (`HomeDashboard.tsx`)

- **Files Touched**:
  - `src/app/core/HomeDashboard.tsx`
  - `src/app/__tests__/home_dashboard_ui.test.tsx` (Update if needed)
- **Step 1**: Relocate `ReleaseNotesCard` from the main scroll feed into a compact "What's New" pill button in the top header.
- **Step 2**: Establish single lead action:
  - If reviews are due, lead with Daily SRS Review card.
  - If caught up, lead with Today's Lesson with a single primary CTA ("Start / Continue"), demoting "Study Guide" to a secondary outline button.
- **Step 3**: Soften `font-black` headings to `font-bold` and apply `.wp-type-*` tokens.
- **Step 4**: Remove redundant bottom full-width "Specialist Curricula" button.
- **Step 5**: Run tests: `npx vitest run src/app/__tests__/responsive_layout.test.ts`.
- **Step 6**: Commit atomically: `refactor(home): declutter dashboard layout, relocate release notes, and soften typography`.

#### Task 6: Streamline Practice Tab & Remove Jargon (`SkillExerciseHub.tsx`)

- **Files Touched**:
  - `src/app/core/SkillExerciseHub.tsx`
  - `src/i18n/en.json`
  - `src/i18n/ar.json`
- **Step 1**: Replace manual batch-size radio buttons with "Smart Review (10 words)" CTA.
- **Step 2**: Replace academic terminology in `en.json` and `ar.json`:
  - "Spot the Sound Difference" / "ميّز الفرق الصوتي"
  - "Fill in the Blank" / "أكمل الفراغ"
  - "Quick Recall" / "تذكّر الكلمة"
- **Step 3**: Add modality badges (`Listening`, `Speaking`, `Reading`, `Writing`) and realistic duration tags.
- **Step 4**: Run tests: `npx vitest run src/app/__tests__/skill_exercise_hub.test.tsx`.
- **Step 5**: Commit atomically: `refactor(practice): simplify review CTA, eliminate jargon, and add modality badges`.

#### Task 7: Sticky CEFR Quick-Switcher on LearningPath (`LearningPath.tsx`)

- **Files Touched**:
  - `src/app/core/LearningPath.tsx`
- **Step 1**: Add sticky horizontal segmented pill bar (`A1`, `A2`, `B1`, `B2`, `C1`) at the top of the curriculum path to jump to active levels.
- **Step 2**: Clean up milestone node trail visual connection and soften heading typography.
- **Step 3**: Run tests: `npx vitest run src/app/__tests__/curriculum_*.test.ts*`.
- **Step 4**: Commit atomically: `feat(curriculum): add sticky CEFR quick-switcher and clean milestone trail`.

---

### Phase 4: Full Quality Gates & Release Notes

#### Task 8: Verification & Release Publishing

- **Files Touched**:
  - `src/app/data/releaseNotes.json`
  - `public/release-notes.json`
- **Step 1**: Run `npx tsc --noEmit` (0 type errors).
- **Step 2**: Run `npx vitest run` (all unit & component tests green).
- **Step 3**: Run `pnpm run lint` (0 lint / a11y errors).
- **Step 4**: Run `npx playwright test e2e/smoke.spec.ts e2e/accessibility.spec.ts`.
- **Step 5**: Update `releaseNotes.json` with bilingual release entry for v0.1.37.
- **Step 6**: Commit atomically: `chore(release): publish v0.1.37 with typography, focus shell, and cognitive decluttering`.

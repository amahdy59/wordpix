# Architecture Decision Records (ADR) — WordPix

## ADR 001: Project Scope & Core Purpose
- **Date**: 2026-07-28
- **Single Job Statement**: Provide an interactive, visual-first English vocabulary learning experience for adult Arabic speakers.
- **Target Persona**: Adult Arabic-speaking language learners seeking practical, context-based vocabulary, scene exploration, and real-world conversation exercises.

---

## ADR 002: Streamlined Adult Onboarding Flow
- **Decision**: Remove age-selection screen from the onboarding sequence.
- **Onboarding Sequence**: `Splash` → `Language Selection` → `Interests Selection` → `Ready Celebration`.
- **Rationale**: Adult learners prefer direct, respectful onboarding without child-oriented age profiling.

---

## ADR 003: Responsive Multi-Device Layout Strategy
- **Decision**: Mobile-first layout with dedicated tablet and desktop enhancements.
  - **Mobile (<768px)**: Bottom navigation bar, full-width cards, compact headers.
  - **Tablet (768px–1024px)**: Collapsible navigation sidebar, two-column grid layouts.
  - **Desktop (1024px+)**: Full expanded navigation sidebar, split-screen interactive scene canvas with side-by-side vocabulary panel.

---

## ADR 004: State Management Strategy
- **Decision**: Centralized top-level state machine via `useReducer` in `App.tsx` for screen transitions (`Screen` and `Action` types), combined with localized component state (`useState`) for exercise transient states.

---

## ADR 005: Design Tokens & Styling Architecture
- **Decision**: Tailwind CSS v4 `@theme inline` bridge in `src/styles/theme.css` backed by semantic CSS custom properties (`--wp-brand`, `--wp-surface`, `--wp-card`, `--wp-text`).
- **Typography Rule**: Only two fonts permitted across the application:
  - `Inter` (`var(--wp-font-base)`) for English UI and body text.
  - `Noto Sans Arabic` (`var(--wp-font-arabic)`) for all Arabic copy.

---

## ADR 006: Bilingual & RTL First-Class Support
- **Decision**: All Arabic text elements must explicitly include `dir="auto"`, `lang="ar"`, and `font-arabic`. Logical CSS properties (`margin-inline-start`, `padding-inline`) are preferred over hardcoded physical properties.

---

## ADR 007: Error Boundaries & Graceful Degradation
- **Decision**: Wrap root screens in a React Error Boundary (`src/app/shared/ErrorBoundary.tsx`) to catch unexpected component render exceptions without crashing the entire app.

# WordPix Agent Guide

## Project Baseline

WordPix is an accessible, bilingual, gamified visual English learning application
targeting adult English learners (A1–C1). It is a **single-page app** (no Next.js
SSR) built on React + TypeScript + Tailwind 4 + Supabase.

## Non-Negotiable Guardrails

### Accessibility — WCAG 2.2 AAA

Commit to full **WCAG 2.2 Level AAA**. Do not claim conformance without a
criterion-by-criterion audit. Minimum required on every change:

- 7:1 contrast ratio for normal text (AAA 1.4.6)
- 44 × 44 px minimum touch targets (AAA 2.5.5)
- Visible focus indicators that pass AAA 2.4.12 (≥2 px, 3:1 contrast against adjacent colour)
- Programmatic screen-reader labels on every interactive element
- No motion without `prefers-reduced-motion` guard

### Media & R2 Asset Safety — HARD CONSTRAINT

> **No agent task may ever touch, delete, rename, re-upload, or modify the
> mapping between content IDs and audio/image URLs stored in Cloudflare R2.**
> All R2 references are **read-only** during the modernisation work. Violating
> this constraint corrupts live learner data.

### Aesthetics

Premium modern design system using semantic design tokens, clean typography,
responsive layouts. No raw hex values in JSX; use design tokens only.

### Data Integrity

Never introduce broken state or fake 0-byte fallbacks. Preserve existing state
machines and TypeScript types. Progress data is keyed by unit ID — never by
position or array index.

### Verification (mandatory before declaring done)

Run in order; fix failures before moving on:

1. `npx tsc --noEmit` — zero type errors
2. `npx vitest run` — all tests green
3. `pnpm run lint` — no new ESLint/jsx-a11y errors

## Product Decisions (locked)

- **Navigation**: 5 tabs — Home · Learn · Practice · Library · Profile
- **Curriculum**: `LearningPath` is the single curriculum browser (200 units,
  A1→C1 order defined in `src/app/data/curriculumSequence.ts`). `ExploreWorlds`
  is retired. The `Library` tab is a pure reference/search tool.
- **Special curricula**: Pronunciation, Hadith, Conversation, Business appear as
  course cards under the Learn tab — they are NOT merged into the vocabulary path.
- **Practice tab**: leads with "Reviews due today", then "Practice by skill".
  `review` is not a top-level tab.
- **Child mode**: removed. WordPix is adult-focused. Child-mode architecture is
  dormant and being retired.
- **CEFR model**: full A1–C2 scale, done accurately with references.

## Guidance Documents

Detailed production guidance docs are located in [`docs/`](docs/):

- [`docs/00_README_FIRST.md`](docs/00_README_FIRST.md) — How to use the guidance pack, status labels, and core references.
- [`docs/01_PRODUCT_CONTEXT_AND_NON_NEGOTIABLES.md`](docs/01_PRODUCT_CONTEXT_AND_NON_NEGOTIABLES.md) — Product promise, adult learner focus, core loop, and non-negotiable guardrails.
- [`docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md`](docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md) — WCAG 2.2 AAA targets, contrast ratios, keyboard navigation, focus management, and accessibility release blockers.
- [`docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md`](docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md) — Core UX principles (recognition over recall, one clear next action), Universal Design for Learning (UDL), and gamification rules.
- [`docs/04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md`](docs/04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md) — Token architecture, theme modes, color contrast, typography, spacing, motion tokens, and Figma-to-code mapping.
- [`docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md`](docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md) — Native-first rule, complete state matrix, buttons/links/forms/dialogs rules, live regions, progress types, and UI copy guidelines.
- [`docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md`](docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md) — Domain-oriented structure, dependency directions, state ownership, runtime validation, and explicit state machines.
- [`docs/07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md`](docs/07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md) — Strict TypeScript baseline, naming conventions, React-specific quality rules, complexity management, dependency policy, and PR checklist.
- [`docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md`](docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md) — Offline-first persistence, local data taxonomy, mutation queue, sync state machine, conflict policies, and guest migration rules.
- [`docs/09_SECURITY_PRIVACY_AUTHENTICATION_AND_AUTHORIZATION.md`](docs/09_SECURITY_PRIVACY_AUTHENTICATION_AND_AUTHORIZATION.md) — Security baseline (OWASP ASVS Level 2), data classification, Supabase RLS policies, input sanitization, and secret redaction.
- [`docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md`](docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md) — Layered testing strategy, unit/integration/E2E priorities, manual accessibility protocol, flaky-test policy, and release QA matrix.
- [`docs/11_ANALYTICS_OBSERVABILITY_AND_ERROR_HANDLING.md`](docs/11_ANALYTICS_OBSERVABILITY_AND_ERROR_HANDLING.md) — Governed event schemas, privacy rules (no raw text/emails), learning quality metrics, error taxonomy, structured logging, and user-facing error guidance.
- [`docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md`](docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md) — Environments, branch/review policy, CI pipeline order, database expand-and-contract migrations, feature flag rules, release readiness gates, and Definition of Done.
- [`docs/13_REFERENCE_STACK_PROFILE_REACT_NEXT_TAILWIND_SUPABASE.md`](docs/13_REFERENCE_STACK_PROFILE_REACT_NEXT_TAILWIND_SUPABASE.md) — Reference stack profile for React, TypeScript, Tailwind 4, Untitled UI v8, Supabase RLS, IndexedDB, and SPA boundaries.
- [`docs/14_CODING_AGENT_TASK_TEMPLATES.md`](docs/14_CODING_AGENT_TASK_TEMPLATES.md) — Standardized task templates (Features, Bugs, Components, Refactoring, Accessibility, Offline/Sync, Completion Requests, and Code Reviews).
- [`docs/ADR.md`](docs/ADR.md) — Architecture Decision Records.

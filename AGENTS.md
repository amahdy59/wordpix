# WordPix Agent Guide

## Project Baseline
WordPix is an accessible, bilingual, gamified visual English learning application.

## Non-Negotiable Guardrails
- **Accessibility**: Enforce WCAG 2.2 AAA standards (7:1 normal text contrast, 44x44px touch targets, visible focus indicators, screen reader labels).
- **Aesthetics**: Premium modern design system using semantic design tokens, clean typography, responsive layouts.
- **Data Integrity**: Never introduce broken state or fake 0-byte fallbacks. Preserve existing state machines & types.
- **Verification**: All changes must be verified with `npx tsc --noEmit` and `npx vitest run`.

## Guidance Documents
Detailed production guidance docs are located in `docs/`:
- [`docs/00_README_FIRST.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/00_README_FIRST.md) — How to use the guidance pack, status labels, and core references.
- [`docs/01_PRODUCT_CONTEXT_AND_NON_NEGOTIABLES.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/01_PRODUCT_CONTEXT_AND_NON_NEGOTIABLES.md) — Product promise, learner modes (child/adult), core loop, and non-negotiable guardrails.
- [`docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md) — WCAG 2.2 baseline, contrast targets (7:1 normal text), keyboard navigation, focus management, and accessibility release blockers.
- [`docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md) — Core UX principles (recognition over recall, one clear next action), Universal Design for Learning (UDL), child/adult modes, and gamification rules.
- [`docs/04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md) — Token architecture, theme modes, color contrast, typography, spacing, motion tokens, and Figma-to-code mapping.
- [`docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md) — Native-first rule, complete state matrix, buttons/links/forms/dialogs rules, live regions, progress types, and UI copy guidelines.
- [`docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md) — Domain-oriented structure, dependency directions, state ownership, runtime validation, and explicit state machines.
- [`docs/07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md) — Strict TypeScript baseline, naming conventions, React-specific quality rules, complexity management, dependency policy, and PR checklist.
- [`docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md) — Offline-first persistence, local data taxonomy, mutation queue, sync state machine, conflict policies, and guest migration rules.
- [`docs/09_SECURITY_PRIVACY_AUTHENTICATION_AND_AUTHORIZATION.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/09_SECURITY_PRIVACY_AUTHENTICATION_AND_AUTHORIZATION.md) — Security baseline (OWASP ASVS Level 2), data classification, Supabase RLS policies, input sanitization, and secret redaction.
- [`docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md) — Layered testing strategy, unit/integration/E2E priorities, manual accessibility protocol, flaky-test policy, and release QA matrix.
- [`docs/11_ANALYTICS_OBSERVABILITY_AND_ERROR_HANDLING.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/11_ANALYTICS_OBSERVABILITY_AND_ERROR_HANDLING.md) — Governed event schemas, privacy rules (no raw text/emails), learning quality metrics, error taxonomy, structured logging, and user-facing error guidance.
- [`docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md) — Environments, branch/review policy, CI pipeline order, database expand-and-contract migrations, feature flag rules, release readiness gates, and Definition of Done.
- [`docs/ADR.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/ADR.md) — Architecture Decision Records.

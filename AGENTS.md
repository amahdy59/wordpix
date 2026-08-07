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
- [`docs/ADR.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/ADR.md) — Architecture Decision Records.

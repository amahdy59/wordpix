# WordPix Agent Guide

## Project Baseline
WordPix is an accessible, bilingual, gamified visual English learning application.

## Non-Negotiable Guardrails
- **Accessibility**: Enforce WCAG 2.2 AAA standards (min font 16px, 44x44px touch targets, visible focus indicators, screen reader labels).
- **Aesthetics**: Premium modern design system using semantic design tokens, clean typography, responsive layouts.
- **Data Integrity**: Never introduce broken state or fake 0-byte fallbacks. Preserve existing state machines & types.
- **Verification**: All changes must be verified with `npx tsc --noEmit` and `npx vitest run`.

## Guidance Documents
Detailed production guidance docs are located in `docs/`:
- [`docs/00_README_FIRST.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/00_README_FIRST.md) — How to use the guidance pack, status labels, and core references.
- [`docs/ADR.md`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/docs/ADR.md) — Architecture Decision Records.

---
name: webapp-testing
description: WordPix testing strategy — Vitest unit/component, Testing Library a11y queries, MSW mocks, fake-indexeddb, coverage.
metadata:
  category: testing
  upstream: global webapp-testing
---

# Webapp Testing (WordPix)

Use when writing, improving, or reviewing automated tests.

## 1. Pyramid (WordPix stack)

1. Unit (Vitest, `happy-dom`, globals on): pure functions, utilities, domain logic, hooks. `VITE_ASSET_BASE_URL=""` in tests — never hit live CDN.
2. Component (Testing Library + `user-event`): user interaction, conditional rendering, form validation, Loading/Error/Empty/Success states. Query by role + accessible name (`getByRole('button', { name: /submit/i })`), never CSS classes or test IDs.
3. API mocking (MSW v2): mock at network boundary; default happy-path handlers, per-test overrides for error/edge cases.
4. Persistence (fake-indexeddb): IndexedDB + mutation-queue tests run offline-first.
5. E2E (Playwright, `e2e/`): full workflows on Chromium + Pixel 5. Excluded from Vitest (`vitest.config.ts` excludes `e2e/**`, `tests/**`).

## 2. Rules

- Assert outcomes + accessibility tree, never internals (state vars, private methods).
- No `sleep()`; use `waitFor()` / Playwright auto-retrying assertions.
- Always cover Loading, Error, Empty, Success for components.
- Never delete/`.skip` failing tests to go green.
- Coverage: `npx vitest run --coverage` (requires `@vitest/coverage-v8`).

## 3. Commands

- `npx vitest run` — unit/integration
- `npx vitest run --coverage` — with coverage thresholds
- `pnpm run test:e2e` — Playwright (only when touching covered user flows)

## References

- `docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md`
- `vitest.config.ts`, `src/test/setup.ts`
- `.agents/skills/verify/SKILL.md`
- `.agents/skills/playwright-generate-test/SKILL.md`

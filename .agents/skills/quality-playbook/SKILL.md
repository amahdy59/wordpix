---
name: quality-playbook
description: Engineering quality gates for WordPix — strict TypeScript, flat ESLint, zero-regression checklist, performance budgets, and pre-merge standards.
metadata:
  category: quality
  upstream: global quality-playbook
---

# Quality Playbook (WordPix — Code + Performance Efficiency)

Use when preparing PRs, refactoring, or establishing engineering baselines.

## 1. Pre-Merge Verification Gates

Every change must pass, in order:

1. Format: `npx prettier --check .`
2. Lint: `pnpm run lint` (includes `jsx-a11y`, `react-hooks`, `i18next/no-literal-string`)
3. Typecheck: `npx tsc --noEmit` (strict, no `any`)
4. Unit/Integration: `npx vitest run`
5. Build: `pnpm run build`
6. Perf budget: `dist/` total JS stays within `vite.config.ts` `chunkSizeWarningLimit: 600` per chunk; vendor splits (`vendor-react`, `vendor-motion`, `vendor-icons`, `vendor-query`, `vendor-storage`, `vendor-i18n`) must not regress. Analyze with `npx vite-bundle-visualizer` when adding deps.

## 2. Zero-Regression Mindset

- Bug fix first: write a failing test reproducing the bug, verify it fails, fix, verify it passes, confirm no other tests broke.
- Never delete/`.skip` a failing test to go green; fix root cause or report blocker.
- No unrelated formatting/refactors in the same diff.

## 3. Code-Efficiency Rules

- Strict TypeScript: discriminated unions over boolean-flag bags; exhaustive `never` checks (see `poka-yoke` skill).
- Zod at every network/persistence boundary; never trust external payloads.
- React: memoize only with measured need; colocate state; avoid prop drilling via domain-owned state (`docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md`).
- No new runtime deps unless repo utils cannot solve it — explain in PR.

## 4. Performance-Efficiency Rules

- Reuse existing `manualChunks` splits; lazy-load lesson/lexicon data (`lexicon-dictionary`, `course-lessons` chunks).
- Images/audio via compressed R2 assets; never commit 0-byte fallbacks.
- Animations via `framer-motion` with reduced-motion support; avoid layout-thrashing CSS.

## References

- `docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md`
- `docs/07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md`
- `docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md`
- `.agents/skills/verify/SKILL.md`
- `.agents/skills/poka-yoke/SKILL.md`

---
name: verify
description: WordPix verification workflow - run typecheck, unit tests, lint, and E2E before declaring any change complete
metadata:
  category: quality
---

# Verify Changes

Use this skill before declaring any WordPix task complete. This project's definition of done is verification-driven; never say "done" without running the ladder.

## Verification Ladder

Run in order. Fix failures before moving on.

1. `npx tsc --noEmit` — zero type errors (strict TypeScript baseline)
2. `npx vitest run` — unit + integration tests pass
3. `pnpm run lint` — no new ESLint errors (includes jsx-a11y and react-hooks rules)
4. `pnpm run test:e2e` — only if you touched a user-facing flow covered by `e2e/`

## Scope Rules

- Small refactors: ladder steps 1–3.
- UI/feature work: steps 1–3 plus related E2E spec or an axe-core pass.
- Release/deploy work: also `pnpm run verify:prepush` and `pnpm run check:doctor`.

## Notes

- Vitest uses `happy-dom`, global test APIs, and path aliases (`@/`, `@app/`, `@features/`, `@shared/`, `@i18n/`, `@utils/`) — see `vitest.config.ts`.
- Unit tests must not hit live assets: `VITE_ASSET_BASE_URL` is deliberately empty in tests.
- E2E lives in `e2e/` (desktop Chrome + Pixel 5), excludes itself from Vitest.
- Never delete or `.skip` a failing test to make the ladder green; fix the root cause or explain the blocker to the user.

## References

- `docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md` — testing strategy
- `docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md` — release gates

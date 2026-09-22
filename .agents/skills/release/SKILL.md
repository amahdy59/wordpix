---
name: release
description: WordPix release workflow - prepush verification, deploy to main, and live deployment checks
metadata:
  category: deployment
---

# Release / Ship Workflow

Use this skill when asked to ship, deploy, or release WordPix.

## Critical Context

- `main` auto-deploys. `pnpm run ship` = push to origin main, then watch the deployment.
- Pushing to `main` IS a production deploy — finish the full verification ladder first.

## Release Checklist

1. Verification ladder green: `npx tsc --noEmit`, `npx vitest run`, `pnpm run lint`.
2. `pnpm run verify:prepush` — the same gate as the pre-push hook.
3. Commit, then push (or `pnpm run ship` to watch the rollout).
4. `pnpm run check:deploy` — confirm the live deployment picked up the change.
5. If anything looks off: `pnpm run check:doctor`, and `pnpm run doctor:fix` for auto-fixable issues.

## Rules

- Never bypass hooks with `--no-verify` unless the user explicitly accepts the risk.
- Do not push when unrelated local changes are in the working tree; ship exactly what was verified.

## References

- `docs/12_CICD_RELEASE_GATES_AND_DEFINITION_OF_DONE.md` — release gates and DoD
- `docs/17_RELEASE_READINESS_AND_LEARNER_PILOT.md` — release readiness

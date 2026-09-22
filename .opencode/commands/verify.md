---
description: Run the WordPix verification ladder before declaring done
---

Run the verify skill ladder on: $ARGUMENTS.

1. npx tsc --noEmit, 2. npx vitest run, 3. pnpm run lint, 4. pnpm run test:e2e only if a covered user flow changed. For release work also pnpm run verify:prepush and pnpm run check:doctor. Fix failures before moving on. Report exact commands and results, unrun checks, and limitations. Do not claim completion with an unverified check.

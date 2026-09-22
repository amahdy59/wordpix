---
name: poka-yoke
description: Mistake-proofing software architecture for WordPix. Making invalid states unrepresentable through strict typing and runtime guards.
metadata:
  category: quality
  upstream: global poka-yoke
---

# Poka-Yoke (WordPix — Code Efficiency)

Use when modeling domain entities, designing APIs, or eliminating runtime errors.

## 1. Invalid States Unrepresentable

```ts
// BAD: allows { isLoading: false, data, error } simultaneously
interface RequestState<T> {
  isLoading: boolean;
  error?: string;
  data?: T;
}

// GOOD: discriminated union — compiler rejects impossible combos
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

Apply to: sync state machine (`idle|pending|error|offline`), lesson/session states, auth states. See `docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md`.

## 2. Exhaustive Checking

```ts
function assertUnreachable(x: never): never {
  throw new Error(`Unhandled variant: ${String(x)}`);
}
```

Every `switch` over a union must end with `assertUnreachable`. `@typescript-eslint/no-explicit-any` is `error` — no escape hatches.

## 3. Runtime Boundaries

- Validate every external payload (Supabase, IndexedDB, R2 manifests, lesson JSON) with Zod at the boundary.
- Normalize + merge through existing boundaries; never write raw network data to stores.
- Preserve existing state machines & types — extend, don't rewrite.

## References

- `docs/06_FRONTEND_ARCHITECTURE_AND_CODE_STRUCTURE.md`
- `docs/07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md`
- `docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md`

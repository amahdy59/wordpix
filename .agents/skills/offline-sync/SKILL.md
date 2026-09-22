---
name: offline-sync
description: Offline-first data rules - IndexedDB persistence, mutation queue, sync state machine, and guest migration for WordPix
metadata:
  category: architecture
---

# Offline-First State & Sync

Use this skill when working on persistence, progress tracking, sync, or Supabase-backed data (`idb`, React Query, mutation queue).

## Key Facts

- Local persistence uses IndexedDB via the `idb` package; unit tests run against `fake-indexeddb`.
- React Query owns server state; IndexedDB owns offline local state.
- Local data taxonomy, mutation queue, sync state machine, and conflict policies are defined in `docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md`.
- Progress/lesson state machines are explicit and typed — preserve their states and transitions.

## Non-Negotiables

- Never introduce broken state or fake 0-byte fallbacks.
- Never clear or lose user progress during schema changes; use expand-and-contract migrations.
- Guest data must remain migratable to an authenticated account (guest migration rules in docs/08).
- Do not invent conflict policies ad hoc; follow the documented policy per data type.

## Instructions

1. Map the change onto the existing state machines before editing.
2. When adding a mutation type, update both the persistence and sync tests.
3. Keep tests hermetic (`fake-indexeddb`, no live Supabase) and run `npx vitest run`.
4. Security and RLS constraints: `docs/09_SECURITY_PRIVACY_AUTHENTICATION_AND_AUTHORIZATION.md`.

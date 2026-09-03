# Verification gaps — 2026-09-03

Status: local changes; not committed, pushed, or deployed.

## Verified locally

- Study practice E2E now opens the actual Bathroom practice activity and requires answer controls, submitted-answer state, and retained keyboard focus. It no longer passes when practice is missing. Axe scans the same activity.
- Unit tests do not inherit the live audio CDN from `.env.local`. The Settings loading tests isolate playback and cover loading failure and retry.
- Settings reports vocabulary loaded for this visit rather than claiming that audio, images, and study guides are available offline.
- Audio caching uses a fresh CORS request after streamed playback. The service worker does not return an opaque media response to a CORS fetch and respects explicit reload requests. Empty blobs are not cached.
- The real CDN clip played, nonempty bytes persisted in IndexedDB, and the local application replayed the clip from a blob URL after reload with networking disabled. This was a Chromium check of the local build served under the production origin, with service workers blocked to distinguish IndexedDB from HTTP/worker caching. Worker response selection has separate regression tests.
- Profile already uses `AuthModal` for email/password sign-in. Removed the unused no-op context method. Controlled tests cover successful login sequencing, rejected credentials with input preservation, and signup requiring email confirmation. Signup without a session no longer attempts migration or reloads away from the confirmation message.

## Checks

- `npx tsc --noEmit`
- `npx vitest run`: 2,040 tests / 61 files.
- `npx playwright test --reporter=line`: 14 tests across desktop and mobile Chromium.
- Production build passes; existing large-chunk warnings remain.
- Scoped ESLint: no errors; existing localization warnings remain.
- Browser audio check, with a preview running on port 4173:

```sh
node scripts/verify_audio_offline.mjs https://amahdy59.github.io/wordpix/ http://localhost:4173/wordpix/
```

The second URL supplies local application files; browser origin and CDN requests use the first URL. This does not publish anything. Omit the second URL to check the deployed application after release. This check proves cached-clip replay, not offline navigation of the entire curriculum or every audio clip.

## Still open before account release

The owner confirmed there is no Supabase test project/account yet. Live sign-in, email confirmation, authorization, recovery, and guest synchronization cannot be certified with mocked responses.

`src/lib/persistence/sync.ts` needs a separate migration hardening pass before accounts are enabled:

- `migrateGuestToAccount` reads/writes `local_user`, whereas current persistence uses `LEARNER_STATE_KEY` (`primary_state`).
- The additive remote/local XP merge needs protection against repeat login and interrupted retries.
- Migration upserts need their returned errors checked; the modal currently logs migration failure and proceeds to reload.

These were identified by inspection, not validated against a backend. The sign-in tests intentionally mock migration and do not certify its data integrity. Simply correcting the key would activate the existing non-idempotent merge; do not enable that path without the accompanying migration design and tests.

## External configuration

Production-origin direct audio fetch succeeds. The tested localhost preview origin is rejected by the bucket. Reading the bucket CORS configuration with the available credentials returns 403 AccessDenied, so no bucket policy was modified. Development-origin CORS needs a bucket administrator if direct localhost playback/caching is required.

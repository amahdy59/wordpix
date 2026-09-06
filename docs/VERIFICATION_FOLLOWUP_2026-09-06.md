# Verification follow-up — 6 September 2026

## Completed

- Updated `scripts/verify_audio_offline.mjs` for the current vocabulary grid. The check uses an isolated guest browser context, blocks service workers, and verifies CDN playback, nonempty IndexedDB audio, playback from a persisted blob after reload with the network disabled, and preservation of a study status changed offline after reconnecting and reloading. All three checks passed against production at `7f6409b5`.
- Completed Kitchen's remaining Apple and Juice definitions after inspecting both images. The unit now has no placeholder definitions. Course-wide placeholder debt fell from 11,340 to 11,338 across 197 units. No audio was generated.
- Deferred the Review screen through the router's existing lazy-loading and Suspense boundary. This removes the dictionary from the initial HTML preload list: 1,635.22 kB minified / 416.37 kB gzip deferred until a route needs it. The dictionary remains available to Review and study screens. Desktop and mobile browser tests verify that Explore does not request it and Review subsequently does.
- Added the public Supabase URL and anonymous client key repository variables to the Pages build environment. This wiring does not configure or provision a backend by itself.

## Verification

- `npx tsc --noEmit`: passed.
- `npx vitest run`: 66 files, 2,074 tests passed.
- Production build: passed; large dictionary and course catalogue warnings remain. Deferring a bundle changes when it loads, not its total size.
- Full Playwright suite: 38 tests passed on desktop and mobile.
- Live guest audio/offline status recovery: passed.
- Build sizes and observed browser requests are evidence of deferred loading, not measured improvements to LCP or other Core Web Vitals. Chrome DevTools tracing is unavailable in this session.

## Backend-dependent verification

The live entry bundle still contains `https://placeholder.supabase.co`; `.env.local` also lacks configured Supabase client values. Successful live sign-in, guest migration to an account, and cross-device server sync remain unverified.

To close this gap:

1. Provide a dedicated Supabase test project and account with the project's migrations and RLS policies applied.
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository variables for the intended deployment environment. Only the public anonymous client key belongs here, never a service-role key. Keep local/staging tests separate from production credentials.
3. Redeploy and verify successful/rejected login, guest migration preserving progress, offline changes followed by reconnect, retry without duplicate progress, and cross-account isolation.

The guest checks above do not prove a cold offline app launch, account sync, or cross-device recovery.

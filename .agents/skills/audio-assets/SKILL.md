---
name: audio-assets
description: Audio corpus and R2 media asset workflows - generation scripts, upload, CORS, and verification for WordPix
metadata:
  category: tooling
---

# Audio & Media Asset Pipeline

Use this skill when generating, uploading, or verifying audio/media assets (R2, TTS corpus, thumbnails).

## Key Facts

- Assets are served from Cloudflare R2 via `VITE_ASSET_BASE_URL`; CORS is managed by `scripts/setup_r2_cors.cjs`.
- Unit tests deliberately run with `VITE_ASSET_BASE_URL` empty; `scripts/verify_audio_offline.mjs` checks the real playback/caching path.
- Foundations audio has its own corpus scripts (`audio:foundations:*`).

## Common Commands

- `pnpm run audio:plan` — dry-run list of what needs generating
- `pnpm run audio:generate` — generate audio (costs API calls)
- `pnpm run audio:reconcile` — reconcile missing/mismatched audio
- `pnpm run assets:upload` / `assets:verify` / `assets:cors` / `assets:cors:check` — R2 management
- `pnpm run audio:check:bucket` / `audio:check:lessons` / `audio:check:words` — audits

## Instructions

1. Always dry-run first (`audio:plan` or `--dry-run`) before bulk generation — it incurs API cost.
2. After any upload, run `pnpm run assets:verify` to confirm remote state.
3. Never commit generated media into the repo; media lives in R2.
4. `pnpm run build` regenerates group thumbnails (`scripts/build_group_thumbnails.mjs`) before bundling.

## References

- `docs/AUDIO_PHASE_2_PLAN.md`
- `docs/VOCABULARY_DEFINITION_STANDARD.md`

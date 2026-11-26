# HeyGen Audio Workflow & Multi-Agent Operations Guide

> **CRITICAL GUARDRAIL FOR ALL AGENTS & OPERATORS**:
>
> 1. **Zero-Deletion Policy**: NEVER delete, overwrite, rename, or purge any audio files in Cloudflare R2 or local directories (`output/recorded-audio/heygen/clips/`).
> 2. **Secondary Take Architecture**: HeyGen recordings are indexed in `src/app/generated/heygenRecordings/` (`audio/heygen-v1/nadine/<sha256>.mp3`) and exposed via the Settings `preferredVoice` option (`"primary"` default vs `"nadine"` secondary). Future expansion batches use `--secondary-only` so they **never override or replace** primary curriculum audio mappings (`additionalRecordings`, `edgeRecordings`, ElevenLabs, or explicit scenario takes).
> 3. **Idempotent Create-Only Operations**: All Cloudflare R2 uploads must use `putIfAbsent` (create-only). If a remote object exists, leave it unchanged.

---

## 1. Quick Reference & Operational Summary

- **Engine**: HeyGen Voice Turbo API (`https://api.heygen.com/v3/models/audio/tts`)
- **Model**: `heygen-voice-1-turbo-free`
- **Voice**: `83548de556df48ba8c09c42a57c51d85` (_Nadine_)
- **Auth**: `X-Api-Key` header with user HeyGen key from environment (`HEYGEN_API_KEY`)
- **Daily Usage Ceiling**: **2,000 requests per day** per API key workspace
- **Safety Circuit-Breaker**: The synthesis script enforces `--daily-limit=1950` by default to prevent triggering HTTP 429 (`rate_limit_exceeded`).

---

## 2. Naming Conventions & Content Addressing

All uploaded Cloudflare R2 audio files follow strict, deterministic, content-addressed naming:

```
Bucket Namespace:
audio/heygen-v1/nadine/<sha256(text)>.mp3
```

### Deterministic Key Derivation:

1. **Cloudflare R2 Object Key**:
   - Take exact spoken English text: `text`
   - Compute standard SHA-256 hex digest: `crypto.createHash('sha256').update(text, 'utf8').digest('hex')`
   - Prepend namespace: `audio/heygen-v1/nadine/${textHash}.mp3`
2. **App Shard Registration Key** (`additionalRecordings`):
   - Normalize text: replace curly quotes, trim, collapse whitespace.
   - Format payload: `en\0${normalizedText}`
   - Entry ID: `crypto.createHash('sha256').update(payload, 'utf8').digest('hex')`
   - Shard file: `src/app/generated/additionalRecordings/${entryId.slice(0, 2)}.json`
   - Value: `audio/heygen-v1/nadine/${textHash}.mp3`
3. **Preservation Rule**:
   - If a shard already contains an entry for that ID, the existing take is preserved and **not overwritten**.

---

## 3. Campaign Status & Multi-Day Batch Plan

Initial campaign: **5,960 audio clips** across curriculum batches, plus an ongoing site-wide expansion across Tiers 1–4 (**7,905 total published clips** to date).

| Batch                | Description                                          | Total Clips |         Status         | Receipt / Notes                                                       |
| :------------------- | :--------------------------------------------------- | :---------: | :--------------------: | :-------------------------------------------------------------------- |
| **Batch 1**          | Core Vocabulary & Contextual Sentences               |    1,761    | ✅ **Published to R2** | Completed                                                             |
| **Batch 2**          | Contextual Cloze Blanks (Part 1)                     |    1,323    | ✅ **Published to R2** | Completed (Receipt: `batch-02-publish-receipt.json`)                  |
| **Batch 3**          | Contextual Cloze Blanks (Part 2)                     |    1,322    | ✅ **Published to R2** | Completed (Receipt: `batch-03-publish-receipt.json`)                  |
| **Batch 4 (Part 1)** | Sentence Builder Chunks (First 543 clips)            |     543     | ✅ **Published to R2** | Completed                                                             |
| **Batch 4 (Part 2)** | Sentence Builder Chunks (Remaining 1,011 clips)      |    1,011    | ✅ **Published to R2** | Completed (Receipt: `batch-04-construction-all-publish-receipt.json`) |
| **Expansion Tier 1** | Core Tracks (`recordedReferenceExamples`, etc.)      |     929     |  🔄 **844 Published**  | 85 remaining                                                          |
| **Expansion Tier 2** | Specialist & Details (`recordedHadithContent`, etc.) |    8,339    | 🔄 **1,101 Published** | 7,238 remaining                                                       |
| **Expansion Tier 3** | Mid-frequency Exercises & Cloze Sentences            |   27,766    |     ⏳ **Queued**      | 27,766 remaining                                                      |
| **Expansion Tier 4** | Extended Curriculum & Long-tail Sentences            |   59,282    |     ⏳ **Queued**      | 59,282 remaining                                                      |
| **Published Total**  |                                                      |  **7,905**  |  **7,905 Published**   | **94,371 remaining across Tiers 1–4**                                 |

---

## 4. Campaign Completion & Resumption Reference

All **5,960 / 5,960** initial HeyGen (_Nadine_) clips across Batches 1–4 and **1,945** Tier 1–2 expansion clips (**7,905** total) have been synthesized, stored locally under `output/recorded-audio/heygen/clips/`, uploaded to Cloudflare R2 via create-only `putIfAbsent`, and registered in `src/app/generated/heygenRecordings/*.json` (with `--secondary-only` leaving `additionalRecordings/` untouched).

To resume site-wide expansion across Tiers 1–4 or add new curriculum units, re-run the idempotent workflow:

```powershell
# 1. Re-run batch synthesis (uses HEYGEN_API_KEY from environment; skips cached clips)
python scripts/synthesize_heygen_batch.py --batch=<batch-id> --limit=0 --delay=1.2

# 2. Upload any new clips to Cloudflare R2 (create-only putIfAbsent) into heygenRecordings only
node scripts/publish_heygen_batch.cjs --batch=<batch-id> --secondary-only

# 3. Format shards before updating coverage plan and reconciling R2
npx prettier --write src/app/generated/heygenRecordings/*.json
pnpm run audio:recordings:plan
node scripts/verify_recorded_audio.cjs --require-complete

# 4. Verify search index and shard integrity (0 deletions)
node scripts/build_search_index.mjs --check
```

---

## 5. Script Inventory & Utilities

| Script                                                                                                                                                                                                        | Purpose                                                                                                                 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| [`scripts/synthesize_heygen_batch.py`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/scripts/synthesize_heygen_batch.py)                                             | Synthesizes HeyGen clips, reuses local clips cross-batch, converts to MP3, and updates review player.                   |
| [`scripts/publish_heygen_batch.cjs`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/scripts/publish_heygen_batch.cjs)                                                 | Uploads clips to R2 via `putIfAbsent` (never deletes/overwrites) and updates `src/app/generated/additionalRecordings/`. |
| [`scripts/create_heygen_daily_batches.py`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/scripts/create_heygen_daily_batches.py)                                     | Partitions ungenerated clips into balanced daily batches matching HeyGen quota limits.                                  |
| [`output/recorded-audio/batches/heygen-daily-schedule.json`](file:///c:/Users/AhmedMahdy/OneDrive%20-%20Advansys%20IS/Documents/Antigravity/WordPix/output/recorded-audio/batches/heygen-daily-schedule.json) | Machine-readable manifest of remaining batches, character counts, and quota usage.                                      |

---

## 6. Pre-Merge & Pre-Push Verification Checklist

Before pushing or completing any audio task:

1. `npx tsc --noEmit` — zero TypeScript errors.
2. `npx vitest run` — all unit tests passing.
3. Check R2 publish receipt in `output/recorded-audio/heygen/<batch>-publish-receipt.json`.
4. Confirm `additionalRecordings` shards in `src/app/generated/additionalRecordings/` are updated and sorted.

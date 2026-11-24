# HeyGen Audio Workflow & Multi-Agent Operations Guide

> **CRITICAL GUARDRAIL FOR ALL AGENTS & OPERATORS**:
>
> 1. **Zero-Deletion Policy**: NEVER delete, overwrite, rename, or purge any audio files in Cloudflare R2 or local directories (`output/recorded-audio/heygen/clips/`).
> 2. **Secondary Take Architecture**: HeyGen recordings are registered as a **secondary alternative take** in `src/app/generated/additionalRecordings/`. They **never override or replace** primary curriculum audio mappings (e.g. ElevenLabs or Edge TTS).
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

Total campaign: **5,960 audio clips** across 5 curriculum batches.

| Batch           | Description                            | Total Clips |           Status            | Day & Schedule                                       |
| :-------------- | :------------------------------------- | :---------: | :-------------------------: | :--------------------------------------------------- |
| **Batch 1**     | Core Vocabulary & Contextual Sentences |    1,761    |   ✅ **Published to R2**    | Completed                                            |
| **Batch 2**     | Contextual Cloze Blanks (Part 1)       |    1,323    |   ✅ **Published to R2**    | Completed (Receipt: `batch-02-publish-receipt.json`) |
| **Batch 3**     | Contextual Cloze Blanks (Part 2)       |    1,322    |       ⏸️ **Pending**        | **Day 2** (1,322 API calls)                          |
| **Batch 4 & 5** | Sentence Builder Chunks (All Units)    |    1,554    |       ⏸️ **Pending**        | **Day 3** (1,554 API calls)                          |
| **Total**       |                                        |  **5,960**  | **3,084 Published (51.7%)** | **2,876 Remaining**                                  |

---

## 4. Instructions for Future Agents (How to Resume Work)

When resuming this workflow in a new conversation or session, execute the designated day's batch following this two-step procedure:

### Day 2: Contextual Cloze Blanks (Part 2)

```powershell
# Step 1: Synthesize all 1,322 clips (stops automatically at daily limit)
python scripts/synthesize_heygen_batch.py --batch=batch-03 --limit=0

# Step 2: Upload new clips to R2 (create-only putIfAbsent) and update shards
node scripts/publish_heygen_batch.cjs --batch=batch-03
```

### Day 3: Sentence Builder Chunks (All Units)

```powershell
# Step 1: Synthesize all 1,554 clips
python scripts/synthesize_heygen_batch.py --batch=batch-04-construction-all --limit=0

# Step 2: Upload new clips to R2 (create-only putIfAbsent) and update shards
node scripts/publish_heygen_batch.cjs --batch=batch-04-construction-all
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

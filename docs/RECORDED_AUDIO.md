# Recorded audio workflow

WordPix playback uses prerecorded media. The browser does not contact a speech
generation service or invoke a device speech voice. Existing pronunciation and
reading references retain their original object keys and transcript ownership.

The supplemental registry repairs exact-text lookups for existing R2 takes.
New Edge recordings use a separate `audio/edge-v1/<voice>/<sha256>.mp3` namespace.
The hash includes the normalized transcript, language-specific voice, rate,
pitch, volume and recording version. Edge recordings are synthetic voices,
generated ahead of time and stored as MP3s.

## Generate and reconcile

Run from the repository root:

```powershell
python -m pip install -r scripts/requirements-recorded-audio.txt
node scripts/build_recording_plan.mjs
if (-not (Test-Path output/recorded-audio/upload-receipts.jsonl)) {
  Copy-Item assets/edge-recording-receipts.jsonl output/recorded-audio/upload-receipts.jsonl
}
node scripts/generate_recorded_audio.cjs
node scripts/run_recorded_audio.cjs
node scripts/link_recorded_audio.cjs
pnpm run assets:verify -- --read-only --require-complete
```

The first generator command is a dry run. `--limit=192` permits a bounded pilot.
The planner checks current learner-visible vocabulary, released usage lessons,
readings, dialogue, examples and actual question fragments against the bucket.
It also accounts for transient lesson-loading contexts. Approval schemas and
source transforms mirror the learner-facing usage loader.

Generated media, batch inputs and verification evidence stay under ignored
`output/recorded-audio/`. Verified receipt metadata may be saved in
`assets/edge-recording-receipts.jsonl` to resume cloud jobs; it contains no
credentials or local file paths. Never commit MP3s. The generation
runner automatically retries transient network failures and stops on integrity
failures. The process can also be resumed with the same command: verified receipts and existing
immutable keys prevent repeat generation or replacement.

Uploads use `If-None-Match: *`. Every uploaded file is decoded locally, checked
for nonempty audio and sent with a signed Content-MD5 checksum. The server's
upload ETag must match; existing keys also require a matching HEAD byte count
and ETag. A key
whose contents conflict with the expected recording is held for review. No
workflow step deletes, renames or overwrites an existing R2 object.

Short takes may share a synthesis request. Each cut requires exact source-word
timing evidence, every source letter/number must be accounted for, and adjacent
takes need an isolating pause. Ambiguous alignment falls back to individual
synthesis. Existing local takes are never re-encoded. The alignment regression
checks run with `python scripts/tests/recorded-audio-alignment.test.py`.

## GitHub Actions generation

The manual `Generate audio` workflow has a separate free Edge path. Set
`recorded_edge` to `true`; this skips the paid ElevenLabs job. It uses dedicated
`WORDPIX_AUDIO_R2_ACCOUNT_ID`, `WORDPIX_AUDIO_R2_ACCESS_KEY_ID`,
`WORDPIX_AUDIO_R2_SECRET_ACCESS_KEY` and `WORDPIX_AUDIO_R2_BUCKET` secrets.
Before writing, the job checks the bucket name and compares an existing object
with the app's public audio endpoint.

The reusable `recorded-audio.yml` workflow first records twelve missing takes.
Only a successful pilot unlocks eight disjoint key partitions, with at most
four jobs running together and two Edge requests per job. Each job publishes
receipt metadata even on failure. Existing keys and verified seed receipts
are reused. Artifacts contain metadata and lookup indexes, never MP3s.

The reconciliation job combines receipts, builds indexes and requires complete
coverage. Download its `complete-recorded-audio` artifact into a staging folder,
check the source fingerprint, then apply its plan, receipts and generated
indexes. Repeat the read-only verification against the original R2 snapshot
before release. A failed job or incomplete artifact does not permit publishing.

Pending coverage may be pushed to an explicitly targeted `codex/` draft branch.
The pre-push hook still runs the other release checks. Main, tags, pull-request
validation and production deployment require complete, current coverage.

## Linking and playback

`link_recorded_audio.cjs` generates bounded lookup shards for exact transcript
aliases and verified new uploads. Only verified Edge recordings appear in the
browser's priority index. Existing default recordings remain preferred for
their existing text; special pronunciation references are never replaced with
a generic voice. A corrected Hadith transcript only receives an explicit old
reference when its text still matches that reference.

Question fragments play independently with a pause for the blank, keeping the
answer silent. Native recorded media supports playback speed, pause/resume,
measured progress and IndexedDB caching. A failed optional lookup shard does
not prevent the ordinary recording lookup. Missing audio reports recovery
instead of substituting a browser/device voice.

The read-only verifier checks availability, aliases, original key preservation,
sampled public bytes and CORS. `--require-complete` blocks release until every
planned playback transcript has a recording. Unmatched historical takes stay
archived in R2; a file's existence alone does not justify linking it to a
different transcript.

## Release gate

Do not deploy the recorded-only change while generation is incomplete. Finish
the complete reconciliation, regenerate both indexes, then run TypeScript,
Vitest, lint, build/bundle budgets, the recorded-audio browser tests and the
normal release checks. Browser coverage includes recorded playback, persisted
audio after reload and failure without any device speech call. The Windows
WebKit fixture checks HTTP/cache behavior; physical Safari decoding remains a
manual device check.

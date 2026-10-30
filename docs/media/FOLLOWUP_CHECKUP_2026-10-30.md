# Performance and media follow-up — 30 October 2026

Update: the user subsequently accepted the presented batch. See
[the application receipt](APPLIED_REVIEW_BATCH_2026-10-30.md) for the twelve
published image files, eight incorporated contexts and accepted audio sample.
The original preparation evidence below is retained as historical context.

Status: local software fixes and review artifacts; not deployed. No R2 writes,
object deletions, renames, overwrites, or content-to-media mapping changes.
The previous [performance report](PERFORMANCE_AND_IMAGE_CHECKUP_2026-10-29.md)
records the sentence-media split and its 72% compressed dependency reduction.
This follow-up carries out its code, image preparation and sampled audio checks.
It does not establish full image correctness or a complete listening audit.

## Additional playback causes resolved

- Independent alias and Edge availability lookups previously waited in sequence.
  They now overlap while preserving existing alias precedence.
- After reload, an exact recording already saved in IndexedDB could be rejected
  when its generated availability shard could not load offline. Persisted,
  nonempty exact recording bytes now provide availability evidence themselves.
- A recording that began playing and then stalled could remain in buffering
  indefinitely. Both stored and streamed media now have a 15-second stall
  deadline. Recovery pauses the old element and invalidates its callbacks so a
  late event cannot finish the wrong question. Playing again or pausing cancels
  the deadline.

Five unit cases cover persisted recovery, lookup priority/concurrency, stalled
playback, stale callbacks and cancellation. The browser regression distinguishes
the silent audio-unlock clip from the selected recording. It uses deterministic
stall events after a real HTTP read; the existing playback suite separately
exercises native Chromium decoding. Windows WebKit's codec fixture does not
establish physical Safari decoding.

Local production-app checks used the live public sentence recording. Each
profile had one cold play, then an app reload followed by offline playback:

| Profile                      | Before: offline after reload | After: offline after reload | After: cold start |
| ---------------------------- | ---------------------------- | --------------------------- | ----------------- |
| Desktop Chromium             | No playback within 5 seconds | 101 ms                      | 3,205 ms          |
| Pixel 5 emulation, throttled | No playback within 5 seconds | 298 ms                      | 972 ms            |

The mobile profile used 150 ms latency, 1.024 Mbps download and 4x CPU throttling
after Settings loaded. The desktop cold start was slower than the earlier
500 ms observation; this small live-network sample supports the offline repair,
not a claim of faster cold playback. The trace also records a media request and
a separate background cache fetch for each cold clip. Reducing duplicate cold
transfers is a possible next optimization, subject to preserving immediate
playback and reliable CORS-readable offline storage.

## Image checkup and prepared batch

The technical inventory remains the dated 29 October 21:37 UTC snapshot; it was
reused explicitly, not presented as a new full remote listing. The catalog covers
30,587 core uses and 7,969 additional uses. Metadata checks cover 50,551 local
copies, including 22,933 associated with active keys. Of these active copies,
427 exceed 250 KiB. Copies and uses are not unique R2 object counts.

The 427 large active copies resolve to 324 distinct source keys. Separate,
full-frame WebP candidates were encoded at 480 and 960 pixels without cropping
or enlargement. All 648 candidates decoded successfully. Public GET bytes for
286 sources matched local hashes; the remaining 38 sources have local-only
evidence and are not approved for publication.

| Candidate set | Total bytes | Reduction against 98,890,136 source bytes |
| ------------- | ----------: | ----------------------------------------: |
| 480 pixel     |  14,101,866 |                                     85.7% |
| 960 pixel     |  45,728,086 |                                     53.8% |

These are prepared bytes, not realized production savings. Context, crop,
assessment safety and alt-text review are still required before use.

The existing-art search visually inspected 54 candidate pairings for climbing,
stock and humidity. Asset names describe visible contents, rather than repeating
unverified historical assignments. Thirty-one rejected pairings were recorded.
The review also found ten additional currently used mismatched associations
across five picture keys, and one target-word heading that needs assessment
answer-safety review. These findings are pinned to exact content and served
byte hashes in [the checkup ledger](image-checkup-reviews.json); they have not
been applied to the live mapping or rejection policy.

[The publication review batch](PUBLICATION_REVIEW_BATCH_2026-10-30.json) is
concrete and bounded:

- Twelve new immutable files, totaling 1,429,812 bytes, for six reviewed contexts:
  dry riverbed, cliff, brain coral, sandy bottom, sea urchin and leaf fossil.
  Original/480/960 frames were visually compared; original URLs remain fallback.
- Six exact responsive associations with proposed alt text.
- Two existing-art reuse proposals: an adult climbing rock and a worker placing
  goods on shelves. The climbing picture supports that action; the sentence's
  separate biking clause remains conveyed by text.

All twelve local file hashes and lengths were rechecked against the manifest.
The other 636 candidates, ten additional mismatches, answer-cue image and
humidity repair are explicitly excluded. AGENTS.md keeps R2 objects and media
mappings read-only, so applying this batch requires an explicit scoped exception.

Sagebrush still needs botanical identification; butterfly migration and basking
require reference-purpose judgment. The humidity sentence has an unpublished
editorial proposal, “High humidity makes the air feel damp.” A local Edge audio
draft was generated and decoded, but its ASR ambiguity requires listening.
Neither the authored sentence nor its recording assignment has changed.

## Audio coverage and quality sample

The Vite-aware recording planner now works with the application's glob imports
on Windows; the documented and CI entry point is
`node scripts/build_recording_plan.mjs`. A fresh read-only reconciliation found
96,359/96,359 playback transcripts available, with zero missing recordings,
unlinked new recordings, broken aliases, broken pronunciation references or
removed originals. This confirms coverage, not spoken quality.

The 66-clip stratified sample includes all 18 pronunciation overrides, English
and Arabic, authored scenarios, feedback, long passages, Edge clips, and
recoverable legacy voice/model profiles. All public downloads decoded. Signal
analysis flagged three low-level Arabic references; ASR flagged eight transcript
disagreements. Flags overlap. Recognizer confusions include specialist words,
Arabic passages and “Sixteen” transcribed as “16”; none is automatically a bad
recording. Pronunciation, stress, intelligibility and complete phrase boundaries
still require listening. Original recordings remain unchanged.

Optional review tools run in an isolated Python 3.12 environment using
`scripts/requirements-media-review.txt`. The analyzer verifies actual local
checksums before resuming prior evidence. It passes decoded mono samples to
faster-whisper, avoiding its version-sensitive second filename decode; see the
[upstream decoder](https://github.com/SYSTRAN/faster-whisper/blob/master/faster_whisper/audio.py).

## Review artifacts and next actions

Generated evidence stays under ignored `output/`:

- `output/image-quality/index.html`: filter by replacement, keep/optimize,
  assessment safety, unit, purpose and crop; review rationale is displayed.
- `output/image-quality/checkup.csv` and `checkup-summary.json`: current actions
  and explicit audit limits. No final regeneration count has been approved.
- `output/media-followup-2026-10-30/audio-quality/listen.html`: 66 exact-key
  recordings, expected text, signal evidence and ASR disagreements.
- `output/media-followup-2026-10-30/responsive-review/`: original/variant contact
  sheets; `replacement-review/` holds the existing-art search evidence.
- `output/media-followup-2026-10-30/responsive-review/publication-review.html`:
  side-by-side originals, proposed variants and reuse artwork; all 22 pictures
  load locally and the layout was checked at desktop and 390-pixel width.
- `output/media-followup-2026-10-30/playback-before.json` and
  `playback-after.json`: browser measurements and request traces.
- `output/media-followup-2026-10-30/humidity-repair/`: unpublished text/audio draft.

Next, listen to the flagged audio, review the scoped publication batch, and
complete the remaining visual-context decisions in small unit batches. Search
existing artwork before approving regeneration; missing assignments and weak
metadata alone do not justify new art. After authorized publication, recheck
mobile image selection, English/Arabic alt text, offline fallback and live
playback on physical devices, then measure field performance.

Software changes are recorded bilingually in v0.1.102. Validation logs use
`output/followup-*`.

## Final validation

- TypeScript: zero errors; all 197 Vitest files / 3,255 tests passed; full ESLint
  passed. Changed files pass Prettier and `git diff --check`.
- All 41 media-tool tests and six audio-signal/checksum tests passed. Recording
  readiness passes for the current input fingerprint.
- Production build and bundle/route budgets passed. The existing usage-registry
  chunk still emits Vite's 600 kB warning (1,048 kB raw / 309 kB gzip); route
  budgets were not increased. Splitting that registry is another optimization
  to investigate after measuring its runtime loading cost.
- The stall-recovery regression passed nine no-retry runs across all three
  browser profiles. The broader browser run exposed an existing manual-mode
  test racing automatic continuation. It now explicitly selects manual mode
  through Lesson options; nine repeated runs passed, with automatic-default
  coverage retained separately.
- The final combined suite passed all 57 cases with retries disabled across
  desktop Chromium, mobile Chromium and mobile WebKit, covering playback,
  recovery, pronunciation, reviewed images and selected-unit offline reloads.
- The image dashboard's replacement and answer-safety filters, visible evidence,
  and all 66 listening controls passed a browser smoke check without page errors.
- Repository-wide Prettier still fails on existing formatting debt and two
  untouched scratch-script parse errors: UTF-16 `repl.js` and an unterminated
  template in `scripts/append_bathroom_data.cjs`. These are outside the changed
  files; no broad formatting rewrite or scratch-script execution was performed.

No production deployment was performed. Physical Safari audio decoding,
screen-reader listening workflows and criterion-by-criterion WCAG AAA
conformance remain outside the automated evidence.

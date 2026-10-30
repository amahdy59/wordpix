# Accepted image and audio review — 30 October 2026

The user reviewed the presented image comparison page and 66 audio samples,
confirmed they were good, and explicitly instructed incorporation. That approval
is recorded in `ACCEPTED_MEDIA_REVIEW_2026-10-30.json`, pinned to the exact
publication manifest digest and sampled audio checksums. It is a scoped exception
to the repository's read-only media rule for this batch; other work retains that
rule.

## Applied scope

- Twelve immutable WebP objects were created using signed `If-None-Match: *`
  requests. Local SHA-256, upload checksum, authenticated read-back, public
  read-back, byte length and public CORS headers were verified. The credential
  bucket was checked against an existing reviewed public original before writes.
- Six exact sentence contexts now have 480/960/original width candidates:
  dry riverbed, cliff, brain coral, sandy bottom, sea urchin and fossil. All
  originals remain available. The component retries the original without
  `srcset` if a responsive candidate fails, including unavailable offline variants.
- Two exact sentence contexts use previously existing reviewed action artwork:
  rock climbing and staff stocking shelves. The old, misleading pictures remain
  archived in R2 and are not used as fallbacks for these sentences.
- Audio disposition is **keep existing recordings**. The 66 downloaded clips
  were quality-review copies. None was uploaded, replaced, normalized or remapped.
  User acceptance resolves the review queue for this sample; it is not evidence
  of a listening audit of every recording in the application.

The application associations live in `src/app/generated/reviewedMediaFollowup.json`
and apply only when the word ID, exact sentence and previous original image
match. Audit records retain the superseded reviews. No learner-progress keys,
original object bytes, authored sentences or unrelated assignments were changed.

For the six optimized contexts, original bytes total 2,659,760; the 480 variants
total 310,272 (88.3% less) and the 960 variants total 1,119,540 (57.9% less).
Browsers select according to layout and device density; high-density views may
still select the retained original. These are file-size reductions, not a field
page-load speed measurement.

The fresh inventory has 153,088 keys: exactly the twelve approved additions
against the earlier 153,076-key inventory. No deletions, renames or overwrites
were performed. Immutable publication receipts are stored in
`PUBLISHED_MEDIA_RECEIPT_2026-10-30.json`. The source registry and original unit
tables remain unchanged; the small reviewed application layer supplies the
approved associations.

## Validation and release state

Software release history includes bilingual v0.1.103. The new objects are
available on R2; application code remains in the local checkout and has not
been deployed. Test logs and browser attachments use
`output/media-followup-2026-10-30/integration-*`.

TypeScript, all 198 Vitest files / 3,257 tests, ESLint, the production build,
bundle/route budgets and all 41 media-tool tests passed. Tests cover exact-context
guards, preserving unchanged unit tables, responsive selection, and original
fallback on failed variants. Initial desktop integration passed all 16 cases
across the eight contexts in English and Arabic.
The final related browser suite passed all 81 cases with retries disabled across
desktop Chromium, mobile Chromium and mobile WebKit, including smaller-variant
selection, original fallback under failed requests, audio recovery, existing
reviewed images and offline reloads. A fresh read-only audio reconciliation
confirmed 96,359/96,359 available recordings with no missing recordings, broken
aliases, unlinked new recordings, broken pronunciation references or removed
originals. The audit catalog, exact reuse decisions and review dashboard were
rebuilt against the new inventory.

## Next useful work

1. Release the verified application changes and check the live build on physical
   phones, including high-density image selection and offline audio reload.
2. Measure lesson readiness and audio startup over repeated cold/warm mobile
   runs. Investigate the existing 1,048 kB usage-registry chunk only after tracing
   its contribution; investigate the separate audio stream/cache transfers while
   retaining immediate playback and reliable offline storage.
3. Continue visual review in bounded unit batches. The ten additional mismatch
   uses, answer-cue picture, specialist-subject questions, 636 other prepared
   variants and humidity editorial draft remain outside this approval.

No further audio generation is justified by this accepted sample. New image
generation should follow a confirmed context need and rejected existing-art
candidates, rather than missing metadata alone.

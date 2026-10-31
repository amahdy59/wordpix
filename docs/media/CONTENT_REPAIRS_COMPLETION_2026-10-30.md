# Continued content repair batch

This supersedes the pending-art and pending-language statuses in
`CONTENT_REPAIRS_2026-10-30.md`. The local branch now provides replacement support
for all 17 reviewed contexts: the original 16 plus an alternate coffee-liqueur
definition sentence whose original picture showed a man beside a fireplace.

## Image decisions applied

Three authored SVG teaching illustrations supply jacket assistance, a four-panel
clerk work sequence and separate product entries on a stock sheet. They have no
readable answer words, invented numerical values or external dependencies.
Descriptions state what is visible. The product name and the details of the
conversation remain in the written source. The drawings are application assets;
R2 image objects and historical mappings are retained.

A retained original-image identity lets sentence-specific corrections apply even
after the containing scene receives a new checked illustration. The short jacket
example therefore gets the focused assistance picture, while the longer scene
gets the four-panel sequence. Corrections still require exact text and the
expected original object key and discard unrelated fallback chains.

## Humidity wording and approved audio

The user explicitly approved a limited exception to the R2 read-only constraint:
eight new immutable recordings and their coordinated text repair. The approval
lists exact keys, source transcripts, local file hashes, original source hash
and proposed content hash in `APPROVED_HUMIDITY_REPAIR_2026-10-30.json`.

“Echoes fade, and humidity swelters.” is replaced with “The echoes fade. High
humidity makes the air feel damp.” Five occurrences are updated together in the
scene, reading, exercise prompts and dialogue. Eight exact transcripts cover
the sentence, blank fragments and full passages. All eight local MP3s decoded
successfully; this is technical verification, not a phonetic-conformance claim.

Publication used create-only writes, then signed HEAD/GET, public GET, SHA-256,
MD5/ETag and CORS verification. The public recording receipts are preserved in
`PUBLISHED_HUMIDITY_RECEIPT_2026-10-30.json`. Text was applied only after all eight
objects passed verification. No original objects were overwritten or deleted.

The recording linker also preserves existing published indexes whose historical
receipts are absent locally, after checking that their bucket objects remain
available. This prevented two existing indexed takes from being silently dropped.
No existing transcript alias was changed. Read-only reconciliation reports all
96,358 current playback transcripts available, no missing or unlinked recordings,
no broken aliases or pronunciation references, and no removed originals.

## Verification and publication status

TypeScript, all 3,264 Vitest tests, full lint, production build and bundle/route
budgets passed. Browser coverage includes the original geometry corrections,
retail support, both coffee-liqueur sentence variants, and the humidity phrase
builder in English and Arabic across desktop Chromium, mobile Chromium and
mobile WebKit. Existing approved-image integration is also covered.

The audio objects are public. Application source changes remain local until a
separate software release passes its full pre-push and hosted deployment gates.
Release notes 0.1.104 and 0.1.105 document the two local software repair batches.
The earlier workbook is retained as the baseline and the local review page labels
its earlier statuses accordingly. Remaining catalogue artwork still needs review;
the 17 reviewed contexts are not evidence of whole-catalogue approval.

# Content and image repairs after the learner screenshots

The pending statuses below describe the first batch. See
`CONTENT_REPAIRS_COMPLETION_2026-10-30.md` for the completed retail, stock-list and
humidity repairs.

The screenshots prove that the triangle sentence showed fishing equipment and
the oval sentence showed shipping containers. The exact sentence registry
contained those unrelated library references under a reviewed filename. That
filename is not evidence of semantic approval. The corrections therefore require
the exact word, sentence and original object key rather than trusting that label.

## Applied locally

- Six geometry sentence contexts now use code-native vector teaching scenes: a blank
  three-sided sign, an oval mirror, a highlighted square tile, a circle around a
  check mark and a rectangular outline around an envelope's address lines. There
  are no readable answer labels. Descriptions reflect visible contents rather
  than exposing generation prompts as alt text. Vite packages these small SVGs
  with the application; no R2 writes are required.
- Four climbing/sensor sentences and one playground scene reuse existing artwork
  inspected visually. Public GET bytes matched the three retained local sources
  exactly. The pictures support the visible subject/action; the mountaineering
  picture is not evidence of rope certification or elasticity, and the sensor
  picture is not evidence of a humidity reading. The written text retains those
  facts. Receipt hashes are in the local output directory.
- Four shopping/stock-list sentences omit confirmed unrelated images while
  retaining the written/audio activity. No suitable exact-context artwork was
  found in the inspected candidates. The retail scene also has an explicit visual
  review hold, which prevents the story UI from silently restoring an unreviewed
  word-image fallback. These five contexts still need appropriate art.
- Corrections discard the unrelated image's fallback chain. Changed source text
  or changed original image keys invalidate each correction automatically.

The batch covers 14 sentence contexts and two scenes, including all ten active
mismatch records in the previous tracker plus the six geometry sentence contexts.
It is not a claim that the remaining image pool has passed visual review.
Historical R2 objects, original registry entries, audio mappings and learner IDs
are retained. No media was generated, uploaded or deleted from R2 in this batch.

## Language decision made without requesting another content review

Replace “Echoes fade, and humidity swelters.” with “High humidity makes the air
feel damp.” The latter uses the target noun naturally and is suitable for the
learning purpose. A local draft with its matching recording already exists under
`output/media-followup-2026-10-30/humidity-repair/`. This editorial decision does
not need another learner review. Runtime text is held until that new exact
recording can be integrated without breaking the recorded-audio completeness
gate or changing the read-only media mapping. Its containing passage and related
questions must be migrated together, not by a blind global replacement.

## Evidence and remaining work

The local review page shows the five new geometry scenes and labels the earlier
Excel workbook as the pre-repair baseline. The applied-corrections CSV records
all sixteen contexts, retained original keys and replacement/hold status under
`output/content-repair-2026-10-30/`.

Next artwork work is the four shopping/stock-list sentences and retail scene.
Continue visual review in curriculum batches, beginning with the remaining
geometry examples, because a source record marked reviewed can still be wrong.

## Verification

TypeScript passed, all 3,261 Vitest tests passed, and the production build and
bundle/route budgets passed. The browser checks cover both screenshot cases and
the alternate oval sentence in English and Arabic on Chromium, mobile Chromium
and mobile WebKit, alongside the prior approved image batch. The complete lint
and final browser results are recorded in the local output directory.

Read-only reconciliation confirms all 96,359 playback transcripts are available,
with zero missing recordings, unlinked recordings, broken aliases, broken
pronunciation references or removed original objects. A newly added regression
test protects selection of an existing recorded sentence when its incorrect
picture is held. This prevents image correction from changing the spoken task
or introducing a new unrecorded blank fragment.

Implementation is in the local `codex/content-image-repairs` branch. These
verification results do not claim production publication.

# Second image scan and sentence-image import

Date: 26 October 2026. Scope: current working tree, including the separate recent
342-image priority import and the preceding sentence repairs.

## Uploaded images

Imported the 13 PNG images supplied by the user for canoeing, coral bleaching,
skipping stones, swimming, wading, stargazing, bird-watching, camping, elliptical,
exploring a campsite, hiking, mountain biking and snowboarding.

All original download files remain intact. Delivery copies retain the supplied
448 × 295 resolution and use WebP: 735,966 bytes in total, compared with 4,191,346
bytes for the PNG originals. No upscaling or image edits were performed.

Each image received a new immutable, content-hashed key under
`question-images/v3/sentence-repair-20261026-…/`. Uploads used signed create-only
requests. Every new object was checked through authenticated R2 HEAD/GET and
public CDN GET with exact byte equality. The registry gained 13 exact
word-ID/sentence bindings; the importer verified all 3,418 pre-existing entries
were preserved.

The app's asset resolver now recognizes only this verified dated namespace in
addition to its previously allowed namespaces. Malformed keys and unrelated v3
paths still resolve locally. A production-mode regression check covers the new
namespace. A runtime routing audit verified all 13 selected image URLs and their
downloaded bytes after this change.

The photographs were reviewed for their central subject, action and setting.
Incidental generated signage and logos do not establish permissions, official
identity or educational facts. Sentence text still supplies timing, permissions
and other details that a photograph cannot prove.

The import manifest, optimized local copies and upload receipts are retained in
`output/illustrations/sentence-repairs-2026-10-26/`. The reusable importer is
`scripts/import_sentence_repair_images.mjs`; it supports `--dry-run`,
`--verify-only` and an explicit `--link` step. It never deletes or overwrites R2
objects. The generic `assets:verify` script was not used because its probe deletes
a temporary object; this task instead verified the actual delivery files without
deletion, as the user requested.

## Older delivery repairs

The second scan confirmed missing objects for the butterfly-garden pathway and
insect-world ant sentence illustrations. Both original files were present
locally. Their SHA-256 digests matched the existing immutable key filenames.
They were restored with create-only uploads to their original keys, then checked
through R2 and the existing public URLs. Neither mapping changed.

The final delivery inventory contains 18,327 referenced image URLs and no
unresolved delivery issue. Fresh checks cover new and previously failing assets;
unchanged assets reuse the earlier same-day checks. This is not a claim that
every URL was downloaded anew or that every image is semantically correct.

## Scan result and next production batch

Inventoried 34,794 visual records and 18,497 other prompts across vocabulary,
scene checks, phrases, readings, Business, Conversation, Pronunciation, Hadith,
placement and other practice/reference tasks. All 11,854 vocabulary image rows
and 1,246 curated phrase-card rows have image mappings.

There are 7,416 sentence-question records without an exact scene mapping,
representing 6,146 distinct sentence texts. Their word/reference support remains
available. Another 2,014 scene checks use vocabulary references. These totals are
not orders for thousands of new illustrations.

Reapplied the previous conservative editorial exclusions to the current runtime
content, then individually reviewed every initial generation candidate. The next
recommended batch has **83 physical compositions** supporting **85 distinct
requests and 88 question records**. Two pairs share a composition: toothbrushing
with different written time clauses, and a paper-sheet scene used in both a
sentence and a scene check. There are also **4 reuse candidates** to inspect
before ordering new artwork.

The remaining backlog is separated by the work it needs:

- 942 composition/design reviews, including diagrams and multi-part scenes.
- 1,526 text or concept reviews where appearance cannot establish the meaning.
- 50 content reviews, including incidental female wording and unclear sentences.
- 5,597 request groups where existing image support is sufficient for now.

The review backlog includes 3 Hadith picture questions with placeholder clues,
29 specialist-phrase image gaps and 12 authored-reading image gaps. Their source
content or composition must be resolved before generation. This scan does not
silently rewrite, illustrate or publish them.

The user's capacity is up to 3,000 images. The 83-image shortlist leaves 2,917
available for later designed visuals; the workbook does not pad the order to
consume that capacity.

## Deliverables and verification

The detailed workbook is
`outputs/image-second-scan-2026-10-26-01a176fb/WordPix-second-image-scan-2026-10-26.xlsx`.
It contains the generation shortlist, exact sentences/scenes, physical briefs,
questions, answers, source/lesson IDs, current support URLs, reuse evidence,
review backlog and all 13 verified upload URLs. A CSV of the 83 production briefs
is available beside it for bulk generation.

Workbook counts, the budget formula, exported rows and panes were checked, and
each worksheet was visually inspected. TypeScript, all 3,148 unit/integration
tests and ESLint pass. The production build and all 23 Chromium browser checks
for lesson flows and question layouts pass. Release history was updated in English and Arabic to
0.1.88. R2 uploads are complete; code changes remain local until deployed.

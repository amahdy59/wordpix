# Existing Figma illustration reuse review

Source: [English App — Pilot Images](https://www.figma.com/design/gRlyhrMavAHXUAT5brWFWu/English-App?node-id=1577-8062). Inspected 8 October 2026.

Preserve every created image in Figma and R2. Never delete images during cleanup, correction, or replacement. New assets use new immutable versioned keys; existing assets remain available.

## Findings

Pilot Images contains 2,142 image placements with 1,679 distinct image hashes. The foundation gallery contains 265 placements. Ten additional Objects-first batch pages contain 657 placements. These counts are inventories, not approvals or counts of new images required.

| Batch | Placements | Distinct hashes within page | Existing page label                                 |
| ----- | ---------: | --------------------------: | --------------------------------------------------- |
| 01    |         63 |                          63 | Visually reviewed; educator validation items remain |
| 02    |         72 |                          72 | Visually reviewed; educator validation items remain |
| 03    |         72 |                          72 | Visually reviewed; educator validation items remain |
| 04    |         63 |                          63 | Clarity review pending                              |
| 05    |         60 |                          36 | Clarity review pending                              |
| 06    |         75 |                          33 | Not visually reviewed                               |
| 07    |         30 |                          15 | Not visually reviewed                               |
| 08    |         75 |                           8 | Not visually reviewed                               |
| 09    |         72 |                          47 | Not visually reviewed                               |
| 10    |         75 |                          34 | Not visually reviewed                               |

Page labels reflect source metadata, not an independent confirmation of quality. Repeated hashes may be legitimate reuse, but eight unique images across 75 placements in Batch 08 warrants careful matching. Some later images are in records labelled photograph missing and appear at 120×80 display size; inspect original resolution before accepting them.

## Individually inspected candidates

| Figma node | Visible content                               | Suitable use                              | Limitation                                                                         |
| ---------- | --------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| 1647:126   | Exactly two pens, clearly separated on a desk | I have two pens                           | Does not show office trays or folders                                              |
| 1647:113   | Exactly four prominent chairs in a row        | I see four chairs / There are four chairs | Cannot support a combined chair, bag, and book question without additional context |
| 1647:116   | Exactly five bags in a row                    | I see five bags                           | Background classroom furniture makes it unsuitable for assessing chair count       |

The inspected photos are reusable for the matching short phrases. Their captions contain editorial duplication such as I see I see four chairs; captions must not be copied blindly into learner content. Do not substitute these photos for a usage scene whose scenario requires a different object, quantity, location, or relationship.

## Selection rule for subsequent batches

Check the existing inventory first. Approve an asset only after comparing the exact question, assessed target, visible objects, count, spatial relationships, and original image quality. Verify the crop at phone size, ensure relevant objects remain distinguishable, and supply equivalent descriptive alternative text. Do not embed an answer label in an assessment image. Prefer a clear photo or illustration based on the teaching task, rather than selecting a style globally. Generate only missing or unsuitable scenes. Preserve every rejected or superseded image.

## Full-file inventory and verified reuse

The complete file inventory now covers 339 pages, 24,735 image placements and 21,795 distinct source references. Scope was narrowed to question scenes by the user's explicit clarification. The scene inventory identifies 1,030 placements and 1,019 distinct sources. All 1,019 originals were downloaded and decoded successfully; 85 contact sheets are cached for continued review. Downloading or decoding an image is not a semantic approval.

119 candidates received an independent visual/content review: 89 sentence images, 17 geometry images, five clinical images and eight reading images. 76 were approved for specific current questions: 61 sentence images, nine geometry scenes and six reading images. 43 were withheld. Eight withheld geometry photos already have reviewed vector replacements; 35 records still need replacement artwork.

The 76 approved images were encoded as WebP from reviewed Figma originals and six previously exported local reading images, preserving the complete frame, without upscaling and within a 1200×900 bounding box. Total delivery size is 6,991,644 bytes. New content-hashed `question-images/v1/` objects passed S3 HEAD/GET and public CDN GET verification for MIME type, length and exact bytes. No existing image was deleted, renamed or overwritten in Figma, R2 or the local source collection. The user explicitly authorized these new uploads as an exception to the modernization read-only rule.

The application matches the reviewed sentence, reading or scenario before attaching media. A changed question invalidates its reviewed association. Nine geometry photos have independently reviewed vector-derived WebP fallbacks; each fallback retains its own accurate alternative text. Local filenames and approximate pixel similarity are not used to approve a fallback automatically. Rejected sentence and reading images use the labelled placeholder; the question retains its textual evidence.

Incorrect or unclear examples include twelve plates assigned to eighteen, fourteen figures assigned to thirteen, cars assigned to people in a queue, an arched door assigned to a rectangle, a bent radius, a mug assigned to light walls, and a prism assigned to rain producing a rainbow. These assets remain preserved.

The regeneration queue is [figma-image-regeneration-requests.csv](figma-image-regeneration-requests.csv), with stable question IDs, rejection reasons, exact current text, existing replacements and generation briefs. [figma-scene-library-review-status.json](figma-scene-library-review-status.json) distinguishes approved records, visually withheld sources and pending reviews across the full scene inventory. The remaining library has not received an independent image-by-image audit and is not approved for bulk reuse.

Review evidence and private temporary source URLs remain under `output/illustrations/figma-reuse/`; temporary URLs must not be committed or shared. Regenerate the reports with `node scripts/report_figma_reuse_decisions.mjs`.

The next batch adds 12 independently reviewed fruit and vegetable scenes and withholds six ambiguous comparisons. The resulting reuse total is 88 images; the separate 50 vector illustrations remain available. The regeneration queue now contains 49 withheld records, eight covered by reviewed vectors and 41 requiring replacement artwork. Details and exact source hashes are in [figma-object-scene-batch-02.json](figma-object-scene-batch-02.json). All 12 new lossless WebP objects passed R2 and public CDN byte and content-type verification using conditional create-only uploads. Their imagery focuses on objects, with no identifiable foreground women. Question text supplies shopper actions that are not asserted by the alternative text. This remains a partial library audit.

Validation after integration: TypeScript passed; all 2,684 tests in 127 files passed; lint and production build passed; all 12 authored-flow desktop/mobile browser checks passed. A first browser run timed out while dictionary details loaded; authored examples and audio now render without that dependency. These checks do not constitute a full WCAG AAA audit or approval of the pending library.

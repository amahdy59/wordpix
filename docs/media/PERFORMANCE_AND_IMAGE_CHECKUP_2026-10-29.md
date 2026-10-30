# Performance fix and image checkup — 29 October 2026

Status: validated in local production builds and automated tests; not deployed.
No R2 objects, existing media URLs, source media assignments or learner progress
were changed. Bilingual release history records the software change as v0.1.101.

## Confirmed performance cause and correction

Opening a sentence exercise imported the complete sentence-image runtime table:
21,302 exact word/sentence pairs. Its production JavaScript was about **11.48 MB**,
or **2.36 MB gzip**. Importing the resolver also decoded every
row into a global Map before the exercise could run. Independent caching did
not remove this first-visit download, parse and initialization cost.

The bundle check explicitly allowed a 28,000 KiB sentence-support chunk, so
ordinary builds could pass despite the oversized dependency.

The fix generates independently cached unit tables and prepares the requested
table alongside vocabulary and bilingual content at the existing loading
boundary. The synchronous exercise selector runs only after preparation. Shared
word IDs retain every applicable exact pair, original first-match precedence,
descriptions, fallbacks and the existing 27 rejection scopes. Concurrent requests
share their result; failed requests use the existing retryable request cache.

The complete derivative remains available to editorial tooling and parity
tests. A production import of it now fails the build. Each unit table has a
320 KiB budget; the largest current production table is **280,771 bytes**, and
the median is **75,925 bytes**. There are 201 generated vocabulary tables,
including a legacy unit, rather than a new curriculum/navigation definition.

| Production JavaScript dependency closure | Before, gzip | After, gzip |
| ---------------------------------------- | -----------: | ----------: |
| Gap-fill sentence exercise               |  3,275,722 B |   921,006 B |
| Sentence builder                         |  3,276,088 B |   921,375 B |
| Initial application                      |    462,387 B |   466,402 B |

The sentence-exercise closure is about **72% smaller**. The selected unit table
is an additional asynchronous download: camping-site is about 34.3 kB gzip,
garden 22.3 kB and bedroom 27.7 kB. The small initial increase comes from the
lazy loader index. These are local build measurements, not a claim about
production Core Web Vitals or all possible causes of slow devices.

Generated audit backups under `output/` and `outputs/` are also excluded from
Vitest discovery. A focused run had accidentally collected an archived test
whose neighboring source modules were absent. Production code is unaffected
by that test-discovery correction.

## Image checkup findings

The fresh read-only R2 inventory captured at **23:37 Africa/Cairo** lists
**153,076 objects**. The refreshed audit covers **30,587 core image uses** and
**7,969 additional specialist/story uses**. Those are uses, not unique pictures.

The technical pass inspected metadata for **50,551 local image copies**:

| Local metadata result                            | Copies |
| ------------------------------------------------ | -----: |
| No technical review flags                        | 47,705 |
| Resolution below the 480 px review threshold     |  1,730 |
| Transfer size above the 250 KiB review threshold |  1,104 |
| File extension differs from its container        |     72 |

Flags overlap. Small pictures may be valid thumbnails; readable files are not
automatically semantically approved. This checks container metadata, not every
pixel or the bytes behind every live URL.

Of **22,933 local copies associated with currently audited image keys**, **427**
exceed the transfer-size review threshold. None of those associated copies has
a resolution or container-extension flag. The 72 extension issues are therefore
local-library housekeeping findings, not established broken learner images.
Remote-only pictures remain outside this local technical pass.

The semantic backlog remains explicit:

- The existing 27 confirmed incorrect source associations remain excluded by
  the existing runtime rejection policy. This checkup did not apply replacements.
- The core runtime has **1,686 uses without an image assignment**. Of these,
  **972** have exact-text candidates to inspect and **714** need broader search.
  These figures do not establish a regeneration count.
- **793 uses have a text-only purpose decision**: 770 specialist quiz prompts
  and 23 Hadith vocabulary uses. Their absent pictures are intentional.
- **2,014 scene uses have word-reference support** requiring context review;
  an object picture does not establish a complete action or scenario.
- The previous twenty exact reuse assignments have recorded review evidence.
  The separate three Hadith contextual references retain their prior receipt
  in `APPROVED_HADITH_REUSE.json`; they are not newly approved by this scan.

## Twelve-image visual triage

The checkup fetched twelve large, currently used public image URLs. All twelve
returned HTTP 200 and matched their local SHA-256 digests. Their contact sheet
was inspected against the exact selected sentences. Individual dispositions,
content revisions, URLs and served-byte hashes are preserved in
[`image-checkup-reviews.json`](image-checkup-reviews.json).

| Disposition                                      | Images | Finding                                                                                                                                                       |
| ------------------------------------------------ | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Replacement action image needed                  |      2 | Rock-climbing equipment does not depict ascending rock; stocked shelves do not depict staff stocking them. Search existing action artwork first.              |
| Context supports the sentence; optimize delivery |      6 | Dry riverbed, cliff, brain coral, sandy bottom with ray, sea urchin and leaf fossil. This is bounded scene triage, not full editorial/alt-text/crop approval. |
| Reference-purpose review                         |      2 | Butterfly migration and basking scenes cannot prove species, seasonal movement, temperature change or causality by themselves.                                |
| Specialist subject review                        |      1 | Sagebrush identification needs botanical confirmation.                                                                                                        |
| Content and purpose review first                 |      1 | “Echoes fade, and humidity swelters.” needs language review; forest mist/light alone does not establish humidity or echoes.                                   |

No item is approved for regeneration yet. For each unresolved use, decide whether
an image helps the task, inspect existing candidates, then choose keep, reuse,
replace, content repair, reference-only or generate. Generate only after the
existing-art search and precise visual brief pass the established review gates.

## Review artifacts and reproducible commands

- `output/image-quality/index.html`: paginated visual workspace with unit,
  content, purpose and crop filters.
- `output/image-quality/checkup.csv`: current content, exact URLs, triage action,
  sample rationale and evidence. Filter `replace-action-image` for the two new
  visual findings; `keep-context-optimize-delivery` for the six sample keep cases.
- `output/image-quality/local-image-flags.csv`: technical flags and associated
  current image keys. Empty `activeKeys` means no use in this audit scope, not
  permission to delete the file.
- `output/image-quality/checkup-summary.json`: dated counts and evidence limits.
- `output/image-quality/priority-visual-check/`: sampled public bytes, digests and
  contact sheet. These generated artifacts stay local and are ignored by Git.

```powershell
pnpm run media:catalog
node scripts/audit_specialist_visuals.mjs
node scripts/reconcile_visual_reviews.mjs
pnpm run media:dashboard
pnpm run media:checkup
```

The checkup rejects stale sampled content revisions or changed URLs. It has no
upload, overwrite, delete or mapping-application mode. Stored public byte
evidence is dated; the local metadata command does not silently claim to have
re-fetched every image.

## Audio follow-up

The prior verified receipt in `PENDING_AUDIO_PUBLICATION.json` records 96,359 of
96,359 playback candidates available, with zero missing recordings, broken
aliases, unlinked new clips or removed originals. This task did not rerun a
complete audio reconciliation or change recordings. The unit split preserves
the sentence choices used by the audio pipeline.

The next useful audio work is listening-quality and playback review: sample
each voice/source, English and Arabic, specialist terms and long passages;
check pronunciation/stress, clipped starts or ends, silence and level changes;
measure playback startup and recovery on mobile, slow networks and offline.
File coverage alone cannot approve pronunciation or intelligibility. Tie every
finding to exact spoken text and recording key before proposing a replacement.

## Validation

- Failing regression reproduced the all-course import before the fix.
- TypeScript passed, followed by all **196 Vitest files / 3,250 tests**, then
  ESLint with exit 0.
- All **38 media-tool tests** passed, including table parity, scoped rejection
  behavior, technical classification and stale sampled-review rejection.
- The production build and bundle/route budgets passed. The earlier broad
  sentence-support exception was removed; ceilings were not raised.
- All **24 related browser cases** passed across desktop Chromium, mobile
  Chromium and mobile WebKit, including English/Arabic image reports, reviewed
  images, optional image packs and selected-unit offline reloads. These tests
  do not establish physical Safari audio decoding or full WCAG conformance.

Local logs and before/after byte measurements use `output/performance-*`.
No deployment was performed.

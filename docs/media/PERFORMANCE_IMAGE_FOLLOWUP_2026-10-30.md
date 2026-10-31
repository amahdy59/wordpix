# Performance and picture follow-up — 30 October 2026

The supplied-image release retains 34 exact lesson contexts and 68 immutable responsive files, totaling 7,525,094 bytes. The publication receipt records checksum and CORS verification for all files. This follow-up makes no R2 writes and does not alter historical media mappings.

## Active image review

The current vocabulary/sentence/scene resolver produced 30,587 uses. Joining those uses to the existing read-only local catalog identified 319 unique technically flagged active assets, representing 474 uses and 96,543,942 bytes of local originals. This deduplicates local copies; these counts differ from earlier copy-level reports.

Seven assets already had review evidence. All remaining 312 assets (467 uses) were inspected on seven contact sheets against their exact contexts. Of these, 274 were fetched from their actual public URL and fully decoded; 38 local-only assets were decoded from public source files. All fetched bytes matched the catalog's local copy. Local-only checks do not establish live availability.

`ACTIVE_IMAGE_TRIAGE_2026-10-30.json` preserves source hashes, context IDs, decisions, reasons and follow-up actions. Recognizable artwork is a reference candidate, not proof of every sentence detail. Species, anatomy, annotations and alternative text require detailed review where marked. This is not a full editorial approval or WCAG conformance claim.

142 exact picture/context pairings are suppressed through a display-only hold ledger. Examples include garden scenes used for computer networking and legal concepts, construction work used for celery, and animal pictures used for library services. Holds match the source object, wording, target and lesson; changing one prevents the hold from affecting a new assignment. Spoken sentence selection remains independent of display holds. A held image cannot return through the same vocabulary fallback.

Incorrect artwork must first be replaced from existing reviewed candidates. Regeneration is not automatically approved. Large but relevant images remain candidates for responsive delivery; new R2 uploads or remapping remain outside this follow-up. Preserve existing objects.

## Twelve withheld supplied files

`SUPPLIED_IMAGE_HOLD_DISPOSITIONS_2026-10-30.json` resolves every withheld file to a duplicate, unsuitable source, or unassigned reference. Clean full-size alternatives already cover the duplicate shopper and climbing pictures. Caption strips, solid strips and a 32-pixel placeholder are unsuitable. Synthetic documents and labeled products remain excluded from scored prompts. Unverified sagebrush art is rejected for species teaching. The two retired Hadith contexts remain unassigned references; no live lesson is guessed from a filename.

## Mobile production-build measurement

The reproducible profiler is `node scripts/profile_learning_mobile.cjs <local-preview-url>`. It uses a 390 × 844 viewport, DPR 1, 4× CPU slowdown, 150 ms latency and 1.6 Mbps download. Service workers are blocked to distinguish HTTP cache behavior. It uses real CDN GETs without image interception and measures an actual word-tile click.

The recorded sample in `docs/performance/MOBILE_LEARNING_2026-10-30.json` showed:

| Locale  | Cache | Picture ready | Transferred | Click completion |
| ------- | ----- | ------------- | ----------- | ---------------- |
| English | Cold  | 11.70 s       | 1247.3 kB   | 558 ms           |
| English | Warm  | 3.26 s        | 10.5 kB     | 146 ms           |
| Arabic  | Cold  | 9.74 s        | 1418.4 kB   | 198 ms           |
| Arabic  | Warm  | 3.04 s        | 10.7 kB     | 161 ms           |

The smaller reviewed image variant was selected in all four runs. These are one-sample lab measurements on a shared host, not physical-device results or field INP. Click completion includes automation actionability checks. Cold-start transfer and CPU work still deserve attention; passing static bundle budgets does not establish fast perceived loading. Re-run after material dependency or loading changes and compare multiple samples under identical conditions.

## Reproducing the review

Run `node scripts/audit_visual_demands.mjs`, then `node scripts/build_active_image_priority.mjs --source-root=<checkout-with-local-catalog>`. The second command joins current resolver output to read-only catalog/health artifacts, writes a ranked queue, fetches only actual absolute public URLs, and reads local-only assets from source. It produces hashes and paged contact sheets under `output/image-quality/active-priority/`. It never changes runtime assignments or approves generation. Existing ledger entries must be reviewed again if their source or text changes.

## Verification notes

The final production build and route budgets pass (sentence builder: 925.8 KiB gzip, against a 1,200 KiB limit). The 162 affected browser checks passed without retries on WebKit, desktop Chromium and mobile Chromium. Audio reconciliation accounts for 96,358 transcripts with zero missing recordings, broken aliases, broken pronunciation references or removed originals. Secret scanning and the dependency audit pass. The existing live deployment doctor passed on recheck after one transient asset-fetch failure; direct checks also returned HTTP 200 for all 13 linked assets.

Changed files pass formatting. The repository-wide formatter still reports existing formatting differences and parser errors in unmodified legacy files (`repl.js`, a UTF-16 scratch script, and `scripts/append_bathroom_data.cjs`, an unterminated template). This change does not claim a clean repository-wide format check. The standard push hook is retained for the complete release verification suite.

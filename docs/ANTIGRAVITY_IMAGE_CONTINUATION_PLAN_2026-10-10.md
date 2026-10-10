# Antigravity: continue WordPix image generation

This is an implementation handoff, dated 10 October 2026. Read this before running a generation, upload, mapping, or release command. Its immediate goal is to complete a verified image inventory and generate only genuinely missing or unclear references with Gemini. The completed Numbers & Counting batch must be reused, not regenerated.

## 1. Current state and where to work

| Location                                                                   | State at handoff                                                                                                     | Required treatment                                                                                                                                                                                    |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix`          | Branch `codex/content-image-handoff`; reviewed source baseline `0465fd07241015a565fac6fe3b92b6155dbd4066`            | Use this reviewed source, or a clean checkout of the latest remote main. Verify actual HEAD before work.                                                                                              |
| `C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix` | Local main `732cfc3f`, 12 commits behind remote at inspection; many dirty files and untracked legacy helpers         | Preserve it. Do not reset, stash away, force checkout, overwrite, or commit its whole diff as a new release. Some changes duplicate already published work; six usage drafts contain older revisions. |
| `output/numbers-image-batch-40-2026-10-10/` in the reviewed worktree       | Complete local Gemini generation, original provider outputs, claims, all receipts, previews and earlier Figma drafts | Keep every file. This directory is ignored by Git and will not arrive through a clone.                                                                                                                |
| `docs/content-review/numbers-gemini-batch-40-2026-10-10/`                  | Durable tracked bundle: 28 selected WebPs, 40-item manifest, gallery, count audit and verification evidence          | This is the portable handoff. Open `gallery.html`; preserve original image references and all selected bytes. Not yet linked in the learner app or uploaded to R2.                                    |

At this baseline, source readiness is **864 approved lessons / 3,657 scenes / 200 units**, with zero content issues and zero holds. The freshly rebuilt all-unit usage queue reports **3,346 eligible scenes and 311 scenes with matching published references**, zero blocked and zero held. These numbers are not the number of new images to buy: the builder does not exhaustively reconcile word images, local approved candidates or every possible reuse. Do that reconciliation first.

A lesson approval is editorial evidence. It does not certify that every image is clear, that a file is deployed, or that a provider job should be repeated. Do not treat earlier historical counts such as “127 pending” or the 309-file October 8 corpus as current generation instructions.

The primary checkout has six older drafts: Classroom, Fruits, Market, Office Supplies, Supermarket and Vegetables. Compare each lesson/phrase by stable IDs with the reviewed branch. Preserve unique useful material in a dated draft archive; port an improvement only after content review and digest refresh. Never use those drafts to replace the repaired catalogs wholesale. Legacy untracked scripts and environment experiments must be inspected for secrets before any Git staging.

## 2. User decisions and hard preservation rules

1. **Use Gemini. Do not use Figma for now.** No Figma connection or reauthentication work is needed.
2. Reuse a clear, accurate existing image. Replace only unclear or incorrect images. If several images depict the concept, choose the clearest representative after inspecting them, not by filename.
3. Use varied geometric shapes for counting, not repeated dots. Exact counts are mandatory. Educational text, numbers, labels and symbols are allowed when needed to explain an abstract concept; they must be correct and readable.
4. People may appear moderately when necessary. Follow the user's current instruction not to add women. Prefer human-free references when the concept does not require a person. Do not remove older files because they do not meet the new preference.
5. Keep every local and R2 image/audio object, including rejected candidates and failed-job evidence. No deletion, rename, overwrite, destructive cleanup, bucket synchronization with deletion, or automatic media reupload.
6. **Audio files and audio mappings remain immutable.** No audio regeneration or “repair” within this task.
7. The latest `AGENTS.md` requires **R2 objects and content-ID/URL mappings to remain read-only**. Generation, local inspection, inventories, handoff artifacts and Git publication can proceed. This handoff does not authorize R2 mutation. Do not interpret “push changes” or image-review approval as permission to change a media mapping under that guardrail.
8. The user has standing visual approval while watching creation and does not want routine review questions. Perform independent visual QA and record that inspection separately from the user's standing approval. Escalate only a critical ambiguity, changed policy, unresolved charge or an actual required authorization; do not invent a named human reviewer or fabricate approval dates.
9. Existing lesson IDs, scene IDs, protected historical triples, Arabic content, learner progress, scoring and navigation are preserved. Do not renumber lessons or key progress by index.

Older preflight documentation enforces zero text for usage-reference jobs. The user has since allowed educational writing and graphics. Scope that exception to reviewed educational assets. Do not disable the existing guard globally or fabricate a usage-scene identity for a vocabulary-only job. The completed number batch was generated separately without changing usage lessons or bypassing their preflight.

## 3. Complete batch to reuse immediately

The 40-item batch contains **28 new Gemini illustrations** and **12 retained originals**. It was completed using `gemini-nano-banana-2.1`, 1K, landscape 4:3, eight concurrent requests. Raw responses were 1200 × 896; framing was preserved, with no artificial cropping to claim a different ratio. The selected WebPs occupy approximately 2.16 MB in the tracked bundle.

| Disposition                   | Words                                                                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Keep 12 original references   | One, Four, Five, Fourteen, Ninety, Hundred, Thousand, First, Second, Third, Seventh, Ninth                                               |
| 18 new exact-count references | Two, Three, Six, Seven, Eight, Nine, Ten, Eleven, Twelve, Thirteen, Fifteen, Sixteen, Seventeen, Nineteen, Thirty, Forty, Fifty, Seventy |
| 3 new ordinal references      | Fourth, Sixth, Eighth                                                                                                                    |
| 7 new operator references     | Addition, Subtraction, Multiplication, Division, Plus, Times, Divided By                                                                 |

Counts use triangles, squares, hexagons, pentagons, stars, diamonds and rectangles. Large counts use rows of ten. Every selected count image passed both visual inspection and a connected-colored-region audit against the rendered pixels. Three ordinal sequences read correctly from 1st through 8th and highlight the correct position. Seven illustrated equations have correct operands, groups and results. Automated component counting is supplemental and must never be used as a substitute for visual QA.

There were 34 paid API requests: 28 delivered images and six initial responses with no image. Those six were retried once with separate identities and a larger output-token allowance. Failed receipts and claims were retained. Successful-response usage gives an estimated **$1.2585** at the checked pricing; the six initial responses lack saved token metadata, so this is **not the whole invoice**. Do not report it as the final charge. Reconcile billing in the provider dashboard.

The tracked manifest records exact prompts, original SHA-256, selected SHA-256, raw SHA-256, model, dimensions, usage, literal visible descriptions, correction reasons and approval evidence. Raw provider files remain in the worktree output directory; use the manifest's local raw-output location if needed. If that directory is unavailable on another computer, use the tracked selected images rather than regenerating them.

Current publication state: **local/committed staging only**. None of these 28 selections has been added to the app's image-selection registry or R2. The presence of a Git image file does not mean the learner app displays it.

## 4. First actions: preserve, inventory, reconcile

Use one clean checkout for implementation, one batch owner and one queue at a time. Record source HEAD and target file ownership before concurrent work. Eight provider requests are fine; multiple sessions modifying the same manifest are not.

```powershell
Set-Location 'C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix'
git status --short
git branch --show-current
git fetch origin
git log -1 --oneline origin/main
node scripts/audit_image_generation_readiness.mjs --output=output/continuation-readiness.json
node --test scripts/tests/check-generation-preflight.mjs scripts/tests/check-gemini-scene-batch.mjs scripts/tests/check-image-review-policy.mjs
```

Do not execute existing local helper scripts blindly. In particular, `prepare.mjs` can recreate baseline files and the completed batch's `finalize-gemini.mjs`/bundle-preparation scripts use exclusive creation: rerunning them is not necessary. The local vocabulary runner is specific to this finished Numbers & Counting review; do not point it at a new unit without refactoring and reviewing its queue/validation.

Create a dated inventory without modifying original catalogs:

- Enumerate the 200 units in curriculum order from `src/app/data/curriculumSequence.ts`, their actual vocabulary entries, and `src/app/data/usage/*.usage.json`.
- Inspect `src/utils/assetUrl.ts`, `src/app/shared/assetUrls.ts`, `reviewedVocabularyImageSelections.json`, and all four scene-media manifests before interpreting paths. Resolve the image the app actually selects, including overrides, rather than inspecting only the original path.
- Build an index by `(unitId, concept/wordId, intended sense, imagePurpose)`. Do not merge homographs across senses, such as dishwasher worker/appliance, pepper ground spice/bell pepper, or different medical products.
- Index existing published references, selected vocabulary assets, local approved outputs, raw outputs, failed/pending claims and historical manifests. Compare SHA-256 as well as stable IDs; a matching scene ID does not prove which bytes were approved.
- Hash every protected local media file and audio-bearing mapping before work. Retain a dated baseline and verify it after each batch. The completed batch verified 12,695 protected files unchanged; that count is a baseline observation, not an eternal expected constant.
- Download remote references to a new staging filename only when necessary for asset inspection; use read-only requests, verify image decoding/MIME/length, and do not call media synchronization scripts.
- Classify each concept as `reuse-clear`, `local-approved-unpublished`, `needs-replacement`, `missing`, `needs-content-repair`, `held-policy`, or `provider-reconciliation-required`.

Suggested inventory record:

```json
{
  "unitId": "unit-slug",
  "wordId": "existing-stable-id",
  "sceneId": null,
  "sense": "specific intended sense",
  "purpose": "word-reference",
  "originalPath": "existing/read-only/path",
  "originalSha256": "actual-hash",
  "classification": "needs-replacement",
  "reason": "concrete visual defect",
  "candidatePaths": [],
  "sourceCommit": "actual-HEAD",
  "reviewStatus": "pending"
}
```

Report separate totals for clear reuse, staged assets, missing references and rejected replacements. Publish the audit result as the authoritative backlog before buying the rest. Do not generate 3,346 images simply because the usage queue reports them as eligible.

## 5. Order and size of subsequent batches

1. Preserve and package the complete number batch; do not spend on it again.
2. Reconcile already approved unpublished files and historical candidates; these can eliminate paid jobs.
3. Audit high-frequency A1–A2 concrete objects in curriculum order, then other CEFR stages. Give priority to visible sense/count/clock errors and misleading assessment support.
4. Review abstract/calendar/math words separately, with explicit educational text/diagram permissions and exact labels. Do not use a generic object to stand in for an invisible property or profession.
5. Handle specialist courses separately from the vocabulary path. They have independent IDs, media conventions and audio references.

Use **24–40 concepts per batch**, **eight concurrent requests maximum**, and **8–12 images per contact sheet**. One concept may produce no new image if clear reuse is available. Start a new content domain with a small representative pilot, inspect it, then run the remainder; a pilot is unnecessary for every subsequent batch of the same proven style. Set a finite request cap and inspect failures before retrying. A new prompt hash is not permission for an unlimited retry.

## 6. Content preparation and Gemini implementation

For usage-scene jobs, use the existing reviewed queue builder and runner:

```powershell
node scripts/build_image_generation_queue.mjs --units=unit-one,unit-two --output=output/batch-next-reviewed-queue.json
node scripts/generate_reviewed_scene_batch.mjs --queue=output/batch-next-reviewed-queue.json --source=. --model=gemini-nano-banana-2.1 --limit=40 --concurrency=8 --max-cost-usd=6 --output=output/batch-next-gemini
```

The second command is a **dry run**. Inspect its selected count, source digests, prompt integrity and request reservation. The `$0.15/request` reservation is not provider pricing or a guaranteed bill ceiling. Check current pricing at `https://ai.google.dev/gemini-api/docs/pricing` and remaining billing budget. At handoff, this model's standard 1K image output costs $0.0336/image, with separate input/text/thinking costs. Forty image outputs alone would be $1.344; the complete request cost is higher. Do not extrapolate an app-wide budget without an audited backlog and retry allowance.

Supply the credential privately through `GEMINI_API_KEY` or a private env-file argument, then add `--generate` to that reviewed command. Never echo keys, record `.env.local` in Git, or paste provider request headers into reports. Do not silently switch models. The user requested the inexpensive Gemini approach; use the same model unless it becomes unavailable or demonstrably unsuitable.

For vocabulary-only jobs, create a separate bounded queue with the inventory's real vocabulary identity and original image hash. Do not fake `lessonId`/`sceneId` to satisfy the usage runner. If promoting the local vocabulary-generation approach into reusable tooling:

1. Replace hard-coded worktree/env paths and number-specific prompts with explicit `--queue`, `--source`, `--env`, `--output`, `--limit`, `--concurrency`, `--model` and request-budget arguments.
2. Reuse the existing request format and hashing helpers; keep source validation appropriate to vocabulary records. Reject missing/duplicate IDs, traversal, unknown shapes, invalid counts, changed source hashes and empty prompts before network access.
3. Default to dry-run. Reserve budget before every submitted job; separately log estimated token cost and observed usage. A request cap must remain binding after retries.
4. Write an exclusive claim and a started receipt before POST. Request identity must include concept identity, source hash, prompt, model and relevant generation configuration, including output-token limit. The local finished-batch helper included variant in identity; new generic tooling should explicitly hash the request configuration too.
5. Use the existing Gemini `generateContent` endpoint, `x-goog-api-key` header and 1K 4:3 request. Preserve timeout/HTTP/finish-reason evidence without logging secrets or entire responses.
6. Capture `usageMetadata` and `finishReason` **before** checking for image parts, including no-image responses. Treat `MAX_TOKENS` separately from quota, safety, timeout and server failures. For timeout/unknown delivery, reconcile provider state before any new submission.
7. Validate decoded bytes and dimensions; save original provider output and selected WebP to unique immutable filenames with exclusive writes. Preserve framing. Do not overwrite a rejected variant with its correction.
8. Resume a completed matching-hash receipt without another API call. Failed/incomplete/orphan claims require reconciliation; never use an automatic retry loop. Exit nonzero for unresolved jobs.
9. Unit-test meaningful safeguards if introducing a reusable runner: zero-network rejection, duplicate-source/identity detection, claim collisions, receipt reuse, config identity, no-image usage capture and request-budget exhaustion. Do not write trivial tests that merely repeat implementation constants.

Prompt each asset around the actual sense, desired visible evidence and intended use. Prefer uncluttered, readable compositions; large main subject; accurate materials/anatomy; no brands, watermarks or unnecessary figures. For words requiring numbers or labels, list allowed text verbatim and explicitly forbid extra labels. For counts, list row sizes and forbid decorative objects. For operators, specify operand/group/result counts and the exact equation. For clocks, specify both hands and verify their positions. Hidden properties require truthful contextual explanation, not invented certification symbols.

## 7. Visual review and local deliverables

Inspect every selected image at full size; use contact sheets only for triage. Confirm the intended concept/sense, quantities, geometry, sequence, clock hands, equation, spelling, subject visibility, framing, appropriate people policy and absence of unwanted labels/logos. If comparing variants, record why one is clearer. For assessment images, verify that the rendered content actually supports the question without an answer highlight.

Author literal alternative descriptions only after viewing the actual render. Do not infer intent, invisible properties, prices, timing or guarantees from the prompt. A word-reference photo should not be described as proof of a whole scenario. Keep a description in the review ledger even if the runtime consumer currently uses the word as its accessible label; do not assume an unused metadata field will automatically improve accessibility.

Each dated batch should retain:

- Source inventory and protected hash baseline.
- Reviewed queue and exact prompts/model/request configuration.
- Exclusive claims, started/completed/failed receipts and token usage.
- Original provider output, selected compressed image and SHA-256 for each.
- Per-image accept/reject/defer reason, literal description and inspection date.
- Contact sheets and an accessible gallery with relative image links.
- Cost reconciliation with clear separation between image-output estimate, recorded-token estimate and provider-billed total.
- Verification/preservation receipt and concrete next backlog.

Copy selected deliverables and a sanitized portable manifest into a dated tracked `docs/content-review/` staging bundle so another checkout can continue. Never reference only an ignored `output/` path as the final remote deliverable. Keep raw/rejected files locally; do not delete them to save disk space. Avoid committing credentials, environment dumps, browser storage or unrelated personal data.

## 8. Publication remains a separate gate

Under the current R2/read-only mapping rule, stop publication after durable local/Git staging; continue useful audit and generation work. Do not run `assets:upload`, `assets:verify`, old `publish-approved.mjs` helpers, bucket-cleanup tools or automatic remapping. In particular, `assets:verify` is not a read-only audit: it can create/delete probe objects.

If the user later explicitly changes the read-only rule for new approved images, document that exact scoped authorization first. Only then implement publication with: hash-addressed new object keys; HEAD before create; a conditional create-only PUT; HTTP 412 treated as an existing-object case requiring byte equality; authenticated GET plus public GET hash checks; exclusive local copies; and additive selection records for previously unmapped concepts. Preserve every prior entry/value and every original asset. Do not reupload, replace, rename or delete an existing object. Audio remains immutable even if new image uploads are authorized.

Consult the current resolver and existing publication ledgers. `src/app/generated/reviewedVocabularyImageSelections.json` currently has seven entries that must be preserved. Four established scene manifests are also protected. Under any future scoped mapping exception, update the exact required consumer and prove the new display path; do not edit usage-scene URLs for a vocabulary-only replacement. Re-run source digest/preflight checks if content changes, and do not copy a prior review to a new source digest without actually reviewing it.

## 9. Git, release and deployment

Before Git staging, inspect the diff against the latest remote and scan new files for secrets. Use an isolated clean checkout. Never `git add -A` in the stale primary checkout. Stage exact verified files, retain unrelated drafts, and do not force-push or bypass hooks. If remote advances, fetch and reconcile normally, then rerun the checks affected by the merged changes.

Mandatory software/content verification order:

```powershell
npx tsc --noEmit
npx vitest run --maxWorkers=2
pnpm run lint
node --test scripts/tests/check-generation-preflight.mjs scripts/tests/check-gemini-scene-batch.mjs scripts/tests/check-image-review-policy.mjs
```

Before push, the repository pre-push hook also performs the production build and E2E matrix. Run it without bypass. Choose a free test port if another session is using the default, for example `WORDPIX_E2E_PORT=6198`, and retain the two-worker setting. Do not kill unrelated Node processes to make a port available. If tests fail, fix the cause or leave the push blocked with evidence; do not skip tests or modify the media guard to get a green result.

For a learner-visible software/media release, append bilingual entries in `src/app/data/releaseNotes.json`, preserving history, set both version fields consistently, update `notes`/`notesAr`, and run `node scripts/build_release_notes.mjs`. Commit both source and public release notes. Describe only images actually linked and shipped; do not announce locally staged images as available in the app. A documentation/staging-only handoff does not require inventing a learner release.

Pushing `main` deploys production. After an authorized push, run `pnpm run check:deploy` and `pnpm run check:doctor` without auto-fix, check Actions/Pages success, and compare live `build-info.json` with the exact pushed SHA. If media was shipped, inspect representative actual rendered images in English/Arabic and light/dark modes and test fullscreen/reference paths and asset GET hashes. No blanket WCAG AAA claim: criterion-by-criterion auditing is required. Preserve 7:1 text contrast, 44 × 44 targets, visible keyboard focus, programmatic labels and reduced-motion guards for any new UI.

## 10. Definition of a completed continuation batch

The batch is complete when all intended concepts have either a verified clear reused image, a visually accepted new staged image, or an explicit justified hold; every new file and receipt is saved; actual request/cost state is reconciled; original media/audio hashes still match; durable deliverables are committed/pushed; and any authorized learner release has passed deployment checks. Report generated vs reused vs held vs published separately. Report the next concrete inventory slice, not an unverified promise to regenerate the whole application.

Suggested first instruction for Antigravity:

> Read this plan and the tracked Numbers & Counting manifest. Preserve the dirty primary checkout, all local/R2 media and every audio mapping. Work from the reviewed latest remote source. Reuse the 28 completed Gemini files and 12 retained originals. Audit actual selected vocabulary references and approved local outputs across the 200-unit curriculum, publish a deduplicated backlog, then prepare and run the next bounded 24–40-concept Gemini batch at concurrency eight. Use exact senses, educational labels/shapes when needed, and inspect every render. Keep R2 and URL mappings read-only under the current rule. Save a portable reviewed bundle, run required checks, and push only verified changes. Do not ask routine review questions; report only critical blockers and real outcomes.

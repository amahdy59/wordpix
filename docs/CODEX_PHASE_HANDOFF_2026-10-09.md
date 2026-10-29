# WordPix Codex phase completion and Antigravity handoff

Updated October 9, 2026 (Africa/Cairo). This report separates shipped work from drafts. The entire curriculum and image backlog are not complete.

## Release status

| Batch                         | Implemented                                                                                                                                                                                                 | Verified/uploaded                                                                                                                                                            | Deployed                                                      | Remaining                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1 — reading and initial media | Continuous Business/Conversation reading, canonical bilingual Hadith reading, playback controls; 36 classroom/office scene mappings; 59 unmapped wording corrections                                        | Type checking, 2,779 tests, lint, build, 130 E2E checks; 36 create-only uploads checked byte-for-byte; production-origin recorded/offline playback checks                    | Live v0.1.9, 7aa8321c432ffcd680f6b6bfdfbaeeefe5fc349f         | Complete for the shipped scope; audio and full manual AAA audit remain open                                     |
| 2 — references and reuse      | 26 assets support 29 more lesson situations; descriptive captions; English/Arabic reference labels; vocabulary references excluded from whole-sentence support; generated/shared image URL routing repaired | Type checking, 2,784 tests, lint, build, 130 E2E checks; 29 new mappings uploaded with private/public byte verification; eight language/theme/viewport caption checks passed | Live v0.1.10, commit 11a51bbdb870ff045749ffe5e24eabcf546f6f7f | Complete for this release                                                                                       |
| 3 — next media batch          | 23 human-free physical assets prepared for 35 independently reviewed uses: 17 existing photos, six generated corrections, 12 additional reuse mappings                                                      | All directly visually reviewed; exact scene/question/answer evidence, hashes, names and captions recorded; publication dry run passed with zero writes                       | Not uploaded, not deployed                                    | Antigravity can publish this prepared batch after reconciling the checkout and rechecking exact source evidence |
| 4 — language improvements     | Six Airport phrase records fully drafted with stable IDs, English/Arabic meanings, patterns, checks, practice and evidence                                                                                  | Editorial review prepared; application checks not run because drafts have not been applied                                                                                   | Not implemented, not deployed                                 | Apply and verify the prepared phrases; review connected articles and ambiguous scenes                           |

Batch 2 commit: **11a51bbdb870ff045749ffe5e24eabcf546f6f7f**. CI: **Success — https://github.com/amahdy59/wordpix/actions/runs/37979605096**. Deployment: **Success — https://github.com/amahdy59/wordpix/actions/runs/37979605185**.
Live app: https://amahdy59.github.io/wordpix/ . The permanent release history includes bilingual v0.1.9 and v0.1.10 entries.

CI run 37979605096, Pages deployment run 37979605185 and deployment monitor run 37980327660 all completed successfully for this exact commit. Live provenance, all 14 script/style assets and deployment doctor passed. Production image/caption checks passed in English at 1280px and Arabic at 320px; live bilingual notes report v0.1.10.

## What changed for learners

- Business and Conversation readings flow as continuous passages, with vocabulary lookup and accessible recorded playback. Hadith retains its canonical Arabic and English as separate language regions on one reading surface.
- Playback supports pause/resume, speed, restart and keyboard seeking; device-speech fallback is labelled and does not invent a recording timeline.
- New reference photos show the vocabulary object clearly. Captions describe the visible content rather than inventing a full scenario. Shared images retain separate question evidence for each use.
- The new routing fix also makes the earlier generated v2 images load from the verified media origin.
- The existing adult-focused curriculum order, navigation, progress identities and earlier R2 objects/mappings are preserved.

The earlier session audit found older supposedly unpublished work already integrated into main; it was not duplicated. Four malformed unmapped scenarios containing “undefined” were corrected. Existing mapped fruit/vegetable scenarios were preserved rather than silently changing their media evidence.

## Inventory and quality findings

The initial inventory contained 3,657 usage scenes: 155 covered, 3,502 missing reviewed imagery, zero stale mappings in the isolated release snapshot. Batch 2 adds 29, leaving **3,473 missing reviewed scene images**. Publishing all 35 prepared Batch 3 uses would reduce that checkpoint to **3,438**, assuming content and coverage remain unchanged. These are scene counts, not unique physical-image counts.

Local discovery found 12,304 files in 204 word-image directories, 273 exact-scene candidates and 3,493 word-reference candidates. The 3,766 candidate records were prepared for automated triage. **2,976 candidates in 31 confirmed API jobs were collected**; another 790 candidates in nine groups have no confirmed server job. Never report all 40 groups as submitted or complete.

The API audit responses did not consistently follow the requested JSON schema. Their held status therefore often means schema/format rejection, not proof that the image is bad. Retain descriptions as triage only; visually review before approval. No catalog-wide automatic publishing occurred.

Specific findings:

- The supplied Fig photo depicted a mango, and the earlier Yuzu photo depicted a different citrus. Watercress carried readable text. Fig and Watercress replacements are approved; the new Yuzu remains held because its very knobbly rind leaves species detail uncertain.
- Boysenberry and Clementine candidates were held for wrong or insufficiently distinguishable features.
- Bedroom candidates contained readable book titles, an inaccurate alarm-clock dial, unnecessary people or child-oriented styling. Focused, human-free alarm-clock, glasses and backpack replacements are approved.
- A clearer conventional can-opener replacement is approved after implausible original tool details.
- These corrections apply to new usage-scene references. Existing vocabulary/library image URLs were preserved, so wrongly labelled original vocabulary photos are not all repaired by this release. Track those separately; the current authorization permits adding new verified assets/mappings, not replacing established mappings.
- **Dishwasher is a worker in the Restaurant definition, and an appliance in Kitchen. Do not reuse the machine image for the worker.** The Restaurant example “The dishwasher was used during the activity” also needs a natural human-role example.
- Hold cross-domain refrigerator/charger reuse where the depicted home appliance or adapter does not suit the intended context. The Market pepper scene has a fresh-vegetable context that conflicts with the ground-spice definition; resolve its sense before assigning a picture.
- The final production browser check logged a 404 for /wordpix/images/core/learner-avatar.webp. The new reference image loaded correctly. Track the separate missing avatar asset as a remaining UI asset issue; it was not repaired in this media release.

## Image rules for the remaining batches

Human-free by default; use people only for meanings that require an action, role, emotion, relationship, age or body part. A woman must be indispensable to the concept and wear hijab covering hair and neck, loose opaque full-length clothing and long sleeves. No incidental people, poster faces or unnecessary hands.

Use clear, uncluttered adult-learning compositions with realistic shapes and essential details visible on a phone. No written answer labels, readable book titles, logos or watermarks. Review the actual image independently of its filename.

Use descriptive physical asset names and hash-backed immutable keys. Write literal visible-content descriptions; do not claim an unobservable relationship, species or material by filename. A vocabulary-reference photo is not proof of an entire sentence or story. Reuse only after independently checking the target definition, question and domain; spelling alone is insufficient.

The user's recorded reply was **“Allow new verified assets and new mappings only”**. Preserve every existing R2 object and mapping. Existing mappings retain their exact scenario/question/answer evidence; changing that evidence can intentionally withhold an image. Do not replace old evidence merely to force a changed scenario to use its old photo.

## Language work ready for Antigravity

Prepared file: phase-handoff/language-drafts/airport.phrases.json. It corrects six records while preserving all IDs, lesson IDs, scene IDs and slots:

- “confirm the platform” → “check the gate number”.
- “Which platform does it leave from?” → “Which gate does the flight leave from?”
- “check in” uses the airline-registration sense, concrete patterns, the verb/noun spelling distinction and B1 placement. Cambridge marks the flight sense B1: https://dictionary.cambridge.org/dictionary/english/check-in and https://dictionary.cambridge.org/us/dictionary/learner-english/check-in .
- “collect your luggage” uses the practical example “After landing, collect your luggage at baggage claim.”

Airport gate sense was checked against Cambridge and Collins: https://dictionary.cambridge.org/dictionary/english/gate?topic=airports-and-landing-strips and https://www.collinsdictionary.com/dictionary/english/gate . Complete collocations and question wording are editorial decisions; no measured frequency ranking is claimed. Luggage sense: https://dictionary.cambridge.org/us/dictionary/english/luggage and https://www.oxfordlearnersdictionaries.com/us/definition/english/luggage .

The saved language-review document also proposes answerable airport/clothing/printer scenes and connected articles. The 3D Printer Lab article contains “At the the 3d printer lab” and repeats generic vocabulary lists. Replace it with a coherent task, concrete details, meaningful gist/detail/inference checks and a first production task using two or three target words. It has **not** been rewritten in this phase. Technical part relationships can be checked against Prusa's primary glossary: https://help.prusa3d.com/article/glossary-mini_125081 .

## API, budget and audio

The Gemini key was read from the primary .env.local without printing it. Gemini Developer API requests worked. The tested Vertex AI route returned SERVICE_DISABLED for aiplatform.googleapis.com; no cloud settings or billing configuration were changed.

Authorized maximum for image work: **$56.337**. The current policy/audit batch ledger records **$1.32191 estimated collected usage** plus **$3.16000 outstanding reservations**. Reservations are not charges. The ledger includes a small estimation buffer. It does not establish the live Google billing balance, whether eligible GCP credits paid a particular request, or complete historical spend. Earlier Flash image-generation receipts are retained separately in GENERATED_SCENE_MEDIA_REVIEW_2026-10-09.json; reconcile them before treating this ledger as the all-session total.

Models used: gemini-3.1-flash-image for the earlier targeted generation; gemini-3.1-flash-lite-image for later focused batch corrections and vision triage. Batched generation avoids per-image synchronous waits, but every resulting image still needs review.

The nine catalog groups 032–040 were conservatively reserved before dispatch; they have no confirmed batch identity. Inspect fresh server job listings and receipt identities before further submission. Do not blindly resubmit or erase their reservations. The large file-upload audit attempt timed out before batch submission; it has no model job and its model reservation was released. A remote uploaded file may remain; no deletion was attempted.

Business audio remains incomplete: the earlier inventory identified 1,483 missing items. The working ElevenLabs key had one character remaining; another tested key was unauthorized. Google image credits do not replenish ElevenLabs. Existing recorded Business/Conversation playback and offline caching were verified; device speech is the current fallback for missing readings. No audio mappings or R2 bucket/CORS settings were changed. R2 CORS configuration inspection was denied, while public media access succeeded.

The broader saved October 6 audio audit reports 12,262 pending corpus clips and 984,927 characters. It is a historical inventory, not a fresh claim about current bucket coverage. Reconcile it before a later audio batch.

## Where everything is saved

Primary project: C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix

Isolated release worktree: C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix

Branch: codex/reading-experience. Full release source, tests, scripts and immutable mappings are in that worktree and the published main commit. No PR was created.

Handoff root: C:\Users\AhmedMahdy\OneDrive - Advansys IS\Documents\Antigravity\WordPix\output\codex-completion-2026-10-09

- approved-images/ — initial 36 verified classroom/office images.
- image-policy-wave/ — Batch 2's 26 assets, 29 reviews and upload receipt.
- home-reference-wave/approved-images/ — Batch 3's 23 physical assets, arranged by unit and descriptive name/hash.
- phase-handoff/home-reference-reviews-35.json — the complete ready-to-publish 35-use review list with paths pointing to preserved primary-project copies.
- phase-handoff/language-drafts/ — prepared Airport JSON and status.
- phase-handoff/catalog-audit/ — 31 collected reviews, 40 receipt records, audit-group inventory and latest credit ledger.
- phase-handoff/backlog/queue.json — the original 3,502-missing scene queue. Rebuild against current source before treating it as current coverage.
- phase-handoff/reference-docs/ — image policy, exact reviews, language suggestions, reading report and AAA audit register.
- phase-handoff/verification/ — passing local release/caption evidence; final deployment evidence is added after rollout.
- phase-handoff/controller-snapshots/ — development controller snapshots for reference. They have worktree-relative imports and are **not** executable from this nested folder unchanged. Run the originals from the release worktree, or deliberately port their paths.
- phase-handoff/held-api-candidates/ — preserved initial pilot outputs and fruit correction candidates; these are not approval instructions. Cross-check the approved 35-use review before reusing any candidate.
- phase-handoff/status.json — machine-readable batch, backlog and budget status.

Never copy .env.local into the handoff, logs, commits or client bundle. No key values are included here.

## Checkout reconciliation and next actions

At inspection, the primary checkout was main at **732cfc3f136fd9252c99d99742c8a18db4ce279b** with uncommitted Classroom, Fruits, Market, Office Supplies, Supermarket and Vegetables content plus numerous untracked scripts. Those edits were preserved. It is behind the releases described here; it was not reset, stashed or fast-forwarded.

1. Inspect the live main commit and both working trees. Preserve Antigravity's uncommitted changes; reconcile them with the current release rather than overwriting either checkout.
2. Compare overlapping changes with published exact media evidence. Keep existing media mappings unchanged. Revise unmapped content first; separately plan safe identities for materially changed mapped content.
3. Use the 35-use prepared review file. Recheck it against the actual reconciled source; stale source evidence must trigger a new review. Do a publication dry run, then use the add-only publisher with private/public byte verification. Do not regenerate the 23 approved physical images.
4. Apply the six prepared Airport phrase corrections and verify the canonical loader, phrase checks, Arabic and release metadata together. Then address the remaining reading/scenario proposals in manageable themed batches.
5. Work through local candidates before paying for replacements. Use AI descriptions to sort, not approve. Calibrate strict structured output on a small sample before auditing the final 790 candidates. Fix controller dispatch receipts so reservation and confirmed network dispatch are distinct.
6. For each software release add bilingual permanent release notes, regenerate public notes and run the required TypeScript → Vitest → lint ladder, full pre-push gates and live exact-commit verification. Keep hooks enabled. Batch content/media work before release checks rather than running a full release for each image.
7. Keep a status table showing implemented, visually verified, uploaded, deployed and remaining. Full manual WCAG AAA testing remains open; automated checks do not establish conformance.

The Windows global Volta pnpm shim was broken in this environment. Verification used the bundled pnpm runtime with pnpm_config_verify_deps_before_run=false and the worktree's ignored output/tool-bin wrappers. E2E checks used two workers. Runtime recovery is a local tooling issue, not a learner-facing feature.

One repeated two-worker pre-push run passed 129 browser tests and timed out on mobile pronunciation feedback advancement. That test passed three consecutive isolated runs. The release retry uses one browser worker; its final result and live evidence are recorded above. No hook was bypassed and no test was removed.

## Why the phase took time

The source and publication work completed, but the mandatory release ladder and Git hooks repeatedly run type checks, the full test suite, production builds and 130 browser checks. Strict visual review also found incorrect images and unreliable audit response shapes. The remaining batches should reuse the preserved approved work, improve source evidence in bulk and keep generation/review separate from release verification. No further image batches are being started as part of this handoff.

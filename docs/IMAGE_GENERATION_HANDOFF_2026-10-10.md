# WordPix review, repairs and image-generation handoff

Updated **10 October 2026, Africa/Cairo**. This supersedes the October 8 image plan and October 9 phase handoff where they differ. Counts below describe distinct states: generated, visually approved, mapped and deployed. None of these states implies the others.

## Decision for the next agent

**Do content repair and source review before any new image request.** The reviewed changes repair concrete defects and add a generation gate; they do not certify the entire curriculum as linguistically or visually perfect. The next historical 129-scene batch has two published references and **127 remaining scenes blocked**. No new paid generation, upload, URL remapping, push or deployment occurred during this review.

The next agent should continue from `codex/content-image-handoff` in:

```text
C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix
```

Repair commit: **e77daec424726b1dd99b4473ac59ab6762117cff**. Verification results and their limits are recorded below. The branch starts from the exact production commit, not the older dirty primary checkout.

## Deployment and checkout status

| Item                                | Verified status                                                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production                          | [WordPix](https://amahdy59.github.io/wordpix/), version **0.1.10**                                                                                                         |
| Production and remote main SHA      | `11a51bbdb870ff045749ffe5e24eabcf546f6f7f`                                                                                                                                 |
| CI for that release                 | [Succeeded](https://github.com/amahdy59/wordpix/actions/runs/37979605096)                                                                                                  |
| Pages deployment                    | [Succeeded](https://github.com/amahdy59/wordpix/actions/runs/37979605185)                                                                                                  |
| Latest inspected deployment monitor | [Succeeded](https://github.com/amahdy59/wordpix/actions/runs/37991691796), same SHA                                                                                        |
| Fresh live checks                   | Exact `build-info.json` SHA, root container, SPA 404 fallback and all **14** discovered script/style assets passed; HTTP 200, nonempty bytes and appropriate content types |
| New local release metadata          | Bilingual **0.1.11**, dated October 10, prepared in source and regenerated public notes; **not deployed**                                                                  |
| Primary checkout                    | `main` at `732cfc3f136fd9252c99d99742c8a18db4ce279b`; older than production; preserved dirty drafts                                                                        |

Primary project root:

```text
C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix
```

Its six tracked drafts are Classroom, Fruits, Market, Office Supplies, Supermarket and Vegetables usage JSON. Untracked legacy runners and other work remain there. They were backed up, not stashed, reset or overwritten. Selected Market/Supermarket content was reconciled into the release-based repair branch while retaining existing media evidence. Do not blindly copy the primary files over this branch or fast-forward the primary checkout through its drafts.

No PR was created. A local branch/commit is not a remote deployment. Before eventually shipping, follow the release skill, preserve bilingual release history, run release gates with hooks enabled, push only with authorization and verify the exact new live SHA. Current live HTTP checks do not constitute fresh authentication, offline-sync or full manual accessibility certification.

## Repairs implemented before this report

| Area                               | Concrete changes and limits                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Airport phrases                    | All **12** records retain their identities and slots. Platform wording becomes gate wording; timetable/service wording becomes departure-time/flight wording. Airline `check in` uses its flight-registration sense and distinguishes verb `check in` from noun/adjective `check-in`. Luggage remains uncountable. Journey `set off` and `board the plane` use B1 teaching placement, concrete grammar and matching Arabic. Whole-phrase difficulty remains an editorial judgment. |
| Office/Printer phrases             | **30** records now have concrete patterns, including separable `bring it up`, `back them up`, `shut it down`; nonseparable `go over`; `log in to`; meeting-minutes sense; uncountable software; meeting scheduling. Evidence links point to relevant headwords/senses instead of guessed whole-phrase pages.                                                                                                                                                                       |
| Airport usage                      | **14 of 16** scenes rewritten as concrete adult travel situations, with question evidence, readings and matching exercises. Two existing mapped scenes retain their protected source evidence and still need separate future editorial treatment.                                                                                                                                                                                                                                  |
| 3D Printer Lab                     | **21** scenes and **6** readings rewritten around concrete parts/design tasks; questions and exercises match. Technical vocabulary is descriptive, not chemical-handling or machine-operation advice.                                                                                                                                                                                                                                                                              |
| Market                             | **29** scenes and **6** connected readings repaired. Fish is at a seafood counter, not a bakery; pepper explicitly means ground black pepper, not capsicum. The written story identifies roles, dialogue and payment meaning.                                                                                                                                                                                                                                                      |
| Supermarket                        | **25** coherent readings preserve the lesson targets. Quantity questions no longer pretend a photograph proves a pint/gallon. Gluten-free, non-GMO, promotional offers and payment questions use explicit written information. Wheat-free is not treated as gluten-free; organic/natural appearance does not establish non-GMO status.                                                                                                                                             |
| Classroom/Fruits/Office/Vegetables | Current scene questions and short-answer exercises include the full scenario and agree with their answers. Office readings retain actual lesson vocabulary. Stale briefs were replaced with source-specific instructions and reference-purpose limits.                                                                                                                                                                                                                             |
| Restaurant                         | `dishwasher` means a **worker** in this unit. Its scene and bilingual dictionary example now say the worker washes plates, rather than “was used during the activity.” Kitchen’s appliance sense remains distinct. Other Restaurant template scenes remain blocked for later review.                                                                                                                                                                                               |
| Repeated wording                   | Duplicated articles repaired across affected readings and unprotected source text. Protected mapped evidence was restored where changing it would invalidate an existing image. No reading retains `the the`; a protected Tailor Shop scene still has inherited wording and needs a separately planned identity/content remedy.                                                                                                                                                    |
| Default avatar                     | Home/Profile render an accessible initial directly, eliminating the known missing portrait request. Accessible names/default initials are localized in English/Arabic and preserve complete Unicode characters. No portrait generation is needed for this fix.                                                                                                                                                                                                                     |

The final article pass also repaired **399 occurrences of “a adult” across 311 lessons** to “an adult”, with no protected source conflict. This error is now rejected by the generation preflight.

Original target/lesson IDs and progress identities are retained. All **174** media mapping entries still match their protected scenario/answer and recorded question where present. Existing R2 references, objects and mappings were not edited. Prepared 35-use references also retain matching source evidence.

New briefs/alternatives in unillustrated source are authoring placeholders. Final alternative text must describe an actually reviewed image before publication; do not publish the placeholder as a visible-content description.

Fresh primary-source checks support the distinctions above: [airline check-in](https://dictionary.cambridge.org/dictionary/english/check-in), [journey set off](https://www.collinsdictionary.com/dictionary/english/set-off), [board senses](https://www.collinsdictionary.com/dictionary/english/board), [B1 Preliminary vocabulary list](https://www.cambridgeenglish.org/Images/506887-b1-preliminary-vocabulary-list.pdf), [dishwasher’s worker/appliance senses](https://www.oxfordlearnersdictionaries.com/definition/english/dishwasher), [pint and regional capacities](https://www.oxfordlearnersdictionaries.com/us/definition/english/pint), [gluten-free meaning](https://dictionary.cambridge.org/us/dictionary/english/gluten-free). Definitions support senses; they do not verify every authored sentence or prove sentence-level CEFR.

HTTP checks of the repaired phrase references found **47 unique URLs**: 27 were directly reachable, 20 Collins URLs returned anti-bot HTTP 403. No 404 was observed. Several Collins pages were independently accessible through web retrieval. A 403 is not semantic approval or proof a link is broken; retain the reachability log and perform relevant source review rather than replacing blocked links arbitrarily. Earlier phrase approval metadata is historical and does not satisfy the new generation gate.

## Remaining content work: answer before generating

**Yes, further phrases, sentences, readings and exercises still need fixing.** A full automated scan covers **200 units, 864 lessons and 3,657 usage scenes**. Under the new detector, **700 lessons have at least one recurring content defect**; the other **164 need whole-lesson review**, even though the detector found no listed defect. There are **zero newly issued digest-bound generation approvals**. Passing tests verifies structural/regression contracts, not complete language accuracy.

The phrase corpus contains **1,246 records**; **1,200** still use one of the detected generic grammar-pattern templates. These patterns need actual grammatical guidance, sense-specific English/Arabic review and defensible teaching-level placement. Do not mistake their old `approved`/`verified-online` labels for current whole-lesson image readiness.

The separate broad historical-content heuristic still finds **1,594 generic scenarios** and **407 generic readings** in the repaired source. These counts use a different detector from the 700-lesson readiness result and must not be added together. The detailed readiness JSON identifies exact lessons and reasons, including template questions, generic scenarios/readings, weak model answers, repeated wording, duplicate options or empty answers and generic phrase patterns.

Prioritize the bounded next batch rather than attempting a blind global rewrite:

| Unit                  | Historical plan | Already published reference | Remaining blocked |
| --------------------- | --------------: | --------------------------: | ----------------: |
| Everyday Clothing     |              17 |                           1 |                16 |
| Accessories & Jewelry |              17 |                           1 |                16 |
| Footwear              |              17 |                           0 |                17 |
| First Aid Room        |              39 |                           0 |                39 |
| Pharmacy              |              39 |                           0 |                39 |
| **Total**             |         **129** |                       **2** |           **127** |

Covered IDs are `everyday-clothing-1-usage-scene-1` and `accessories-jewelry-1-usage-scene-1`. The five-unit queue currently has **0 ready jobs**. Repair their actual scenarios, readings, phrases and exercises, review the complete lessons, then build fresh prompts. Medical vocabulary should teach language/equipment identification without inventing treatment advice or claiming clinical facts from a picture. Clothing/specialist vocabulary requires sense and CEFR review rather than assuming every item is A1 because of the batch title.

Protected images with inherited weak wording require a separately designed remedy that respects immutable media identities. Current `AGENTS.md` explicitly makes R2 references read-only. The older handoff’s suggestion to publish new mappings does not grant permission to do so in this task. Existing incorrectly labelled Fig vocabulary imagery also remains a separate issue; the approved usage reference does not replace that vocabulary mapping.

## Image inventory and actual deployment

Production and the repaired branch have the same scene coverage: **184/3,657 covered**, **3,473 missing reviewed image support**, **zero stale mapped entries**. There are **174 mapping entries and 28 source image paths**; 18 overlap mapped scenes, so the paths add **10** other covered scenes. Missing means absent valid reviewed support, not necessarily absent candidate files. These are scene-use counts, not unique artwork counts.

The older primary checkout has **119 covered / 3,538 missing** and only 109 mapping entries. Use the production-based branch for current counts. The older 3,502-missing queue predates v0.1.10. Do not subtract 309 generated files from 3,473 missing scenes: many files are unapproved, stale, overlap published IDs or represent reusable references.

| Cohort                   | Physical assets/use counts                                                                                                             | Status                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| v0.1.9 initial media     | 36 added scene uses; prior handoff records 15 approved existing files plus 21 accepted replacements, with one rejected generated cover | Published and deployed historically; retained unchanged                                     |
| v0.1.10 references       | 26 physical assets supporting 29 additional scene uses                                                                                 | Published and deployed; exact SHA verified live                                             |
| Prepared next references | **23 unique physical assets for 35 uses**: 17 existing photos, 6 generated corrections, 12 additional reuse uses                       | Approved in prior direct review; files/hashes/source freshly checked; not uploaded/deployed |
| Historical bulk corpus   | **309 WebP files**, 29,303,916 bytes, all 1024 × 1024, all nonempty, all registry hashes match                                         | Manifest says pending visual review; not bulk-approved or bulk-deployed                     |
| This repair review       | 0 generated images / 0 uploads / 0 new mappings                                                                                        | Source and tooling repairs only                                                             |

The 309-file corpus by unit:

| Unit            |   Files | Original manifest source mismatches against repaired branch |
| --------------- | ------: | ----------------------------------------------------------: |
| Basic Emotions  |      14 |                                                           0 |
| Bathroom        |      16 |                                                           0 |
| Bedroom         |      12 |                                                           0 |
| Classroom       |      22 |                                                          22 |
| Days & Months   |      17 |                                                           0 |
| Fruits          |      11 |                                                          11 |
| Kitchen         |       9 |                                                           0 |
| Living Room     |      13 |                                                           0 |
| Market          |      29 |                                                          29 |
| Office Supplies |      14 |                                                          14 |
| Supermarket     |     123 |                                                         120 |
| Telling Time    |      17 |                                                           0 |
| Vegetables      |      12 |                                                          12 |
| **Total**       | **309** |                                                     **208** |

The 208 mismatch count compares original scenario/answer evidence. It does not mean every file must be regenerated: an independently reviewed image may still fit the repaired concept as a word reference. Conversely, a matching old scenario does not make the content or photo good. Fifty-seven historical generated scene IDs now have valid published support, but that does **not** prove the original 57 generated files were the published or approved bytes; compare asset hashes, not scene IDs alone.

The historical seven-group pipeline lists 438 scenes: 309 local files and 129 queued. Groups 1–5 contain 67 room/time, 17 calendar, 14 emotion, 36 classroom/office and 175 food files. Groups 6–7 contain the 51 clothing/accessory/footwear and 78 medical scenes above. Pipeline fields and generated-manifest source snapshots differ; neither is an authoritative current prompt queue. Preserve both as evidence rather than rebuilding them over their history.

## Visual findings and images to hold

All six contact sheets were inspected as triage, not as 309 individual full-size approvals. Three high-risk originals were also inspected full size:

| Asset                               | Finding                                                                                                         | Next action                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `market-2-usage-scene-1.webp`       | Shows a fresh bell pepper, an unnecessary woman and a background person; repaired target is ground black pepper | Reject for the repaired sense; find a human-free spice reference              |
| `supermarket-7-usage-scene-5.webp`  | Large readable “FLOUR” answer label and unnecessary hands/person                                                | Reject under no-readable-text policy; use an unlabelled accurate reference    |
| `supermarket-24-usage-scene-3.webp` | Grain package/butterfly-style mark cannot prove genetic modification status and suggests certification          | Hold; written context teaches the meaning; no fabricated certification symbol |

Broader contact-sheet findings include readable books/charts/screens and packaging, calendar grids/month names/highlight circles, sale signs, incidental people and uncertain plant species. Telling-time files require exact clock-hand checks, not sunset-based inference. Month/day, emotion, price, product composition and capacity often need written context. Zero textual labels and a task that requires reading a label cannot both be satisfied by the photograph; redesign the task first.

The prepared 35-use list contains approved replacement Fig and Watercress references, alarm-clock/glasses/backpack references and a conventional can opener. All **35 source uses match** this branch; all files and hashes pass; no need to regenerate their **23 assets**. Primary Supermarket draft scene `supermarket-2-usage-scene-5` conflicts with this prepared record; its reviewed release wording was preserved on the repair branch.

Retain held Yuzu (species/rind uncertain), Boysenberry and Clementine candidates. Do not publish by filename. Cross-domain holds remain for the Pharmacy refrigerator and Computer Lab charger; review definition/context and depicted equipment. Restaurant dishwasher’s source is now fixed, but an appliance photo is still invalid for the worker.

## Generation requirements and safe resume commands

Read [the permanent preflight workflow](C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix/docs/IMAGE_GENERATION_PREFLIGHT.md). The trusted runner is [generate_reviewed_scene_batch.mjs](C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix/scripts/generate_reviewed_scene_batch.mjs). The older primary `generate_scene.cjs`, `run_batch_auto.cjs` and `run_batch_fast_parallel.cjs` do not enforce the new review gate; do not use them.

```powershell
Set-Location 'C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix'
git status --short
git branch --show-current
node scripts/audit_image_generation_readiness.mjs --output=output/image-generation-readiness.json
node scripts/build_image_generation_queue.mjs --units=everyday-clothing,accessories-jewelry,footwear,first-aid-room,pharmacy --output=output/next-review.json
node --test scripts/tests/check-generation-preflight.mjs scripts/tests/check-gemini-scene-batch.mjs
```

After real content repairs, take the relevant `reviewTemplates` into a file with an `items` array. Record reviewer/date, two distinct relevant HTTPS sources and approve all eight checks: scenarios, questions, reading, exercises, image briefs, CEFR, Arabic and phrases. `lessonSha256` covers the full lesson plus its phrase records. Do not fabricate approvals. Any subsequent source edit invalidates them.

```powershell
node scripts/build_image_generation_queue.mjs --units=everyday-clothing --reviews=output/clothing-approved-reviews.json --output=output/clothing-reviewed-queue.json
node scripts/generate_reviewed_scene_batch.mjs --queue=output/clothing-reviewed-queue.json --source=. --limit=1 --concurrency=1 --max-cost-usd=0.15
```

These commands make zero image-service requests without `--generate`. The current empty queue exits 1 with “Provide a nonempty scene queue”; that is expected withholding, not a retry instruction. The paid runner checks source and complete reviews again immediately before requests. Retained claims/receipts prevent blind automatic retries; any uncertain/failed job returns failure. Reconcile old receipts/server jobs before changing a prompt/model or starting a second run.

Requirements for any later authorized generation:

- Current approved source/digest and separately inspected prompt; existing candidate/reuse inventory checked first.
- A working Gemini Developer API credential supplied only by environment/private env file, current quota and model availability, current pricing and reconciled spending permission. No credential belongs in reports, logs, commits, media manifests or client bundles.
- Realistic adult-learning images, human-free by default. A necessary non-gender-specific role uses one modest adult man. A specifically indispensable woman wears hijab covering hair/neck and loose opaque full-length clothing with long sleeves. No incidental people.
- No readable words, answer labels, logos, watermarks or answer highlighting. Exact concept/sense/count/clock details must remain visible at mobile size. Current requests specify 4:3 landscape and preserve framing; old square files must be reviewed as square references, not cropped into compliance.
- An independent full-size visual decision for every use, literal final alternative text, SHA-256 and exact question/answer evidence. Word references support vocabulary; they do not prove full stories or hidden properties.
- Separate lawful publication authorization consistent with the read-only R2 guardrail. This report is not an upload/remapping instruction.

Google’s [current image-generation documentation](https://ai.google.dev/gemini-api/docs/image-generation) can change. The runner allowlist currently contains `gemini-3.1-flash-image`, `gemini-3.1-flash-lite-image` and `gemini-nano-banana-2.1`; do not silently switch models. The runner’s $0.15 per-request allocation is a local reservation policy, **not verified provider pricing or a guaranteed invoice ceiling**. Its summary now reports `reservedCostUsd` with an explicit cost basis, replacing the misleading `reservedCostUpperBoundUsd` field. Adjust any private consumers of the old summary field; none exist in the tracked source.

## Existing jobs, budget and adjacent blockers

The prior catalog audit has **2,976 candidates collected from 31 confirmed jobs**. Another **790 candidates in groups 032–040 have no confirmed server job identity**. Reservations alone do not prove dispatch or billing. Check server job identities/status before resubmitting; preserve uncertain receipts. Schema rejection of an AI audit response is not proof an image is visually bad, and an AI description is not visual approval.

Historical authorized image-work maximum: **$56.337**. The prior audit ledger records **$1.32191 estimated collected policy/audit usage** and **$3.16 outstanding reservations**. These numbers are not fresh charges or verified remaining balance. Earlier Flash-generation spend is separate and must be reconciled. This review made no paid image calls and verified no live billing balance. Do not calculate “remaining budget” by subtracting only the audit ledger from the authorization.

The historical Vertex route returned `SERVICE_DISABLED`; do not change cloud/billing configuration to bypass it. The previously working ElevenLabs key had one character left; image credits do not replenish it. Historical Business audio backlog was 1,483 clips; the broader October 6 plan had 12,262 pending clips/984,927 characters. These audio numbers require a fresh dry-run inventory and are not today’s verified balance or corpus status. R2 CORS inspection was previously denied; public asset access worked. No R2 configuration changes were made.

## Verification and evidence files

The mandatory final sequence passed in order: TypeScript, the complete unit suite, then lint. Production build and bundle budgets also passed. The full browser suite passed before the final article-only source correction; the final content/loading browser subset was repeated afterward.

| Check                                | Result and evidence                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript                           | `npx tsc --noEmit`: passed; `typecheck-final.log`                                                                                                                      |
| Complete Vitest suite                | **2,788 tests passed across 142 files**, bounded to two workers on Windows; `vitest-final.log`                                                                         |
| ESLint                               | `pnpm run lint`: passed with zero reported errors; `lint-final.log`                                                                                                    |
| Production build                     | `pnpm run build`: passed; `build-final.log`                                                                                                                            |
| Bundle budgets                       | All configured budgets passed; `bundle-budget.log`                                                                                                                     |
| Generation guards                    | **12 tests passed**; `guards-final.log`                                                                                                                                |
| Full desktop/mobile browser suite    | **130 tests passed**, including configured accessibility, responsive and localization checks; `e2e-final.log`                                                          |
| Final content/loading browser subset | **14 tests passed** after the last source correction, including cached offline loading; `e2e-content-final.log`                                                        |
| Scoped formatting                    | All 120 repair files passed the changed-file check; `prettier-changed.log`                                                                                             |
| Secrets                              | **15,396 tracked/new files inspected**, no credential findings; `secrets-final.log`                                                                                    |
| Identity/media/history invariants    | All **864 lessons, 3,657 scenes, 28 source image paths**, phrase IDs/slots, target words and previous release entries preserved; zero defects; `invariants-final.json` |
| Image provenance and source evidence | 309 original files and all 35 prepared uses pass hashes; all 174 mapped source entries remain current; dated audit JSON files                                          |
| Live release evidence                | Exact production SHA and 14 linked assets pass; `audit/live-exact-final.log` in the bundle                                                                             |

Git's pre-commit hook ran ESLint/Prettier normally for the repair commit. No test was skipped or weakened and no hook was bypassed. The default unbounded unit run initially hit a Windows worker crash; the complete bounded rerun passed. The final code/content commit is the SHA above; the later handoff-document commit changes documentation only.

Formatting was checked repository-wide and exposed pre-existing formatting debt plus parser errors in legacy `repl.js` (UTF-16 text) and `scripts/append_bathroom_data.cjs` (unterminated template). These obsolete helpers are outside the image-generation path and were left intact. All changed repair files pass the scoped Prettier check; formatting the nine rewritten usage JSON files was verified to leave all **200 parsed usage files semantically unchanged**. Do not run those legacy migration helpers as part of resumption. The full formatter is not claimed green.

Full manual WCAG 2.2 AAA conformance remains unverified. The avatar changes retain semantic tokens, introduce no interactive targets/motion and localize the image role. Automated axe checks cover only their configured criteria, not all AAA requirements.

Current evidence root:

```text
C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix/output/review-handoff-2026-10-09
```

It contains `inventory.json`, `generated-assets.json`, `prepared-assets.json`, `missing-scenes.json` (all 3,473 current missing IDs with source), `pending-pipeline.json`, `generated-contact-1.png` through `generated-contact-6.png`, `backup-primary/` and `live-exact-final.log`. Its `release` field now refers to the repaired production-based branch; it is not a claim these content edits are deployed.

Current branch verification/review root:

```text
C:/Users/AhmedMahdy/.codex/worktrees/reading-experience/WordPix/output/image-handoff-repair
```

It contains `readiness-final.json` (864 lessons and exact digests/issues), `next-batch-queue.json` (127 blocked, 2 covered, 0 ready), `repaired-language-review.json` (20 lessons, 64 blocked scenes, 16 covered), phrase-source reachability evidence and final test/build/browser logs. One-off `output/repair-*.mjs` scripts are historical transformation helpers; do not rerun them over the finished source.

Preserved image/history root:

```text
C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix/output/codex-completion-2026-10-09
```

`phase-handoff/home-reference-reviews-35.json` is the exact 35-use record. `home-reference-wave/approved-images/` contains the 23 approved physical images. `phase-handoff/catalog-audit/` contains prior receipts/results/credit ledger; `phase-handoff/reference-docs/` contains visual decisions; `phase-handoff/verification/` contains historical release evidence. The old `status.json` and Airport draft are historical; the twelve repaired phrase records are now in current source.

The 309 originals are under the primary `output/illustrations/generated/`; their manifest and `r2-deployment-registry.json` are provenance/planning records, **not proof of upload**. Older sentence-builder/gap-fill inventories counted 11,765 and 10,310 exercise records respectively; they are not current counts of unique missing artwork and require separate source/task audits.

## Portable handoff bundle

Send this report together with `wordpix-image-handoff-2026-10-10.zip`:

```text
C:/Users/AhmedMahdy/OneDrive - Advansys IS/Documents/Antigravity/WordPix/output/image-handoff-2026-10-10/wordpix-image-handoff-2026-10-10.zip
```

The bundle contains this report, the permanent preflight guide, the committed repair patch, all 309 original candidate WebP files, all 23 physical assets for the 35 prepared reviewed uses, available held candidates, six contact sheets, current inventories/blocked queues, verification logs and selected historical job receipts. It contains no private environment files or credentials. `bundle-verification.json` beside the ZIP records its byte length and SHA-256; the packaging check verifies every ZIP member's CRC and every indexed asset's SHA-256.

On another host, use `asset-index.json` to translate historical absolute `sourceFile` paths into archive paths. Historical review records remain unchanged; do not rewrite them simply to resolve paths. Check each file hash before use. A hash match preserves provenance; it does not change an image's approval or hold status.

If the branch is unavailable, start a clean checkout at production SHA `11a51bbdb870ff045749ffe5e24eabcf546f6f7f`, create a `codex/` branch and run `git apply --check <extracted-bundle>/repairs.patch`, then `git apply <extracted-bundle>/repairs.patch`. Inspect the applied diff and run verification before continuing. Do not apply the patch over primary's dirty drafts. The report is provided separately as `REPORT.md`; the patch contains the software/content repair commit.

The Windows global Volta `pnpm` shim failed in this session. An ignored local wrapper at `output/tool-bin/pnpm.cmd` invokes bundled Node/Pnpm. For this host, prepend that directory to `PATH` before invoking Git hooks, or repair the runtime normally. `pnpm_config_verify_deps_before_run=false` avoids the local dependency-check prompt. No hook was disabled. On another host, install the repository's pinned dependencies normally rather than copying `node_modules` or private runtime files from this bundle.

## First actions for the receiving agent

1. Confirm branch/commit and preserve the dirty primary checkout. Inspect this repair diff before making more changes.
2. Use the readiness report to select one bounded unit; repair actual language, senses, CEFR, Arabic and assessments. Start with the 127 unillustrated clothing/medical scenes, not the obsolete 129-job queue.
3. Reuse the approved 23 physical assets for their 35 reviewed uses where source still matches. This is review/planning only under the current R2 guardrail.
4. Check original candidates against repaired meaning at full size. Keep rejections/holds; never equate generated filenames with approval. Review Yuzu, charger and medical refrigerator holds separately.
5. Reconcile the 31 confirmed and 9 unconfirmed catalog groups and all generation spend before a paid request. Then issue a small, reviewed dry run and inspect every prompt.
6. When authorization and all checks permit generation, generate a small batch, independently review actual outputs and retain receipts/hashes/alternative text. Keep generation, approval, publication and deployment status separate.
7. For any later release, preserve bilingual notes, run the required checks and exact-commit deployment verification. Do not report curriculum completion, perfect imagery or AAA conformance from these automated passes.

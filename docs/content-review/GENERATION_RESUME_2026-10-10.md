# Curriculum revision and generation resume

Current source: `codex/content-image-handoff`, 10 October 2026 (Africa/Cairo).

The tracked ledgers bind all 864 written lessons in 200 units to current lesson,
phrase and bilingual-catalog digests. The readiness audit finds 3,657 scenes and
zero detected content issues. These are editorial and automated-check results,
not certification of perfect language, image approval or WCAG AAA conformance.

## Image scope

The historical 129-scene scope now contains 86 eligible jobs, 41 explicit visual
holds and two existing references. Clothing/accessories/footwear contribute 49
eligible jobs. First Aid and Pharmacy contribute 37 eligible jobs; their other
41 compositions cannot distinguish substance, temperature, clinical condition,
role or service without labels or hidden claims. Ten additional number scenes
are held under the strict no-readable-text rule. Written tasks remain available.

Holds are stored in source as `imageGenerationHold` and bound to review digests.
Queues separate holds from missing/stale content reviews. Paid preflight rejects
holds even if a historical queue contains them. Numeric glyph exceptions are
removed from current data and prohibited in both source schema and prompts.
No R2 object or content-ID/URL mapping is changed or authorized by this work.

## Safe first batch

```powershell
node scripts/build_image_generation_queue.mjs --units=everyday-clothing,accessories-jewelry,footwear --output=output/content-finish/clothing-queue.json
node scripts/generate_reviewed_scene_batch.mjs --queue=output/content-finish/clothing-queue.json --source=. --limit=3 --concurrency=1 --max-cost-usd=0.45
```

The second command is a zero-request dry run. A paid run additionally requires
reconciliation of prior receipts/jobs and spending, a confirmed provider model,
current pricing and quota, and an authorized remaining budget. The runner's
$0.15/request is a local reservation, not verified pricing or an invoice ceiling.
Google's [current pricing](https://ai.google.dev/gemini-api/docs/pricing), checked
10 October 2026, lists the configured `gemini-3.1-flash-image` at $0.067 per 1K
image, plus input and text/thinking charges. This public price does not establish
the account's remaining balance or quota. The historical local ledger records
$1.32191 collected audit usage and $3.16 reserved across nine unresolved groups;
it omits separately incurred image-generation charges. Do not infer remaining
spending permission from it. Preserve groups 032–040 pending provider reconciliation.
Start with three distinct garments, inspect actual files independently, write
literal alt text and retain hashes/receipts. Generation does not authorize R2
publication or URL mapping. Never rerun old primary-checkout generation helpers.

## Preservation and release

The six older primary-checkout drafts are copied byte-for-byte with hashes and a
patch under `output/content-finish/primary-drafts/`. Their source checkout remains
untouched. They are divergent historical drafts, not replacements for the
reviewed worktree. Any later reconciliation must inspect individual differences.

The ignored `output/full-content-review/` helper tree is preserved locally and
archived as `output/content-finish/editorial-helpers-2026-10-10.zip`; a tracked
inventory records paths, byte counts and SHA-256 hashes. Keep that archive with
the workspace backup. Transformation helpers are historical, not resume commands.

Bilingual release 0.1.12 records the curriculum and Arabic support revisions;
all older release entries remain intact. Before release, run TypeScript, full
Vitest, lint, generation guards, build and browser gates. The pre-push workflow
now includes all generation guards and bounds Vitest to two workers on Windows.

## Final verification

The complete `pnpm run verify:prepush` passed in 595.6 seconds, in the required
TypeScript → Vitest → lint order, followed by generation guards, production
build and the complete browser suite. Results: 144 Vitest files / 2,811 tests,
23 image guards and 130 desktop/mobile browser tests passed. Bundle budgets and
the generated-content shard check passed separately. The secret-hygiene check
inspected 15,431 tracked/new files and reported no findings.

The preservation check confirms 864 lesson identities/orderings, 3,657 scene
identities, 184 protected source triples, 28 existing source image paths and all
prior release entries remain intact; media manifests have no diff. Every archived
helper matches its original SHA-256 and every primary draft matches its backup.

Evidence is retained in `output/content-finish/`: `prepush.log`,
`image-guards.log`, `bundle-budget.log`, `invariants.json`, `readiness-final.json`,
the bounded queues, `first-three-prompts.json`, draft/hash inventories and
`budget-reconciliation.json`. The deployment doctor reports the existing live
release healthy; this does not mean these local changes are deployed. No main
push, paid generation, R2 upload or URL remapping occurred in this continuation.

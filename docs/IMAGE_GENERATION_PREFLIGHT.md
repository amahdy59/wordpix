# Image generation preflight

Use the current usage source, not the historical October 8 pipeline, to prepare new image jobs. Generated files, provider receipts, visual approval and publication are separate states. A file on disk is not an approved learner image.

## Required order

1. Reconcile existing approved images and previously submitted provider jobs. Do not regenerate a published or approved asset. Never touch R2 objects or existing content-ID/URL mappings under the current agent guardrail.
2. Review the complete lesson: vocabulary senses, scenario, question/options/answer, reading, exercises, English/Arabic phrases, grammar, CEFR placement and image briefs. Rewrite generic or ambiguous content before requesting images. Check at least two relevant primary dictionary/grammar sources; record precisely what each supports. A headword page does not establish whole-sentence frequency or CEFR.
3. Run the readiness audit and build a bounded queue. Neither command contacts a generation service:

```powershell
node scripts/audit_image_generation_readiness.mjs --output=output/image-generation-readiness.json
node scripts/build_image_generation_queue.mjs --units=everyday-clothing,accessories-jewelry,footwear --output=output/clothing-review.json
```

4. The queue builder loads tracked `docs/content-review/*-review.json` ledgers by default. For new reviews, copy the relevant `reviewTemplates` into a document with an `items` array. Complete each check only after reviewing the actual content. Each record needs `unitId`, `lessonId`, `status: "approved"`, `lessonSha256`, `reviewedBy`, `reviewedAt` (`YYYY-MM-DD`), all eight `checks` set to `approved`, and two distinct HTTPS evidence URLs in `sources`. The digest covers the raw lesson (including learning-context anchors and image holds), its phrase records and the unit bilingual catalog. Reading, exercise, Arabic, option or brief edits invalidate the approval. Never blanket-approve records to make a queue pass.
5. Rebuild with the review document and inspect the resulting prompts:

```powershell
node scripts/build_image_generation_queue.mjs --units=everyday-clothing,accessories-jewelry,footwear --reviews=output/clothing-approved-reviews.json --output=output/clothing-reviewed-queue.json
node scripts/generate_reviewed_scene_batch.mjs --queue=output/clothing-reviewed-queue.json --source=. --limit=1 --concurrency=1 --max-cost-usd=0.15
```

The runner defaults to a dry run. An empty queue fails without a service request. Detection of generic content also blocks an allegedly approved review. Regex checks detect recurring failures; they do not certify linguistic quality. No current lesson receives a generation approval merely because old editorial metadata says `approved`.

6. Only after an explicitly authorized, reconciled budget, supply `GEMINI_API_KEY` through the environment or `--env=private-file` and add `--generate` to a reviewed command. Use the approved model and a small first batch. `--max-cost-usd` allocates $0.15 per selected request; this is a local reservation policy, **not a verified provider price or guaranteed invoice ceiling**. Check current model pricing, output-token charges, quotas and the remaining budget first. Never print credentials.
7. Review each actual image at full size. Check object identity, counts, clock hands, task evidence, visible wording/logos, people/dress policy, anatomy, aspect ratio and framing. Existing square images are not made compliant by cropping. Write alternative text from visible details after review. A provisional source alternative is not publication-ready.
8. Retain a per-image approval or rejection with source SHA-256, exact scene/question/answer, purpose, visible alternative text, policy findings and reviewer/date. Publication needs separate authorization and the repository media guardrail; this workflow does not grant permission to upload or remap R2.

## Purpose and ambiguity

Queues built here produce `word-reference` support. The written context supplies dialogue, intent, sequence, quantity, price and hidden product characteristics. A photograph cannot prove non-GMO status, gluten content, an unnamed worker's role, payment terms or container capacity. For an assessment that depends on several visible alternatives, author and review a full scene explicitly; do not pass a single-object reference off as complete visual evidence.

Zero readable text includes numbers, mathematical glyphs, package labels, calendar names, screen content, signs and currency denominations. Historical `imageSymbols` exceptions are rejected. A barcode's parallel-line pattern may be necessary for its concept, but omit digits and other print. Clocks must use unnumbered faces; visible object groups may teach small counts, subject to exact-count inspection. Hold briefs that require text rather than replacing the target with a blank card.

An `imageGenerationHold` preserves an approved written lesson while excluding its scene from paid requests. Queues report `held` separately from content-review `blocked` jobs and existing `covered` references. The runner rejects held scenes even in an older queue. The readiness report's `generationApproved` field describes whole-lesson content approval, not eligibility of every image; inspect `heldScenes` and the bounded queue before proceeding. A generic desk cannot depict a medicine category, and a blank phone cannot establish an application's identity. Do not weaken the exact-concept visual gate to accommodate them.

## Resume and retries

Use `scripts/generate_reviewed_scene_batch.mjs`, which checks content before selection and again immediately before a paid call, writes immutable file names, retains claims/receipts, preserves source framing and refuses automatic retries. A generated receipt plus a matching hash permits local reuse. A failed/incomplete receipt or an orphan claim means reconcile the provider request before retrying. Uncertain or failed jobs return a failing CLI status. Changing the prompt/model changes request identity, so a new identity is not permission to pay again.

Do not use primary-checkout `generate_scene.cjs`, `run_batch_auto.cjs` or `run_batch_fast_parallel.cjs`: their historical plans and retry/status behavior have not been brought into this review gate. Do not rebuild historical manifests over source evidence. Preserve originals and create a newly dated queue from current content.

Run `node --test scripts/tests/check-generation-preflight.mjs scripts/tests/check-gemini-scene-batch.mjs scripts/tests/check-image-review-policy.mjs` when changing these tools. These guards also run in the pre-push gate. Follow the mandatory TypeScript, Vitest, lint and relevant build/E2E gates before committing software/content updates; preserve bilingual release history.

# Gemini image workflow — 9 October 2026

The local GEMINI_API_KEY passed the Gemini Developer API model-list check and real image generation. Vertex express access returned SERVICE_DISABLED for aiplatform.googleapis.com. Use the working Developer API; do not change Google Cloud configuration or expose keys to the browser.

The new runner reads credentials from the environment or an explicitly supplied local env file. It has no embedded credentials, arbitrary provider endpoints, R2 writes, or automatic mapping publication. Jobs carry the current stable scene identity, scenario, question and expected answer. Recheck these before generation and publication. Existing receipts reuse verified nonempty files. A claim prevents simultaneous requests for the same scene/prompt/model. Interrupted and failed requests require review before retry because their billing outcome may be uncertain.

`node scripts/generate_reviewed_scene_batch.mjs --queue=output/queue.json --source=. --concurrency=4 --limit=12 --max-cost-usd=2` is a dry run. Add `--generate --env=.env.local` to generate. Each selected request reserves $0.15 against the run bound; this is a conservative estimate, not a provider-enforced billing cap. Keep a provider budget alert for an account-wide cap. Other tools share the same project's quota and billing. No automatic retries or model switches occur.

Default model: gemini-3.1-flash-image. The tested faster gemini-3.1-flash-lite-image is available with `--model=gemini-3.1-flash-lite-image`; the first speed pilot produced an unwanted logo and was withheld. Both require individual visual review. Preserve 4:3 source dimensions without cropping an assessed detail. Output is nonempty WebP plus receipts with hashes, question evidence, native dimensions and usage metadata. A generated file always starts as pending visual review.

For the release, 36 existing classroom/office images were inspected: 15 were approved and 21 withheld. Twenty-one replacements and one corrected dictionary cover were generated. The rejected cover remains saved. All 36 approved photographs were uploaded with conditional create-only writes, then verified against R2 bytes and the public response. The v2 manifest adds new identities only. Established mappings and assets were preserved. The runtime withholds new imagery when scenario, answer or question changes. Images are not committed into Git.

Do not use a single-word vocabulary photograph as approval evidence for a multi-object usage scene. The user's public/word-images directory contains 12,304 files; reuse still requires exact-question visual review. The separate generated-scene directory is being changed by another tool. Its counters and filenames alone are not approval evidence.

Pilot latency was about 4.5 seconds for Flash Lite and 10 seconds for Flash. The replacement run used four workers; individual requests took roughly 10–43 seconds under the shared project's live load. These are observations, not a guaranteed rate. Bulk throughput should be increased only while preserving quality review and respecting project quotas.

Google documents [image generation](https://ai.google.dev/gemini-api/docs/image-generation), [project-based quotas](https://ai.google.dev/gemini-api/docs/rate-limits), and [Batch API](https://ai.google.dev/gemini-api/docs/batch-api). Batch jobs have higher limits and 50% standard pricing, with a target turnaround of up to 24 hours. Interactive bounded concurrency was used here to receive and inspect each image immediately.

Business recordings remain blocked: the working ElevenLabs key had one character remaining during the check. No generation or repeated paid request was attempted. New recordings must use the existing planning, validation and create-only asset workflow once credits are replenished.

The fresh usage inventory contains 3,657 scenes: 155 have current imagery, and
3,502 still need reviewed imagery. No established mapping was stale against the
integrated content. Of the missing scenes, 273 have exact-name local candidates
that need review before any replacement is requested. A project-local queue and
inventory are saved under output/remaining-scene-backlog; draft prompts require
source review, especially abstract or advanced concepts. The 36-image completion
batch stays within a conservative $4 request reservation; full backlog spending
has not been authorized with a specific budget.

Run `node --test scripts/tests/check-gemini-scene-batch.mjs` for the four generator
guard tests; their filename keeps Node tests outside Vitest's application suite.

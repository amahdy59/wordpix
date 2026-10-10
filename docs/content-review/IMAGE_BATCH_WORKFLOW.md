# Image review and publication batches

User direction, 10 October 2026: move faster, reuse clear imagery, replace only
unclear or misleading pictures, and proceed under standing visual approval unless
there is a critical issue. Writing, illustrative graphics and necessary moderate
male figures are permitted; no women. Preserve every original local file, R2
object and established mapping.

## Batch execution

- Plan 24–40 concepts per batch, grouped by unit or related meaning.
- Inspect existing vocabulary and scene pictures first. Reuse accurate imagery;
  an image hold is not evidence that no usable image already exists.
- Prefer deterministic diagrams for exact counts, equations and chart geometry.
  Use the previously authorized cheap image model for concepts requiring generated
  imagery. Keep the generation method and its cost explicit in the receipt.
- Use up to eight concurrent generation requests, the existing runner's maximum,
  within the authorized spending bound and provider quota. Reduce concurrency
  after throttling or repeated service failures. Never retry unresolved requests
  without checking their retained receipts first.
- Review contact sheets of twelve with full-size checks for spelling, quantities,
  ambiguous concepts or people. Machine nomination alone is not visual review.
- Record literal image alternatives, hashes, the actual source and user approval
  evidence. Proceed with inspected candidates under standing approval; pause only
  for a critical unresolved issue.
- Upload approved new files using create-only content-addressed keys, then verify
  HEAD metadata, authenticated GET bytes and public GET bytes. Preserve original
  mappings; add approved display selections where a replacement is needed.
- Release one completed batch with English and Arabic release notes. Run the full
  verification ladder once on that batch through the pre-push hook, then verify
  CI, Pages, the deployed commit and the affected live images. New changes or
  failed checks require appropriate revalidation.

## Scope accounting

Track scene approval, scene-image coverage and vocabulary-image quality
separately. Zero editorial image holds does not establish that all 3,657 scenes
have individual reviewed scene pictures. Before scheduling further generation,
measure coverage and check useful existing vocabulary references. Do not treat
missing dedicated scene artwork as an automatic request to regenerate imagery.

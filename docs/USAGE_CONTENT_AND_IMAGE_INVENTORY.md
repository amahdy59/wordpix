# Usage content and image production inventory

Generated from the production usage JSON. Do not edit generated counts by hand. Run `pnpm content:usage:manifests` after usage content changes.

## Current inventory

| Measure                              | Count |
| ------------------------------------ | ----: |
| Units                                |   200 |
| Lessons with usage sections          |   864 |
| Usage scenes / required scene images |  3657 |
| Complete linked images               |    18 |
| Images still required                |  3639 |
| Linked image files missing           |     0 |
| Scenes flagged for content review    |  1512 |

| Core CEFR | Lessons | Scenes | Images complete | Images required |
| --------- | ------: | -----: | --------------: | --------------: |
| Pre-A1    |      90 |    406 |              18 |             388 |
| A1        |     181 |    843 |               0 |             843 |
| A2        |     203 |    943 |               0 |             943 |
| B1        |     181 |    693 |               0 |             693 |
| B2        |     143 |    531 |               0 |             531 |
| C1        |      66 |    241 |               0 |             241 |

## Working files

- `docs/usage-image-manifest.csv`: one stable row per usage scene and required 4:3 image.
- `docs/usage-authoring-plan.csv`: one row per lesson with the proposed Core, Level up, and Advanced CEFR layers.

## Editorial model

1. **Core use** is required, assessed, and written at the lesson's current CEFR band.
2. **Level up** is a proposed optional authoring target, starting at A2 or above and capped at C1. It is not a verified label for existing text.
3. **Advanced** is a proposed optional authoring target, capped at C1. Each new sense and task needs its own level review.
4. Every new use needs a stable usage ID, an exact sense, a natural pattern or collocation, register, spoken/written scope, frequency evidence, and human editorial approval.
5. Images belong to the scene, not to an answer option. They must support comprehension without revealing the assessed answer.

## Production order

Work in this order: A2, B1, B2, C1, A1, then Pre-A1. Within a level, follow `global_order`. Complete content repair and editorial review before generating an image so visual work is not wasted on a scene that later changes.

Rows marked `editorial review required` have only passed automated checks. Rows marked `complete` have a linked image file; this does not certify content quality. Follow [the source and evidence policy](USAGE_SOURCE_AND_EVIDENCE_POLICY.md) before approving any new image brief.

## Safety

This inventory proposes local `public/learning-scenes/` paths only. It does not upload, rename, delete, or change any R2 content-ID mapping.

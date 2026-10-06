# Editorial batches 21 through 38 import status

Reviewed on 6 October 2026. The supplied completed archive was imported into
the local curriculum sources.

## Imported scope

- 414 lessons, global orders 451 through 864.
- 5,715 word rows, 1,576 scene rows, and 1,242 phrase rows.
- All 414 lessons across the new batches now have learner-facing whole-lesson
  approvals after the missing target-term context was authored into each lesson
  reading, scene, and production exercise. All 450 earlier lessons remain
  released from the batches 01–20 work.
- Existing image paths and read-only media mappings were preserved. Every batch
  importer run reported `mediaPathsChanged: 0`.

## Runtime records

The required phrase fields were generated for all 1,242 new phrase rows and
reviewed with the runtime phrase audit in
`docs/USAGE_PHRASE_REVIEW_2026-10-06.json`:
learner purpose, checks, retrieval/personal-use/later-review prompts, scene IDs,
source-review metadata, and editorial status. The generated files validate
against `usagePhraseSchema` and are available under `src/app/data/usagePhrases`.
The audit found no duplicate IDs, broken lesson or scene links, missing review
fields, empty Arabic meanings, or weak examples.

## Remaining release notes

This work does not generate audio or upload media to R2. Deploying the code and
data changes is still required before learners can see the content online.

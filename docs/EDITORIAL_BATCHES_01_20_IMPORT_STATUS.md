# Editorial batches 01 through 20 import status

Reviewed on 6 October 2026. The supplied completed archive was imported into local
curriculum sources. This is a content preparation change, not a learner release
or deployment.

## Import scope

- 450 lessons, global orders 1 through 450.
- 6,132 word rows, 2,081 scene rows, and 1,350 phrase rows.
- Runtime lesson metadata, word lists, readings, scenarios, scene questions,
  options, answers, and image briefs updated in 96 usage files.
- Full workbook records retained under `src/app/data/editorial` for evidence
  and subsequent review; word examples and phrase records in this directory
  are not loaded by the learner app.
- Existing image paths and existing-image alt text preserved. No R2 writes,
  audio generation, audio ledger changes, or asset mapping changes performed.
- Importer normalizes legacy single-scene objects and single-word strings to
  arrays before validation. Stable lesson, word, scene, and phrase IDs retained.
- Existing importer corrections to a few readings/questions remain applied;
  imported runtime content is therefore not a literal copy of every updated cell.

## Learner visibility

Whole-lesson approval manifests have now been generated for the 450 imported
lessons across 96 units. They use the workbook reviewer, review date, evidence
URLs, and the app's required approval checks. After deployment, these lessons
will load through the learner registry.

Phrase release remains separate. The workbook does not provide the required
runtime source review and retrieval/personal-use/later-review fields, so the
1,350 phrase rows remain editorial-only. Revised readings also retain the
known generic-template findings documented below and should receive a later
language-quality pass.

## Editorial quality findings

The archive passes structural checks but does not establish complete language
quality. A deeper scan found 4,986 word rows with the generic example template
`Please use "..." in this everyday situation.` and the generic collocation
template `use ... in context`. These are not usable vocabulary examples or
collocations. Also, 178 readings begin with the generic task template
`Omar has an everyday task connected...`.

These findings require editorial correction before learner release or bulk
recording. Dictionary URLs and CEFR labels have not all been independently
verified. A previous structural-only assessment should not be treated as
language-quality sign-off.

## ElevenLabs readiness

The local credential is named `Elevenlabs_API_key`; generation scripts expect
`ELEVENLABS_API_KEY`. No credential value was printed or changed. Read-only
subscription and model requests both returned HTTP 401 with
`missing_permissions`, so account allowance and v4 entitlement remain unverified.
The configured production audio profile is `eleven_turbo_v2_5`; changing its
model would change content-addressed audio keys and needs a separate asset plan.

Readings alone contain 195,182 characters before deduplication, excluding
scenes, examples, and phrases. Unlimited free bulk generation cannot be assumed.
No generation or upload was attempted.

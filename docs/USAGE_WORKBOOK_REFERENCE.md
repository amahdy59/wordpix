# Usage workbook reference

The editorial reference is `output/usage-authoring/WordPix_usage_authoring_inventory.xlsx`.

## What is included

- Summary: current curriculum and authoring counts.
- Image inventory: existing scene text, questions, image names, briefs and approval fields, keyed by scene ID.
- Usage plan: all 864 lessons across 200 units; extension levels are planning targets only.
- Authoring guide: phrase-selection priorities, level guidance, practice sequence, accessibility, source use and approval criteria.
- Sources: research and reference links with their intended role and limitations.
- Phrase authoring: 2,592 populated draft slots (two core and one optional-extension candidate per lesson). Six records are approved; the remaining 2,586 are marked `Changes required` until their evidence and language reviews are complete.
- Phrase candidates: 1,823 existing phrase and collocation records covering all 200 units, with original meanings/examples, source locations, classification caveats, and selection fields. These are unverified inputs, not approved phrases or automatic lesson assignments.

## Editing and approval

Use stable phrase and scene IDs. Editable phrase fields are pale yellow. Select exact meanings and useful learner purposes before drafting. Record level evidence and corpus evidence separately. Review Arabic meaning, grammar, comprehension questions, retrieval, personal use and delayed review.

Filter Phrase candidates by unit, then select appropriate entries for a lesson. Record the candidate ID in the phrase's Reviewer notes and the assigned phrase ID in the candidate row. Rejected candidates remain available with an explanation. Do not copy a unit's level into the phrase-level field without checking its exact sense.

Approve text and image briefs for a specific revision before generating images. Existing image files are not evidence of content approval. Formula readiness checks are administrative completeness checks, not linguistic validation.

Every lesson now has traceable phrase, candidate, lesson, and scene IDs. Candidate assignment uses target-word and lesson-context relevance, but assignment is not editorial approval. Of the unapproved records, 327 still need a natural original example, and all 2,586 still need Arabic and phrase-level evidence review. The remaining generic scene content has not been rewritten by this workbook update.

## Preserving the reference

Save dated versions before substantial editorial changes. Do not overwrite the reference with generated CSV snapshots. The original workbook builder now refuses to overwrite a workbook containing Phrase authoring. Refresh source fields by stable IDs while retaining editorial fields.

## Approval and application integration

The app no longer derives learner-facing phrases from unreviewed candidates.
Only rows that satisfy all of these conditions may be exported:

- Editorial status is `Approved` and the reviewer and revision are recorded.
- Phrase-level CEFR status is `Verified` for the exact sense being taught.
- Online review status is `Verified online`, with primary and secondary learner-dictionary URLs, a dated review, and a recorded decision when sources disagree.
- Meaning, Arabic meaning, original contextual example, learner purpose,
  pattern/register, evidence URL, comprehension check, retrieval task, personal
  use task, delayed review, and a valid scene ID are present.
- The readiness formula returns `No image required`. Phrase cards are text and
  audio-support content; scene-image production remains a separate approval.

Run `pnpm content:usage:export-approved` after saving reviewed workbook changes.
The exporter writes strict per-unit files under
`src/app/data/usagePhrases/`. At runtime, malformed files fail closed, and a
record is also rejected if its unit, lesson, scene, or slot does not match the
loaded lesson. Draft, rejected, and `Changes required` rows never appear to
learners.

The current learner-facing export contains six approved phrases across five
units. All six were re-reviewed online against Cambridge and Oxford learner
dictionaries on 2026-09-30. Where their level labels differ, the workbook
records both results and the teaching decision. The other 2,586 populated
records are an editorial queue, not released content. No JSON scene file or
Cloudflare R2 content-ID mapping is changed by the phrase export.

Phrase approval is not lesson approval. The app now requires a separate,
strict whole-lesson approval record before any Usage Scenes tab or phrase card
is learner-visible. Because the current scene, question, reading, exercise,
image-brief, CEFR, and Arabic packages still require editorial review. The
learner loader rejects lessons containing placeholder Arabic transliterations.
The six phrase records remain available in the workbook and editorial exports
for the next review batches.

## Repeatable review batch

Review one bounded batch at a time (recommended: 20–40 lessons), in curriculum
order within the chosen CEFR band:

1. Resolve any scene repair flag before approving a phrase tied to that scene.
2. Review the two core slots first. Core phrases must be common, immediately
   useful, and independently completable at the lesson level.
3. Review the optional slot separately. It may extend toward A2–C1 but must be
   hidden behind the learner's explicit “Explore” action and may not be needed
   to complete the lesson.
4. Verify the exact sense and pattern against a learner dictionary; use corpus
   evidence appropriate to spoken, written, everyday, or professional register.
5. Write an original example, specific comprehension check, retrieval prompt,
   personal-use prompt, and delayed-review prompt. Review the Arabic meaning in
   that exact context.
6. Have a second editor approve the row and record reviewer/date and revision.
7. Export, run the workbook and application checks, and spot-check English,
   Arabic/RTL, keyboard, screen-reader, mobile, and reduced-motion behavior.

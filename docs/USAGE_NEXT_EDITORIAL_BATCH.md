# Next usage editorial batch

This is the next reviewer-ready batch. It is deliberately a content-review
queue, not an approval list. No row should be marked approved until the complete
lesson package passes the release checklist.

## Current audit baseline

The automated relevance audit reports:

- 864 lessons and 3,657 scenes
- 1,604 generic-template scenes (43.9%)
- 1,273 scenes with support across the unit's richer learning materials
- 2,283 target-word slots with reviewed examples
- 2,356 target-word slots with reviewed collocations

The largest generic-scene burden is A2 (524 scenes), followed by A1 (456), B1
(369), B2 (150), Pre-A1 (90), and C1 (15). This supports starting with A2,
then B1/B2 for the strongest learner-value gain, while preserving the A1 and
Pre-A1 sequence for later controlled rewrites.

## Batch 01: A2 body and appearance (20 lessons)

| Order | Lesson ID                   | Unit                | Scenes | Priority action                                                   |
| ----: | --------------------------- | ------------------- | -----: | ----------------------------------------------------------------- |
|     1 | human-body-head-and-face-1  | Head & Face         |      5 | Rewrite generic scenes; verify everyday health/description senses |
|     2 | human-body-head-and-face-2  | Head & Face         |      5 | Rewrite; repair question evidence and image briefs                |
|     3 | human-body-head-and-face-3  | Head & Face         |      5 | Rewrite; check Arabic context and CEFR fit                        |
|     4 | human-body-head-and-face-4  | Head & Face         |      5 | Rewrite; regroup targets if the scene is unnatural                |
|     5 | human-body-upper-body-1     | Upper Body          |      5 | Rewrite around a concrete adult care or clothing task             |
|     6 | human-body-upper-body-2     | Upper Body          |      5 | Rewrite and verify target-word distinctions                       |
|     7 | human-body-upper-body-3     | Upper Body          |      5 | Rewrite; add a specific inferable check                           |
|     8 | human-body-upper-body-4     | Upper Body          |      2 | Rewrite short set; confirm image feasibility                      |
|     9 | human-body-lower-body-1     | Lower Body          |      5 | Rewrite around movement, comfort, or care                         |
|    10 | human-body-lower-body-2     | Lower Body          |      5 | Rewrite; prioritize high-frequency senses                         |
|    11 | human-body-lower-body-3     | Lower Body          |      5 | Rewrite; verify collocations and Arabic                           |
|    12 | human-body-lower-body-4     | Lower Body          |      2 | Rewrite short set; confirm question evidence                      |
|    13 | human-body-hands-and-feet-1 | Hands & Feet        |      5 | Rewrite around a practical task                                   |
|    14 | human-body-hands-and-feet-2 | Hands & Feet        |      5 | Rewrite; avoid dictionary-definition prose                        |
|    15 | human-body-hands-and-feet-3 | Hands & Feet        |      5 | Rewrite; check target separation                                  |
|    16 | human-body-hands-and-feet-4 | Hands & Feet        |      2 | Rewrite short set; confirm image brief                            |
|    17 | physical-appearance-1       | Physical Appearance |      5 | Rewrite around a respectful real-world description                |
|    18 | physical-appearance-2       | Physical Appearance |      5 | Rewrite; check inclusive and non-stereotyped wording              |
|    19 | physical-appearance-3       | Physical Appearance |      5 | Rewrite; add concrete context-check evidence                      |
|    20 | physical-appearance-4       | Physical Appearance |      5 | Rewrite; review phrase and collocation candidates                 |

## Review transaction for each lesson

1. Rewrite the scenario so it has an adult purpose and a concrete event.
2. Rewrite the question so the answer is supported by a detail, not option order.
3. Review the exact sense, collocation, register, CEFR level, and Arabic meaning.
4. Rewrite the reading and exercise prompts if they still contain generic copy.
5. Approve the image brief only after the text is stable; the image must not reveal
   the answer or require labels.
6. Record two authoritative source URLs, reviewer, date, and content revision.
7. Add a whole-lesson approval JSON record only when every check is approved.
8. Run workbook checks, export checks, typecheck, tests, lint, and the focused E2E
   flow before releasing the batch.

## Image-generation rule

Do not generate images for the current generic scenes. Generate only after the
scenario, check, reading, exercise, Arabic, and image brief have been approved
as one revision. Existing image files do not constitute content approval.

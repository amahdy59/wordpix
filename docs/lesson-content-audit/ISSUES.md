# Baseline findings — historical snapshot

This document records the initial assessment. See [REVIEW.md](REVIEW.md) for current corrections, verification and remaining editorial work.

The baseline JSON and CSV contain a separate record for each of 864 vocabulary lessons, 200 study units, 40 Business lessons, 40 Conversation lessons, 42 Hadith lessons, 68 Pronunciation lessons and 27 registered skill activities. These are data and runtime checks, not a claim that every screen or image has received a human editorial review.

| Finding                   | Baseline flags | Assessment / action                                                                                                                                                                                                |
| ------------------------- | -------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reused word example       |          2,836 | A scene listing several targets is repeatedly selected as each word's usage example. Select only a focused example for individual word practice; retain scenes as reading context and intentional review.          |
| Generic practice sentence |            576 | Legacy reading frames can reach gap fill and construction. Reject boilerplate at sentence selection.                                                                                                               |
| Target cannot be blanked  |            275 | Includes legitimate inflections and alternative expressions. Exact-label cloze should not turn these into unrelated phrase construction; use a target-containing fallback until an individual example is authored. |
| Empty Hadith model answer |             51 | Exported instructions, completion headings and progress summaries are parsed as review questions. Parse real question blocks only, without trailing interface copy.                                                |
| Unresolved target label   |              2 | Bathroom “Take a Shower” and Living Room “Read a Book” differ from vocabulary labels. Resolve article variants without changing IDs or media mappings.                                                             |
| Generic source context    |            213 | Editorial candidates, including legitimate idioms. Do not mechanically replace every match.                                                                                                                        |

Additional section review found that study comprehension renders all previous questions, and rewrite/error-correction practice uses answers from unrelated questions as distractors. Use the shared single-question engine and relevant alternatives. Validate case-insensitive option uniqueness.

Definition review also confirmed wrong senses in the Numbers, Geometry and Family units: playing cards for basic numbers, the government building for a geometric pentagon, a performer for a star shape, a priest for a father, a legal trust for family trust, and an incorrect Arabic financial sense for family bond. Correct those texts and add focused examples. The existing `docs/vocabulary-definition-review.csv` remains an editorial queue; a passing structural audit does not approve its remaining dictionary senses.

Home, Learn, Practice, Library and Profile are navigation/reference surfaces; their coverage requires section tests in addition to curriculum data inspection. Layout, media failure and keyboard behavior are shared-component checks. Remote image correctness, bilingual semantic accuracy, religious interpretation and full WCAG conformance require further individual editorial or manual review; the automated counts cannot establish those.

R2 assets and ID-to-URL mappings remain read-only. Baseline findings are retained for comparison rather than overwritten after fixes.

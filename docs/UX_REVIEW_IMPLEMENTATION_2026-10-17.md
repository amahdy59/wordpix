# UX review implementation — 17 October 2026

This release implements the engineering changes from the 36-item responsiveness,
visual design, and lesson-flow review. It does not claim WCAG AAA conformance or
replace usability testing with representative learners.

## Changes mapped to the review

| Review IDs | Implementation                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1–3        | Mobile headers wrap, the six-item study bottom menu becomes a labelled unit activities drawer, and the unit title is retained without truncation. The five global destinations reflow at larger text sizes and the content reserves their measured height.                                                                           |
| 4          | Scenario word buttons and CEFR pills have minimum 44 × 44px targets. The scenario seek control also reserves a 44px interaction height.                                                                                                                                                                                              |
| 5          | Local navigation explicitly says Unit overview / Unit activities. It no longer imitates the five global tabs.                                                                                                                                                                                                                        |
| 6          | Home and Learn share the starting-unit recommendation and unit gateway. The gateway has a primary recommended group or Resume action, while reference/extra activities remain secondary.                                                                                                                                             |
| 7          | Word navigation remains word navigation. A separate labelled action at the last word accurately names the next stage.                                                                                                                                                                                                                |
| 8          | App routing retains unit, area, and activity IDs from study links.                                                                                                                                                                                                                                                                   |
| 9          | The translation interpolator accepts both existing brace conventions. Missing-key default values work in both provider and fallback translation contexts; the scenario-prefix key is present in both languages.                                                                                                                      |
| 10         | More controls, group states, scenario counters, study activity-type labels, and corrective feedback are localized. Intentional English learning content remains English.                                                                                                                                                             |
| 11–13      | Home has one start action, an outcome rather than a truncated word list, a brief review empty state, and no routine release/caching badges. Release history remains accessible from Profile and connectivity failures retain the existing network banner.                                                                            |
| 14–15      | The current curriculum phase is visible by default. Level controls wrap with a selected state. Specialist courses have a separate jump action; settings categories wrap rather than relying on an offscreen strip.                                                                                                                   |
| 16         | Profile and Settings both support selecting C2 as a target. Coverage copy distinguishes a target from the actual Pre-A1–C1 vocabulary path, without implying that a complete C2 curriculum exists. No CEFR assignment was changed.                                                                                                   |
| 17         | Unit entry prioritizes the recommended group/resume action, shows session effort, and uses group number plus recognizable sample words. Test-out and reference are secondary. Content and progress IDs are unchanged.                                                                                                                |
| 18–19      | Study overview leads with Continue. Media/context previews are optional disclosures. Desktop uses the contents sidebar rather than duplicating the same areas in header tabs and per-area progress bars.                                                                                                                             |
| 20–21      | Business warm-up hides the additional goal/context card behind a disclosure, removes duplicated stage and question numbering, and gives a direct instruction. Conversation voting copy is shorter.                                                                                                                                   |
| 22         | Hadith preparation is an optional disclosure before the reading/listening task. Reading views and bilingual controls remain available.                                                                                                                                                                                               |
| 23–25      | Vocabulary session effort and stage position are visible. Exit returns to the unit or Practice according to session mode. Unit-scoped, runtime-validated saves restore vocabulary stage/session/attempts; completion clears only that unit's resume save. Specialist return actions consistently say Back to course.                 |
| 26         | Practice states shared pacing once and removes repeated category/level/time metadata from every row; timed/microphone requirements remain visible.                                                                                                                                                                                   |
| 27         | New profiles do not show an active streak shield without a streak or six empty skill-dimension rows. Duplicate Settings content is removed.                                                                                                                                                                                          |
| 28–30      | Settings starts with Appearance, search spans categories, categories wrap, and audio diagnostics/appearance previews are optional. Higher contrast uses plain language. Vocabulary loading explains its limited scope and does not imply a complete offline media download.                                                          |
| 31         | Audio-match feedback is neutral, localized, explains the answer and queued practice, and offers a replay action. Existing attempt accounting and retry queues remain intact.                                                                                                                                                         |
| 32         | AppShell's duplicate skip link and the redundant study breadcrumb are removed. The study drawer focuses an internal control, traps focus, returns it on close, and makes underlying content inert.                                                                                                                                   |
| 33–36      | Shared/page/card typography uses less heavy emphasis, the Home content measure is bounded, Settings keeps its main column at intermediate desktop widths, topic suggestions are optional, and the Library search hint is concise. Terminology now distinguishes units, groups, steps, reference, and global versus local navigation. |

## Media preservation

No audio/image objects, content IDs, asset URL mappings, or media manifests were
edited. No R2 mutation commands were used. Release verification uses
`WORDPIX_READ_ONLY_MEDIA=1`: thumbnail generation leaves existing files alone,
Vite preserves the output directory and does not recopy the public media corpus.
Normal builds retain their existing behavior when this option is absent.

The local verification snapshot covers 60,056 existing media/caption files in
public, assets, src/assets, audio_backup, dist, and visual-test baselines. A byte
comparison is performed after release tooling. E2E artifacts use a new output
directory so the existing test artifacts and image baselines are preserved.

## Validation and practical limits

The verification record is kept with this release's tool logs. Checks include
TypeScript, the full unit/integration suite, lint, pre-push gates, cross-browser
E2E, and browser inspection of narrow/intermediate/desktop layouts, enlarged
text, Arabic, and light/dark modes. The resume tests reject corrupt or mismatched
unit data and verify that completion does not clear another unit's save.

Resume is at the vocabulary **stage**, not the exact unanswered item. Submitted
answers remain in the existing progress system. Temporary review sessions return
to Practice. Effort estimates remain approximate and require calibration with
observed learner completion times.

Representative learner testing, physical-device/assistive-technology evaluation,
and a criterion-by-criterion WCAG AAA audit remain validation activities, not
claims made by this release. The earlier local MP3/VTT network errors require
deployment-context verification; media URLs and objects remain read-only.

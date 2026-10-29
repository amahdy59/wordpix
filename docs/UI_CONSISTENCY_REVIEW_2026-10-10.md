# UI consistency review — 10 October 2026

Scope: Home, Learn, Practice, Library, Profile, and vocabulary, Business,
Conversation, Hadith and pronunciation learning interfaces. Presentation changes
preserve existing content IDs, progress keys, scoring and media references.

## Implemented page recommendations

- Shared page headers, cards and section gaps use less space and fewer borders.
- Home leads with the next lesson and reviews; daily progress follows. Specialist
  courses are reached through Learn rather than repeated course cards on Home.
- Learn retains collapsed curriculum browsing, a compact recommended lesson and
  separate specialist courses.
- Practice retains reviews first, followed by compact skill rows. Self-paced
  drills display a rough planning estimate; timed drills retain their own label.
- Library keeps search and filters together in a sticky region.
- Profile groups metrics and skill progress and provides access to settings.
- Read/listen uses comfortable text width and lighter dialogue framing. Additional
  language explanations use native disclosure controls.
- Specialist lessons use one main scrolling area. Stage controls wrap at narrow
  widths, and ordinary Page Up/Down retain browser scrolling behavior.

## Separate consistency check

| Area                   | Findings addressed                                                                                                                                                                                                          | Retained behavior                                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tables                 | Vocabulary rows are smaller and use row headings. Synonyms/antonyms, collocations, word forms and Hadith language banks share `ReferenceTable`, with captions, column/row headings and labeled narrow layouts.              | Vocabulary retains its image enlargement, translation and gallery controls. Audio actions retain original references.                                                        |
| Multiple choice        | Shared radio choices and study answer buttons use compact spacing, semantic feedback and readable locked options. Submitted choices preserve focus with guarded `aria-disabled`. Feedback remains adjacent to the exercise. | Curriculum quizzes select then check; vocabulary study checks immediately and supports retry. These distinct scoring state machines remain intact.                           |
| Conversation questions | Discussion rows are compact; one labeled selector chooses the speaking prompt. Rich text is rendered properly. Business sample answers, reasons and examples are grouped under their question in an optional disclosure.    | Original question/guidance IDs and text remain intact. Hadith answer disclosures remain distinct from open discussion and recording.                                         |
| Warm-ups               | Business, Conversation and Hadith use smaller headings, less framing, consistent section gaps and wrapping actions. Nonessential imagery and preview content take less room.                                                | Business uses one scored question at a time. Conversation reflection and Hadith self-check remain unscored, rather than presenting personal opinions as right/wrong answers. |

All authored reference-table renderers were inspected. The source inventory now
contains only `ReferenceTable` and the richer `CurriculumVocabularyTable` as table
renderers. Mobile layouts preserve field labels rather than dropping columns.

## Further recommendations

1. Replace prefix-based Business guidance grouping with explicit authored
   question/answer/reason/example relationships during a future content-schema
   change. The current presentation helper deliberately leaves source data intact.
2. Calibrate practice time estimates using actual completion observations; retain
   self-paced controls and never enforce the estimate as a time limit.
3. Add a manual screen-reader, high-contrast and 400% zoom release matrix across
   every lesson variant. Automated checks do not establish full WCAG AAA conformance.
4. Maintain visual regression snapshots of table, radio-choice, question and
   warm-up variants in English/Arabic and light/dark themes.
5. Resolve the separately edited content's existing authored coverage and scenario
   consistency failures before release.

Reflow guidance: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
Target-size guidance: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html

## Verification

- TypeScript and ESLint: passed, including the final sidebar localization fix.
- Production build: passed.
- Full Vitest run: 2,769 passed; two pre-existing content failures (classroom-3
  Thumbtack coverage and supermarket-1 scenario alignment), plus one outdated
  responsive markup assertion. The assertion was updated; all 52 affected tests
  passed on rerun. The final shared-control/layout/grouping check passed 32 tests.
- Release-history tests: four passed. Release 0.1.14 preserves the separate image
  session's release-history entries through 0.1.13, without changing its media.
- Browser suite: 20/21 initially passed. The sidebar accessible-name regression
  was fixed; all four RTL/dark-mode/navigation tests passed on rerun.
- Manual browser checks at 320px: Business discussion, Business vocabulary and
  Hadith vocabulary have no horizontal overflow and only `main-content` scrolls.
- Hadith vocabulary at 320px: enhanced contrast and control-label axe rules passed.
- Discussion screenshots reviewed at 320px and 1440px. Full criterion-by-criterion
  WCAG AAA conformance is not claimed. No deployment was performed.

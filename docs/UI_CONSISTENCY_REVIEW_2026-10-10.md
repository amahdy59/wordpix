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
5. Keep historical content drafts separate from reviewed release content. The
   Thumbtack coverage and supermarket scenario checks pass in the integrated
   worktree; older drafts remain preserved in the primary checkout and excluded
   from this release.

Reflow guidance: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
Target-size guidance: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html

## Verification

Current integrated worktree: TypeScript, ESLint and all 51 targeted tests across
eight files passed. Both authored-content checks pass against the reviewed
release content. The complete release ladder and live deployment verification
are pending the release session; the results below are historical evidence from
the older primary checkout, not a full verification of the integrated worktree.

### Earlier primary-checkout evidence

- TypeScript and ESLint: passed, including the final sidebar localization fix.
- Production build: passed.
- Earlier full Vitest run: 2,769 passed. Two failures came from preserved older
  drafts (classroom-3 Thumbtack coverage and supermarket-1 scenario alignment),
  which were excluded during integration. Both checks now pass in the clean
  worktree. One outdated responsive markup assertion was updated; all 52 affected
  tests passed on rerun. The final shared-control/layout/grouping check passed
  32 tests.
- Release-history tests: four passed. Release 0.1.14 preserves the separate image
  session's release-history entries through 0.1.13, without changing its media.
- Browser suite: 20/21 initially passed. The sidebar accessible-name regression
  was fixed; all four RTL/dark-mode/navigation tests passed on rerun.
- Manual browser checks at 320px: Business discussion, Business vocabulary and
  Hadith vocabulary have no horizontal overflow and only `main-content` scrolls.
- Hadith vocabulary at 320px: enhanced contrast and control-label axe rules passed.
- Discussion screenshots reviewed at 320px and 1440px. Full criterion-by-criterion
  WCAG AAA conformance is not claimed. No deployment was performed.

## Integration handoff

Integrated on top of image release `23df72aa7655817999e22535d5bf31ead0714c6b`
in the clean `codex/content-image-handoff` worktree. The transfer includes 48
modified layout/test/i18n/release files and five new components/test/audit files.
No usage drafts, media manifests or helper scripts were transferred.

Conflicts in Business input/usage, Conversation reading and Hadith read/listen
were resolved by retaining the current reading/audio implementation and applying
only compatible compact spacing. Business input and Conversation reading already
had the desired current layout, so those two files have no final diff.

TypeScript passed; all 51 targeted tests across eight files passed, including both
content checks that failed in the old primary checkout. No content fixes were
needed. Existing release history is unchanged after the new 0.1.14 entry. Full
release gates and live deployment verification belong to the release handoff.

### Exact integration files

- `public/release-notes.json`
- `src/app/__tests__/responsive_layout.test.ts`
- `src/app/__tests__/shared_learning_controls.test.tsx`
- `src/app/core/ExploreWorlds.tsx`
- `src/app/core/HomeDashboard.tsx`
- `src/app/core/LearningPath.tsx`
- `src/app/core/ProfileStats.tsx`
- `src/app/core/SkillExerciseHub.tsx`
- `src/app/data/releaseNotes.json`
- `src/app/learning/ExtraSections.tsx`
- `src/app/learning/LearningMaterialsScreen.tsx`
- `src/app/learning/business/BusinessLessonScreen.tsx`
- `src/app/learning/business/stages/BusinessDiscussionStage.tsx`
- `src/app/learning/business/stages/BusinessExerciseStage.tsx`
- `src/app/learning/business/stages/BusinessReviewStage.tsx`
- `src/app/learning/business/stages/BusinessSpeakingStage.tsx`
- `src/app/learning/business/stages/BusinessUsageStage.tsx`
- `src/app/learning/business/stages/BusinessVocabularyStage.tsx`
- `src/app/learning/business/stages/BusinessWarmupStage.tsx`
- `src/app/learning/conversation/stages/ChallengeStage.tsx`
- `src/app/learning/conversation/stages/DiscussionStage.tsx`
- `src/app/learning/conversation/stages/LanguageBankStage.tsx`
- `src/app/learning/conversation/stages/QuizStage.tsx`
- `src/app/learning/conversation/stages/ToolkitStage.tsx`
- `src/app/learning/conversation/stages/WarmupStage.tsx`
- `src/app/learning/foundations/FigmaPronunciationLessonScreen.tsx`
- `src/app/learning/hadith/HadithLessonScreen.tsx`
- `src/app/learning/hadith/HadithVocabularyStudy.tsx`
- `src/app/learning/hadith/stages/HadithDiscussionStage.tsx`
- `src/app/learning/hadith/stages/HadithReadListenStage.tsx`
- `src/app/learning/hadith/stages/HadithReviewStage.tsx`
- `src/app/learning/hadith/stages/HadithSpeakStage.tsx`
- `src/app/learning/hadith/stages/HadithVocabularyStage.tsx`
- `src/app/learning/hadith/stages/HadithWarmupStage.tsx`
- `src/app/learning/study/practice/MultipleChoiceQuiz.tsx`
- `src/app/shared/Card.tsx`
- `src/app/shared/ChoiceOptionGroup.tsx`
- `src/app/shared/CourseLessonNavigation.tsx`
- `src/app/shared/CurriculumQuizEngine.tsx`
- `src/app/shared/CurriculumVocabularyTable.tsx`
- `src/app/shared/LanguageInsightCard.tsx`
- `src/app/shared/PageContainer.tsx`
- `src/app/shared/PageHeader.tsx`
- `src/app/shared/QuizQuestionCard.tsx`
- `src/app/shared/SidebarNav.tsx`
- `src/i18n/ar.json`
- `src/i18n/en.json`
- `src/styles/globals.css`
- `docs/UI_CONSISTENCY_REVIEW_2026-10-10.md`
- `src/app/__tests__/discussion_prompt_groups.test.ts`
- `src/app/shared/DiscussionPromptSelect.tsx`
- `src/app/shared/ReferenceTable.tsx`
- `src/app/shared/discussionPrompts.ts`

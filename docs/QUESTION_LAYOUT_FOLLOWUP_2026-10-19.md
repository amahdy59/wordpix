# Question layout and UI review — 19 October 2026

Scope: source review of the shared question templates, core lesson exercises,
practice runners, specialist quiz cards, learning-material forms, and selected
Home, Learn, Practice and Library components. Browser coverage and results are
recorded below after verification. This is a targeted review, not a full
criterion-by-criterion WCAG 2.2 AAA audit.

## Screenshot diagnosis and local changes

- The sentence grid used equal `1fr` rows, with the prompt aligned to the bottom
  of its row. A tall image/help column therefore pushed the prompt down. The
  grid now uses a content-sized prompt row and starts both columns at the top.
  Answer choices follow the prompt with the shared question spacing.
- A square image was contained inside a much wider fixed frame. Media cards
  now fill the available content width on phones and their
  assigned grid column on tablets and desktop. Image height follows its natural
  proportions; taller questions scroll vertically. This avoids side panels and
  preserves clues that a global `object-cover` rule could crop. A square ratio
  reserves visible space while an image loads. Applied to sentence support,
  reading and
  picture-based practice, including typing exercises.
- Literal underscores plus a CSS border produced the doubled line. Shared
  `SentenceBlank` / `ClozeText` rendering uses a soft semantic surface and one
  solid baseline, with a localized screen-reader label. Sentence building,
  dictation, study practice, specialist quizzes, placement and story questions
  use this treatment; learning-material text inputs use the same visual style.
- Removed the sentence builder's additional dashed canvas baseline. Blanks
  retain positional labels; placed words remain keyboard-operable buttons.
- Learning-material answer fields can shrink within a narrow card, use localized
  accessible names, and expose an invalid state after an incorrect check.
- Added explicit English language/direction to the skill-runner question and
  transfer prompts. No curriculum order, scoring, progress keys, media URLs or
  asset mappings were changed.

## Recommended next improvements

| Priority | Recommendation                                                                                                                                                      | Evidence / locations                                                                                                                                                                                                                                | Acceptance check                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Make answer-state announcements consistent across every question family. Announce the selected answer and correct/incorrect result once; preserve keyboard focus.   | `ExerciseContextGapFill.tsx`, `ExerciseContextFill.tsx`, `ChoiceOptionGroup.tsx` and `MultipleChoiceQuiz.tsx` use separate state/feedback rendering. Some incorrect paths rely on the shared feedback panel rather than a dedicated status message. | Keyboard plus NVDA/VoiceOver review of correct, incorrect, retry and automatic/manual advance.                                            |
| High     | Verify feedback overlays against AAA contrast using their actual composited colors, and keep labels readable while identifying the whole image.                     | `ExerciseQuickQuiz.tsx` and `ExerciseRecallMatch.tsx` place translucent success/error overlays above artwork.                                                                                                                                       | Measure text against both bright and dark fixture images; keep a solid readable label surface and icon/text status cues.                  |
| High     | Complete a language and localization pass on older exercise suites. English learning text needs `lang="en" dir="ltr"`; interface controls need translated copy.     | `ListeningSuite.tsx` still contains literal titles/result text; `WritingSuite.tsx` has literal submit labels. Shared quiz cards accept strings or rich nodes with caller-owned language semantics.                                                  | Walk English and Arabic interfaces; confirm English pronunciation in a screen reader and correct Arabic control labels.                   |
| Medium   | Extract one image-choice card component for recognition and recall. Keep full-image containment for essential evidence, with an optional quiet decorative backdrop. | `ExerciseQuickQuiz.tsx` and `ExerciseRecallMatch.tsx` duplicate the image frame, blurred backdrop, number badge and feedback overlays.                                                                                                              | Square, portrait, landscape and failed-image fixtures render consistently without cropped clues or content-obscuring badges.              |
| Medium   | Show shortcut hints only when the shortcut setting and device support them. Keep the hint in the same compact location for each family.                             | Gap-fill/context-fill helper copy and numeric badges use screen-width visibility; `ChoiceOptionGroup.tsx` already consults `character-shortcuts` and pointer capability.                                                                            | Toggle shortcuts off and use a touch device: no instructions advertising inactive shortcuts.                                              |
| Medium   | Allow Library meanings and unit names to wrap when needed, and guard all hover/press transforms with reduced-motion preferences.                                    | `LibraryWordCard.tsx` truncates Arabic meanings and unit names; its audio control applies hover/active scaling without a motion guard.                                                                                                              | Long Arabic meaning and unit name at 320 CSS px / enlarged text; reduced-motion interaction has no scaling.                               |
| Medium   | Prefer one column for long labels at narrow widths; let content determine when short options can share a row.                                                       | `ReadingSuite.tsx` uses a fixed two-column answer grid. `answerLayout.ts` already provides a shared content-sensitive layout used elsewhere.                                                                                                        | Long multiword choices remain readable at 320 CSS px and 200% text, with every answer target at least 44×44 CSS px.                       |
| Medium   | Give repeated sorting/selection controls a consistent selected-state contract and sufficiently wide targets.                                                        | Skill runner sort buttons vary by color/border; short bucket labels can create narrow controls.                                                                                                                                                     | Expose selection programmatically (`aria-pressed` or a radio group), include a visible selection cue, and measure both target dimensions. |
| Medium   | Associate inline field errors and answer explanations with their inputs. Use labels in the current interface language and avoid color-only correctness.             | Learning materials now expose `aria-invalid`, but displayed correct answers are not yet connected with `aria-describedby`.                                                                                                                          | After checking, focus each wrong field: the reader announces its error and linked guidance; correct fields have a non-color cue.          |
| Low      | Consolidate question composition around the shared template and a small set of media/input variants.                                                                | Some suites use `ExerciseFamilyTemplate`; reading, writing and generic skill practice compose `.wp-question-layout` directly.                                                                                                                       | A change to spacing, option density or media treatment applies to all families without per-screen overrides.                              |

## Suggested order

1. Feedback semantics, actual overlay contrast and remaining localization gaps.
2. Library reflow/reduced motion, sorting states and content-sensitive answer grids.
3. Shared image-choice cards and consolidated question composition.

Keep the app's existing navigation, curriculum boundaries and progress state
machines. R2 assets and all content-ID-to-media mappings remain read-only.

## Verification

- `npx tsc --noEmit`: passed.
- `npx vitest run --maxWorkers=2`: 174 files / 3,043 tests passed.
- `pnpm run lint`: passed.
- Production build: passed; the final CSS was also rebuilt successfully with
  `pnpm exec vite build --logLevel error`.
- Final browser matrix: 78 checks passed across Chromium, mobile Chrome and
  mobile WebKit. Suites: `question-layout.spec.ts`, `rtl_and_darkmode.spec.ts`,
  and `accessibility.spec.ts`. Coverage includes 390px phones, an 820px tablet,
  desktop, unavailable and delayed images, all practice routes, specialist
  quizzes, Arabic/RTL, dark mode, 200% text and keyboard reachability.
- Visually inspected the real eye image at 390×844, 820×1180 and 1440×900,
  plus question construction and enlarged-text screenshots.
- Local gallery: `output/question-layout-fullwidth-review.html`. The square
  gray images in geometry checks are test fixtures; `eye-*` captures use the
  real existing lesson image. These are local screenshots, not content assets.

The first browser attempt during a saturated parallel test run timed out on a
curriculum loading screen. It was stopped and rerun with one browser worker;
all 78 checks then passed without relaxing the failing assertion.

Automated axe results alone do not establish AAA conformance or screen-reader
usability. A complete criterion audit, physical Android/tablet testing, and
NVDA/VoiceOver review remain recommended. Nothing was committed, pushed or
deployed; the changes remain local on `main`.

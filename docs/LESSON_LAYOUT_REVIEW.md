# Lesson layout review — 9 October 2026

## Findings and implementation scope

Reviewed the shared application and exercise shells, Home, Learn, Practice,
Library and Profile, the vocabulary study areas, and the stage renderers for
Hadith, Business, Conversation and Pronunciation. Lessons within each course
use these renderers; fixing a renderer applies to every lesson using it.

| Finding                                                                            | Correction                                                                  |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Hadith review/practice and footer are narrower than the lesson header              | Use the same content canvas for all stages and navigation                   |
| Business and vocabulary study stages change width between activities               | Keep stage containers on one content measure within each session            |
| Vocabulary audio buttons follow variable word lengths                              | Reserve a fixed audio column and align row content at the top               |
| Four/five table columns crowd tablet and narrow desktop layouts                    | Switch table/cards by available container width, not viewport width         |
| Definitions, translations, hints and controls use 11–14px text                     | Separate readable body text from 14px metadata; retain larger headings      |
| Example panels start at different vertical positions                               | Use consistent top alignment and padding across vocabulary columns          |
| Pronunciation footer uses negative margins and stacks actions out of reading order | Keep it inside the same gutters and preserve DOM/visual order               |
| Sticky controls occupy too much of short/zoomed viewports                          | Return them to normal flow when height is limited; reserve scroll clearance |
| Long lesson titles truncate and overview details squeeze the heading               | Wrap titles and let secondary controls reflow                               |
| Some interaction transforms lack reduced-motion guards                             | Guard hover/pressed transforms in the touched lesson controls               |

This is a layout review, not a claim that every lesson's editorial content or
every WCAG AAA criterion has been individually approved. R2 asset mappings are
read-only throughout this work.

Browser inspection also exposed ten Business quizzes containing an appended
instruction paragraph presented as a scored question, with a duplicate question
ID and generic answers. Removed those ten invalid entries; each original quiz
keeps its ten contextual questions and their IDs. Added a catalog regression
check for unique question identities and this known authoring error.

The follow-up editorial review found placeholder answer choices and feedback in
270 questions across Business units 11–19, 21, 23–28, and 30–40. Reviewed each
against its reading, language bank and sentence grammar, and replaced the
choices and explanations. Correct answer positions vary; question IDs remain
stable. Removed literal Markdown markers from these question stems. This review
does not advance the separate vocabulary translation approval ledger.

Business reading presentation now omits duplicate narrator passages and a
context paragraph repeated verbatim in the transcript. Original transcript
indices, full recording text and timing offsets remain intact. Repeated replies
from participants remain visible. Unit 28's repeated full passage was a concrete
example of this authoring problem.

Direct navigation between pronunciation lessons exposed carried-over local
screen state. Each lesson now mounts with its stable lesson identity so that
its own saved stage and question state are restored independently.

## Individual lesson and viewport verification

| Course        | Individual rendered coverage at both 320px and 1440px                            |
| ------------- | -------------------------------------------------------------------------------- |
| Vocabulary    | All 200 units, each with overview, learn, use, practice, review and reference    |
| Hadith        | All 42 lessons, each with read/listen, vocabulary, practice and review/apply     |
| Business      | All 40 units, each with eight main stages; recall additionally sampled in unit 2 |
| Conversation  | All 40 units, each with seven stages                                             |
| Pronunciation | All 68 lessons, each with all five stages, including direct lesson transitions   |

The base sweep checked 4,072 rendered views; the additional pronunciation sweep
checked 680 stage views (including the previously checked preview stages).
No horizontal page overflow, undersized visible buttons or clipped visible
headings/paragraphs remained in those sweeps. Transient development-module
loading failures were rerun successfully. Screen-reader-only text is excluded
from visual clipping checks.

Separate visual and geometry checks cover Home, Learn, Practice, Library and
Profile at 320px, 768px and 1440px, and Arabic/dark/reduced-motion cases at
320px, 640px × 450px and 1440px. Sticky specialist controls return to normal
flow in the short-height case. Arabic Continue buttons revealed a narrow target;
the shared primary button now reserves its minimum width and allows text to
increase height. The immersive exercise canvas includes gutters outside its
image measure, preserving useful image space on large displays.

These are structural/browser checks plus representative screenshot inspections,
not manual visual approval of every rendered page. Exhaustive local browser
checks used isolated learner state and blocked service workers to avoid filling
the offline media cache during thousands of route transitions. The release E2E
suite separately exercises the production build and offline behaviour.

## Release validation

- TypeScript: zero errors.
- Vitest: 135 test files, 2,728 tests passing, including canonical/shard parity
  and narration-presentation regressions.
- ESLint: passing.
- Production build and bundle budgets: passing.
- Existing Playwright release suite: all 122 desktop/mobile tests passing.
- Secret hygiene and canonical catalog media/identity integrity: passing.
- Corrected Business quiz layouts: 54 additional phone/desktop render checks
  passed with no stale placeholder choices, overflow or undersized controls.
- Hadith vocabulary: all five core audio controls share the same horizontal
  position; row columns share their top edge. Sampled keyboard controls in
  practice and review remain visible above the footer.

Release checks do not establish full WCAG AAA conformance. Manual assistive
technology validation and the separate editorial approval ledger retain their
own scope.

## Basis

- [WCAG reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow): content must reflow at narrow effective widths.
- [WCAG visual presentation](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation): readable text spacing and line measure.
- [C34: unfix sticky regions on limited viewports](https://www.w3.org/WAI/WCAG21/Techniques/css/C34): preserve content space at zoom and small heights.
- [Focus visibility](https://w3c.github.io/wcag/techniques/failures/F110): avoid obscuring keyboard focus with sticky controls.

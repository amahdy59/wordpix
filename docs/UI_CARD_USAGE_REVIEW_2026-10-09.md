# WordPix card and visual hierarchy review

Date: 9 October 2026  
Scope: supplied screenshot and source inspection of Home, Learn, Practice, Library, Profile, shared surfaces, and representative vocabulary, pronunciation, Hadith, conversation, and business learning screens. This is a design review, not a live browser walkthrough or a WCAG conformance audit. No application code or media references changed.

## Assessment

WordPix overuses explicit containment in several screens. The problem is not the existence of cards: image-led units, independent courses, answer choices, and a primary learning action benefit from a clear boundary. The problem is using similar borders, backgrounds, large radii, padding, and shadows for both meaningful objects and supporting labels. Nested surfaces weaken hierarchy and consume space that could serve the learning task.

This is a design judgment based on the inspected layouts, not a measured usability outcome. Card class counts would not establish severity: rounded buttons and image crops are not necessarily cards, and conditional screens do not render every container simultaneously.

## The supplied question header

The screenshot places “Question 1 of 10” and an unexplained “0/10” inside a wide rounded bordered surface. These are session metadata. They do not need an independent card.

There is a legitimate reason for a background if the row remains sticky: scrolled content must not show through the text. That does not require a rounded border, shadow, or large padding. A compact opaque strip can provide the same readability.

The exact originating screen cannot be identified from this crop alone. A matching pattern exists in `src/app/learning/hadith/HadithPractice.tsx:94`: a sticky bordered progress container displays question position, answered count, and a completion bar inside an already bordered practice section. Related framing occurs in `CurriculumQuizEngine.tsx:642` and `:698`, and `FigmaPronunciationLessonScreen.tsx:596`.

Recommended anatomy:

```text
Question 1 of 10                         Answered 0 of 10
[thin completion bar, if useful]

Which picture shows …?
[learning media / answer controls]

[persistent answer feedback]
```

Clarify what “0/10” means. In HadithPractice it counts answered questions, not correct answers. Keep position, completion, and score distinct. Do not infer completion from question position.

## Findings and replacements

| Priority | Area and evidence                                                           | Issue                                                                                                          | Recommendation                                                                                                                                                                                                                                    |
| -------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Question metadata: HadithPractice:79–127; CurriculumQuizEngine:642/698      | A progress surface sits above a separate question surface; Hadith also has an outer practice card.             | Use a compact metadata row and a thin progress bar. Keep an opaque background only when sticky. Choose one main task surface.                                                                                                                     |
| High     | Question prompts: ExerciseQuickQuiz:179; SkillExerciseRunner:287            | A prompt receives its own border and background before separate answer controls.                               | Use a prominent plain heading, supporting phonetic text, and an adjacent audio action. Preserve borders on selectable answers.                                                                                                                    |
| High     | Learn: LearningPath:227/255                                                 | The expanded route wraps stage containers and image unit cards, creating several framing levels.               | Keep image unit cards; use plain CEFR section headings, spacing, and separators for parent groups. Preserve sequence and unit-ID state.                                                                                                           |
| Medium   | Library: ExploreWorlds:395/466                                              | Bordered stage groups surround individual image cards.                                                         | Flatten stage framing. Consider a compact reference row layout for search results, with thumbnail, title, level, and reference action. Keep Library's reference/search role distinct from Learn.                                                  |
| Medium   | Profile: ProfileStats:258/313/354                                           | Each metric and skill is separately framed; an unpractised message gets another box inside its skill card.     | Group retention metrics in one definition-list strip; show comparable skills as aligned labelled progress rows. Render missing evidence as plain explanatory text.                                                                                |
| Medium   | Practice: SkillExerciseHub:320                                              | Every exercise uses a tall card, metadata pills, a footer divider, and repeated start text.                    | Retain the review hero as the strongest action. Trial compact exercise rows with title, relevant metadata, and a clear action. Compare readability before replacing the entire grid.                                                              |
| Medium   | Specialist curricula: CurriculumHeroHeader:31; BusinessCurriculumScreen:175 | Course orientation is another card; business filters also have a framed wrapper.                               | Use a plain course header and metric line, and a lighter filter toolbar. Keep the course/topic cards that represent independent destinations.                                                                                                     |
| Medium   | Home: HomeDashboard:163/260; ReleaseNotesCard:38                            | Several secondary surfaces compete with the next lesson.                                                       | Keep the primary lesson card. Reduce review framing where appropriate and make release updates a compact secondary notice. The existing unboxed daily target is a useful precedent.                                                               |
| Medium   | Shared foundations: Card:21/25; Surface:50; PageHeader:33                   | Defaults encourage card styling. Card's primary variant sets a pointer cursor even without an onClick handler. | Make containment a deliberate choice. Tie whole-surface pointer/hover affordance to real activation. Audit callers before changing defaults. Surface's flat variant still paints a background, so it does not create a fully transparent section. |

Line references describe the source inspected on the review date.

## Visual elements to use or enhance

1. **Typography and spacing:** distinguish page title, task prompt, section title, and metadata without enclosing each in a rectangle. Use semantic headings; the shared Section currently labels sections with a span rather than a heading.
2. **Existing learning imagery:** give the scene or target image greater prominence after removing redundant wrappers. Keep assessment images free of answer-revealing labels. Preserve every existing R2 URL and content-ID mapping.
3. **Meaningful progress:** use thin labelled bars for session completion and aligned bars for skill comparison. Keep mastery and accuracy labelled according to their actual data. Profile currently uses accuracy as its skill bar value; restyling must not relabel it as measured mastery.
4. **Quiet dividers:** separate settings, reference results, metadata, and optional explanations with whitespace or one separator instead of stacked cards.
5. **Selective icon use:** use icons to identify skill or action. Reduce repeated icon backgrounds and badges when the adjacent label already conveys the same information.
6. **Answer and feedback states:** preserve selectable borders, check/cross symbols, text feedback, and persistent explanations. These are functional boundaries. Feedback can join the task surface instead of becoming another floating card.
7. **Purposeful teaching visuals:** enhance existing word-family arrows and avoid/use comparisons in LanguageInsightCard. These communicate relationships; decorative gradients and extra shadows do not add the same learning value.
8. **Calmer geometry:** establish a documented radius/elevation hierarchy for controls, learning objects, and overlays. Reserve shadow for meaningful prominence instead of giving every section equal elevation.

## Rules for a future implementation

- Use a card for a distinct content object, selectable object, or independent destination/action group.
- Use plain layout for headings, progress labels, filters, and repeated comparative information.
- Treat “a card inside a card” as a review trigger, not an absolute prohibition. Answer controls, media crops, and feedback can justify internal boundaries.
- Preserve English/Arabic content, RTL layout, 44×44 px interactive targets, visible focus, text equivalents, and non-colour feedback. Verify contrast against actual semantic token pairings after removing backgrounds.
- Test sticky strips at zoom and short viewport heights. Existing short-height safeguards in globals.css should survive simplification.
- Do not replace useful content with decorative illustration or add animation merely to compensate for fewer cards.

Suggested sequence: simplify a representative quiz first; then parent grouping in Learn/Library; then Profile comparisons and Practice density; finally review shared defaults and secondary Home surfaces. Review English/Arabic, light/dark, mobile/desktop, keyboard focus, and unanswered/answered/error states before applying the pattern broadly.

No runtime tests were run because the deliverable is a review document and application behaviour is unchanged. A future implementation must follow the repository verification gates and bilingual release-note requirements.

## Implementation follow-up

The subsequent implementation applies compact quiz progress strips, plain prompts, quieter parent grouping, filtered Library thumbnail rows, Profile metric and skill comparisons, compact Practice rows, secondary Home notices, and intentional shared surface defaults. Functional answer boundaries and existing images are retained. Bilingual v0.1.8 release history documents the changes.

Business quick recall now uses one recognition question with two to four existing expressions as choices. Its displayed meaning and model sentence retain English language/direction metadata. Hints and confidence ratings are optional. Checked recall answers persist in the existing per-unit reflection-note store under prompt-ID keys. Business warm-up also presents one question at a time and preserves its existing saved notes.

Question and section browsing no longer requires answering everything. Navigation checkpoints record position independently; recall/warm-up completion requires all prompts answered, shared quiz completion requires all answers, and the existing course mastery prerequisites remain intact. Hadith practice can move to the next question without submitting an answer.

Focused tests cover choice coverage throughout the Business curriculum, skipping, revisiting, saved answers, empty recall, incomplete-score prevention, navigation state, layout, and touch targets. Final consolidated unit, lint, build, and browser validation is coordinated with the separate release chat to avoid duplicate resource-heavy runs. This follow-up is not a WCAG conformance claim.

## Reference

[Material UI card documentation](https://mui.com/material-ui/react-card/) describes cards as content and actions about one subject. That supports deliberate grouping; the screen-specific recommendations above are this review's judgments. WordPix's own design and interaction guidance in docs/04 and docs/05 supplies the local token, hierarchy, progress, and accessibility constraints.

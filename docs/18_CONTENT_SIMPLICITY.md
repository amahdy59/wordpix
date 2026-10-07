# Content simplicity

WordPix keeps the current learning task prominent. Navigation has five tabs: Home, Learn, Practice, Library, and Profile. Specialist curricula remain separate courses under Learn.

## Visible by default

- A meaningful title and the current action.
- The immediate task instruction when the action alone is insufficient.
- Relevant level, duration, and progress without repeated summaries.
- Lesson material, questions, answer choices, corrective feedback, errors, and necessary recording/privacy information.

## Optional help

Use `HelpDisclosure` for secondary explanations. Use its inline form for one longer optional section and its icon form for short contextual help on a card. Give icon triggers a specific translated accessible name. Do not put an info icon beside every heading, and do not add help when removing redundant copy is sufficient.

Help opens deliberately on click or tap. Keyboard users can activate the native summary control; Escape closes help and returns focus to its trigger. Icon help also dismisses on an outside pointer action. Keep targets at least 44×44px and retain visible focus. Longer help stays in the document through a native disclosure rather than an interactive tooltip.

Do not force descriptions onto one physical line: enlarged text, Arabic, and narrow viewports must wrap. Prefer no description when the title and controls already explain the screen. As editorial starting points, use headings around 2–5 words and necessary guidance around 6–12 words; clarity takes precedence over word counts.

## Shared learning interactions

Use `CurriculumHeroHeader` for compact specialist course orientation, `CurriculumTopicCard` for lesson cards, and the existing question/choice primitives for scored questions. Keep one clear completion action. Unscored discussions must not imply a correct answer; optional speaking can support productive practice without required ungraded typing.

Definitions of progress belong in one optional section, rather than beneath every metric. Filters keep their active state visible even when additional choices are collapsed. Library is a reference/search interface, while LearningPath remains the curriculum browser.

## Verification

Check English and Arabic, keyboard operation, touch behavior, narrow reflow, focus, reduced motion, semantic contrast tokens, and usable help bounds. Run the required typecheck, unit tests, lint, and related browser checks. Do not claim WCAG conformance from an automated scan alone.

References: [GOV.UK Details](https://design-system.service.gov.uk/components/details/), [W3C Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html).

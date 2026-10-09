# Course lesson navigation and layout

The four courses now share four navigation groups. Grouping changes presentation;
each course keeps its existing stage IDs, saved progress and unlock rules.

| Course        | Read & listen          | Language               | Practice  | Review & apply               |
| ------------- | ---------------------- | ---------------------- | --------- | ---------------------------- |
| Pronunciation | Preview, Listen        | Meaning                | Use it    | Transfer                     |
| Hadith        | Read & listen          | Vocabulary             | Practice  | Review & apply               |
| Conversation  | Warm-up, Reading       | Language bank, Toolkit | Quiz      | Discussion, Challenge        |
| Business      | Recall, Warm-up, Input | Vocabulary, Usage      | Exercises | Discussion, Speaking, Review |

## Decisions applied

- **Information architecture:** Four stable section headings provide orientation.
  Detailed stages appear within the selected group, preserving course structure.
- **Interaction:** Navigation and completion remain available while scrolling.
  Quiz progress sits below the lesson rail, using its measured height rather than
  assuming English labels fit on one line. Visiting a section does not mark it complete.
- **Writing:** Mobile labels are shorter, with full accessible names. The Hadith
  quiz has shorter instructions and one question counter. The Learner flow panel
  is removed; optional model answers and existing learning activities remain.
- **Visual hierarchy:** Language insight cards use icons, headings and distinct
  semantic surfaces. Corrections separate the avoided phrase from the suggested
  wording. Color supplements the text rather than carrying the meaning alone.
- **Layout:** Wide picture quizzes allocate most space to the question and choices.
  Hadith pictures use their natural aspect ratio without empty framing. On small
  screens Hadith stacks the prompt, image and answers.
- **Learning:** Hadith adds source recall, explanation and application prompts.
  Hadith, Conversation and Business add follow-ups about reasons, gentler wording
  and role reversal. Pronunciation adds sound recall, contrast and sentence transfer.
- **Responsiveness:** Short mobile navigation labels avoid broken words. Sticky
  bars return to normal flow below 28rem viewport height to preserve reading space.
- **Accessibility:** Native controls retain focus styling, accessible names and
  minimum 44px height. Scroll offsets account for the rails. Motion uses existing
  reduced-motion rules. English and Arabic interface strings are included.

## Validation and limits

TypeScript, the full unit suite, lint, a production build and the related Hadith,
Conversation and Pronunciation browser suites passed. Desktop and 390px mobile
scroll geometry were inspected, including Arabic RTL. The automated Hadith
accessibility scan passed. These checks do not establish full WCAG AAA conformance.

Future content expansion should use lesson-specific prompts and source-grounded
answers; the new reusable follow-ups supplement the authored questions.

The layout follows W3C guidance for [unobscured keyboard focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html)
and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

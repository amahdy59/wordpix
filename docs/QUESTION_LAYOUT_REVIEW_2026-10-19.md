# Question layout review — 19 October 2026

The attached sentence-completion screenshot identified a real layout fault: the prompt, picture and answers each grew independently, so their combined height exceeded the screen. The prompt's filled surface and rounded border also suggested that it was another answer. At 1440 × 900 the previous production build needed 823 px inside a 746 px activity viewport. The prompt alone had a 2 px border and 28 px padding.

This update applies a shared question layout across the active learning surfaces. Ordinary short questions should fit without scrolling at standard text size. Larger text, expanded explanations, long passages and the on-screen keyboard must remain usable through vertical scrolling; content is never hidden, truncated or reduced below the learner's chosen text size to force a fit.

## 1. UX improvements

1. **Make the question look like a question.** Remove its card background, rounded border and decorative shadow. Use a plain, readable prompt; reserve outlined/filled controls for answers and actions. Applied to gap fill, shared curriculum quizzes, study practice, placement and pronunciation instructions.
2. **Put the task before supporting material.** Sentence-completion prompts now precede their image and answer group in document order. On phones this is the visible order too; wider screens place the prompt and answers beside the image.
3. **Keep one compact navigation region.** Preserve the exercise title, stage position, group and item count while sharing a metadata row. Use a thinner progress track rather than four vertically stacked header rows.
4. **Keep evidence and response close together.** On wider screens, pictures/passages and the response area share two columns. Sentence construction uses a plain assembly area with an underlined boundary; removable tiles remain buttons.
5. **Treat help as support.** Meaning support retains its disclosure, with a quieter separator instead of another card competing with answer choices. If an image is unavailable, the meaning clue opens automatically and appears once rather than being repeated in the placeholder. Audio controls remain available. Long reading and transfer tasks remain complete.
6. **Preserve feedback and state.** Keep correct/incorrect labels, icons, retry/continue actions and existing scoring/resume rules. A selected answer retains its focusable control. No questions, assessment criteria or learner progress are removed to save space.

## 2. Responsiveness improvements

1. **Use available width and height together.** The standard exercise canvas uses the wide layout measure; media splits at 48 rem. Media height responds to `dvh`, with a separate short-window rule. Width alone no longer forces larger question type or taller pictures.
2. **Give the image a resolved height.** Instructional images use a bounded frame with `object-fit: contain`. Intrinsic image dimensions cannot make the question grow indefinitely, and essential visual evidence is not cropped.
3. **Remove forced minimum stage heights.** Audio matching and picture checkpoints fill their available stage instead of imposing 460–520 px minima on short windows. Their existing image-answer grids remain interactive.
4. **Reflow by question type.** Short text choices remain readable rows, image answers keep their grid, sentence tiles wrap, and category sorting uses two columns when space allows. Source passages retain a readable line length.
5. **Keep the scrolling viewport usable.** Normal windows keep navigation outside the activity scroller. On short windows, navigation scrolls with the question so enlarged text cannot squeeze the answers into a tiny clipped strip. A header container query gives narrow or enlarged titles a full-width row rather than wrapping them one letter at a time. Controls retain scroll margins and device safe areas remain reserved.
6. **Do not promise zero scrolling in every state.** The fit target covers ordinary unanswered questions at standard text size. Long passages, multi-item sorting, disclosures, detailed error explanations and enlarged text may need vertical scrolling. Horizontal overflow and inaccessible controls remain failures.

## 3. Accessibility improvements

1. **Preserve text enlargement.** Prompt sizes use rem-based tokens with a capped fluid scale. The application font-size preference remains in effect; 200% text checks use a 320 px wide, short viewport.
2. **Keep touch targets usable.** Standard answer rows retain at least 48 px height; other action controls retain the project's 44 px minimum. Reducing padding does not shrink controls below that requirement.
3. **Keep prompt and answer semantics separate.** Questions retain heading/label relationships. Answers remain native buttons, radios, checkboxes, inputs or selects. The reading visual-context exercise now exposes selected state and a visible keyboard focus indicator, and prevents checking an empty answer.
4. **Respect shortcut preferences throughout shared answer groups.** Number shortcuts can be disabled without losing Tab, arrows, Enter or Space. Repeats, typing targets and modifier combinations are ignored. With multiple active questions, number shortcuts act only on the focused answer group.
5. **Preserve bilingual reading order.** English learning content keeps `lang="en"`/`dir="ltr"`; Arabic navigation and explanatory content retain their own direction. Layout uses logical spacing and adapts to RTL.
6. **Retain non-colour signals and reduced motion.** Feedback icons, labels, pressed/checked states, focus outlines and reduced-motion behavior remain. Browser axe checks are evidence for their tested states, not a full WCAG AAA conformance claim.

## 4. Visual design improvements

1. **Use a restrained type hierarchy.** Navigation title, small instruction, prominent prompt, normal-size answer. Instructions use the body token; question prompts range from 18 to 24 px at the standard 16 px root, rather than growing to display-heading size.
2. **Reduce competing surfaces.** The prompt is transparent. Answer options use consistent borders, corners and state colours; media has one frame. Feedback receives its own surface after submission.
3. **Spend extra space on the activity.** Expand the working canvas and image/response arrangement instead of inflating typography or inserting oversized prompt padding. Individual lines of prose remain constrained.
4. **Keep spacing systematic.** Shared question gap, prompt type and image-height tokens replace unrelated large paddings and breakpoint-specific stage minima. Colours remain semantic tokens with existing light/dark/enhanced-contrast pairings.

## Layout inventory and implementation coverage

| Question family                     | Active surfaces                                                                                | Applied treatment                                                                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vocabulary presentation             | Listen & repeat                                                                                | Existing focused word layout retained; it presents a word rather than an answerable question. Covered by the existing six-viewport layout tests.      |
| Audio → picture                     | Audio Match                                                                                    | Compact shared header; available-height image grid; forced stage minima removed.                                                                      |
| Picture → word / sentence gap       | Complete the sentence; retained picture-match component                                        | Plain prompt and inline blank; bounded image; distinct answer rows; prompt before evidence in reading order.                                          |
| Picture checkpoint                  | Mastery Quick Quiz                                                                             | Plain prompt; available-height image choices; no forced 500 px stage.                                                                                 |
| Sentence completion / ordering      | Core sentence builder; Practice ordering; Hadith sequence                                      | Plain prompt/assembly boundary; wrapping buttons; undo/removal preserved.                                                                             |
| Passage comprehension               | Authored reading context; story context checks                                                 | Source/response split on wide screens; plain question; bounded supporting media. Long source content remains scrollable.                              |
| Single choice                       | Shared Practice runner; Business exercises; Conversation quiz; Hadith practice; study practice | Plain prompt, distinct answer controls and feedback. Shared number-key scope fixed.                                                                   |
| Multiple selection                  | Vocabulary spotting; podcast comprehension and other runner tasks                              | Native checkbox labels preserved; responsive response workspace.                                                                                      |
| Text entry / dictation / correction | Runner entry tasks; Dictation Sprint; Timed Speed Writing Sprint                               | Prompt separate from labelled input and submit; picture/input split where applicable; short-window scrolling available.                               |
| Category assignment                 | Category Sort                                                                                  | Two-column item layout when there is room; button-operated categories preserved, with no drag-only dependency.                                        |
| Open speaking/writing practice      | Runner practice tasks; Echo Practice; specialist speaking/discussion; transfer practice        | Plain prompt and separate guidance/response controls. Recording consent and self-assessment rules retained. Long coaching content remains scrollable. |
| Pronunciation                       | Preview, listening discrimination, minimal pairs, recording, mixed review                      | Plain instruction region; bounded image-choice height; two-choice comparisons stay side by side on phones. Choice labels retain readable size.        |
| Starting check                      | Optional placement modal                                                                       | Plain prompt distinct from answer buttons. Dialog maximum height, focus trap, audio/transcript alternative and scrolling retained.                    |

The 31 selectable Practice screens are included in the browser layout inventory at 390 × 844 and 1440 × 900:

- Listening: Word Match; Audio Scene Match; Dictation Sprint; Vocabulary Spotting; Dialogue Role-Play; Selective Shadowing; Warm-up Refresher; Podcast Comprehension.
- Reading: Visual Context; Progressive Reveal; Error Detection; Comic Strip; Infographic Reading; Category Sort; Subtitle Correction; Confidence Check.
- Speaking: Echo Practice; Scenario Response; Photo Narration; Video Roleplay; Compare & Contrast; Word Chain; Self-Repair.
- Writing: Caption Builder; Sentence Assembly; Photo Journal; Video Summary; Error Correction; Paraphrase Challenge; Image Story Chain; Timed Sprint.

Results screens are summaries, not question layouts. Review scheduling, curriculum ordering, question content, media identity, audio/image URL resolution and R2 objects are outside this layout change.

## Verification and review artifacts

Pronunciation reference help follows the task on phones and remains in the desktop side rail. Shared answer shortcuts pause when a modal owns the keyboard.

The open speaking/writing practice action says “I've practised” (with an Arabic equivalent), so it no longer suggests that an unscored response can be automatically checked.

`e2e/question-layout.spec.ts` measures the sentence fit at 390 × 844, 1280 × 720 and 1440 × 900; checks the 31 Practice routes at phone/desktop sizes; verifies keyboard reachability under 200% text; captures reading/construction and specialist quiz states. Existing browser suites cover image matching, pronunciation, RTL/dark mode, recording disclosure, study practice and complete learning flows. Screenshots are local review evidence, not production content.

A generated local gallery links to full-resolution screenshots and groups them by viewport. The final release checks, gallery location and limitations are reported with the implementation result.

Generate the gallery after the browser run with `node scripts/build_question_layout_gallery.mjs --source output/question-layout-verified`. It writes `output/question-layout-review.html`. Captures identify the browser and use CSS-pixel dimensions. The gallery shows representative starting states of the question layouts, plus enlarged-text focus checks; it is not a screenshot of every item or every feedback state in the content corpus.

The initial full browser run exposed a short-window WebKit focus failure at 200% text. Its header left only 56 px for the activity, and a hidden ancestor could scroll the focused answer behind the clip. The short-window scroll fallback and full-width title layout address that mechanism. The same English and Arabic checks passed three consecutive repetitions each after the fix, without relaxing the focus/visibility assertion.

A subsequent full run exposed duplicate fallback clues when remote images failed. The missing-image state now opens one meaning clue and keeps all three answers visible at 390 × 844. The sentence-builder target-size check retries the locator measurement while authored content replaces its initial content, rather than sampling a detached control. The standard sentence, unavailable image, sentence builder and English/Arabic enlarged-text checks then passed 15 WebKit runs across three consecutive repetitions.

Manual checks with NVDA, VoiceOver, physical mobile keyboards/orientation and speech input remain necessary for complete accessibility evidence. Real learner review is still needed to judge comfort, cognitive load and preferred image size. This update does not claim perfect usability or WCAG AAA conformance.

## References

- [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): enlarged content can remain available through vertical scrolling at narrow widths.
- [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html): text enlargement must not remove content or functionality.
- [W3C Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html): the enhanced target-size requirement and its exceptions.
- WordPix guidance: `02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md`, `04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md`, `05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md`.

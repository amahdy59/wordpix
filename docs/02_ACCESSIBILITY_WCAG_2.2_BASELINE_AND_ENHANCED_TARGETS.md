---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Accessibility — WCAG 2.2 Baseline and Enhanced Targets

## Conformance policy

The application MUST meet all applicable **WCAG 2.2 Level A and AA** success criteria.

The project additionally targets selected Level AAA outcomes that materially improve the learner experience, especially:

- Enhanced text contrast.
- Larger pointer targets.
- Strong focus appearance.
- Clear help and error prevention.
- Reduced cognitive and timing pressure.

Do not claim full WCAG AAA conformance unless every applicable AAA criterion has been audited. “AAA color contrast” is not equivalent to “WCAG AAA conformance.”

## Project contrast standard

| Content | Minimum project target |
|---|---:|
| Normal text | 7:1 |
| Large text | 4.5:1 |
| UI component boundaries and meaningful graphics | 3:1 |
| Focus indicator against adjacent colors | 3:1 |
| Disabled content | Must remain understandable even when WCAG contrast exceptions apply |

For this requirement, **large-scale text** means at least **18 pt (approximately 24 CSS px) when regular**, or at least **14 pt (approximately 18.5 CSS px) when bold**, evaluated at the delivered size. Treat the ratios as hard thresholds and **do not round upward**: for example, `4.499:1` does not meet `4.5:1`. Test every semantic token pair in light and dark modes.

The contrast requirement applies to text in normal states and to text shown as placeholders, hover content, focus content, validation feedback, banners, toasts, charts, and text placed over images, gradients, video, or variable backgrounds. Where the background varies, evaluate the least-contrasting expected area behind the text or provide a stable contrasting surface.

## Perceivable checklist

### Text and alternatives

- [ ] Every informative image has an equivalent text alternative.
- [ ] Decorative images use empty alternative text or are hidden from assistive technology.
- [ ] Icons used as controls have accessible names.
- [ ] Visible labels and accessible names match.
- [ ] Charts and progress visuals provide text summaries.
- [ ] Color is never the only way to indicate correct, incorrect, selected, locked, due, or completed.

### Adaptability and scaling

- [ ] Content remains usable at 200% browser zoom.
- [ ] Reflow works at 320 CSS pixels without two-dimensional scrolling except for essential content.
- [ ] Text-spacing overrides do not cause clipping or loss of function.
- [ ] Layouts tolerate longer Arabic strings and system font changes.
- [ ] Orientation is not locked unless essential.
- [ ] Content order in the DOM matches the meaningful reading order.

### Audio and motion

- [ ] Audio information has text or visual equivalents.
- [ ] Narration can be paused, stopped, replayed, and muted.
- [ ] Captions are provided for meaningful prerecorded video.
- [ ] Reduced-motion preference is honored.
- [ ] Essential feedback does not depend on animation.
- [ ] Flashing content remains below seizure-risk thresholds.

## Operable checklist

### Keyboard and focus

- [ ] All actions work by keyboard.
- [ ] No keyboard traps exist.
- [ ] Focus order follows the task and reading order.
- [ ] Focus is visible in every theme and component state.
- [ ] Opening a modal moves focus into it.
- [ ] Closing a modal returns focus to the logical trigger.
- [ ] Route changes move focus or announce the new page context deliberately.
- [ ] Skip navigation is available where repeated navigation exists.
- [ ] Roving `tabindex` and arrow-key behavior are used only for patterns that require them.
- [ ] Native buttons activate with `Enter` and `Space`; links navigate with `Enter`.

### Targets and input

- [ ] Primary interactive targets are at least 44 by 44 CSS pixels where practical.
- [ ] No essential action requires dragging; provide tap/click/keyboard alternatives.
- [ ] Pointer gestures have single-pointer alternatives.
- [ ] Hover content is also available on focus and can be dismissed.
- [ ] Accidental activation can be canceled or reversed for consequential actions.
- [ ] Repeated submissions are prevented without trapping the learner.

### Timing

- [ ] Learning tasks are not timed unless timing is the learning objective.
- [ ] Time limits can be extended, disabled, or explained where applicable.
- [ ] Auto-advancing content can be paused.
- [ ] Session expiration protects work and gives warning.
- [ ] Streaks do not create inaccessible urgency.

## Understandable checklist

- [ ] Each page has a descriptive title and one clear primary heading.
- [ ] Instructions are visible before interaction.
- [ ] Labels remain visible; placeholders do not replace labels.
- [ ] Error messages identify the problem and the corrective action.
- [ ] Submitted values are preserved after validation errors.
- [ ] Error summaries link to affected fields for multi-field forms.
- [ ] Destructive or high-impact actions provide review, confirmation, or undo.
- [ ] Language changes are identified in markup.
- [ ] Navigation and component behavior remain consistent.
- [ ] Help appears in consistent locations.

## Robust checklist

- [ ] Use native HTML whenever it provides the required behavior.
- [ ] ARIA roles, names, states, and properties match actual behavior.
- [ ] Custom widgets follow the WAI-ARIA Authoring Practices keyboard model.
- [ ] Status messages are announced without moving focus unnecessarily.
- [ ] Error, progress, sync, and completion announcements avoid repeated or verbose speech.
- [ ] IDs, label associations, headings, landmarks, and lists are valid.
- [ ] Automated tests find no serious or critical accessibility violations.
- [ ] Manual assistive-technology testing is completed for critical flows.

## Component accessibility contract

Every interactive component must document:

- Semantic element or role.
- Accessible name.
- State and property mapping.
- Keyboard behavior.
- Focus entry, movement, and restoration.
- Screen-reader announcement.
- Target size.
- Contrast pairs.
- Reduced-motion behavior.
- RTL behavior.
- 200% text behavior.
- Error and disabled behavior.

## Required manual test matrix

At minimum:

- Keyboard only.
- Windows + NVDA + Chrome or Firefox.
- macOS/iOS + VoiceOver + Safari.
- Android + TalkBack where Android is supported.
- 200% zoom and text spacing override.
- Reduced motion.
- High contrast or forced colors where supported.
- Light and dark.
- English and Arabic.
- Offline and sync failure.

Automated tests are a first line of defense, not proof of conformance.

## Release blockers

- Keyboard trap.
- Unlabeled critical control.
- Inaccessible authentication or lesson flow.
- Missing focus indicator.
- Data loss caused by assistive-technology use.
- Critical content hidden at 200% zoom.
- Incorrect reading order that changes meaning.
- Contrast failure in core text.
- Drag-only or pointer-only required action.
- Unannounced blocking error.
- Arabic/bidi output that changes mathematical meaning.

## Primary references

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [APG keyboard interface guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [GOV.UK focus states](https://design-system.service.gov.uk/get-started/focus-states/)
- [Microsoft Inclusive Design](https://inclusive.microsoft.design/)
- [Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines)

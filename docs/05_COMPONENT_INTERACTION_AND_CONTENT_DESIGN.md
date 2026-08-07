---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Component Interaction and Content Design

## Component contract template

Every production component must define:

```md
Name:
Purpose:
Anatomy:
Allowed content:
Variants:
States:
Default behavior:
Keyboard behavior:
Focus behavior:
Screen-reader behavior:
Responsive behavior:
RTL behavior:
Theme behavior:
Child/adult behavior:
Loading behavior:
Empty behavior:
Error behavior:
Disabled behavior:
Analytics:
Data dependencies:
Acceptance tests:
```

A Figma component without behavior is not a complete component contract.

## Native-first rule

Use native elements when they match the interaction:

- `<button>` for actions.
- `<a href>` for navigation.
- `<input>`, `<select>`, `<textarea>` for form controls.
- `<details>` for simple disclosure.
- headings in a logical hierarchy.
- lists for grouped items.
- tables only for tabular relationships.
- `<progress>` or properly labeled equivalents for determinate progress.

ARIA does not add keyboard behavior automatically. A custom role is a promise to implement the complete interaction.

## State matrix

Every interactive component should account for:

- default;
- hover;
- focus;
- active/pressed;
- selected/checked;
- disabled or unavailable;
- loading;
- success;
- warning;
- error;
- offline;
- syncing;
- conflict;
- empty;
- read-only.

Do not visually design a state without defining its semantic and behavioral meaning.

## Buttons and links

- A button performs an action; a link changes location.
- Accessible name should match or include the visible label.
- Avoid vague labels such as “Click here,” “Continue” without context, or icon-only actions without names.
- Destructive actions require clear language and proportionate confirmation or undo.
- Loading buttons keep a stable label or announce the updated state.
- Disabled controls must explain how the user can proceed when the reason is not obvious.
- Do not nest interactive elements.

## Forms

- Keep labels permanently visible.
- Place hints before errors in the reading order.
- Use appropriate input types and autocomplete tokens.
- Validate at a useful time; avoid interrupting typing with premature errors.
- Validate again at the trusted boundary.
- Preserve entered values after errors.
- Move focus to an error summary for complex submission errors.
- Link each summary item to the field.
- Error copy states what happened and how to fix it.
- Do not rely on color, icons, or toast messages alone.

## Dialogs

- Use dialogs only for focused tasks or decisions that should interrupt the current context.
- Give the dialog an accessible name and, when useful, description.
- Move focus inside on open.
- Keep focus within a true modal.
- Support `Escape` unless it would cause harmful data loss; in that case provide a clear close/cancel path.
- Return focus to the logical trigger or next context.
- Avoid nested dialogs.
- Do not place lengthy learning content in a modal.

## Tabs, accordions, menus, and tooltips

Use these patterns only when the information architecture supports them.

- Tabs switch between peer views and require full keyboard semantics.
- Accordions are for optional or selectively relevant sections, not to hide required instructions.
- Menus contain actions or choices, not general site navigation unless using a deliberately implemented menu pattern.
- Tooltips supplement a visible label; they do not contain essential information or interactive content.
- Hover-triggered content must also open on focus and remain dismissible.

Follow the relevant WAI-ARIA APG pattern rather than improvising.

## Feedback and announcements

Use the least disruptive mechanism:

| Need | Preferred pattern |
|---|---|
| Immediate field error | Inline error tied to field |
| Multi-field submission error | Error summary + inline errors |
| Non-blocking saved state | Visible status + polite live region |
| Blocking system failure | In-context error panel |
| Destructive confirmation | Dialog or undo pattern |
| Lesson answer feedback | Persistent in-task feedback region |
| Sync state | Persistent status, not transient toast only |

Avoid announcing every small visual update. Live regions should be concise and tested with screen readers.

## Progress

Differentiate:

- Session progress: where the learner is in the current activity.
- Mastery progress: learning status over time.
- Sync progress: technical transfer state.
- Download progress: resource transfer.

Do not combine these into one ambiguous bar.

Progress MUST include a text equivalent. Indeterminate progress should not present a false percentage.

## Content guidelines

### UI copy

- Use direct, concrete verbs.
- Put the needed action first.
- Keep one idea per sentence.
- Use familiar learner language.
- Avoid jargon, idioms, and culturally narrow metaphors.
- Do not blame the learner.
- Do not describe controls only by visual position.
- Keep terminology consistent across English and Arabic.
- Use sentence case in English.

### Feedback copy

Prefer:

- “Try again. Count the groups first.”
- “Your answer is saved on this device and will sync when you are online.”
- “We could not sync yet. Your completed lesson is still safe.”

Avoid:

- “Invalid.”
- “You failed.”
- “Something went wrong” with no recovery.
- “Click the green button on the right.”

## Acceptance checklist

- [ ] Native semantics are used where possible.
- [ ] State matrix is complete.
- [ ] Keyboard behavior is documented and tested.
- [ ] Focus behavior is documented and tested.
- [ ] Accessible name matches the visible purpose.
- [ ] Error and recovery behavior is explicit.
- [ ] Arabic and text expansion work.
- [ ] 200% text does not clip content.
- [ ] Loading does not cause duplicate activation.
- [ ] Analytics does not capture sensitive content.
- [ ] Component stories cover states and modes.
- [ ] Automated and manual accessibility checks pass.

## References

- [WAI-ARIA Authoring Practices Guide patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [APG: Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [APG: Dialog modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [APG: Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
- [GOV.UK error message](https://design-system.service.gov.uk/components/error-message/)
- [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/)
- [GOV.UK validation pattern](https://design-system.service.gov.uk/patterns/validation/)
- [Material Design accessibility writing](https://m3.material.io/foundations/writing)

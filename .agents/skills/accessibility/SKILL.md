---
name: accessibility
description: WCAG 2.2 AAA checklist and validation steps for any WordPix UI change
metadata:
  category: quality
---

# Accessibility (WCAG 2.2 AAA)

Use this skill whenever you create or modify UI: components, dialogs, forms, animations, or copy. Accessibility is a non-negotiable guardrail in this project, not a nice-to-have.

## Non-Negotiables

- Contrast: 7:1 for normal text, 4.5:1 for large text (AAA).
- Touch targets: at least 44x44px.
- Visible focus indicators on every interactive element; logical keyboard order.
- Screen reader labels via aria-label/aria-labelledby where visible text is insufficient.
- Live regions (`aria-live`) for async progress and status feedback.
- Never rely on color alone to convey meaning.

## Component Rules

- Buttons for actions, links for navigation — never a clickable `div`.
- All forms use `react-hook-form` + zod validation with accessible error messages.
- Every dialog traps focus, closes on Escape, and returns focus to the trigger.
- Respect `prefers-reduced-motion` for framer-motion animations.

## Validation

1. Run `pnpm run lint` — `eslint-plugin-jsx-a11y` catches many violations.
2. Run the relevant axe-core E2E specs (`e2e/accessibility.spec.ts`, `tests/accessibility.spec.ts`).
3. Manually verify keyboard-only navigation for new flows.

## References

- `docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md`
- `docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md`

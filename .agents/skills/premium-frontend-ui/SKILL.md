---
name: premium-frontend-ui
description: Production-grade frontend UI engineering for WordPix. Interactive state completeness, accessibility, and fluid animations.
metadata:
  category: ux
  upstream: global premium-frontend-ui
---

# Premium Frontend UI (WordPix)

Use when building or reviewing customer-facing UI: components, screens, design tokens, animations.

## 1. Complete State Matrix (all 8, no exceptions)

Every interactive component must implement distinct visual + accessible styling for:

1. Default — resting appearance from semantic tokens only.
2. Hover — pointer affordance (desktop); `44x44px` minimum target preserved.
3. Focus-Visible — high-contrast 2px outline for keyboard; no outline on mouse click (`:focus-visible`).
4. Active / Pressed — physical press feedback.
5. Disabled — `aria-disabled="true"`, reduced opacity, `cursor-not-allowed`, not clickable.
6. Loading / Pending — inline spinner or skeleton with `aria-busy="true"` + live-region status.
7. Empty — helpful copy + icon + call to action.
8. Error — descriptive message linked via `aria-describedby`.

## 2. WordPix Rules

- Semantic design tokens only (no one-off hex/spacing). See `docs/04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md`.
- AAA contrast: 7:1 normal text, 4.5:1 large text.
- Native-first: `<button>` for actions, `<a>` for navigation — never clickable `div`.
- `framer-motion` must respect `prefers-reduced-motion`.
- Bilingual: all copy via i18next (`src/i18n/`), RTL-aware. See `.agents/skills/i18n/SKILL.md`.
- Child/adult modes: one clear next action, recognition over recall. See `docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md`.

## 3. Validation

1. `pnpm run lint` (jsx-a11y + react-hooks).
2. Keyboard-only walkthrough of the flow.
3. Axe-core spec if user-facing (`e2e/accessibility.spec.ts`).

## References

- `docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md`
- `docs/04_VISUAL_DESIGN_SYSTEM_UNTITLED_UI_V8.md`
- `docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md`
- `.agents/skills/accessibility/SKILL.md`

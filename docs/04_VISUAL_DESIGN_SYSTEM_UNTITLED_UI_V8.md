---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Visual Design System — Adapting Untitled UI v8

## Principle

Untitled UI v8 is the baseline library, not the product identity. Reuse its component logic, variables, and production patterns while mapping them through project-owned semantic tokens.

Do not directly scatter Untitled UI primitive values across product screens.

## Token architecture

Use four layers:

```text
Primitive tokens
→ Semantic tokens
→ Component tokens
→ Component variants and states
```

### Primitive tokens

Raw scales such as:

- neutral and brand color ramps;
- font families and weights;
- spacing scale;
- radii;
- shadows;
- durations and easing.

Primitive names describe value, not purpose.

### Semantic tokens

Semantic names describe intent:

```text
color.bg.canvas
color.bg.surface
color.bg.elevated
color.text.primary
color.text.secondary
color.text.inverse
color.border.default
color.border.strong
color.action.primary
color.action.primaryHover
color.focus.ring
color.status.success
color.status.warning
color.status.error
color.learning.new
color.learning.practice
color.learning.mastered
```

Every semantic color token must define light and dark values and documented contrast pairings.

### Component tokens

Use only when a component needs a stable contract that cannot be expressed cleanly through shared semantic tokens.

```text
button.primary.bg.default
button.primary.bg.hover
button.primary.text
progress.track
progress.value
lessonCard.radius
```

Avoid a component-token explosion that duplicates semantic intent.

## Theme modes

At minimum, support:

- Light.
- Dark.
- Forced colors or high-contrast compatibility.
- Reduced motion.
- Child expression.
- Adult expression.

Child/adult expression is not a color theme. It may adjust density, radius, illustration, typography scale, and celebration intensity while retaining semantic meaning.

## Color-system checklist

- [ ] Every text/background pair meets the project contrast target.
- [ ] Every meaningful border or icon meets non-text contrast requirements.
- [ ] Hover, active, focus, selected, disabled, and visited states are distinct.
- [ ] Correct/incorrect and status states use more than hue.
- [ ] Focus tokens are reserved and remain visible over all surfaces.
- [ ] Dark mode is designed, not mechanically inverted.
- [ ] Elevation does not depend only on shadow in dark mode.
- [ ] Data visualization palettes include patterns, labels, or shapes.
- [ ] Token names do not include mode-specific words such as “white text” unless truly invariant.
- [ ] Contrast is tested with the actual token pair at the delivered font size and weight; ratios are not rounded upward.
- [ ] Placeholder, hover, focus, validation, toast, and text-over-image/gradient states meet the same applicable text-contrast target.

## Typography

- Use a type family with robust Arabic and Latin support or a carefully matched pair.
- Define semantic styles such as display, heading, body, label, caption, and numeric.
- Keep line height comfortable and resilient to text-spacing overrides.
- Do not use ultra-light weights for body text.
- Avoid all-caps for long labels and never transform Arabic to uppercase.
- Use tabular numbers only where comparison benefits.
- Mathematical notation may require a dedicated math font or renderer.
- Text styles MUST scale without clipping controls.

## Spacing and layout

- Use logical properties: `margin-inline`, `padding-block`, `inset-inline-start`.
- Base spacing on a consistent scale, but prioritize usable target size and text reflow over strict rhythm.
- Define responsive containers and content widths.
- Avoid fixed heights for text-bearing components.
- Keep reading measures moderate.
- Use grid for page-level structure and flex for one-dimensional component layout.
- Do not visually reorder content differently from DOM order.

## Radius, shadow, and elevation

- Radius communicates product expression but must not reduce target area or focus visibility.
- Use a small documented elevation scale.
- Pair elevation with border or surface change where shadow is weak.
- Avoid decorative glass effects that reduce contrast.
- Child mode may use softer geometry; adult mode may use calmer geometry. Component anatomy remains shared.

## Motion

Define semantic motion tokens:

```text
motion.duration.instant
motion.duration.fast
motion.duration.standard
motion.duration.celebration
motion.easing.enter
motion.easing.exit
motion.distance.small
```

Rules:

- Motion explains continuity or feedback.
- Do not animate every state change.
- Avoid large parallax, flashing, and vestibular triggers.
- Reduced motion removes non-essential transforms and replaces them with opacity or immediate state change.
- Completion celebrations are short, interruptible, and optional.

## Component variant discipline

### Button System & Hierarchy

All interactive buttons across the application must strictly adhere to the following hierarchy:

| Variant                     | Purpose & Appearance                                                                                  | Sizing & Spacing Tokens                                                                                                   | Focus & Interaction Tokens                                                                                                                                                 |
| :-------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary CTA**             | Primary page or flow action (e.g., "Continue", "Reveal Word", "Got It"). Solid brand fill.            | `min-h-[48px]` to `min-h-[56px]`, `px-6 py-3`, `rounded-2xl` (or `rounded-xl`), font weight 700.                          | `hover:bg-primary/90`, `active:scale-[0.98]`, `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`. No text underlines.                              |
| **Secondary / Outline**     | Alternative action (e.g., "Previous", "Show Details", "Practice Again"). Card background with border. | `min-h-[48px]`, `px-5 py-2.5`, `rounded-2xl` (or `rounded-xl`), `border border-border bg-card text-foreground font-bold`. | `hover:bg-secondary hover:border-primary/40`, `active:scale-[0.98]`, `focus-visible:ring-2 focus-visible:ring-ring`.                                                       |
| **Pill / Filter Chip**      | Topic & category switching (e.g., "All", "Idioms", "Phrasal Verbs").                                  | `min-h-[44px]`, `px-4 py-2`, `rounded-full`, text size `text-xs` to `text-sm font-bold`.                                  | **Selected**: `bg-primary text-primary-foreground border-primary`. **Unselected**: `border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground`. |
| **Icon Action**             | Compact utility action (e.g., Audio playback, Close menu, Back).                                      | `size-11` (`44x44px`), `rounded-xl` or `rounded-full`, centered icon.                                                     | `bg-secondary text-primary hover:bg-primary/20 transition-colors`, explicit `aria-label`.                                                                                  |
| **Status / Category Badge** | Non-interactive metadata chips (e.g., "Needs practice", "A1-A2", "3 min").                            | `px-2.5 py-1`, `rounded-lg`, `text-xs font-semibold`, `bg-secondary text-secondary-foreground border border-border/50`.   | Static element; generous horizontal and vertical padding prevents clipped glyphs.                                                                                          |

### Spacing, Padding, and Margin Scale

All layout containers and components must use the project 4px/8px modular spacing scale:

- **Layout Viewports & Screens**: `p-4 sm:p-6 md:p-8`
- **Component Cards & Sections**: `p-5 md:p-6`, rounded with `rounded-2xl`
- **Interactive Rows & List Items**: `p-3.5 sm:p-4`, `gap-3 sm:gap-4`, rounded with `rounded-xl`
- **Section-to-Section Rhythm**: `space-y-6 md:space-y-8`
- **Internal Card Flow Rhythm**: `space-y-3` to `space-y-4`
- **Button / Input Height Rule**: Every clickable element strictly enforces `min-h-[44px]` (WCAG 2.5.5 Level AAA touch target criterion).

Do not create a new variant solely to fix one screen. First check whether the need is a semantic token, layout wrapper, or content issue.

## Figma-to-code parity

Maintain a mapping table:

| Figma               | Code                                   |
| ------------------- | -------------------------------------- |
| Variable collection | CSS custom properties or token package |
| Component property  | Typed component prop                   |
| Variant             | Enumerated prop or composition         |
| Boolean property    | Boolean prop                           |
| Slot                | `children` or named slot               |
| Mode                | Theme/data attribute                   |
| Interaction note    | Testable behavior                      |
| Deprecated style    | Deprecated token with migration note   |

Rules:

- Export semantic tokens, not screenshot-derived values.
- Do not manually retype large token sets.
- Version token changes.
- Generate a changelog for renamed or removed tokens.
- Detect unmapped tokens in CI when practical.
- Keep source-of-truth ownership explicit.

## Adapting Untitled UI v8

- Start from the v8 variable and Tailwind 4 architecture where used.
- Preserve accessible component anatomy.
- Replace brand and semantic values through tokens.
- Remove components and variants that the product does not need.
- Audit any imported component before declaring it production-ready.
- Do not copy marketing-page density into learning tasks.
- Avoid coupling domain logic to vendor component internals.
- Wrap vendor components behind project component contracts when business or accessibility behavior is added.

## Design-system release gate

- [ ] Token names are semantic and documented.
- [ ] Light/dark pairings pass contrast.
- [ ] Child/adult modes do not fork component logic.
- [ ] Focus is visible.
- [ ] 200% text examples pass.
- [ ] Arabic examples pass.
- [ ] Component state matrices are complete.
- [ ] Deprecated tokens have migration notes.
- [ ] Figma and code mapping is current.
- [ ] Storybook or equivalent documents interactive states.
- [ ] Automated accessibility checks pass.
- [ ] Manual keyboard and screen-reader review is complete for core components.

## References

- [Untitled UI](https://www.untitledui.com/)
- [Untitled UI React: upgrade to v8](https://www.untitledui.com/react/docs/upgrade)
- [Untitled UI color styles](https://www.untitledui.com/components/color-styles)
- [Material Design 3 accessibility foundations](https://m3.material.io/foundations/overview/principles)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Apple HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [GOV.UK focus states](https://design-system.service.gov.uk/get-started/focus-states/)
- [WCAG 2.2 contrast requirements](https://www.w3.org/TR/WCAG22/#contrast-enhanced)

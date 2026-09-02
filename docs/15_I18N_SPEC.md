# WordPix i18n Specification

Status: **Active** · Applies to all UI components and copy

---

## 1 · Two Separate Languages

WordPix runs two language tracks simultaneously:

| Track                  | Purpose                               | Controlled by                                   |
| ---------------------- | ------------------------------------- | ----------------------------------------------- |
| **Interface language** | Menus, labels, feedback, instructions | `useI18n().interfaceLang` (`en` or `ar`)        |
| **Learning language**  | Vocabulary being taught               | Always English (`en`) — fixed by product design |

A learner using Arabic UI is still learning English words.

---

## 2 · lang and dir Attribution Rules

### HTML document

Set automatically by I18nContext via document.documentElement.

### English learning content inside Arabic UI

Every English word, sentence, example, or option in an Arabic interface MUST carry explicit inline attributes:

```tsx
<span lang="en" dir="ltr">{word.label}</span>
<p lang="en" dir="ltr">{sentence}</p>
<span lang="en" dir="ltr">{option}</span>
```

**Why:** WCAG 3.1.2 (Language of Parts). Screen readers use this to switch voice/pronunciation.

### Unknown / user-entered content

Use `<bdi>` or `dir="auto"` to isolate unknown-direction strings.

---

## 3 · Number Formatting

All numbers shown in the interface must pass through `formatNumber(value, numeralSystem)`.
The `numeralSystem` preference is `"western"` (default) or `"arabic"` (Arabic-Indic digits).

---

## 4 · Pluralization

Arabic has six plural forms (zero, one, two, few, many, other).
Use react-i18next `t("key", { count })` with `_zero/_one/_two/_few/_many/_other` suffixes.
The dependency is already installed.

---

## 5 · Arabic Typography Differences

| Property                    | Latin   | Arabic                            |
| --------------------------- | ------- | --------------------------------- |
| `text-transform: uppercase` | Allowed | **Never**                         |
| `letter-spacing`            | Common  | **Avoid** — breaks letter joining |
| `line-height`               | 1.5x    | **1.8–2x** recommended            |

Use semantic CSS classes that suppress Latin-only styles in Arabic context:

```css
.label-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:lang(ar) .label-eyebrow {
  text-transform: none;
  letter-spacing: normal;
}
```

---

## 6 · RTL Icon Policy

**Mirror** (directional navigation): ArrowRight/Left, chevrons, progress bar fill direction.
**Do NOT mirror**: Play/Pause, Speaker, Checkmark, Clock, Camera, brand graphics.

Use the shared `<ForwardIcon>` component for all navigational arrows.

---

## 7 · Component Acceptance Criteria

A component passes i18n review when:

- All visible UI strings use `t("namespace.key")`
- All aria-label/aria-valuetext/SR-only text uses `t()`
- English learning content carries `lang="en" dir="ltr"`
- Numbers use `formatNumber(value, numeralSystem)`
- Directional navigation icons use `<ForwardIcon>` or equivalent
- Typography classes with uppercase/tracking are suppressed for Arabic

---

## 8 · Long-String Testing Requirements

Before shipping any new UI string:

1. Test with the longest expected translation (Arabic is 20–40% longer than English)
2. Test at 200% browser zoom
3. Test on 320px viewport width
4. Verify no clipping, truncation, or horizontal overflow

Heading elements must never use `truncate` — use `line-clamp-2` at most.

---

## 9 · Fallback Behavior

The `t()` function falls back:

1. Active language bundle
2. English bundle
3. The key string itself (visible — a deliberate bug signal, not a silent empty)

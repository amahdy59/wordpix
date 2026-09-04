# Listen & Repeat completion — 2026-09-04

## Implemented against the requested desktop/mobile checklist

- Compact responsive header: Back to the owning unit, centered title, Exit, Bilingual/Immersion selector, unit name, word count, and one progress bar.
- No thumbnail strip or Previous/Next footer. Desktop 44px arrows sit outside the card; mobile arrows overlay the image. Left/Right keys, horizontal swipe, visible focus, and desktop keyboard hint remain supported. The final forward arrow continues to the next lesson activity.
- Desktop image/content columns use 64.3%/35.7%. Mobile recomposes into image then content. Photos fill their containers with cover, without stretching or letterboxing. Per-photograph focal overrides and optional vocabulary focal metadata preserve selected subjects across layouts.
- Bilingual shows Arabic when a real gloss exists. Immersion removes Arabic from both the learning card and the details panel, including example translations.
- One 48px Listen action and one 48px optional speaking action, no redundant pronunciation icons, privacy note, and shared 44px segmented-control styling.
- Manual is the default. Continuous starts only when selected, waits for the current audio to finish, pauses 1.2 seconds for repetition, and advances. It stops at the last word without automatically completing the exercise. Manual/Stop, details, speaking practice, exit/back, hidden tabs, and unmount cancel playback/advancement. Failed playback returns to Manual and shows retry guidance.
- Full-width details trigger opens an overlay drawer on desktop and a bottom sheet below 1024px. The main card does not resize. The existing dialog focus trap, background inertness, Escape dismissal, close control, and focus return are retained.
- 16px mobile page/card padding, 12–16px component gaps, semantic colors, and responsive action sizing. The 390×844 reference check fits the normal lesson controls within the viewport; smaller screens can scroll vertically.

## Verification

- `npx tsc --noEmit`: passed.
- `npx vitest run`: 2,050 tests passed across 63 files.
- Focused ESLint on changed exercise, audio, dialog, focal-point, and test code: passed.
- `pnpm run build`: passed; existing bundle-size warnings remain.
- Full Playwright suite: 34 passed before the final pause-state label/error refinements. Final Listen & Repeat pass: all 12 desktop/mobile project checks passed at 320, 390, 768, 1440, and 1920px.
- Browser assertions cover absence of thumbnails, no horizontal overflow, desktop column proportions, modes, keyboard navigation, drawer/sheet geometry after animation, close control, and focus return. Existing accessibility scanning remains green.
- New controlled audio tests prove natural completion can advance playback, while stopped/replaced requests cannot; pending advance cancels on details/Stop; final word returns to Manual. Immersion tests confirm translated content is absent from the DOM.

## Scope and limitations

These changes are local, uncommitted, and not deployed. Earlier Word Group changes remain in the same working tree.

Focal overrides were reviewed for selected Bedroom, Bathroom, and Construction Site photos. Other photographs retain a centered fallback unless vocabulary metadata supplies a focal point; an exhaustive manual crop review of the entire vocabulary catalog has not been performed. An object already cut off in its original photograph cannot be restored by focal positioning.

Browser checks use Chromium desktop and mobile emulation, not physical iOS/Android devices. Automated accessibility checks do not by themselves certify complete WCAG conformance.

# Word Group redesign — 2026-09-04

## Implemented

- A centered 1040px container, compact header with desktop Back text, and matching secondary Test out / Study materials actions.
- A semantic list of freely selectable groups, with no numbered timeline or simulated device chrome.
- One learning action per group: Start, Continue, or Review, based on the existing exposure/mastery records. The existing curriculum and lesson launch payload are preserved.
- Real vocabulary samples and calculated remainder counts; a single learned/total label and accessible progress values; a mobile groups-started summary.
- Visible mobile photos and chevrons, responsive desktop actions, and distinct keyboard focus. Necessary story, browse, and drill shortcuts remain in individually named menus with initial focus, arrow navigation, and Escape focus return.
- Small 160/320px WebP thumbnails generated from existing assets during build/dev, served from the application origin. First cover is eager; other covers lazy-load. Existing image fallback remains available.
- Optional per-group focal-point metadata. All six Bathroom covers were visually reviewed at phone, tablet, laptop, and desktop sizes and assigned focal positions. Other units use the center fallback and have not received an exhaustive manual crop audit.

## Verification

Passed: TypeScript, 2,046 Vitest tests, production build, focused ESLint, and all 34 Playwright tests (desktop and mobile Chromium projects). Group layout checks run at 320, 390, 768, 1280, and 1600px. Browser coverage checks card bounds, loaded generated images, a single learning action, accessibility scanning, menu focus/return, and opening a lesson. Listen & Repeat browser regression checks remain included.

The two obsolete source-string tests for the removed timeline/action row were replaced with actual browser containment measurements.

## Listen & Repeat comparison

The earlier comparison described the deployed exercise, which only partially matched the reference. The missing controls and responsive layouts are now implemented locally; see [Listen & Repeat completion](LISTEN_REPEAT_COMPLETION_2026-09-04.md) for behavior and verification details.

## Release status

The earlier commit `1ccccd667dcfdd0d4eaa019e81a9c37a21b4897b` was pushed; [CI](https://github.com/amahdy59/wordpix/actions/runs/33802196540) and [GitHub Pages](https://github.com/amahdy59/wordpix/actions/runs/33802196392) both succeeded. Its live audio check passed CDN playback, nonempty IndexedDB persistence, reload, and offline blob playback. The new Word Group work is local and has not been committed or deployed.

Real Supabase sign-in and cross-device progress verification remain unavailable without a configured test project/account, as previously discussed.

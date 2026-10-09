# Reading and listening update — October 9, 2026

Business and Conversation readings now use one article containing their title,
audio controls, context, paragraphs, summary where authored, and vocabulary
lookup. Narration uses ordinary paragraphs; dialogue retains speaker labels.
Hadith preserves Arabic and English as distinct language regions in one reading
surface, with a stacked or side-by-side layout. Related Business usage and
Conversation model examples have less nested framing.

The existing reading measure and semantic theme tokens govern typography,
spacing, contrast and focus. Vocabulary terms come from the corresponding
lesson vocabulary, rather than inferred substrings or placeholder definitions.
Reviewed forms include “stress testing” for “stress test.” Underlined terms stay
in the prose; 44px word-detail controls sit below it. Native radio inputs provide
the speed selector's standard keyboard behavior. English passages retain their
language and direction inside the Arabic interface.

## Playback

The shared player supports recorded play, pause, resume, restart, elapsed time,
keyboard seeking, buffering, cancellation and retry. Playback-rate changes
update the current media element without resetting its position. Vocabulary
pronunciation pauses an existing recorded narration; the learner can resume the
same recording afterward. Audio ownership also prevents an abandoned async
request from starting after another activity takes over.

The complete passage is retained for device-speech fallback, including text
after parentheses and slashes. The UI identifies device speech and does not
offer a fabricated timeline. Device-speech pause/resume depends on the browser
and voice engine; rate changes during that playback are disabled. A missing
device voice remains a retryable error when native recording playback is
supported.

## Read-only media findings

- The pictured Business Unit 35 has no explicit reading recording entry. Its
  full-reading and first-paragraph lookups returned HTTP 404 for both voice
  profiles attempted by the player.
- The explicit Business recording manifest contains Unit 1. Conversation has
  entries for all 40 units, with 340 full/paragraph entries.
- Sampled Business Unit 1 and Conversation Unit 1 full recordings returned HTTP
  200 with `audio/mpeg` content and byte-range support. Browser checks played
  those existing recordings with a real timeline.
- Browser checks of Business Unit 1 exercised pause/resume, speed changes,
  keyboard seeking, pronunciation without overlap, and glossary focus return.
- Business Unit 35 started device speech successfully and identified that
  fallback explicitly, without a fabricated seek timeline.
- Background offline-cache requests failed from the local preview origin.
  Online media-element playback succeeded. Offline availability of those
  recordings is not established by this review.

No R2 object, media mapping, audio manifest, timing manifest, or authored
curriculum passage was modified. Missing recordings require a separate asset
workflow; this update does not claim to generate them or repair bucket settings.

## Validation

The ordered TypeScript, full unit and lint gates passed: zero type errors,
2,776 tests across 140 suites, and zero lint errors or warnings. The production
build and bundle budget check also passed. Evidence is retained in the worktree's
`output/reading` folder. All 36 related desktop/mobile E2E checks passed across
Conversation, Hadith, accessibility, RTL and dark-mode specs. Browser validation
covers 24 presentations: Business,
Conversation and Hadith, English/Arabic, light/dark, 320px/1280px. These passed
the selected axe WCAG rules, including enhanced contrast, without detectable
violations, horizontal overflow, or reading controls below 44 × 44px.

Additional visual checks apply 200% CSS zoom and text-spacing overrides to all
three reading types. This is not a complete WCAG AAA conformance audit or a
substitute for manual screen-reader testing.

The implementation is isolated on `codex/reading-experience` in the attached
`reading-experience` worktree.
The other chat's checkout and release files are not overwritten. Bilingual
v0.1.9 release notes are prepared locally; publication is a separate action.

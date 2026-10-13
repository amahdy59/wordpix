# Pronunciation and course decluttering validation

Status: Implemented locally; production deployment and participant validation are separate steps.

## Implemented behavior

- Pronunciation, Conversation, Business, and Hadith share one current-step navigator with an optional, scrollable outline. Course stage identities and unlocking rules stay course-owned.
- Pronunciation displays a compact header, one activity instruction, contextual playback controls, optional sound guidance, and one main continuation action.
- Restart and adjacent-lesson navigation live in lesson options. Speaking recordings remain optional and local; recognition results do not claim speaking accuracy.
- Answer choices retain keyboard focus after success. Lesson information uses the existing modal accessibility hook and portals outside the inert application root.
- New pronunciation attempts persist stage, question, attempts, current answer, unlocked stage, and first-attempt evidence through the existing IndexedDB learner-state persistence.
- Revisiting a scored question does not duplicate evidence. Older stage-only checkpoints retain historical scores and explicitly restart a fair scored attempt.
- Automatic continuation is opt-in for new learners; saved explicit preferences remain intact. Leaving, switching, resetting, opting out, replaying feedback, and interacting with recording cancel obsolete continuation work.
- Curriculum rows are compact. Search includes target words, contrasts, IPA, and available Arabic guidance. Search and filter choices survive returning from a lesson. Chapter progress does not depend on filtered results; due status refreshes across local midnight and app visibility changes.
- Update notices remain queued while learners are in activities. Outside activities, release details are optional. Text does not fade through low-contrast intermediate states, and motion respects reduced-motion preferences.
- R2 assets and content-to-media mappings were not modified.

## Regression coverage

Unit coverage includes scored resume, duplicate-answer prevention, focus preservation, earlier-stage navigation, session normalization, Arabic and IPA search, auto-advance cancellation, and deferred update notices.

Browser coverage includes pronunciation audio keys, keyboard answers, IndexedDB reload/resume, modal containment and restoration, Arabic at enlarged text, explicit automatic continuation, curriculum discovery, course navigation, and existing accessibility/RTL/theme checks. WebKit supplements desktop Chromium and mobile Chromium emulation.

Run the project gates in order:

1. `npx tsc --noEmit`
2. `npx vitest run`
3. `pnpm run lint`
4. `pnpm run build`
5. `pnpm run check:bundle`
6. `npx playwright test e2e/pronunciation-audio.spec.ts e2e/curriculum-discovery.spec.ts e2e/conversation.spec.ts e2e/hadith.spec.ts e2e/accessibility.spec.ts e2e/rtl_and_darkmode.spec.ts`

Use actual command results as evidence; this document does not certify conformance or replace the test reports.

## Remaining human validation

- Test a physical iPhone with Safari and VoiceOver, plus Android with TalkBack and a desktop screen reader.
- Check contrast, focus appearance, no obscured focus, touch targets, 200% text enlargement, narrow reflow, and English/Arabic direction handling criterion by criterion before claiming WCAG 2.2 AAA conformance.
- Observe 5–8 adult learners performing lesson discovery, exercise start, incorrect-answer recovery, help discovery, and interrupted-session resume.
- Compare time to first meaningful interaction, mistaken navigation, successful recovery/resume, exercise completion, and learning quality against the earlier version.
- Verify microphone refusal, unsupported recording, offline media availability, and cleanup on real devices.

No participant testing, physical-device testing, or production deployment is claimed by this implementation record.

## Local verification record — October 13, 2026

- TypeScript: `npx tsc --noEmit` passed.
- Unit and component tests: 149 files, 2,835 tests passed.
- ESLint: `pnpm run lint` passed with no errors or warnings.
- Production build and bundle budgets passed.
- Visual inspection: mobile pronunciation lesson and curriculum at 360 × 740 CSS pixels; screenshots saved under `output/playwright/`.
- Safari interaction regression: pointer activation now establishes the modal opener, and disclosures dismiss through Escape or outside pointer interaction without removing a child action on blur.
- Spoken feedback has a bounded recovery path if media or speech synthesis never completes. Manual continuation remains available.

Browser test results are recorded separately below after completion of the final run.

Final browser verification: **81 tests passed** across mobile WebKit, desktop Chromium, and mobile Chromium (six affected-flow/accessibility/RTL specs). This includes the Safari disclosure preference toggle, explicit automatic continuation, replay cancellation, modal focus containment/restoration, persisted question resume, curriculum discovery, and Arabic at enlarged text.

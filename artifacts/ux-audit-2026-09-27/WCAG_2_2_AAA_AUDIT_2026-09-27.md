# WordPix WCAG 2.2 AAA Audit

**Audit date:** 2026-09-27  
**Application:** WordPix SPA  
**Scope:** Current local production build, English/LTR and Arabic/RTL, light and dark themes, 320px mobile and desktop Chromium, core navigation, guided learning, vocabulary library, practice, profile, pronunciation, conversation, representative lesson and modal components.  
**Standard:** WCAG 2.2, Levels A, AA, and AAA, plus the WordPix 44×44px and 7:1 project guardrails.

## Conformance statement

WordPix **must not yet claim WCAG 2.2 AAA conformance**. The three automated release blockers identified by this audit have been remediated and pass their post-remediation checks, but several criteria remain unverified because conformance requires manual NVDA, VoiceOver, TalkBack, keyboard, zoom, forced-colors, and cognitive-language testing on representative devices.

The application has a strong accessibility baseline: the tested routes pass the normal WCAG A/AA axe rules, dialogs have reliable focus management, critical layouts reflow at 320 CSS pixels, semantic tokens generally meet the project contrast target, and English/Arabic layouts passed the automated RTL matrix. A second browser-assisted phase verified representative keyboard navigation, dialog focus containment/restoration, forced-colors state visibility, localized page structure, and 200%/400%-equivalent reflow. A third phase added real service-worker/IndexedDB offline recovery and rejected-authentication browser journeys, but it does not replace live-account or assistive-technology testing.

## Evidence collected

- Final full Playwright E2E matrix: **90/90 scenarios passed** across desktop and mobile Chromium, including accessibility, RTL/dark-mode, offline/authentication resilience, curriculum discovery, pronunciation audio, and responsive-layout journeys.
- Full unit suite: **2,504/2,504 tests passed**, including focused semantic-token, landmark/heading, touch-target, service-worker registration, network-status, session-expiry, guest-migration, sync-payload, and RLS-contract checks.
- Runtime AAA probe: seven core routes in English/light and Arabic/dark at 320×720, with axe's `color-contrast-enhanced` rule, visible-target measurement, and WCAG text-spacing overrides.
- Post-remediation runtime probe: **0 enhanced-contrast violations, 0 visible target-size failures, and 0 text-spacing overflows** across 14 route/locale/theme combinations; `prefers-contrast: more` computed white text on black and produced 0 enhanced-contrast violations.
- Required engineering gates passed: TypeScript, production build, full Vitest suite, and ESLint.
- Source inspection of interaction semantics, animation guards, timers, dialogs, live regions, focus styles, media controls, and deep learning flows.
- Browser-assisted keyboard audit at 320×720: five-tab navigation activates by keyboard, the Settings dialog traps focus through all 28 focusable controls, Escape closes it, and focus returns to its trigger.
- Focus-obscuration regression: the mobile “Start” action was initially covered by the fixed bottom navigation; scroll padding was added and the action was retested wholly visible.
- Screen-reader structure proxy: all 14 English/Arabic core route combinations expose exactly one `main`, one localized `h1`, correct page language/direction, a descriptive title, and a populated route-status live region. This is structural evidence, not a substitute for testing with an actual screen reader.
- Reflow matrix at 640px and 320px (200% and 400% viewport equivalents for a 1280px reference width): **0 page-level horizontal overflows** across seven routes in English and Arabic. Native browser zoom remains a target-device manual check.
- Forced-colors browser check: current-page navigation now receives a 2px system-color outline, focus remains visible, and the page has no horizontal overflow.
- Offline recovery browser check: a setting changed while offline survives a service-worker-controlled reload in real IndexedDB, and its `update_accessibility` mutation remains queued for later synchronization on desktop and mobile Chromium.
- Authentication rejection browser check: a network-boundary sign-in failure remains in the accessible dialog, presents an alert, preserves the learner's entered credentials, and retains the guest exit path on desktop and mobile Chromium.
- Session-expiry and migration unit checks: an expired session is rejected before remote writes while preserving the queue; an incomplete migration response retains local progress and the migration receipt.
- Phase 3 remediations: service-worker registration now works when React initializes after the window `load` event; the authentication dialog is portalled outside the inert application root; and a persistent bilingual network-status message explains that offline progress is stored locally and confirms reconnection.
- Phase 4 hardening: queued and migration payloads are runtime-validated; permanent validation/authorization failures are classified and preserved; unit-assessment completion has a dedicated valid mutation; retryable failures expose a bilingual 44px recovery action; RLS updates use write-side ownership checks; the signup trigger has a fixed search path; and migration receipts are append-only to clients.
- CI now enforces the existing bundle budgets plus secret and dependency checks. The Vitest toolchain was upgraded to 4.1.11 to remove two moderate development-only path-traversal advisories; the final dependency audit reports no known vulnerabilities.
- A protected, manually triggered staging workflow and runbook now define session-refresh, two-user isolation, RPC identity, authenticated replay, device, and assistive-technology validation without embedding credentials in the repository.
- Native-device limitation: NVDA was not installed in the available Windows environment, native application control was unavailable, and browser zoom shortcuts did not produce a measurable zoom change in the available in-app browser. NVDA/VoiceOver/TalkBack, true 200%/400% browser zoom, and physical Windows High Contrast Mode remain manual device checks.

The repeatable runtime probe and its post-remediation JSON output are stored beside this report as `runtime-a11y-audit.mjs` and `runtime-a11y-results-after-remediation.json`.

## Confirmed release blockers

### A11Y-001 — Visible small text fails 7:1 enhanced contrast

**Severity:** Release blocker under the WordPix project standard  
**WCAG:** 1.4.6 Contrast (Enhanced), Level AAA
**Status:** Remediated and runtime-verified on 2026-09-27

Confirmed runtime failures:

1. Library selected-filter count: white 10px text on a translucent violet surface measured **5.63:1**, below 7:1. Source: `src/app/shared/FilterChip.tsx:80`.
2. Pronunciation “All” result count in light mode measured **6.28:1**. Source: `src/app/shared/CurriculumFilterTabs.tsx:82`.
3. The same pronunciation count in Arabic dark mode measured **5.48:1**.

Although these counts are `aria-hidden`, they remain visible information for sighted learners and therefore still require sufficient visual contrast.

**Recommended correction:** Remove opacity/translucency from text-bearing count surfaces. Use an explicit semantic count foreground/background token pair validated at 7:1 in light, dark, and high-contrast themes.

**Implemented:** Removed selected-count opacity/translucency in `FilterChip` and `CurriculumFilterTabs`; added source regression guards and reran the enhanced-contrast probe with zero violations.

### A11Y-002 — Multiple pointer targets are smaller than 44×44px

**Severity:** Release blocker under the WordPix project standard  
**WCAG:** 2.5.5 Target Size (Enhanced), Level AAA
**Status:** Remediated and runtime-verified on 2026-09-27

Confirmed runtime failure:

- All 68 pronunciation “View pedagogical details” controls render at **40×40px** in English and Arabic. Source: `src/app/learning/foundations/PronunciationLessonCard.tsx:169`.

Additional confirmed source-level risks in deeper flows:

- Story “play dialogue” control: 36px high; per-line audio controls: 28×28px; quiz navigation: 36px high. Sources: `ExerciseStory.tsx:626`, `:660`, `:861`.
- Word-family audio controls: 36px high. Source: `WordDetailsContent.tsx:320`, `:336`, `:352`, `:368`.
- Vocabulary detail audio controls: 36px high. Source: `VocabularyDetailModal.tsx:282`, `:301`, `:320`, `:339`.
- Business topic filters: 36px high on mobile. Source: `BusinessCurriculumScreen.tsx:394`.
- Pronunciation recovery audio control: 32px high. Source: `FigmaPronunciationLessonScreen.tsx:841`.

Some WCAG target-size exceptions may apply to redundant or inline targets, but they do not satisfy WordPix's locked 44×44px requirement. The pronunciation detail controls have no equivalent 44px target and are a confirmed failure.

**Recommended correction:** Apply `min-h-11 min-w-11` or the shared `wp-touch-target` utility to every interactive control. Extend the runtime target sweep to deep lesson, detail, and curriculum routes; the current source test misses concatenated and dynamic class strings.

**Implemented:** Raised the identified pronunciation, story, vocabulary, business, recovery, and shared audio controls to at least 44px; replaced the redundant pronunciation arrow button with a decorative span; strengthened the TypeScript-AST source guard; and added a computed mobile target sweep. The post-remediation runtime probe found zero visible undersized controls on its 14 route combinations.

### A11Y-003 — `prefers-contrast: more` creates near-black text on black

**Severity:** Release blocker  
**Related WCAG:** 1.4.3, 1.4.6, 1.4.11
**Status:** Remediated and runtime-verified on 2026-09-27

The `prefers-contrast: more` block assigns undeclared bridge names such as `--wp-foreground` and `--wp-muted-foreground`, while the application consumes `--wp-text` and `--wp-text-secondary`. Runtime computed body colors were:

- Foreground: `rgb(15, 23, 42)`
- Background: `rgb(0, 0, 0)`

This is approximately **1.17:1**, making default text effectively unreadable. Source: `src/styles/theme.css:324–337`.

**Recommended correction:** Override the actual semantic source tokens (`--wp-text`, `--wp-text-secondary`, `--wp-surface`, `--wp-card`, `--wp-border`, and paired accent foregrounds), then add a browser regression test using `contrast: "more"` in both color schemes.

**Implemented:** The media query now overrides the live semantic source tokens and paired accent tokens. Browser regression coverage confirms `rgb(255, 255, 255)` text on `rgb(0, 0, 0)` and no enhanced-contrast violations in both browser profiles.

## Important coverage gaps

### A11Y-004 — Existing touch-target test produces a false-green result

**Status:** Remediated for the identified parser gap; representative runtime sampling is complete

`touch_targets.test.ts` passed 143 file cases but did not detect the confirmed 28–40px controls. Its parser only recognizes a subset of static `className` forms and does not validate computed browser geometry.

**Implemented:** The source test now uses the TypeScript AST to detect explicit undersizing in native buttons, checks the shared `AudioButton` size map, and is paired with a Playwright computed-geometry sweep on representative curriculum routes.

### A11Y-005 — Assistive-technology testing is incomplete

The browser-assisted structure proxy now confirms a single main landmark, a localized first-level heading, language/direction, title, and route announcement across 14 core route/locale combinations. NVDA was not installed in the available Windows environment, and native application control was unavailable, so no evidence is yet available from current-version NVDA + Chrome/Firefox, VoiceOver + Safari/iOS, or Android TalkBack. Structural automation does not validate pronunciation, actual reading order, announcement usefulness, bilingual transitions, or virtual-cursor behavior.

**Recommendation:** Run and record the manual matrix from `docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md` before any conformance claim.

### A11Y-006 — Keyboard coverage is representative, not exhaustive

The suite confirms practice-answer focus retention, keyboard tab activation, and Settings focus entry, trapping, Escape dismissal, and trigger restoration. A real-browser mobile audit found and fixed a “Start” action obscured by the fixed bottom navigation, then verified it wholly visible. Every curriculum, lesson stage, settings action, profile action, and offline/error recovery path has not yet been traversed, so application-wide Enhanced coverage remains open.

### A11Y-008 — Native zoom and physical-device forced-colors testing remain open

Viewport-equivalent checks at 640px and 320px found no page-level horizontal overflow across seven core routes in both locales, and Chromium forced-colors emulation confirmed a visible current-page state and focus indicator. Zoom shortcuts in the available in-app browser produced no measurable change to device pixel ratio, viewport width, or visual viewport scale. True 200%/400% zoom, Windows High Contrast Mode, and device/browser combinations therefore still require manual verification.

### A11Y-009 — Offline, synchronization, and authentication recovery are now automated but not production-account certified

**Status:** Representative local and network-boundary paths pass; security contracts and a protected staging harness are present; live staging execution remains open

Desktop and mobile Chromium now exercise a real service worker and real IndexedDB: an accessibility change made offline survives reload and remains queued for later synchronization. The application presents a persistent bilingual offline status and a short reconnection confirmation. Unit tests verify that an expired session prevents remote writes without dropping queued work and that an incomplete guest migration retains local progress and its receipt. A rejected sign-in is tested at the network boundary and preserves the accessible dialog, credentials, error alert, and guest exit.

These tests do not certify successful replay against a live Supabase account, real token refresh, multi-device conflict resolution, or production RLS behavior. Those scenarios require controlled authenticated staging accounts and must not be inferred from the local queue evidence.

Phase 4 adds runtime Zod validation for every queued operation and migration response, explicit transient/auth/authorization/validation failure categories, a dedicated assessment mutation, and an accessible retry surface for retryable failures. Static migration tests confirm RLS and function-grant contracts. `supabase/migrations/03_rls_hardening.sql` and the manually triggered staging workflow are ready, but could not be applied or run here because no staging Supabase URL, anonymous key, synthetic accounts, or Supabase CLI were configured. Follow `STAGING_AND_DEVICE_VALIDATION_RUNBOOK.md`; production remains out of scope.

### A11Y-007 — Reduced-motion implementation is strong but inconsistently expressed

The global `prefers-reduced-motion` backstop in `src/styles/globals.css:31` suppresses unguarded CSS animations, so no confirmed runtime failure was found. Several components still use unguarded `animate-*` classes, which makes the implementation depend on the global override and weakens component-level contracts.

## Positive findings

- No A/AA axe violations occurred on the tested home, study, Hadith, pronunciation, conversation, library, practice, or responsive RTL/dark flows.
- English and Arabic core routes had no horizontal page overflow at 320px, including after WCAG text-spacing overrides.
- Modal tests and a full 28-control browser traversal validate focus entry, focus trapping, Escape dismissal, and trigger restoration.
- A localized skip link targets the main landmark.
- Route and lesson changes use a polite atomic status region at `src/app/App.tsx:172`.
- Global focus indicators and forced-colors focus styles are present; the current navigation item now uses a system-color outline for any non-false `aria-current` value.
- Audited routes expose one page-level `main` landmark and one localized `h1`; nested component-level main landmarks, the missing Practice `h1`, and lesson-stage duplicate `h1` elements were removed.
- Light/dark semantic text and accent token pairs are unit-tested at 7:1; the confirmed failures occur where opacity or translucent overlays alter those validated pairs.
- Timed exercises provide pause, extension, and settings to disable timing.
- Reduced-motion behavior has both component variants and a global fallback.
- Visible selected/error/success states generally combine color with text, iconography, borders, or ARIA state.

## Criterion-by-criterion audit

Legend:

- **Pass — tested:** Confirmed for the audited routes/states by automation and source evidence.
- **Partial:** Positive evidence exists, but the complete application or all states were not verified.
- **Fail:** A reproducible failure was confirmed.
- **Manual required:** Automation cannot establish conformance.
- **N/A observed:** No applicable content was found in the audited scope; re-evaluate when media/features change.

| Criterion                                       | Level | Status          | Audit result                                                                                                                 |
| ----------------------------------------------- | ----: | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content                          |     A | Partial         | Axe and JSX checks pass; informative-alt quality still needs human review across the full media corpus.                      |
| 1.2.1 Audio-only and Video-only (Prerecorded)   |     A | Partial         | Pronunciation audio has visible words/definitions; the complete audio corpus was not manually sampled.                       |
| 1.2.2 Captions (Prerecorded)                    |     A | N/A observed    | No prerecorded synchronized instructional video found in audited UI.                                                         |
| 1.2.3 Audio Description or Media Alternative    |     A | N/A observed    | No applicable prerecorded video found.                                                                                       |
| 1.2.4 Captions (Live)                           |    AA | N/A observed    | No live synchronized media found.                                                                                            |
| 1.2.5 Audio Description (Prerecorded)           |    AA | N/A observed    | No applicable prerecorded video found.                                                                                       |
| 1.2.6 Sign Language (Prerecorded)               |   AAA | N/A observed    | No applicable prerecorded video found.                                                                                       |
| 1.2.7 Extended Audio Description                |   AAA | N/A observed    | No applicable prerecorded video found.                                                                                       |
| 1.2.8 Media Alternative (Prerecorded)           |   AAA | N/A observed    | No applicable prerecorded video found.                                                                                       |
| 1.2.9 Audio-only (Live)                         |   AAA | N/A observed    | No live audio feature found.                                                                                                 |
| 1.3.1 Info and Relationships                    |     A | Partial         | Fourteen route/locale combinations have one main and localized h1; full heading/table/group relationships require AT review. |
| 1.3.2 Meaningful Sequence                       |     A | Partial         | Core DOM order appears logical; all complex lesson stages were not manually traversed.                                       |
| 1.3.3 Sensory Characteristics                   |     A | Partial         | Core instructions do not appear to rely only on position/shape; full content review remains.                                 |
| 1.3.4 Orientation                               |    AA | Pass — tested   | No orientation lock found.                                                                                                   |
| 1.3.5 Identify Input Purpose                    |    AA | Partial         | Authentication/profile inputs need an explicit autocomplete-purpose audit.                                                   |
| 1.3.6 Identify Purpose                          |   AAA | Manual required | Requires AT review of landmarks, regions, and control purpose across templates.                                              |
| 1.4.1 Use of Color                              |     A | Partial         | Core states include non-color cues; all charts, badges, and deep exercises not exhaustively reviewed.                        |
| 1.4.2 Audio Control                             |     A | Partial         | Audio is learner-triggered with replay/stop controls; sample all narration modes manually.                                   |
| 1.4.3 Contrast (Minimum)                        |    AA | Partial         | Normal axe scans and the remediated `prefers-contrast: more` browser regression pass; full-state sampling remains.           |
| 1.4.4 Resize Text                               |    AA | Partial         | 200%/400%-equivalent viewports and text-size settings pass; native browser zoom still needs device verification.             |
| 1.4.5 Images of Text                            |    AA | Partial         | No systematic images-of-text issue found; full image corpus needs visual sampling.                                           |
| 1.4.6 Contrast (Enhanced)                       |   AAA | Pass — tested   | Post-remediation probe reports zero violations across 14 core route/locale/theme combinations and high-contrast mode.        |
| 1.4.7 Low or No Background Audio                |   AAA | Partial         | Instructional speech appears isolated; complete audio corpus not acoustically audited.                                       |
| 1.4.8 Visual Presentation                       |   AAA | Partial         | Themes and text sizing exist; user-selectable presentation and line-length requirements need full verification.              |
| 1.4.9 Images of Text (No Exception)             |   AAA | Partial         | No confirmed violation; full media corpus not audited.                                                                       |
| 1.4.10 Reflow                                   |    AA | Pass — tested   | Core English/Arabic routes and learning-path expansion fit 320 CSS px without page-level horizontal scrolling.               |
| 1.4.11 Non-text Contrast                        |    AA | Partial         | High-contrast semantic tokens are repaired and tested; every deep control state still requires manual sampling.              |
| 1.4.12 Text Spacing                             |    AA | Pass — tested   | No page overflow on 14 core route/locale/theme combinations after spacing override; deep states remain unsampled.            |
| 1.4.13 Content on Hover or Focus                |    AA | Manual required | Dismissibility, persistence, and hover/focus parity require interactive review.                                              |
| 2.1.1 Keyboard                                  |     A | Partial         | Tab navigation, route activation, Settings, and representative practice flows pass; app-wide traversal is incomplete.        |
| 2.1.2 No Keyboard Trap                          |     A | Partial         | The 28-control Settings loop, Escape dismissal, and practice flow pass; all deep custom widgets are not exhausted.           |
| 2.1.3 Keyboard (No Exception)                   |   AAA | Manual required | Requires every action and custom control to be exercised without pointer input.                                              |
| 2.1.4 Character Key Shortcuts                   |     A | Partial         | Exercise shortcuts exist; remap/disable and focus-context behavior need full audit.                                          |
| 2.2.1 Timing Adjustable                         |     A | Partial         | Timers expose pause/extend and can be disabled; all timed curricula need runtime verification.                               |
| 2.2.2 Pause, Stop, Hide                         |     A | Partial         | Audio/animation controls and reduced motion exist; all auto-updating content not exhaustively tested.                        |
| 2.2.3 No Timing                                 |   AAA | Partial         | Core learning can disable timers; verify no remaining required time limit.                                                   |
| 2.2.4 Interruptions                             |   AAA | Manual required | Release notices, sync prompts, and errors need interruption-control review.                                                  |
| 2.2.5 Re-authenticating                         |   AAA | Partial         | Unit coverage preserves queued work on expiry and browser coverage preserves rejected sign-in input; live re-auth remains.   |
| 2.2.6 Timeouts                                  |   AAA | Manual required | No complete inactivity-timeout inventory or warning validation was available.                                                |
| 2.3.1 Three Flashes or Below Threshold          |     A | Partial         | No flashing pattern found in source; media corpus not frame-analyzed.                                                        |
| 2.3.2 Three Flashes                             |   AAA | Partial         | Same evidence as 2.3.1; manual/media validation required.                                                                    |
| 2.3.3 Animation from Interactions               |   AAA | Pass — tested   | Global reduced-motion backstop removes animation and transition duration.                                                    |
| 2.4.1 Bypass Blocks                             |     A | Pass — tested   | Localized skip link targets the main landmark.                                                                               |
| 2.4.2 Page Titled                               |     A | Pass — tested   | Fourteen core route/locale combinations expose descriptive route titles; lesson-stage title coverage also passes.            |
| 2.4.3 Focus Order                               |     A | Partial         | Mobile navigation and the complete Settings focus loop are logical; all application routes are not yet traversed.            |
| 2.4.4 Link Purpose (In Context)                 |     A | Partial         | Core links/buttons are named; all generated curriculum actions not manually reviewed.                                        |
| 2.4.5 Multiple Ways                             |    AA | Partial         | Main destinations have navigation/search; deep lesson records need location-path review.                                     |
| 2.4.6 Headings and Labels                       |    AA | Partial         | Automated roles pass; wording/heading hierarchy needs content review across every route.                                     |
| 2.4.7 Focus Visible                             |    AA | Pass — tested   | Global/component indicators and Chromium forced-colors focus visibility pass in the sampled flows.                           |
| 2.4.8 Location                                  |   AAA | Partial         | Tabs and progress expose location; deeper curricula lack a complete breadcrumb/location audit.                               |
| 2.4.9 Link Purpose (Link Only)                  |   AAA | Partial         | No confirmed ambiguous core link; full generated-content review remains.                                                     |
| 2.4.10 Section Headings                         |   AAA | Partial         | Core pages use headings; every long-form lesson/article needs structural review.                                             |
| 2.4.11 Focus Not Obscured (Minimum)             |    AA | Pass — tested   | A mobile bottom-nav obstruction was fixed; sampled navigation, Start action, and Settings controls remain visible.           |
| 2.4.12 Focus Not Obscured (Enhanced)            |   AAA | Partial         | Sampled mobile targets are wholly visible after remediation; every focusable target still requires traversal.                |
| 2.4.13 Focus Appearance                         |   AAA | Partial         | 2–3px indicators exist with strong semantic colors; area/contrast must be measured in every state/theme.                     |
| 2.5.1 Pointer Gestures                          |     A | Partial         | No essential multipoint/path gesture identified; full interaction inventory remains.                                         |
| 2.5.2 Pointer Cancellation                      |     A | Partial         | Native activation is prevalent; consequential interactions require manual down-event review.                                 |
| 2.5.3 Label in Name                             |     A | Partial         | Axe passes core routes; voice-control matching needs manual sampling.                                                        |
| 2.5.4 Motion Actuation                          |     A | N/A observed    | No device-motion-only control found.                                                                                         |
| 2.5.5 Target Size (Enhanced)                    |   AAA | Pass — tested   | Identified 28–40px targets are repaired; source guards and representative 320px computed-geometry sweeps pass.               |
| 2.5.6 Concurrent Input Mechanisms               |   AAA | Pass — tested   | No input modality lock found.                                                                                                |
| 2.5.7 Dragging Movements                        |    AA | Partial         | No required drag-only core action found; all exercises need confirmation.                                                    |
| 2.5.8 Target Size (Minimum)                     |    AA | Partial         | Most controls meet 24px; spacing/exceptions for the smallest controls need formal measurement.                               |
| 3.1.1 Language of Page                          |     A | Pass — tested   | English/Arabic language and direction switch correctly in the tested matrix.                                                 |
| 3.1.2 Language of Parts                         |    AA | Partial         | `lang` is used for Arabic/English segments; all mixed-language generated content needs review.                               |
| 3.1.3 Unusual Words                             |   AAA | Partial         | Dictionary/detail support exists; specialist course terminology needs content sampling.                                      |
| 3.1.4 Abbreviations                             |   AAA | Partial         | CEFR and specialist abbreviations need expansion/help review.                                                                |
| 3.1.5 Reading Level                             |   AAA | Manual required | A1–C1 content must be linguistically assessed against its stated learner level.                                              |
| 3.1.6 Pronunciation                             |   AAA | Partial         | Audio/phonetic support is extensive; ambiguous-word coverage requires content audit.                                         |
| 3.2.1 On Focus                                  |     A | Pass — tested   | No core context change on focus detected.                                                                                    |
| 3.2.2 On Input                                  |     A | Partial         | Core settings/actions are explicit; every selector and form requires manual confirmation.                                    |
| 3.2.3 Consistent Navigation                     |    AA | Pass — tested   | Shared five-tab navigation is consistent across mobile and desktop.                                                          |
| 3.2.4 Consistent Identification                 |    AA | Partial         | Shared components support consistency; all legacy/deep controls need visual/AT review.                                       |
| 3.2.5 Change on Request                         |   AAA | Partial         | Most navigation is explicit; auto-advance and settings behavior need complete review.                                        |
| 3.2.6 Consistent Help                           |     A | Partial         | Help/settings locations appear consistent; authenticated/error contexts not fully reviewed.                                  |
| 3.3.1 Error Identification                      |     A | Partial         | Rejected sign-in exposes an alert and recovery paths; every exercise and synchronization error still needs verification.     |
| 3.3.2 Labels or Instructions                    |     A | Partial         | Core inputs have names/instructions; complete form inventory remains.                                                        |
| 3.3.3 Error Suggestion                          |    AA | Partial         | Retry and corrective feedback exist; all validation paths need content review.                                               |
| 3.3.4 Error Prevention (Legal, Financial, Data) |    AA | Manual required | Account and progress-affecting actions require confirmation/undo inventory.                                                  |
| 3.3.5 Help                                      |   AAA | Partial         | Learning hints and contextual guidance exist; consistency and completeness need learner testing.                             |
| 3.3.6 Error Prevention (All)                    |   AAA | Partial         | Some destructive exits confirm; all consequential actions need review/undo verification.                                     |
| 3.3.7 Redundant Entry                           |     A | Manual required | Multi-step onboarding/auth/profile entry needs end-to-end review.                                                            |
| 3.3.8 Accessible Authentication (Minimum)       |    AA | Manual required | Password-manager, paste, cognitive-test, and recovery behavior require authenticated testing.                                |
| 3.3.9 Accessible Authentication (Enhanced)      |   AAA | Manual required | Cannot be established without complete authentication-method testing.                                                        |
| 4.1.1 Parsing                                   |     — | Obsolete        | Removed as a WCAG 2.2 success criterion; valid React DOM still matters operationally.                                        |
| 4.1.2 Name, Role, Value                         |     A | Partial         | Core axe scans pass and radio/toggle semantics improved; all custom widgets need AT operation.                               |
| 4.1.3 Status Messages                           |    AA | Partial         | Route plus offline/reconnected status roles are automated; usefulness and verbosity still need screen-reader testing.        |

## Remediation order

1. **Completed:** Fix `prefers-contrast: more` tokens and add computed-color regression coverage.
2. **Completed:** Fix the two enhanced-contrast patterns and expand AAA contrast coverage for the affected states.
3. **Completed:** Raise the identified interactive targets to 44×44px and pair source guards with computed runtime checks.
4. **Completed for the sampled critical path:** Keyboard navigation, Settings focus containment/restoration, and mobile focus-obscuration checks pass after remediation; extend to every deep lesson and recovery flow.
5. Run NVDA, VoiceOver, and TalkBack representative flows in both English and Arabic. NVDA could not be run in this environment because it is not installed and native app control is unavailable.
6. Validate native browser zoom and physical-device forced colors on target devices. Viewport-equivalent reflow, emulated forced colors, and automated text-spacing checks are complete for the audited core routes.
7. Use controlled authenticated staging accounts to validate token refresh, successful queued-mutation replay, guest migration, conflict handling, and production-equivalent RLS. Local offline persistence, session-expiry preservation, incomplete migration, and rejected sign-in recovery are now automated.
8. Repeat the full criterion table and only then decide whether a scoped WCAG conformance statement is supportable.

## Decision

**Current result: Automated blockers A11Y-001 through A11Y-003, the browser-assisted Phase 2 defects, and the representative Phase 3 offline/authentication defects are remediated; full WCAG 2.2 AAA conformance remains unverified.**  
**Automated A/AA and sampled AAA baseline for tested routes: clean.**  
**Release recommendation:** Proceed to the real assistive-technology and target-device native zoom/forced-colors matrix, plus authenticated staging synchronization/recovery testing, before any AAA conformance claim.

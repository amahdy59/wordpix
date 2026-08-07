---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Testing, QA, and Accessibility Validation

## Test strategy

Tests should provide confidence in learner behavior, not implementation trivia.

Use a layered approach:

- Static checks.
- Unit tests for pure domain logic.
- Integration tests for components and feature workflows.
- Contract tests for APIs and persistence.
- End-to-end tests for critical flows.
- Accessibility automation.
- Manual assistive-technology and device testing.
- Usability testing with representative learners.

## Test priorities

Prioritize:

1. Data integrity and migration.
2. Authentication and authorization.
3. Lesson completion and progress.
4. Offline queue and synchronization.
5. Guest-to-account migration.
6. Keyboard and screen-reader access.
7. Arabic and bidi mathematics.
8. Error recovery.
9. Performance-critical interactions.
10. Visual regression of design-system states.

## Unit tests

Use unit tests for:

- scoring and mastery calculations;
- recommendation rules;
- schema validation;
- formatting and bidi utilities;
- reducers and state-machine transitions;
- conflict resolution;
- retry classification;
- analytics event construction;
- permission rules where a pure policy layer exists.

Do not mock the function under test or reproduce its implementation inside the assertion.

## Component and integration tests

Query by role, accessible name, label, or visible text in the same way a user finds elements.

Test:

- semantic role and name;
- keyboard operation;
- focus movement;
- visible and announced state;
- loading and duplicate activation;
- validation and preserved input;
- reduced motion;
- RTL;
- error and retry;
- offline status.

Avoid selectors based on implementation-only class names or component internals.

## End-to-end critical flows

Maintain at least:

- New child, English, light: onboarding → placement → recommendation → guest → first lesson → completion.
- Returning adult, Arabic RTL, dark: home → review-due practice → incorrect answer → hint → retry → completion → progress.
- Guest-to-account migration with interruption and retry.
- Offline lesson completion and later synchronization.
- Authentication recovery.
- Settings changes for language, theme, motion, narration, and numerals.
- Keyboard-only critical path.

E2E tests should validate outcomes and important focus or announcement behavior, not every visual detail.

## Accessibility automation

Use axe or equivalent in:

- component stories;
- integration tests;
- key E2E pages;
- CI.

Automation can find only a subset of accessibility issues. It does not prove keyboard logic, reading order, useful alternative text, correct announcements, or understandable content.

## Manual accessibility protocol

For each critical flow:

1. Use keyboard only.
2. Confirm visible focus.
3. Confirm no trap.
4. Confirm meaningful heading and landmark structure.
5. Run NVDA and VoiceOver representative passes.
6. Check page or route-change announcements.
7. Check error and feedback announcements.
8. Check 200% zoom and text-spacing override.
9. Check reduced motion.
10. Check light/dark and forced-colors compatibility.
11. Check Arabic reading and bidi math.
12. Record device, browser, assistive technology, version, result, and issue.

## Visual regression

Capture:

- all component states;
- light and dark;
- child and adult;
- English and Arabic;
- mobile and desktop references;
- 200% text where tooling supports it;
- loading, empty, error, offline, and sync conflict.

Visual snapshots complement behavior tests. They do not replace them.

## Test data

- Use deterministic factories.
- Avoid production personal data.
- Include Arabic, long strings, zero/one/many plural cases, negative values, and mixed-direction text.
- Include slow, failed, duplicated, and out-of-order requests.
- Include old local schema versions.
- Include multiple users for authorization tests.
- Seed tests independently.

## Flaky-test policy

- A flaky test is a defect.
- Do not hide flakiness with unlimited retries.
- Use framework auto-waiting and observable state.
- Eliminate arbitrary sleeps.
- Make time and randomness injectable.
- Quarantine only with an owner, issue, and expiry.
- Track retry rate in CI.

## Required CI checks

- [ ] Format.
- [ ] Lint.
- [ ] Type check.
- [ ] Unit/integration.
- [ ] Component accessibility.
- [ ] E2E critical smoke.
- [ ] Production build.
- [ ] Database or RLS tests when affected.
- [ ] Bundle/performance budget.
- [ ] Migration validation.
- [ ] Secret scan and dependency checks.

## Release QA matrix

Dimensions:

- Learner: child / adult.
- Locale: English / Arabic.
- Direction: LTR / RTL.
- Theme: light / dark.
- Input: touch / pointer / keyboard / screen reader.
- Text: default / 200%.
- Motion: default / reduced.
- Network: online / slow / offline / reconnecting.
- Account: guest / authenticated / expired session.
- Device: small mobile / large mobile / tablet / desktop.

Use pairwise coverage for general regression but full coverage for critical flows and known high-risk combinations.

## Bug report format

```md
Title:
Environment:
Learner mode:
Locale/theme:
Assistive technology:
Network state:
Preconditions:
Steps:
Actual:
Expected:
Data-loss risk:
Accessibility impact:
Evidence:
```

## References

- [Testing Library guiding principles](https://testing-library.com/docs/)
- [Testing Library query priority](https://testing-library.com/docs/queries/about/)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright actionability and auto-waiting](https://playwright.dev/docs/actionability)
- [Playwright CI](https://playwright.dev/docs/ci-intro)
- [Storybook accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

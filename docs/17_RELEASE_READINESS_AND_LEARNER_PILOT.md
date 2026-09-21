# Release readiness and learner pilot

## Current release decision

Status: `requires-accessibility-retest` and `backend-dependent`.

Do not describe the application as manually WCAG 2.2 AAA certified or account-sync certified until the evidence tables below are completed. Broad specialist-topic expansion is paused until the moderated-pilot decision rule is met. Automated checks are necessary release evidence, but they are not substitutes for either activity.

The product now has one authoritative next lesson: the recommended foundation lesson. Home and Learn must display the same lesson. Picture worlds and the pronunciation pilot are optional paths and must remain progressively disclosed.

## Automated release gate

The release is blocked unless lint, TypeScript, unit/integration tests, production build, Playwright journeys, Pages deployment, and post-deployment health checks pass. Audio checks must cover Cloudflare/R2 resolution, the local fallback, service-worker range responses, and completion callbacks.

## Representative learner journeys

| Journey                           | Required result                                                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| New child, English, light         | Onboarding explains each choice; placement is optional; recommendation has a reason; first lesson can be completed without account creation. |
| Returning adult, Arabic RTL, dark | Review-due work is visible; incorrect answers offer recovery; mixed-direction text remains readable; progress survives reload.               |
| Keyboard-only                     | Every action is reachable in logical order, focus is visible, dialogs trap and restore focus, and no pointer gesture is required.            |
| Reduced motion and 200% text      | Content remains operable without clipping, hidden actions, or essential animation.                                                           |
| Offline and reconnect             | Available work is identified, completion is retained locally, and sync status never claims success prematurely.                              |
| Audio fallback                    | Cloudflare/R2 is attempted through the existing resolver; local audio and speech synthesis remain available without blocking learning.       |

Record browser, viewport, locale, learner mode, theme, network state, assistive technology, result, and evidence for every manual run.

### Manual accessibility evidence log

Complete each row with a dated result and an artifact or issue link. A blank row is unverified, not passed.

| Flow                            | Browser / AT            | Locale / display              | Input / network             | Result     | Evidence / issue |
| ------------------------------- | ----------------------- | ----------------------------- | --------------------------- | ---------- | ---------------- |
| Onboarding through first lesson | NVDA + Firefox          | English, light, 100%          | Keyboard, online            | Unverified |                  |
| Returning review                | NVDA + Chromium         | Arabic RTL, dark, 200%        | Keyboard, online            | Unverified |                  |
| First lesson                    | Mobile screen reader    | Arabic RTL, light             | Touch, slow network         | Unverified |                  |
| Lesson recovery                 | Chromium, forced colors | English, 200%, reduced motion | Keyboard, offline/reconnect | Unverified |                  |

Release blockers include an unnamed critical control, illogical reading/focus order, clipped content at 200%, an unavailable keyboard action, misleading offline status, or feedback that is not announced.

## Foundation-unit content audit

For each of the first 18 units, verify:

1. The outcome describes an observable real-world action.
2. Three can-do statements progress from recognition to interaction.
3. Vocabulary sessions contain at most eight active items.
4. Grammar, pronunciation, dialogue, controlled practice, and the final task serve the same outcome.
5. Prerequisites are taught earlier in the foundation sequence.
6. Above-level reading is optional and visibly labelled.
7. The final task requires meaning, not isolated word recognition.
8. Audio text exactly matches learner-visible English.

## Moderated pilot protocol

Recruit 5–8 consenting participants across beginner adults, children with an appropriate guardian process, Arabic-speaking learners, and keyboard or screen-reader users. Do not record names, raw speech, typed answers, or video without separate informed consent.

Ask each participant to complete the first three recommended units without coaching. Observe time to first lesson, hesitation, backtracking, misunderstood labels, audio replay, retries, abandonment, and whether the learner can explain the unit goal and next action. Use neutral prompts such as “What do you expect this will do?” rather than teaching the interface.

After each session, record only aggregated issue categories and severity. A release-blocking finding is data loss, an inaccessible critical action, an unexplained dead end, an incorrect recommendation that cannot be overridden, or a task that cannot be understood by most participants.

### Pilot results log

Use participant codes rather than names. Do not enter raw answers, speech, email addresses, or other identifying information.

| Participant code | Cohort | Units completed | Found next action unaided | Explained recommendation | Major issue categories | Result     |
| ---------------- | ------ | --------------: | ------------------------- | ------------------------ | ---------------------- | ---------- |
|                  |        |                 |                           |                          |                        | Unverified |
|                  |        |                 |                           |                          |                        | Unverified |
|                  |        |                 |                           |                          |                        | Unverified |
|                  |        |                 |                           |                          |                        | Unverified |
|                  |        |                 |                           |                          |                        | Unverified |

## Analytics boundary

The application exposes a versioned, ephemeral event boundary for placement completion and recommendation display. It stores nothing and sends nothing by itself. Any future analytics adapter must require an explicit consent decision, use only governed properties, batch safely while offline, and never capture names, emails, raw answers, typed text, speech, or access tokens. Retention at 1, 3, 7, and 30 days should be computed from pseudonymous mastery-state transitions rather than raw learner content.

## Decision rule

Fix release blockers immediately. Consolidate repeated usability findings before expanding specialist content. Curriculum expansion resumes only when at least five participants can complete the first three units, understand why they were recommended, and identify the next action without coaching.

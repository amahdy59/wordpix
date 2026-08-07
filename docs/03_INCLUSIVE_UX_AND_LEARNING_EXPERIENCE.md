---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Inclusive UX and Learning Experience

## Design objective

Reduce unnecessary cognitive, sensory, motor, linguistic, and connectivity demands while preserving meaningful challenge in the learning content.

Difficulty should come from the skill being learned, not from the interface.

## Core UX principles

### Recognition over recall

- Keep choices, goals, progress, and instructions visible.
- Do not require learners to remember hidden navigation or prior screen content.
- Use consistent icon-label pairs.
- Re-present necessary reference information during practice.
- Avoid unexplained gestures.

### One clear next action

Each major screen SHOULD have:

- one primary action;
- a clear current status;
- a visible way back or out;
- secondary actions that do not compete visually;
- no dead end.

### Progressive disclosure

Reveal complexity when it is relevant, but never hide information most learners need. Optional explanations may use details or expandable help; critical instructions and errors must remain visible.

### Error recovery over punishment

Incorrect answers are part of learning.

Feedback SHOULD:

1. acknowledge the attempt;
2. identify the relevant misconception or next clue;
3. provide a hint or example;
4. allow retry;
5. avoid shame, sarcasm, or loss of earned progress.

### Learner autonomy

Allow meaningful control over:

- session length;
- narration, sound, and motion;
- language and numeral preference;
- theme and text size;
- practice focus;
- pausing and resuming;
- optional celebrations.

## Universal Design for Learning application

### Engagement

- Offer reasonable choice without overwhelming the learner.
- Connect tasks to meaningful goals.
- Show progress toward mastery, not only points.
- Support breaks and resumption.
- Avoid forced competition.
- Use joy and play without making the interface noisy.

### Representation

- Combine concise text with useful visuals or examples.
- Provide narration where it adds access.
- Clarify symbols and mathematical notation.
- Highlight patterns and key relationships.
- Use examples before abstraction where appropriate.
- Do not use decorative imagery that competes with the task.

### Action and expression

- Support keyboard, touch, pointer, and assistive technology.
- Provide alternatives to drag, speech, handwriting, or speed.
- Allow learners to correct input.
- Break multi-step tasks into visible stages.
- Provide planning support for longer tasks.

## Child-mode guidance

- Use short sentences and familiar vocabulary.
- Keep the number of simultaneous choices small.
- Prefer persistent labels over icon-only navigation.
- Use generous spacing and larger targets.
- Show examples close to the action.
- Keep decorative animation brief and optional.
- Confirm success with text, shape, and optional sound.
- Avoid complex dashboards on the primary home screen.
- Never use a countdown to create routine urgency.
- Make parental or account actions visually distinct from learner actions.

## Adult-mode guidance

- Use direct language and efficient layout.
- Do not use childish mascots, exaggerated praise, or patronizing copy.
- Show review due, mastery, and learning goals clearly.
- Support quick return to the last meaningful task.
- Allow denser lists only when target size, scanning, and text scaling remain accessible.
- Explain adaptive recommendations and allow override.

## Onboarding and placement

- Explain why each requested choice matters.
- Ask only what is needed for a useful start.
- Provide defaults and the ability to change them later.
- Do not gate value behind account creation.
- Let the learner recover from accidental choices.
- Placement instructions should clarify that mistakes are expected.
- Avoid labeling a learner by a score.
- Recommendation should state the evidence in plain language.

## Daily learning session

A strong session structure:

```text
Purpose
→ Estimated effort or item count
→ Learn/example
→ Guided attempt
→ Independent attempt
→ Feedback and retry
→ Completion summary
→ Next action
```

Do not display several progress systems simultaneously. One session progress indicator and one meaningful learning outcome are usually enough.

## Gamification rules

Use game mechanics to support competence, autonomy, and persistence.

### Allowed patterns

- Optional XP or points.
- Mastery progress.
- Milestones.
- Personal bests that do not depend on speed by default.
- Collectibles or badges tied to meaningful behaviors.
- Gentle celebrations.
- Recoverable streaks or flexible routines.

### Prohibited patterns

- Punishment for disability, illness, interruption, or missed days.
- Forced social comparison.
- Loss of core access.
- Random rewards that encourage compulsive use.
- Dark patterns around account creation or notifications.
- Confetti or motion with no reduced-motion alternative.
- “Wrong” feedback without explanation.
- Rewarding rapid guessing.

## Content-density checks

For every screen:

- [ ] Can the learner state the purpose in one sentence?
- [ ] Is the primary action visually and semantically clear?
- [ ] Is any visible content unrelated to the current decision?
- [ ] Are instructions located near the action?
- [ ] Can the screen tolerate 200% text?
- [ ] Does the Arabic version remain scannable?
- [ ] Are status and progress represented without color alone?
- [ ] Is recovery visible?

## Usability validation

Use:

- Moderated testing with representative child and adult learners.
- Accessibility testing with disabled participants where possible.
- Think-aloud only when it does not distort the target task.
- Observation of hesitation, repeated errors, abandonment, and recovery.
- A heuristic review before and after user testing.
- Real devices and realistic network conditions.

Do not validate only with designers, developers, or ideal content.

## References

- [Nielsen Norman Group: 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [NN/g: usability heuristics applied to games](https://www.nngroup.com/articles/usability-heuristics-applied-video-games/)
- [CAST UDL Guidelines 3.0](https://udlguidelines.cast.org/)
- [CAST: Action and Expression](https://udlguidelines.cast.org/action-expression/)
- [Microsoft Inclusive Design](https://inclusive.microsoft.design/)
- [Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines)
- [GOV.UK Design System patterns](https://design-system.service.gov.uk/patterns/)

---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Product Context and Non-Negotiables

## Product promise

Help learners build durable skills through short, clear, adaptive learning and practice sessions that are usable across ability, age, language, theme, input method, and connectivity conditions.

The product should feel encouraging and game-like without turning learning into pressure, manipulation, or decorative complexity.

## Primary learner modes

### Child experience

- Simpler language and shorter visible choices.
- Strong visual grouping and predictable navigation.
- Larger targets and comfortable spacing.
- Immediate, specific, non-shaming feedback.
- Optional narration and visual support.
- Reduced dependence on reading, memory, precision, or speed.
- Rewards that recognize effort and progress without punishing absence.

### Adult experience

- Efficient, respectful, non-childish expression.
- Clear progress, goals, and review-due information.
- More compact density where it remains accessible.
- Direct control over session, practice, language, theme, and accessibility settings.

Child and adult modes MUST share architecture and semantic components. Differences SHOULD be driven by content, density, tokens, and configuration rather than parallel applications.

## Representative validation tracks

The complete MVP should be continuously validated through two representative tracks:

1. **Child, English, light mode** — new learner, placement, recommendation, first daily mission.
2. **Adult, Arabic RTL, dark mode** — returning learner, review-due practice, error recovery, progress, and account recovery.

Also test representative adaptations for child dark, adult light, child Arabic, adult English, tablet, desktop, 200% text, reduced motion, keyboard focus, and offline state.

## Core loop

```text
Open app
→ Understand recommended next action
→ Preview the session
→ Learn or practice
→ Receive useful feedback
→ Retry or continue
→ Complete the session
→ Understand progress
→ Know the next reasonable action
```

Every major design or engineering decision should strengthen this loop or clearly support an MVP dependency.

## MVP functional checklist

- [ ] Onboarding collects only information required for a useful starting experience.
- [ ] Placement is short, skippable or recoverable where appropriate, and explains its purpose.
- [ ] Recommendation explains why a starting point is suggested.
- [ ] Guest mode provides real value without coercive registration.
- [ ] Guest progress can migrate safely to an account.
- [ ] Home presents one clear primary action.
- [ ] Lessons expose goal, progress, instructions, and completion state.
- [ ] Incorrect answers lead to constructive feedback, hints, and a retry path.
- [ ] Practice supports review-due and focused practice.
- [ ] Progress communicates learning, not only points.
- [ ] Settings include essential accessibility, language, numerals, theme, narration, sound, and motion controls.
- [ ] Offline behavior is explicit and never implies synchronization that has not occurred.
- [ ] Sync failure does not silently discard completed learning.
- [ ] All critical paths work with keyboard and screen reader.
- [ ] Arabic layout, numerals, punctuation, and mathematics remain intelligible.

## Product constraints

### Accessibility is structural

Accessibility cannot be deferred to a final audit. It affects:

- Component anatomy.
- Navigation.
- state and focus management.
- content.
- animation.
- data visualization.
- localization.
- testing.
- release gates.

### Localization is structural

Do not treat Arabic as translated English. Direction, layout, typography, numbers, mixed-direction strings, and mathematical expressions require explicit behavior.

### Offline is a product state

Offline is not an error screen. Learners should know:

- What remains available.
- What is stored locally.
- What is waiting to sync.
- What failed.
- What action is safe next.

### Gamification serves learning

XP, streaks, badges, celebrations, and challenges MUST NOT:

- obscure mastery or learning goals;
- shame users for interruption or disability;
- pressure users through loss aversion;
- require speed where speed is not the learning objective;
- block core learning;
- replace meaningful feedback.

## Out-of-scope without explicit approval

- Social leaderboards.
- Public child profiles.
- Unmoderated chat.
- Competitive pressure by default.
- High-stakes assessment claims.
- Full curriculum expansion before the MVP loop is validated.
- Multiple overlapping navigation systems.
- Separate duplicated codebases for child and adult modes.
- Hidden background data collection.
- Irreversible account migration.
- Novel custom widgets when native or proven patterns meet the need.

## Decision test

Before adding or changing a feature, answer:

1. Which learner problem does it solve?
2. Which MVP flow requires it?
3. Can the same outcome be achieved by simplifying?
4. What accessibility and Arabic risks does it introduce?
5. What happens offline?
6. What data is created or changed?
7. How will it be tested?
8. What is intentionally not being built?

Do not implement when these answers are materially unknown.

## Acceptance gate

A feature is product-ready only when:

- The learner can understand the purpose and next action.
- Child and adult behavior is defined.
- English and Arabic behavior is defined.
- Light and dark behavior is defined.
- Keyboard and screen-reader behavior is defined.
- Loading, empty, error, offline, and recovery states are defined.
- Analytics are proportionate and privacy-safe.
- Tests cover the critical behavior.
- No new major scope is hidden inside the implementation.

## References

- [CAST Universal Design for Learning Guidelines 3.0](https://udlguidelines.cast.org/)
- [Nielsen Norman Group: 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Microsoft Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines)
- [Microsoft Inclusive Design](https://inclusive.microsoft.design/)

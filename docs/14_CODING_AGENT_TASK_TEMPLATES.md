---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Coding-Agent Task Templates

Use these templates to provide concrete, verifiable work to a coding agent. Replace every bracketed placeholder.

## Template A — Implement a feature

```md
# Task: [Feature name]

## Goal
[User outcome in one or two sentences.]

## User scenario
As a [learner mode], I need to [action] so that [outcome].

## Current behavior
[What exists now, including route/component.]

## Required behavior
- [Behavior 1]
- [Behavior 2]
- [Behavior 3]

## In scope
- [Files/subsystem]
- [States]
- [Data/API]

## Out of scope
- [Explicit exclusions]

## Accessibility
- Semantic role:
- Keyboard:
- Focus:
- Screen reader:
- Target size:
- 200% text:
- Reduced motion:
- Non-color status:

## Localization
- English:
- Arabic RTL:
- Numerals:
- Mixed-direction/math concerns:

## Offline and errors
- Offline behavior:
- Retry behavior:
- Data safety:
- Error copy:

## Security and privacy
- Authorization:
- Personal data:
- Logging restrictions:

## Acceptance criteria
- [ ] ...
- [ ] ...

## Tests
- Unit:
- Integration:
- E2E:
- Accessibility:
- Manual:
```

## Template B — Fix a bug

```md
# Bug: [Concise title]

## Environment
[Browser/device/app version/locale/theme/account/network.]

## Preconditions
[State required to reproduce.]

## Steps
1. ...
2. ...
3. ...

## Actual
[Observed result.]

## Expected
[Correct learner-visible result.]

## Impact
[Data loss, blocker, accessibility, security, frequency.]

## Evidence
[Logs, screenshot, trace, test, issue.]

## Constraints
[Do not change / preserve.]

## Required regression tests
- [ ] Reproduction test fails before the fix.
- [ ] Test passes after the fix.
- [ ] Neighboring behavior remains covered.
```

## Template C — Build a component

```md
# Component: [Name]

Purpose:
Anatomy:
Content slots:
Variants:
Sizes:
States:
Default behavior:
Keyboard behavior:
Focus behavior:
Screen-reader behavior:
RTL behavior:
Theme behavior:
Child/adult behavior:
Responsive behavior:
Loading/error/offline behavior:
Analytics:
Data contract:
Design tokens:
Stories:
Acceptance tests:
```

## Template D — Refactor safely

```md
# Refactor: [Area]

## Problem
[Specific maintenance, correctness, performance, or architecture problem.]

## Preserve
- Public behavior:
- Public types/API:
- Accessibility:
- Analytics:
- Data schema:
- Tests:

## Change
[Desired architecture.]

## Non-goals
[No redesign, no new feature, etc.]

## Migration sequence
1. Add tests around current behavior.
2. Introduce new boundary.
3. Move one responsibility at a time.
4. Compare behavior.
5. Remove old path.
6. Run full validation.

## Success criteria
- [ ] No learner-visible regression.
- [ ] Complexity or duplication is measurably reduced.
- [ ] Dependency direction is improved.
- [ ] All required checks pass.
```

## Template E — Accessibility remediation

```md
# Accessibility issue: [Title]

WCAG criterion:
Affected flow:
Affected component:
User impact:
Current semantic tree:
Current keyboard behavior:
Expected semantic tree:
Expected keyboard behavior:
Focus behavior:
Announcement:
Visual requirement:
RTL considerations:
Regression tests:
Manual AT matrix:
```

## Template F — Offline/sync task

```md
# Offline/sync task: [Title]

Entity:
Canonical owner:
Local storage:
Operation:
Idempotency key:
Queue ordering:
Retryable errors:
Permanent errors:
Conflict policy:
Guest/account behavior:
Schema version:
Migration:
User-visible status:
Data-loss prevention:
Telemetry:
Tests:
```

## Template G — Agent completion request

Append this to any task:

```md
Before finishing:
1. Review the relevant repository instructions.
2. Inspect existing patterns before adding new abstractions.
3. Keep the diff limited to this task.
4. Add or update tests.
5. Run format, lint, type-check, tests, build, and task-specific checks.
6. Review keyboard, screen-reader, Arabic RTL, dark mode, 200% text, and offline behavior where affected.
7. Report changed files, validation results, unrun checks, and concrete limitations.
8. Do not claim completion when a required check is unverified.
```

## Template H — Review an agent-generated change

```md
Review this diff for:
- Scope creep.
- Product requirement mismatch.
- Accessibility and semantics.
- Focus and keyboard behavior.
- Arabic RTL and bidi math.
- State ownership and effect misuse.
- Runtime validation.
- Offline data safety.
- Authentication and authorization.
- Personal data in logs or analytics.
- Error recovery.
- Performance and bundle impact.
- Missing tests.
- Unnecessary dependencies.
- Generated noise or misleading comments.

Return:
1. Blocking findings.
2. Important findings.
3. Minor findings.
4. Suggested tests.
5. Merge recommendation with evidence.
```

## References

- [AGENTS.md](https://agents.md/)
- [OpenAI Codex AGENTS.md guidance](https://developers.openai.com/codex/agent-configuration/agents-md)
- [OpenAI: PLANS.md for longer tasks](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [GitHub Copilot repository instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Cursor Rules](https://cursor.com/docs/rules)

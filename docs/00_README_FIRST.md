---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Read Me First — How to Use This Guidance Pack

## Purpose

This pack turns the approved product and design work into durable instructions for coding agents and human developers. It is intentionally split into focused files so an agent can load only the context needed for a task.

The documents are requirements and guardrails, not a replacement for inspecting the repository or validating behavior in code.

## Product baseline

The application is a gamified learning product with a daily learning loop, structured learning and practice, basic progress and mastery, and accessible child/adult expression. The MVP must cover:

- New learner onboarding and placement.
- Starting recommendation.
- Guest and account entry.
- Home and daily mission.
- Lesson, hints, retry, and completion.
- Learn exploration and focused practice.
- Basic progress and essential settings.
- Guest-to-account migration.
- Offline use and synchronization recovery.
- English and Arabic.
- Child and adult expression.
- Light and dark modes.
- Mobile-first layouts with tablet and desktop references.

## Recommended repository placement

```text
/
├─ AGENTS.md
├─ docs/
│  ├─ 00_README_FIRST.md
│  ├─ 01_PRODUCT_CONTEXT_AND_NON_NEGOTIABLES.md
│  ├─ ...
│  └─ SOURCES.md
├─ src/ or app/
├─ tests/
└─ package.json
```

Keep `AGENTS.md` short enough to load for every task. Keep domain detail in the focused files.

## How an AI agent should consume the pack

### Before any work

- Read `AGENTS.md`.
- Read this file.
- Read the product context.
- Read only the task-specific guides.
- Inspect actual code and tests.
- Identify conflicts between documentation and implementation.

### During work

- Use a small, reviewable plan.
- Preserve existing architecture unless the task explicitly changes it.
- Trace every UI state through loading, empty, success, error, offline, and permission-denied behavior.
- Add validation at the same time as implementation.
- Keep a decision record for irreversible or cross-cutting choices.

### After work

- Run the project’s real checks.
- Compare against the relevant acceptance checklist.
- State any check that was not run.
- Never describe a task as complete when a required gate is unverified.

## Requirement language

| Word | Meaning |
|---|---|
| **MUST** | Required for merge or release. |
| **MUST NOT** | Prohibited unless the relevant document explicitly defines an exception. |
| **SHOULD** | Expected default; deviation needs a documented reason. |
| **MAY** | Optional and context-dependent. |

## Status labels

Use these labels in issues, plans, and handoffs:

- `approved`
- `proposed`
- `validated-in-code`
- `validated-on-device`
- `requires-accessibility-retest`
- `backend-dependent`
- `platform-dependent`
- `blocked`
- `deferred`
- `out-of-scope`

## Source policy

- Prefer normative standards and official framework documentation.
- Prefer primary sources over summaries.
- Record the date when time-sensitive guidance is verified.
- Do not copy a design pattern without checking its accessibility behavior.
- An accessible component library improves the baseline but does not make the assembled product automatically accessible.
- Treat framework and vendor documentation as implementation guidance, not product requirements.

## Change-management rule

A change to any of the following requires an Architecture Decision Record or an explicit decision note:

- Framework or router.
- Authentication model.
- Persistent data schema.
- Offline conflict policy.
- Design-token naming.
- Localization library or message format.
- Analytics identity model.
- Accessibility target.
- Public API or component contract.
- State-management library.
- Build, test, or deployment platform.

## Minimum task input

A good agent task includes:

```md
Goal:
User scenario:
In scope:
Out of scope:
Acceptance criteria:
Relevant design or route:
Data and API assumptions:
Accessibility requirements:
Localization requirements:
Required tests:
```

## Definition of a trustworthy result

A result is trustworthy when:

- The change is traceable to a stated requirement.
- The diff is limited to the task.
- Types and tests describe the intended behavior.
- Accessibility is validated beyond a visual screenshot.
- Arabic and directionality are tested when affected.
- Offline and failure behavior are explicit when affected.
- Security is enforced at the trusted boundary.
- The agent reports uncertainty instead of hiding it.

## Core references

- [AGENTS.md open format](https://agents.md/)
- [OpenAI Codex: custom instructions with AGENTS.md](https://developers.openai.com/codex/agent-configuration/agents-md)
- [GitHub Copilot repository custom instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Cursor Rules](https://cursor.com/docs/rules)

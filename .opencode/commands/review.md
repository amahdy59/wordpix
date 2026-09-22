---
description: Review a diff per docs/14 Template H (blocking/important/minor + verdict)
agent: reviewer
---

Review this diff: $ARGUMENTS.

Current changes:

!`git diff --stat && git diff`

Follow docs/14_CODING_AGENT_TASK_TEMPLATES.md Template H: scope creep, product mismatch, accessibility/semantics, focus/keyboard, RTL/bidi, state ownership, runtime validation, offline safety, auth, PII in logs, error recovery, bundle impact, missing tests, unneeded deps, generated noise. Return blocking / important / minor findings, suggested tests, and a merge recommendation with evidence.

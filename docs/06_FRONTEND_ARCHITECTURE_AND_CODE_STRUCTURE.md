---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Frontend Architecture and Code Structure

## Architecture goals

- Make product behavior easy to locate.
- Keep domain logic independent from rendering details.
- Prevent feature code from reaching across unrelated features.
- Keep server, client, persistent, and URL state explicit.
- Make accessibility and localization reusable.
- Allow the framework to change at the edges without rewriting the learning model.

## Recommended domain-oriented structure

Adapt names to the existing framework; do not reorganize a working repository without a task-specific reason.

```text
src/
├─ app/                 # composition, providers, routing, global error boundaries
├─ routes/ or pages/    # route-level orchestration
├─ features/
│  ├─ onboarding/
│  ├─ placement/
│  ├─ daily-session/
│  ├─ learn/
│  ├─ practice/
│  ├─ progress/
│  ├─ account/
│  └─ sync/
├─ domain/
│  ├─ curriculum/
│  ├─ mastery/
│  ├─ recommendation/
│  └─ learner/
├─ components/
│  ├─ primitives/       # project-owned accessible primitives
│  └─ composites/       # reusable product components
├─ data/
│  ├─ api/
│  ├─ persistence/
│  ├─ schemas/
│  └─ mappers/
├─ i18n/
├─ tokens/
├─ analytics/
├─ observability/
├─ test/
└─ utils/
```

## Dependency direction

Preferred direction:

```text
route/app composition
→ feature
→ domain
→ shared utility
```

Data adapters implement interfaces consumed by features or domain services.

Rules:

- Domain code MUST NOT import framework UI modules.
- Shared primitives MUST NOT import feature logic.
- Features SHOULD NOT import internals of another feature.
- Routes coordinate features; they do not own complex business rules.
- API response types do not automatically become domain models.
- Data mapping and validation occur at boundaries.

## Component boundaries

A component is a good boundary when it has:

- one clear purpose;
- a small, typed interface;
- explicit states;
- accessible semantics;
- limited knowledge of data sources;
- tests based on user-visible behavior.

Split a component when:

- it contains unrelated responsibilities;
- state transitions are difficult to describe;
- effects coordinate multiple independent systems;
- it is reused with many boolean switches;
- accessibility behavior cannot be reasoned about locally.

Do not split solely to reach an arbitrary line count.

## Server and client boundaries

When using a server-capable framework:

- Keep secrets and privileged data access on the server.
- Prefer server rendering for static or data-heavy content that does not need client interactivity.
- Add client boundaries only where state, browser APIs, or event handlers are required.
- Keep client component props serializable.
- Avoid forwarding large server payloads to the browser.
- Prevent server-only modules from entering the client bundle.
- Treat caching and revalidation as product behavior.

## State ownership

Classify state before choosing a tool:

| State | Preferred owner |
|---|---|
| Input and ephemeral UI | Component |
| Shared feature workflow | Feature reducer/state machine |
| Navigation/shareable filters | URL |
| Remote canonical data | Query/data layer |
| Offline durable data | Persistence layer |
| Identity/session | Auth adapter/provider |
| Theme/language/accessibility preference | Settings domain + persistence |
| Derived values | Compute, do not duplicate |

Avoid storing derived values and synchronizing them through effects.

## Data contracts

At every external boundary:

1. Receive unknown data.
2. Validate shape and constraints.
3. Map to a domain model.
4. Handle version or missing-field behavior.
5. Return a typed result.
6. Record safe diagnostic context.

Do not trust TypeScript types to validate runtime JSON.

## Feature workflow modeling

Use a reducer or state machine when behavior includes several explicit states, for example:

```text
idle
→ loading
→ active
→ submitting
→ feedback
→ completed
→ syncing
→ synced | syncFailed
```

Transitions should reject impossible events. This is preferable to many loosely related booleans such as `isLoading`, `isDone`, `hasError`, and `isSyncing`.

## Error boundaries

Define boundaries at:

- app shell;
- route;
- high-risk feature;
- third-party or content renderer.

An error boundary should:

- preserve navigation where safe;
- show a useful recovery action;
- avoid exposing stack traces;
- log a correlation identifier;
- not erase locally saved learning.

## Public interfaces

- Export from intentional module entry points.
- Do not let deep imports become accidental APIs.
- Keep component prop names semantic.
- Prefer discriminated unions for variant behavior.
- Mark deprecated APIs and provide migration instructions.
- Use semantic versioning for shared packages.

## Architecture review checklist

- [ ] Domain logic is testable without rendering.
- [ ] Framework-specific code is concentrated at edges.
- [ ] State has one clear owner.
- [ ] Derived state is not duplicated.
- [ ] External data is runtime-validated.
- [ ] Auth and authorization boundaries are explicit.
- [ ] Offline persistence is not hidden in UI components.
- [ ] Localization and tokens are not feature-specific duplicates.
- [ ] Error boundaries preserve recoverable work.
- [ ] No circular dependencies.
- [ ] No feature reaches into another feature’s internals.
- [ ] Critical workflows have explicit state transitions.

## References

- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [React: Managing State](https://react.dev/learn/managing-state)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data)

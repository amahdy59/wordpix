---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Reference Stack Profile — React, TypeScript, Next.js, Tailwind, Supabase

## Status

This is a reference implementation profile, not permission to replace an existing stack.

Apply it when:

- the repository already uses these technologies; or
- a new implementation stack has been explicitly approved.

If the repository uses another framework, preserve the architectural and quality principles and map them to that framework’s official guidance.

## Suggested baseline

- React with TypeScript.
- Next.js App Router when server rendering, routing, and server functions are useful.
- Tailwind CSS 4 when using the Untitled UI React v8 implementation.
- Untitled UI v8 adapted through project semantic tokens.
- Supabase Auth, Postgres, Storage, and RLS when Supabase is the approved backend.
- IndexedDB for durable offline client data.
- A service worker/PWA layer for cached assets and offline navigation.
- Testing Library for components.
- Playwright for E2E.
- Storybook or equivalent for component documentation.
- axe-core integration.
- OpenTelemetry-compatible observability where feasible.

Pin actual versions through the repository lockfile. Do not copy version numbers from this guide.

## Next.js boundaries

- Use Server Components by default for non-interactive composition and data access.
- Add `"use client"` only at the smallest boundary requiring browser APIs, state, or event handlers.
- Keep secrets and Supabase service-role use server-only.
- Keep client props serializable.
- Use route handlers or server functions as trusted boundaries.
- Define cache and revalidation behavior explicitly.
- Do not cache personalized responses as public content.
- Use framework metadata, image, font, script, and error-boundary features deliberately.
- Verify route transitions and focus behavior.

## Suggested source structure

```text
src/
├─ app/
│  ├─ [locale]/
│  ├─ api/
│  ├─ layout.tsx
│  ├─ error.tsx
│  └─ not-found.tsx
├─ features/
├─ domain/
├─ components/
├─ lib/
│  ├─ supabase/
│  ├─ persistence/
│  ├─ i18n/
│  ├─ analytics/
│  └─ observability/
├─ tokens/
└─ test/
```

Route groups and private folders may organize Next.js code, but core domain logic should remain independent of routing.

## TypeScript

Recommended strict options are defined in `07_CODE_QUALITY_EFFICIENCY_AND_MAINTAINABILITY.md`.

Additionally:

- Generate database types when using Supabase.
- Do not treat generated types as runtime validation.
- Keep environment variables typed and validated at startup.
- Separate browser-safe and server-only configuration.
- Use `satisfies` for configuration validation without widening.
- Use discriminated unions for async and workflow states.

## Tailwind and Untitled UI v8

- Use Tailwind 4 and the v8 theme architecture only if this is the chosen implementation.
- Map project semantic tokens to CSS variables.
- Avoid raw color utility classes in product components when a semantic token exists.
- Use logical properties or direction-aware utilities.
- Keep focus styles project-owned and consistent.
- Generate or lint token use if practical.
- Remove unused vendor examples and components.

## Supabase

### Clients

Create distinct helpers for:

- browser client;
- server request client;
- privileged admin/server client.

Never import the privileged client into browser-reachable code.

### Database

- RLS on all exposed tables.
- Migrations in version control.
- Generated types after schema changes.
- Index foreign keys and RLS predicate columns.
- Use database constraints, not only application checks.
- Prefer idempotent writes for offline sync.
- Test policies with multiple identities.

### Auth

- Preserve session refresh behavior recommended by current Supabase docs.
- Verify OAuth redirect allowlists.
- Keep account linking and guest migration explicit.
- Do not merge identities only by unverified email.
- Test expired and revoked sessions.

## Data fetching

- Fetch on the server when it reduces client code and does not prevent offline needs.
- Use a client query layer only for truly client-owned remote state.
- Avoid fetching the same data independently in several components.
- Validate responses.
- Handle stale data and revalidation visibly.
- Keep offline durable records separate from ordinary response cache.

## Forms and actions

- Use progressive enhancement where practical.
- Validate on client for timely feedback and on server for trust.
- Return structured field and form errors.
- Prevent duplicate submission.
- Preserve values.
- Announce outcomes accessibly.
- Keep server errors safe.

## Testing profile

- Vitest or the repository’s existing unit runner.
- React Testing Library.
- Playwright.
- Storybook test and accessibility addons.
- Supabase local or isolated test project for schema/RLS tests.
- Mock only network or system edges, not the behavior under test.

## Framework-specific release checks

- [ ] Server-only modules do not enter client bundles.
- [ ] Environment variables are correctly scoped.
- [ ] Personalized data is not publicly cached.
- [ ] Metadata and language/direction are correct per locale.
- [ ] Route loading and error states are accessible.
- [ ] Bundle analyzer reviewed for major additions.
- [ ] Production build passes.
- [ ] Supabase RLS tests pass.
- [ ] Service worker version is compatible with the deployed app.
- [ ] Hydration warnings are zero.
- [ ] Client JavaScript remains within budget.

## References

- [React documentation](https://react.dev/)
- [Next.js documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js accessibility architecture](https://nextjs.org/docs/architecture/accessibility)
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
- [TypeScript TSConfig](https://www.typescriptlang.org/tsconfig/)
- [Untitled UI React v8 upgrade](https://www.untitledui.com/react/docs/upgrade)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)

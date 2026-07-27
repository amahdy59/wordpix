Vibe Coding Checklist


Define the app's single job and primary user — one sentence each, written down

Choose and lock folder structure (feature-based or layer-based) — never mix

Document state management approach upfront (Zustand, Context, Redux, etc.)

Design token schema locked in Figma before touching code (spacing, color, type)

Component naming convention agreed (PascalCase components, kebab-case files)

RTL requirement confirmed — if targeting Arabic, plan bidirectionality from day one

Tech stack and package versions pinned — no surprise updates mid-build

Environment variables schema documented (.env.example committed to repo)

ADR file created (Architecture Decision Records) — one entry per key decision

Pre-prompt template written: constraints, RTL status, existing component names, token names. Paste into every AI session.
Architecture & Maintainability

-----

One component / module = one responsibility. If a file does more than one thing, split it.

Clear separation: UI components / business logic / data layer / utilities

Reusable components extracted (buttons, inputs, cards) — never copy-pasted across screens

Business logic separated from presentation (hooks / composables / services, not in JSX)

Shared logic (validation, formatting, API calls) centralized — not duplicated per screen

No hardcoded values — all spacing, color, strings in design tokens, constants, or config

File names match their default export / component name, always

No abbreviations that only make sense in the moment (btn2, tempFix, dataX)

TypeScript (or equivalent) enabled — catches AI-hallucinated props and fields early

Linting + formatting enforced automatically (ESLint / Prettier) — not manually reviewed

README explains setup, architecture decisions, and folder structure

Complex logic has 'why' comments, not 'what' comments

Component props / function signatures documented (JSDoc, TSDoc, or type annotations)

Error boundaries planned: where in the tree errors get caught and how they surface to users

Debt log maintained — a running list of knowingly taken shortcuts, so they get revisited
Vibe-Coding Hygiene
0/10
The habits that separate 'shipped' from 'silently broken'. AI has no memory — you do.

-------


Every AI-generated chunk read and understood before moving on. Never paste-and-pray.

Commits are small and frequent — bisect when something breaks, not hunt through 800 lines

Search for existing utilities before asking AI to generate new ones — no silent duplication

Check if generated code references components or utilities that don't exist yet (hallucinated imports)

Dependencies audited before adding — don't let AI pull a library for what one function could do

AI-generated sections flagged for review — never let vibe-coded blocks accumulate silently

Secrets / API keys never hardcoded — AI inlines them for convenience; explicitly check every session

Tests exist for critical paths (auth, payments, data mutations) — not necessarily 100% coverage

Each AI session starts with your pre-prompt template (constraints, RTL, component names, tokens)

After each AI session: run the linter, run existing tests, review diff before committing
Security
0/14
Vibe-coded apps are especially prone to security gaps because AI normalizes insecure patterns.

Check all
Reset

Auth tokens stored correctly — never in localStorage for sensitive apps (use httpOnly cookies or secure storage)

All user input sanitized before rendering — AI-generated form handlers often skip XSS prevention

API responses validated before rendering — never trust response shape blindly

Third-party scripts audited — AI loves pulling in extras; each one is an attack surface

SQL / NoSQL injection prevented — parameterized queries always, never string-concatenated queries

CORS configured explicitly — never a wildcard (*) in production

Authentication and authorization both implemented — authn (who you are) and authz (what you can do)

Sensitive data never logged — console.log(user) during dev leaves PII in prod logs

Rate limiting on auth endpoints — login, signup, password reset all need it

HTTPS enforced, HTTP redirects to HTTPS — never ship plaintext in prod

Content Security Policy (CSP) headers set — limits damage from any injected scripts

Dependency vulnerabilities checked (npm audit / yarn audit) before shipping

File uploads validated server-side — type, size, content. Never trust client-side validation alone.

Secrets rotation plan exists — what happens when a key leaks?
Performance
0/16
Budget performance before you need to fix it. Most perf issues are architectural, not tactical.

Check all
Reset

Code splitting / lazy loading for routes and heavy components — no monolithic bundles

Images optimized: WebP/AVIF format, responsive srcset, lazy loading, correct display size

Bundle size monitored — tree-shaking working, no accidental full-library imports (import _ from 'lodash')

Debounce / throttle on expensive operations: search inputs, scroll listeners, resize handlers

Memoization used deliberately (useMemo, useCallback, React.memo) — profiled, not sprinkled

No unnecessary re-renders — verified with DevTools profiler, not assumed

Caching strategy for API calls defined (stale-while-revalidate, proper cache headers)

Database queries checked for N+1 problems — especially on list/feed screens

Pagination or infinite scroll instead of loading all records at once

Performance budgets defined (load time target, bundle size cap) — checked in CI

Data visualization render perf checked — chart libraries can re-render the whole SVG on every data update

SVG vs Canvas decision documented for visualization-heavy screens — revisit if data exceeds ~500 nodes

Mobile: list rendering virtualized for long lists (FlatList / RecyclerView, not mapped arrays)

Mobile: animations run on GPU/native thread — avoid JS-thread animations that cause jank

Mobile: cold start time measured and minimized — lazy-load non-critical modules

Mobile: offline handling and graceful degradation designed for poor connectivity
Accessibility
0/19
WCAG 2.1 AA minimum. RTL support is a first-class accessibility requirement for your work.

Check all
Reset

Semantic HTML: <button> not <div onClick>, correct heading hierarchy h1→h2→h3

Landmarks present: <nav>, <main>, <header>, <footer> for screen reader navigation

Forms: every input has an associated <label> — placeholder text is not a label

Full keyboard navigability: tab order is logical, no keyboard traps anywhere

Visible focus states on all interactive elements — never just outline: none

Touch targets ≥44×44px on mobile (Apple/Android guideline)

Gestures have accessible alternatives: swipe-to-delete also has a button

Color contrast meets AA: 4.5:1 for text, 3:1 for large text and UI components

Color is never the sole indicator of meaning — errors use icon + text, not only red

Alt text on meaningful images; decorative images use alt='' or aria-hidden='true'

Captions / transcripts for any video or audio content

ARIA used only where semantic HTML can't do the job — don't over-ARIA

Dynamic content changes announced via aria-live (form errors, toasts, loading states)

Screen reader tested at least once per major flow — VoiceOver (iOS/Mac) or TalkBack (Android)

Text resizable to 200% without breaking layout — tested in browser zoom

Reduced motion respected — prefers-reduced-motion media query applied to all animations

RTL: bidirectionality tested at component level — icons, progress bars, tooltips, animations all have RTL-specific behaviors AI never handles by default

RTL: logical CSS properties used (margin-inline-start, not margin-left) for layout that flips correctly

RTL: verify text alignment, list markers, input direction, and flex/grid direction in RTL mode
UX & Interface Quality
0/16
Every screen needs all four states. Happy path only is half a product.

Check all
Reset

Loading, empty, error, and success states designed for every screen — not just the happy path

Errors are actionable: tell the user what to do, not just 'something went wrong'

Optimistic UI or clear loading indicators for any action taking >300ms

Confirmation dialogs for destructive actions: delete, logout, irreversible submissions

Data loading hierarchy defined: skeleton screens vs spinners vs optimistic UI — consistent, not per-component whim

Onboarding / empty states guide first-time users — never a blank screen with no direction

Form validation happens inline, not only on submit

Design system enforced — spacing, typography, colors pulled from tokens, not one-off values

Interaction patterns consistent across the app — same gesture/button style means the same thing everywhere

Copy tone and terminology consistent — 'Delete' in one place and 'Remove' for the same action is a UX failure

Layouts tested across breakpoints: mobile, tablet, desktop — re-flowed sensibly, not just resized

Safe areas respected on mobile: notches, home indicators, dynamic island

Navigation is predictable — back button behaves as expected, breadcrumbs where depth > 2

Microcopy reviewed: button labels are verbs, errors explain what happened and what to do, placeholders are real examples

Dark mode tested if supported — color variables, not hardcoded hex values

Print stylesheet considered if the content might be printed (reports, invoices, dashboards)
Pre-Ship Checklist
0/10
Run this before every release. Not just the first one.

------

All console.log / debug output removed or gated behind a DEBUG flag

Error boundaries tested — what does the app show when a component crashes?

All TODOs and FIXMEs reviewed — intentional deferral documented, unintentional ones fixed

npm audit / yarn audit run — no high/critical vulnerabilities shipped

Environment variables verified for production (not pointing at dev/staging services)

Analytics / error monitoring configured (Sentry, Datadog, or equivalent) — know when prod breaks

Lighthouse audit run — Performance, Accessibility, Best Practices, SEO all reviewed

Cross-browser test: Chrome, Firefox, Safari minimum. Edge if enterprise audience.

Real device test, not just emulator — at least one iOS and one Android device

Rollback plan defined — how do you revert if prod breaks within 30 minutes of deploy?
Progress saves automatically across sessions. Use the session name to track different projects.
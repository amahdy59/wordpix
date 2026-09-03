# Architecture Decision Records (ADR) — WordPix

## ADR 001: Project Scope & Core Purpose

- **Date**: 2026-07-28
- **Single Job Statement**: Provide an interactive, visual-first English vocabulary learning experience for adult Arabic speakers.
- **Target Persona**: Adult Arabic-speaking language learners seeking practical, context-based vocabulary, scene exploration, and real-world conversation exercises.

---

## ADR 002: Streamlined Adult Onboarding Flow

- **Decision**: Remove age-selection screen from the onboarding sequence.
- **Onboarding Sequence**: `Splash` → `Language Selection` → `Interests Selection` → `Ready Celebration`.
- **Rationale**: Adult learners prefer direct, respectful onboarding without child-oriented age profiling.

---

## ADR 003: Responsive Multi-Device Layout Strategy

- **Decision**: Mobile-first layout with dedicated tablet and desktop enhancements.
  - **Mobile (<768px)**: Bottom navigation bar, full-width cards, compact headers.
  - **Tablet (768px–1024px)**: Collapsible navigation sidebar, two-column grid layouts.
  - **Desktop (1024px+)**: Full expanded navigation sidebar, split-screen interactive scene canvas with side-by-side vocabulary panel.

---

## ADR 004: State Management Strategy

- **Decision**: Centralized top-level state machine via `useReducer` in `App.tsx` for screen transitions (`Screen` and `Action` types), combined with localized component state (`useState`) for exercise transient states.

---

## ADR 005: Design Tokens & Styling Architecture

- **Decision**: Tailwind CSS v4 `@theme inline` bridge in `src/styles/theme.css` backed by semantic CSS custom properties (`--wp-brand`, `--wp-surface`, `--wp-card`, `--wp-text`).
- **Typography Rule**: Only two fonts permitted across the application:
  - `Inter` (`var(--wp-font-base)`) for English UI and body text.
  - `Noto Sans Arabic` (`var(--wp-font-arabic)`) for all Arabic copy.

---

## ADR 006: Bilingual & RTL First-Class Support

- **Decision**: All Arabic text elements must explicitly include `dir="auto"`, `lang="ar"`, and `font-arabic`. Logical CSS properties (`margin-inline-start`, `padding-inline`) are preferred over hardcoded physical properties.

---

## ADR 007: Error Boundaries & Graceful Degradation

- **Decision**: Wrap root screens in a React Error Boundary (`src/app/shared/ErrorBoundary.tsx`) to catch unexpected component render exceptions without crashing the entire app.

## ADR-014: Audio generation is a bounded, ledgered, manually-triggered pipeline

**Status:** Accepted

**Context.** Speech for the app comes from ElevenLabs, which bills per
character. The corpus is 21,858 distinct clips / 1.16M characters, so an
accidental full run is a real invoice, and a repeated run is that invoice twice.
At the time of writing, 252 clips had been generated and the remaining 99% of
the app fell back to the browser's built-in voice.

**Decision.**

1. **Keys are content-addressed** — SHA-256 of the voice profile plus the
   normalised text. Identical text anywhere in the corpus is one object, and
   the browser derives the same key it uploads under, so no manifest ships.
2. **A committed ledger** (`assets/audio-ledger.json`) records what has been
   paid for. Anything in it is skipped without an API call.
3. **The bucket, not the ledger, is the source of truth.** `--reconcile`
   re-checks ledger entries against R2 and drops the ones whose object is
   missing, so a stale record cannot make a clip be skipped forever.
4. **Generation never runs automatically on code changes.** The workflow is
   `workflow_dispatch` plus a monthly top-up of the cheapest, highest-value
   tier (`words`, ~74k characters), and every run carries a `--max-chars`
   budget it refuses to exceed mid-run.

**Consequences.** Re-running is safe and nearly free, which is what makes the
pipeline resumable. The cost is one committed file that must be kept in step
with the bucket — hence the reconcile step, which runs before every generation.
A voice-profile change re-keys the entire corpus; the generator refuses to
proceed on a profile mismatch rather than silently re-buying it.

## ADR-015: CORS on the asset bucket is configured by script, not by hand

**Status:** Accepted

**Context.** The bucket served two kinds of request and only one worked. A
media element may load a cross-origin file without CORS, which is why images
rendered and audio played. `fetch()` may not, and `fetch` is how the app fills
its IndexedDB cache for offline playback — so with no policy on the bucket,
every caching request failed and the offline cache stayed permanently empty.

**Decision.** `scripts/setup_r2_cors.cjs` applies and verifies the policy, with
an explicit origin allowlist rather than `*`. The R2 client signs
sub-resource requests (`?cors`) so this needs no extra dependency.

**Consequences.** Bucket configuration lives with the code that depends on it
and survives the bucket being recreated. It requires an R2 token with
**Admin Read & Write**; the object-scoped token the upload scripts use returns
a bare `AccessDenied`, so the script says so explicitly rather than leaving
that to be guessed.

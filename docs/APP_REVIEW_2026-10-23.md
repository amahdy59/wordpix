# WordPix application review — 23 October 2026

Review of UX, stability, performance and educational content at commit
`97bcfb9d7666d21493e931f9d3fffa680fd5020a`.

This is a review, not an implementation or release. Application source and R2
assets/mappings were not changed. P1 means high-impact corrective work; P2 means
planned improvement. Browser reproduction, code inspection and editorial backlog
evidence are identified separately below.

## Findings, in recommended order

### 1. P1 — Practice can complete a review without presenting its due words

**Reproduced in the browser.** In an isolated local profile, seed one overdue
Numbers word (`one`), reload Practice, then activate Smart Review. The app opens
`#/learn/bedroom/step-1`, immediately displays a completed Daily Review with
**0 words and +35 XP**, and says progress was saved. No question was answered.

[SkillExerciseHub.tsx](../src/app/core/SkillExerciseHub.tsx), line 101, starts the
review without loading its vocabulary. The dedicated review schedule screen does
load the required units, so the two entry points behave differently.
[RouterView.tsx](../src/app/router/RouterView.tsx), lines 320 and 385, resolves
only loaded words and treats a missing plan step as completion before checking
for an empty vocabulary set. The completion component then records the session.

**Improve:** load every selected review item's owning unit before starting, use a
clear loading/retry state, and reject incomplete or empty resolved queues before
completion or rewards. Add a regression that starts Practice from a fresh page
with only non-Bedroom words due. Verify every queued word is actually assessed.

Evidence: `output/playwright/review-20261023-empty-review.png` and the snapshot
`.playwright-cli/page-2026-10-23T04-50-25-837Z.yml`.

### 2. P1 — Accessibility updates fail strict sync validation

**Reproduced against the actual validator.** `AccessibilityPreferences` and its
defaults contain `autoPlayAudio`. `setAccessibility` queues the entire object.
The strict [syncValidation.ts](../src/lib/persistence/syncValidation.ts) schema,
line 20, omits that property. A normal accessibility payload is therefore rejected
and quarantined as a validation failure. Removing only `autoPlayAudio` makes the
same payload pass. The retry UI only retries authorization failures, so it cannot
repair these entries.

**Improve:** share one versioned accessibility schema across persistence and sync,
include autoplay with a legacy default, and safely repair affected queued updates.
Test a payload produced by the provider, not a separately handcrafted subset.

Evidence: `output/review-2026-10-23/checks.txt`.

### 3. P1 — Progress merges distinct meanings of the same word

**Validated in code and content.** Vocabulary rendering is unit-scoped, but memory
and mastery are keyed only by `wordId`. `coach` means a travel bus in Bus Station
and a sports trainer in Sports Center; `conductor` means a musician in Orchestra
and a train worker in Train Station. All instances share one memory record.
`scale` spans weighing, maps, musical notes, climbing and business growth.

[LearnerContext.tsx](../src/app/context/LearnerContext.tsx), line 565, updates
`wordMemory[wordId]`; [LearningPath.tsx](../src/app/core/LearningPath.tsx), line 46,
reads it for each unit. The first-owner `WORD_TO_UNIT_MAP` in
[courseCatalog.ts](../src/app/data/courseCatalog.ts), line 23378, also resolves a
review word to whichever unit was registered first.

**Improve:** introduce a stable unit/sense identity for learning evidence and
review questions, with an explicit non-destructive migration. Transfer evidence
between occurrences only when their sense is verified as equivalent. This needs
an ADR and persistence/backend changes. Preserve existing content IDs and every
R2 URL; do not solve it by renaming media or changing mappings.

### 4. P1 — Specialist learning records are absent from ongoing cloud sync

**Validated in code; no live account writes performed.** Pronunciation, Hadith,
Conversation and Business checkpoints update local state without a corresponding
queued learning mutation. Completion generally uploads XP, not the specialist
record. Reflections, stage completion and review schedules have no ongoing sync
operation. The migration response also restores only general progress, word
memory and session history.

See [LearnerContext.tsx](../src/app/context/LearnerContext.tsx), lines 711, 729,
776 and 858; [db.ts](../src/lib/persistence/db.ts), `SyncOperation`; and
[sync.ts](../src/lib/persistence/sync.ts), `processOperation`.

**Improve:** add idempotent, validated specialist progress operations and restore
them on another device. Cover sign-out/sign-in, offline completion, retries and
concurrent changes. Until supported, communicate that these records are local;
the Profile label “Cloud sync active” currently gives broader reassurance.

### 5. P1 — Crash recovery offers an unconfirmed progress deletion

**Validated in code.** [ErrorBoundary.tsx](../src/app/shared/ErrorBoundary.tsx),
line 38, handles “Reset App & Go Home” by removing saved state and requesting
deletion of `wordpix_offline_db`, which contains progress and pending mutations.
There is no destructive-action confirmation or explanation of unsynced loss.
The asynchronous database deletion is also not awaited before reload.

**Improve:** make reload and navigation recovery preserve learner data. Put a true
erase operation behind an explicit explanation and confirmation, offer export
where feasible, and handle database deletion completion/blocking. Test recovery
with unsynced guest progress. The destructive button was not activated.

### 6. P2 — Invalid persisted navigation can leave a blank app

**Reproduced in the browser.** Save
`{"id":"lesson","lessonId":"numbers-counting-1"}` under
`wordpix:learner-state:v4`, then open the base URL without a hash. The page becomes
blank with an uncaught TypeError and no recovery UI. Restoring the test profile
and reloading `#/home` recovers it.

[App.tsx](../src/app/App.tsx), line 43, accepts any object with a string `id` as a
`Screen`. Required fields are not checked. Errors during AppInner's hooks happen
outside its returned ErrorBoundary. The separate lesson-resume path already has
stronger schema validation.

**Improve:** validate and migrate saved navigation as a discriminated union,
fall back to a safe route without erasing learning data, and put a boundary above
the provider/router initialization path. Test partial and obsolete stored states.

### 7. P2 — Local save failures are silent, and checkpoints have a shutdown gap

**Validated in code; shutdown loss not measured on physical devices.**
[db.ts](../src/lib/persistence/db.ts), line 159, catches write errors and resolves
`false`. [LearnerContext.tsx](../src/app/context/LearnerContext.tsx), line 382,
attaches only `.catch()`, so it ignores that failure result. Queue writes also
swallow failures. Learners can continue seeing saved-progress copy.

Checkpoint writes are debounced by 500 ms and flushed on React unmount, with no
page-hide/visibility flush. Browser termination does not guarantee React cleanup;
specialist checkpoints have no queued mutation to replay.

**Improve:** expose loading/saving/saved/failed persistence states, retain failed
snapshots for retry, and use a transactional durability strategy for completion
and checkpoints. Flush proactively when hidden; do not promise that an async
unload write alone guarantees durability. Test denied storage, quota exhaustion,
and reload immediately after a checkpoint.

### 8. P2 — A concrete bilingual error remains in learner content

**Individually inspected.**
[community-center.json](../src/app/data/bilingual/community-center.json), line 225,
defines `coach` as “A person who trains players in a sport” but translates it as
`حافلة سفر` — a travel bus. The sports sense needs an appropriate trainer gloss.
The runtime bilingual overlay consumes this row.

**Improve:** correct this English/Arabic pair and check repeated words by sense
across units. Keep an editorial regression for this exact mismatch; checking only
that a gloss contains Arabic characters cannot detect it. This is a confirmed
example, not a claim that all remaining content was reviewed.

### 9. P2 — Library treats started units as “Not started” until a word is strong

**Validated in code.** [ExploreWorlds.tsx](../src/app/core/ExploreWorlds.tsx),
lines 305–306, defines “In progress” as `masteredWords > 0` and “Not started” as
`masteredWords === 0`. A learner with many learning/familiar words and no strong
words gets the wrong unit category. The word-result filter uses different rules.

**Improve:** derive started status from actual exposure/attempt evidence and
reserve complete status for the mastery policy. Test a unit with learning words,
a unit with familiar words, and a genuinely untouched unit.

### 10. P2 — Startup still loads the complete curriculum summary catalog

**Measured build payload; no field latency claim.** The existing production build
matches the reviewed commit and passes both budget scripts. Initial static JS
requires **458.7 KiB gzip across 10 files**, including **117.1 KiB** for
`course-lessons` and **33.6 KiB** for the asset manifest. Library's required static
closure is 491.9 KiB gzip. These exclude fonts, CSS, images and optional lessons.

[HomeDashboard.tsx](../src/app/core/HomeDashboard.tsx), line 7, eagerly needs the
catalog. [courseCatalog.ts](../src/app/data/courseCatalog.ts) contains all group
summaries. [assetUrl.ts](../src/utils/assetUrl.ts), line 1, eagerly imports the
replacement map.

**Improve:** split small unit metadata from per-unit group details in the
generation pipeline; load details at the relevant route boundary. Measure cold
mobile LCP/INP under representative bandwidth and CPU constraints before changing
budgets. Evaluate deferred asset-map loading only if synchronous resolution and
offline correctness remain intact. All R2 mappings must remain unchanged.

### 11. P2 — Curriculum breadth exceeds documented editorial readiness

**Backlog evidence plus code inspection.** The permanent ledger records definition
and Arabic-gloss reads for **87/200 units**, leaving **113**; it records **zero
complete lesson approvals**. This does not negate the separately documented
Hadith editorial review. A clean structural audit is not a semantic approval.

[curriculumModel.ts](../src/app/learning/curriculumModel.ts), line 477, supplies
authored designs for 18 units and provisional archetype templates for 182. Its
level inference has no C1 return path. All 21 C1-path units therefore have lower
suggested difficulty. The UI explicitly distinguishes path phases from suggested
difficulty, so the difference alone is not presented here as a routing defect.
The remaining opportunity is to validate the actual task demands and progression.

**Improve:** prioritize foundation and high-traffic units, then advance through
the sequence. Approve each meaning, Arabic gloss, scenario/question alignment,
distractor, model answer and communicative final task. Record reviewer, evidence
and status per unit. Assess delayed recall and transfer with adult learners, using
the existing learner-test protocol. Treat placement and suggested levels as
provisional until calibrated; keep C2 coverage limits explicit.

CEFR alignment should use communicative descriptors and documented assessment
linking, not topic names alone. References: [Council of Europe descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors)
and [assessment-linking manual](https://www.coe.int/en/web/common-european-framework-reference-languages/relating-examinations-to-the-cefr).

### 12. P2 — Arabic word-detail controls retain English-only accessible labels

**Reproduced in the Arabic lesson UI.** The close control announces “Close word
details” and the example control announces “Listen to example 1” while surrounding
controls are Arabic. These strings are hardcoded in
[WordInspectorModal.tsx](../src/app/shared/WordInspectorModal.tsx), line 80, and
[WordDetailsContent.tsx](../src/app/shared/WordDetailsContent.tsx), line 226.
The inspector's English word heading also inherits the Arabic document language.

**Improve:** localize control names and mark English learning text with `lang="en"`
and appropriate directionality. Audit mixed-language announcements with an Arabic
screen reader, including focus return and interrupted audio. Automated axe checks
do not establish correct pronunciation or translation quality.

## Verification and limits

- `npx tsc --noEmit`: passed.
- `npx vitest run`: **177 files / 3,069 tests passed**.
- `pnpm run lint`: passed.
- Existing build's `build-info.json` matches HEAD; both bundle-budget scripts pass.
  A new production build was not generated for this review.
- Microsoft Edge/Playwright at 390 × 844: Home, Learn, Practice, Library and Profile
  passed the selected axe WCAG A/AA/AAA-tag checks in English/light and Arabic/dark,
  with no document horizontal overflow. Settings appearance and the sampled
  Arabic word-detail dialog also passed the selected checks.
- Inspected onboarding, Numbers entry/listen-and-repeat/details, the cold review
  failure and malformed navigation. These are samples, not a full WCAG AAA audit,
  a complete E2E run, or a review of every lesson/image.
- Five sampled audio fetches failed CORS checks from local origin
  `http://127.0.0.1:4174`; this does **not** establish a deployed-origin failure.
  Production-origin playback/offline behavior needs separate verification. No R2
  configuration, objects or content-to-URL mappings were changed.
- A cached-route fault-injection attempt did not reproduce a vocabulary download
  failure; no browser-validated network-recovery finding is claimed from it.
- No live account migration, multi-device sync, physical-device termination test,
  full manual screen-reader audit or field Core Web Vitals measurement was run.

## Suggested implementation sequence

1. Repair cold Smart Review and sync-schema rejection; prevent rewards for an
   unpresented/empty review. Add regressions from the reproduced failures.
2. Protect local progress: safe crash recovery, validated hydration, visible save
   failure handling and durable checkpoints.
3. Design sense-aware progress migration and specialist cloud persistence, with
   explicit backend contracts and cross-device tests.
4. Correct the confirmed gloss, complete editorial approvals, and validate task
   difficulty and adult-learner transfer outcomes.
5. Correct Library status semantics and Arabic accessible names, then reduce
   startup catalog cost against measured mobile performance.

Apply normal bilingual release-note and verification requirements to each shipped
implementation. This review itself does not ship an application update.

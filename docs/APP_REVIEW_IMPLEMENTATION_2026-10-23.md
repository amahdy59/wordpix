# Application review implementation

This implements the engineering work identified in `APP_REVIEW_2026-10-23.md`.
Do not mark empirical validation or editorial approval complete merely because tests pass.

| Finding               | Implementation                                                                                               | Remaining validation                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 1. Empty cold reviews | Exact unit references, vocabulary gate with retry, full-queue resolution, no rewards for unassessed sessions | Passed across three browser projects                                                       |
| 2. Settings sync      | Shared autoplay schema and narrow repair of valid quarantined accessibility operations                       | Passed: 3,089 unit/integration tests                                                       |
| 3. Shared senses      | Unit-scoped memory identity; ambiguous legacy records preserved in an exportable archive                     | Staging migration with real prior-version snapshots                                        |
| 4. Specialist sync    | Atomic queued checkpoints, per-record RPCs, restore/merge, RLS migration and version history                 | Apply migration 05 and test two staging accounts/devices                                   |
| 5. Crash reset        | Recovery removes only navigation; progress and pending mutations remain                                      | Keyboard/browser recovery                                                                  |
| 6. Invalid navigation | Validated screen union and outer error boundary                                                              | Passed across three browser projects                                                       |
| 7. Save failures      | Immediate transactional writes, retained failed snapshots, retry/export, page-hide flush                     | Physical-device interruption and storage-pressure testing                                  |
| 8. Coach gloss        | Correct coach, current, spring and fan senses, Arabic lesson lists and search index                          | Individual review continues for other content                                              |
| 9. Library status     | Started means exposure/attempt evidence; mastery means strong                                                | Passed across three browser projects                                                       |
| 10. Startup catalog   | Per-unit deferred group descriptions; canonical field/media parity test                                      | Cold mobile field LCP/INP; build payload improved from 458.7 to 429.1 KiB gzip             |
| 11. Editorial/CEFR    | Explicit evidence gate and participant study protocol; provisional labels retained                           | 113 vocabulary units, complete lesson approvals, and adult learner calibration remain open |
| 12. Arabic controls   | Localized word-details controls and English language/direction annotations                                   | Arabic assistive-technology user testing                                                   |

## Deployment order

1. Back up the staging database and apply `supabase/migrations/05_specialist_progress.sql`
   after migrations 01–04. It adds tables/functions without deleting existing
   vocabulary history. R2 and all media mappings remain read-only.
2. Use two staging users to verify RLS isolation. Test the same user on two
   devices, including offline checkpoints and simultaneous stage completion.
   Confirm independent users cannot read the other's specialist records or versions.
3. Test guest merge twice with the same migration receipt; confirm no duplicate XP
   or specialist records. Re-sign-in on another device and verify checkpoint,
   reflection, and review-date restoration.
4. Deploy the client only after the migration checks pass. A missing RPC is
   retained as a visible, manually retryable backend-setup failure; local work
   remains durable. This change does not itself apply a production migration.

## Historical learning evidence

New memory keys are `unitId::wordId`. The `wordId` and every content/media URL
remain unchanged. Old records with exactly one possible owning unit migrate to
that unit. Ambiguous records are retained under `legacyWordMemory` and can be
downloaded from Profile. They are not assigned to every sense or to an arbitrary
first unit. XP, streaks and session history are retained. Establish new evidence
for each meaning through practice.

## Editorial and learner validation

Run `node scripts/check_content_readiness.mjs` for the evidence counts. Use
`--require-complete` before asserting complete editorial review; it deliberately
fails while approvals are missing. It is not a blanket shipping gate for the
existing provisional catalog.

Follow `docs/16_CONTEXTUAL_LANGUAGE_LEARNER_TEST_PROTOCOL.md`: recruit at least
five consenting adults per tested CEFR band, include Arabic-first and assistive
technology users, and measure recognition, comprehension, guided production and
independent transfer after 24–72 hours. Preserve anonymous evidence separately
from product analytics. No participant results or approvals have been invented.

The original editorial queue and its 87/200 vocabulary-read count are preserved.
The confirmed Community Center correction is a targeted repair, not approval of
that entire unit, its images, or its questions.

Additional targeted sense checks corrected the Arabic water-current gloss in
Coral Reef and River, the season Spring in Seasons & Weather, and the English
equipment definition and example for Fan in Gym. Matching Arabic target-word
lists were aligned with the reviewed glosses. Before/after evidence is retained
in the permanent editorial ledger; media references are unchanged.

## Verification results

- TypeScript: passed.
- Unit/integration: 178 files, 3,089 tests passed.
- ESLint: passed with zero errors or warnings.
- Production build and both bundle budgets: passed with media preservation enabled.
- Startup static JavaScript: 429.1 KiB gzip, down from 458.7 KiB (about 6.5%).
- New cold-review and invalid-navigation regressions: six passes across desktop Chromium, mobile Chromium and mobile WebKit.
- Isolated PostgreSQL verification: migrations 01–05, actual RPC execution, idempotent retries, guest migration replay, two-user RLS isolation, reflection version retention and concurrent session counts passed. The optional verification runtime was installed in the system temporary directory; no application dependency was added.
- Hosted database migration, physical-device interruption, complete editorial sign-off, and adult-learner calibration remain pending.

Browser verification completed with retries disabled. The broader 318-case run passed 306 checks; 12 assertions still expected the former English-only close label. Those assertions were aligned with the localized shared close control, then all 30 checks in the affected specifications passed, including three new Library-state checks. This covers 321 distinct cases across the full run and the focused rerun; the unaffected specifications were not rerun after the test-only assertion update.

Verification logs are retained in `output/review-implementation-2026-10-23/`, including the initial browser failures and their passing rerun. R2 mappings, audio manifests, image selections, and existing thumbnails were preserved. English/Arabic release history was updated to 0.1.81 and its public artifact regenerated. No production deployment or hosted database migration was performed.

## Follow-up: saved navigation and download recovery (0.1.82)

Review of the pending implementation found that structurally valid navigation
could still refer to unknown units/groups, mismatched lesson ownership, or review
items inconsistent with the session queue. Saved navigation now validates these
identities before restoring a screen, including specialist lesson bounds and
active/answered word membership. Invalid navigation falls back to Home through
the existing initializer; canonical learner records are not deleted. Valid
legacy lessons without an explicit unit and repeated assessment queues remain
supported. Old reviews without owning-unit identities recover to Home so a new
review can select the correct meanings.

The content-download error panel now offers both Retry and Back to learning
path, using existing English/Arabic translations and the shared accessible
button. A failed download no longer leaves a learner with only a retry action.

Follow-up verification:

- Required ladder, in order: TypeScript passed; 180 unit/integration files and
  3,125 tests passed; ESLint passed.
- Added 36 unit/component cases; invalid-state regressions failed before the
  validator fix and passed afterward.
- Recovery and existing app-review browser specifications: 24 passed across
  desktop Chromium, mobile Chromium and mobile WebKit. English/Arabic error
  panels passed the selected axe checks and keyboard activation of the return
  action. This is not a complete WCAG AAA audit.
- Direct Vite production build and both bundle-budget scripts passed. Startup
  required JavaScript is 429.4 KiB gzip against the existing 490 KiB budget.
- Formatting checks passed for the follow-up files. Bilingual 0.1.82 release
  history and its generated public artifact are synchronized.

The existing hosted-database, physical-device and editorial validation limits
above remain open. No R2 assets, media mappings, production deployment or hosted
database migration were changed during this follow-up.

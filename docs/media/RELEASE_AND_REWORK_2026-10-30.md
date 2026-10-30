# Release preparation, measurements and image rework

The user requested application of all recommendations and an Excel list of
remaining image work. The previously accepted media batch remains bounded to
twelve new immutable files and eight exact sentence contexts. No further media
uploads or mapping changes are authorized by the unreviewed backlog itself.

## Repeated performance measurements

Three isolated Chromium contexts per profile measured direct entry to the
rock-climbing sentence exercise. A warm visit means reloading the same context.
The image used real public bytes. Speech autoplay was disabled. Mobile emulation
used Pixel 5, 150 ms network latency, 1.024 Mbps download and 4x CPU throttling
from before navigation. Measurements ran against the local production build;
shared host load and public-network variation apply.

| Median readiness                         |  Desktop | Throttled mobile |
| ---------------------------------------- | -------: | ---------------: |
| Cold lesson, picture ready               | 1,085 ms |        11,635 ms |
| Warm lesson reload, picture ready        |   354 ms |         3,861 ms |
| Cold sentence recording start            |   361 ms |           858 ms |
| Persisted recording after offline reload |    78 ms |           322 ms |

All measured recording reloads played from persisted blob URLs. There were no
page errors. Three audio cold starts ranged from 359–1,041 ms on desktop and
843–1,239 ms under mobile emulation. Offline reload starts ranged from 71–80 ms
and 312–333 ms respectively. These are bounded observations, not field Core Web
Vitals or physical phone results. Physical phones were not connected.

The lesson transferred about 995 KB of JavaScript. The usage-registry dependency
accounted for about 309 KB, approximately 31% of that transfer. Its source lazily
loads unit usage but eagerly imports combined reviewed scene manifests through
`reviewedUsageIllustrations.ts`. A unit-scoped scene-manifest derivative is a
specific next optimization to evaluate with exact precedence and context parity
tests; changing these manifests is not part of the accepted image batch.

Cold playback retains separate streaming and background offline-cache requests.
Any consolidation should retain immediate playback and CORS-readable persisted
bytes; the repeated measurements alone do not justify changing this ownership.

## Rework workbook

The workbook is a dated tracker rather than a regeneration order. It includes:

- 42 priority records: 10 current mismatches, 27 already excluded incorrect
  associations, an answer-cue picture, one language/purpose question, one
  botanical identification question and two reference-purpose questions.
- 1,689 unassigned uses (1,686 core and three additional), with candidate counts
  and a purpose/search action. Intentional text-only uses are excluded.
- 2,014 scene uses supported only by a word-reference image.
- Remaining large active image objects with prepared variant byte counts and
  public versus local-only source evidence. Optimization requires context review.
- 34,017 assigned, unreviewed uses, explicitly not classified as defective.
- Eight completed contexts from the accepted batch.

Rows include exact text, image URLs and stable identities. Priority and review
tables have editable decision and owner fields; summary counts recalculate from
their rows. Counts of uses, images and overlapping queues must not be added as
unique pictures. No remaining image has an approved regeneration decision.

The generated Excel and priority CSV live in the ignored deliverables directory.
The local review server provides downloads and an HTML priority list so the user
can access them without relying on desktop file-link handling. Workbook formula
counts were reconciled against source data, a decision edit was checked for
recalculation, each sheet was rendered, and formula errors were scanned.

## Release workflow

Production doctor, secret hygiene and dependency audit passed before release.
TypeScript, all 3,257 unit tests, ESLint, audio coverage, media tests, production
build and bundle budgets passed. A standalone full pre-push run was deliberately
stopped during browser checks to move the final, complete run into the mandatory
Git push hook. No hook is bypassed; publication is conditional on the full hook
and CI results. Related browser integration previously passed all 81 cases.

The release uses a `codex/` branch and pull request. A successful production
deployment must be checked against the deployed commit SHA, public release notes,
browser smoke tests and deployment doctor before being reported as live.

# Unit usage-media loading — 31 October 2026

## Scope

The October 30 performance report traced about 309 KB gzip of a cold lesson's
JavaScript to the usage registry. Although unit usage JSON already loaded on
demand, the registry imported four combined reviewed image manifests eagerly.

This change generates 200 unit-scoped derivatives and loads only the units
requested by the existing usage loader. Original review manifests, R2 objects,
content IDs, media URLs, scene corrections and editorial approval rules remain
unchanged. Later manifests retain their original override precedence. Every
entry keeps its reviewed text, description, purpose and fallback fields.
The pilot helper uses a separately generated, identical sentence/reading subset
instead of importing the combined Figma manifest through another dependency.

Concurrent loads share a request and successful results. Failed requests are
evicted from the request cache and reach existing content-loader recovery;
missing chunks never become successful empty image tables. Units with no
reviewed associations have an explicitly generated empty table.

Offline text preparation explicitly loads the selected unit table before
collecting modules for its pinned cache. Optional image-pack selection continues
to use the same real usage/scene resolvers. No progress or sync state changed.

## Guardrails

- `build_usage_media_runtime.mjs --check` verifies generated files are current.
- Compiler tests compare every derivative with the original merged manifests,
  including duplicate precedence and fallback chains.
- Integration tests compare every unit's complete scene result against the
  legacy attachment rules and verify the source lessons are not mutated.
- Production builds reject imports of the four combined manifests.
- The usage-registry chunk budget is reduced from 1,200 KiB to 160 KiB;
  individual unit scene tables have a 64 KiB ceiling.
- Browser checks verify selected-unit network isolation and offline caching.

## Measurement method

`node scripts/measure_lesson_readiness.mjs <preview-base> before|after` measures
three fresh contexts for desktop and three for Pixel 5 emulation. Each context
has a cold visit and same-context warm reload. Mobile uses 150 ms latency,
1.024 Mbps download and 4× CPU throttling before navigation. The rock-climbing
sentence uses its existing real image; audio autoplay is disabled.

Readiness means that the expected image is visible and decoded. Script network
bytes, usage-registry requests, unit scene-table requests, page errors and
long tasks are recorded. These local production-build observations include host
load and public-network variation. They are not physical-device results or
field Core Web Vitals. Output stays under `output/usage-loading-2026-10-31/`.

## Measurements

| Measure                                         |    Before |     After |
| ----------------------------------------------- | --------: | --------: |
| Usage-registry chunk, raw bytes                 | 1,050,144 |    62,275 |
| Usage-registry chunk, gzip bytes                |   309,596 |    13,341 |
| Cold lesson JavaScript transfer, median bytes   |   999,710 |   706,896 |
| Cold throttled-mobile picture readiness, median | 14,022 ms | 10,705 ms |
| Warm throttled-mobile picture readiness, median |  3,841 ms |  3,942 ms |
| Cold desktop picture readiness, median          |  1,138 ms |  2,756 ms |
| Warm desktop picture readiness, median          |    487 ms |    475 ms |

The measured cold mobile improvement is about 24%; JavaScript transfer falls
about 29%. Each after-run requested exactly one unit usage-media table. The
largest generated production scene table is 28,697 raw bytes. The four original
manifests are byte-identical before and after the change.

Warm mobile timing is essentially unchanged. Desktop cold timing worsened in
this small sample, so this report does not claim faster desktop readiness.
The image is requested from the real public endpoint, and host/network variance
is included. These observations support a payload reduction and a measured
cold-mobile improvement, not a guarantee for every device or connection.

## Verification

- TypeScript passed, followed by 202 Vitest files / 3,267 tests, then full ESLint.
- Production build, original-manifest hashes, generated-table parity, all 43
  media-tool checks and existing bundle/route budgets passed.
- Final browser verification: all 117 related cases passed with one worker and
  retries disabled across Chromium, mobile Chrome and mobile WebKit. Coverage
  includes selected-unit request isolation, offline preparation/reload, image
  pack removal, responsive image fallback, and recent geometry/retail/humidity
  repairs in English and Arabic. No browser assertions were relaxed.
- The initial two-worker
  117-case run had one failure and five cases passing only on retry. The failed
  stock-image case passed its isolated no-retry run. Its failure trace shows a
  pending unit metadata request at the five-second image assertion deadline;
  other snapshots show the lesson loading screen. The complete no-retry rerun
  passed as recorded above. Initial logs remain alongside the final evidence.
- Newly written code passes formatting checks; the pilot helper's pre-existing
  formatting debt was retained rather than rewriting the file for one import.
  Release history is synchronized in both languages and prior entries remain
  unchanged. No complete WCAG conformance or physical-device claim is made.

Local evidence is under `output/usage-loading-2026-10-31/`: `before.json`,
`after.json`, `summary.json`, both bundle records, `source-hashes.json`,
`final-build.log`, budget logs, and `browser-final.log` / `browser-final/`.

The optimization was initially verified locally. Local main was fast-forwarded
to the content-repair branch with user approval before the change.

## Subsequent release preparation

The user subsequently requested publication and a clear audio/visual quality
plan. Release preparation integrates the newer supplied-image release from
remote main and advances this release to 0.1.107, preserving its 34 supplied
contexts and exact reviewed image holds. The next work is recorded in
`NEXT_STEPS_AUDIO_VISUAL_QUALITY_2026-10-31.md`.

Fresh read-only audio planning and reconciliation found 96,358/96,358 playback
transcripts available, with no missing recordings, unlinked new recordings,
broken aliases, broken pronunciation references or removed originals. No audio
objects, aliases or image mappings were written by the optimization release.

The integrated test run exposed Windows CRLF conversion of the supplied-image
approval manifest. Its committed bytes already match the approved SHA-256.
A targeted `.gitattributes` rule now preserves LF on checkout; the original hash
assertion and approval are unchanged, and all four supplied-media tests pass.

Release checks run in a clean managed checkout, excluding unrelated local
capture scripts, profiles and scratch files. The deployment doctor reported no
failures or warnings. Secret hygiene passes in that clean checkout. A dependency
audit found one moderate advisory and no high-severity finding. Full pre-push,
CI and exact deployed-revision checks remain mandatory before reporting live.

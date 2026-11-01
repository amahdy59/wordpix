# Quality audit follow-up — 2 November 2026

This work follows the audit of release 0.1.107 at
`246b456be73b84e4fab1e0b8bb02575751a9f142`. The source checkout includes unrelated
capture scripts and a pre-existing offline-size derivative change. They are not
evidence of this work.

## Implemented scope

- Visual review tooling recognizes only the exact already-approved supplied-image
  batch, matched to its canonical bytes, runtime bindings and publication receipts.
  The superseded supermarket reuse proposal is validated as history and excluded
  from new assignment proposals. Original decision/checkup ledgers stay unchanged.
- Dashboard/checkup reports distinguish current reviews, approved supersessions,
  missing historical contexts, and stale current reviews. Stale reviews cannot
  approve the current picture. Duplicate records still fail; the strict validator
  still rejects unapproved URL/content changes.
- The focused skip link has a 44 CSS px minimum in each dimension and a 3 px
  focus outline. Conversation action footers stack below 360 px; Hadith bottom
  navigation uses one column below 360 px. Existing state transitions remain.
- The new WebKit check also reproduced short inline vocabulary targets in the
  Hadith translation at 200% text. Shared interactive passage words now use
  inline-flex with an explicit 44 px minimum in each dimension, preserving their
  meaning-dialog actions and labels.
- The library-1 editorial export has 15 concrete bilingual example drafts and
  useful collocations. Its reading/goal now reflect the existing runtime lesson.
  Edited records are marked Needs review, not approved. Runtime lesson text,
  Arabic target labels, recordings, image mappings and approval ledgers are unchanged.
- Reusable measurement helpers reject zero-duration fallbacks, test either short
  touch-target dimension without rounding, and compute summaries from observations.
  The new local profiler records top script transfers and main-thread tasks in
  both interface languages. No keyword score constitutes visual approval.

## Corrections to the handoff

The old journey harness used `width < 44 && height < 44`, missing wide/short
targets. Its recorded small target was reproduced as the skip-to-content link;
the common Back/Close components already enforce 44 px. New browser coverage
checks the focused link, narrow course layouts and automated accessibility rules.
These checks do not establish complete WCAG AAA conformance.

The historical performance file contains 24 lesson observations plus 12 audio
observations. Its actual cold audio medians are 1,108 ms desktop and 1,153 ms
mobile; warm medians are 65 ms and 139 ms. The hardcoded narrative's smaller
values are unsupported. The probe measures the playing event, not audible speech.

The visual harness assigned semantic checkboxes from existing holds and selected
candidates by keywords. It also reused old dimensions/digests after failed GETs.
Those records are historical triage, not fresh pixel or served-byte approvals.
Use successful current GET digests and full-image/context inspection for any new
proposal. Historical files are retained intact.

Run `pnpm run quality:handoff:audit` to generate corrected raw summaries and
live read-only image evidence. Run `pnpm run quality:readiness` against the local
production preview to repeat three cold/warm observations per locale/profile.
Outputs live in `output/quality-followup-2026-11-02/`.

## Performance findings

A fresh 24-observation run of the existing production build measured camping-site
picture-readiness medians of 10,712 ms cold / 4,235 ms warm in English, and
11,606 ms cold / 4,050 ms warm in Arabic under 150 ms latency, 1.024 Mbps
download and 4x CPU slowdown. This is browser emulation, not a physical device.

The first cold mobile runs transferred 726,863 bytes of scripts in English and
773,073 in Arabic. The largest observed transfers included the application entry
(96,866 bytes), course-lessons (87,084), curriculum-audio-manifest (85,705),
vendor-deps (74,087), and vendor-storage (57,378). The complete traces include
main-thread tasks and exactly which unit media was requested.

This points to shared startup/course/audio costs for the next bounded experiment.
Hover-preloading one small unit table cannot make the whole cold visit equivalent
to a warm reload; no such performance claim or unmeasured runtime preload is added.
Measure a proposed shared-payload split against this baseline with offline,
recording-selection and unit-isolation checks before adopting it.

## Exact R2 scope and conflicts

The hard constraint in AGENTS.md keeps R2 objects and content-to-URL mappings
read-only. "Apply all recommendations" does not specify an exception authorizing
new uploads or changing these bindings.

### Five weather pictures: zero uploads required

The following files are listed in localAssetOverrides.json, intentionally served
from the application origin, and return HTTP 200 there. Read-only GET comparison
confirmed their bytes match public/ copies. Both unprefixed and images/v1-prefixed
R2 URLs return 404; neither R2 URL is needed by the current resolver.

| Local file under public/scene-images/ | Current deployed path                                      |
| ------------------------------------- | ---------------------------------------------------------- |
| seasons-weather-1-usage-scene-1.webp  | /wordpix/scene-images/seasons-weather-1-usage-scene-1.webp |
| seasons-weather-1-usage-scene-2.webp  | /wordpix/scene-images/seasons-weather-1-usage-scene-2.webp |
| seasons-weather-1-usage-scene-5.webp  | /wordpix/scene-images/seasons-weather-1-usage-scene-5.webp |
| seasons-weather-2-usage-scene-5.webp  | /wordpix/scene-images/seasons-weather-2-usage-scene-5.webp |
| seasons-weather-3-usage-scene-1.webp  | /wordpix/scene-images/seasons-weather-3-usage-scene-1.webp |

Moving these files to R2 would be an optional hosting migration: upload verified
copies, verify bytes/CORS, and change the explicit local routing exception.
That changes effective URLs and offline cache identity, so it is outside this
read-only repair. There is no need to do it to fix the reported 404s.

### Supermarket picture: zero uploads or runtime remaps required

For demand-ab347eecedc5bcf3991f1021 ("Staff stock the shelves."), three historical
identities must stay distinct:

1. Original source: question-images/v2/sentence-supermarket-21-stock-fd4281a7ff/1219e3c901f7f3abe2a0778031274fbbf61923ed4424dac13b78b1a3c13e2b61.webp
2. Earlier reviewed reuse proposal/checkup: question-images/v2/sentence-supermarket-22-stock-clerk-51eb79d141/4873bdab09e3e7273bed9df2ea1302f0788c1d56376334ebbbaa9c8a39a47f95.webp
3. Already-published supplied overlay: question-images/v2/supplied-20261030/7e76c8e3e80c7411ae53d03cd15fef5f483fb5fa1c3bc2e6f6f0bad7a6d6f39a.webp

The October 30 authorization covers exactly 68 immutable files and 34 contexts.
It already authorizes item 3; it is not a general exception for new media.
Rewriting old ledger URLs would falsely attach prior review evidence to new
bytes. The repaired tools preserve all three identities and recognize item 3
through its existing batch approval and publication receipt.

### Audio candidates: review before an additive publication plan

- project: audio/be/be71e1a2cb15d5c95ca9d2e485b3b1f1621bffdd30ed30b93006d94f51fb83c0.mp3
  has a reported 1.48 s leading-silence signal. Human listening must confirm the
  boundary before trimming a local candidate. No source object was changed.
- Hadith 30: audio/8b/8b5498dbae9bcc80b3ca6622903a4389d3277de3e974e1638e6a8ce68b0566ae.mp3
  has a reported -37.08 dBFS RMS signal. Compare loudness and intelligibility with
  the other served recitations before selecting gain; the handoff contains
  inconsistent suggested RMS targets. No normalization target is approved.
- Present/Project/Contract: missing phoneme markup is not evidence of incorrect
  speech. Listen and establish the lesson's intended sense first. Global exact-text
  overrides cannot distinguish noun/verb senses of an identical isolated label.
  Changing synthesis markup can also change the derived audio key.

A future authorized audio repair needs locally reviewed bytes, exact transcript/
voice/profile, old/new key and digest, every affected alias/recording selection,
human reviewer and date, public GET/CORS checks, and replay/offline-reload evidence.
Preserve original objects; never overwrite or delete them. The audio key hashes
text/profile, not the MP3 bytes, so an additive repair requires an explicit
versioned selection/alias design rather than replacing bytes under the same key.
No repaired audio bytes or new destination keys are invented in this change.

### Held library visuals

The ten library replacement candidates remain unapproved. Some keyword results
(for example planets for encyclopedia) may reproduce the original teaching
mismatch. Inspect the full image, source digest, crop, prompt, distractors and alt
text before deciding reuse/new art/text-only. Reusing an existing R2 image needs
no upload, but changing a content-to-image association is still a mapping change.
New art and responsive derivatives require new immutable uploads plus separately
reviewed display bindings. Existing holds must remain effective through fallbacks.

## Pending human evidence

- Complete the existing physical Android TalkBack, iPhone VoiceOver, interruption,
  airplane-mode/reconnect and storage-pressure checklist. No physical device was
  operated by this change.
- Listen to the existing 30-clip batch; retain keep/repair/hold decisions with
  exact served hashes and reviewer/date. Signal analysis alone approves no clip.
- Review the library English/Arabic drafts, then run the existing adult delayed
  transfer protocol. The ledger remains 87/200 vocabulary units read, with zero
  complete lesson approvals; no participant results are inferred.

Release 0.1.108 is prepared locally with bilingual release history. Publication,
new R2 uploads and remapping are not performed by this work.

## Final verification

- TypeScript passed. The final full Vitest run passed 204 files / 3,278 tests
  with two workers. An earlier unbounded run flagged the Arabic release-history
  test and was stopped; all four release-history cases passed in isolation,
  followed by the complete successful bounded run. Assertions were unchanged.
- Full ESLint passed after the inline vocabulary fix.
- Media integrity passed all 49 tests; 21 active assignment proposals validated.
  The superseded supermarket proposal is excluded from application proposals.
- The supported WORDPIX_READ_ONLY_MEDIA=1 verification build passed, followed by
  bundle and route budgets. A normal build's large unchanged-media copy was
  stopped; this verification output is not a complete release packaging claim.
- All 36 browser cases passed across Chromium, mobile Chrome and mobile WebKit,
  with one worker and retries disabled. These include English/Arabic 320 px,
  200% text, target sizes, skip-link focus, automated accessibility rules and
  existing Conversation/Hadith journeys. The earlier run's two WebKit failures
  reproduced the inline word-button defect before its fix.
- The final live GET/hash audit confirmed all five weather files match their
  application-origin copies. Protected media manifests, approval ledgers, holds,
  pronunciation overrides and the runtime library lesson are unchanged from HEAD.

Raw evidence is in output/quality-followup-2026-11-02/: browser.log (initial),
browser-final.log, unit-final.log (stopped), unit-bounded-workers.log,
lint-final.log, build-final.log, budget-final.log, readiness.json and
handoff-reconciliation.json. Physical-device, human listening and learner
calibration evidence remains pending as listed above.

## Additional release-readiness review

The recorded-audio fingerprint initially became stale because its source digest
includes UI and editorial files. A fresh read-only recording plan and complete
LIST/HEAD/GET reconciliation found the same 96,358 transcripts and selected keys
as the previous plan. No recording was generated, uploaded, relinked or removed.
Only recordedAudioCoverage.json was refreshed with current evidence. The strict
recorded-audio release gate then passed.

The platform audio manifest audit, all 24 image-generation safety tests,
curriculum/scenario/search shard checks and deployment doctor passed. The doctor
describes the existing live release, not deployment of this branch. The dependency
audit found one moderate advisory and no high-severity findings.

The full-workspace secret scan flags an AWS-access-key pattern in the pre-existing
untracked scripts/figma_file_data.json. It was not displayed, modified or staged.
A separate scan of tracked/staged files passed. The untracked capture files and
the pre-existing offlineTextEstimates.json modification remain outside this
change. The complete pre-push pipeline (including the full 567-case browser
suite), clean release packaging, review and publication are still required
before a production release; the focused 36-case browser result above does not
claim those additional gates passed.

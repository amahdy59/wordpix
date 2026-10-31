# Next steps: learning, audio and visual quality

Updated 31 October 2026. This is the ordered follow-up plan after unit-scoped
usage-media loading. Tests, file coverage and review samples are evidence of
specific properties, not a declaration that every recording and picture is
perfect. Each completed batch needs reproducible evidence and an explicit scope.

## Current baseline

- The usage-media split preserves the existing merged scene results, reviewed
  descriptions, fallback chains and corrections. Measured cold mobile picture
  readiness improved from 14.0 to 10.7 seconds in the recorded three-run sample;
  cold JavaScript transfer fell about 29%. Desktop cold readiness did not improve
  in this small sample. See `USAGE_LOADING_OPTIMIZATION_2026-10-31.md`.
- The newer supplied-image release has 34 exact contexts, 68 responsive files
  and 142 reviewed display holds. Keep these decisions and their exact-content
  guards. Older mismatch queues and the earlier 17-context repair report are
  historical evidence, not a current replacement count.
- Recorded-audio reconciliation establishes available exact transcripts and
  intact aliases/originals. The accepted 66-clip listening sample does not approve
  every recording. Recompute the current count after any source change; do not
  treat an older 96,358/96,359 count as a permanent target.
- Main navigation, curriculum boundaries, unit-scoped progress and all original
  R2 objects/URL mappings remain protected. This plan authorizes no new media
  uploads, replacements or remapping.

## Ordered work

| Order                          | Work and owner role                | Concrete next action                                                                                                                                                                                                                                                                     | Completion evidence                                                                                                                                                                                                                                                         |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Release validation         | Engineer / device tester           | Verify the deployed commit and release notes. On a physical Android phone, tablet and iPhone/Safari, finish one lesson in English and Arabic, replay audio, prepare a unit, reload offline and reconnect. Test interruption and storage pressure without losing progress.                | Device/browser/version, commit, locale, network and result recorded for each journey; defects reproduce with exact unit/stage/transcript/image identity.                                                                                                                    |
| 2 — Audio listening quality    | English/Arabic language reviewer   | Review small stratified batches: pronunciation overrides, specialist terms, numbers, long passages, Arabic controls and phrase boundaries. Prioritize learner-reported problems and previously flagged items not covered by acceptance. Listen to the actual served recording.           | Exact transcript/key, served digest, reviewer/date and findings for pronunciation/stress, intelligibility, clipped edges, pauses, noise and level consistency. Every reviewed clip has keep/repair/hold disposition; automated ASR flags alone cannot approve or reject it. |
| 3 — Visual teaching accuracy   | Content reviewer / visual reviewer | Refresh runtime demands and join current holds to current content. Review foundation/high-traffic units first. For each use, check subject, action, count, spatial contrast, answer cues, crop and alternative text. Search existing artwork before proposing new art.                   | Exact content revision and served image digest; explicit keep/reuse/replace/text-only/repair decision. Held images cannot reappear through fallback. No queue count is treated as an approved generation order.                                                             |
| 4 — Inclusive interaction      | Accessibility reviewer             | Walk correct/incorrect/retry/auto-advance using TalkBack and NVDA/VoiceOver. Check audio focus, one intelligible result announcement, keyboard focus return, 200% text, Arabic direction, reduced motion and portrait/landscape. Measure contrast on final composited feedback surfaces. | Criterion-specific evidence and failures in the WCAG audit register. Automated axe and token tests supplement manual review; they do not establish AAA conformance.                                                                                                         |
| 5 — Complete lesson quality    | Curriculum/editorial reviewer      | Review a bounded foundation-unit batch end to end: English and Arabic meanings, natural sentences, distractors, model answers, pictures and matching recordings. Then run delayed transfer sessions with adult learners.                                                                 | Named lesson approvals and revision evidence; recognition, comprehension, guided production and independent transfer results. Refresh `check_content_readiness.mjs` counts before assigning the next batch.                                                                 |
| 6 — Next performance iteration | Engineer                           | Repeat the same cold/warm profiler after this release. Add Arabic, a slower physical Android device and representative long lessons. Trace remaining JavaScript/CPU/image cost before splitting more code or changing caching.                                                           | Multiple comparable samples with transfer bytes, readiness, interaction completion and errors. Keep URL/selection/offline parity tests and existing budgets. Do not consolidate streaming/cache audio requests without proving immediate playback and persisted reload.     |

## Batch workflow and decision rules

1. Pin the current application commit and exact content. Refresh read-only
   reports with `media:catalog`, `media:review`, `media:checkup`, and current
   recorded-audio reconciliation. Preserve timestamps and source fingerprints.
2. Select a small batch with an owner and acceptance criteria. Keep unmatched
   reports, purpose questions, missing assignments and confirmed defects separate.
3. Inspect the actual served bytes at useful resolution or listen to the whole
   recording. Review alternate text alongside the assessment, not in isolation.
4. Repair language before proposing matching media. If wording changes, identify
   every spoken sentence, blank fragment and passage affected before publishing.
5. Present exact replacement/reuse proposals for approval. The read-only R2 rule
   remains in force unless the user explicitly authorizes a narrowly specified
   exception. Retain originals and historical review evidence.
6. Validate typecheck, tests, lint, media invariants, audio readiness, build and
   browser/offline journeys; then release through the normal gates and verify live.

## Sources of truth

- `docs/media/PERFORMANCE_IMAGE_FOLLOWUP_2026-10-30.md` — latest supplied-image,
  active technical triage, holds and mobile sample.
- `docs/media/ACTIVE_IMAGE_TRIAGE_2026-10-30.json` and durable review ledgers —
  exact reviewed findings; refresh against runtime before scheduling replacements.
- `docs/media/REVIEW_WORKFLOW.md` — image review and candidate approval rules.
- `docs/RECORDED_AUDIO.md` and `recordedAudioCoverage.json` — playback coverage,
  reconciliation and immutable recording safeguards.
- `docs/APP_REVIEW_IMPLEMENTATION_2026-10-23.md` — remaining hosted sync,
  physical interruption and editorial validation.
- `docs/WCAG_2_2_AUDIT_REGISTER_2026-10-09.md` and
  `docs/16_CONTEXTUAL_LANGUAGE_LEARNER_TEST_PROTOCOL.md` — manual evidence.

The first next task after release is the physical-device audio/offline/visual
journey matrix. Its defects should determine the next repair batch, rather than
another broad visual redesign or unreviewed bulk media generation.

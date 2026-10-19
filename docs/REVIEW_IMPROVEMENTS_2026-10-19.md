# Learning, UX and performance review implementation — 19 October 2026

This release addresses the software work from the 20-item site review. It does not claim validated CEFR placement, measured improvements in learner retention, or WCAG AAA conformance.

| Review                   | Result                                                                                                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Placement              | Optional 15-question starting guidance samples reading, sentence use and listening from basic to advanced. Results are provisional, transcript use is disclosed, and manual A1–C1 choices remain available. C2 stays a target distinct from available coverage. Production self-checks remain unscored.  |
| 2 Review scheduling      | Home, Practice and Profile share timestamp-based eligibility, lapse ordering and local-day labels. Open views refresh each minute and on return.                                                                                                                                                         |
| 3 Library semantics      | Native word-detail, audio and unit buttons are siblings in an article; key events cannot activate a clickable parent.                                                                                                                                                                                    |
| 4 Bilingual search       | A generated, deferred index contains labels, Arabic meanings and unit identities only. Exact matches rank first, senses remain unit-specific, all matches count, and word results paginate.                                                                                                              |
| 5 Resume                 | Submitted attempts reconstruct the next unanswered drill item and bounded retry queue. The current vocabulary word, partial sentence, story position/answers and authored reading cluster/answer are saved locally under their unit/session. Completed sessions remove only their own stage checkpoints. |
| 6 Accessibility evidence | The existing criterion register remains authoritative. Automated bilingual/theme/reflow and enhanced-contrast coverage is expanded; physical assistive-technology and complete-process manual evidence remain open.                                                                                      |
| 7 Shortcuts              | A device preference disables character shortcuts in global navigation, search and numbered exercise shortcuts. Native control activation and standard navigation remain available.                                                                                                                       |
| 8 Scaffolding            | Target level and demonstrated production evidence choose supported/guided/independent presentation. Advanced targets alone do not remove support; an independent learner can reopen meaning clues or bilingual presentation. Mandatory context and transfer evidence remain intact.                      |
| 9 Session size           | Unit entry distinguishes the current five-word session from the larger group. Existing stage/item labels and estimates remain visible.                                                                                                                                                                   |
| 10 Daily plan            | Suggested vocabulary follows the learner's chosen minutes instead of a fixed ten-word target. It is explicitly a suggestion, not measured time studied.                                                                                                                                                  |
| 11 Path milestones       | A next-unit outcome and phase/difficulty explanation precede a disclosed catalog-wide total. Curriculum order is unchanged.                                                                                                                                                                              |
| 12 Lesson layout         | Image height is bounded by viewport height, with smaller minimum heights so the word and controls have room on short screens.                                                                                                                                                                            |
| 13 Hierarchy/Profile     | The recommended unit uses a neutral card with a prominent primary action. Profile labels target level explicitly and distinguishes the progress glossary from skill evidence.                                                                                                                            |
| 14 Links                 | The five primary destinations use native hash links with current-page semantics and browser modifier-click behavior. Word browsing has a validated unit/group route that survives offline reload. Library unit cards open reference rather than starting a lesson.                                       |
| 15 Search hydration      | Only visible word results hydrate; requests use two-unit batches, preserve unit-specific keys, ignore stale results and expose retryable failures.                                                                                                                                                       |
| 16 Payloads              | Generated curriculum data reuses group word-ID lists only after proving identical values/order. Eager screens use direct component imports; placement is deferred. Required compressed entry/route totals join existing per-file budgets.                                                                |
| 17 Cache policy          | Immutable app files and explicit text downloads are cache-first. New runtime media caches have a 200-entry bound. Authenticated requests bypass this cache. Readable cached full recordings can satisfy byte ranges; partial responses are never cached. Previous offline content is retained.           |
| 18 Prefetch              | At most two upcoming words are warmed, Save-Data and slower effective connections are respected, and completion guards are bounded and lesson-specific.                                                                                                                                                  |
| 19 Offline preparation   | A unit selector, approximate source-size allowance, browser storage information, progress, cancellation and retry precede the existing whole-catalog option. Prepared text, cached images and unconfirmed audio have separate descriptions. No complete-media-download promise is made.                  |
| 20 Measurement           | Opt-in device diagnostics record governed, bounded learning/timing events and standard Web Vitals. They exclude answers, recordings, identifiers and URLs, remain local, expire after seven days, and can be exported/cleared. No analytics endpoint or automatic transmission is introduced.            |

## Media integrity

R2 objects, canonical media manifests, image selections, URL resolvers and content-to-media mappings remain unchanged. No R2 mutation commands are used. Build/release commands use `WORDPIX_READ_ONLY_MEDIA=1` to avoid thumbnail rewriting, output cleanup and recopying the media corpus. A local SHA-256 snapshot covers 61,596 media/manifest files, with a comparison after verification. Generated search data intentionally excludes all image/audio fields. Curriculum generation checks preserve canonical values and ordering, including media fields.

## Measurement and practical limits

`web-vitals` is the only new runtime dependency. Its standard, deferred build provides correct lifecycle/percentile semantics for LCP, INP and CLS instead of an approximate custom observer. It loads only after diagnostics consent. Existing local build baseline: 2,127,471 raw bytes / 606,608 gzip bytes across the entry's 11 script/preload files. Post-change sizes and actual check results are recorded in the release validation record; local build sizes do not establish field performance.

Route budgets include statically required JS dependencies, deduplicated per route. They exclude optional dynamic activities/media. Source-size offline estimates are approximate and include a conservative shared-shell/passage allowance; transfer sizes depend on compression/cache, and browser storage may be reclaimed. Cached text readiness is local to the browser. Reopen the selected unit before disconnecting.

The starting check is authored guidance informed by CEFR descriptors, not a calibrated assessment. Transcript alternatives support reading-based guidance without claiming listening evidence. Representative adult English/Arabic learner testing should validate starting recommendations, estimated effort, abandonment, exact-item resume, delayed recall and independent production before claims of learning gains.

Diagnostics measure active-page start/completion transitions, resume, departure from an unfinished session, delayed-review attempt totals, media failures, route fallback duration, search rendering and Web Vitals. An unfinished-session departure is not proof that a learner abandoned their goal. Duration buckets are page dwell time, not certified engaged study. There is no population baseline until learners opt in and voluntarily share an export. Local diagnostics consent never enables network assessment or changes its separate recording consent.

## Accessibility evidence and outstanding validation

The criterion register in `WCAG_2_2_AUDIT_REGISTER_2026-10-09.md` covers all active criteria and remains open. Browser checks can establish particular automated/keyboard/layout outcomes only. They do not replace:

- NVDA/VoiceOver and speech-input evaluation of complete learning, authentication and recovery processes.
- Physical mobile orientation, zoom, text-spacing and focus-obscuration checks across every interactive state.
- Human equivalence review of all captions, transcripts, image alternatives and relevant AAA media requirements.
- A complete 7:1 normal-text / 4.5:1 large-text state matrix, 44px target review subject to criterion exceptions, and focus visibility/appearance checks (2.4.12 and 2.4.13 respectively).

## References

- [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Council of Europe CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions)
- [Google Web Vitals](https://web.dev/articles/vitals)
- [Standard web-vitals library](https://github.com/GoogleChrome/web-vitals)

# Pronunciation improvement plan

Date: October 13, 2026. Status: proposal; no implementation or audio correction claimed.

## Objective and sequencing

Give every lesson target a fair listening and speaking check, actionable feedback, and a short route back to practice. Keep one clear action on screen and a consistent adult-focused lesson experience.

Begin implementation after the other session finishes and its push is confirmed. Re-read the resulting code and Git status first: this review used a working tree containing ongoing changes. Do not overwrite that work. This document is a planning artifact, not a shipped software update.

R2 assets and all content-to-audio/image mappings are read-only. Auditing and documenting defects are within scope. Replacing, uploading, deleting, renaming, or remapping those assets is outside this modernization plan under the project guardrail. A confirmed defective source clip must remain an explicit blocker for affected scored activities until resolved through a separately permitted asset workflow. Never quietly teach or score against it.

## Findings from the current code

- The current pronunciation catalog has 68 lessons in eight chapters. The vocabulary path remains separate.
- `FigmaPronunciationLessonScreen.tsx` presents preview, listen, meaning, use, and transfer with `TRIALS = 3`. Twelve scored choices per lesson do not establish an explicit per-word coverage guarantee.
- `PrivateRecordCompare.tsx` wraps local recording and self-reflection. Recording is optional in use/transfer stages; it does not currently provide an acoustic pronunciation assessment.
- The shared `useSpeechRecognition.ts` computes text similarity and calls it accuracy. `calculateAccuracy('pinned', 'pin')` would return 95 through substring matching; `transcriptMatches('pinned', 'pin')` would return true. One-character tolerance also accepts close contrast words such as pin/pen. These are static code findings, not executed test results. This helper is used by other speaking exercises; it is not the current private recording component.
- The audio manifest contains capitalized `Pin` and lowercase `pin` clips, both with matching synthesis text. The manifest does not establish what either clip actually sounds like. No clip was listened to in this review, and the reported pin/pinned audio defect is not yet confirmed.
- Lesson playback passes a pronunciation manifest object key, whereas shared record/compare model playback calls `useAudio.speak(modelText)` without that explicit key. Audit the resolved sources before concluding they differ audibly.
- The transfer selector can return an existing same-speaker clip when no distinct speaker exists. Such a trial must not be described as a new-speaker assessment without verification.
- New decluttering work already provides compact navigation, spoken answer feedback, resume, optional help, and opt-in automatic continuation. Preserve those benefits.

## 1. Establish trustworthy content and audio

Create a read-only audit inventory for every lesson target and contrast: stable target ID, displayed word/phrase, intended sound and stress, accepted variants, teaching role, lesson usage, existing source keys, fallback source, and review status. Keep this report separate from runtime media mappings.

For each source used in a scored activity, check availability, decoding, nonempty audio, clipping, silence, truncation, unwanted trailing speech, word identity, stress, and model accent. Have a qualified reviewer listen to all scored clips; transcription tools may flag suspicious items but cannot certify sound accuracy. Start with pin/pen, final consonants, short isolated words, and words with different noun/verb stress.

Trace the reported pin/pinned issue across: displayed text → chosen existing clip → cache → played sound → learner recording → recognition result. Record which layer fails. Check normal and slow playback, capitalization paths, model replay in record/compare, and cached versus uncached playback. Do not relabel a genuinely wrong clip to conceal the issue.

Mark known defective or unverified assessment audio as unavailable for scoring through application quality metadata that does not change the media mapping. Offer another verified exercise or leave the item visibly pending; never count an unavailable item as mastered. Use verified existing audio consistently across teaching, comparison, and assessment. Device speech fallback must be distinguishable and must not silently become a validated assessment reference.

## 2. Guarantee coverage of every target

Define explicit target records and typed lesson activities instead of relying on an overall trial count or prose extraction. Each target should identify its word/phrase, phoneme or prosodic focus, contrast, accepted variants, feedback cues, existing media reference, and stable content ID. Phrase and stress lessons need phrase-level tasks rather than being reduced to isolated words.

Use the same core loop across lessons:

1. Learn: hear the model and understand the word or phrase; optional image and concise sound guidance.
2. Listen: independently distinguish the relevant contrast without answer-revealing support.
3. Say: record the individual word and receive supported feedback.
4. Use: retrieve it in a short meaningful phrase; use sentences for stress/rhythm objectives.
5. Review: revisit weaker targets and check retention later.

Break larger lessons into short sets with saved resume. Every required target receives listening and speaking opportunities, but avoid repeating every target in every stage. Preserve fresh transfer items until their first transfer check. Context-only images are not independent scored targets.

Show quiet coverage such as “6 of 10 words checked.” Keep listening evidence, assessed speaking evidence, self-reflection, completion, and mastery separate. A skipped or unsupported speaking check remains unassessed. Assisted retries do not erase first independent evidence. Lesson completion must not imply that all words were spoken successfully.

Persist per-target evidence with stable lesson/target/activity IDs, assessment version, attempt identity, assistance used, outcome, and review status. Retain the existing lesson IDs and historical progress through a versioned migration; never infer new speaking mastery from old choice scores. Resolve duplicate sync attempts without awarding progress twice. Adapt the existing review infrastructure so due pronunciation targets appear under Practice → Reviews due today.

## 3. Implement reliable automatic feedback

Separate transcription, recording quality, and pronunciation assessment in the data model and UI. Remove substring and tolerant spelling matching from strict word identity checks, particularly minimal pairs and word endings. Exact transcription can provide recognition feedback, but it still cannot establish phoneme accuracy or diagnose tongue placement.

Prototype a provider-independent scripted acoustic assessment interface using known reference words. Azure Pronunciation Assessment is a candidate because its documentation supports word, syllable, and phoneme results; en-US prosody assessment is documented for stress/rhythm work. Provider choice remains open pending short-word benchmarks, latency, cost, privacy, browser support, and agreement with qualified reviewers. Do not select a provider solely from its feature list.

Benchmark consenting adult learner recordings with human ratings, including Arabic-speaking learners, accepted English variants, close contrasts, added/omitted endings, low volume, noise, different microphones, and repeat attempts. Measure false acceptance and false rejection by target sound and learner group. Calibrate thresholds against these results rather than inventing a universal percentage for mastery.

Represent ready, recording, processing, usable assessment, uncertain result, no speech, noisy/clipped recording, permission refusal, offline, timeout, and service failure explicitly. Technical failures and unreliable recordings produce “Could not assess” with a practical next step, not a zero score. Cancel obsolete results when a learner changes word or leaves the screen. Stop model audio before recording and prevent feedback playback from entering the microphone.

Feedback should contain one result, one evidence-supported correction, and one next action. For example, an extra ending detected with adequate evidence can prompt “Try ending after the n sound,” with model replay and Retry. “I heard pen” belongs only to an actual recognition result; “You selected pen” belongs to a listening choice. Low confidence should say the result is uncertain. Show detailed sound/stress evidence only on request, using educator-reviewed bilingual cue templates. Generic AI-generated coaching must not invent acoustic findings.

Keep the current local record/compare mode available. Online assessment requires an explicit learner opt-in and an accurate explanation of where audio is processed; update the current local-only privacy copy accordingly. Use server-held credentials, bounded requests, rate limits, minimal retention, and no raw recordings or transcripts in analytics. Offline/self-reflection results must remain distinct from externally assessed results.

## 4. Improve visual design without clutter

Use a consistent lesson shell: compact title and progress, one current activity card, one short instruction, contextual playback, and one primary action. Place immediate feedback in the same card. Match control order, labels, spacing, image treatment, feedback colors, and loading/error behavior across lessons.

Keep IPA, mouth/tongue guidance, Arabic-specific hints, detailed sound results, full word lists, lesson outlines, and restart options behind clearly labeled disclosures. Helpful visuals should clarify a particular sound or stress pattern; decorative waveforms must never imply correctness. Avoid score dashboards, competing calls to action, automatic microphone starts, and celebratory overlays after every word.

Offer model versus learner replay, normal/slow playback that preserves pitch, optional reviewed articulatory diagrams, stress highlighting, and a concise end-of-set recap. Show the next useful practice target and genuine progress; defer gamification additions until learning quality is demonstrated. Target intelligibility and the taught contrast while accepting documented valid variants.

## 5. Responsive, bilingual, and accessible behavior

Use available space and content length to determine layouts. Start with one column on phones; allow two columns on larger screens only where comparison benefits. Avoid fixed card heights. Keep controls usable in landscape, with large Arabic text, and while the virtual keyboard is open.

Validate reflow at 320 CSS pixels and 400% zoom, 200% text enlargement, long labels, and both directions. Keep English words/IPA isolated left-to-right inside Arabic layouts. Sticky controls must respect safe areas and never cover focused content, feedback, or recording controls. Check physical iPhone Safari/VoiceOver and Android/TalkBack in addition to desktop Chromium, Firefox, and WebKit automation.

Use semantic tokens, 7:1 normal-text contrast, 44×44 minimum targets, programmatic labels, clear status text, reduced-motion guards, and visible focus. Check Focus Not Obscured (Enhanced), WCAG 2.4.12, separately from Focus Appearance, WCAG 2.4.13. Do not rely on color, sound, or animation alone. Announce recording and assessment transitions without announcing a timer every second. Provide equivalent instructions and an honest alternative when speaking is unavailable; alternatives must not be recorded as assessed pronunciation mastery.

## Delivery order and acceptance

| Phase | Deliverable                                                          | Acceptance condition                                                                                           |
| ----- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 0     | Confirm the other session's completed push and review its final code | Stable baseline and no overlap with ongoing work                                                               |
| 1     | Read-only content/audio audit and strict recognition semantics       | Pin/pinned defect classified; scored references reviewed; close spellings never treated as pronunciation proof |
| 2     | Target coverage, typed activity records, and persistent evidence     | Every required target is checked or explicitly pending; reload/reorder/sync preserve progress                  |
| 3     | Acoustic assessment prototype and feedback state machine             | Human-rated benchmark supports use; failures do not become learner errors; privacy opt-in works                |
| 4     | Consistent responsive lesson shell and targeted support              | Complete state coverage; bilingual keyboard/device walkthroughs; feedback remains readable at enlargement      |
| 5     | Adaptive review, context/transfer checks, and controlled rollout     | Review weak targets; verified transfer conditions; learning and usability evidence supports expansion          |

Pilot a vowel contrast, a final-consonant contrast, and a stress/rhythm lesson before expanding to all 68 lessons. Observe adult learners completing first practice, responding to feedback, refusing microphone access, and resuming interrupted work. Define rollout thresholds before testing for false pass/fail rates, word coverage, useful feedback, retry success, retention, abandonment, and assessment delay. Any benchmark that indicates unreliable phoneme feedback blocks that feedback type.

For each software implementation, run `npx tsc --noEmit`, then `npx vitest run`, then `pnpm run lint`; fix failures before the next gate. Add meaningful tests for pin versus pinned/pen, incomplete coverage, uncertainty, technical failure, stale responses, recording cleanup, duplicate evidence, resume, migration, and RTL/reflow. Run applicable browser/audio/accessibility checks and existing release build/bundle gates. Add English and Arabic release-history entries and regenerate `public/release-notes.json` for actual shipped changes. This planning document does not claim these checks were run.

Do not claim WCAG AAA conformance without a criterion-by-criterion audit. Do not claim corrected audio, validated speaking mastery, a new speaker, participant testing, or deployment without corresponding evidence.

## References

- [Microsoft: pronunciation assessment](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment) — dedicated assessment model, granularity, reference text, and prosody support.
- [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — narrow-layout and zoom validation.
- [W3C: WCAG 2.2 additions](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — focus criterion numbering.
- Project guidance: `docs/02_ACCESSIBILITY_WCAG_2.2_BASELINE_AND_ENHANCED_TARGETS.md`, `docs/05_COMPONENT_INTERACTION_AND_CONTENT_DESIGN.md`, `docs/08_STATE_DATA_OFFLINE_AND_SYNCHRONIZATION.md`, `docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md`, and `docs/RELEASE_NOTES.md`.

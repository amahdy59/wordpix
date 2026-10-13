# Focused practice and safer resume

This follow-up is isolated on `codex/learning-reliability`, based on
`1b93be1e`. The other chat owns the shared checkout's release, deployment,
CI, PWA and existing browser-test changes. Integrate this branch only after
that work settles, preserving its release history and fixes.

## Implemented

- Pronunciation persistence normalizes finite scores, stage bounds, safe
  counters and valid review dates. Unsupported session versions and
  contradictory unlock states discard the attempt, preserving historical
  scores and target evidence.
- New checkpoints include an authored target revision. Changed content,
  missing target IDs, impossible trials and outcomes for absent targets
  restart a fair attempt instead of carrying an answer into another question.
  Existing version-2 checkpoints remain compatible when their targets are valid.
- Business speaking uses the existing private recording lifecycle and bilingual
  controls. Its brief and self-check remain available; the recording panel is
  optional. Saved checklist values must belong to the current task.
- Conversation discussion/challenge and Hadith's active Review & Apply step keep the recorder
  behind a native disclosure. Closing any studio stops playback and recording;
  a pending microphone permission response cannot start a hidden recording.
- Shared reading glossaries show six terms first, with the remainder available
  through a keyboard-accessible disclosure. Authored prose is unchanged.
- Reading, vocabulary-card and studio playback failures have translated
  recovery instructions. Offline recovery appears only after failure: being
  offline alone never prevents playing cached audio. Reading and retry remain
  available. Existing loading, buffering, pause/resume and device-voice states
  remain distinct.
- The live vocabulary study and course vocabulary tables expose loading,
  playing and retry state with audio recovery instructions. Vocabulary-card
  audio buttons also expose these states. Their
  labels and speed control are translated; reveal motion respects reduced
  motion.

No audio/image manifest, content ID-to-URL mapping or R2 asset is changed.
Navigation, curriculum order and course completion gates are preserved.

## Automated checks

Run the repository gates in order:

1. `npx tsc --noEmit`
2. `npx vitest run`
3. `pnpm run lint`
4. `pnpm run build`
5. `$env:WORDPIX_E2E_PORT='6285'; npx playwright test e2e/learning-decluttering.spec.ts e2e/optional-help.spec.ts e2e/pronunciation-audio.spec.ts e2e/conversation.spec.ts e2e/hadith.spec.ts`

The new learning matrix exercises English/Arabic, light/dark, 390px normal
text and 320px at the app's 150% setting, keyboard disclosure operation,
44px controls, horizontal containment and axe checks. Normal browser runs
attach screenshots. Compare committed screenshots with:

```powershell
$env:WORDPIX_E2E_PORT='6285'
npx playwright test --config playwright.learning-visual.config.ts
```

Baseline generation uses the same command with `--update-snapshots`.
Inspect every changed image before committing. Baselines are platform specific
because browser glyph rasterization and system fonts differ. The dedicated
config avoids forcing a Windows baseline onto deployment's Linux renderer.
Remote font CSS is replaced only in the visual test fixture to stabilize
captures. Tests do not alter production assets or mappings.

## Device and adult-learner validation — pending human sessions

Automated accessibility checks do not establish full WCAG AAA conformance.
The following protocol is ready for actual VoiceOver/TalkBack users and
5–8 adult learners. No participant sessions have been conducted by this task.

Use one iPhone with VoiceOver and one Android phone with TalkBack. Repeat in
English and Arabic, light/dark, enlarged text and reduced motion. Record
device/browser versions and the tested Git revision.

Tasks:

1. Find a pronunciation lesson, answer a question, leave, and resume. Confirm
   the current target and answer are coherent.
2. Open Business speaking and identify its main task and next action. Open
   recording, deny permission, and continue using the brief and checklist.
3. Allow recording, then close its panel or leave the stage. Confirm the
   microphone indicator stops; reopen and replay any completed private take.
4. Read a passage, expand the remaining vocabulary and open a definition.
   Close it and confirm focus returns to its word.
5. Attempt uncached audio offline, read the recovery message, reconnect and
   retry. Repeat with a previously cached recording.
6. Navigate only with screen-reader gestures or keyboard. Confirm collapsed
   controls are absent from navigation and optional panels are discoverable.

For each task record: completion without assistance, mistaken taps, where
focus moved, whether spoken status was clear, whether the next action was
understood, and the learner's suggested improvement. Use anonymous participant
codes and aggregate observations; private recordings remain in the lesson.

| Device / participant code | Language / theme / text | Task    | Completed | Issue / observation |
| ------------------------- | ----------------------- | ------- | --------- | ------------------- |
| Pending                   | Pending                 | Pending | Pending   | Pending             |

Treat blocked navigation, an active hidden microphone, lost progress,
unreadable controls or incorrect announcements as issues to fix before
claiming that manual validation passed.

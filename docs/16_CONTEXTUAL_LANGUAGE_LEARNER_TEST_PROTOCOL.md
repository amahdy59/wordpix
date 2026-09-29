# Contextual Language Learner-Test Protocol

## Purpose

Validate that WordPix learners can recognize, understand, and use target language in new
situations—not merely repeat the example seen during teaching. Run this protocol for every
reference unit before its contextual-quality gate is raised and for a rotating sample of other
units each release.

## Participants

- Recruit at least five adult learners per tested CEFR band.
- Include Arabic-first learners and learners who use assistive technology.
- Do not combine results across bands; task difficulty and reading load are level-dependent.

## Session design

1. Teach one ordinary lesson without coaching beyond the product UI.
2. Test immediate recognition using a new image or paraphrased scene.
3. Test contextual comprehension with a short passage not used during teaching.
4. Ask for one guided sentence and one independent spoken or written response.
5. After 24–72 hours, ask the learner to use two lesson words in a different situation.
6. Ask what helped, what felt repetitive, and where the learner guessed rather than understood.

Never reuse the teaching sentence as the transfer test. Keep names, setting, syntax, and answer
position different while preserving the intended meaning.

## Measures

Record these separately for each target word:

- visual recognition;
- listening recognition;
- contextual comprehension;
- controlled production;
- spoken production, when enabled;
- independent transfer after a delay.

Also record time-on-task, requests to replay, incorrect distractor chosen, self-correction, and a
one-to-five confidence rating. Do not store raw learner speech or free text in analytics.

## Session record template

Use an anonymous participant code. Keep consent records outside product analytics.

| Field                | Allowed value                                                 |
| -------------------- | ------------------------------------------------------------- |
| Participant          | Anonymous code only                                           |
| CEFR band            | Pre-A1, A1, A2, B1, B2, or C1                                 |
| Unit and lesson      | Stable content IDs                                            |
| Assistive technology | Category or `none`; no device identifiers                     |
| Dimension            | One of the six measures above                                 |
| Target word ID       | Stable vocabulary ID                                          |
| Correct              | `yes`, `partly`, or `no`                                      |
| Confidence           | Integer from 1 to 5                                           |
| Replay count         | Non-negative integer                                          |
| Self-corrected       | `yes` or `no`                                                 |
| Time band            | `<15s`, `15–30s`, `31–60s`, or `>60s`                         |
| Observation code     | Approved misconception or accessibility code; no raw response |

Facilitators may keep temporary research notes under the approved research process, but those
notes must not be copied into telemetry, source control, or learner profiles.

## Pass criteria

A reference lesson is ready for broader rollout when:

- at least 80% of participants understand the target in an unseen context;
- at least 70% produce an understandable sentence without copying the model;
- no answer position, image cue, or repeated template explains the result;
- no critical accessibility blocker appears;
- Arabic support clarifies meaning without replacing the English task.

Any failed target returns to editorial review with the observed misconception, the misleading
context, and the question type that exposed it. Do not solve weak transfer by adding more isolated
flashcard repetitions.

## Reference-unit rotation

The automated audit currently treats `colors`, `farm`, `accessories-jewelry`, `airport`,
`3d-printer-lab`, and `architect-s-studio` as cross-level reference units. Replace a reference only
after its successor passes the same automated and learner-test gates.

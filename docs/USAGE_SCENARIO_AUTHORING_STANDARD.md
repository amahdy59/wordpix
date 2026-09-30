# Usage scenario authoring standard

Usage scenes teach learners what people actually say and do with a word. They are not vocabulary lists placed inside a generic sentence.

## Required content model

Every scene must:

1. Give the learner a recognizable adult purpose, such as making a choice, solving a problem, requesting help, understanding advice, or completing a task.
2. Show the target words doing different jobs in one coherent moment. If a group cannot form a natural moment, regroup the target words before writing.
3. Use natural collocations and high-frequency senses before rare, technical, figurative, or region-specific senses.
4. Make the context-check answer inferable from a concrete detail in the scene. Questions such as “Which target word best matches the key detail?” are not sufficient.
5. Stay readable at the lesson's core CEFR level. Optional “Level up” content can introduce an A2–C1 extension without making it necessary to complete the lesson.
6. Support an image that depicts the situation without labels or text and without revealing the assessment answer.

## Preferred scene shape

- **A1–A2:** 1–2 short sentences, one clear action, familiar setting, approximately 15–35 words.
- **B1–B2:** 1–3 sentences, a useful decision or consequence, approximately 25–55 words.
- **C1:** concise authentic professional, academic, or social context; avoid complexity that adds no learning value.

Names, settings, and roles should vary across a unit. Use inclusive adult contexts and avoid assuming a specific country, family structure, occupation, gender role, or purchasing power.

## Example correction

Weak:

> During the visit, the patient and medical team deal with eyelid, eyelash, and pupil. Each term belongs to a different part of the care process.

Useful:

> Amir notices an eyelash on his cheek before his eye test. "Keep your eyelid open, please," says the optometrist as she checks his pupil with a small light.

Context check:

> What does the optometrist check with the light? — **Pupil**

The revised draft provides a purpose and evidence for the answer. Its specialist vocabulary still needs a level review and, where necessary, a plain-English gloss.

## Editorial workflow for all units

1. Run `pnpm content:usage:relevance` to measure generic copy and reviewed lexical support.
2. Open `docs/usage-image-manifest.csv` and filter `production_status` to `content revision required`.
3. Check the unit's authored passage, dialogue, phrase examples, and collocations in `src/app/learning/units/` before writing new copy.
4. Regroup targets when their current three-word grouping cannot support a plausible scene.
5. Rewrite the scenario, check question, expected answer, options, image brief, and any dependent reading/exercise copy as one content transaction.
6. Have a second editor review naturalness, CEFR fit, usefulness, inclusivity, and visual feasibility.
7. Run `pnpm content:usage:manifests`. A clean automated audit means `editorial review required`, not approval. Record explicit editorial approval before generating an image. Existing `complete` rows indicate asset presence only.

## Sources and learning design

Use the [source and evidence policy](USAGE_SOURCE_AND_EVIDENCE_POLICY.md) for sense-level CEFR decisions, corpus checks, original example writing, optional higher-level extensions, and source attribution. Passing the template detector does not prove naturalness, frequency, accuracy, or CEFR suitability.

## Release gates

Do not approve a scene when any of these are true:

- it merely says people “deal with,” “use or discuss,” “notice,” or “connect” a list of words;
- removing the target words leaves a reusable template that could describe almost any lesson;
- the words do not naturally belong in the same moment;
- the question can be answered only by guessing the first option;
- a less common sense appears before the everyday sense without a clear reason;
- the image would need written labels to communicate the targets;
- the scenario changed after its image was generated.

The target is zero generic-template findings, zero answer/option mismatches, and 100% editorial approval before image production.

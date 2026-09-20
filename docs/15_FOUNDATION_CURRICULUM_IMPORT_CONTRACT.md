# Foundation Curriculum Import Contract

Use this contract when transferring the pronunciation curriculum from Figma into WordPix. It protects lesson order, learner progress, accessibility, and media integrity.

## Stable identifiers

- Give every stage, unit, lesson, model, and question a stable lowercase identifier.
- Never reuse an identifier for different content.
- Keep identifiers unchanged when copy, images, or audio are revised.
- Increment the curriculum schema version when a structural field changes.

## Required lesson fields

Each lesson must provide:

- stage and unit identifier;
- lesson identifier, number, title, short title, goal, and one concise instruction;
- prerequisite lesson identifiers when applicable;
- one or more teaching models;
- one or more questions with an answer key and two levels of support;
- interaction type;
- image and audio references;
- mastery threshold and completion behavior.

## Supported interaction contracts

- `listen-and-choose`: hear every numbered choice before selecting; reveal the correct picture after answering.
- `listen-and-select`: hear a target and choose a visible symbol, count, or letter.
- `read-and-choose`: read visible print, choose an answer, and reveal supporting media after answering.

New activity types require a reusable accessible component before content import. Do not encode layout instructions inside lesson copy.

## Media rules

- Concrete nouns use a relevant, unambiguous photorealistic image.
- Abstract concepts and isolated sounds are marked as symbolic instead of receiving a misleading photo.
- Images must be locally hosted, non-empty, and include an accessible description when the surrounding control does not already name them.
- Images of women must respect the product's Islamic presentation requirements.
- Existing audio files are immutable. Revised recordings receive new asset keys and never overwrite an older clip.

## Figma handoff checklist

For every lesson, provide:

1. Stable identifiers and intended sequence.
2. Goal, instruction, teaching examples, questions, answer keys, and support text.
3. Interaction type for each question.
4. Exact image and audio asset filenames.
5. Child-mode copy and optional adult-mode explanation.
6. Prerequisites and unit mastery check.
7. A list of intentionally symbolic choices that should not use photography.

## Import gate

Run:

```sh
npm run content:foundations:audit
npx tsc --noEmit
npx vitest run
```

The import is blocked by duplicate lesson placement, invalid answer keys, missing concrete-choice photos, missing local files, TypeScript errors, or test failures.

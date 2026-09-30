# Usage Batch 2 handoff

Batch 2 covers global lesson orders 21–40 and contains 20 curated Pre-A1
lessons with 95 usage scenes.

## Lessons

- Bedroom 4 — 5 scenes
- Bathroom 1–6 — 26 scenes
- Kitchen 1–5 — 24 scenes
- Living Room 1–5 — 25 scenes
- Fruits 1–3 — 15 scenes

The learner-facing scene text was rewritten around concrete adult situations.
Questions now ask about evidence in the situation rather than simply asking
which word appears in a picture. Readings and exercises were regenerated with
contextual-cloze, production, and transfer tasks.

## Image manifest

Use [usage-image-manifest-batch-02.csv](usage-image-manifest-batch-02.csv) as the
authoritative generation list. It contains one row per required image, including
the exact filename, target words, scenario, image brief, prompt, alt-text field,
question, answer, and options.

Save files under:

```text
public/learning-scenes/<unit-id>/<image-name>.avif
```

Image requirements:

- AVIF, at least 1200×900, 4:3 aspect ratio
- no visible words, numerals, labels, logos, borders, or watermarks
- show all target objects/actions naturally and clearly
- do not visually reveal the answer to the question
- keep important content centered for responsive cropping

Run the gate after adding images:

```bash
npm run content:usage:images:batch2:check
```

The batch is image-complete only when the result is `ready: 95`, `missing: 0`,
`invalid: 0`, and `extras: 0`. This handoff is editorial draft content; no
whole-lesson approval records have been created, and no R2 mappings were changed.

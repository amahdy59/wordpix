# Vocabulary review process

Use this process for every new or revised vocabulary batch. It combines automated quality gates with dictionary-backed editorial review.

## 1. Generate original learner copy

Write one short sentence for the sense shown in the image and taught by the unit. Use the existing rules in [`VOCABULARY_DEFINITION_STANDARD.md`](./VOCABULARY_DEFINITION_STANDARD.md). Do not copy Cambridge or Oxford wording, examples, or pronunciation notes.

## 2. Run the automated review

Review a unit or batch with:

```bash
npm run content:definitions:review -- park playground classroom
```

The checker flags placeholders, missing descriptions, missing final periods, capitalization, generated placeholder phrases, CEFR word-count violations, headword leakage, and duplicate definitions. It prints Cambridge and Oxford links for every flagged item so the reviewer can verify the exact sense.

Use `--json` when saving a machine-readable report:

```bash
node scripts/review_vocabulary_definitions.mjs --json park > review-park.json
```

The command exits non-zero for any non-placeholder finding. Placeholders are reported as migration debt and are allowed only while a unit is incomplete.

## 3. Verify the sense against dictionaries

For each completed definition, review the Cambridge and Oxford entry linked by the checker. Confirm:

- the noun, verb, or phrase sense matches the image and lesson;
- the definition does not accidentally use another major sense;
- specialist terms are accurate and explained simply;
- UK/US differences matter before adding regional wording;
- the CEFR level and learner wording are appropriate.

Dictionary pages are sources for verification, not text to copy. Record any deliberate sense decision in the batch review note when a word is ambiguous.

## 4. Review the learner experience

Before committing a unit, inspect its Study and Practice flows in English and Arabic, check the image beside the definition, and verify the assessment alt text. Check at 200% zoom and on a narrow viewport. Approve text before generating audio so later copy changes do not waste audio credits.

## 5. Release gates and commit

Run the focused content suite, then the repository gates:

```bash
npm run content:definitions:review -- <units>
npx vitest run src/app/__tests__/lessons_content.test.ts
npm run typecheck
npm test
```

Lower the placeholder ceiling by the exact number completed and add the units to the no-regression list. Stage only the intended unit files and test contract. Commit one validated batch, preserving unrelated worktree files.

## Review cadence

Use batches of three to five units for normal work. Ten-unit batches are acceptable only when split into independently tested commits. Stop the batch when a dictionary sense is ambiguous, a definition is generic, or an automated gate fails; resolve that unit before continuing.

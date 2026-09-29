# Contextual Language Editorial Rubric

## Goal

Every target word must be recognizable, understandable, and usable across meaningfully different
situations. A lesson is not complete because every word appeared once or because a learner matched
it to one picture.

## Required lesson structure

Each lesson MUST include:

1. A concrete scene in which every target contributes to the situation.
2. A reading or dialogue that reuses the targets for a communicative purpose.
3. A transfer setting with different people, purpose, or register from the teaching scene.
4. At least one inference, comparison, contextual completion, guided-production, and independent-
   transfer task across the lesson sequence.
5. At least two production opportunities, including one spoken option when speaking is enabled.
6. A contextual spaced-review prompt that combines current language with earlier language.

Do not count a glossary list, a label-only image, or a sentence such as “This is a …” as an
independent context.

## Target-word checklist

For every target, an editor MUST confirm:

- the meaning is clear without relying solely on Arabic translation;
- at least two context types contain the target, with a third planned for later retrieval;
- common collocations or grammatical patterns are modeled;
- examples differ in subject, setting, syntax, or communicative purpose;
- distractors represent plausible confusions rather than unknown words;
- model answers are natural, level-appropriate English rather than keyword lists;
- capitalization, countability, article choice, and register are accurate;
- Arabic support expresses the intended sense rather than transliterating avoidable English.

## Question-design mix

| Type          | What it tests                      | Weak version to avoid                                                |
| ------------- | ---------------------------------- | -------------------------------------------------------------------- |
| Meaning       | Core sense or reference            | Repeating the label shown in the image                               |
| Context cloze | Fit inside a meaningful sentence   | A sentence where every option is grammatically impossible except one |
| Inference     | Meaning derived from circumstances | Asking for a detail copied word-for-word                             |
| Comparison    | Boundary between related words     | “Are these different?” with no reason required                       |
| Production    | Accurate language for a purpose    | Copying the model sentence                                           |
| Transfer      | Use in a changed situation         | Reusing the same people, image, and syntax                           |

Correct-answer positions MUST vary. Runtime rotation is a safeguard, not permission to author every
answer in the first position.

## CEFR calibration

- **Pre-A1:** one-clause directions, concrete settings, strong visual support, short models.
- **A1:** familiar transactions and routines; linked clauses only when transparent.
- **A2:** simple explanations, preferences, comparisons, and predictable social situations.
- **B1:** reasons, consequences, travel or civic problems, and connected paragraphs.
- **B2:** professional decisions, trade-offs, precise explanations, and register awareness.
- **C1:** nuanced distinctions, specialist contexts, synthesis, and audience-sensitive register.

Higher levels require richer reasoning, not merely longer passages or rarer nouns.

## Release gates

A normal lesson MUST pass runtime schema validation and the curriculum contextual-diversity test.
A reference lesson MUST additionally:

- score at least 85/100 in the automated contextual-quality audit;
- place every target in at least two context types;
- include inference, comparison, production, and transfer tasks;
- include at least three open-response tasks;
- pass the relevant accessibility and browser-flow checks;
- pass the learner-test criteria before receiving `validated-with-learners` status.

Automated checks may assign `validated-in-code`. Only recorded participant evidence may assign
`validated-with-learners`.

## Rollout order

After reference units, prioritize editorial work by:

1. Pre-A1 and A1 lessons with the lowest contextual-quality scores.
2. High-frequency language and lessons that unlock later curriculum paths.
3. Targets appearing in only one context type.
4. Generic model answers, repetitive templates, or unnatural Arabic glosses.
5. Higher-level lessons whose difficulty comes from terminology rather than reasoning or register.

Improve coherent lesson batches rather than isolated words so scenes, reading, questions, and
review remain aligned.

# Curriculum Progression Architecture

## Standards spine

WordPix uses the CEFR Companion Volume's action-oriented model as the public
progression: learners complete purposeful tasks and demonstrate can-do
outcomes across reception, interaction, production, and mediation. English
Profile informs level decisions for individual meanings, phrases, and grammar
uses. GSE ranges provide finer-grained progress within a CEFR band. ACTFL 2024
is a secondary performance check, not a second learner-facing level system.

## Hierarchy

`course → level range → pathway → scenario unit → can-do outcome → lesson → activity`

A unit is a communicative scenario, not a vocabulary bucket. Existing Figma
subtopics remain content pools. `generateCurriculum` adapts those pools into a
stable action-oriented path and caps active vocabulary at eight items per
lesson. Low-frequency language remains available as optional extension or
reference content.

## Unit contract

Every unit design exposes:

- CEFR band and GSE range;
- unit archetype: place, concept, process, or specialist;
- an observable outcome and at least three can-do statements;
- language functions, grammar, pronunciation, and prerequisites;
- a final transfer task;
- a staged path from meaning to interaction, integrated use, and review.

The runtime model lives in `src/app/learning/curriculumModel.ts`. The foundation
recommendation order lives in `src/app/data/curriculumSequence.ts`, separate
from the thematic Explore catalogue.

## Progress and assessment rules

- SM-2 word memory is the canonical vocabulary mastery record.
- Study-path completion records activity progress; it projects SM-2 status and
  due dates rather than inventing a second mastery value.
- An exposure does not mean completion. Familiar or strong is required for a
  practice group to read as complete.
- Unit checkpoints sample across authored subtopics and require 80% with full
  sample coverage.
- Passing is provisional evidence for sampled objectives only. Untested words
  are never promoted, and sampled words still return through spaced review.

## Content authoring rules

1. Start with a real-world outcome, not a list of nouns.
2. Teach essential high-frequency language before enrichment.
3. Introduce no more than eight active items in one lesson.
4. Move from recognition to retrieval, interaction, and transfer.
5. Keep above-level texts optional and label their CEFR level explicitly.
6. Keep reference material ungraded.
7. Preserve audio text exactly when reorganising content; audio object keys are
   derived from the spoken text and must not be coupled to lesson ordering.

## Audio boundary

Curriculum ordering must not modify the Cloudflare/R2 asset host, hashed audio
URL generation, media streaming, IndexedDB warming, or browser-synthesis
fallback chain in `src/app/shared/useAudio.ts`. Audio remains a content-delivery
service independent of curriculum sequencing.

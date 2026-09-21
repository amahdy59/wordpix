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

## Learner path visibility and authoring status

The Learn screen exposes the complete general English unit route on request:
the 18 authored foundation units first, followed by every remaining general
English catalogue unit in module order. Specialist sections are visible at the
end as optional study and do not change the next-unit recommendation.

This is a complete _unit index_, not a claim that every unit has received the
same curriculum review. Foundation units have authored outcomes and final
tasks. Other units currently use archetype-based outcomes and broad catalogue
grouping. Before treating those later stages as a validated progression,
review each unit's CEFR fit, high-frequency active language, prerequisites,
scenario task, age appropriateness, and transfer assessment. Keep low-frequency
or specialist vocabulary available as extension rather than making it a gate.

When a unit lacks explicit priority tiers, the study adapter uses its existing
editorial 1–3 frequency metadata: 3 is essential, 2 is supporting, and 1 is
optional extension. Unrated words retain authored subtopic order. This is a
provisional teaching order, not a corpus-validated CEFR assignment. The learner
view marks unreviewed levels as suggested.

The review area presents the unit's final task and can-do checks. Completing
that activity records self-reported transfer practice only; it never awards
word mastery or claims that the learner's response was scored. Authored and
externally validated performance tasks remain a content-authoring priority.

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

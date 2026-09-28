# Phase 3 Implementation Plan — Authored Curriculum Expansion & Mastery Track

## Overview

Phase 3 expands the reviewed curriculum content with the next approved Stage 1 unit (**`colors`**, 40 words across 3 lessons and 8 five-word clusters) and establishes the foundational domain model and learning engine for the **Pronunciation & Spelling Mastery Chapter** per `WORDPIX_PRONUNCIATION_SPELLING_MASTERY_SPEC_v1.md`.

All Cloudflare R2 media mappings and content IDs remain 100% read-only and preserved.

---

## Task Breakdown

### Task 1: Author the "Colors" Curriculum Batch

- **Files**:
  - `src/app/exercises/content/colorsBatch.ts` (new)
  - `src/app/exercises/content/authoredLessonContent.ts` (register batch and export helpers)
- **Scope**:
  - Author `colors-1` (15 words: `red`, `blue`, `yellow`, `green`, `orange`, `purple`, `pink`, `brown`, `black`, `white`, `cyan`, `magenta`, `lime`, `teal`, `indigo`).
  - Author `colors-2` (15 words: `violet`, `coral`, `salmon`, `turquoise`, `lavender`, `light`, `dark`, `bright`, `dull`, `vivid`, `pale`, `deep`, `warm`, `cool`, `neutral`).
  - Author `colors-3` (10 words: `mix`, `blend`, `shade`, `tint`, `hue`, `saturation`, `gradient`, `rainbow`, `spectrum`, `pigment`).
  - 8 coherent 5-word clusters with micro-reading title, text, and deterministic retrieval questions.
  - Export `getAuthoredWord(wordId)` alongside `getAuthoredSentence(wordId)`.
- **Verification**:
  - `npx vitest run src/app/__tests__/curriculum_content_pipeline.test.ts`

### Task 2: Extend Pipeline Unit Tests for Colors Batch

- **Files**:
  - `src/app/__tests__/curriculum_content_pipeline.test.ts`
- **Scope**:
  - Assert that all 3 `colors` lessons (`colors-1`, `colors-2`, `colors-3`) are admitted and valid.
  - Verify word counts, 5-word cluster partitions, retrieval integrity, and sentence-builder access.
  - Verify total admitted words count increases from 50 (numbers) to 90 (numbers + colors).
- **Verification**:
  - `npx vitest run src/app/__tests__/curriculum_content_pipeline.test.ts`

### Task 3: Implement Pronunciation & Spelling Mastery Domain Types & Engine

- **Files**:
  - `src/app/learning/mastery/masteryTypes.ts` (new)
  - `src/app/learning/mastery/masteryEngine.ts` (new)
- **Scope**:
  - Zod schemas and TypeScript types for `MasteryWord`, `MasterySkill`, `MasteryLesson`, `MasteryUnit`, `MasteryLevel`, and `MasteryLearnerState`.
  - Poka-Yoke state transitions: `unseen` -> `introduced` -> `practicing` -> `mastered` / `struggling`.
  - Review queue calculator prioritizing struggling phonemes and spacing overdue mastery items.
- **Verification**:
  - Unit tests for state transitions and review queue calculation.

### Task 4: Author Initial Mastery Curriculum Data (Levels 1 & 2 Foundations)

- **Files**:
  - `src/app/learning/mastery/masteryCurriculum.ts` (new)
  - `src/app/__tests__/mastery_curriculum.test.ts` (new)
- **Scope**:
  - Populate Level 1 (First Sounds & Letters: s, a, t, p, i, n) and Level 2 (VC / CVC Word Building) with spec-mandated demonstration words (`cat`, `cap`, `cut`, `pen`, `pin`, `pan`, `hat`, `mat`, `map`, `tap`, `hen`, `ten`, `men`, `sit`, `set`, `sun`, `cup`).
  - Validate with `masteryLevelSchema` and test prerequisite integrity (no cyclical dependencies).
- **Verification**:
  - `npx vitest run src/app/__tests__/mastery_curriculum.test.ts`

### Task 5: Broaden Content Integration Bridge (Phase 4 Preparation)

- **Files**:
  - `src/app/shared/WordDetailsContent.tsx`
- **Scope**:
  - Use `getAuthoredWord(word.id)` to supply reviewed Arabic gloss and usage sentence directly into the word inspector modal and card views.
- **Verification**:
  - `npx vitest run src/app/__tests__/rich_passage_and_vocabulary_modal.test.tsx`
  - `npx vitest run src/app/__tests__/lexicon_and_inspector.test.tsx`

### Task 6: Full Verification Ladder & Quality Gate

- **Commands**:
  - `npx tsc --noEmit`
  - `npx vitest run`
  - `pnpm run lint`

import type {
  UnitLearningMaterials,
  BlankExercise,
  MultipleChoiceExercise,
  RewriteExercise,
  ErrorCorrectionExercise,
} from "../../types";
import type { VocabularyItem } from "../../../data/lessons";
import type { PracticeItem } from "./types";

export function stableShuffle<T>(array: T[], seed: number): T[] {
  const copy = [...array];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Builds a validated option set. Returns null when fewer than 2 distinct
 * valid distractors exist — caller excludes the item rather than emit nonsense.
 */
export function buildValidatedOptions(
  correct: string,
  candidateDistractors: string[],
  seed: number
): { options: string[]; correctIndex: number } | null {
  const normalized = correct.trim().toLowerCase();
  const unique = Array.from(
    new Set(
      candidateDistractors
        .map((d) => d.trim())
        .filter((d) => d.length > 0 && d.toLowerCase() !== normalized)
    )
  ).slice(0, 3);

  if (unique.length < 2) return null;

  const all = stableShuffle([correct, ...unique], seed);
  const correctIndex = all.findIndex((o) => o === correct);
  return { options: all, correctIndex };
}

export function buildPracticeItems(
  materials: UnitLearningMaterials,
  vocab: VocabularyItem[],
  attemptCount: number
): PracticeItem[] {
  const list: PracticeItem[] = [];
  let idCounter = 0;

  materials.blankExercises?.forEach((e: BlankExercise) => {
    const distractors = vocab
      .map((v) => v.label)
      .filter((l) => l.toLowerCase() !== e.answer.toLowerCase())
      .slice(0, 5);
    const result = buildValidatedOptions(e.answer, distractors, idCounter * 31 + 7);
    idCounter++;
    if (!result) return;
    list.push({
      id: `practice-b-${idCounter}`,
      type: "blank",
      data: e,
      answerText: e.answer,
      ...result,
    });
  });

  materials.additionalExercises?.multipleChoice?.forEach((e: MultipleChoiceExercise) =>
    list.push({
      id: `practice-mc-${idCounter++}`,
      type: "multipleChoice",
      data: e,
      answerText: e.options[e.correctIndex],
    })
  );

  materials.collocationsQuiz?.forEach((e: MultipleChoiceExercise) =>
    list.push({
      id: `practice-col-${idCounter++}`,
      type: "multipleChoice",
      data: e,
      answerText: e.options[e.correctIndex],
    })
  );

  // Rewrite -> MC (no reversed-sentence fallback — exclude if not enough distractors)
  const allRewrites: RewriteExercise[] = materials.additionalExercises?.rewrite ?? [];
  allRewrites.forEach((e: RewriteExercise, idx: number) => {
    const correct = e.answer;
    const candidates = [
      e.sentence.replace(/\s*\([A-Z]+\)\s*$/, ""),
      ...allRewrites.filter((_, i) => i !== idx).map((r) => r.answer),
    ];
    const result = buildValidatedOptions(correct, candidates, idx * 71 + 13);
    idCounter++;
    if (!result) return;
    list.push({
      id: `practice-rw-${idCounter}`,
      type: "multipleChoice",
      data: {
        id: e.id,
        question: `Rewrite using "${e.hintWord}": "${e.sentence.replace(/\s*\([A-Z]+\)\s*$/, "")}"`,
        options: result.options,
        correctIndex: result.correctIndex,
        explanation: `The correct rewrite is: "${correct}"`,
      },
      answerText: correct,
    });
  });

  // Error correction -> MC (no duplicate wrong-sentence padding)
  const allErrors: ErrorCorrectionExercise[] = materials.errorCorrection ?? [];
  allErrors.forEach((e: ErrorCorrectionExercise, idx: number) => {
    const correct = e.right;
    const candidates = [e.wrong, ...allErrors.filter((_, i) => i !== idx).map((ec) => ec.right)];
    const result = buildValidatedOptions(correct, candidates, idx * 53 + 7);
    idCounter++;
    if (!result) return;
    list.push({
      id: `practice-ec-${idCounter}`,
      type: "multipleChoice",
      data: {
        id: e.id,
        question: `Which sentence is correct?`,
        options: result.options,
        correctIndex: result.correctIndex,
        explanation: `The mistake was: "${e.wrong}"`,
      },
      answerText: correct,
    });
  });

  return stableShuffle(list, 42 + attemptCount * 7919);
}

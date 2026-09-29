import type { LessonExercise, LessonUsageData, QuestionType } from "./usageTypes";

export const CONTEXTUAL_REFERENCE_UNITS = {
  "Pre-A1": "colors",
  A1: "farm",
  A2: "accessories-jewelry",
  B1: "airport",
  B2: "3d-printer-lab",
  C1: "architect-s-studio",
} as const;

export type ContextSource = "scene" | "reading" | "question" | "production" | "transfer";

export interface TargetContextCoverage {
  target: string;
  sources: ContextSource[];
  occurrences: number;
}

export interface ContextualQualityReport {
  lessonId: string;
  unitId: string;
  cefrStage: LessonUsageData["cefrStage"];
  isReferenceUnit: boolean;
  targetCoverage: TargetContextCoverage[];
  questionTypes: QuestionType[];
  answerPositions: number[];
  productionTaskCount: number;
  readingWordCount: number;
  score: number;
  errors: string[];
  recommendations: string[];
}

function containsTarget(text: string, target: string): boolean {
  const normalize = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/\p{Mark}/gu, "")
      .toLocaleLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
      .trim();
  const normalizedText = ` ${normalize(text)} `;
  const normalizedTarget = normalize(target);
  const conceptAliases: Record<string, string[]> = {
    multiplication: ["times", "multiplied by"],
    division: ["divided by"],
    percentage: ["percent"],
    "acute angle": ["angle is acute", "acute"],
  };
  return [normalizedTarget, ...(conceptAliases[normalizedTarget] ?? [])].some((candidate) =>
    normalizedText.includes(` ${normalize(candidate)} `)
  );
}

export function inferQuestionType(exercise: LessonExercise): QuestionType {
  if (exercise.questionType) return exercise.questionType;
  const prompt = exercise.prompt.trim();
  if (/^Use it:|write|say|describe|explain|create/iu.test(prompt)) return "production";
  if (/different|compare|contrast|rather than|instead/iu.test(prompt)) return "comparison";
  if (/why|how do you know|suggest|imply|probably/iu.test(prompt)) return "inference";
  if (/new situation|your own|real life|another context/iu.test(prompt)) return "transfer";
  if (/_{2,}|complete|fill|fits? (?:the|this) (?:sentence|gap)/iu.test(prompt)) {
    return "context-cloze";
  }
  return "meaning";
}

function isProductionTask(exercise: LessonExercise): boolean {
  return (
    inferQuestionType(exercise) === "production" ||
    ["sentence", "spoken", "extended-response"].includes(exercise.responseMode ?? "")
  );
}

function readingMinimum(stage: LessonUsageData["cefrStage"]): number {
  if (stage === "Pre-A1") return 25;
  if (stage === "A1") return 45;
  if (stage === "A2") return 70;
  if (stage === "B1") return 90;
  return 105;
}

export function auditContextualLesson(lesson: LessonUsageData): ContextualQualityReport {
  const authoredProductionTasks = lesson.exercises.filter(isProductionTask);
  // The lesson player promotes the final two open prompts when older content
  // has not yet been explicitly tagged. Audit the experience learners receive.
  const productionTasks =
    authoredProductionTasks.length > 0 ? authoredProductionTasks : lesson.exercises.slice(-2);
  const targetCoverage = lesson.targetWordsEnglish.map((target) => {
    const sceneTexts = lesson.usage.scenes.map((scene) => scene.scenario);
    const questionTexts = lesson.exercises
      .filter((exercise) => !isProductionTask(exercise))
      .map((exercise) => `${exercise.prompt} ${exercise.answer}`);
    const productionTexts = productionTasks.map(
      (exercise) => `${exercise.prompt} ${exercise.answer}`
    );
    const candidates: Array<[ContextSource, string[]]> = [
      ["scene", sceneTexts],
      ["reading", [lesson.reading.text]],
      ["question", questionTexts],
      ["production", productionTexts],
      ["transfer", (lesson.contextExtensions ?? []).map((context) => context.text)],
    ];
    const sources = candidates
      .filter(([, texts]) => texts.some((text) => containsTarget(text, target)))
      .map(([source]) => source);
    const occurrences = candidates.reduce(
      (total, [, texts]) => total + texts.filter((text) => containsTarget(text, target)).length,
      0
    );
    return { target, sources, occurrences };
  });

  const questionTypes = [
    ...new Set([
      ...lesson.exercises.map(inferQuestionType),
      ...(authoredProductionTasks.length === 0 && productionTasks.length > 0
        ? (["production"] as const)
        : []),
    ]),
  ];
  // The player rotates options deterministically by chunk so the effective
  // answer position is balanced even while source JSON remains stable.
  const answerPositions = lesson.usage.scenes.map((scene) => {
    const original = scene.check.options.indexOf(scene.check.expectedAnswer);
    const optionCount = scene.check.options.length;
    return optionCount === 0
      ? -1
      : (original - (scene.chunkNumber - 1) + optionCount) % optionCount;
  });
  const readingWordCount = lesson.reading.text.trim().split(/\s+/u).filter(Boolean).length;
  const sparseTargets = targetCoverage.filter((target) => target.sources.length < 2);
  const isolatedTargets = targetCoverage.filter((target) => target.sources.length < 3);
  const uniqueAnswerPositions = new Set(answerPositions).size;
  const isReferenceUnit = Object.values(CONTEXTUAL_REFERENCE_UNITS).includes(
    lesson.unitId as (typeof CONTEXTUAL_REFERENCE_UNITS)[keyof typeof CONTEXTUAL_REFERENCE_UNITS]
  );
  const errors: string[] = [];
  const recommendations: string[] = [];

  const missingTargets = targetCoverage.filter((target) => target.sources.length === 0);
  if (missingTargets.length > 0) {
    errors.push(`${missingTargets.length} target(s) do not appear in contextual material.`);
  }
  if (sparseTargets.length > 0) {
    recommendations.push(`${sparseTargets.length} target(s) need a second context type.`);
  }
  if (productionTasks.length === 0) {
    errors.push("No independent production task is authored.");
  } else if (authoredProductionTasks.length === 0) {
    recommendations.push("Tag the transfer prompts explicitly as production tasks.");
  }
  if (questionTypes.length < 2) {
    recommendations.push("Add another question type beyond recognition or recall.");
  }
  if (uniqueAnswerPositions < Math.min(2, answerPositions.length)) {
    recommendations.push("Vary the authored correct-answer position.");
  }
  if (readingWordCount < readingMinimum(lesson.cefrStage)) {
    recommendations.push(
      `Expand the reading to at least ${readingMinimum(lesson.cefrStage)} words for ${lesson.cefrStage}.`
    );
  }
  if (isolatedTargets.length > 0) {
    recommendations.push(
      `${isolatedTargets.length} target(s) need a third context type for stronger transfer.`
    );
  }

  const twoContextRatio =
    targetCoverage.filter((target) => target.sources.length >= 2).length /
    Math.max(1, targetCoverage.length);
  const threeContextRatio =
    targetCoverage.filter((target) => target.sources.length >= 3).length /
    Math.max(1, targetCoverage.length);
  const score = Math.round(
    twoContextRatio * 30 +
      threeContextRatio * 15 +
      Math.min(questionTypes.length / 4, 1) * 20 +
      Math.min(productionTasks.length / 2, 1) * 20 +
      Math.min(readingWordCount / readingMinimum(lesson.cefrStage), 1) * 10 +
      Math.min(uniqueAnswerPositions / 2, 1) * 5
  );

  if (isReferenceUnit && score < 85) {
    errors.push(`Reference lesson contextual-quality score is ${score}; minimum is 85.`);
  }

  return {
    lessonId: lesson.lessonId,
    unitId: lesson.unitId,
    cefrStage: lesson.cefrStage,
    isReferenceUnit,
    targetCoverage,
    questionTypes,
    answerPositions,
    productionTaskCount: productionTasks.length,
    readingWordCount,
    score,
    errors,
    recommendations,
  };
}

import { z } from "zod";

export const curriculumCefrSchema = z.enum(["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]);

const rawWordSchema = z
  .object({
    order: z.number().int().positive(),
    word: z.string().trim().min(1),
    arabic: z.string().trim().min(1),
    cluster: z.number().int().positive(),
    revised_usage_sentence: z.string(),
    usage_function: z.string(),
    key_collocation_or_pattern: z.string(),
    grammar_or_form_focus: z.string(),
    register_or_constraint: z.string(),
    cefr_appropriacy: z.string(),
    editorial_status: z.string(),
  })
  .passthrough();

const rawClusterSchema = z
  .object({
    cluster_no: z.number().int().positive(),
    target_words: z.array(z.string().trim().min(1)).min(1),
    reading: z
      .object({
        title: z.string(),
        text: z.string(),
        comprehension_or_retrieval_task: z.string(),
        cefr_qa: z.string(),
        editorial_status: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

const rawLessonQaSchema = z
  .object({
    word_examples_complete: z.boolean(),
    cluster_readings_complete: z.boolean(),
    media_adds_new_affordance: z.boolean(),
    cefr_checked: z.boolean(),
    recycling_checked: z.boolean(),
    final_integration_checked: z.boolean(),
    editorial_status: z.string(),
  })
  .passthrough();

export const rawCurriculumLessonSchema = z
  .object({
    stage_cefr: curriculumCefrSchema,
    lesson_global_order: z.coerce.number().int().positive(),
    lesson_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    lesson_name: z.string().trim().min(1),
    word_count: z.coerce.number().int().positive(),
    words: z.array(rawWordSchema).min(1),
    clusters: z.array(rawClusterSchema).min(1),
    lesson_qa: rawLessonQaSchema,
  })
  .passthrough();

export const rawWorkingModelSchema = z
  .object({
    schema_version: z.string().trim().min(1),
    lesson_count: z.number().int().nonnegative(),
    lessons: z.array(rawCurriculumLessonSchema),
  })
  .passthrough();

export type RawCurriculumLesson = z.infer<typeof rawCurriculumLessonSchema>;

export interface CurriculumAuditIssue {
  code:
    | "duplicate-id"
    | "lesson-count-mismatch"
    | "source-missing-lesson"
    | "source-word-mismatch"
    | "declared-word-count-mismatch"
    | "invalid-cluster-size"
    | "missing-enrichment"
    | "qa-incomplete";
  lessonId?: string;
  message: string;
}

export interface CurriculumAuditReport {
  schemaVersion: string;
  modelLessonCount: number;
  jsonlLessonCount: number;
  totalWords: number;
  totalClusters: number;
  eligibleLessons: number;
  blockedLessons: number;
  missingUsageSentences: number;
  missingClusterReadings: number;
  issues: CurriculumAuditIssue[];
}

const requiredQaKeys = [
  "word_examples_complete",
  "cluster_readings_complete",
  "media_adds_new_affordance",
  "cefr_checked",
  "recycling_checked",
  "final_integration_checked",
] as const;

export function auditCurriculumContent(
  schemaVersion: string,
  declaredLessonCount: number,
  modelLessons: readonly RawCurriculumLesson[],
  jsonlLessons: readonly RawCurriculumLesson[]
): CurriculumAuditReport {
  const issues: CurriculumAuditIssue[] = [];
  const modelById = new Map<string, RawCurriculumLesson>();
  const seenIds = new Set<string>();
  let totalWords = 0;
  let totalClusters = 0;
  let missingUsageSentences = 0;
  let missingClusterReadings = 0;
  let eligibleLessons = 0;

  if (declaredLessonCount !== modelLessons.length) {
    issues.push({
      code: "lesson-count-mismatch",
      message: `Model declares ${declaredLessonCount} lessons but contains ${modelLessons.length}.`,
    });
  }

  for (const lesson of modelLessons) {
    if (seenIds.has(lesson.lesson_id)) {
      issues.push({
        code: "duplicate-id",
        lessonId: lesson.lesson_id,
        message: "Duplicate lesson ID.",
      });
    }
    seenIds.add(lesson.lesson_id);
    modelById.set(lesson.lesson_id, lesson);
    totalWords += lesson.words.length;
    totalClusters += lesson.clusters.length;

    if (lesson.word_count !== lesson.words.length) {
      issues.push({
        code: "declared-word-count-mismatch",
        lessonId: lesson.lesson_id,
        message: `Declared ${lesson.word_count} words but found ${lesson.words.length}.`,
      });
    }
    const hasInvalidClusterSize = lesson.clusters.some(
      (cluster) => cluster.target_words.length < 4 || cluster.target_words.length > 5
    );
    if (hasInvalidClusterSize) {
      issues.push({
        code: "invalid-cluster-size",
        lessonId: lesson.lesson_id,
        message: "At least one cluster is outside the four-to-five-word authoring range.",
      });
    }

    const missingWords = lesson.words.filter(
      (word) =>
        !word.revised_usage_sentence.trim() ||
        !word.usage_function.trim() ||
        !word.key_collocation_or_pattern.trim() ||
        !word.grammar_or_form_focus.trim() ||
        !word.cefr_appropriacy.trim() ||
        word.editorial_status === "not_revised"
    ).length;
    const missingReadings = lesson.clusters.filter(
      (cluster) =>
        !cluster.reading.title.trim() ||
        !cluster.reading.text.trim() ||
        !cluster.reading.comprehension_or_retrieval_task.trim() ||
        !cluster.reading.cefr_qa.trim() ||
        cluster.reading.editorial_status === "not_revised"
    ).length;
    missingUsageSentences += lesson.words.filter(
      (word) => !word.revised_usage_sentence.trim()
    ).length;
    missingClusterReadings += lesson.clusters.filter(
      (cluster) => !cluster.reading.text.trim()
    ).length;

    const qaComplete =
      requiredQaKeys.every((key) => lesson.lesson_qa[key]) &&
      lesson.lesson_qa.editorial_status !== "not_revised";
    if (missingWords > 0 || missingReadings > 0) {
      issues.push({
        code: "missing-enrichment",
        lessonId: lesson.lesson_id,
        message: `${missingWords} words and ${missingReadings} clusters require editorial enrichment.`,
      });
    }
    if (!qaComplete) {
      issues.push({
        code: "qa-incomplete",
        lessonId: lesson.lesson_id,
        message: "Lesson QA is incomplete.",
      });
    }
    if (missingWords === 0 && missingReadings === 0 && qaComplete && !hasInvalidClusterSize) {
      eligibleLessons += 1;
    }
  }

  const jsonlById = new Map(jsonlLessons.map((lesson) => [lesson.lesson_id, lesson]));
  for (const [lessonId, modelLesson] of modelById) {
    const sourceLesson = jsonlById.get(lessonId);
    if (!sourceLesson) {
      issues.push({
        code: "source-missing-lesson",
        lessonId,
        message: "Lesson is missing from JSONL.",
      });
      continue;
    }
    const modelWords = modelLesson.words.map((word) => word.word).join("\u0000");
    const sourceWords = sourceLesson.words.map((word) => word.word).join("\u0000");
    if (modelWords !== sourceWords) {
      issues.push({
        code: "source-word-mismatch",
        lessonId,
        message: "Word order differs between sources.",
      });
    }
  }

  return {
    schemaVersion,
    modelLessonCount: modelLessons.length,
    jsonlLessonCount: jsonlLessons.length,
    totalWords,
    totalClusters,
    eligibleLessons,
    blockedLessons: modelLessons.length - eligibleLessons,
    missingUsageSentences,
    missingClusterReadings,
    issues,
  };
}

const sentenceSchema = z.object({
  full: z.string().trim().min(1),
  words: z.array(z.string().trim().min(1)).min(3).max(9),
});

const authoredWordSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().trim().min(1),
  arabic: z.string().regex(/[\u0600-\u06ff]/),
  sentence: sentenceSchema,
});

const authoredClusterSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  targetWordIds: z.array(z.string()).min(4).max(5),
  microReading: z.object({ title: z.string().trim().min(1), text: z.string().trim().min(1) }),
  retrieval: z.object({
    prompt: z.string().trim().min(1),
    options: z.array(z.string().trim().min(1)).min(2).max(4),
    answer: z.string().trim().min(1),
  }),
});

export const authoredLessonContentSchema = z
  .object({
    lessonId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    sourceLessonId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    cefr: curriculumCefrSchema,
    editorialStatus: z.literal("approved"),
    words: z.array(authoredWordSchema).min(1),
    clusters: z.array(authoredClusterSchema).min(1),
    spacedReviewAfterLessons: z.tuple([z.literal(1), z.literal(3), z.literal(7)]),
  })
  .superRefine((lesson, context) => {
    const wordIds = new Set(lesson.words.map((word) => word.id));
    if (wordIds.size !== lesson.words.length) {
      context.addIssue({ code: "custom", message: "Word IDs must be unique.", path: ["words"] });
    }
    const clusteredWordCounts = new Map<string, number>();
    for (const [index, cluster] of lesson.clusters.entries()) {
      for (const wordId of cluster.targetWordIds) {
        clusteredWordCounts.set(wordId, (clusteredWordCounts.get(wordId) ?? 0) + 1);
        if (!wordIds.has(wordId)) {
          context.addIssue({
            code: "custom",
            message: `Unknown target word ID: ${wordId}`,
            path: ["clusters", index, "targetWordIds"],
          });
        }
      }
      if (!cluster.retrieval.options.includes(cluster.retrieval.answer)) {
        context.addIssue({
          code: "custom",
          message: "Retrieval answer must be one of the options.",
          path: ["clusters", index, "retrieval", "answer"],
        });
      }
    }
    for (const wordId of wordIds) {
      const count = clusteredWordCounts.get(wordId) ?? 0;
      if (count !== 1) {
        context.addIssue({
          code: "custom",
          message: `Word ID ${wordId} must appear in exactly one cluster; found ${count}.`,
          path: ["clusters"],
        });
      }
    }
  });

export type AuthoredLessonContent = z.infer<typeof authoredLessonContentSchema>;

export function buildAuthoredLessonRegistry(
  lessons: readonly AuthoredLessonContent[]
): Readonly<Record<string, AuthoredLessonContent>> {
  const registry: Record<string, AuthoredLessonContent> = {};
  for (const lesson of lessons) {
    if (lesson.lessonId !== lesson.sourceLessonId) {
      throw new Error(`Lesson ${lesson.lessonId} does not preserve its source lesson ID.`);
    }
    if (registry[lesson.lessonId]) {
      throw new Error(`Duplicate authored lesson ID: ${lesson.lessonId}`);
    }
    registry[lesson.lessonId] = lesson;
  }
  return registry;
}

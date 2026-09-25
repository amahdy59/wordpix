import { z } from "zod";
import content from "./figmaHadithContent.json";
import { FIGMA_HADITH_STAGE_IDS } from "./hadithCurriculumStages";

const stageSchema = z.object({
  nodeId: z.string(),
  sourceName: z.string(),
  text: z.array(z.string()),
});

const lessonSchema = z.object({
  id: z.string().regex(/^hadith-\d{2}$/),
  number: z.number().int().min(1).max(42),
  title: z.string().min(1),
  nodeId: z.string(),
  source: z.object({
    arabic: z.string().min(1),
    translation: z.string().min(1),
    citation: z.string().min(1),
  }),
  stages: z.object(
    Object.fromEntries(FIGMA_HADITH_STAGE_IDS.map((stage) => [stage, stageSchema])) as Record<
      (typeof FIGMA_HADITH_STAGE_IDS)[number],
      typeof stageSchema
    >
  ),
});

const catalogSchema = z.object({
  schemaVersion: z.literal(2),
  source: z.object({
    fileKey: z.string(),
    pageId: z.string(),
    name: z.string(),
  }),
  visualVocabulary: z.array(
    z.object({ label: z.string().min(1), imageRef: z.string().min(1), nodeId: z.string() })
  ),
  lessons: z.array(lessonSchema).length(42),
});

const parsed = catalogSchema.parse(content);

export type FigmaHadithLesson = z.infer<typeof lessonSchema>;
export const FIGMA_HADITH_SOURCE = parsed.source;
export const FIGMA_HADITH_LESSONS: readonly FigmaHadithLesson[] = parsed.lessons;
export const FIGMA_HADITH_VISUAL_VOCABULARY = parsed.visualVocabulary;

const normalizeVisualLabel = (value: string) =>
  value
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function getHadithVisualVocabulary(terms: readonly string[]) {
  const wanted = new Set(terms.map(normalizeVisualLabel));
  return FIGMA_HADITH_VISUAL_VOCABULARY.filter((item) =>
    wanted.has(normalizeVisualLabel(item.label))
  );
}

export function getHadithLessonThumbnail(lesson: FigmaHadithLesson) {
  const vocabularyLines = new Set(lesson.stages.vocabulary.text.map(normalizeVisualLabel));
  const matched = FIGMA_HADITH_VISUAL_VOCABULARY.find((item) => {
    const baseLabel = item.label.split("·")[0].trim();
    return (
      vocabularyLines.has(normalizeVisualLabel(item.label)) ||
      vocabularyLines.has(normalizeVisualLabel(baseLabel))
    );
  });

  return (
    matched ??
    FIGMA_HADITH_VISUAL_VOCABULARY[
      ((lesson.number - 1) * 5) % FIGMA_HADITH_VISUAL_VOCABULARY.length
    ]
  );
}

export function getFigmaHadithLesson(id: string): FigmaHadithLesson | undefined {
  return FIGMA_HADITH_LESSONS.find((lesson) => lesson.id === id);
}

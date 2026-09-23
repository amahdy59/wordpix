import { z } from "zod";
import content from "./figmaHadithContent.json";
import { HADITH_STAGE_IDS } from "./hadithCurriculumStages";

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
    Object.fromEntries(HADITH_STAGE_IDS.map((stage) => [stage, stageSchema])) as Record<
      (typeof HADITH_STAGE_IDS)[number],
      typeof stageSchema
    >
  ),
});

const catalogSchema = z.object({
  schemaVersion: z.literal(1),
  source: z.object({
    fileKey: z.string(),
    pageId: z.string(),
    name: z.string(),
  }),
  lessons: z.array(lessonSchema).length(42),
});

const parsed = catalogSchema.parse(content);

export type FigmaHadithLesson = z.infer<typeof lessonSchema>;
export const FIGMA_HADITH_SOURCE = parsed.source;
export const FIGMA_HADITH_LESSONS: readonly FigmaHadithLesson[] = parsed.lessons;

export function getFigmaHadithLesson(id: string): FigmaHadithLesson | undefined {
  return FIGMA_HADITH_LESSONS.find((lesson) => lesson.id === id);
}

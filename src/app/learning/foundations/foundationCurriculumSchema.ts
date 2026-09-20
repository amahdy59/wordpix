import { z } from "zod";

const imageSchema = z.object({
  src: z
    .string()
    .startsWith("/")
    .regex(/\.(?:avif|webp|png|jpe?g)$/i),
  alt: z.string(),
});

const optionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  audio: z.string().min(1).optional(),
  image: imageSchema.optional(),
  mediaKind: z.enum(["photo", "symbol"]).optional(),
});

const questionSchema = z
  .object({
    prompt: z.string().min(1),
    audio: z.string().min(1),
    display: z.string().min(1).optional(),
    options: z.array(optionSchema).min(2),
    answer: z.string().min(1),
    correctFeedback: z.string().min(1),
    support: z.tuple([z.string().min(1), z.string().min(1)]),
    visual: z.enum(["counters", "beats", "sound-chips", "letter-tiles"]).optional(),
  })
  .superRefine((question, context) => {
    if (!question.options.some((option) => option.value === question.answer)) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "The answer must match one of the option values.",
      });
    }
    for (const [index, option] of question.options.entries()) {
      if (option.audio && option.mediaKind === "photo" && !option.image) {
        context.addIssue({
          code: "custom",
          path: ["options", index, "image"],
          message: "Concrete spoken choices require a photo.",
        });
      }
    }
  });

const lessonSchema = z.object({
  id: z.string().min(1),
  level: z.union([z.literal(0), z.literal(1)]),
  unitId: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  goal: z.string().min(1),
  instruction: z.string().min(1),
  audioOnly: z.boolean(),
  prerequisites: z.array(z.string().min(1)),
  masteryThreshold: z.number().int().min(1).max(100),
  models: z.array(
    z.object({
      audio: z.string().min(1),
      explanation: z.string().min(1),
      image: imageSchema.optional(),
      tiles: z.array(z.string().min(1)).optional(),
    })
  ),
  questions: z.array(questionSchema).min(1),
});

export const foundationCurriculumSchema = z
  .object({
    schemaVersion: z.literal(1),
    lessons: z.array(lessonSchema).min(1),
    stages: z.array(
      z.object({
        id: z.string().min(1),
        level: z.union([z.literal(0), z.literal(1)]),
        title: z.string().min(1),
        description: z.string().min(1),
        units: z.array(
          z.object({
            id: z.string().min(1),
            title: z.string().min(1),
            outcome: z.string().min(1),
            lessons: z.array(lessonSchema),
          })
        ),
      })
    ),
  })
  .superRefine((curriculum, context) => {
    const ids = curriculum.lessons.map((lesson) => lesson.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        path: ["lessons"],
        message: "Lesson IDs must be unique.",
      });
    }
    curriculum.lessons.forEach((lesson, lessonIndex) => {
      for (const prerequisite of lesson.prerequisites) {
        const prerequisiteIndex = ids.indexOf(prerequisite);
        if (prerequisiteIndex < 0 || prerequisiteIndex >= lessonIndex) {
          context.addIssue({
            code: "custom",
            path: ["lessons", lessonIndex, "prerequisites"],
            message: "Prerequisites must reference an earlier lesson.",
          });
        }
      }
    });
    const stagedIds = curriculum.stages.flatMap((stage) =>
      stage.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id))
    );
    if (stagedIds.length !== ids.length || stagedIds.some((id) => !ids.includes(id))) {
      context.addIssue({
        code: "custom",
        path: ["stages"],
        message: "Every lesson must appear in the stage structure exactly once.",
      });
    }
    if (new Set(stagedIds).size !== stagedIds.length) {
      context.addIssue({
        code: "custom",
        path: ["stages"],
        message: "A lesson cannot appear in more than one unit.",
      });
    }
  });

export function validateFoundationCurriculum(value: unknown): void {
  foundationCurriculumSchema.parse(value);
}

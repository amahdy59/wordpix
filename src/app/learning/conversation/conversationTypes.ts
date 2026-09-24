import { z } from "zod";

export const CEFR_LEVELS = ["B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const CONVERSATION_STAGE_IDS = [
  "warmup",
  "reading",
  "vocabulary",
  "toolkit",
  "quiz",
  "discussion",
  "challenge",
] as const;
export type ConversationStageId = (typeof CONVERSATION_STAGE_IDS)[number];

export const languageBankItemSchema = z.object({
  id: z.string(),
  term: z.string(),
  termAr: z.string().optional(),
  type: z.string(),
  meaning: z.string(),
  meaningAr: z.string().optional(),
  example: z.string(),
  imageDescription: z.string(),
  imageSrc: z.string().optional(),
});
export type LanguageBankItem = z.infer<typeof languageBankItemSchema>;

export const quickVoteOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  textAr: z.string(),
});

export const conversationUnitSchema = z.object({
  id: z.string(),
  unitNumber: z.number().int().min(1).max(40),
  level: z.enum(CEFR_LEVELS),
  title: z.string(),
  titleAr: z.string().optional(),
  topic: z.string(),
  topicAr: z.string(),
  speakingSkill: z.string(),
  speakingSkillAr: z.string(),
  heroImage: z.string().optional(),
  warmup: z.object({
    bigQuestion: z.string(),
    bigQuestionAr: z.string().optional(),
    prompts: z.array(
      z.object({
        en: z.string(),
        ar: z.string(),
      })
    ),
    quickVote: z.object({
      question: z.string(),
      options: z.array(quickVoteOptionSchema),
    }),
  }),
  reading: z.object({
    title: z.string(),
    titleAr: z.string().optional(),
    paragraphs: z.array(z.string()),
    inShort: z.object({
      summary: z.string(),
      summaryAr: z.string().optional(),
      targetTerms: z.array(z.string()),
    }),
  }),
  languageBank: z.array(languageBankItemSchema).length(10),
  toolkit: z.object({
    title: z.string(),
    functionDescription: z.string(),
    phrases: z.array(
      z.object({
        template: z.string(),
        example: z.string(),
        arabic: z.string().optional(),
      })
    ),
  }),
  quiz: z
    .array(
      z.object({
        id: z.string(),
        question: z.string(),
        options: z.array(
          z.object({
            key: z.enum(["A", "B", "C", "D"]),
            text: z.string(),
          })
        ),
        correctAnswer: z.enum(["A", "B", "C", "D"]),
        explanation: z.string().optional(),
      })
    )
    .length(10),
  discussion: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        prompt: z.string(),
        promptAr: z.string().optional(),
      })
    )
    .length(6),
  speakingChallenge: z.object({
    title: z.string(),
    scenario: z.string(),
    tasks: z.array(z.string()),
    usefulFrames: z.array(z.string()),
  }),
  researchBasis: z.array(
    z.object({
      source: z.string(),
      url: z.string(),
    })
  ),
});

export type ConversationUnit = z.infer<typeof conversationUnitSchema>;

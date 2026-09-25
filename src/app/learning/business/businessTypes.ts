import { z } from "zod";

export const BUSINESS_CEFR_LEVELS = ["B1", "B2", "C1", "C2"] as const;
export type BusinessCefrLevel = (typeof BUSINESS_CEFR_LEVELS)[number];

export const BUSINESS_STAGE_IDS = [
  "recall",
  "warmup",
  "input",
  "vocabulary",
  "usage",
  "exercises",
  "discussion",
  "speaking",
  "review",
] as const;
export type BusinessStageId = (typeof BUSINESS_STAGE_IDS)[number];

export const businessRecallPromptSchema = z.object({
  id: z.string(),
  type: z.enum([
    "meaning-to-phrase",
    "sentence-completion",
    "recognition",
    "phrasal-verb",
    "production",
    "multiple-choice",
  ]),
  promptTypeLabel: z.string(),
  targetWord: z.string(),
  question: z.string(),
  definition: z.string().optional(),
  modelSentence: z.string().optional(),
  hint: z.string().optional(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
});
export type BusinessRecallPrompt = z.infer<typeof businessRecallPromptSchema>;

export const businessRecallConfigSchema = z.object({
  sourceUnitNumber: z.number().int().min(1).max(40),
  sourceUnitTitle: z.string(),
  estimatedMinutes: z.number().int().min(1).max(15).optional(),
  prompts: z.array(businessRecallPromptSchema),
});
export type BusinessRecallConfig = z.infer<typeof businessRecallConfigSchema>;

export const businessVocabularyItemSchema = z.object({
  id: z.string(),
  term: z.string(),
  termAr: z.string().optional(),
  type: z.string(),
  definition: z.string(),
  example: z.string(),
  imageSrc: z.string(),
});
export type BusinessVocabularyItem = z.infer<typeof businessVocabularyItemSchema>;

export const businessExerciseOptionSchema = z.object({
  key: z.enum(["A", "B", "C"]),
  text: z.string(),
});

export const businessExerciseSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(businessExerciseOptionSchema),
  correctAnswer: z.enum(["A", "B", "C"]),
  explanation: z.string(),
});
export type BusinessExercise = z.infer<typeof businessExerciseSchema>;

export const businessDialogueLineSchema = z.object({
  speaker: z.string(),
  text: z.string(),
  audioUrl: z.string().optional(),
});
export type BusinessDialogueLine = z.infer<typeof businessDialogueLineSchema>;

export const businessUnitSchema = z.object({
  id: z.string(),
  unitNumber: z.number().int().min(1).max(40),
  sectionNumber: z.number().int().min(1).max(4),
  sectionTitle: z.string(),
  sectionTitleAr: z.string().optional(),
  level: z.enum(BUSINESS_CEFR_LEVELS),
  heroImageSrc: z.string().optional(),
  estimatedMinutes: z.number().int().min(5).max(30).optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  titleAr: z.string().optional(),
  essentialQuestion: z.string(),
  essentialQuestionAr: z.string().optional(),
  speakingGoal: z.string(),
  speakingGoalAr: z.string().optional(),
  warmup: z.object({
    instructions: z.string(),
    prompts: z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        hint: z.string().optional(),
      })
    ),
  }),
  mainInput: z.object({
    title: z.string(),
    context: z.string(),
    dialogue: z.array(businessDialogueLineSchema),
  }),
  languageBank: z.array(businessVocabularyItemSchema),
  usageFocus: z.object({
    title: z.string(),
    description: z.string(),
    details: z.array(z.string()),
  }),
  exercises: z.array(businessExerciseSchema),
  discussion: z.object({
    title: z.string(),
    prompts: z.array(
      z.object({
        id: z.string(),
        prompt: z.string(),
      })
    ),
  }),
  speakingTask: z.object({
    title: z.string(),
    rule: z.string(),
    steps: z.array(z.string()),
    checklist: z.array(z.string()),
  }),
  review: z.object({
    title: z.string(),
    recycledPoints: z.array(z.string()),
    spacedRepetitionPrompt: z.string(),
  }),
  recall: businessRecallConfigSchema.optional(),
});
export type BusinessUnit = z.infer<typeof businessUnitSchema>;

export interface BusinessUnitProgress {
  unitId: string;
  status: "locked" | "not-started" | "in-progress" | "mastered";
  currentStage: BusinessStageId;
  completedStages: BusinessStageId[];
  quizScore?: number;
  selfAssessmentCompleted?: boolean;
  notes?: Record<string, string>;
  lastAttemptAt?: string;
}

export interface BusinessSectionMilestone {
  sectionNumber: number;
  level: BusinessCefrLevel;
  badge: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

export const BUSINESS_SECTION_MILESTONES: BusinessSectionMilestone[] = [
  {
    sectionNumber: 1,
    level: "B1",
    badge: "🎓",
    title: "B1 Workplace Foundations",
    titleAr: "شهادة أسس بيئة العمل (B1)",
    description:
      "Professional introductions, roles, clarification, meetings, and progress updates.",
    descriptionAr: "التعريف المهني بالنفس، الأدوار والمسؤوليات، وتحديثات التقدم والاجتماعات.",
  },
  {
    sectionNumber: 2,
    level: "B2",
    badge: "🤝",
    title: "B2 Influence & Collaboration",
    titleAr: "أخصائي التعاون والتأثير (B2)",
    description:
      "Negotiation, constructive feedback, conflict resolution, and consultative selling.",
    descriptionAr: "التفاوض، الملاحظات البناءة، حل النزاعات، والمبيعات الاستشارية.",
  },
  {
    sectionNumber: 3,
    level: "C1",
    badge: "🚀",
    title: "C1 Strategic Leadership",
    titleAr: "قائد استراتيجي وتواصلي (C1)",
    description: "Organizational change, cross-cultural influence, ethics, and scaling systems.",
    descriptionAr:
      "إدارة التغيير المؤسسي، التأثير العابر للثقافات، أخلاقيات الأعمال، وتوسيع النظم.",
  },
  {
    sectionNumber: 4,
    level: "C2",
    badge: "🏛️",
    title: "C2 Executive Governance",
    titleAr: "الحوكمة التنفيذية ومجلس الإدارة (C2)",
    description:
      "Crisis communications, multi-party trade-offs, M&A integration, and boardroom strategy.",
    descriptionAr:
      "إدارة الأزمات، المقايضات المعقدة بين أصحاب المصلحة، الاندماج، وحوارات مجلس الإدارة.",
  },
];

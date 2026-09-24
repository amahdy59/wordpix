import { z } from "zod";
import { CONVERSATION_STAGE_IDS, type ConversationStageId } from "./conversationTypes";

export type ConversationLessonStatus = "in-progress" | "mastered";

export const conversationUnitProgressSchema = z.object({
  status: z.enum(["in-progress", "mastered"]),
  currentStage: z
    .number()
    .int()
    .min(0)
    .max(CONVERSATION_STAGE_IDS.length - 1),
  completedStages: z.array(z.enum(CONVERSATION_STAGE_IDS)),
  quizBestScore: z.number().int().min(0).max(10).optional(),
  selectedVoteOption: z.string().optional(),
  notes: z.string().optional(),
  challengeResponse: z.string().optional(),
  updatedAt: z.string(),
});

export type ConversationUnitProgress = z.infer<typeof conversationUnitProgressSchema>;
export type ConversationProgress = Record<string, ConversationUnitProgress>;

export function normalizeConversationProgress(value: unknown): ConversationProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: ConversationProgress = {};
  for (const [unitId, candidate] of Object.entries(value)) {
    if (!/^unit-\d{2}$/.test(unitId)) continue;
    const parsed = conversationUnitProgressSchema.safeParse(candidate);
    if (parsed.success) {
      output[unitId] = parsed.data;
    }
  }
  return output;
}

export function checkpointConversationUnit(
  progress: ConversationProgress,
  unitId: string,
  currentStage: number,
  completedStage?: ConversationStageId,
  quizScore?: number,
  voteOption?: string,
  now = new Date()
): ConversationProgress {
  const current = progress[unitId] ?? {
    status: "in-progress",
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };

  const completedStages = new Set(current.completedStages);
  if (completedStage) completedStages.add(completedStage);

  let quizBestScore = current.quizBestScore;
  if (typeof quizScore === "number") {
    const clamped = Math.max(0, Math.min(10, Math.round(quizScore)));
    quizBestScore = typeof quizBestScore === "number" ? Math.max(quizBestScore, clamped) : clamped;
  }

  const boundedStage = Math.max(0, Math.min(CONVERSATION_STAGE_IDS.length - 1, currentStage));

  const updated: ConversationUnitProgress = {
    ...current,
    currentStage: boundedStage,
    completedStages: Array.from(completedStages) as ConversationStageId[],
    quizBestScore,
    selectedVoteOption: voteOption ?? current.selectedVoteOption,
    updatedAt: now.toISOString(),
  };

  return {
    ...progress,
    [unitId]: updated,
  };
}

export function saveConversationNotes(
  progress: ConversationProgress,
  unitId: string,
  notes: string,
  now = new Date()
): ConversationProgress {
  const current = progress[unitId] ?? {
    status: "in-progress" as const,
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };
  return {
    ...progress,
    [unitId]: {
      ...current,
      notes: notes.slice(0, 4000),
      updatedAt: now.toISOString(),
    },
  };
}

export function saveConversationChallengeResponse(
  progress: ConversationProgress,
  unitId: string,
  response: string,
  now = new Date()
): ConversationProgress {
  const current = progress[unitId] ?? {
    status: "in-progress" as const,
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };
  return {
    ...progress,
    [unitId]: {
      ...current,
      challengeResponse: response.slice(0, 6000),
      updatedAt: now.toISOString(),
    },
  };
}

export function canCompleteConversationUnit(
  progress: ConversationProgress,
  unitId: string
): boolean {
  const current = progress[unitId];
  if (!current || current.quizBestScore === undefined) return false;
  return CONVERSATION_STAGE_IDS.slice(0, -1).every((stage) =>
    current.completedStages.includes(stage)
  );
}

export function completeConversationUnit(
  progress: ConversationProgress,
  unitId: string,
  now = new Date()
): ConversationProgress {
  const current = progress[unitId];
  if (!canCompleteConversationUnit(progress, unitId)) return progress;
  const allStages = [...CONVERSATION_STAGE_IDS];

  const updated: ConversationUnitProgress = {
    status: "mastered",
    currentStage: CONVERSATION_STAGE_IDS.length - 1,
    completedStages: allStages,
    quizBestScore: current?.quizBestScore,
    selectedVoteOption: current?.selectedVoteOption,
    notes: current?.notes,
    challengeResponse: current?.challengeResponse,
    updatedAt: now.toISOString(),
  };

  return {
    ...progress,
    [unitId]: updated,
  };
}

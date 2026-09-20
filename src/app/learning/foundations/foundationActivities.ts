import type { FoundationQuestion } from "./foundationCurriculum";

export type FoundationActivityKind = "listen-and-choose" | "read-and-choose" | "listen-and-select";

export interface FoundationActivityContract {
  kind: FoundationActivityKind;
  requiresTargetAudio: boolean;
  requiresAllOptionsHeard: boolean;
  revealsCorrectAnswer: boolean;
  permitsRetry: boolean;
}

export function getFoundationActivityContract(
  question: FoundationQuestion
): FoundationActivityContract {
  if (question.options.some((option) => option.audio)) {
    return {
      kind: "listen-and-choose",
      requiresTargetAudio: true,
      requiresAllOptionsHeard: true,
      revealsCorrectAnswer: true,
      permitsRetry: true,
    };
  }
  if (question.display) {
    return {
      kind: "read-and-choose",
      requiresTargetAudio: true,
      requiresAllOptionsHeard: false,
      revealsCorrectAnswer: true,
      permitsRetry: true,
    };
  }
  return {
    kind: "listen-and-select",
    requiresTargetAudio: true,
    requiresAllOptionsHeard: false,
    revealsCorrectAnswer: true,
    permitsRetry: true,
  };
}

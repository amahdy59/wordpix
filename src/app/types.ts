// Shared TypeScript types for the WordPix app state machine

export type OnboardStep = "splash" | "language" | "ready";
export type TabId = "home" | "explore" | "practice" | "profile";

export interface AnswerAttempt {
  exerciseStep: number;
  wordId: string;
  correct: boolean;
  answeredAt: string;
}

export type Screen =
  | { id: "onboarding"; step: OnboardStep }
  | { id: "home" }
  | { id: "explore" }
  | { id: "practice" }
  | { id: "profile" }
  | { id: "lesson-entry" }
  | {
      id: "lesson";
      sessionId: string;
      groupId: string;
      wordQueue: string[];
      step: number;
      attempts: AnswerAttempt[];
      startedAt: string;
    }
  | {
      id: "lesson-complete";
      sessionId: string;
      groupId: string;
      wordQueue: string[];
      attempts: AnswerAttempt[];
    };

export type Action =
  | { type: "ONBOARD_NEXT" }
  | { type: "GO"; to: TabId | "lesson-entry" | "lesson-complete" }
  | { type: "START_LESSON"; groupId?: string; wordId?: string; wordQueue?: string[] }
  | { type: "LESSON_SELECT_WORD"; wordId: string }
  | { type: "LESSON_ATTEMPT"; wordId?: string; correct: boolean }
  | { type: "LESSON_NEXT" }
  | { type: "LESSON_PREVIOUS" };

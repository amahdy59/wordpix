import type { BlankExercise, MultipleChoiceExercise } from "../../types";

export const ROUND_SIZE = 8;

export type PracticeItem =
  | {
      id: string;
      type: "blank";
      data: BlankExercise;
      answerText: string;
      options: string[];
      correctIndex: number;
    }
  | {
      id: string;
      type: "multipleChoice";
      data: MultipleChoiceExercise;
      answerText: string;
    };

export type SessionPhase =
  | "idle"
  | "answered_correct"
  | "answered_wrong"
  | "retrying"
  | "gave_up"
  | "checkpoint"
  | "completed";

export interface SessionState {
  phase: SessionPhase;
  currentIndex: number;
  pickedIndex: number | null;
  firstTryCorrectCount: number;
  roundCorrectCounts: Record<number, number>;
  reviewAddedWords: string[];
  attemptCount: number;
}

export type SessionAction =
  | { type: "ANSWER_CORRECT"; round: number }
  | { type: "ANSWER_WRONG"; pickedIndex: number }
  | { type: "GAVE_UP" }
  | { type: "RETRY" }
  | { type: "NEXT"; totalItems: number; roundSize: number }
  | { type: "CONTINUE_ROUND" }
  | { type: "COMPLETE" }
  | { type: "RESTART" }
  | { type: "ADD_REVIEW_WORD"; word: string }
  | { type: "INIT_INDEX"; index: number };

export const initialSessionState: SessionState = {
  phase: "idle",
  currentIndex: 0,
  pickedIndex: null,
  firstTryCorrectCount: 0,
  roundCorrectCounts: {},
  reviewAddedWords: [],
  attemptCount: 0,
};

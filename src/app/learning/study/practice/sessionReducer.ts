import type { SessionState, SessionAction } from "./types";

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "ANSWER_CORRECT":
      return {
        ...state,
        phase: "answered_correct",
        firstTryCorrectCount: state.firstTryCorrectCount + 1,
        roundCorrectCounts: {
          ...state.roundCorrectCounts,
          [action.round]: (state.roundCorrectCounts[action.round] ?? 0) + 1,
        },
      };
    case "ANSWER_WRONG":
      return { ...state, phase: "answered_wrong", pickedIndex: action.pickedIndex };
    case "GAVE_UP":
      return { ...state, phase: "gave_up", pickedIndex: null };
    case "RETRY":
      // Only allowed from answered_wrong or gave_up — prevents Next being available during retry
      if (state.phase !== "answered_wrong" && state.phase !== "gave_up") return state;
      return { ...state, phase: "retrying", pickedIndex: null };
    case "NEXT": {
      const nextIndex = state.currentIndex + 1;
      const isEndOfRound = nextIndex % action.roundSize === 0;
      const isLast = nextIndex >= action.totalItems;
      if (isLast) return { ...state, phase: "completed" };
      if (isEndOfRound) return { ...state, phase: "checkpoint" };
      return { ...state, phase: "idle", currentIndex: nextIndex, pickedIndex: null };
    }
    case "CONTINUE_ROUND":
      return { ...state, phase: "idle", currentIndex: state.currentIndex + 1, pickedIndex: null };
    case "COMPLETE":
      return { ...state, phase: "completed" };
    case "ADD_REVIEW_WORD":
      if (state.reviewAddedWords.includes(action.word)) return state;
      return { ...state, reviewAddedWords: [...state.reviewAddedWords, action.word] };
    case "RESTART":
      return {
        phase: "idle",
        currentIndex: 0,
        pickedIndex: null,
        firstTryCorrectCount: 0,
        roundCorrectCounts: {},
        reviewAddedWords: [],
        attemptCount: state.attemptCount + 1,
      };
    case "INIT_INDEX":
      return { ...state, currentIndex: action.index };
    default:
      return state;
  }
}

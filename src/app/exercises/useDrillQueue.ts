import { useCallback, useMemo, useReducer } from "react";
import type { VocabItem } from "../data/lessons";

/**
 * The order in which a drill asks its words, including words it re-asks.
 *
 * Every exercise used to hold a bare `questionIndex` and refuse to move past a
 * wrong answer: the learner was pinned on the same item until they got it
 * right, which is what made the flow feel like an interrogation. Rosetta Stone
 * does the opposite — it shows the right answer, moves on, and brings the
 * missed word back later in the same session. That is what this models.
 *
 * A word is re-queued at most once per drill. Without that cap a learner who
 * keeps missing the same word can never reach the end of the exercise.
 */

interface QueueState {
  /** Word ids still to ask. The head is the current question. */
  pending: string[];
  /** Ids already re-queued once, so they are not queued again. */
  requeued: string[];
  /** How many questions have been answered, right or wrong. */
  answered: number;
  /** Ids answered correctly at least once. */
  correctIds: string[];
}

type QueueAction = { type: "ANSWER"; correct: boolean };

function reducer(state: QueueState, action: QueueAction): QueueState {
  if (action.type !== "ANSWER") return state;

  const [current, ...rest] = state.pending;
  if (!current) return state;

  if (action.correct) {
    return {
      ...state,
      pending: rest,
      answered: state.answered + 1,
      correctIds: state.correctIds.includes(current)
        ? state.correctIds
        : [...state.correctIds, current],
    };
  }

  // Missed: ask it again later in this same drill, but only ever once.
  const shouldRequeue = !state.requeued.includes(current);
  return {
    ...state,
    pending: shouldRequeue ? [...rest, current] : rest,
    requeued: shouldRequeue ? [...state.requeued, current] : state.requeued,
    answered: state.answered + 1,
  };
}

export interface DrillQueue {
  /** The word being asked, or null once the drill is finished. */
  current: VocabItem | null;
  /** The word after this one, or null on the last question — lets a caller
   *  warm its image in the background instead of loading it cold. */
  next: VocabItem | null;
  /** 1-based position of the current question. */
  position: number;
  /** Questions asked so far, including re-asks already scheduled. */
  total: number;
  /** How many of the drill's words have been answered correctly. */
  masteredCount: number;
  /** Total distinct words in the drill. */
  wordCount: number;
  isComplete: boolean;
  /** True when this question is a second look at a word missed earlier. */
  isRetry: boolean;
  submit: (correct: boolean) => void;
}

export function useDrillQueue(words: VocabItem[]): DrillQueue {
  const [state, dispatch] = useReducer(
    reducer,
    words,
    (initial): QueueState => ({
      pending: initial.map((w) => w.id),
      requeued: [],
      answered: 0,
      correctIds: [],
    })
  );

  const currentId = state.pending[0];
  const nextId = state.pending[1];
  const current = useMemo(
    () => words.find((w) => w.id === currentId) ?? null,
    [words, currentId]
  );
  const next = useMemo(
    () => (nextId ? words.find((w) => w.id === nextId) ?? null : null),
    [words, nextId]
  );

  const submit = useCallback((correct: boolean) => {
    dispatch({ type: "ANSWER", correct });
  }, []);

  return {
    current,
    next,
    position: state.answered + 1,
    total: state.answered + state.pending.length,
    masteredCount: state.correctIds.length,
    wordCount: words.length,
    isComplete: state.pending.length === 0,
    isRetry: currentId ? state.requeued.includes(currentId) : false,
    submit,
  };
}

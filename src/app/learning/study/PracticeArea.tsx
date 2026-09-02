import { useState, useReducer, useMemo, useEffect, useCallback, useRef } from "react";
import type { UnitLearningMaterials, BlankExercise, MultipleChoiceExercise } from "../types";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import type { VocabularyItem } from "../../data/lessons";
import { BLANK_TOKEN } from "../types";
import {
  CheckCircle2,
  XCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  RotateCcw,
  Award,
  Sparkles,
} from "lucide-react";
import { recordWordPractice } from "./progress";
import type { UnitStudyProgress } from "./types";
import { useI18n } from "../../context/I18nContext";
import { formatNumber } from "../../shared/useAccessibilityPreferences";
import { useLearner } from "../../context/LearnerContext";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Props {
  materials: UnitLearningMaterials;
  progress: UnitStudyProgress;
  onProgressUpdate: (p: UnitStudyProgress) => void;
  nodeId: string;
  onNextActivity: () => void;
}

type PracticeItem =
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

// â”€â”€â”€ Session State Machine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type SessionPhase =
  | "idle"
  | "answered_correct"
  | "answered_wrong"
  | "retrying"
  | "gave_up"
  | "checkpoint"
  | "completed";

interface SessionState {
  phase: SessionPhase;
  currentIndex: number;
  pickedIndex: number | null;
  firstTryCorrectCount: number;
  roundCorrectCounts: Record<number, number>;
  reviewAddedWords: string[];
  attemptCount: number;
}

type SessionAction =
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

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
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
      // Only allowed from answered_wrong or gave_up â€” prevents Next being available during retry
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

// â”€â”€â”€ Distractor Validation & Item Building â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function stableShuffle<T>(array: T[], seed: number): T[] {
  const copy = [...array];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Builds a validated option set. Returns null when fewer than 2 distinct
 * valid distractors exist â€” caller excludes the item rather than emit nonsense.
 */
function buildValidatedOptions(
  correct: string,
  candidateDistractors: string[],
  seed: number
): { options: string[]; correctIndex: number } | null {
  const normalized = correct.trim().toLowerCase();
  const unique = Array.from(
    new Set(
      candidateDistractors
        .map((d) => d.trim())
        .filter((d) => d.length > 0 && d.toLowerCase() !== normalized)
    )
  ).slice(0, 3);

  if (unique.length < 2) return null;

  const all = stableShuffle([correct, ...unique], seed);
  const correctIndex = all.findIndex((o) => o === correct);
  return { options: all, correctIndex };
}

const ROUND_SIZE = 8;

function buildPracticeItems(
  materials: UnitLearningMaterials,
  vocab: VocabularyItem[],
  attemptCount: number
): PracticeItem[] {
  const list: PracticeItem[] = [];
  let idCounter = 0;

  materials.blankExercises?.forEach((e) => {
    const distractors = vocab
      .map((v) => v.label)
      .filter((l) => l.toLowerCase() !== e.answer.toLowerCase())
      .slice(0, 5);
    const result = buildValidatedOptions(e.answer, distractors, idCounter * 31 + 7);
    idCounter++;
    if (!result) return;
    list.push({
      id: `practice-b-${idCounter}`,
      type: "blank",
      data: e,
      answerText: e.answer,
      ...result,
    });
  });

  materials.additionalExercises?.multipleChoice?.forEach((e) =>
    list.push({
      id: `practice-mc-${idCounter++}`,
      type: "multipleChoice",
      data: e,
      answerText: e.options[e.correctIndex],
    })
  );

  materials.collocationsQuiz?.forEach((e) =>
    list.push({
      id: `practice-col-${idCounter++}`,
      type: "multipleChoice",
      data: e,
      answerText: e.options[e.correctIndex],
    })
  );

  // Rewrite â†’ MC (no reversed-sentence fallback â€” exclude if not enough distractors)
  const allRewrites = materials.additionalExercises?.rewrite ?? [];
  allRewrites.forEach((e, idx) => {
    const correct = e.answer;
    const candidates = [
      e.sentence.replace(/\s*\([A-Z]+\)\s*$/, ""),
      ...allRewrites.filter((_, i) => i !== idx).map((r) => r.answer),
    ];
    const result = buildValidatedOptions(correct, candidates, idx * 71 + 13);
    idCounter++;
    if (!result) return;
    list.push({
      id: `practice-rw-${idCounter}`,
      type: "multipleChoice",
      data: {
        id: e.id,
        question: `Rewrite using "${e.hintWord}": "${e.sentence.replace(/\s*\([A-Z]+\)\s*$/, "")}"`,
        options: result.options,
        correctIndex: result.correctIndex,
        explanation: `The correct rewrite is: "${correct}"`,
      },
      answerText: correct,
    });
  });

  // Error correction â†’ MC (no duplicate wrong-sentence padding)
  const allErrors = materials.errorCorrection ?? [];
  allErrors.forEach((e, idx) => {
    const correct = e.right;
    const candidates = [e.wrong, ...allErrors.filter((_, i) => i !== idx).map((ec) => ec.right)];
    const result = buildValidatedOptions(correct, candidates, idx * 53 + 7);
    idCounter++;
    if (!result) return;
    list.push({
      id: `practice-ec-${idCounter}`,
      type: "multipleChoice",
      data: {
        id: e.id,
        question: `Which sentence is correct?`,
        options: result.options,
        correctIndex: result.correctIndex,
        explanation: `The mistake was: "${e.wrong}"`,
      },
      answerText: correct,
    });
  });

  return stableShuffle(list, 42 + attemptCount * 7919);
}

// â”€â”€â”€ Shared Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Forward navigation icon that flips in RTL. */
function ForwardIcon({ className }: { className?: string }) {
  const { dir } = useI18n();
  return dir === "rtl" ? (
    <ArrowLeft className={className} aria-hidden />
  ) : (
    <ArrowRight className={className} aria-hidden />
  );
}

function MultipleChoiceQuiz({
  itemId,
  question,
  options,
  correctIndex,
  phase,
  onAnswerCorrect,
  onAnswerWrong,
  onGiveUp,
  onRetry,
}: {
  itemId: string;
  question: React.ReactNode;
  options: string[];
  correctIndex: number;
  phase: SessionPhase;
  onAnswerCorrect: (pickedIndex: number) => void;
  onAnswerWrong: (pickedIndex: number) => void;
  onGiveUp: () => void;
  onRetry: () => void;
}) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const { numeralSystem, reduceMotion } = learnerState.accessibility;

  // Local pick state (what the user clicked) â€” separate from session phase
  const [localPick, setLocalPick] = useState<number | null>(null);

  // Reset when moving to a new item
  const prevId = useRef(itemId);
  useEffect(() => {
    if (prevId.current !== itemId) {
      prevId.current = itemId;
      setLocalPick(null);
    }
  }, [itemId]);

  const isAnswered =
    phase === "answered_correct" || phase === "answered_wrong" || phase === "gave_up";

  const isInRetry = phase === "retrying";

  const handlePick = useCallback(
    (i: number) => {
      // Accept picks only in idle or retrying states
      if (phase !== "idle" && phase !== "retrying") return;
      setLocalPick(i);
      if (i === correctIndex) {
        onAnswerCorrect(i);
      } else {
        onAnswerWrong(i);
      }
    },
    [phase, correctIndex, onAnswerCorrect, onAnswerWrong]
  );

  // Number-key shortcuts (1â€“4) scoped to this exercise
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)
      )
        return;
      if (!/^[1-9]$/.test(e.key)) return;
      const index = Number(e.key) - 1;
      if (index < options.length) {
        e.preventDefault();
        handlePick(index);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [options.length, handlePick]);

  const questionId = `question-label-${itemId}`;

  return (
    <div
      className={`rounded-3xl border border-border p-6 sm:p-7 bg-card shadow-xs h-full flex flex-col justify-center ${
        reduceMotion ? "" : "animate-in fade-in duration-200"
      }`}
    >
      {/* Question â€” English learning content always carries explicit lang+dir */}
      <div
        id={questionId}
        className="mb-6 font-extrabold text-lg sm:text-xl text-foreground leading-relaxed"
        lang="en"
        dir="ltr"
      >
        {question}
      </div>

      {/* Answer choices â€” grouped for screen readers */}
      <div role="group" aria-labelledby={questionId} className="grid gap-3">
        {options.map((opt, i) => {
          const isPickedCorrect = phase === "answered_correct" && localPick === i;
          const isPickedWrong = phase === "answered_wrong" && localPick === i;
          const isRevealedCorrect =
            (phase === "answered_wrong" || phase === "gave_up") && i === correctIndex;

          const visualState: "correct" | "wrong" | "neutral" =
            isPickedCorrect || isRevealedCorrect ? "correct" : isPickedWrong ? "wrong" : "neutral";

          // aria-disabled: preserves focus, prevents activation â€” correct a11y pattern
          const isDisabled = isAnswered && !isInRetry;

          return (
            <button
              key={i}
              type="button"
              aria-disabled={isDisabled ? "true" : undefined}
              onClick={() => !isDisabled && handlePick(i)}
              className={`w-full text-start p-4 rounded-2xl border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm sm:text-base min-h-[56px] ${
                visualState === "correct"
                  ? "border-wp-green bg-wp-green-light/10 text-wp-green font-bold shadow-xs"
                  : visualState === "wrong"
                    ? "border-destructive/40 bg-destructive/5 text-destructive font-semibold"
                    : isDisabled
                      ? "border-border opacity-60 font-medium cursor-default"
                      : "border-border hover:border-primary/50 hover:bg-secondary/40 font-medium active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                    visualState === "correct"
                      ? "border-wp-green bg-wp-green text-white"
                      : visualState === "wrong"
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground bg-secondary/50"
                  }`}
                >
                  {visualState === "correct" ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : visualState === "wrong" ? (
                    <XCircle className="size-3.5" />
                  ) : (
                    formatNumber(i + 1, numeralSystem)
                  )}
                </div>
                {/* English vocabulary options always carry lang/dir */}
                <span className="flex-1" lang="en" dir="ltr">
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback text â€” live region contains only text, NOT interactive controls */}
      {isAnswered && (
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-4">
          {phase === "answered_correct" ? (
            <p className="text-sm font-bold text-wp-green flex items-center gap-2 bg-wp-green-light/20 p-3 rounded-xl border border-wp-green/30">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden />
              {t("practice.correct")}
            </p>
          ) : (
            <div className="p-3 rounded-xl bg-secondary/30 border border-border text-sm">
              <p className="font-semibold text-foreground mb-0.5">{t("practice.notYet")}</p>
              <p className="text-muted-foreground">
                {t("practice.correctAnswer", { answer: options[correctIndex] })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Try Again â€” interactive control OUTSIDE the live region */}
      {(phase === "answered_wrong" || phase === "gave_up") && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onRetry}
            className="px-3.5 py-1.5 border border-primary/50 text-primary rounded-xl text-xs hover:bg-primary/10 transition-colors min-h-[44px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("practice.tryAgain")}
          </button>
        </div>
      )}

      {/* I don't know â€” only available before answering */}
      {phase === "idle" && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onGiveUp}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            <HelpCircle className="size-4" aria-hidden />
            <span>{t("practice.iDontKnow")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function RoundCheckpointCard({
  roundNumber,
  totalRounds: _totalRounds,
  roundCorrect,
  roundTotal,
  onContinueNextRound,
  onPause,
  isFinalRound,
}: {
  roundNumber: number;
  totalRounds: number;
  roundCorrect: number;
  roundTotal: number;
  onContinueNextRound: () => void;
  /** Pauses session â€” does NOT mark node complete */
  onPause: () => void;
  isFinalRound: boolean;
}) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const { numeralSystem, reduceMotion } = learnerState.accessibility;

  const percent = Math.round((roundCorrect / Math.max(1, roundTotal)) * 100);
  const roundLabel = percent >= 80 ? t("practice.roundStrong") : t("practice.roundGood");

  return (
    <div
      className={`rounded-3xl border border-border p-6 sm:p-8 bg-card shadow-xs text-center ${
        reduceMotion ? "" : "animate-in fade-in zoom-in-95 duration-200"
      } flex flex-col items-center max-w-lg mx-auto w-full`}
      role="region"
      aria-labelledby="checkpoint-heading"
    >
      <div className="size-16 rounded-2xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-4 border border-wp-green/30 shadow-xs">
        <Sparkles className="size-8" aria-hidden />
      </div>
      {/* Round counter â€” semantic eyebrow label (no uppercase in Arabic via CSS) */}
      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1 [lang='ar']:[text-transform:none] [lang='ar']:[letter-spacing:normal]">
        {t("practice.roundComplete", { round: formatNumber(roundNumber, numeralSystem) })}
      </div>
      <h2 id="checkpoint-heading" className="text-2xl font-extrabold text-foreground mb-2">
        {roundLabel}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        {t("practice.roundScore", {
          correct: formatNumber(roundCorrect, numeralSystem),
          total: formatNumber(roundTotal, numeralSystem),
          percent: formatNumber(percent, numeralSystem),
        })}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        {!isFinalRound ? (
          <>
            {/* Pause â€” does NOT mark complete */}
            <button
              type="button"
              onClick={onPause}
              className="px-5 py-3 border border-border text-foreground rounded-2xl font-bold text-sm hover:bg-secondary transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t("practice.finishForNow")}
            </button>
            <button
              type="button"
              onClick={onContinueNextRound}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>
                {t("practice.startRound", { round: formatNumber(roundNumber + 1, numeralSystem) })}
              </span>
              <ForwardIcon className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onContinueNextRound}
            className="px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>{t("practice.viewSummary")}</span>
            <ForwardIcon className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function PracticeArea({
  materials,
  progress,
  onProgressUpdate,
  nodeId,
  onNextActivity,
}: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const { numeralSystem, reduceMotion } = learnerState.accessibility;

  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);

  const [session, dispatch] = useReducer(sessionReducer, {
    phase: "idle" as SessionPhase,
    currentIndex: 0,
    pickedIndex: null,
    firstTryCorrectCount: 0,
    roundCorrectCounts: {},
    reviewAddedWords: [],
    attemptCount: 0,
  });

  // Build items â€” reshuffled only when attemptCount changes (restart)
  const items = useMemo(
    () => buildPracticeItems(materials, vocab, session.attemptCount),
    [materials, vocab, session.attemptCount]
  );

  // Restore saved position on mount only
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const saved = Math.min(progress.nodePositions?.[nodeId] ?? 0, Math.max(items.length - 1, 0));
    if (saved > 0) dispatch({ type: "INIT_INDEX", index: saved });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { currentIndex, phase } = session;

  // Round math
  const totalRounds = Math.max(1, Math.ceil(items.length / ROUND_SIZE));
  const currentRound = Math.min(totalRounds, Math.floor(currentIndex / ROUND_SIZE) + 1);
  const indexInRound = (currentIndex % ROUND_SIZE) + 1;
  const currentRoundTotal = Math.min(ROUND_SIZE, items.length - (currentRound - 1) * ROUND_SIZE);

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleAnswerCorrect = useCallback(
    (_pickedIndex: number) => {
      const word = items[currentIndex]?.answerText ?? "";
      if (word) {
        const matched = vocab.find(
          (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
        );
        if (matched) onProgressUpdate(recordWordPractice(progress, matched.id, true));
      }
      dispatch({ type: "ANSWER_CORRECT", round: currentRound });
    },
    [currentIndex, items, vocab, progress, onProgressUpdate, currentRound]
  );

  const handleAnswerWrong = useCallback(
    (pickedIdx: number) => {
      const word = items[currentIndex]?.answerText ?? "";
      if (word) {
        const matched = vocab.find(
          (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
        );
        if (matched) {
          onProgressUpdate(recordWordPractice(progress, matched.id, false));
          dispatch({ type: "ADD_REVIEW_WORD", word: matched.label });
        }
      }
      dispatch({ type: "ANSWER_WRONG", pickedIndex: pickedIdx });
    },
    [currentIndex, items, vocab, progress, onProgressUpdate]
  );

  const handleGaveUp = useCallback(() => {
    const word = items[currentIndex]?.answerText ?? "";
    if (word) {
      const matched = vocab.find(
        (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
      );
      if (matched) {
        onProgressUpdate(recordWordPractice(progress, matched.id, false));
        dispatch({ type: "ADD_REVIEW_WORD", word: matched.label });
      }
    }
    dispatch({ type: "GAVE_UP" });
  }, [currentIndex, items, vocab, progress, onProgressUpdate]);

  const handleRetry = useCallback(() => dispatch({ type: "RETRY" }), []);

  /**
   * "Finish for Now" â€” saves position and returns to activity list.
   * Does NOT add the node to completedNodeIds.
   */
  const handlePause = useCallback(() => {
    onProgressUpdate({
      ...progress,
      nodePositions: { ...progress.nodePositions, [nodeId]: currentIndex },
    });
    onNextActivity();
  }, [progress, onProgressUpdate, nodeId, currentIndex, onNextActivity]);

  /**
   * Genuine completion â€” marks the node done and resets saved position.
   */
  const handleComplete = useCallback(() => {
    onProgressUpdate({
      ...progress,
      completedNodeIds: progress.completedNodeIds.includes(nodeId)
        ? progress.completedNodeIds
        : [...progress.completedNodeIds, nodeId],
      nodePositions: { ...progress.nodePositions, [nodeId]: 0 },
    });
    dispatch({ type: "COMPLETE" });
  }, [progress, onProgressUpdate, nodeId]);

  const handleNext = useCallback(() => {
    onProgressUpdate({
      ...progress,
      nodePositions: { ...progress.nodePositions, [nodeId]: currentIndex + 1 },
    });
    dispatch({ type: "NEXT", totalItems: items.length, roundSize: ROUND_SIZE });
  }, [progress, onProgressUpdate, nodeId, currentIndex, items.length]);

  const handleContinueNextRound = useCallback(() => {
    const isLast = currentIndex + 1 >= items.length;
    if (isLast) {
      handleComplete();
    } else {
      onProgressUpdate({
        ...progress,
        nodePositions: { ...progress.nodePositions, [nodeId]: currentIndex + 1 },
      });
      dispatch({ type: "CONTINUE_ROUND" });
    }
  }, [currentIndex, items.length, handleComplete, progress, onProgressUpdate, nodeId]);

  const handleRestart = useCallback(() => dispatch({ type: "RESTART" }), []);

  // â”€â”€ Empty state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground flex-1 flex items-center justify-center">
        {t("practice.noExercises")}
      </div>
    );
  }

  // â”€â”€ Completion screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (phase === "completed") {
    const answeredCount = Math.max(1, currentIndex + 1);
    const scorePercent = Math.round((session.firstTryCorrectCount / answeredCount) * 100);
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-2xl mx-auto w-full text-center ${
          reduceMotion ? "" : "animate-in fade-in zoom-in-95 duration-300"
        }`}
      >
        <div className="size-20 rounded-3xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-6 shadow-xs border border-wp-green/30">
          <Award className="size-10" aria-hidden />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-foreground">
          {t("practice.sessionComplete")}
        </h1>
        <p className="text-muted-foreground text-base mb-6">
          {t("practice.sessionScore", {
            correct: formatNumber(session.firstTryCorrectCount, numeralSystem),
            total: formatNumber(answeredCount, numeralSystem),
            percent: formatNumber(scorePercent, numeralSystem),
          })}
        </p>

        {session.reviewAddedWords.length > 0 && (
          <div className="w-full bg-secondary/30 border border-border rounded-3xl p-5 mb-8 text-start">
            <h2 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
              <RotateCcw className="size-4 text-wp-amber" aria-hidden />
              {t("practice.wordsForReview", {
                count: formatNumber(session.reviewAddedWords.length, numeralSystem),
              })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {session.reviewAddedWords.map((w) => (
                <span
                  key={w}
                  lang="en"
                  dir="ltr"
                  className="px-3 py-1 bg-background border border-border rounded-full text-xs font-bold text-foreground"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          <button
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border text-foreground font-bold rounded-2xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs min-h-[48px]"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span>{t("practice.practiceAgain")}</span>
          </button>
          <button
            onClick={onNextActivity}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] shadow-xs"
          >
            <span>
              {session.reviewAddedWords.length > 0
                ? t("practice.continueToReview")
                : t("practice.continueNext")}
            </span>
            <ForwardIcon className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Checkpoint screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (phase === "checkpoint") {
    return (
      <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <h1 className="sr-only">{t("practice.roundCheckpointLabel")}</h1>
        <RoundCheckpointCard
          roundNumber={currentRound}
          totalRounds={totalRounds}
          roundCorrect={session.roundCorrectCounts[currentRound] ?? 0}
          roundTotal={ROUND_SIZE}
          onContinueNextRound={handleContinueNextRound}
          onPause={handlePause}
          isFinalRound={currentRound >= totalRounds}
        />
      </div>
    );
  }

  // â”€â”€ Exercise screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const answered =
    phase === "answered_correct" || phase === "answered_wrong" || phase === "gave_up";
  const progressPercent = Math.round(((currentIndex + (answered ? 1 : 0)) / items.length) * 100);
  const item = items[currentIndex];

  // Next is available when session is answered (correct, wrong, or gave-up)
  const canShowNext = answered;

  const nextLabel =
    (currentIndex + 1) % ROUND_SIZE === 0 && currentIndex < items.length - 1
      ? t("practice.roundCheckpointAction")
      : currentIndex < items.length - 1
        ? t("practice.nextExercise")
        : t("practice.finishPractice");

  const renderQuestion = () => {
    if (item.type === "blank") {
      const parts = item.data.sentence.split(BLANK_TOKEN);
      const questionNode = (
        <span>
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span
                  className="inline-block w-16 border-b-2 border-primary mx-1 translate-y-[2px]"
                  aria-hidden
                />
              )}
            </span>
          ))}
        </span>
      );
      return (
        <MultipleChoiceQuiz
          key={item.id}
          itemId={item.id}
          question={questionNode}
          options={item.options}
          correctIndex={item.correctIndex}
          phase={phase}
          onAnswerCorrect={handleAnswerCorrect}
          onAnswerWrong={handleAnswerWrong}
          onGiveUp={handleGaveUp}
          onRetry={handleRetry}
        />
      );
    }

    if (item.type === "multipleChoice") {
      return (
        <MultipleChoiceQuiz
          key={item.id}
          itemId={item.id}
          question={item.data.question}
          options={item.data.options}
          correctIndex={item.data.correctIndex}
          phase={phase}
          onAnswerCorrect={handleAnswerCorrect}
          onAnswerWrong={handleAnswerWrong}
          onGiveUp={handleGaveUp}
          onRetry={handleRetry}
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Header & Progress */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="min-w-0 flex-1">
            {/* Round indicator â€” secondary, compact */}
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-extrabold text-xs inline-block mb-1">
              {t("practice.roundOf", {
                current: formatNumber(currentRound, numeralSystem),
                total: formatNumber(totalRounds, numeralSystem),
              })}
            </span>
            {/* H1 wraps naturally â€” no truncate */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">
              {t("practice.title")}
            </h1>
          </div>
          {/* Primary overall counter */}
          <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full shrink-0 mt-1">
            {t("practice.totalOf", {
              current: formatNumber(currentIndex + 1, numeralSystem),
              total: formatNumber(items.length, numeralSystem),
            })}
          </span>
        </div>

        {/* Progress bar â€” transition-[width] not transition-all */}
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("practice.progressAria", {
              current: formatNumber(currentIndex + 1, numeralSystem),
              total: formatNumber(items.length, numeralSystem),
            })}
          />
        </div>
      </div>

      {/* Screen-reader announcement â€” only text, no controls */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {t("practice.roundAnnouncement", {
          round: formatNumber(currentRound, numeralSystem),
          total: formatNumber(totalRounds, numeralSystem),
          question: formatNumber(indexInRound, numeralSystem),
          roundTotal: formatNumber(currentRoundTotal, numeralSystem),
        })}
      </div>

      {/* Exercise */}
      <div className="w-full">{renderQuestion()}</div>

      {/* Next action â€” absent while retrying so the session phase contract is honoured */}
      {canShowNext && (
        <div
          className={`w-full mt-6 flex justify-end ${
            reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-2 duration-200"
          }`}
        >
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs min-h-[48px]"
          >
            <span>{nextLabel}</span>
            <ForwardIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

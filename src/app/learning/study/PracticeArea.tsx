import { useReducer, useMemo, useEffect, useCallback, useRef } from "react";
import type { UnitLearningMaterials } from "../types";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import type { VocabularyItem } from "../../data/lessons";
import { BLANK_TOKEN } from "../types";
import { recordWordPractice } from "./progress";
import type { UnitStudyProgress } from "./types";
import { useI18n } from "../../context/I18nContext";
import { formatNumber } from "../../shared/useAccessibilityPreferences";
import { useLearner } from "../../context/LearnerContext";
import {
  ROUND_SIZE,
  initialSessionState,
  sessionReducer,
  buildPracticeItems,
  ForwardIcon,
  MultipleChoiceQuiz,
  RoundCheckpointCard,
  SessionCompleteCard,
} from "./practice";

interface Props {
  materials: UnitLearningMaterials;
  progress: UnitStudyProgress;
  onProgressUpdate: (p: UnitStudyProgress) => void;
  nodeId: string;
  onNextActivity: () => void;
}

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

  const [session, dispatch] = useReducer(sessionReducer, initialSessionState);

  // Build items — reshuffled only when attemptCount changes (restart)
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

  // ─── Handlers ─────────────────────────────────────────────────────────────

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
   * "Finish for Now" — saves position and returns to activity list.
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
   * Genuine completion — marks the node done and resets saved position.
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

  // ─── Empty state ──────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground flex-1 flex items-center justify-center">
        {t("practice.noExercises")}
      </div>
    );
  }

  // ─── Completion screen ────────────────────────────────────────────────────

  if (phase === "completed") {
    return (
      <SessionCompleteCard
        firstTryCorrectCount={session.firstTryCorrectCount}
        totalAnswered={currentIndex + 1}
        reviewAddedWords={session.reviewAddedWords}
        onRestart={handleRestart}
        onNextActivity={onNextActivity}
      />
    );
  }

  // ─── Checkpoint screen ────────────────────────────────────────────────────

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

  // ─── Exercise screen ──────────────────────────────────────────────────────

  const answered =
    phase === "answered_correct" || phase === "answered_wrong" || phase === "gave_up";
  const progressPercent = Math.round(((currentIndex + (answered ? 1 : 0)) / items.length) * 100);
  const item = items[currentIndex];

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
          {parts.map((part: string, i: number) => (
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
            {/* Round indicator — secondary, compact */}
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-extrabold text-xs inline-block mb-1">
              {t("practice.roundOf", {
                current: formatNumber(currentRound, numeralSystem),
                total: formatNumber(totalRounds, numeralSystem),
              })}
            </span>
            {/* H1 wraps naturally — no truncate */}
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

        {/* Progress bar — transition-[width] not transition-all */}
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

      {/* Screen-reader announcement — only text, no controls */}
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

      {/* Next action — absent while retrying so the session phase contract is honoured */}
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

import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getDistractors } from "./exerciseContent";
import { shuffleArray } from "../../utils/shuffle";
import { Button } from "../shared/Button";
import { useAudio } from "../shared/useAudio";
import { Volume2, Keyboard, ArrowRight } from "lucide-react";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useSpokenFeedback } from "../shared/useSpokenFeedback";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "../context/I18nContext";
import { ImmersiveImageChoiceGrid } from "../shared/ImmersiveImageChoiceGrid";
import { ImageChoiceCard } from "../shared/ImageChoiceCard";
import { useKeyboardShortcutsActive } from "../shared/devicePreferences";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const shortcutsActive = useKeyboardShortcutsActive();

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  usePrefetchImage(queue.next);
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.85 });
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const spoken = useSpokenFeedback();
  const hasSpokenRef = useRef<Record<string, boolean>>({});

  const displayCards = useMemo(() => {
    const distractors = getDistractors(currentTargetWord, 3, words);
    return shuffleArray([currentTargetWord, ...distractors]);
  }, [currentTargetWord, words]);

  /** Clears the result and lets the queue's next question render. */
  const advanceNext = useCallback(() => {
    if (feedback !== null) queue.submit(feedback === "correct");
    setSelectedId(null);
    setFeedback(null);
  }, [feedback, queue]);

  const autoAdvance = useAutoAdvance({
    enabled: accessibility.autoAdvance,
    onAdvance: advanceNext,
  });

  // The drill ends on the answer that empties the queue, so leaving for the
  // next step has to wait until that last piece of feedback has been cleared â€”
  // otherwise the learner never sees the result of their final answer.
  useEffect(() => {
    if (queue.isComplete && feedback === null) dispatch({ type: "LESSON_NEXT" });
  }, [queue.isComplete, feedback, dispatch]);

  const currentQuestionKey = `${queue.position}:${currentTargetWord.id}`;
  useEffect(() => {
    stop();
    if (accessibility.autoPlayAudio === false) return undefined;
    if (hasSpokenRef.current[currentQuestionKey]) return undefined;
    // The flag is set when the prompt actually plays, not when it is
    // scheduled. Keyed by queue position and word id so retried questions and
    // consecutive words each play their audio prompt automatically.
    const t = setTimeout(() => {
      hasSpokenRef.current[currentQuestionKey] = true;
      speak(currentTargetWord.label);
    }, 200);
    return () => clearTimeout(t);
  }, [currentQuestionKey, currentTargetWord.label, speak, stop, accessibility.autoPlayAudio]);

  const replayAudio = useCallback(() => {
    stop();
    speak(currentTargetWord.label);
  }, [stop, speak, currentTargetWord.label]);

  const handleCardClick = useCallback(
    (card: VocabularyItem) => {
      // One answer per question. Extra taps while the result is on screen used
      // to be recorded as further attempts against the same word.
      if (feedback !== null) return;

      setSelectedId(card.id);
      const correct = card.id === currentTargetWord.id;

      if (correct) {
        setFeedback("correct");
        playCorrect();
      } else {
        setFeedback("incorrect");
        playIncorrect();
      }

      // The prompt voice and the feedback voice share the browser's one
      // synthesis queue, so silence the prompt before answering over it.
      stop();
      spoken.speakFeedback(
        {
          correct,
          targetLabel: currentTargetWord.label,
          targetTopic: currentTargetWord.topic,
          chosenLabel: card.label,
          chosenTopic: currentTargetWord.topic,
        },
        () => {
          autoAdvance.schedule(
            spoken.enabled ? 200 : correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect,
            correct
          );
        }
      );

      dispatch({
        type: "LESSON_ATTEMPT",
        wordId: currentTargetWord.id,
        correct,
        dimension: "listening-recognition",
      });
    },
    [
      feedback,
      currentTargetWord.id,
      currentTargetWord.label,
      currentTargetWord.topic,
      playCorrect,
      playIncorrect,
      stop,
      spoken,
      dispatch,
      autoAdvance,
    ]
  );

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    spoken.cancel();
    advanceNext();
  }, [autoAdvance, spoken, advanceNext]);

  const selectByIndex = useCallback(
    (index: number) => {
      const card = displayCards[index];
      if (!card) return;
      playClick();
      handleCardClick(card);
    },
    [displayCards, playClick, handleCardClick]
  );

  useExerciseHotkeys({
    optionCount: displayCards.length,
    onSelectIndex: selectByIndex,
    onReplayAudio: replayAudio,
    onContinue: feedback !== null ? handleContinue : undefined,
    disabled: feedback !== null,
  });

  const group = useMemo(
    () =>
      resolveGroup(
        lessonId,
        words.map((w) => w.id)
      ),
    [lessonId, words]
  );

  return (
    <ExerciseShell
      step={step}
      title="Audio Match"
      layout="media"
      progressLabel="Question"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span>{group.name}</span>
          <span>{t("exercise.positionOf", { current: queue.position, total: queue.total })}</span>
        </>
      }
    >
      <div className="wp-container-immersive relative flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
        <div className="flex shrink-0 flex-row items-center justify-between gap-3">
          <div className="text-start">
            <p className="font-sans text-sm font-bold text-foreground sm:text-base">
              {t("exercise.choosePictureHeard")}
            </p>
            <div className="mt-0.5 hidden items-center gap-1.5 text-xs font-medium text-muted-foreground pointer-fine:flex">
              <Keyboard className="size-4" aria-hidden />
              <span>{t("exercise.pressNumberRecall", { count: displayCards.length })}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={replayAudio}
            aria-label={t("exercise.replayAudio")}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-wp-card px-4 py-2 text-sm font-bold text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-6"
          >
            <Volume2
              className={`size-4 sm:size-5 ${isPlaying ? "motion-safe:animate-pulse" : ""}`}
              aria-hidden
            />
            <span>{t("exercise.replay")}</span>
          </button>
          <p className="sr-only" role="status">
            {isPlaying
              ? "Playing audio"
              : queue.isRetry
                ? "Try again. Choose the picture you hear."
                : "Choose the picture you hear."}
          </p>
        </div>
        <ImmersiveImageChoiceGrid aria-label="Choose matching picture for audio prompt">
          {displayCards.map((card, idx) => (
            <ImageChoiceCard
              key={card.id}
              option={card}
              index={idx}
              totalOptions={displayCards.length}
              isSelected={selectedId === card.id}
              feedback={feedback}
              isRevealedAnswer={feedback === "incorrect" && card.id === currentTargetWord.id}
              disabled={feedback !== null}
              onClick={() => handleCardClick(card)}
              reduceMotion={Boolean(reduceMotion)}
              showShortcut={shortcutsActive}
            />
          ))}
        </ImmersiveImageChoiceGrid>

        {/* Feedback status announcement for screen readers */}
        <p className="sr-only" role="status" aria-live="polite">
          {feedback === "correct"
            ? t("ux.correct")
            : feedback === "incorrect"
              ? t("ux.tryAgain")
              : ""}
        </p>

        {/* Continue strip — only shown on incorrect answers when manual advance is preferred */}
        <AnimatePresence>
          {feedback === "incorrect" && !accessibility.autoAdvance && (
            <motion.div
              key="continue-strip"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.3 }}
              className="shrink-0 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 border bg-wp-rose/10 border-wp-rose/30"
            >
              <span className="font-sans font-semibold text-foreground text-sm">
                {t("ux.matchHint", { word: currentTargetWord.label })}
              </span>
              <button
                type="button"
                onClick={replayAudio}
                className="min-h-11 min-w-11 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("ux.listenAgain")}
              </button>
              <Button
                onClick={handleContinue}
                hotkey="↵ Enter"
                size="sm"
                iconRight={<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
              >
                {t("action.continue")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExerciseShell>
  );
});

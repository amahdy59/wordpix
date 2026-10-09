import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence, getDistractors } from "./exerciseContent";
import { identifySentence } from "../content/wordGrammar";
import { shuffleArray } from "../../utils/shuffle";
import { WordImage } from "../shared/WordImage";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useSpokenFeedback } from "../shared/useSpokenFeedback";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { HelpCircle, Keyboard, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "../context/I18nContext";
import { ImmersiveImageChoiceGrid } from "../shared/ImmersiveImageChoiceGrid";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const spoken = useSpokenFeedback();

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);
  usePrefetchImage(queue.next);

  const options = useMemo(() => {
    const distractors = getDistractors(currentTargetWord, 3, words);
    return shuffleArray([currentTargetWord, ...distractors]);
  }, [currentTargetWord, words]);

  const advanceNext = useCallback(() => {
    if (feedback !== null) queue.submit(feedback === "correct");
    setSelectedId(null);
    setFeedback(null);
  }, [feedback, queue]);

  const autoAdvance = useAutoAdvance({
    enabled: accessibility.autoAdvance,
    onAdvance: advanceNext,
  });

  useEffect(() => {
    if (queue.isComplete && feedback === null) dispatch({ type: "LESSON_NEXT" });
  }, [queue.isComplete, feedback, dispatch]);

  const handleSelect = useCallback(
    (id: string) => {
      if (feedback !== null) return;
      playClick();
      setSelectedId(id);

      const correct = id === currentTargetWord.id;
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) playCorrect();
      else playIncorrect();

      spoken.speakFeedback(
        {
          correct,
          targetLabel: currentTargetWord.label,
          targetTopic: currentTargetWord.topic,
          chosenLabel: options.find((o) => o.id === id)?.label,
          chosenTopic: currentTargetWord.topic,
        },
        () => {
          // Extra 200ms pause after voice finishes so it doesn't snap instantly
          autoAdvance.schedule(
            spoken.enabled ? 200 : correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect
          );
        }
      );

      dispatch({
        type: "LESSON_ATTEMPT",
        wordId: currentTargetWord.id,
        correct,
        dimension: "visual-recognition",
      });
    },
    [
      feedback,
      playClick,
      playCorrect,
      playIncorrect,
      currentTargetWord.id,
      currentTargetWord.label,
      currentTargetWord.topic,
      options,
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
      const option = options[index];
      if (option) handleSelect(option.id);
    },
    [options, handleSelect]
  );

  useExerciseHotkeys({
    optionCount: options.length,
    onSelectIndex: selectByIndex,
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
      title="Mastery Quick Quiz"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      layout="media"
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <HelpCircle className="size-3" aria-hidden />
            <span>{t("exercise.questionOf", { current: queue.position, total: queue.total })}</span>
          </span>
        </>
      }
      // The keyboard hint is shown only where there is a keyboard.
      // `pointer-fine` asks the device directly, which a width breakpoint only
      // guesses at: a tablet in landscape is wide and still has nothing to
      // press "1" with, and telling a learner to press a key they do not have
      // is noise in the one strip of the screen reserved for what to do next.
      footer={
        <div className="w-full hidden pointer-fine:flex items-center text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber-foreground font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>{t("exercise.pressNumberToChoose", { count: options.length })}</span>
          </div>
        </div>
      }
    >
      <div className="relative flex min-h-[560px] w-full flex-1 flex-col gap-3.5 sm:min-h-[640px] sm:gap-5 lg:min-h-[320px]">
        {/* Question card */}
        <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-border bg-wp-card p-4 shadow-wp-xs sm:p-5 lg:p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2
              className="font-sans font-black text-foreground text-base sm:text-lg md:text-xl flex-1 text-balance"
              data-question="Which picture shows"
            >
              {t("exercise.whichPictureShows", { word: currentTargetWord.label })}
            </h2>
            <span className="text-[11px] font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap">
              /{currentTargetWord.phonetic}/
            </span>
          </div>
        </div>

        {/* Immersive 2x2 grid that becomes a full-width row on large screens. */}
        <ImmersiveImageChoiceGrid aria-label={`Which image matches ${currentTargetWord.label}?`}>
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isCorrectAnswer = option.id === currentTargetWord.id;
            const isRevealedAnswer = feedback === "incorrect" && isCorrectAnswer;

            // Border: correct=green, wrong-selected=red, revealed-correct=green, else neutral
            let borderStyle = "border-border hover:border-primary/60";
            if (isSelected && feedback === "correct") borderStyle = "border-wp-green";
            else if (isSelected && feedback === "incorrect") borderStyle = "border-wp-rose";
            else if (isRevealedAnswer) borderStyle = "border-wp-green";

            // Overlay type for this cell
            const showCorrectOverlay = isSelected && feedback === "correct";
            const showIncorrectOverlay = isSelected && feedback === "incorrect";

            return (
              <motion.button
                key={option.id}
                type="button"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 17 }
                }
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                aria-label={`Option ${idx + 1} of ${options.length}. Shortcut: press ${idx + 1}. ${option.description}`}
                aria-pressed={isSelected}
                aria-disabled={feedback !== null}
                onClick={() => handleSelect(option.id)}
                className={`group relative block min-h-[120px] w-full overflow-hidden rounded-2xl border-2 shadow-wp-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:rounded-3xl ${borderStyle}`}
              >
                {/* Keyboard shortcut badge */}
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-2 start-2 z-10 bg-black/60 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 shadow-sm backdrop-blur-md pointer-events-none"
                >
                  [{idx + 1}]
                </span>

                {/* Image */}
                <div className="size-full relative bg-muted">
                  <WordImage
                    word={option}
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isRevealedAnswer}
                    className="size-full object-cover block"
                    // Every option is on screen and has to be looked at to
                    // answer, so lazy loading only delays the question.
                    loading="eager"
                  />
                </div>

                {/* â”€â”€ Per-image feedback overlay â”€â”€ */}
                <AnimatePresence>
                  {(showCorrectOverlay || showIncorrectOverlay) && (
                    <motion.div
                      key={`overlay-${option.id}`}
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
                      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none ${
                        showIncorrectOverlay
                          ? "bg-wp-rose/70 backdrop-blur-[2px]"
                          : "bg-wp-green/70 backdrop-blur-[2px]"
                      }`}
                    >
                      <motion.div
                        initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 450, damping: 20, delay: 0.05 }
                        }
                      >
                        {showIncorrectOverlay ? (
                          <XCircle
                            className="size-10 sm:size-12 text-white drop-shadow-lg"
                            aria-hidden
                          />
                        ) : (
                          <CheckCircle2
                            className="size-10 sm:size-12 text-white drop-shadow-lg"
                            aria-hidden
                          />
                        )}
                      </motion.div>

                      <motion.span
                        initial={reduceMotion ? false : { y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={reduceMotion ? { duration: 0 } : { delay: 0.15 }}
                        className="font-sans font-black text-white text-sm sm:text-base drop-shadow text-center px-2"
                      >
                        {showIncorrectOverlay ? "Wrong" : "Correct!"}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </ImmersiveImageChoiceGrid>

        {/* Screen-reader announcement */}
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {feedback === "correct"
            ? `Correct! ${identifySentence(currentTargetWord.label, currentTargetWord.topic)} ${richSentence.full}`
            : feedback === "incorrect"
              ? `Incorrect. The correct answer is ${currentTargetWord.label}.`
              : ""}
        </span>

        {/* Continue strip — appears below grid after answer, replaces old AnswerFeedback bar */}
        <AnimatePresence>
          {feedback !== null && !accessibility.autoAdvance && (
            <motion.div
              key="continue-strip"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.3 }}
              className={`shrink-0 rounded-2xl px-5 py-3 flex items-center justify-between gap-3 border ${
                feedback === "correct"
                  ? "bg-wp-green/10 border-wp-green/30"
                  : "bg-wp-rose/10 border-wp-rose/30"
              }`}
            >
              <span className="font-sans font-semibold text-foreground text-sm">
                {feedback === "correct"
                  ? `✓ ${identifySentence(currentTargetWord.label, currentTargetWord.topic)}`
                  : `✗ ${identifySentence(currentTargetWord.label, currentTargetWord.topic)}`}
              </span>
              <button
                type="button"
                onClick={handleContinue}
                className="flex items-center gap-1.5 px-4 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-sm transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shrink-0"
              >
                {t("action.continue")}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExerciseShell>
  );
});

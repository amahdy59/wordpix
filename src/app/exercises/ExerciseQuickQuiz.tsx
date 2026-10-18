import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence, getDistractors } from "./exerciseContent";
import { identifySentence } from "../content/wordGrammar";
import { shuffleArray } from "../../utils/shuffle";
import { WordImage, getWordImageSrc } from "../shared/WordImage";
import { Button } from "../shared/Button";
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
            spoken.enabled ? 200 : correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect,
            correct
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
      <div className="relative flex min-h-0 w-full flex-1 flex-col gap-3.5 sm:min-h-[500px] sm:gap-5 lg:min-h-[320px]">
        {/* Question card */}
        <div className="flex shrink-0 flex-col gap-3 py-2">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2
              className="font-sans font-black text-foreground text-base sm:text-lg md:text-xl flex-1 text-balance"
              data-question="Which picture shows"
            >
              {t("exercise.whichPictureShows", { word: currentTargetWord.label })}
            </h2>
            <span className="text-sm font-sans font-semibold text-muted-foreground shrink-0 whitespace-nowrap">
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
                className={`group relative block aspect-square sm:aspect-auto min-h-[120px] w-full overflow-hidden rounded-2xl border-2 shadow-wp-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:rounded-3xl ${borderStyle}`}
              >
                {/* Option / Keyboard shortcut badge */}
                <span
                  aria-hidden
                  className="absolute top-2 start-2 z-10 size-8 sm:size-9 md:size-11 flex items-center justify-center bg-wp-card text-foreground text-sm sm:text-base font-bold rounded-lg border border-border shadow-sm pointer-events-none"
                >
                  {idx + 1}
                </span>

                {/* Image */}
                <div className="size-full relative bg-muted overflow-hidden">
                  {/* Atmospheric blurred ambient fill so the card is always rich and colorful without empty gaps */}
                  <div className="absolute inset-0 size-full overflow-hidden pointer-events-none select-none">
                    <img
                      src={getWordImageSrc(option, "thumb")}
                      alt=""
                      aria-hidden="true"
                      className="size-full object-cover object-center blur-lg scale-110 opacity-30 dark:opacity-20"
                    />
                  </div>

                  <WordImage
                    word={option}
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isRevealedAnswer}
                    className="relative z-0 size-full object-contain object-center block p-2 sm:p-3 drop-shadow-sm"
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

        {/* Continue strip — appears below grid only after incorrect answer when manual advance is preferred */}
        <AnimatePresence>
          {feedback === "incorrect" && !accessibility.autoAdvance && (
            <motion.div
              key="continue-strip"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.3 }}
              className="shrink-0 rounded-2xl px-5 py-3 flex flex-col gap-2 border bg-wp-rose/10 border-wp-rose/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-sans font-semibold text-foreground text-sm">
                  {`✗ ${identifySentence(currentTargetWord.label, currentTargetWord.topic)}`}
                </span>
                <Button
                  onClick={handleContinue}
                  hotkey="↵ Enter"
                  size="sm"
                  iconRight={<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
                >
                  {t("action.continue")}
                </Button>
              </div>
              {/* "Why incorrect" contextual explanation */}
              {feedback === "incorrect" && (
                <div className="flex flex-col gap-0.5">
                  {currentTargetWord.description && (
                    <p
                      className="font-sans text-xs text-foreground/80 leading-snug"
                      lang="en"
                      dir="ltr"
                    >
                      {currentTargetWord.description}
                    </p>
                  )}
                  {currentTargetWord.arabicTranslation && (
                    <p
                      className="font-arabic text-sm text-foreground/80 font-semibold"
                      dir="rtl"
                      lang="ar"
                    >
                      {currentTargetWord.arabicTranslation}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExerciseShell>
  );
});

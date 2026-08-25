import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence, getDistractors } from "./exerciseContent";
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
import { motion, AnimatePresence } from "framer-motion";

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

      spoken.speakFeedback({
        correct,
        targetLabel: currentTargetWord.label,
        chosenLabel: options.find((o) => o.id === id)?.label,
      });

      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct });
      autoAdvance.schedule(
        spoken.enabled
          ? spoken.delayFor(correct)
          : correct
            ? ADVANCE_DELAY_MS.correct
            : ADVANCE_DELAY_MS.incorrect
      );
    },
    [
      feedback,
      playClick,
      playCorrect,
      playIncorrect,
      currentTargetWord.id,
      currentTargetWord.label,
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
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <HelpCircle className="size-3" aria-hidden />
            <span>
              Question {queue.position} of {queue.total}
            </span>
          </span>
        </>
      }
      footer={
        <div className="w-full flex items-center text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1-{options.length} to choose an option</span>
          </div>
        </div>
      }
    >
      <div className="relative flex flex-col gap-3.5 sm:gap-5 w-full max-w-2xl mx-auto my-auto">
        {/* Question card */}
        <div className="bg-wp-card border border-border rounded-2xl p-4 sm:p-5 shadow-wp-xs shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-sans font-black text-foreground text-base sm:text-lg md:text-xl flex-1 text-balance">
              Which picture shows &ldquo;
              <span className="text-primary">{currentTargetWord.label}</span>&rdquo;?
            </h2>
            <span className="text-[11px] font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap">
              /{currentTargetWord.phonetic}/
            </span>
          </div>
        </div>

        {/* 2×2 image grid with explicit responsive aspect ratio */}
        <div
          role="group"
          aria-label={`Which image matches ${currentTargetWord.label}?`}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full"
        >
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
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                aria-label={`Option ${idx + 1} of ${options.length}. Shortcut: press ${idx + 1}`}
                aria-pressed={isSelected}
                aria-disabled={feedback !== null}
                onClick={() => handleSelect(option.id)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden w-full aspect-[4/3] min-h-[130px] sm:min-h-[170px] md:min-h-[210px] border-2 block focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors duration-200 shadow-wp-sm ${borderStyle}`}
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none ${
                        showIncorrectOverlay
                          ? "bg-wp-rose/70 backdrop-blur-[2px]"
                          : "bg-wp-green/70 backdrop-blur-[2px]"
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 20, delay: 0.05 }}
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
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
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
        </div>

        {/* Screen-reader announcement */}
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {feedback === "correct"
            ? `Correct! This is a ${currentTargetWord.label}. ${richSentence.full}`
            : feedback === "incorrect"
              ? `Incorrect. The correct answer is ${currentTargetWord.label}.`
              : ""}
        </span>

        {/* Continue strip â€” appears below grid after answer, replaces old AnswerFeedback bar */}
        <AnimatePresence>
          {feedback !== null && !accessibility.autoAdvance && (
            <motion.div
              key="continue-strip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className={`shrink-0 rounded-2xl px-5 py-3 flex items-center justify-between gap-3 border ${
                feedback === "correct"
                  ? "bg-wp-green/10 border-wp-green/30"
                  : "bg-wp-rose/10 border-wp-rose/30"
              }`}
            >
              <span className="font-sans font-semibold text-foreground text-sm">
                {feedback === "correct"
                  ? `âœ“ This is a ${currentTargetWord.label}.`
                  : `âœ— The answer is "${currentTargetWord.label}".`}
              </span>
              <button
                type="button"
                onClick={handleContinue}
                className="flex items-center gap-1.5 px-4 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-sm hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shrink-0"
              >
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExerciseShell>
  );
});

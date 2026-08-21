import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { Keyboard, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseContextFill = memo(function ExerciseContextFill({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);
  usePrefetchImage(queue.next);

  const options = useMemo(() => {
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffled = shuffleArray(otherWords).slice(0, 3);
    return shuffleArray([currentTargetWord, ...shuffled]);
  }, [currentTargetWord, words]);

  const selectedWord = options.find((item) => item.id === selectedId);

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

      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct });
      autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
    },
    [feedback, playClick, playCorrect, playIncorrect, currentTargetWord.id, dispatch, autoAdvance]
  );

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    advanceNext();
  }, [autoAdvance, advanceNext]);

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
      title="Context Fill"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            Sentence {queue.position} of {queue.total}
          </span>
        </>
      }
      footer={
        <div className="w-full flex items-center text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1&#8211;{options.length} to choose a word</span>
          </div>
        </div>
      }
    >
      <div className="relative flex flex-col gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
        {/* Sentence card — the only question element, above the image */}
        <div className="bg-wp-card rounded-2xl border border-border px-5 py-3.5 text-center shadow-wp-xs flex items-center justify-center">
          <p className="font-sans font-bold text-foreground text-xl sm:text-2xl leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {richSentence.clozeBefore}{" "}
            <span
              className={`inline-flex items-center justify-center min-w-[120px] sm:min-w-[140px] h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-2 transition-all duration-300 font-sans font-black text-lg sm:text-xl align-middle mx-1 ${
                feedback !== null
                  ? "bg-wp-green text-wp-text-on-green border-wp-green"
                  : "bg-secondary/80 border-dashed border-primary/50 text-muted-foreground"
              }`}
            >
              {feedback !== null
                ? currentTargetWord.label.toLowerCase()
                : selectedWord
                  ? selectedWord.label.toLowerCase()
                  : "_______"}
            </span>{" "}
            {richSentence.clozeAfter}
          </p>
        </div>

        {/* Image with centered feedback overlay */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-lg bg-muted shrink-0 aspect-[4/3] sm:aspect-[16/9]">
          <WordImage
            word={currentTargetWord}
            className="w-full h-full absolute inset-0 object-cover"
          />

          <AnimatePresence>
            {feedback !== null && (
              <motion.div
                key="feedback-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.05 }}
                  className={`rounded-full p-3 shadow-xl ${
                    feedback === "correct" ? "bg-wp-green" : "bg-wp-rose"
                  }`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle2 className="size-10 sm:size-12 text-white" aria-hidden />
                  ) : (
                    <XCircle className="size-10 sm:size-12 text-white" aria-hidden />
                  )}
                </motion.div>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  className="font-sans font-black text-white text-lg sm:text-xl drop-shadow-lg text-center px-6"
                >
                  This is a{" "}
                  <span className="text-wp-amber capitalize">
                    {currentTargetWord.label.toLowerCase()}
                  </span>
                </motion.p>

                {!accessibility.autoAdvance && (
                  <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    type="button"
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-foreground font-sans font-bold text-sm shadow-lg hover:bg-white/90 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white"
                  >
                    Continue
                    <ArrowRight className="size-4" aria-hidden />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <span aria-live="polite" aria-atomic="true" className="sr-only">
            {feedback === "correct"
              ? `Correct. This is a ${currentTargetWord.label}.`
              : feedback === "incorrect"
                ? `Incorrect. The answer is ${currentTargetWord.label}.`
                : ""}
          </span>
        </div>

        {/* Word choice buttons � always neutral styling, no feedback colours */}
        <div
          role="group"
          aria-label="Word choices"
          className="grid grid-cols-2 gap-3 sm:gap-4 w-full"
        >
          {options.map((option, idx) => (
            <motion.button
              key={option.id}
              type="button"
              whileTap={feedback === null ? { scale: 0.95 } : {}}
              transition={{ duration: 0.1 }}
              aria-pressed={selectedId === option.id}
              aria-disabled={feedback !== null}
              onClick={() => handleSelect(option.id)}
              className="rounded-xl p-3 sm:p-4 font-sans font-bold text-base sm:text-lg border-2 min-h-[48px] sm:min-h-[56px] flex items-center justify-between shadow-wp-xs bg-wp-card border-border text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
            >
              <span className="capitalize">{option.label.toLowerCase()}</span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-md font-bold bg-muted text-muted-foreground">
                [{idx + 1}]
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </ExerciseShell>
  );
});

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence, getDistractors } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { AnswerFeedback } from "../shared/AnswerFeedback";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { useProgress } from "../data/progress";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { HelpCircle, Keyboard } from "lucide-react";
import { motion } from "framer-motion";

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
  const { progress } = useProgress();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);
  usePrefetchImage(queue.next);

  const options = useMemo(() => {
    const distractors = getDistractors(currentTargetWord, 3);

    const correctIndex = Math.floor(Math.random() * 4);

    const finalOptions = [...distractors];
    finalOptions.splice(correctIndex, 0, currentTargetWord);

    return finalOptions;
  }, [currentTargetWord]);

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

  // The footer has always advertised number-key selection; until now nothing
  // listened for it.
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

  return (
    <ExerciseShell
      step={step}
      title="Mastery Quick Quiz"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1–{options.length} to choose an option</span>
          </div>
          <span>
            Question {queue.position} of {queue.total}
          </span>
        </div>
      }
    >
      <div className="relative flex flex-col gap-3.5 sm:gap-4 w-full h-full min-h-0">
        {/* Single-Line Question Heading */}
        {/*
          The question itself must never be clipped. It previously carried
          `truncate` while wedged between two shrink-0 siblings, so on narrow
          screens the one string the learner has to read got cut off. The row
          now wraps instead.
        */}
        <div className="bg-wp-card border border-border rounded-2xl p-3.5 sm:p-4 shadow-wp-xs shrink-0 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs shrink-0">
            <HelpCircle className="size-4 text-wp-blue" aria-hidden />
            <span>{queue.isRetry ? "Once more" : `Quiz Q${queue.position}`}</span>
          </div>
          <h2 className="font-sans font-black text-foreground text-base sm:text-lg md:text-xl text-center flex-1 min-w-[12rem] text-balance">
            Which picture shows &ldquo;
            <span className="text-primary">{currentTargetWord.label}</span>&rdquo;?
          </h2>
          <span className="text-[11px] font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
            /{currentTargetWord.phonetic}/
          </span>
        </div>

        {/* 2x2 Grid Layout */}
        {/*
          Actions, not form values: choosing an option commits the answer, so
          radiogroup semantics (which imply arrow-key navigation between
          uncommitted values) would be wrong even if they were implemented.
        */}
        <div
          role="group"
          aria-label={`Which image matches ${currentTargetWord.label}?`}
          className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3.5 w-full flex-1 min-h-0"
        >
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isRevealedAnswer = feedback === "incorrect" && option.id === currentTargetWord.id;

            let stateStyle = "border-border bg-wp-card hover:border-primary/60 hover:shadow-md";
            if (isSelected) {
              stateStyle =
                feedback === "correct"
                  ? "border-wp-green bg-wp-green-light/40 shadow-md"
                  : "border-wp-rose bg-wp-rose-light/40 shadow-md";
            } else if (isRevealedAnswer) {
              stateStyle = "border-wp-green bg-wp-green-light/40 shadow-md";
            }

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
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden w-full h-full border-2 block focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors duration-200 shadow-wp-sm ${stateStyle}`}
              >
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-2 start-2 sm:top-2.5 sm:start-2.5 z-10 bg-black/60 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 shadow-sm backdrop-blur-md pointer-events-none"
                >
                  [{idx + 1}]
                </span>

                <div className="size-full relative bg-muted after:absolute after:inset-0 after:border-[4px] after:border-transparent group-hover:after:border-primary/20 after:rounded-2xl sm:after:rounded-3xl after:transition-colors">
                  <WordImage
                    word={option}
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isRevealedAnswer}
                    className="size-full object-cover block"
                  />
                  {isRevealedAnswer && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute top-2 end-2 bg-wp-green text-wp-text-on-green p-1 rounded-full shadow-md"
                    >
                      <HelpCircle className="size-4 sm:size-5" aria-hidden />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnswerFeedback
          result={feedback}
          wordLabel={currentTargetWord.label}
          explanation={
            feedback === "correct"
              ? `"${richSentence.full}"`
              : `The correct picture is "${currentTargetWord.label}". You will see it again shortly.`
          }
          streakCount={progress.streak}
          autoAdvancing={accessibility.autoAdvance}
          onContinue={handleContinue}
        />
      </div>
    </ExerciseShell>
  );
});

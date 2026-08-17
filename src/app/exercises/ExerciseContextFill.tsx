import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { AnswerFeedback } from "../shared/AnswerFeedback";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { useProgress } from "../data/progress";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { Keyboard } from "lucide-react";
import { motion } from "framer-motion";

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
  const { progress } = useProgress();
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

  /**
   * Choosing a word commits it.
   *
   * This screen used to need two taps for every question — pick a word, then
   * press "Check Answer" — and a third to dismiss the modal that followed. The
   * choice is unambiguous on its own, so it is the answer.
   */
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

  return (
    <ExerciseShell
      step={step}
      title="Context Fill"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1–{options.length} to choose a word</span>
          </div>
          <span>Sentence {queue.position} of {queue.total}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Question Counter Header */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>{queue.isRetry ? "Once more" : "Choose the missing word"}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            {queue.masteredCount} of {words.length} done
          </span>
        </div>

        {/* Fluid Hero Target Image Display */}
        <div className="h-80 sm:h-96 md:h-[400px] max-h-[50vh] w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0">
          <WordImage word={currentTargetWord} width="800" height="500" className="absolute inset-0 size-full object-cover blur-xl opacity-40 scale-110 pointer-events-none" aria-hidden="true" />
          <WordImage word={currentTargetWord} width="800" height="500" className="size-full relative size-full object-contain drop-shadow-2xl" />
        </div>

        {/* Centered Rich Sentence Display Box */}
        <div className="bg-wp-card rounded-2xl border border-border p-4 text-center shadow-wp-xs flex flex-col items-center justify-center gap-1">
          <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-wider">
            Sentence Context Clue
          </span>
          <p className="font-sans font-bold text-foreground text-lg sm:text-xl leading-relaxed flex items-center justify-center flex-wrap gap-2 py-0.5">
            <span>{richSentence.clozeBefore}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[120px] h-10 px-3 rounded-xl border-2 transition-all font-sans font-black text-lg shadow-xs ${
                feedback === "incorrect"
                  ? "bg-wp-green text-wp-text-on-green border-wp-green"
                  : selectedWord
                    ? feedback === "correct"
                      ? "bg-wp-green text-wp-text-on-green border-wp-green"
                      : "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/80 border-dashed border-primary/50 text-muted-foreground"
              }`}
            >
              {/* On a wrong answer the blank fills with the right word, so the
                  learner reads the true sentence rather than their mistake. */}
              {feedback === "incorrect"
                ? currentTargetWord.label.toLowerCase()
                : selectedWord
                  ? selectedWord.label.toLowerCase()
                  : "_______"}
            </span>
            <span>{richSentence.clozeAfter}</span>
          </p>
        </div>

        {/* Word Options Grid (2x2 Grid) */}
        {/* Choosing commits the answer, so these are actions rather than radio
            values waiting on a separate submit. */}
        <div role="group" aria-label="Word choices" className="grid grid-cols-2 gap-3 w-full">
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isRevealedAnswer = feedback === "incorrect" && option.id === currentTargetWord.id;

            let stateStyle = "bg-wp-card border-border text-foreground hover:border-primary/50 hover:shadow-md";
            if (isSelected) {
              stateStyle =
                feedback === "correct"
                  ? "bg-wp-green border-wp-green text-wp-text-on-green shadow-md"
                  : "bg-wp-rose border-wp-rose text-wp-text-on-rose shadow-md animate-wp-shake";
            } else if (isRevealedAnswer) {
              stateStyle = "bg-wp-green border-wp-green text-wp-text-on-green shadow-md";
            }

            return (
              <motion.button
                key={option.id}
                type="button"
                whileTap={feedback === null ? { scale: 0.95 } : {}}
                transition={{ duration: 0.1 }}
                aria-pressed={isSelected}
                /* aria-disabled keeps keyboard focus on the chosen option;
                   `disabled` would send it to <body> mid-drill. */
                aria-disabled={feedback !== null}
                onClick={() => handleSelect(option.id)}
                className={`rounded-xl p-3 sm:p-3.5 font-sans font-bold text-sm sm:text-base border-2 min-h-[48px] transition-colors duration-200 flex items-center justify-between shadow-wp-xs ${stateStyle} focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary`}
              >
                <span className="capitalize">{option.label.toLowerCase()}</span>
                <span className={`hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-md font-bold ${isSelected || isRevealedAnswer ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                  [{idx + 1}]
                </span>
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
              : `The sentence reads: "${richSentence.full}"`
          }
          streakCount={progress.streak}
          autoAdvancing={accessibility.autoAdvance}
          onContinue={handleContinue}
        />
      </div>
    </ExerciseShell>
  );
});

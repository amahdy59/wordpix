import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { PenTool, Undo2, CheckCircle2, XCircle } from "lucide-react";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { AnswerFeedback } from "../shared/AnswerFeedback";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { useProgress } from "../data/progress";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { motion } from "framer-motion";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseSentenceBuilder = memo(function ExerciseSentenceBuilder({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { progress } = useProgress();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  usePrefetchImage(queue.next);
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);

  const answer = useMemo(() => richSentence.words, [richSentence]);
  const shuffled = useMemo(() => shuffleArray([...answer]), [answer]);

  const advanceNext = useCallback(() => {
    if (feedback !== null) queue.submit(feedback === "correct");
    setPlaced([]);
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
   * Grades the sentence as soon as the last tile lands.
   *
   * The learner used to have to place every tile and *then* press "Check
   * Sentence", and then dismiss a modal. Completing the sentence is the answer;
   * there is nothing left to decide once the final tile is down.
   */
  const commit = useCallback(
    (finalPlaced: string[]) => {
      const correct = finalPlaced.join(" ") === answer.join(" ");
      setFeedback(correct ? "correct" : "incorrect");
      if (correct) playCorrect();
      else playIncorrect();

      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct });
      autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
    },
    [answer, playCorrect, playIncorrect, dispatch, currentTargetWord.id, autoAdvance]
  );

  const handleTileClick = useCallback(
    (item: string) => {
      if (feedback !== null) return;
      playClick();
      const next = [...placed, item];
      setPlaced(next);
      if (next.length === answer.length) commit(next);
    },
    [feedback, playClick, placed, answer.length, commit]
  );

  const handleRemoveTile = useCallback(
    (index: number) => {
      if (feedback !== null) return;
      playClick();
      setPlaced((items) => items.filter((_, i) => i !== index));
    },
    [feedback, playClick]
  );

  // Tile-based UIs train the same muscle memory as Duolingo's, where Backspace
  // undoes the last placement without reaching for the mouse.
  useEffect(() => {
    if (feedback !== null || placed.length === 0) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Backspace") return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      event.preventDefault();
      handleRemoveTile(placed.length - 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [feedback, placed.length, handleRemoveTile]);

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    advanceNext();
  }, [autoAdvance, advanceNext]);

  return (
    <ExerciseShell
      step={step}
      title="Sentence Builder"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <span className="text-wp-amber font-bold">
            {feedback === null
              ? `Tap tiles in order — ${answer.length - placed.length} to go`
              : "Next sentence coming up"}
          </span>
          <span>Sentence {queue.position} of {queue.total}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Question Counter & Skill Badge */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>{queue.isRetry ? "Once more" : "Build the sentence"}</span>
          <span className="flex items-center gap-1 text-muted-foreground bg-muted border border-border px-2.5 py-0.5 rounded-full">
            <PenTool className="size-3" aria-hidden />
            <span>Spelling &amp; Sentence Skill</span>
          </span>
        </div>

        {/* Fluid Hero Target Image Display */}
        <div className="h-80 sm:h-96 md:h-[400px] max-h-[50vh] w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0">
          <WordImage word={currentTargetWord} width="800" height="500" className="size-full object-contain" />
          {/* Ties the picture to the word it illustrates instead of leaving it
              a disconnected decorative photo. */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2.5 pointer-events-none">
            <span className="font-sans font-bold text-white text-xs sm:text-sm tracking-wide drop-shadow-sm">
              {currentTargetWord.label}
            </span>
          </div>
        </div>

        {/* Sentence Assembly Canvas */}
        <div className="bg-wp-card rounded-2xl border-2 border-primary/30 p-3.5 sm:p-4 w-full flex flex-col gap-1.5 shadow-wp-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-[10px] text-primary uppercase tracking-wider flex items-center gap-1.5">
              Sentence Assembly Canvas
              {/* Correctness is never color-only: an icon carries the same
                  signal for colorblind learners. */}
              {feedback === "correct" && <CheckCircle2 className="size-3.5 text-wp-green" aria-hidden />}
              {feedback === "incorrect" && <XCircle className="size-3.5 text-wp-rose" aria-hidden />}
            </span>
            {placed.length > 0 && feedback === null && (
              <button
                type="button"
                onClick={() => handleRemoveTile(placed.length - 1)}
                className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/60 bg-wp-card border border-border min-h-[44px] px-2.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
              >
                <Undo2 className="size-3.5" aria-hidden />
                <span>Undo</span>
                <kbd className="hidden sm:inline font-sans font-semibold text-muted-foreground/70 border border-border rounded px-1 ms-0.5">
                  ⌫
                </kbd>
              </button>
            )}
          </div>
          <div
            className={`flex flex-wrap gap-2 items-center min-h-[76px] sm:min-h-[84px] p-2.5 rounded-xl border border-dashed transition-colors ${
              feedback === "correct"
                ? "bg-wp-green-light/30 border-wp-green"
                : feedback === "incorrect"
                  ? "bg-wp-rose-light/30 border-wp-rose"
                  : "bg-secondary/40 border-primary/40"
            }`}
            aria-label="Built sentence"
          >
            {placed.map((item, index) => (
              <motion.button
                key={`${item}-${index}`}
                type="button"
                whileTap={feedback === null ? { scale: 0.95 } : {}}
                transition={{ duration: 0.1 }}
                aria-disabled={feedback !== null || undefined}
                onClick={() => handleRemoveTile(index)}
                className="bg-primary rounded-xl px-3.5 py-2 font-sans font-black text-primary-foreground text-sm sm:text-base shadow-xs hover:bg-primary/90 transition-all focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary min-h-[44px]"
              >
                {item}
              </motion.button>
            ))}
            {placed.length === 0 && (
              <span className="text-muted-foreground text-xs sm:text-sm font-sans font-medium px-2">
                Your sentence will appear here
              </span>
            )}
          </div>
          {/* Off-screen progress announcement: tile buttons appearing inside a
              live region get read out as new interactive controls, which is
              noisy, so the built sentence is narrated separately instead. */}
          <span aria-live="polite" aria-atomic="true" className="sr-only">
            {feedback === "correct"
              ? `Correct. ${answer.join(" ")}`
              : feedback === "incorrect"
                ? `Incorrect. Correct order: ${answer.join(" ")}`
                : placed.length === 0
                  ? "No words placed yet."
                  : `${placed.join(" ")}. ${answer.length - placed.length} word${
                      answer.length - placed.length === 1 ? "" : "s"
                    } remaining.`}
          </span>

          {/* On a wrong answer the correct order is spelled out, rather than
              wiping the canvas and asking the learner to guess again. */}
          {feedback === "incorrect" && (
            <p className="font-sans text-sm text-foreground font-bold mt-1">
              Correct order: <span className="text-wp-green">{answer.join(" ")}</span>
            </p>
          )}
        </div>

        {/* Available Word Tiles */}
        <div role="group" aria-label="Available words" className="flex flex-wrap gap-2.5 justify-center w-full">
          {shuffled.map((item, index) => {
            const usedCount = placed.filter((p) => p === item).length;
            const availableCount = shuffled.slice(0, index + 1).filter((t) => t === item).length;
            const used = usedCount >= availableCount;
            return (
              <motion.button
                key={`${item}-${index}`}
                type="button"
                whileTap={!used && feedback === null ? { scale: 0.95 } : {}}
                transition={{ duration: 0.1 }}
                // A consumed tile is genuinely unavailable, so it is disabled.
                // A tile that is merely waiting out the feedback is only
                // aria-disabled, so focus is not thrown to <body> between
                // questions.
                disabled={used}
                aria-disabled={feedback !== null || undefined}
                onClick={() => handleTileClick(item)}
                className={`bg-wp-card rounded-xl border-2 border-border px-5 py-2.5 font-sans font-bold text-foreground text-sm sm:text-base disabled:opacity-30 min-h-[44px] hover:border-primary hover:bg-secondary/50 transition-colors duration-200 shadow-wp-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary ${
                  feedback !== null ? "opacity-40" : ""
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>

        <AnswerFeedback
          result={feedback}
          wordLabel={currentTargetWord.label}
          explanation={
            feedback === "correct"
              ? // The sentence they actually built, not richSentence.full.
                // `full` is the longer cloze sentence from the previous step,
                // so praising a correct build with it showed the learner a
                // different sentence from the one they had just assembled.
                `"${answer.join(" ")}"`
              : "Read the correct order above — this one comes back later."
          }
          streakCount={progress.streak}
          autoAdvancing={accessibility.autoAdvance}
          onContinue={handleContinue}
        />
      </div>
    </ExerciseShell>
  );
});

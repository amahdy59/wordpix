import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
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
import { HelpCircle, Keyboard } from "lucide-react";

interface Props {
  step: number;
  words: VocabItem[];
  groupId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseQuickQuiz = memo(function ExerciseQuickQuiz({
  step,
  words,
  groupId,
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

  const advanceNext = useCallback(() => {
    setSelectedId(null);
    setFeedback(null);
  }, []);

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
      queue.submit(correct);
      autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
    },
    [feedback, playClick, playCorrect, playIncorrect, currentTargetWord.id, dispatch, queue, autoAdvance]
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
      activeWord={currentTargetWord}
      mode="assessment"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1–{options.length} to choose an option</span>
          </div>
          <span>Question {queue.position} of {queue.total}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
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
            Which picture shows &ldquo;<span className="text-primary">{currentTargetWord.label}</span>&rdquo;?
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
          className="grid grid-cols-2 gap-3.5 w-full"
        >
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isRevealedAnswer = feedback === "incorrect" && option.id === currentTargetWord.id;

            let stateStyle = "border-border bg-wp-card hover:border-primary/60 hover:shadow-md";
            if (isSelected) {
              stateStyle =
                feedback === "correct"
                  ? "border-wp-green bg-wp-green-light/40"
                  : "border-wp-rose bg-wp-rose-light/40 animate-wp-shake";
            } else if (isRevealedAnswer) {
              stateStyle = "border-wp-green bg-wp-green-light/40";
            }

            return (
              <button
                key={option.id}
                type="button"
                aria-label={`Option ${idx + 1} of ${options.length}. Shortcut: press ${idx + 1}`}
                aria-pressed={isSelected}
                /*
                  aria-disabled, not disabled. A disabled button loses focus to
                  <body>, so a keyboard learner was dumped out of the exercise
                  the instant they answered. This keeps focus where it is and
                  still tells assistive tech the option is no longer actionable;
                  handleSelect ignores the click either way.
                */
                aria-disabled={feedback !== null}
                onClick={() => handleSelect(option.id)}
                className={`group relative rounded-2xl overflow-hidden p-1.5 border-2 flex flex-col items-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all duration-200 shadow-wp-xs ${stateStyle}`}
              >
                {/* Physical Keyboard Badge */}
                <span
                  aria-hidden
                  className="absolute top-2.5 start-2.5 z-10 bg-wp-panel/90 text-wp-text-on-panel text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-md backdrop-blur-md pointer-events-none"
                >
                  Key [{idx + 1}]
                </span>

                <div className="h-32 sm:h-40 md:h-44 max-h-[24vh] w-full relative rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0">
                  <WordImage
                    word={option}
                    width="600"
                    height="450"
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isRevealedAnswer}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>
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

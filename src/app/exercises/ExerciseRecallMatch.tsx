import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getDistractors } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, CheckCircle2, RefreshCw, Keyboard } from "lucide-react";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
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

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  usePrefetchImage(queue.next);
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.85 });
  const { progress } = useProgress();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const hasSpokenRef = useRef<Record<string, boolean>>({});

  const displayCards = useMemo(() => {
    // Choose 3 semantic distractors
    const distractors = getDistractors(currentTargetWord, 3);
    
    // Insert the correct answer at a random position (0-3)
    const finalOptions = [...distractors];
    const correctIndex = Math.floor(Math.random() * 4);
    finalOptions.splice(correctIndex, 0, currentTargetWord);
    
    return finalOptions;
  }, [currentTargetWord, lessonId]);

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
  // next step has to wait until that last piece of feedback has been cleared —
  // otherwise the learner never sees the result of their final answer.
  useEffect(() => {
    if (queue.isComplete && feedback === null) dispatch({ type: "LESSON_NEXT" });
  }, [queue.isComplete, feedback, dispatch]);

  useEffect(() => {
    stop();
    const wordId = currentTargetWord.id;
    if (!hasSpokenRef.current[wordId]) {
      hasSpokenRef.current[wordId] = true;
      const t = setTimeout(() => speak(currentTargetWord.label), 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [currentTargetWord.id, currentTargetWord.label, speak, stop]);

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

      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct });
      autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
    },
    [feedback, currentTargetWord.id, playCorrect, playIncorrect, dispatch, autoAdvance]
  );

  const handleContinue = useCallback(() => {
    autoAdvance.cancel();
    advanceNext();
  }, [autoAdvance, advanceNext]);

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
    disabled: feedback !== null,
  });

  return (
    <ExerciseShell
      step={step}
      title="Audio Recall Match"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1–{displayCards.length} to choose · R to replay audio</span>
          </div>
          <span>
            Question {queue.position} of {queue.total}
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Sleek, Compact Target Audio Play Bar */}
        <div className="bg-wp-panel text-wp-text-on-panel rounded-2xl p-3 sm:p-3.5 flex items-center justify-between shadow-wp-sm border border-wp-panel-border shrink-0">
          <button
            type="button"
            onClick={replayAudio}
            aria-label="Replay target audio prompt"
            className="flex items-center gap-3 min-h-[44px] hover:opacity-90 transition-opacity text-start rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
              <Volume2 className={`size-5 ${isPlaying ? "animate-pulse text-wp-amber" : ""}`} />
            </div>
            <div>
              <h2 className="font-sans font-black text-sm sm:text-base text-white leading-tight flex items-center gap-2">
                <span>Listen &amp; Match Picture</span>
                {isPlaying && <span className="text-[10px] bg-wp-amber/20 text-wp-amber px-2 py-0.5 rounded-full border border-wp-amber/30">Playing sound…</span>}
              </h2>
              <p className="font-sans text-white/80 text-xs">
                {queue.isRetry ? "One more time — tap the picture you hear." : "Tap image card matching the spoken word."}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={replayAudio}
            aria-label="Replay audio"
            className="flex items-center gap-1.5 px-3 min-h-[44px] min-w-[44px] justify-center rounded-xl bg-white/10 text-white/90 hover:text-white text-xs font-sans font-bold border border-white/15 backdrop-blur-md transition-colors shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        {/* Card Image Selection Grid */}
        {/*
          These are actions, not form values: choosing an option commits the
          answer immediately. role="radio" implied arrow-key navigation that was
          never wired up and that would submit on arrow press if it were.
        */}
        <div
          role="group"
          aria-label="Choose matching picture for audio prompt"
          className="grid grid-cols-2 grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-2 sm:gap-3.5 w-full flex-1 min-h-0"
        >
          {displayCards.map((card, idx) => {
            const isSelected = selectedId === card.id;
            const isRevealedAnswer = feedback === "incorrect" && card.id === currentTargetWord.id;

            let cardStateStyle = "border-2 border-border bg-wp-card hover:border-primary/50 hover:shadow-md";
            if (isSelected) {
              if (feedback === "correct") cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
              if (feedback === "incorrect") cardStateStyle = "border-2 border-wp-rose bg-wp-rose-light/40 shadow-md";
            } else if (isRevealedAnswer) {
              cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
            }

            return (
              <motion.button
                key={card.id}
                type="button"
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                aria-label={`Option ${idx + 1} of ${displayCards.length}. Shortcut: press ${idx + 1}`}
                aria-pressed={isSelected}
                aria-disabled={feedback !== null}
                onClick={() => handleCardClick(card)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden w-full h-full block focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary shadow-wp-sm ${cardStateStyle}`}
              >
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-2 start-2 sm:top-2.5 sm:start-2.5 z-10 bg-black/60 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 shadow-sm backdrop-blur-md pointer-events-none"
                >
                  [{idx + 1}]
                </span>

                <div className="h-full w-full relative bg-muted shrink-0 after:absolute after:inset-0 after:border-[4px] after:border-transparent group-hover:after:border-primary/20 after:rounded-2xl sm:after:rounded-3xl after:transition-colors">
                  <WordImage
                    word={card}
                    width="400"
                    height="300"
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isRevealedAnswer}
                    className="size-full object-cover object-center block"
                  />
                  {isRevealedAnswer && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute top-2 end-2 bg-wp-green text-wp-text-on-green p-1 rounded-full shadow-md"
                    >
                      <CheckCircle2 className="size-4 sm:size-5" aria-hidden />
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
              ? `That is "${currentTargetWord.label}".`
              : `The picture you heard was "${currentTargetWord.label}". You will see it again shortly.`
          }
          streakCount={progress.streak}
          autoAdvancing={accessibility.autoAdvance}
          onContinue={handleContinue}
        />
      </div>
    </ExerciseShell>
  );
});

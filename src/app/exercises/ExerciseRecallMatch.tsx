import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getDistractors } from "./exerciseContent";
import { shuffleArray } from "../../utils/shuffle";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, CheckCircle2, XCircle, RefreshCw, Keyboard, ArrowRight } from "lucide-react";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useSpokenFeedback } from "../shared/useSpokenFeedback";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { motion, AnimatePresence } from "framer-motion";

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

      // The prompt voice and the feedback voice share the browser's one
      // synthesis queue, so silence the prompt before answering over it.
      stop();
      spoken.speakFeedback({
        correct,
        targetLabel: currentTargetWord.label,
        chosenLabel: card.label,
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
      currentTargetWord.id,
      currentTargetWord.label,
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
      title="Audio Recall Match"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: queue.position, total: queue.total }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <Volume2 className="size-3" aria-hidden />
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
            <span>Press 1-{displayCards.length} to choose · R to replay audio</span>
          </div>
        </div>
      }
    >
      <div className="relative flex flex-col gap-3.5 sm:gap-5 w-full max-w-2xl mx-auto my-auto">
        {/* Sleek, Compact Target Audio Play Bar */}
        <div className="bg-wp-panel text-wp-text-on-panel rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-wp-sm border border-wp-panel-border shrink-0">
          <button
            type="button"
            onClick={replayAudio}
            aria-label="Replay target audio prompt"
            className="flex items-center gap-3 min-h-[44px] hover:opacity-90 transition-opacity text-start rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <div className="size-10 sm:size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
              <Volume2
                className={`size-5 sm:size-6 ${isPlaying ? "motion-safe:animate-pulse text-wp-amber" : ""}`}
              />
            </div>
            <div>
              <h2 className="font-sans font-black text-sm sm:text-base text-white leading-tight flex items-center gap-2">
                <span>Listen &amp; Match Picture</span>
                {isPlaying && (
                  <span className="text-[10px] bg-wp-amber/20 text-wp-amber px-2 py-0.5 rounded-full border border-wp-amber/30">
                    Playing sound…
                  </span>
                )}
              </h2>
              <p className="font-sans text-white/80 text-xs sm:text-sm mt-0.5">
                {queue.isRetry
                  ? "One more time — tap the picture you hear."
                  : "Tap image card matching the spoken word."}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={replayAudio}
            aria-label="Replay audio"
            className="flex items-center gap-1.5 px-3.5 min-h-[44px] min-w-[44px] justify-center rounded-xl bg-white/10 text-white/90 hover:text-white text-xs sm:text-sm font-sans font-bold border border-white/15 backdrop-blur-md transition-colors shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RefreshCw className="size-3.5 sm:size-4" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        {/* Card Image Selection Grid with explicit responsive aspect ratio */}
        <div
          role="group"
          aria-label="Choose matching picture for audio prompt"
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full"
        >
          {displayCards.map((card, idx) => {
            const isSelected = selectedId === card.id;
            const isRevealedAnswer = feedback === "incorrect" && card.id === currentTargetWord.id;

            let cardStateStyle =
              "border-2 border-border bg-wp-card hover:border-primary/50 hover:shadow-md";
            if (isSelected) {
              if (feedback === "correct")
                cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
              if (feedback === "incorrect")
                cardStateStyle = "border-2 border-wp-rose bg-wp-rose-light/40 shadow-md";
            } else if (isRevealedAnswer) {
              cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
            }

            // Overlay type for this cell
            const showCorrectOverlay = isSelected && feedback === "correct";
            const showIncorrectOverlay = isSelected && feedback === "incorrect";

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
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden w-full aspect-[4/3] min-h-[130px] sm:min-h-[170px] md:min-h-[210px] block focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary shadow-wp-sm ${cardStateStyle}`}
              >
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-2 start-2 sm:top-2.5 sm:start-2.5 z-10 bg-black/60 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 shadow-sm backdrop-blur-md pointer-events-none"
                >
                  [{idx + 1}]
                </span>

                <div className="size-full relative bg-muted after:absolute after:inset-0 after:border-[4px] after:border-transparent group-hover:after:border-primary/20 after:rounded-2xl sm:after:rounded-3xl after:transition-colors">
                  <WordImage
                    word={card}
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isRevealedAnswer}
                    className="size-full object-cover block"
                  />
                </div>

                {/* -- Per-image feedback overlay -- */}
                <AnimatePresence>
                  {(showCorrectOverlay || showIncorrectOverlay) && (
                    <motion.div
                      key={`overlay-${card.id}`}
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

        {/* Continue strip — replaces old AnswerFeedback bar */}
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
                  ? `✓ That is "${currentTargetWord.label}".`
                  : `✕ The picture you heard was "${currentTargetWord.label}".`}
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

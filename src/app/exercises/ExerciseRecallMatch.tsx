import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { resolveWorldForGroup } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, CheckCircle2, RefreshCw, Keyboard } from "lucide-react";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";
import { AnswerFeedback } from "../shared/AnswerFeedback";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useDrillQueue } from "./useDrillQueue";
import { useProgress } from "../data/progress";
import { usePrefetchImage } from "../shared/usePrefetchImage";

interface Props {
  step: number;
  words: VocabItem[];
  groupId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(new Set());

  const queue = useDrillQueue(words);
  const currentTargetWord = queue.current ?? words[0];
  usePrefetchImage(queue.next);
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.85 });
  const { progress } = useProgress();
  const { accessibility } = useAccessibility();
  const { playCorrect, playIncorrect, playClick } = useSound();
  const hasSpokenRef = useRef<Record<string, boolean>>({});

  const displayCards = useMemo(() => {
    // Generate 6 cards total: the group's words + necessary distractors
    const worldVocab = resolveWorldForGroup(groupId).vocabulary;
    const wordIds = new Set(words.map((w) => w.id));
    const distractorsPool = worldVocab.filter((w) => !wordIds.has(w.id));
    
    const distractorsNeeded = Math.max(0, 6 - words.length);
    const shuffledDistractors = shuffleArray(distractorsPool).slice(0, distractorsNeeded);
    
    return shuffleArray([...words, ...shuffledDistractors]);
  }, [words, groupId]);

  /** Clears the result and lets the queue's next question render. */
  const advanceNext = useCallback(() => {
    setSelectedId(null);
    setFeedback(null);
  }, []);

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
    (card: VocabItem) => {
      // One answer per question. Extra taps while the result is on screen used
      // to be recorded as further attempts against the same word.
      if (feedback !== null) return;

      setSelectedId(card.id);
      const correct = card.id === currentTargetWord.id;

      if (correct) {
        setFeedback("correct");
        playCorrect();
        setCompletedWordIds((prev) => new Set(prev).add(card.id));
      } else {
        setFeedback("incorrect");
        playIncorrect();
      }

      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct });
      queue.submit(correct);
      autoAdvance.schedule(correct ? ADVANCE_DELAY_MS.correct : ADVANCE_DELAY_MS.incorrect);
    },
    [feedback, currentTargetWord.id, playCorrect, playIncorrect, dispatch, queue, autoAdvance]
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
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-wp-amber font-bold">
            <Keyboard className="size-4" aria-hidden />
            <span>Press 1–{displayCards.length} to choose · R to replay audio</span>
          </div>
          <span>
            Question {queue.position} of {queue.total} · {completedWordIds.size} of {words.length} matched
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
              <p className="font-sans text-white/60 text-xs">
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
          className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 w-full pb-8 lg:pb-0"
        >
          {displayCards.map((card, idx) => {
            const isSelected = selectedId === card.id;
            const isTargetCompleted = completedWordIds.has(card.id);
            // On a wrong answer the right card is highlighted, so the learner
            // finds out what they should have picked without being made to
            // guess again.
            const isRevealedAnswer = feedback === "incorrect" && card.id === currentTargetWord.id;

            let cardStateStyle = "border-2 border-border bg-wp-card hover:border-primary/50 hover:shadow-md";
            if (isSelected) {
              if (feedback === "correct") cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
              if (feedback === "incorrect") cardStateStyle = "border-2 border-wp-rose bg-wp-rose-light/40 shadow-md animate-wp-shake";
            } else if (isRevealedAnswer) {
              cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
            } else if (isTargetCompleted) {
              cardStateStyle = "border-2 border-wp-green/40 bg-wp-green-light/10 opacity-75";
            }

            return (
              <button
                key={card.id}
                type="button"
                aria-label={`Option ${idx + 1} of ${displayCards.length}. Shortcut: press ${idx + 1}`}
                aria-pressed={isSelected}
                /* aria-disabled keeps keyboard focus on the card the learner
                   just chose; `disabled` would send it to <body>. */
                aria-disabled={feedback !== null}
                onClick={() => handleCardClick(card)}
                className={`group relative rounded-2xl overflow-hidden p-1.5 flex flex-col items-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors duration-200 shadow-wp-xs ${cardStateStyle}`}
              >
                {/* Physical Key Badge */}
                <span
                  aria-hidden
                  className="absolute top-2.5 start-2.5 z-10 bg-wp-panel/90 text-wp-text-on-panel text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border border-white/20 shadow-md backdrop-blur-md pointer-events-none"
                >
                  Key [{idx + 1}]
                </span>

                <div className="h-32 sm:h-40 md:h-44 max-h-[24vh] lg:max-h-[30vh] w-full relative rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0">
                  <WordImage
                    word={card}
                    width="400"
                    height="300"
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isTargetCompleted || isRevealedAnswer}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(isTargetCompleted || isRevealedAnswer) && (
                    <div className="absolute top-2 end-2 bg-wp-green text-wp-text-on-green p-1 rounded-full shadow-md">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                    </div>
                  )}
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

import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, CheckCircle2, RefreshCw, Keyboard } from "lucide-react";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { FeedbackModal } from "../shared/FeedbackModal";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(new Set());

  const currentTargetWord = words[targetIndex] || words[0];
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.85 });
  const { playCorrect, playIncorrect, playClick } = useSound();
  const hasSpokenRef = useRef<Record<number, boolean>>({});

  const displayCards = useMemo(() => {
    return shuffleArray(words);
  }, [words]);

  useEffect(() => {
    stop();
    if (!hasSpokenRef.current[targetIndex]) {
      hasSpokenRef.current[targetIndex] = true;
      const t = setTimeout(() => speak(currentTargetWord.label), 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [targetIndex, currentTargetWord.label, speak, stop]);

  const replayAudio = useCallback(() => {
    stop();
    speak(currentTargetWord.label);
  }, [stop, speak, currentTargetWord.label]);

  const advanceNext = useCallback(() => {
    if (targetIndex + 1 < words.length) {
      setTargetIndex((i) => i + 1);
      setSelectedId(null);
      setFeedback(null);
    } else {
      dispatch({ type: "LESSON_NEXT" });
    }
  }, [targetIndex, words.length, dispatch]);

  const handleCardClick = useCallback((card: VocabItem) => {
    if (feedback === "correct") return;

    setSelectedId(card.id);

    if (card.id === currentTargetWord.id) {
      setFeedback("correct");
      playCorrect();
      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: true });

      const newCompleted = new Set(completedWordIds);
      newCompleted.add(card.id);
      setCompletedWordIds(newCompleted);
    } else {
      setFeedback("incorrect");
      playIncorrect();
      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: false });
    }
    setShowModal(true);
  }, [feedback, currentTargetWord.id, playCorrect, playIncorrect, dispatch, completedWordIds]);

  const handleModalContinue = () => {
    setShowModal(false);
    if (feedback === "correct") {
      advanceNext();
    } else {
      setSelectedId(null);
      setFeedback(null);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (showModal) return;
      if (e.code === "Space" || e.key === "0") {
        e.preventDefault();
        replayAudio();
        return;
      }
      if (["1", "2", "3", "4", "5"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (displayCards[idx]) {
          playClick();
          handleCardClick(displayCards[idx]);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showModal, displayCards, handleCardClick, playClick, replayAudio]);

  return (
    <ExerciseShell
      step={step}
      title="Audio & Image Matching"
      words={words}
      activeWord={currentTargetWord}
      mode="retrieval"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
            <Keyboard className="size-4" />
            <span>Press 1–5 on keyboard or tap image card</span>
          </div>
          <span>Progress: {completedWordIds.size} of {words.length} matched</span>
        </div>
      }
    >
      <FeedbackModal
        isOpen={showModal}
        isCorrect={feedback === "correct"}
        title={feedback === "correct" ? "✓ Excellent Audio Match!" : "Listen Carefully"}
        wordLabel={currentTargetWord.label}
        explanation={
          feedback === "correct"
            ? `That is "${currentTargetWord.label}".`
            : `Try again — tap the picture matching "${currentTargetWord.label}".`
        }
        onContinue={handleModalContinue}
        onTryAgain={handleModalContinue}
      />

      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* Sleek, Compact Target Audio Play Bar */}
        <div className="bg-slate-950 text-white rounded-2xl p-3 sm:p-3.5 flex items-center justify-between shadow-wp-sm border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={replayAudio}
            aria-label="Replay target audio prompt"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
              <Volume2 className={`size-5 ${isPlaying ? "animate-pulse text-wp-amber" : ""}`} />
            </div>
            <div>
              <h2 className="font-sans font-black text-sm sm:text-base text-white leading-tight flex items-center gap-2">
                <span>Listen &amp; Match Picture</span>
                {isPlaying && <span className="text-[10px] bg-amber-500/20 text-wp-amber px-2 py-0.5 rounded-full border border-amber-500/30">Playing sound…</span>}
              </h2>
              <p className="font-sans text-white/60 text-xs">Tap image card matching the spoken word.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={replayAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/90 hover:text-white text-xs font-sans font-bold border border-white/15 backdrop-blur-md transition-colors shrink-0"
          >
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        {/* Card Image Selection Grid */}
        <div
          role="radiogroup"
          aria-label="Choose matching picture for audio prompt"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full"
        >
          {displayCards.map((card, idx) => {
            const isSelected = selectedId === card.id;
            const isTargetCompleted = completedWordIds.has(card.id);

            let cardStateStyle = "border-2 border-border bg-wp-card hover:border-primary/50 hover:shadow-md";
            if (isSelected) {
              if (feedback === "correct") cardStateStyle = "border-2 border-wp-green bg-wp-green-light/40 shadow-md";
              if (feedback === "incorrect") cardStateStyle = "border-2 border-wp-rose bg-wp-rose-light/40 shadow-md animate-wp-shake";
            } else if (isTargetCompleted) {
              cardStateStyle = "border-2 border-wp-green/40 bg-wp-green-light/10 opacity-75";
            }

            return (
              <button
                key={card.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={feedback === "correct"}
                onClick={() => handleCardClick(card)}
                className={`group relative rounded-2xl overflow-hidden p-1.5 flex flex-col items-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors duration-200 shadow-wp-xs ${cardStateStyle}`}
              >
                {/* Physical Key Badge */}
                <span
                  aria-hidden
                  className="absolute top-2.5 start-2.5 z-10 bg-slate-900/90 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border border-white/20 shadow-md backdrop-blur-md pointer-events-none"
                >
                  Key [{idx + 1}]
                </span>

                <div className="h-28 sm:h-36 md:h-40 max-h-[22vh] w-full relative rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0">
                  <WordImage
                    word={card}
                    width="400"
                    height="300"
                    altMode="assessment"
                    optionIndex={idx}
                    checked={isSelected || isTargetCompleted}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isTargetCompleted && (
                    <div className="absolute top-2 end-2 bg-wp-green text-white p-1 rounded-full shadow-md">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
});

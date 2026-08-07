import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, CheckCircle2, Sparkles, RefreshCw, Keyboard } from "lucide-react";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";

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

      setTimeout(() => {
        if (targetIndex + 1 < words.length) {
          setTargetIndex((i) => i + 1);
          setSelectedId(null);
          setFeedback(null);
        } else {
          dispatch({ type: "LESSON_NEXT" });
        }
      }, 700);
    } else {
      setFeedback("incorrect");
      playIncorrect();
      dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: false });
      setTimeout(() => {
        setSelectedId(null);
        setFeedback(null);
      }, 800);
    }
  }, [feedback, currentTargetWord.id, playCorrect, playIncorrect, dispatch, completedWordIds, targetIndex, words.length]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (feedback === "correct") return;
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
  }, [feedback, displayCards, handleCardClick, playClick]);

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
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-sans font-bold text-amber-600 dark:text-amber-400">
            <Keyboard className="size-4" />
            <span>Press 1–5 on keyboard or tap image card</span>
          </div>
          <div className="flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
            <span>Group Progress: {completedWordIds.size} of {words.length} matched</span>
            <span>Item {targetIndex + 1} of {words.length}</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5 w-full">
        {/* Prompter Bar with Auto-Audio */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-wp-md border border-slate-800">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={replayAudio}
              aria-label="Replay target audio prompt"
              className="size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform shrink-0"
            >
              <Volume2 className={`size-7 ${isPlaying ? "animate-pulse text-wp-amber" : ""}`} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-xl md:text-2xl text-white whitespace-nowrap truncate">Listen &amp; Match Picture</h2>
                <Sparkles className="size-4 text-wp-amber animate-pulse" />
              </div>
              <p className="font-sans text-white/70 text-xs mt-0.5">
                Tap the matching image card or press 1–5 on your keyboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={replayAudio}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs font-sans font-bold border border-white/15 backdrop-blur-md transition-colors shrink-0"
          >
            <RefreshCw className="size-4" />
            <span>Replay Audio</span>
          </button>
        </div>

        {/* Expansive Card Image Selection Grid (Zero Layout Shift Microinteractions) */}
        <div
          role="radiogroup"
          aria-label="Choose matching picture for audio prompt"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full"
        >
          {displayCards.map((card, idx) => {
            const isSelected = selectedId === card.id;
            const isTargetCompleted = completedWordIds.has(card.id);

            // Constant border thickness (border-2) prevents pixel expansion/layout shift
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
                className={`group relative rounded-3xl overflow-hidden p-2 flex flex-col items-center gap-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-colors duration-200 min-h-[220px] shadow-wp-xs ${cardStateStyle}`}
              >
                {/* Physical Key Cap Badge */}
                <div className="absolute top-3 left-3 z-10 bg-slate-900/90 text-white text-xs font-mono font-black px-2.5 py-1 rounded-xl border border-white/20 shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
                  <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">Key [{idx + 1}]</kbd>
                </div>

                <div className="h-44 sm:h-52 w-full relative rounded-2xl overflow-hidden bg-muted border border-border/60 shrink-0">
                  <WordImage word={card} width="500" height="400" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {isTargetCompleted && (
                    <div className="absolute top-3 right-3 bg-wp-green text-white p-1.5 rounded-full shadow-md">
                      <CheckCircle2 className="size-5" />
                    </div>
                  )}
                </div>

                <div className="w-full p-2 flex items-center justify-between">
                  <p className="font-sans font-bold text-foreground text-sm truncate">
                    {isTargetCompleted || (isSelected && feedback === "correct")
                      ? card.label
                      : `Option ${idx + 1}`}
                  </p>
                  <span className="text-[11px] font-sans font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    [{idx + 1}]
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full rounded-2xl p-4 text-center text-sm font-sans font-bold shadow-xs transition-all ${
              feedback === "correct"
                ? "bg-wp-green text-white border border-wp-green animate-in fade-in"
                : "bg-wp-rose text-white border border-wp-rose animate-in fade-in"
            }`}
          >
            {feedback === "correct" ? (
              <span>✓ Excellent! That is {currentTargetWord.label}.</span>
            ) : (
              <span>Try again — listen carefully to the sound!</span>
            )}
          </div>
        )}
      </div>
    </ExerciseShell>
  );
});

import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";

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
  const hasSpokenRef = useRef<Record<number, boolean>>({});

  // Auto-play audio when prompt target changes
  useEffect(() => {
    stop();
    if (!hasSpokenRef.current[targetIndex]) {
      hasSpokenRef.current[targetIndex] = true;
      const t = setTimeout(() => speak(currentTargetWord.label), 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [targetIndex, currentTargetWord.label, speak, stop]);

  const replayAudio = () => {
    stop();
    speak(currentTargetWord.label);
  };

  // 6 Image cards drawn from current group (or extended to 6 items)
  const displayCards = useMemo(() => {
    return [...words].sort((a, b) => a.label.localeCompare(b.label));
  }, [words]);

  const handleCardClick = (card: VocabItem) => {
    if (feedback === "correct") return;

    setSelectedId(card.id);

    if (card.id === currentTargetWord.id) {
      setFeedback("correct");
      dispatch({ type: "LESSON_ATTEMPT", correct: true });

      const newCompleted = new Set(completedWordIds);
      newCompleted.add(card.id);
      setCompletedWordIds(newCompleted);

      // Auto-advance to next audio prompt after 600ms
      setTimeout(() => {
        if (targetIndex + 1 < words.length) {
          setTargetIndex((i) => i + 1);
          setSelectedId(null);
          setFeedback(null);
        } else {
          // All group words matched! Advance to next skill step
          dispatch({ type: "LESSON_NEXT" });
        }
      }, 700);
    } else {
      setFeedback("incorrect");
      dispatch({ type: "LESSON_ATTEMPT", correct: false });
      setTimeout(() => {
        setSelectedId(null);
        setFeedback(null);
      }, 800);
    }
  };

  return (
    <ExerciseShell
      step={step}
      title="Audio & Image Matching"
      words={words}
      activeWord={currentTargetWord}
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-sans font-semibold text-muted-foreground px-1">
            <span>Group Progress: {completedWordIds.size} of {words.length} matched</span>
            <span>Target: {currentTargetWord.label}</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {/* Prompter Bar with Auto-Audio */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-wp-md border border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={replayAudio}
              aria-label={`Replay audio for ${currentTargetWord.label}`}
              className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform shrink-0"
            >
              <Volume2 className={`size-6 ${isPlaying ? "animate-pulse text-wp-amber" : ""}`} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-xl md:text-2xl text-white">Listen to the word</span>
                <Sparkles className="size-4 text-wp-amber animate-pulse" />
              </div>
              <p className="font-sans text-white/70 text-xs mt-0.5">
                Tap the picture below that matches what you hear.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={replayAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs font-sans font-bold border border-white/15 backdrop-blur-md transition-colors shrink-0"
          >
            <RefreshCw className="size-3.5" />
            <span>Replay</span>
          </button>
        </div>

        {/* 6-Card Image Selection Grid */}
        <div
          role="radiogroup"
          aria-label="Choose matching picture for audio prompt"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
        >
          {displayCards.map((card) => {
            const isSelected = selectedId === card.id;
            const isTargetCompleted = completedWordIds.has(card.id);

            let cardStyle = "border-border bg-wp-card hover:border-primary/50 hover:shadow-wp-xs";
            if (isSelected) {
              if (feedback === "correct") cardStyle = "border-wp-green border-[3px] bg-wp-green-light/40 ring-4 ring-wp-green/20 scale-105";
              if (feedback === "incorrect") cardStyle = "border-wp-rose border-[3px] bg-wp-rose-light/40 animate-bounce";
            } else if (isTargetCompleted) {
              cardStyle = "border-wp-green/40 bg-wp-green-light/10 opacity-75";
            }

            return (
              <button
                key={card.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={feedback === "correct"}
                onClick={() => handleCardClick(card)}
                className={`group relative rounded-2xl border overflow-hidden p-2 flex flex-col items-center gap-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all ${cardStyle}`}
              >
                <div className="h-28 sm:h-32 w-full relative rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0">
                  <WordImage word={card} width="300" height="240" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {isTargetCompleted && (
                    <div className="absolute top-2 right-2 bg-wp-green text-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 className="size-4" />
                    </div>
                  )}
                </div>

                <p className="font-sans font-bold text-foreground text-sm truncate w-full text-center px-1">
                  {card.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Feedback Message Banner */}
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full rounded-2xl p-4 text-center text-sm font-sans font-bold shadow-sm transition-all ${
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

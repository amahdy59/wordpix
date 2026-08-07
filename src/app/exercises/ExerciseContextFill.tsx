import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getRichSentence } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseContextFill = memo(function ExerciseContextFill({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { playCorrect, playIncorrect, playClick } = useSound();

  const currentTargetWord = words[questionIndex] || words[0];
  const richSentence = useMemo(() => getRichSentence(currentTargetWord), [currentTargetWord]);

  const options = useMemo(() => {
    const otherWords = words.filter((w) => w.id !== currentTargetWord.id);
    const shuffled = shuffleArray(otherWords).slice(0, 3);
    const pool = [currentTargetWord, ...shuffled];
    return shuffleArray(pool);
  }, [currentTargetWord, words]);

  const isCorrect = selectedId === currentTargetWord.id;
  const selectedWord = options.find((item) => item.id === selectedId);

  const handleSelect = (id: string) => {
    if (checked) return;
    playClick();
    setSelectedId(id);
  };

  const handleAction = () => {
    if (checked) {
      if (isCorrect) {
        if (questionIndex + 1 < words.length) {
          setQuestionIndex((i) => i + 1);
          setSelectedId(null);
          setChecked(false);
        } else {
          dispatch({ type: "LESSON_NEXT" });
        }
      } else {
        setSelectedId(null);
        setChecked(false);
      }
      return;
    }
    if (!selectedId) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setChecked(true);
    if (isCorrect) playCorrect();
    else playIncorrect();
    dispatch({ type: "LESSON_ATTEMPT", wordId: currentTargetWord.id, correct: isCorrect });
  };

  return (
    <ExerciseShell
      step={step}
      title="Complete the Sentence"
      words={words}
      activeWord={currentTargetWord}
      mode="guided"
      groupId={groupId}
      dispatch={dispatch}
      footer={
        <div className="w-full flex flex-col gap-2">
          {/* Pinned Footer Feedback Banner (Option A: Zero Layout Shift) */}
          {checked ? (
            <div
              role="status"
              aria-live="polite"
              className={`w-full rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md transition-all ${
                isCorrect
                  ? "bg-wp-green text-white border border-wp-green"
                  : "bg-wp-rose text-white border border-wp-rose"
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="size-7 shrink-0 text-white animate-in zoom-in" />
                ) : (
                  <XCircle className="size-7 shrink-0 text-white animate-in zoom-in" />
                )}
                <div>
                  <h3 className="font-sans font-black text-base leading-tight">
                    {isCorrect ? "✓ Sentence Completed!" : "Check Sentence Context"}
                  </h3>
                  <p className="font-sans text-xs text-white/95 mt-0.5">
                    {isCorrect
                      ? `"${richSentence.full}"`
                      : `Correct sentence: "${richSentence.full}"`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAction}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm transition-all ${
                  isCorrect
                    ? "bg-white text-wp-green hover:bg-white/90"
                    : "bg-white text-wp-rose hover:bg-white/90"
                }`}
              >
                <span>
                  {isCorrect
                    ? questionIndex + 1 < words.length
                      ? "Next Sentence →"
                      : "Complete Step →"
                    : "Try Again"}
                </span>
                {isCorrect ? <ArrowRight className="size-4" /> : <RotateCcw className="size-4" />}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {!selectedId && (
                <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
                  Select a word below to complete the sentence
                </p>
              )}
              <button
                type="button"
                onClick={handleAction}
                className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-all shadow-wp-xs ${
                  shaking ? "animate-wp-shake" : ""
                } ${selectedId ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"}`}
              >
                Check Answer
              </button>
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-5 w-full">
        {/* Question Counter Header */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>Sentence {questionIndex + 1} of {words.length}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            Context Drill · {currentTargetWord.label}
          </span>
        </div>

        {/* Large Prominent Hero Target Image Display */}
        <div className="h-56 sm:h-64 w-full relative rounded-3xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0">
          <WordImage word={currentTargetWord} width="800" height="600" className="size-full object-cover" />
          <div className="absolute top-3.5 left-3.5 bg-black/65 backdrop-blur-md text-white font-sans font-bold text-xs px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md flex items-center gap-2">
            <Sparkles className="size-4 text-wp-amber animate-pulse" />
            <span>Target Visual: {currentTargetWord.label}</span>
          </div>
        </div>

        {/* Centered Rich Sentence Display Box */}
        <div className="bg-wp-card rounded-2xl border border-border p-6 text-center shadow-wp-xs flex flex-col items-center justify-center gap-2">
          <span className="font-sans font-bold text-[11px] text-primary uppercase tracking-wider">
            Sentence Context Clue
          </span>
          <p className="font-sans font-bold text-foreground text-xl md:text-2xl leading-relaxed flex items-center justify-center flex-wrap gap-2 py-1">
            <span>{richSentence.clozeBefore}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[140px] h-12 px-4 rounded-xl border-2 transition-all font-sans font-black text-xl shadow-xs ${
                selectedWord
                  ? checked
                    ? isCorrect
                      ? "bg-wp-green text-white border-wp-green"
                      : "bg-wp-rose text-white border-wp-rose"
                    : "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/80 border-dashed border-primary/50 text-muted-foreground"
              }`}
            >
              {selectedWord ? selectedWord.label.toLowerCase() : "_______"}
            </span>
            <span>{richSentence.clozeAfter}</span>
          </p>
        </div>

        {/* Word Options Grid (2x2 Grid) */}
        <div role="radiogroup" aria-label="Word choices" className="grid grid-cols-2 gap-3.5 w-full">
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={checked}
                onClick={() => handleSelect(option.id)}
                className={`rounded-2xl p-4 font-sans font-bold text-base border-2 min-h-[56px] transition-colors duration-200 flex items-center justify-between shadow-wp-xs ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-wp-card border-border text-foreground hover:border-primary/50 hover:shadow-md"
                } focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary`}
              >
                <span className="capitalize">{option.label.toLowerCase()}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  [{idx + 1}]
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
});

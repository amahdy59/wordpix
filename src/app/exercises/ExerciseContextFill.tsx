import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { articleFor } from "./exerciseContent";
import { WordImage } from "../shared/WordImage";
import { shuffleArray } from "../../utils/shuffle";
import { useSound } from "../shared/useSound";

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
        <div className="flex flex-col gap-1.5">
          {!selectedId && !checked && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Select a word below to complete the sentence
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-all shadow-wp-xs ${
              shaking ? "animate-bounce" : ""
            } ${
              checked
                ? isCorrect ? "bg-wp-green" : "bg-wp-rose"
                : selectedId ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"
            }`}
          >
            {checked
              ? isCorrect
                ? questionIndex + 1 < words.length
                  ? `Next Sentence (${questionIndex + 2}/${words.length}) →`
                  : "Complete Step →"
                : "Try Again"
              : "Check Answer"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 w-full">
        {/* Question Counter Header */}
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          <span>Sentence {questionIndex + 1} of {words.length}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full">
            Group context drill
          </span>
        </div>

        {/* Target Image Preview Card */}
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-wp-xs">
          <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
            <WordImage word={currentTargetWord} width="80" height="80" className="size-full object-cover" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-foreground text-xl">Fill in the blank</h2>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">Match the image context to complete the sentence.</p>
          </div>
        </div>

        {/* Beautiful Centered Sentence Display Box */}
        <div className="bg-wp-card rounded-2xl border border-border p-6 text-center shadow-wp-xs flex flex-col items-center justify-center gap-2">
          <span className="font-sans font-bold text-[11px] text-primary uppercase tracking-wider">
            Sentence Context
          </span>
          <p className="font-sans font-black text-foreground text-2xl md:text-3xl leading-relaxed flex items-center justify-center flex-wrap gap-2 py-2">
            <span>This is {articleFor(currentTargetWord.label)}</span>
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
            <span>.</span>
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
                className={`rounded-2xl p-4 font-sans font-bold text-base border min-h-[56px] transition-all flex items-center justify-between shadow-wp-xs ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-102"
                    : "bg-wp-card border-border text-foreground hover:border-primary/40 hover:shadow-md"
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

        {checked && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full rounded-2xl p-4 text-sm font-sans font-bold text-center border shadow-xs transition-all ${
              isCorrect
                ? "bg-wp-green text-white border-wp-green"
                : "bg-wp-rose text-white border-wp-rose"
            }`}
          >
            {isCorrect
              ? "✓ Excellent! The sentence matches the picture perfectly."
              : `Try again — the picture shows ${articleFor(currentTargetWord.label)} ${currentTargetWord.label.toLowerCase()}.`}
          </div>
        )}
      </div>
    </ExerciseShell>
  );
});

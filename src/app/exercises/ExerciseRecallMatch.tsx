import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { getWordOptions } from "./exerciseContent";

interface Props {
  step: number;
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({ step, word, dispatch }: Props) {
  const options = useMemo(() => getWordOptions(word), [word]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selectedId === word.id;

  const handleAction = () => {
    if (checked) {
      if (isCorrect) dispatch({ type: "LESSON_NEXT" });
      else {
        setSelectedId(null);
        setChecked(false);
      }
      return;
    }
    if (!selectedId) return;
    setChecked(true);
    dispatch({ type: "LESSON_ATTEMPT", correct: isCorrect });
  };

  return (
    <div className="bg-background flex flex-col justify-between min-h-full relative">
      <LessonHeader title="Recall & Match" step={step} onBack={() => dispatch({ type: "LESSON_PREVIOUS" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 flex flex-col items-center w-full px-5 gap-4 pt-4">
        <h2 className="font-sans font-bold text-foreground text-xl text-center">What is this?</h2>
        <div className="h-48 relative rounded-2xl w-full overflow-hidden border border-border bg-muted">
          <img alt={`Identify the pictured ${word.label.toLowerCase()}`} className="absolute inset-0 object-cover size-full" src={word.img} width="800" height="500" />
        </div>
        <div role="radiogroup" aria-label="Choose the correct word" className="grid grid-cols-2 gap-2.5 w-full">
          {options.map((option) => {
            const selected = selectedId === option.id;
            const resultClass = checked && selected
              ? isCorrect ? "border-wp-green bg-wp-green-light" : "border-wp-rose bg-wp-rose-light"
              : selected ? "border-primary bg-secondary border-2" : "border-border bg-wp-card";
            return (
              <button key={option.id} type="button" role="radio" aria-checked={selected} disabled={checked} onClick={() => setSelectedId(option.id)} className={`rounded-xl border p-4 min-h-[60px] font-sans font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${resultClass}`}>
                {option.label}
              </button>
            );
          })}
        </div>
        {checked && (
          <p role="status" aria-live="polite" className={`w-full rounded-xl p-3 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}>
            {isCorrect ? `Correct — this is ${word.label}.` : `Not quite. Look closely, then try ${word.label} again.`}
          </p>
        )}
      </main>
      <footer className="w-full px-5 pb-10 pt-3">
        <button type="button" onClick={handleAction} disabled={!selectedId} className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] disabled:opacity-40 ${checked ? isCorrect ? "bg-wp-green" : "bg-wp-rose" : "bg-wp-blue"}`}>
          {checked ? isCorrect ? "Continue" : "Try Again" : "Check Answer"}
        </button>
      </footer>
      <HomeIndicator />
    </div>
  );
});

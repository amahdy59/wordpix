import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { articleFor, getWordOptions } from "./exerciseContent";

interface Props {
  step: number;
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseContextFill = memo(function ExerciseContextFill({ step, word, dispatch }: Props) {
  const options = useMemo(() => getWordOptions(word), [word]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selectedId === word.id;
  const selectedWord = options.find((item) => item.id === selectedId);

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
      <LessonHeader title="Complete the Sentence" step={step} onBack={() => dispatch({ type: "LESSON_PREVIOUS" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 flex flex-col items-center w-full px-5 gap-5 pt-4 max-w-md mx-auto">
        <h2 className="font-sans font-bold text-foreground text-xl text-center">Complete the sentence</h2>
        <div className="h-40 relative rounded-2xl w-full overflow-hidden border border-border bg-muted">
          <img alt={word.label} className="absolute inset-0 object-cover size-full" src={word.img} width="800" height="500" />
        </div>
        <p className="font-sans font-bold text-foreground text-xl text-center">
          This is {articleFor(word.label)} <span className="inline-block min-w-24 border-b-2 border-primary text-primary">{selectedWord?.label.toLowerCase() ?? "_______"}</span>.
        </p>
        <div role="group" aria-label="Word choices" className="flex flex-wrap gap-2.5 justify-center">
          {options.map((option) => (
            <button key={option.id} type="button" aria-pressed={selectedId === option.id} disabled={checked} onClick={() => setSelectedId(option.id)} className={`rounded-xl px-4 py-2.5 font-sans font-bold text-sm border min-h-[44px] ${selectedId === option.id ? "bg-primary border-primary text-primary-foreground" : "bg-wp-card border-border text-foreground"}`}>
              {option.label.toLowerCase()}
            </button>
          ))}
        </div>
        {checked && <p role="status" aria-live="polite" className={`w-full rounded-xl p-3 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}>{isCorrect ? "Correct. The sentence now matches the picture." : `Try again — the picture shows ${articleFor(word.label)} ${word.label.toLowerCase()}.`}</p>}
      </main>
      <footer className="w-full max-w-md mx-auto px-5 pb-10 pt-3">
        <button type="button" onClick={handleAction} disabled={!selectedId} className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] disabled:opacity-40 ${checked ? isCorrect ? "bg-wp-green" : "bg-wp-rose" : "bg-wp-blue"}`}>
          {checked ? isCorrect ? "Continue" : "Try Again" : "Check Answer"}
        </button>
      </footer>
      <HomeIndicator />
    </div>
  );
});

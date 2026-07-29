import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { articleFor } from "./exerciseContent";

interface Props {
  step: number;
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseSentenceBuilder = memo(function ExerciseSentenceBuilder({ step, word, dispatch }: Props) {
  const answer = useMemo(() => ["This", "is", articleFor(word.label), word.label.toLowerCase()], [word.label]);
  const shuffled = useMemo(() => [answer[3], answer[0], answer[2], answer[1]], [answer]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const isCorrect = placed.join(" ") === answer.join(" ");

  const handleAction = () => {
    if (checked) {
      if (isCorrect) dispatch({ type: "LESSON_NEXT" });
      else {
        setPlaced([]);
        setChecked(false);
      }
      return;
    }
    if (placed.length !== answer.length) return;
    setChecked(true);
    dispatch({ type: "LESSON_ATTEMPT", correct: isCorrect });
  };

  return (
    <div className="bg-background flex flex-col justify-between min-h-full relative">
      <LessonHeader title="Build a Sentence" step={step} onBack={() => dispatch({ type: "LESSON_PREVIOUS" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 flex flex-col items-center w-full px-5 gap-4 pt-4 max-w-md mx-auto">
        <h2 className="font-sans font-bold text-foreground text-xl text-center">Describe the picture</h2>
        <div className="h-40 relative rounded-2xl w-full overflow-hidden border border-border bg-muted">
          <img alt={word.label} className="absolute inset-0 object-cover size-full" src={word.img} width="800" height="500" />
        </div>
        <div className="bg-wp-card rounded-2xl border border-border p-4 w-full flex flex-wrap gap-2 items-center min-h-[72px]" aria-label="Built sentence">
          {placed.map((item, index) => (
            <button key={`${item}-${index}`} type="button" disabled={checked} onClick={() => setPlaced((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="bg-primary rounded-lg px-3 py-2 font-sans font-bold text-primary-foreground text-sm">
              {item}
            </button>
          ))}
          {placed.length === 0 && <span className="text-muted-foreground text-sm">Choose words in the correct order.</span>}
        </div>
        <div role="group" aria-label="Available words" className="flex flex-wrap gap-2 justify-center">
          {shuffled.map((item, index) => {
            const usedCount = placed.filter((placedItem) => placedItem === item).length;
            const availableCount = shuffled.slice(0, index + 1).filter((poolItem) => poolItem === item).length;
            const used = usedCount >= availableCount;
            return <button key={`${item}-${index}`} type="button" disabled={checked || used} onClick={() => setPlaced((items) => [...items, item])} className="bg-wp-card rounded-xl border border-border px-4 py-2.5 font-sans font-bold text-foreground text-sm disabled:opacity-35 min-h-[44px]">{item}</button>;
          })}
        </div>
        {checked && <p role="status" aria-live="polite" className={`w-full rounded-xl p-3 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}>{isCorrect ? "Great sentence!" : `Try this order: ${answer.join(" ")}.`}</p>}
      </main>
      <footer className="w-full max-w-md mx-auto px-5 pb-10 pt-3">
        <button type="button" onClick={handleAction} disabled={placed.length !== answer.length} className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] disabled:opacity-40 ${checked ? isCorrect ? "bg-wp-green" : "bg-wp-rose" : "bg-wp-blue"}`}>
          {checked ? isCorrect ? "Continue" : "Try Again" : "Check Sentence"}
        </button>
      </footer>
      <HomeIndicator />
    </div>
  );
});

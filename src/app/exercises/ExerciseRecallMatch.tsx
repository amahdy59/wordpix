import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { getWordOptions } from "./exerciseContent";

interface Props {
  step: number;
  word: VocabItem;
  currentWordIndex?: number;
  totalWordsQueue?: number;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({
  step,
  word,
  currentWordIndex = 0,
  totalWordsQueue = 5,
  dispatch,
}: Props) {
  const options = useMemo(() => getWordOptions(word), [word]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [shaking, setShaking] = useState(false);
  const isCorrect = selectedId === word.id;

  const handleAction = () => {
    if (checked) {
      if (isCorrect) dispatch({ type: "LESSON_NEXT" });
      else { setSelectedId(null); setChecked(false); }
      return;
    }
    if (!selectedId) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setChecked(true);
    dispatch({ type: "LESSON_ATTEMPT", correct: isCorrect });
  };

  return (
    <ExerciseShell
      step={step}
      title="Recall & Match"
      word={word}
      currentWordIndex={currentWordIndex}
      totalWordsQueue={totalWordsQueue}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-1.5">
          {!selectedId && !checked && (
            <p className="text-[11px] font-sans font-semibold text-center text-amber-600 dark:text-amber-400">
              Tap an option above to answer
            </p>
          )}
          <button
            type="button"
            onClick={handleAction}
            className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] transition-all ${
              shaking ? "animate-bounce" : ""
            } ${
              checked
                ? isCorrect ? "bg-wp-green" : "bg-wp-rose"
                : selectedId ? "bg-wp-blue opacity-100" : "bg-wp-blue opacity-50"
            }`}
          >
            {checked ? isCorrect ? "Continue" : "Try Again" : "Check Answer"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="font-sans font-bold text-foreground text-xl">What is this?</h2>

        <div role="radiogroup" aria-label="Choose the correct word" className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            const selected = selectedId === option.id;
            const resultClass = checked && selected
              ? isCorrect ? "border-wp-green bg-wp-green-light text-wp-green" : "border-wp-rose bg-wp-rose-light text-wp-rose"
              : selected ? "border-primary bg-secondary border-2 text-primary" : "border-border bg-wp-card text-foreground";
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={checked}
                onClick={() => setSelectedId(option.id)}
                className={`rounded-xl border p-4 min-h-[64px] font-sans font-semibold text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all ${resultClass}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {checked && (
          <p
            role="status"
            aria-live="polite"
            className={`w-full rounded-xl p-4 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}
          >
            {isCorrect ? `Correct — this is ${word.label}.` : `Not quite. Look closely, then try ${word.label} again.`}
          </p>
        )}
      </div>
    </ExerciseShell>
  );
});

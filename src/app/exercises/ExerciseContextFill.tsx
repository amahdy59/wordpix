import { memo, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
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
      else { setSelectedId(null); setChecked(false); }
      return;
    }
    if (!selectedId) return;
    setChecked(true);
    dispatch({ type: "LESSON_ATTEMPT", correct: isCorrect });
  };

  return (
    <ExerciseShell
      step={step}
      title="Complete the Sentence"
      word={word}
      dispatch={dispatch}
      footer={
        <button
          type="button"
          onClick={handleAction}
          disabled={!selectedId}
          className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] disabled:opacity-40 transition-colors ${
            checked ? isCorrect ? "bg-wp-green" : "bg-wp-rose" : "bg-wp-blue"
          }`}
        >
          {checked ? isCorrect ? "Continue" : "Try Again" : "Check Answer"}
        </button>
      }
    >
      <div className="flex flex-col gap-5 w-full max-w-lg">
        <h2 className="font-sans font-bold text-foreground text-xl">Complete the sentence</h2>

        {/* Sentence display */}
        <div className="bg-wp-card rounded-2xl border border-border p-5 text-center">
          <p className="font-sans font-bold text-foreground text-xl leading-relaxed">
            This is {articleFor(word.label)}{" "}
            <span className="inline-block min-w-28 border-b-2 border-primary text-primary px-1">
              {selectedWord?.label.toLowerCase() ?? "_______"}
            </span>
            .
          </p>
        </div>

        {/* Word options */}
        <div role="group" aria-label="Word choices" className="flex flex-wrap gap-3 justify-center">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={selectedId === option.id}
              disabled={checked}
              onClick={() => setSelectedId(option.id)}
              className={`rounded-xl px-5 py-3 font-sans font-bold text-sm border min-h-[48px] transition-all ${
                selectedId === option.id
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-wp-card border-border text-foreground hover:border-primary/40"
              } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
            >
              {option.label.toLowerCase()}
            </button>
          ))}
        </div>

        {checked && (
          <p
            role="status"
            aria-live="polite"
            className={`w-full rounded-xl p-4 text-sm font-sans font-semibold ${isCorrect ? "bg-wp-green-light text-wp-green" : "bg-wp-rose-light text-wp-rose"}`}
          >
            {isCorrect
              ? "Correct. The sentence now matches the picture."
              : `Try again — the picture shows ${articleFor(word.label)} ${word.label.toLowerCase()}.`}
          </p>
        )}
      </div>
    </ExerciseShell>
  );
});

import { memo, useState } from "react";
import type { Action } from "../types";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Check, X, ArrowRight } from "lucide-react";

const imgClue = "https://images.unsplash.com/photo-1623944436679-5412c658a358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  step: number;
  dispatch: React.Dispatch<Action>;
}

const CHIPS = ["pillow", "blanket", "lamp", "curtain"];
const CORRECT = "pillow";

export const ExerciseContextFill = memo(function ExerciseContextFill({ step, dispatch }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = sel === CORRECT;

  const handleCheck = () => {
    if (!sel) return;
    setChecked(true);
    setTimeout(() => dispatch({ type: "LESSON_NEXT" }), 1200);
  };

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <LessonHeader
        title="Complete the Sentence"
        step={step}
        onBack={() => dispatch({ type: "LESSON_NEXT" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      <main className="flex-1 flex flex-col items-center w-full px-5 gap-4 pt-4 max-w-md mx-auto">
        <h2 className="font-sans font-bold text-foreground text-xl text-center w-full">
          Complete the Sentence
        </h2>

        {/* Clue image */}
        <div className="h-36 relative rounded-2xl w-full overflow-hidden border border-border bg-muted shadow-wp-xs">
          <img
            alt="A bedroom with a pillow on the bed"
            className="absolute inset-0 object-cover size-full"
            src={imgClue}
          />
        </div>

        {/* Sentence with blank */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full my-2">
          {["She", "sleeps", "on", "the"].map((word) => (
            <span
              key={word}
              className="font-sans font-bold text-foreground text-xl"
            >
              {word}
            </span>
          ))}
          <div
            className={`inline-flex items-center justify-center rounded-xl min-w-[90px] h-10 px-3 border-2 transition-all ${
              sel
                ? checked
                  ? isCorrect
                    ? "border-wp-green bg-wp-green-light"
                    : "border-wp-rose bg-wp-rose-light"
                  : "border-primary bg-secondary"
                : "border-dashed border-primary/50"
            }`}
            aria-live="polite"
            aria-label={sel ? `Selected: ${sel}` : "Blank to fill"}
          >
            {sel && (
              <span
                className={`font-sans font-bold text-base ${
                  checked ? (isCorrect ? "text-wp-green" : "text-wp-rose") : "text-primary"
                }`}
              >
                {sel}
              </span>
            )}
          </div>
          <span className="font-sans font-bold text-foreground text-xl">.</span>
        </div>

        {/* Word choices */}
        <div
          role="group"
          aria-label="Word choices"
          className="flex flex-wrap gap-2.5 justify-center mt-2"
        >
          {CHIPS.map((chip) => {
            const isSelected = sel === chip;
            return (
              <button
                key={chip}
                type="button"
                aria-pressed={isSelected}
                disabled={checked}
                onClick={() => !checked && setSel(isSelected ? null : chip)}
                className={`rounded-xl px-4 py-2.5 font-sans font-bold text-sm border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed motion-safe:transition-all shadow-wp-xs ${
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "bg-wp-card border-border text-foreground hover:border-primary/40"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </main>

      <footer className="w-full max-w-md mx-auto px-5 pb-10 pt-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={!sel || checked}
          className={`rounded-xl py-4 w-full font-sans font-bold text-white text-base min-h-[52px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-all shadow-wp-xs flex items-center justify-center gap-2 ${
            checked
              ? isCorrect
                ? "bg-wp-green focus-visible:outline-wp-green"
                : "bg-wp-rose focus-visible:outline-wp-rose"
              : "bg-wp-blue focus-visible:outline-wp-blue"
          }`}
        >
          {checked ? (
            isCorrect ? (
              <>
                <Check className="size-5" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <X className="size-5" />
                <span>Try Again</span>
              </>
            )
          ) : (
            <>
              <span>Check Answer</span>
              <ArrowRight className="size-5" />
            </>
          )}
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});

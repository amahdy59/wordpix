import { memo, useState } from "react";
import type { Action } from "../types";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";

import imgClue from "@/imports/FlowLessonExercises/c671a908cb680b90c365222b2c54c47cf545dddb.png";

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

      <main className="flex-1 flex flex-col items-center w-full px-[20px] gap-[16px] pt-[16px]">
        <h2 className="font-sans font-bold text-foreground text-[20px] text-center w-full">
          Complete the Sentence
        </h2>

        {/* Clue image */}
        <div className="h-[140px] relative rounded-xl w-full overflow-hidden border border-border">
          <img
            alt="A bedroom with a pillow on the bed"
            className="absolute inset-0 object-cover size-full"
            src={imgClue}
          />
        </div>

        {/* Sentence with blank */}
        <div className="flex flex-wrap items-center justify-center gap-[6px] w-full">
          {["She", "sleeps", "on", "the"].map((word) => (
            <span
              key={word}
              className="font-sans font-semibold text-foreground text-[20px]"
            >
              {word}
            </span>
          ))}
          <div
            className={`inline-flex items-center justify-center rounded-lg min-w-[80px] h-[36px] px-[10px] border-b-[3px] ${
              sel
                ? checked
                  ? isCorrect
                    ? "border-accent bg-accent/10"
                    : "border-primary bg-secondary"
                  : "border-primary bg-secondary"
                : "border-primary"
            }`}
            aria-live="polite"
            aria-label={sel ? `Selected: ${sel}` : "Blank to fill"}
          >
            {sel && (
              <span
                className={`font-sans font-semibold text-[16px] ${
                  checked ? (isCorrect ? "text-accent" : "text-primary") : "text-primary"
                }`}
              >
                {sel}
              </span>
            )}
          </div>
          <span className="font-sans font-semibold text-foreground text-[20px]">.</span>
        </div>

        {/* Word chips */}
        <div
          role="group"
          aria-label="Word choices"
          className="flex flex-wrap gap-[8px] justify-center"
        >
          {CHIPS.map((chip) => {
            const isSelected = sel === chip;
            return (
              <button
                key={chip}
                aria-pressed={isSelected}
                disabled={checked}
                onClick={() => !checked && setSel(isSelected ? null : chip)}
                className={`rounded-lg px-[16px] py-[8px] font-sans font-semibold text-[15px] border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed motion-safe:transition-colors ${
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "bg-wp-card border-border text-foreground"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </main>

      <footer className="w-full px-[20px] pb-[40px] pt-[12px]">
        <button
          onClick={handleCheck}
          disabled={!sel || checked}
          className={`rounded-xl py-[16px] w-full font-sans font-bold text-white text-[17px] min-h-[56px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors motion-safe:duration-300 ${
            checked ? (isCorrect ? "bg-accent focus-visible:outline-accent" : "bg-primary focus-visible:outline-primary") : "bg-wp-blue focus-visible:outline-wp-blue"
          }`}
        >
          {checked ? (isCorrect ? "Correct! ✓" : "Not quite...") : "Next"}
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});

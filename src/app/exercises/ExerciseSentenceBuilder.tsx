import { memo, useState } from "react";
import type { Action } from "../types";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { SENTENCE_FIXED_WORDS, SENTENCE_POOL_INITIAL } from "../constants";

const imgLampDesk = "https://images.unsplash.com/photo-1776476269609-c41ae855bb8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  step: number;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseSentenceBuilder = memo(function ExerciseSentenceBuilder({ step, dispatch }: Props) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([...SENTENCE_POOL_INITIAL]);
  const [checked, setChecked] = useState(false);

  const isCorrect = placed.join(" ").toLowerCase() === "on the desk";

  const placeWord = (word: string) => {
    if (checked) return;
    setPool((p) => p.filter((w) => w !== word));
    setPlaced((p) => [...p, word]);
  };

  const removeWord = (word: string) => {
    if (checked) return;
    setPlaced((p) => p.filter((w) => w !== word));
    setPool((p) => [...p, word]);
  };

  const handleCheck = () => {
    if (placed.length === 0) return;
    setChecked(true);
    setTimeout(() => dispatch({ type: "LESSON_NEXT" }), 1200);
  };

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <LessonHeader
        title="Build a Sentence"
        step={step}
        onBack={() => dispatch({ type: "LESSON_NEXT" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      <main className="flex-1 flex flex-col items-center w-full px-[20px] gap-[16px] pt-[16px]">
        <h2 className="font-sans font-bold text-foreground text-[20px] text-center w-full">
          Build a Sentence
        </h2>

        <div className="h-[160px] relative rounded-xl w-full overflow-hidden border border-border">
          <img
            alt="A lamp sitting on a desk"
            className="absolute inset-0 object-cover size-full"
            src={imgLampDesk}
          />
        </div>

        {/* Answer area */}
        <div
          className="bg-wp-card rounded-xl border border-border p-[14px] w-full flex flex-wrap gap-[8px] items-center min-h-[60px]"
          aria-label="Built sentence area"
        >
          {/* Fixed words */}
          {SENTENCE_FIXED_WORDS.map((w) => (
            <span
              key={w}
              className="font-sans font-semibold text-foreground text-[17px]"
            >
              {w}
            </span>
          ))}

          {/* Placed chips */}
          {placed.map((w, i) => (
            <button
              key={`${w}-${i}`}
              onClick={() => removeWord(w)}
              aria-label={`Remove "${w}" from sentence`}
              disabled={checked}
              className="bg-primary rounded-md px-[12px] py-[6px] font-sans font-semibold text-white text-[15px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
            >
              {w}
            </button>
          ))}

          {/* Empty slot */}
          {placed.length < SENTENCE_POOL_INITIAL.length && (
            <div
              className="rounded-md border-2 border-dashed border-primary px-[20px] py-[6px] min-w-[60px]"
              aria-label="Empty word slot"
            />
          )}
        </div>

        {/* Word pool */}
        <div
          role="group"
          aria-label="Available words to place"
          className="flex flex-wrap gap-[8px] justify-center w-full"
        >
          {pool.map((word) => (
            <button
              key={word}
              onClick={() => placeWord(word)}
              aria-label={`Add "${word}" to sentence`}
              disabled={checked}
              className="bg-wp-card rounded-lg border border-border px-[16px] py-[8px] font-sans font-semibold text-foreground text-[15px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
            >
              {word}
            </button>
          ))}
        </div>
      </main>

      <footer className="w-full px-[20px] pb-[40px] pt-[12px]">
        <button
          onClick={handleCheck}
          disabled={placed.length === 0 || checked}
          className={`rounded-xl py-[16px] w-full font-sans font-bold text-white text-[17px] min-h-[56px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors motion-safe:duration-300 ${
            checked ? (isCorrect ? "bg-accent focus-visible:outline-accent" : "bg-primary focus-visible:outline-primary") : "bg-wp-blue focus-visible:outline-wp-blue"
          }`}
        >
          {checked ? (isCorrect ? "Correct! ✓" : "Not quite...") : "Submit"}
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});

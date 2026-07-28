import { memo, useState } from "react";
import type { Action } from "../types";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { SENTENCE_FIXED_WORDS, SENTENCE_POOL_INITIAL } from "../constants";
import { Check, X, ArrowRight } from "lucide-react";

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

      <main className="flex-1 flex flex-col items-center w-full px-5 gap-4 pt-4 max-w-md mx-auto">
        <h2 className="font-sans font-bold text-foreground text-xl text-center w-full">
          Build a Sentence
        </h2>

        <div className="h-40 relative rounded-2xl w-full overflow-hidden border border-border bg-muted shadow-wp-xs">
          <img
            alt="A lamp sitting on a desk"
            className="absolute inset-0 object-cover size-full"
            src={imgLampDesk}
          />
        </div>

        {/* Answer area */}
        <div
          className="bg-wp-card rounded-2xl border border-border p-4 w-full flex flex-wrap gap-2 items-center min-h-[64px] shadow-wp-xs"
          aria-label="Built sentence area"
        >
          {/* Fixed words */}
          {SENTENCE_FIXED_WORDS.map((w) => (
            <span
              key={w}
              className="font-sans font-bold text-foreground text-lg"
            >
              {w}
            </span>
          ))}

          {/* Placed chips */}
          {placed.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              onClick={() => removeWord(w)}
              aria-label={`Remove "${w}" from sentence`}
              disabled={checked}
              className="bg-primary hover:opacity-90 rounded-lg px-3 py-1.5 font-sans font-bold text-white text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed shadow-wp-xs transition-all"
            >
              {w}
            </button>
          ))}

          {/* Empty slot */}
          {placed.length < SENTENCE_POOL_INITIAL.length && (
            <div
              className="rounded-lg border-2 border-dashed border-primary/50 px-4 py-1.5 min-w-[60px] h-8"
              aria-label="Empty word slot"
            />
          )}
        </div>

        {/* Word pool */}
        <div
          role="group"
          aria-label="Available words to place"
          className="flex flex-wrap gap-2 justify-center w-full mt-1"
        >
          {pool.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => placeWord(word)}
              aria-label={`Add "${word}" to sentence`}
              disabled={checked}
              className="bg-wp-card hover:border-primary/40 rounded-xl border border-border px-4 py-2.5 font-sans font-bold text-foreground text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed shadow-wp-xs transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      </main>

      <footer className="w-full max-w-md mx-auto px-5 pb-10 pt-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={placed.length === 0 || checked}
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
                <span>Sentence Correct!</span>
              </>
            ) : (
              <>
                <X className="size-5" />
                <span>Not Quite</span>
              </>
            )
          ) : (
            <>
              <span>Submit Sentence</span>
              <ArrowRight className="size-5" />
            </>
          )}
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});

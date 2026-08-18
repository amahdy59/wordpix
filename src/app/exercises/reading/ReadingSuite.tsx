import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";

import { BookOpen } from "lucide-react";
import { useSound } from "../../shared/useSound";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Visual Context (Image-Based Vocabulary)
export const ExReadingVisualContext = memo(function ExReadingVisualContext({ dispatch }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { playCorrect } = useSound();

  const target = BEDROOM_VOCABULARY[1]; // Blanket
  const choices = ["Blanket", "Dresser", "Wardrobe", "Nightstand"];

  const handleCheck = () => {
    setChecked(true);
    playCorrect();
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader
        title="Visual Context & Clues"
        current={1}
        total={9}
        onBack={() => dispatch({ type: "GO", to: "explore" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="w-full relative rounded-xl overflow-hidden border border-border shadow-wp-lg bg-muted shrink-0">
          <WordImage word={target} className="w-full h-auto block object-contain rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelected(c)}
              className={`p-4 rounded-2xl border font-sans font-bold text-base transition-all ${
                checked
                  ? c === target.label
                    ? "bg-wp-green-light border-wp-green text-wp-green"
                    : selected === c
                      ? "bg-wp-rose-light border-wp-rose text-wp-rose"
                      : "bg-wp-card border-border opacity-50"
                  : selected === c
                    ? "bg-secondary border-primary border-[2px] text-primary"
                    : "bg-wp-card border-border text-foreground hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {checked && (
          <div className="bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-2">
            <span className="font-sans font-bold text-xs text-primary uppercase">
              Why This Matters
            </span>
            <p className="font-sans text-xs text-foreground/80 leading-relaxed">
              <strong>Blanket</strong> — a thick cloth cover used on a bed for warmth. Context clue:
              layered over the mattress and duvet.
            </p>
          </div>
        )}

        <PrimaryButton
          label={checked ? "Next →" : "Check Answer"}
          onClick={checked ? () => dispatch({ type: "GO", to: "explore" }) : handleCheck}
        />
      </main>
    </div>
  );
});

// 7. Lesson Results (Reading)
export const ExReadingResults = memo(function ExReadingResults({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-2xl mb-4">
        <BookOpen className="size-12 text-primary" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Reading Module Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Reading drills are untimed practice and are not scored. Head back to a lesson to earn XP
        toward your streak.
      </p>
      <PrimaryButton label="Continue" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

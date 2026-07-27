import { memo, useState } from "react";
import type { Action } from "../types";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";

const PILLOW_IMG = "https://images.unsplash.com/photo-1623944436679-5412c658a358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80";

interface Props {
  step: number;
  dispatch: React.Dispatch<Action>;
}

const OPTIONS = [
  { id: "a", en: "Blanket",  ar: "بطانية" },
  { id: "b", en: "Pillow",   ar: "وسادة",  correct: true },
  { id: "c", en: "Curtain",  ar: "ستارة" },
  { id: "d", en: "Lamp",     ar: "مصباح" },
];

export const ExerciseRecallMatch = memo(function ExerciseRecallMatch({ step, dispatch }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const correct = OPTIONS.find((o) => o.correct);
  const isCorrect = sel === correct?.id;

  const handleCheck = () => {
    if (!sel) return;
    setChecked(true);
    setTimeout(() => dispatch({ type: "LESSON_NEXT" }), 1200);
  };

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <LessonHeader
        title="Recall & Match"
        step={step}
        onBack={() => dispatch({ type: "LESSON_NEXT" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      <main className="flex-1 flex flex-col items-center w-full px-[20px] gap-[16px] pt-[16px]">
        <h2 className="font-sans font-bold text-foreground text-[20px] text-center w-full">
          What is this?
        </h2>

        <div className="h-[180px] relative rounded-2xl w-full overflow-hidden border border-border">
          <img
            alt="White pillows on a bed — identify this object"
            className="absolute inset-0 object-cover size-full"
            src={PILLOW_IMG}
          />
        </div>

        {/* 2x2 option grid */}
        <div
          role="radiogroup"
          aria-label="Choose the correct word"
          className="grid grid-cols-2 gap-[10px] w-full"
        >
          {OPTIONS.map((opt) => {
            const isSelected = sel === opt.id;
            let borderClass = "border-border bg-wp-card";
            if (checked && isSelected) {
              borderClass = isCorrect
                ? "border-accent bg-accent/10"
                : "border-primary bg-secondary";
            } else if (isSelected) {
              borderClass = "border-3 border-primary bg-secondary";
            }

            return (
              <button
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                disabled={checked}
                onClick={() => !checked && setSel(opt.id)}
                className={`rounded-xl border p-[14px] flex flex-col items-center gap-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${borderClass}`}
              >
                <span className="font-sans font-semibold text-foreground text-[16px]">
                  {opt.en}
                </span>
                <span
                  className="font-arabic text-muted-foreground text-[12px]"
                  dir="auto"
                  lang="ar"
                >
                  {opt.ar}
                </span>
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
          {checked ? (isCorrect ? "Correct! ✓" : "Try Again") : "Check Answer"}
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});

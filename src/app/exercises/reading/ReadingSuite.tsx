import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { useI18n } from "../../context/I18nContext";

import { BookOpen } from "lucide-react";
import { useSound } from "../../shared/useSound";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Visual Context (Image-Based Vocabulary)
export const ExReadingVisualContext = memo(function ExReadingVisualContext({ dispatch }: Props) {
  const { t } = useI18n();
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
    <div className="min-h-dvh bg-background flex flex-col">
      <LessonHeader
        title={t("suites.visualContext")}
        current={1}
        total={1}
        onBack={() => dispatch({ type: "GO", to: "explore" })}
        onClose={() => dispatch({ type: "GO", to: "explore" })}
      />

      <main className="flex-1 max-w-xl w-full mx-auto p-6 flex flex-col gap-6">
        <div className="rounded-3xl overflow-hidden border border-border shadow-2xl aspect-[4/3] bg-muted relative">
          <WordImage
            word={target}
            width="600"
            height="450"
            className="size-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className={`p-4 rounded-2xl border font-sans font-bold text-sm min-h-[56px] transition-all ${
                selected === c
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
              {t("suites.whyThisMatters")}
            </span>
            <p className="font-sans text-xs text-foreground/80 leading-relaxed">
              <strong>{`Blanket`}</strong>{" "}
              {`— a thick cloth cover used on a bed for warmth. Context clue: layered over the mattress and duvet.`}
            </p>
          </div>
        )}

        <PrimaryButton
          label={checked ? "Next →" : t("action.checkAnswer")}
          onClick={checked ? () => dispatch({ type: "GO", to: "explore" }) : handleCheck}
        />
      </main>
    </div>
  );
});

// 7. Lesson Results (Reading)
export const ExReadingResults = memo(function ExReadingResults({ dispatch }: Props) {
  const { t } = useI18n();
  return (
    <div className="min-h-dvh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-2xl mb-4">
        <BookOpen className="size-12 text-primary" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">
        {t("suites.readingComplete")}
      </h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        {t("suites.readingCompleteDesc")}
      </p>
      <PrimaryButton
        label={t("action.continue")}
        onClick={() => dispatch({ type: "GO", to: "explore" })}
      />
    </div>
  );
});

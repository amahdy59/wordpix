import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/courseCatalog";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { useI18n } from "../../context/I18nContext";

import { BookOpen } from "lucide-react";
import { useSound } from "../../shared/useSound";
import { answerLayout } from "../../shared/answerLayout";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Visual Context (Image-Based Vocabulary)
export const ExReadingVisualContext = memo(function ExReadingVisualContext({ dispatch }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { playCorrect, playIncorrect } = useSound();

  const target = BEDROOM_VOCABULARY[1]; // Blanket
  const choices = ["Blanket", "Dresser", "Wardrobe", "Nightstand"];

  const handleCheck = () => {
    setChecked(true);
    if (selected === target.label) {
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  return (
    <div className="wp-question-screen bg-background">
      <LessonHeader
        title={t("suites.visualContext")}
        current={1}
        total={1}
        onBack={() => dispatch({ type: "GO", to: "explore" })}
        onClose={() => dispatch({ type: "GO", to: "explore" })}
      />

      <div className="wp-question-scroll wp-layout-gutter flex flex-col">
        <div className="wp-skill-workspace wp-container-content flex flex-1 min-h-min flex-col gap-3">
          <h2 data-question-prompt className="wp-question-prompt">
            {t("exercise.chooseCorrectWord")}
          </h2>
          <div className="wp-question-layout wp-question-with-media">
            <div className="wp-question-media wp-question-media--fitted rounded-2xl overflow-hidden border border-border bg-muted relative">
              <WordImage
                word={target}
                width="600"
                height="450"
                className="size-full object-contain"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div
                className={answerLayout(choices)}
                role="group"
                aria-label={t("exercise.wordChoicesAria")}
              >
                {choices.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelected(c)}
                    aria-pressed={selected === c}
                    className={`wp-question-option border font-sans font-semibold transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
                  <p
                    className="font-sans text-xs text-foreground leading-relaxed"
                    lang="en"
                    dir="ltr"
                  >
                    <strong>{`Blanket`}</strong>{" "}
                    {`— a thick cloth cover used on a bed for warmth. Context clue: layered over the mattress and duvet.`}
                  </p>
                </div>
              )}

              <PrimaryButton
                label={checked ? t("action.continue") : t("action.checkAnswer")}
                onClick={checked ? () => dispatch({ type: "GO", to: "explore" }) : handleCheck}
                disabled={!checked && selected === null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 7. Lesson Results (Reading)
export const ExReadingResults = memo(function ExReadingResults({ dispatch }: Props) {
  const { t } = useI18n();
  return (
    <div className="min-h-dvh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-secondary border border-primary/30 flex items-center justify-center shadow-2xl mb-4">
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

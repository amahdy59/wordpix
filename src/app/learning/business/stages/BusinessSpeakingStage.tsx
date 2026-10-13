import { useState } from "react";
import { Mic, ArrowRight, ShieldAlert, CheckSquare2, Square, Sparkles } from "lucide-react";
import { SpeechRecordCompare } from "../../../shared/SpeechRecordCompare";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  savedChecklist?: string[];
  onSaveChecklist: (checklist: string[]) => void;
  onNext: () => void;
}

export function BusinessSpeakingStage({
  unit,
  savedChecklist = [],
  onSaveChecklist,
  onNext,
}: Props) {
  const { t } = useI18n();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    () => new Set(savedChecklist.filter((item) => unit.speakingTask.checklist.includes(item)))
  );

  const toggleCheck = (item: string) => {
    const next = new Set(checkedItems);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setCheckedItems(next);
    onSaveChecklist(Array.from(next));
  };

  return (
    <div className="wp-stage-flow wp-container-content flex flex-col gap-4 py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <Mic className="size-4" aria-hidden />
          {t("business.speaking.stageTag")}
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          {t("business.speaking.simulationTag", { level: unit.level })}
        </span>
      </div>

      {/* Task Hero Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="speaking-task-title"
      >
        <p className="text-sm font-semibold text-primary">{t("business.speaking.RolePlayBrief")}</p>
        <h2
          id="speaking-task-title"
          className="wp-type-stage-title mt-2 font-black text-foreground tracking-tight"
        >
          {unit.speakingTask.title}
        </h2>

        {/* Important Rule Banner */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-secondary border border-border p-4 text-foreground">
          <ShieldAlert className="size-5 shrink-0 mt-0.5 text-primary" aria-hidden />
          <div>
            <span className="text-sm font-black uppercase tracking-wide block mb-0.5 text-primary">
              {t("business.speaking.keySpeakingPrinciple")}
            </span>
            <p className="text-base sm:text-base font-semibold italic">
              {`“${unit.speakingTask.rule}”`}
            </p>
          </div>
        </div>
      </section>

      {/* Practice Steps */}
      {unit.speakingTask.steps.length > 0 && (
        <section
          className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
          aria-labelledby="practice-steps-heading"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-primary" aria-hidden />
            <h2
              id="practice-steps-heading"
              className="wp-type-stage-title text-lg font-black text-foreground"
            >
              {t("business.speaking.stepsHeading")}
            </h2>
          </div>

          <ol className="flex flex-col gap-3">
            {unit.speakingTask.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border/80 p-3.5 text-base sm:text-base font-medium text-foreground"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-black text-sm text-primary">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <SpeechRecordCompare
        target={unit.speakingTask.title}
        modelText={unit.speakingTask.rule}
        modelLabel={t("audioRecovery.listenBrief")}
        title={t("business.speaking.VoicePractice")}
        description={t("business.speaking.sandboxInstructions")}
        maxDurationSeconds={120}
        defaultOpen={false}
        compact
      />

      {/* Self-Assessment Checklist */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
        aria-labelledby="checklist-heading"
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2
            id="checklist-heading"
            className="wp-type-stage-title text-lg font-black text-foreground"
          >
            {t("business.speaking.SelfEvaluationChecklist")}
          </h2>
          <span className="text-sm font-bold text-feedback-success-foreground">
            {t("business.speaking.checklistCompletedCount", {
              completed: checkedItems.size,
              total: unit.speakingTask.checklist.length,
            })}
          </span>
        </div>
        <p className="text-base text-muted-foreground font-medium mb-5">
          {t("business.speaking.checklistInstructions")}
        </p>

        <div className="flex flex-col gap-3">
          {unit.speakingTask.checklist.map((item, idx) => {
            const isChecked = checkedItems.has(item);
            return (
              <button
                key={idx}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleCheck(item)}
                className={`min-h-11 min-w-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-start gap-3.5 rounded-2xl p-4 text-start motion-safe:transition-all border ${
                  isChecked
                    ? "border-accent/40 bg-feedback-success-surface text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                {isChecked ? (
                  <CheckSquare2
                    className="size-5 shrink-0 mt-0.5 text-feedback-success-foreground"
                    aria-hidden
                  />
                ) : (
                  <Square className="size-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden />
                )}
                <span className="text-base sm:text-base font-semibold leading-relaxed">{item}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 motion-safe:active:scale-95 motion-safe:transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.speaking.continueToReview")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}

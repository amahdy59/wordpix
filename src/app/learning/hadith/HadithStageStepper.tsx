import { BookA, Check, CheckCircle2, Headphones, Target, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useI18n } from "../../../i18n";
import { HADITH_STAGE_IDS, type HadithStageId } from "./hadithCurriculumStages";

interface Props {
  currentStageIndex: number;
  completedStages?: readonly HadithStageId[];
  onSelectStage: (index: number) => void;
}

const STAGE_ICONS: Record<HadithStageId, LucideIcon> = {
  "read-listen": Headphones,
  vocabulary: BookA,
  practice: CheckCircle2,
  review: Target,
};

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithStageStepper({
  currentStageIndex,
  completedStages = [],
  onSelectStage,
}: Props) {
  const { t, dir } = useI18n();
  const railRef = useRef<HTMLOListElement>(null);
  const currentStageId = HADITH_STAGE_IDS[currentStageIndex];
  const completedSet = new Set(completedStages);
  const currentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    currentButtonRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentStageIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    const total = HADITH_STAGE_IDS.length;
    let nextIndex: number;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = total - 1;
    } else {
      const forward = (event.key === "ArrowRight") === (dir === "ltr");
      nextIndex = (index + (forward ? 1 : -1) + total) % total;
    }
    railRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <nav className="mt-3 w-full space-y-2 sm:mt-6" aria-label={t("hadith.stageNavigation")}>
      {/* Mobile Stepper Header (< sm) */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
          <span className="text-primary uppercase tracking-wider">
            {t("hadith.stepOfTotal", {
              current: currentStageIndex + 1,
              total: HADITH_STAGE_IDS.length,
            }) || `Step ${currentStageIndex + 1} of ${HADITH_STAGE_IDS.length}`}
          </span>
          <span className="font-bold text-foreground">
            {t(`hadith.stageLabels.${currentStageId}`)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStageIndex + 1}
          aria-valuemin={1}
          aria-valuemax={HADITH_STAGE_IDS.length}
          aria-label={t("hadith.stageNavigation")}
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full bg-primary transition-all duration-300 ease-out motion-reduce:transition-none"
            style={{
              width: `${((currentStageIndex + 1) / HADITH_STAGE_IDS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Stepper Rail: 4-column balanced grid on tablet & desktop */}
      <ol
        ref={railRef}
        role="tablist"
        aria-label={t("hadith.stageNavigation")}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {HADITH_STAGE_IDS.map((id, index) => {
          const isCurrent = index === currentStageIndex;
          const isCompleted = completedSet.has(id);
          const Icon = STAGE_ICONS[id];
          const label = t(`hadith.stageLabels.${id}`);

          return (
            <li key={id} role="presentation" className="min-w-0">
              <button
                ref={isCurrent ? currentButtonRef : undefined}
                type="button"
                role="tab"
                id={`hadith-tab-${id}`}
                aria-controls="hadith-stage-panel"
                aria-selected={isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => onSelectStage(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`group relative flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all motion-safe:active:scale-[0.98] ${focusRing} ${
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-wp-xs"
                    : isCompleted
                      ? "border-primary/25 bg-primary/10 text-primary hover:border-primary/45 hover:bg-primary/15"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/60"
                }`}
              >
                {/* Single clean indicator: checkmark when completed, step icon when current or upcoming */}
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isCurrent
                      ? "bg-primary-foreground text-primary"
                      : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                  aria-hidden
                >
                  {isCompleted ? (
                    <Check className="size-3.5 stroke-[3]" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </span>

                <span className="min-w-0 break-words">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

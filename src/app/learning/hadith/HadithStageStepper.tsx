import { BookA, Check, CheckCircle2, Headphones, Mic, Target, type LucideIcon } from "lucide-react";
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
  speak: Mic,
  "check-review": Target,
};

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithStageStepper({
  currentStageIndex,
  completedStages = [],
  onSelectStage,
}: Props) {
  const { t } = useI18n();
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

  return (
    <nav className="mt-6 w-full space-y-3" aria-label={t("hadith.stageNavigation")}>
      {/* Mobile Stepper Header (< sm) */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between text-xs font-black">
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
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${((currentStageIndex + 1) / HADITH_STAGE_IDS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Stepper Rail: scrollable on mobile, grid on desktop */}
      <ol className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
        {HADITH_STAGE_IDS.map((id, index) => {
          const isCurrent = index === currentStageIndex;
          const isCompleted = completedSet.has(id) || index < currentStageIndex;
          const Icon = STAGE_ICONS[id];
          const label = t(`hadith.stageLabels.${id}`);

          return (
            <li key={id} className="min-w-[7.5rem] shrink-0 snap-start sm:min-w-0">
              <button
                ref={isCurrent ? currentButtonRef : undefined}
                type="button"
                onClick={() => onSelectStage(index)}
                aria-current={isCurrent ? "step" : undefined}
                className={`group relative flex min-h-12 w-full items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-2 text-[11px] sm:text-xs font-black transition-all active:scale-[0.98] ${focusRing} ${
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : isCompleted
                      ? "border-primary/25 bg-primary/10 text-primary hover:border-primary/45 hover:bg-primary/15"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/60"
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    isCurrent
                      ? "bg-primary-foreground text-primary"
                      : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                  aria-hidden
                >
                  {isCompleted ? <Check className="size-3 stroke-[3]" /> : index + 1}
                </span>

                <Icon className="size-3.5 shrink-0" aria-hidden />

                <span className="whitespace-nowrap tracking-tight">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

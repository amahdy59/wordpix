import { useCourseNavigationHeight } from "../../shared/useCourseNavigationHeight";
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
  const navigationRef = useCourseNavigationHeight();
  const railRef = useRef<HTMLOListElement>(null);
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
    <nav
      ref={navigationRef}
      className="wp-course-nav w-full space-y-1"
      aria-label={t("hadith.stageNavigation")}
    >
      {/* Stepper Rail: 4-column balanced grid on tablet & desktop */}
      <ol
        ref={railRef}
        role="tablist"
        aria-label={t("hadith.stageNavigation")}
        className="grid grid-cols-4 gap-1"
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
                aria-label={label}
                aria-selected={isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => onSelectStage(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`group relative flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-1 py-1 text-sm font-semibold transition-all motion-safe:active:scale-[0.98] ${focusRing} ${
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-wp-xs"
                    : isCompleted
                      ? "border-primary/25 bg-secondary text-primary hover:border-primary/45 hover:bg-secondary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/60"
                }`}
              >
                {/* Single clean indicator: checkmark when completed, step icon when current or upcoming */}
                <span
                  className={`hidden size-6 shrink-0 items-center justify-center rounded-full transition-colors sm:flex ${
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

                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {t(
                    id === "read-listen"
                      ? "courseLesson.inputShort"
                      : id === "vocabulary"
                        ? "courseLesson.languageShort"
                        : id === "review"
                          ? "courseLesson.applyShort"
                          : "courseLesson.practice"
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div
        role="progressbar"
        aria-label={t("courseLesson.progress")}
        aria-valuemin={0}
        aria-valuemax={HADITH_STAGE_IDS.length}
        aria-valuenow={completedSet.size}
        className="h-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full bg-primary motion-safe:transition-[width]"
          style={{ width: `${(100 * completedSet.size) / HADITH_STAGE_IDS.length}%` }}
        />
      </div>
    </nav>
  );
}

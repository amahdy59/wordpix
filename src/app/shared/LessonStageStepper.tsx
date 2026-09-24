import { useEffect, useRef } from "react";

export interface LessonStageStepperItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  completed?: boolean;
  locked?: boolean;
}

interface Props {
  stages: readonly LessonStageStepperItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
  stepLabel: (current: number, total: number) => string;
  className?: string;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Shared responsive stage navigation used by multi-step learning lessons. */
export function LessonStageStepper({
  stages,
  currentIndex,
  onSelect,
  ariaLabel,
  stepLabel,
  className = "",
}: Props) {
  const currentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    currentButtonRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentIndex]);

  const moveFocus = (index: number) => {
    if (stages[index]?.locked) return;
    onSelect(index);
    window.requestAnimationFrame(() => {
      document.getElementById(`lesson-stage-${stages[index].id}`)?.focus();
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    )
      return;
    event.preventDefault();
    const available = stages.filter((stage) => !stage.locked);
    if (available.length === 0) return;
    const currentAvailableIndex = Math.max(
      0,
      available.findIndex((stage) => stage.id === stages[index].id)
    );
    const nextAvailableIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? available.length - 1
          : (currentAvailableIndex + (event.key === "ArrowRight" ? 1 : -1) + available.length) %
            available.length;
    const nextIndex = stages.findIndex((stage) => stage.id === available[nextAvailableIndex].id);
    moveFocus(nextIndex);
  };

  return (
    <nav className={`w-full space-y-3 ${className}`} aria-label={ariaLabel}>
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="uppercase tracking-wider text-primary">
            {stepLabel(currentIndex + 1, stages.length)}
          </span>
          <span className="font-bold text-foreground">{stages[currentIndex]?.label}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={stages.length}
          aria-label={ariaLabel}
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
      <ol
        role="tablist"
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-7 sm:overflow-visible sm:pb-0"
      >
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCurrent = index === currentIndex;
          const isCompleted = stage.completed || index < currentIndex;
          return (
            <li
              key={stage.id}
              role="presentation"
              className="min-w-[8rem] shrink-0 snap-start sm:min-w-0"
            >
              <button
                id={`lesson-stage-${stage.id}`}
                ref={isCurrent ? currentButtonRef : undefined}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                aria-disabled={stage.locked ? "true" : undefined}
                disabled={stage.locked}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => moveFocus(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`group relative flex min-h-12 w-full items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-2 text-[11px] font-black transition-all sm:text-xs ${focusRing} ${
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-wp-sm"
                    : isCompleted
                      ? "border-primary/25 bg-primary/10 text-primary hover:border-primary/45 hover:bg-primary/15"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${isCurrent ? "bg-primary-foreground text-primary" : isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  aria-hidden
                >
                  {isCompleted ? "✓" : index + 1}
                </span>
                {Icon && <Icon className="size-3.5 shrink-0" aria-hidden />}
                <span className="whitespace-nowrap tracking-tight">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { useCourseNavigationHeight } from "./useCourseNavigationHeight";
import { useI18n } from "../../i18n";

export interface CourseNavigationStage {
  id: string;
  label: string;
  group: 0 | 1 | 2 | 3;
  locked?: boolean;
  completed?: boolean;
}

/** One visible progression; course-owned identities and unlocking stay unchanged. */
export function CourseLessonNavigation({
  stages,
  currentIndex,
  onSelect,
}: {
  stages: readonly CourseNavigationStage[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useI18n();
  const navigationRef = useCourseNavigationHeight();
  return (
    <nav ref={navigationRef} className="wp-course-nav" aria-label={t("courseLesson.navigation")}>
      <details className="group">
        <summary className="flex min-h-11 cursor-pointer flex-wrap items-center justify-between gap-2 rounded-xl px-2 text-base font-bold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary">
          <span aria-live="polite">
            {t("lessonShell.step", {
              number: currentIndex + 1,
              total: stages.length,
              name: stages[currentIndex]?.label ?? "",
            })}
          </span>
          <span className="text-sm text-primary">{t("lessonShell.allSteps")}</span>
        </summary>
        <ol className="grid max-h-[50dvh] gap-1 overflow-y-auto p-2 sm:grid-cols-2">
          {stages.map((stage, index) => (
            <li key={stage.id}>
              <button
                type="button"
                disabled={stage.locked}
                aria-current={index === currentIndex ? "step" : undefined}
                onClick={(event) => {
                  onSelect(index);
                  const details = event.currentTarget.closest("details");
                  if (details) {
                    details.open = false;
                    details.querySelector("summary")?.focus();
                  }
                }}
                className={`min-h-11 w-full rounded-xl px-3 py-2 text-start text-base font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${index === currentIndex ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}
              >
                {t("lessonShell.step", {
                  number: index + 1,
                  total: stages.length,
                  name: stage.label,
                })}
                {stage.completed
                  ? ` · ${t("lessonShell.completed")}`
                  : stage.locked
                    ? ` · ${t("lessonShell.locked")}`
                    : ""}
              </button>
            </li>
          ))}
        </ol>
      </details>
      <div
        role="progressbar"
        aria-label={t("courseLesson.progress")}
        aria-valuemin={0}
        aria-valuemax={stages.length}
        aria-valuenow={stages.filter((stage) => stage.completed).length}
        aria-valuetext={t("lessonShell.completedSteps", {
          completed: stages.filter((stage) => stage.completed).length,
          total: stages.length,
        })}
        className="h-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full bg-primary motion-safe:transition-[width]"
          style={{
            width: `${(100 * stages.filter((stage) => stage.completed).length) / Math.max(1, stages.length)}%`,
          }}
        />
      </div>
    </nav>
  );
}

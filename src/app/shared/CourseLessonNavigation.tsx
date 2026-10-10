import { useCourseNavigationHeight } from "./useCourseNavigationHeight";
import { BookOpen, BookA, CheckCircle2, MessagesSquare } from "lucide-react";
import { useI18n } from "../../i18n";

export interface CourseNavigationStage {
  id: string;
  label: string;
  group: 0 | 1 | 2 | 3;
  locked?: boolean;
  completed?: boolean;
}

/** Groups presentation only; persisted stage IDs and unlocking remain course-owned. */
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
  const activeGroup = stages[currentIndex]?.group ?? 0;
  const icons = [BookOpen, BookA, CheckCircle2, MessagesSquare];
  const keys = ["input", "language", "practice", "apply"];
  const currentStages = stages
    .map((stage, index) => ({ ...stage, index }))
    .filter((stage) => stage.group === activeGroup);
  return (
    <nav
      ref={navigationRef}
      className="wp-course-nav space-y-1"
      aria-label={t("courseLesson.navigation")}
    >
      <div className="grid grid-cols-4 gap-1">
        {keys.map((key, group) => {
          const Icon = icons[group];
          const firstAvailable = stages.findIndex(
            (stage) => stage.group === group && !stage.locked
          );
          return (
            <button
              key={key}
              type="button"
              disabled={firstAvailable < 0}
              aria-label={t(`courseLesson.${key}`)}
              aria-current={activeGroup === group ? "step" : undefined}
              onClick={() => {
                if (firstAvailable >= 0 && activeGroup !== group) onSelect(firstAvailable);
              }}
              className={`flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-1 py-1 text-sm font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${activeGroup === group ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"}`}
            >
              <Icon className="hidden size-4 shrink-0 sm:block" aria-hidden />
              <span className="hidden sm:inline">{t(`courseLesson.${key}`)}</span>
              <span className="sm:hidden">
                {t(`courseLesson.${key === "practice" ? key : `${key}Short`}`)}
              </span>
            </button>
          );
        })}
      </div>
      {currentStages.length > 1 && (
        <div className="flex flex-wrap gap-1 px-1 py-1">
          {currentStages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              disabled={stage.locked}
              aria-current={stage.index === currentIndex ? "step" : undefined}
              onClick={() => onSelect(stage.index)}
              className={`min-h-11 shrink-0 rounded-lg border px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${stage.index === currentIndex ? "border-primary bg-secondary text-primary" : "border-border text-foreground hover:bg-muted"}`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={t("courseLesson.progress")}
        aria-valuemin={0}
        aria-valuemax={stages.length}
        aria-valuenow={stages.filter((stage) => stage.completed).length}
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

import { useId, type ReactNode } from "react";

export type ExerciseFamily =
  "visual-choice" | "listening-speaking" | "text-construction" | "reading-context";

export interface ExerciseFamilyTemplateProps {
  family: ExerciseFamily;
  instruction: ReactNode;
  activityLabel: string;
  activity: ReactNode;
  media?: ReactNode;
  helper?: ReactNode;
  feedback?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const measureByFamily: Record<ExerciseFamily, string> = {
  "visual-choice": "wp-container-content",
  "listening-speaking": "wp-container-reading",
  "text-construction": "wp-container-reading",
  "reading-context": "wp-container-reading",
};

/**
 * A stable five-zone exercise layout. Empty feedback and action zones retain
 * their place so answering never moves the activity the learner is using.
 */
export function ExerciseFamilyTemplate({
  family,
  instruction,
  activityLabel,
  activity,
  media,
  helper,
  feedback,
  action,
  className = "",
}: ExerciseFamilyTemplateProps) {
  const instructionId = useId();

  return (
    <section
      data-exercise-family={family}
      aria-labelledby={instructionId}
      className={`${measureByFamily[family]} flex w-full flex-col gap-4 sm:gap-5 ${className}`}
    >
      <header className="text-center">
        <h2
          id={instructionId}
          className="text-balance font-sans text-lg font-bold leading-snug text-foreground sm:text-xl"
        >
          {instruction}
        </h2>
        {helper && (
          <p className="mt-1.5 font-sans text-xs font-medium text-muted-foreground sm:text-sm">
            {helper}
          </p>
        )}
      </header>

      {media && <div data-exercise-zone="media">{media}</div>}

      <div data-exercise-zone="activity" role="group" aria-label={activityLabel}>
        {activity}
      </div>

      <div data-exercise-zone="feedback" className="min-h-[7.5rem]">
        {feedback}
      </div>

      <div data-exercise-zone="action" className="flex min-h-[3rem] items-center justify-end">
        {action}
      </div>
    </section>
  );
}

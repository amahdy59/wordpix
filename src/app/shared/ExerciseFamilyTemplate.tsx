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
  "text-construction": "wp-container-content",
  "reading-context": "wp-container-reading",
};

/**
 * Feedback follows the activity, so answering never moves the question.
 * Media and answers share available desktop width without cropping evidence.
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

      <div
        className={media ? "grid min-w-0 gap-4 lg:grid-cols-2 lg:items-center lg:gap-6" : "min-w-0"}
      >
        {media && (
          <div data-exercise-zone="media" className="min-w-0">
            {media}
          </div>
        )}
        <div
          data-exercise-zone="activity"
          role="group"
          aria-label={activityLabel}
          className="min-w-0"
        >
          {activity}
        </div>
      </div>

      <div data-exercise-zone="feedback" className={feedback ? "" : "hidden"}>
        {feedback}
      </div>

      <div
        data-exercise-zone="action"
        className={action ? "flex min-h-11 items-center justify-end" : "hidden"}
      >
        {action}
      </div>
    </section>
  );
}

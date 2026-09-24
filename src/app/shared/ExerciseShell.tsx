import { memo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { ExitConfirmModal } from "./ExitConfirmModal";

export type ExerciseMode = "teach" | "guided" | "retrieval" | "assessment";

interface Props {
  /** 0-based step index (1-5) */
  step: number;
  /** Title shown in LessonHeader */
  title: string;
  /** Group vocabulary words */
  words: VocabularyItem[];
  /** Optional subtitle shown between title row and progress bar in LessonHeader */
  subtitle?: React.ReactNode;
  lessonId: string;
  dispatch: React.Dispatch<Action>;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Optional current / total progress inside the exercise to drive progress bar dynamically */
  progress?: { current: number; total: number } | number;
  /** Noun used by the progress bar, for example "Word" or "Question". */
  progressLabel?: string;
  layout?: "standard" | "media";
}

const STEP_LABELS = [
  "Scene Overview",
  "Listen & Practice",
  "Recall & Match",
  "Complete Sentence",
  "Build Sentence",
  "Quick Quiz",
];

/** Number of steps in a lesson flow, derived so the two cannot drift apart. */
const EXERCISE_STEP_COUNT = STEP_LABELS.length;

export const ExerciseShell = memo(function ExerciseShell({
  step,
  title,
  words,
  subtitle,
  lessonId,
  dispatch,
  children,
  footer,
  progress,
  progressLabel,
  layout = "standard",
}: Props) {
  const [showExitModal, setShowExitModal] = useState(false);
  const Content = layout === "media" ? "section" : "main";

  // `lessonId` used to default to "essential-furniture" and fall back to the
  // first group on an unknown id, so a review session — or any lesson whose id
  // went missing — was confidently labelled with the wrong group's name.
  const group = resolveGroup(
    lessonId,
    words.map((w) => w.id)
  );

  const currentProgress =
    typeof progress === "number" ? progress : progress ? progress.current : step + 1;

  const totalProgress =
    typeof progress === "number" ? 100 : progress ? progress.total : EXERCISE_STEP_COUNT;

  return (
    <div className="bg-background flex flex-col lg:flex-row h-dvh max-h-dvh overflow-hidden relative">
      <ExitConfirmModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          dispatch({ type: "GO", to: "home" });
        }}
      />
      {/* ── RIGHT PANEL: Desktop & Mobile Exercise Main View ────────────────── */}
      <div className="flex-1 flex flex-col h-dvh overflow-hidden relative">
        <LessonHeader
          title={title}
          subtitle={subtitle}
          current={currentProgress}
          total={totalProgress}
          progressLabel={progressLabel}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
        />

        {/* Adaptive activity stage: compact and top-anchored when space is abundant. */}
        <Content
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-6 lg:px-10 py-3 sm:py-6 flex flex-col items-center min-h-0 w-full scroll-smooth"
          aria-label={`${group.name}: ${title} exercise`}
        >
          <div
            className={
              layout === "media"
                ? "w-full max-w-[2200px] mx-auto flex flex-1 min-h-0 flex-col gap-4 justify-start pb-3"
                : "w-full max-w-4xl mx-auto flex flex-col gap-3.5 sm:gap-5 justify-start pb-4 sm:pb-8"
            }
          >
            {children}
          </div>
        </Content>

        {footer && (
          <footer className="shrink-0 mx-auto flex w-full max-w-6xl flex-col border-t border-border/60 bg-background px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sm:px-6 sm:pb-6 lg:px-10">
            <div className="flex w-full flex-col gap-1.5">{footer}</div>
          </footer>
        )}

        <HomeIndicator />
      </div>
    </div>
  );
});

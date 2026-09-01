import { memo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { ExitConfirmModal } from "./ExitConfirmModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

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
  footer: React.ReactNode;
  /** Optional current / total progress inside the exercise to drive progress bar dynamically */
  progress?: { current: number; total: number } | number;
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
}: Props) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

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
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* ── RIGHT PANEL: Desktop & Mobile Exercise Main View ────────────────── */}
      <div className="flex-1 flex flex-col h-dvh overflow-hidden relative">
        <LessonHeader
          title={`${group.name}: ${title}`}
          subtitle={subtitle}
          current={currentProgress}
          total={totalProgress}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
        />

        {/* Expansive Main Content Area with adaptive scroll for all viewports */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-6 lg:px-10 py-3 sm:py-6 flex flex-col items-center min-h-0 w-full scroll-smooth"
          aria-label={`${title} exercise`}
        >
          {/*
            Content flows from the top on a phone and only centres once there
            is genuinely room to spare.

            `min-h-full justify-center my-auto` centred every drill inside a
            box at least as tall as the viewport. On a desktop that reads as
            balance; on a 390x844 phone it pushed a third of the screen into
            empty space above the picture and another slab below it, so the
            exercise floated in a void with its controls shoved off the fold.
          */}
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-3.5 sm:gap-5 justify-start sm:justify-center sm:min-h-full sm:my-auto pb-4 sm:pb-8">
            {children}
          </div>
        </main>

        {/* Pinned Footer */}
        <footer className="shrink-0 px-4 sm:px-6 lg:px-10 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:pb-6 pt-3 border-t border-border/60 bg-background flex flex-col max-w-6xl mx-auto w-full">
          <div className="flex flex-col gap-1.5 w-full">{footer}</div>
        </footer>

        <HomeIndicator />
      </div>
    </div>
  );
});

import { memo, useState } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { ExitConfirmModal } from "./ExitConfirmModal";
import { BottomTabBar } from "./BottomTabBar";

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
}: Props) {
  const [showExitModal, setShowExitModal] = useState(false);

  // `lessonId` used to default to "essential-furniture" and fall back to the
  // first group on an unknown id, so a review session — or any lesson whose id
  // went missing — was confidently labelled with the wrong group's name.
  const group = resolveGroup(
    lessonId,
    words.map((w) => w.id)
  );

  return (
    <div className="bg-background flex flex-col lg:flex-row min-h-svh lg:h-svh lg:min-h-0 lg:overflow-hidden relative">
      <ExitConfirmModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          dispatch({ type: "GO", to: "home" });
        }}
      />

      {/* ── RIGHT PANEL: Desktop & Mobile Exercise Main View ────────────────── */}
      <div className="flex-1 flex flex-col h-svh overflow-hidden relative">
        <LessonHeader
          title={`${group.name}: ${title}`}
          subtitle={subtitle}
          /* `step` is a 0-based index into the 6-step lesson flow (0 = scene),
             so position in the flow is step + 1. */
          current={step + 1}
          total={EXERCISE_STEP_COUNT}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
        />

        {/* Expansive Main Content Area */}
        <main
          className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-10 py-3 flex flex-col items-center justify-center min-h-0 w-full"
          aria-label={`${title} exercise`}
        >
          <div className="w-full max-w-4xl h-full mx-auto flex flex-col gap-3.5 justify-center">
            {children}
          </div>
        </main>

        {/* Pinned Footer */}
        <footer className="shrink-0 px-4 sm:px-6 lg:px-10 pb-[env(safe-area-inset-bottom)] sm:pb-6 pt-3 border-t border-border/60 bg-background flex flex-col max-w-4xl mx-auto w-full">
          <div className="flex flex-col gap-1.5 w-full mb-14 lg:mb-0">{footer}</div>
        </footer>

        {/* Mobile bottom bar — hidden on lg+ */}
        <div className="lg:hidden absolute bottom-0 inset-x-0 z-40" aria-hidden="false">
          <BottomTabBar activeTab="practice" dispatch={dispatch} />
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
});

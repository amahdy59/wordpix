import { useLessonSession } from "./LessonSessionContext";
import { memo, useState, useEffect } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/courseCatalog";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { ExitConfirmModal } from "./ExitConfirmModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { usePredictiveLessonPreload } from "./usePredictiveLessonPreload";
import { useDevicePreference, isTextInput } from "./devicePreferences";
import { MAX_LESSON_STAGE_COUNT } from "../lesson/lessonSequence";

export type ExerciseMode = "teach" | "guided" | "retrieval" | "assessment";

interface Props {
  /** 0-based lesson-stage index. */
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

/** Number of steps in a lesson flow, derived so the two cannot drift apart. */
const EXERCISE_STEP_COUNT = MAX_LESSON_STAGE_COUNT;

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
  const session = useLessonSession();
  const shortcutsEnabled = useDevicePreference("character-shortcuts");
  const [showExitModal, setShowExitModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const Content = "section";
  const canvasClass =
    layout === "media" ? "wp-container-immersive wp-exercise-immersive" : "wp-container-content";

  // Predictive asset preloading warms up next group assets when nearing completion (step >= 3)
  usePredictiveLessonPreload(lessonId, step);

  // Toggle keyboard shortcuts cheat sheet with '?' or 'Shift+/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !shortcutsEnabled ||
        e.repeat ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        isTextInput(e.target)
      )
        return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsEnabled]);

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
          if (session) session.onExit();
          else dispatch({ type: "GO", to: "practice" });
        }}
      />
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
      {/* ── RIGHT PANEL: Desktop & Mobile Exercise Main View ────────────────── */}
      <div className="flex-1 flex flex-col h-dvh overflow-hidden relative">
        <LessonHeader
          className={canvasClass}
          title={title}
          subtitle={subtitle}
          current={currentProgress}
          total={totalProgress}
          progressLabel={progressLabel}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
          onOpenShortcuts={() => setShowShortcutsModal(true)}
        />

        {/* Adaptive activity stage: compact and top-anchored when space is abundant. */}
        <Content
          className={`${canvasClass} wp-layout-gutter flex-1 overflow-y-auto overflow-x-hidden py-3 sm:py-5 lg:py-6 flex flex-col items-center min-h-0 w-full motion-safe:scroll-smooth`}
          aria-label={`${group.name}: ${title} exercise`}
        >
          <div
            className={
              layout === "media"
                ? "w-full flex flex-1 min-h-0 flex-col gap-4 justify-start pb-3"
                : "w-full flex flex-col gap-3.5 sm:gap-5 justify-start pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-8"
            }
          >
            {children}
          </div>
        </Content>

        {footer && (
          <footer
            className={`${canvasClass} wp-layout-gutter shrink-0 flex flex-col border-t border-border bg-background pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3`}
          >
            <div className="flex w-full flex-col gap-1.5">{footer}</div>
          </footer>
        )}

        <HomeIndicator />
      </div>
    </div>
  );
});

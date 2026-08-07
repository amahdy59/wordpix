import { memo, useState } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { WordImage } from "./WordImage";
import { ExitConfirmModal } from "./ExitConfirmModal";

interface Props {
  /** 0-based step index (1-5) */
  step: number;
  /** Title shown in LessonHeader */
  title: string;
  /** The active vocabulary word (shown in the left panel on desktop) */
  word: VocabItem;
  /** Batch word progress */
  currentWordIndex?: number;
  totalWordsQueue?: number;
  dispatch: React.Dispatch<Action>;
  leftPanelExtra?: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const STEP_LABELS = [
  "Scene Discovery",
  "Listen & Practice",
  "Recall & Match",
  "Complete Sentence",
  "Build Sentence",
  "Quick Quiz",
];

export const ExerciseShell = memo(function ExerciseShell({
  step,
  title,
  word,
  currentWordIndex = 0,
  totalWordsQueue = 5,
  dispatch,
  leftPanelExtra,
  children,
  footer,
}: Props) {
  const [showExitModal, setShowExitModal] = useState(false);

  const nextStepLabel = step < 5 ? STEP_LABELS[step + 1] : "Next Word";

  return (
    <div className="bg-background flex flex-col min-h-svh lg:flex-row lg:min-h-svh lg:overflow-hidden relative">
      <ExitConfirmModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          dispatch({ type: "GO", to: "home" });
        }}
      />

      {/* ── DESKTOP LEFT PANEL ───────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[42%] xl:w-[40%] shrink-0 bg-slate-950 relative overflow-hidden"
        aria-label={`Word image: ${word.label}`}
      >
        <div className="absolute inset-0">
          <WordImage
            word={word}
            loading="eager"
            width="800"
            height="900"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-2">
          {word.topic && (
            <span className="self-start font-sans font-semibold text-xs text-white/70 bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full capitalize">
              {word.topic.replace("-", " ")}
            </span>
          )}
          <h2 className="font-sans font-black text-white text-4xl xl:text-5xl leading-none tracking-tight">
            {word.label}
          </h2>
          <p className="font-sans text-white/60 text-base font-medium">
            /{word.phonetic}/
          </p>
          {leftPanelExtra && <div className="mt-2">{leftPanelExtra}</div>}
        </div>

        {/* Batch & step indicator top-left */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-full px-3 py-1">
            <span className="font-sans font-semibold text-white/80 text-xs">
              Word {currentWordIndex + 1} of {totalWordsQueue}
            </span>
          </div>
          <div className="bg-primary/90 text-primary-foreground backdrop-blur-md rounded-full px-3 py-1">
            <span className="font-sans font-semibold text-xs">
              Step {step} of 5
            </span>
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-svh lg:min-h-0 lg:overflow-hidden">
        <LessonHeader
          title={title}
          step={step}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
        />

        {/* Mobile-only word image */}
        <div className="lg:hidden px-5 pt-1 pb-0 shrink-0">
          <div className="h-44 sm:h-52 relative rounded-2xl w-full overflow-hidden border border-border bg-muted">
            <WordImage
              word={word}
              loading="eager"
              width="800"
              height="600"
              className="absolute inset-0 object-cover size-full"
            />
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white/90 px-2.5 py-0.5 rounded-full font-sans font-semibold text-xs">
              Word {currentWordIndex + 1} of {totalWordsQueue}
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="font-sans font-black text-white text-2xl leading-none">{word.label}</p>
              <p className="font-sans text-white/70 text-sm">/{word.phonetic}/</p>
            </div>
          </div>
          {leftPanelExtra && <div className="mt-3">{leftPanelExtra}</div>}
        </div>

        {/* Scrollable exercise content */}
        <main
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 lg:px-8 lg:py-6"
          aria-label={`${title} exercise`}
        >
          {children}
        </main>

        {/* Pinned footer */}
        <footer className="shrink-0 px-5 pb-8 pt-3 lg:px-8 lg:pb-8 border-t border-border/60 bg-background flex flex-col gap-2">
          {footer}
          <div className="flex items-center justify-between text-[11px] font-sans font-medium text-muted-foreground px-1 pt-1">
            <span>Word {currentWordIndex + 1} / {totalWordsQueue}</span>
            <span>Next up: {nextStepLabel}</span>
          </div>
        </footer>

        <HomeIndicator />
      </div>
    </div>
  );
});

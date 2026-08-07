import { memo, useState } from "react";
import type { Action } from "../types";
import { BEDROOM_GROUPS, type VocabItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { WordImage } from "./WordImage";
import { ExitConfirmModal } from "./ExitConfirmModal";
import { Layers, HelpCircle, Sparkles } from "lucide-react";

export type ExerciseMode = "teach" | "guided" | "retrieval" | "assessment";

interface Props {
  /** 0-based step index (1-5) */
  step: number;
  /** Title shown in LessonHeader */
  title: string;
  /** Group vocabulary words */
  words: VocabItem[];
  /** Active word currently highlighted / focused in exercise */
  activeWord?: VocabItem;
  /** Exercise interaction mode (determines answer masking) */
  mode?: ExerciseMode;
  /** Optional callback when user clicks a word chip in the group bar */
  onSelectWord?: (word: VocabItem) => void;
  groupId?: string;
  dispatch: React.Dispatch<Action>;
  leftPanelExtra?: React.ReactNode;
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
const LAST_STEP_INDEX = EXERCISE_STEP_COUNT - 1;

export const ExerciseShell = memo(function ExerciseShell({
  step,
  title,
  words,
  activeWord,
  mode = "teach",
  onSelectWord,
  groupId = "essential-furniture",
  dispatch,
  leftPanelExtra,
  children,
  footer,
}: Props) {
  const [showExitModal, setShowExitModal] = useState(false);

  const group = BEDROOM_GROUPS.find((g) => g.id === groupId) ?? BEDROOM_GROUPS[0];
  const currentWord = activeWord || words[0];
  const nextStepLabel = step < LAST_STEP_INDEX ? STEP_LABELS[step + 1] : "Session Completion";

  const isTesting = mode === "retrieval" || mode === "assessment";

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

      {/* ── DESKTOP LEFT PANEL: Rosetta Stone Group Visual Panel ────────────── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[34%] xl:w-[32%] shrink-0 bg-slate-950 relative overflow-hidden h-full"
        aria-label={`Group learning: ${group.name}`}
      >
        {/* Visual Background */}
        <div className="absolute inset-0">
          {!isTesting && currentWord ? (
            <WordImage
              word={currentWord}
              loading="eager"
              width="800"
              height="900"
              className="size-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-8">
              <div className="size-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl">
                <HelpCircle className="size-12 text-primary animate-pulse" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Group Badges & Title top-left */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 rounded-full px-3 py-1 text-white">
            <Layers className="size-3.5 text-wp-amber" />
            <span className="font-sans font-bold text-xs">{group.name}</span>
          </div>
          <div className="bg-primary/90 text-primary-foreground backdrop-blur-md rounded-full px-3 py-1">
            <span className="font-sans font-semibold text-xs">
              Step {step + 1} of {EXERCISE_STEP_COUNT}
            </span>
          </div>
        </div>

        {/* Group Items Grid / Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3.5 z-10">
          {/* Active Word Label or Testing Prompt */}
          {!isTesting && currentWord ? (
            <div>
              <span className="font-sans font-bold text-[11px] text-wp-amber bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wide">
                Target Word
              </span>
              <h2 className="font-sans font-black text-white text-3xl xl:text-4xl leading-tight tracking-tight mt-0.5">
                {currentWord.label}
              </h2>
              <p className="font-sans text-white/60 text-xs font-medium">/{currentWord.phonetic}/</p>
            </div>
          ) : (
            <div>
              <span className="font-sans font-bold text-[11px] text-primary bg-primary/20 px-2.5 py-0.5 rounded-full border border-primary/30 uppercase tracking-wide flex items-center gap-1.5 w-fit">
                <Sparkles className="size-3" />
                <span>{mode === "retrieval" ? "Memory Recall Drill" : "Knowledge Assessment"}</span>
              </span>
              <h2 className="font-sans font-black text-white text-2xl xl:text-3xl leading-tight tracking-tight mt-1">
                {mode === "retrieval" ? "Listen & Match" : "Select Correct Image"}
              </h2>
            </div>
          )}

          {/* Group Words Selector Strip */}
          <div className="flex flex-col gap-1.5">
            <span className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-wider">
              Group Items ({words.length})
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {words.map((w, idx) => {
                const isActive = currentWord?.id === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    disabled={isTesting}
                    onClick={() => onSelectWord?.(w)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all shrink-0 ${
                      isActive && !isTesting
                        ? "bg-primary text-primary-foreground border-white/40 shadow-md font-bold scale-105"
                        : "bg-black/40 text-white/70 border-white/10 hover:bg-black/60 hover:text-white disabled:opacity-50"
                    }`}
                  >
                    {!isTesting && (
                      <div className="size-5 rounded-md overflow-hidden shrink-0 border border-white/20">
                        <WordImage word={w} width="24" height="24" className="size-full object-cover" />
                      </div>
                    )}
                    <span className="font-sans text-xs">
                      {isTesting ? `Item ${idx + 1}` : w.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {leftPanelExtra && <div className="mt-0.5">{leftPanelExtra}</div>}
        </div>
      </aside>

      {/* ── RIGHT PANEL: Desktop & Mobile Exercise Main View ────────────────── */}
      <div className="flex-1 flex flex-col min-h-svh lg:h-svh lg:min-h-0 lg:overflow-hidden">
        <LessonHeader
          title={`${group.name}: ${title}`}
          /* `step` is a 0-based index into the 6-step lesson flow (0 = scene),
             so position in the flow is step + 1. */
          current={step + 1}
          total={EXERCISE_STEP_COUNT}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
        />

        {/* Mobile Group Items Bar */}
        <div className="lg:hidden px-4 pt-2 shrink-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-sans font-semibold">
            <span className="text-primary font-bold">{group.name} Group</span>
            <span className="text-muted-foreground">{words.length} Items</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {words.map((w, idx) => {
              const isActive = currentWord?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  disabled={isTesting}
                  onClick={() => onSelectWord?.(w)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-sans shrink-0 transition-all ${
                    isActive && !isTesting
                      ? "bg-primary text-primary-foreground border-primary font-bold"
                      : "bg-wp-card text-muted-foreground border-border disabled:opacity-60"
                  }`}
                >
                  {!isTesting && (
                    <div className="size-5 rounded overflow-hidden shrink-0 border border-border">
                      <WordImage word={w} width="24" height="24" className="size-full object-cover" />
                    </div>
                  )}
                  <span>{isTesting ? `Item ${idx + 1}` : w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expansive Main Content Area */}
        <main
          className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 lg:px-10 py-3 sm:py-5 flex flex-col items-center justify-center min-h-0 w-full"
          aria-label={`${title} exercise`}
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-3.5 sm:gap-5 my-auto">
            {children}
          </div>
        </main>

        {/* Pinned Footer */}
        <footer className="shrink-0 px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6 pt-3 border-t border-border/60 bg-background flex flex-col gap-1.5 max-w-4xl mx-auto w-full">
          {footer}
          <div className="flex items-center justify-between text-[11px] font-sans font-medium text-muted-foreground px-1">
            <span>Group: {group.name}</span>
            <span>Next up: {nextStepLabel}</span>
          </div>
        </footer>

        <HomeIndicator />
      </div>
    </div>
  );
});

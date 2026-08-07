import { memo, useState } from "react";
import type { Action } from "../types";
import { BEDROOM_GROUPS, type VocabItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { WordImage } from "./WordImage";
import { ExitConfirmModal } from "./ExitConfirmModal";
import { Layers } from "lucide-react";

interface Props {
  /** 0-based step index (1-5) */
  step: number;
  /** Title shown in LessonHeader */
  title: string;
  /** Group vocabulary words */
  words: VocabItem[];
  /** Active word currently highlighted / focused in exercise */
  activeWord?: VocabItem;
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

export const ExerciseShell = memo(function ExerciseShell({
  step,
  title,
  words,
  activeWord,
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
  const nextStepLabel = step < 5 ? STEP_LABELS[step + 1] : "Group Completion";

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

      {/* ── DESKTOP LEFT PANEL: Rosetta Stone Group Visual Panel ────────────── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[42%] xl:w-[40%] shrink-0 bg-slate-950 relative overflow-hidden"
        aria-label={`Group learning: ${group.name}`}
      >
        {/* Full-bleed active word image with background wash */}
        <div className="absolute inset-0">
          {currentWord && (
            <WordImage
              word={currentWord}
              loading="eager"
              width="800"
              height="900"
              className="size-full object-cover transition-all duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Group Badges & Title top-left */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5 text-white">
            <Layers className="size-4 text-wp-amber" />
            <span className="font-sans font-bold text-xs">{group.name} Group</span>
          </div>
          <div className="bg-primary/90 text-primary-foreground backdrop-blur-md rounded-full px-3 py-1">
            <span className="font-sans font-semibold text-xs">
              Step {step} of 5
            </span>
          </div>
        </div>

        {/* Group Items Grid / Carousel Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 z-10">
          {/* Active Word Label */}
          {currentWord && (
            <div>
              <span className="font-sans font-bold text-xs text-wp-amber bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wide">
                Target Word
              </span>
              <h2 className="font-sans font-black text-white text-4xl xl:text-5xl leading-tight tracking-tight mt-1">
                {currentWord.label}
              </h2>
              <p className="font-sans text-white/60 text-sm font-medium">/{currentWord.phonetic}/</p>
            </div>
          )}

          {/* Group Words Selector Strip */}
          <div className="flex flex-col gap-2">
            <span className="text-white/50 text-[11px] font-sans font-bold uppercase tracking-wider">
              Words in this Group ({words.length})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {words.map((w) => {
                const isActive = currentWord?.id === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onSelectWord?.(w)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-white/40 shadow-md font-bold scale-105"
                        : "bg-black/40 text-white/70 border-white/10 hover:bg-black/60 hover:text-white"
                    }`}
                  >
                    <div className="size-6 rounded-lg overflow-hidden shrink-0 border border-white/20">
                      <WordImage word={w} width="32" height="32" className="size-full object-cover" />
                    </div>
                    <span className="font-sans text-xs">{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {leftPanelExtra && <div className="mt-1">{leftPanelExtra}</div>}
        </div>
      </aside>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-svh lg:min-h-0 lg:overflow-hidden">
        <LessonHeader
          title={`${group.name}: ${title}`}
          step={step}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => setShowExitModal(true)}
        />

        {/* Mobile Group Items Bar */}
        <div className="lg:hidden px-5 pt-2 shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-sans font-semibold">
            <span className="text-primary font-bold">{group.name} Group</span>
            <span className="text-muted-foreground">{words.length} Words</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {words.map((w) => {
              const isActive = currentWord?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onSelectWord?.(w)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-sans shrink-0 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary font-bold"
                      : "bg-wp-card text-muted-foreground border-border"
                  }`}
                >
                  <div className="size-5 rounded overflow-hidden shrink-0 border border-border">
                    <WordImage word={w} width="24" height="24" className="size-full object-cover" />
                  </div>
                  <span>{w.label}</span>
                </button>
              );
            })}
          </div>
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
            <span>Group: {group.name}</span>
            <span>Next up: {nextStepLabel}</span>
          </div>
        </footer>

        <HomeIndicator />
      </div>
    </div>
  );
});

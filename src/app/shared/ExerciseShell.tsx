import { memo } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "./LessonHeader";
import { HomeIndicator } from "./HomeIndicator";
import { WordImage } from "./WordImage";

interface Props {
  /** 0-based step index */
  step: number;
  /** Title shown in LessonHeader */
  title: string;
  /** The active vocabulary word (shown in the left panel on desktop) */
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
  /**
   * Optional extra content shown beneath the word image in the desktop left panel.
   * E.g. phonetics, topic badge, audio controls.
   */
  leftPanelExtra?: React.ReactNode;
  /**
   * The interactive exercise content — always in the right panel (desktop) or
   * stacked below the image (mobile).
   */
  children: React.ReactNode;
  /**
   * Footer CTA(s). Always pinned to the bottom of the viewport on all
   * screen sizes — never requires scrolling to reach.
   */
  footer: React.ReactNode;
}

/**
 * ExerciseShell — Shared responsive wrapper for all 5 exercise screens.
 *
 * Mobile  (<1024px): single column — header → image → exercise → pinned footer
 * Desktop (1024px+): two-column side-by-side
 *   Left  ~42%: word image (fills panel) + word info
 *   Right ~58%: interactive exercise content + pinned footer
 *
 * This eliminates the narrow 672px mobile card on wide-screen desktops.
 */
export const ExerciseShell = memo(function ExerciseShell({
  step,
  title,
  word,
  dispatch,
  leftPanelExtra,
  children,
  footer,
}: Props) {
  return (
    <div className="bg-background flex flex-col min-h-svh lg:flex-row lg:min-h-svh lg:overflow-hidden">
      {/* ── DESKTOP LEFT PANEL ───────────────────────────────────────────────── */}
      {/* Hidden on mobile; visible as fixed-height left column on lg+ */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[42%] xl:w-[40%] shrink-0 bg-slate-950 relative overflow-hidden"
        aria-label={`Word image: ${word.label}`}
      >
        {/* Full-bleed word image */}
        <div className="absolute inset-0">
          <WordImage
            word={word}
            loading="eager"
            width="800"
            height="900"
            className="size-full object-cover"
          />
          {/* Gradient overlay at the bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Word info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-2">
          {/* Topic pill */}
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
          {/* Any extra content the specific exercise wants to show in the left panel */}
          {leftPanelExtra && (
            <div className="mt-2">{leftPanelExtra}</div>
          )}
        </div>

        {/* Step indicator in top-left corner on desktop */}
        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
          <span className="font-sans font-semibold text-white/70 text-xs">
            Step {step + 1} of 6
          </span>
        </div>
      </aside>

      {/* ── RIGHT PANEL (mobile: full page, desktop: right column) ──────────── */}
      <div className="flex-1 flex flex-col min-h-svh lg:min-h-0 lg:overflow-hidden">
        {/* Lesson header — back / title / close / progress bar */}
        <LessonHeader
          title={title}
          step={step}
          onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
          onClose={() => dispatch({ type: "GO", to: "home" })}
        />

        {/* Mobile-only word image (hidden on desktop where left panel shows it) */}
        <div className="lg:hidden px-5 pt-1 pb-0 shrink-0">
          <div className="h-44 sm:h-52 relative rounded-2xl w-full overflow-hidden border border-border bg-muted">
            <WordImage
              word={word}
              loading="eager"
              width="800"
              height="600"
              className="absolute inset-0 object-cover size-full"
            />
            {/* Word label overlay on mobile image */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="font-sans font-black text-white text-2xl leading-none">{word.label}</p>
              <p className="font-sans text-white/70 text-sm">/{word.phonetic}/</p>
            </div>
          </div>
          {leftPanelExtra && (
            <div className="mt-3">{leftPanelExtra}</div>
          )}
        </div>

        {/* Scrollable exercise content area */}
        <main
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 lg:px-8 lg:py-6"
          aria-label={`${title} exercise`}
        >
          {children}
        </main>

        {/* Pinned footer — always visible, never scrolls off */}
        <footer className="shrink-0 px-5 pb-8 pt-3 lg:px-8 lg:pb-8 border-t border-border/60 bg-background">
          {footer}
        </footer>

        <HomeIndicator />
      </div>
    </div>
  );
});

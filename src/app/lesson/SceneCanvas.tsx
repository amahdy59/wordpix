import { memo } from "react";
import { ArrowLeft, BookOpen, Sparkles, List } from "lucide-react";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { AudioButton } from "../shared/AudioButton";
import { WordImage } from "../shared/WordImage";
import type { VocabularyItem } from "../data/lessons";

interface Props {
  activeWord: VocabularyItem;
  /** Name of the word group this session teaches, shown in the header. */
  groupName: string;
  activeId: string;
  isPlaying: boolean;
  isError: boolean;
  onSelectWord: (id: string) => void;
  onPlayGame: () => void;
  onClose: () => void;
  onBrowseWords: () => void;
}

export const SceneCanvas = memo(function SceneCanvas({
  activeWord,
  groupName,
  activeId,
  isPlaying,
  isError,
  onSelectWord,
  onPlayGame,
  onClose,
  onBrowseWords,
}: Props) {
  return (
    <section
      className="relative flex-1 lg:flex-[3] min-w-0 min-h-0 flex flex-col bg-background h-full overflow-hidden"
      aria-label="Vocabulary word view"
    >
      {/* Mobile status bar */}
      <div className="lg:hidden shrink-0">
        <StatusBar />
      </div>

      <div className="lg:hidden flex items-center gap-2 px-3 py-2 bg-wp-card border-b border-border shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="size-11 shrink-0 rounded-xl border border-border bg-wp-card text-foreground flex items-center justify-center"
          aria-label="Back to lesson overview"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <p className="flex-1 font-sans font-bold text-foreground text-sm truncate px-1">
          {groupName}
        </p>
        <button
          type="button"
          onClick={onBrowseWords}
          className="min-h-[44px] px-3 rounded-xl border border-border bg-wp-card text-foreground flex items-center gap-1.5 text-xs font-sans font-bold"
          aria-label={`Browse all ${groupName} words`}
        >
          <List className="size-4" aria-hidden />
          Words
        </button>
      </div>

      {/* Desktop header bar */}
      <header className="hidden lg:flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 bg-wp-card border-b border-border shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-3 rounded-xl border border-border bg-wp-card text-foreground flex items-center gap-2 font-sans font-bold text-sm hover:bg-muted"
            aria-label="Back to lesson overview"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </button>
          <div
            className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs"
            aria-hidden
          >
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-foreground text-base leading-none">
              {groupName}
            </h1>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">
              Viewing {activeWord.label}
            </p>
          </div>
        </div>

        {/* Active word badge — lg and up only. At md this header needed 507px
            of content inside 448px, which clipped controls off the right
            edge. The same word already appears in the detail card directly
            below, so hiding it here loses nothing. */}
        <div className="hidden lg:flex items-center gap-2 bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20 shadow-wp-xs">
          <Sparkles className="size-3.5 text-primary motion-safe:animate-pulse" aria-hidden />
          <span className="font-sans font-bold text-foreground text-sm">{activeWord.label}</span>
        </div>
      </header>

      {/* Main Display Canvas Container */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center bg-wp-panel p-3 lg:p-4 overflow-hidden">
        {/* Main Displayed Picture (HD 1200px+ resolution, un-cropped & un-distorted) */}
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-wp-panel/60">
          <WordImage
            key={activeWord.id}
            word={activeWord}
            loading="eager"
            className="size-full object-contain rounded-2xl shadow-lg motion-safe:transition-all motion-safe:duration-300"
          />
        </div>

        {/* Floating Active Word Detail Overlay */}
        <div className="w-full max-w-2xl z-20 mt-3 pointer-events-auto shrink-0">
          <div className="bg-wp-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-3 lg:p-4 shadow-wp-md flex items-center gap-3 lg:gap-4 w-full">
            <div className="size-14 lg:size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
              <WordImage
                word={activeWord}
                width="64"
                height="64"
                className="size-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-foreground text-xl lg:text-2xl leading-none truncate">
                  {activeWord.label}
                </h2>
                <AudioButton
                  onPlay={() => onSelectWord(activeId)}
                  isPlaying={isPlaying}
                  isError={isError}
                  label={`Listen to ${activeWord.label}`}
                  size="sm"
                />
              </div>

              <span className="font-sans text-muted-foreground text-xs font-medium truncate">
                Pronunciation: /{activeWord.phonetic}/
              </span>

              {activeWord.topic && (
                <span className="inline-flex self-start text-[10px] font-sans font-semibold text-primary bg-secondary px-2 py-0.5 rounded-full border border-primary/10 capitalize">
                  {activeWord.topic.replace("-", " ")}
                </span>
              )}
            </div>

            {/*
              Was `hidden sm:block md:hidden` — visible only between 640px and
              767px. Below 640px and at 768px+ it was gone, and the mobile
              bottom card (md:hidden) already covers everything under 768px. So
              it duplicated that card in a 128px window and left desktop with no
              way to start practice at all. It is now the desktop control, and
              the bottom card is the mobile one, with no overlap and no gap.
            */}
            <button
              type="button"
              onClick={onPlayGame}
              className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl px-5 py-3 font-sans font-bold text-wp-text-on-blue text-sm shrink-0 min-h-[48px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-all hidden lg:block"
            >
              Play Game
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom card */}
      <div className="lg:hidden bg-wp-card rounded-t-[28px] px-5 pt-4 pb-3 flex flex-col gap-3 shadow-wp-md shrink-0 border-t border-border z-20">
        <button
          type="button"
          onClick={onPlayGame}
          className="w-full bg-wp-blue rounded-xl py-3.5 font-sans font-bold text-wp-text-on-blue text-base min-h-[48px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            motion-safe:transition-opacity hover:opacity-90 active:opacity-80"
        >
          Play Game →
        </button>
      </div>

      <div className="lg:hidden shrink-0">
        <HomeIndicator />
      </div>
    </section>
  );
});

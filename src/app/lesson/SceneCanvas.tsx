import { memo, useState } from "react";
import { ArrowLeft, BookOpen, Volume2, Sparkles, Image as ImageIcon, MapPin, List } from "lucide-react";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { CloseButton } from "../shared/CloseButton";
import { AudioButton } from "../shared/AudioButton";
import { WordImage } from "../shared/WordImage";
import type { VocabItem } from "../data/lessons";

const imgDefaultScene = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85";

interface Props {
  activeWord: VocabItem;
  hotspotWords: VocabItem[];
  activeId: string;
  isPlaying: boolean;
  isError: boolean;
  onSelectWord: (id: string) => void;
  onLearnWord: () => void;
  onClose: () => void;
  onBrowseWords: () => void;
}

export const SceneCanvas = memo(function SceneCanvas({
  activeWord,
  hotspotWords,
  activeId,
  isPlaying,
  isError,
  onSelectWord,
  onLearnWord,
  onClose,
  onBrowseWords,
}: Props) {
  const [viewMode, setViewMode] = useState<"word" | "scene">("word");

  const isWordView = viewMode === "word";

  const handleSelectWordLocal = (id: string) => {
    onSelectWord(id);
    setViewMode("word");
  };

  return (
    <section className="relative flex-1 md:flex-[3] min-w-0 min-h-0 flex flex-col bg-background h-full overflow-hidden max-w-[1100px]" aria-label="Vocabulary scene">
      {/* Mobile status bar */}
      <div className="md:hidden shrink-0">
        <StatusBar />
      </div>

      <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-wp-card border-b border-border shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="size-11 shrink-0 rounded-xl border border-border bg-wp-card text-foreground flex items-center justify-center"
          aria-label="Back to lesson overview"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <div className="flex flex-1 items-center bg-muted p-1 rounded-xl border border-border">
          {(["word", "scene"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              aria-pressed={viewMode === mode}
              className={`flex-1 min-h-[44px] rounded-lg text-xs font-sans font-bold capitalize ${
                viewMode === mode ? "bg-wp-card text-primary shadow-wp-xs" : "text-muted-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onBrowseWords}
          className="min-h-[44px] px-3 rounded-xl border border-border bg-wp-card text-foreground flex items-center gap-1.5 text-xs font-sans font-bold"
          aria-label="Browse all 56 bedroom words"
        >
          <List className="size-4" aria-hidden />
          Words
        </button>
      </div>

      {/* Desktop header bar */}
      <header className="hidden md:flex items-center justify-between gap-4 px-5 py-3 bg-wp-card border-b border-border shrink-0 z-10">
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
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs" aria-hidden>
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-foreground text-base leading-none">Bedroom Lesson</h1>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">
              {!isWordView ? "Select hotspots to explore room features" : `Viewing ${activeWord.label}`}
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Active Word Badge */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode("word")}
              aria-pressed={viewMode === "word"}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
                viewMode === "word"
                  ? "bg-wp-card text-primary shadow-wp-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="size-3.5" />
              Word View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("scene")}
              aria-pressed={viewMode === "scene"}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
                viewMode === "scene"
                  ? "bg-wp-card text-primary shadow-wp-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="size-3.5" />
              Scene View
            </button>
          </div>

          {/* Active Word Badge */}
          <div className="flex items-center gap-2 bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20 shadow-wp-xs">
            <Sparkles className="size-3.5 text-primary animate-pulse" aria-hidden />
            <span className="font-sans font-bold text-foreground text-sm">{activeWord.label}</span>
          </div>
        </div>
      </header>

      {/* Main Display Canvas Container */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center bg-slate-950 p-3 md:p-4 overflow-hidden">
        
        {/* Main Displayed Picture (HD 1200px+ resolution, un-cropped & un-distorted) */}
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-slate-900/60">
          {isWordView ? (
            <WordImage
              key={activeWord.id}
              word={activeWord}
              loading="eager"
              className="size-full object-contain rounded-2xl shadow-lg motion-safe:transition-all motion-safe:duration-300"
            />
          ) : (
            <img
              alt="Interactive bedroom scene"
              className="size-full object-contain rounded-2xl shadow-lg motion-safe:transition-all motion-safe:duration-300"
              src={imgDefaultScene}
            />
          )}

          {/* Hotspots on Scene View */}
          {!isWordView && (
            <div role="group" aria-label="Scene vocabulary hotspots" className="absolute inset-0 z-10 pointer-events-auto">
              {hotspotWords.map((word) => {
                const isActive = word.id === activeId;
                return (
                  <button
                    key={word.id}
                    type="button"
                    onClick={() => handleSelectWordLocal(word.id)}
                    aria-pressed={isActive}
                    aria-label={
                      isActive
                        ? `Currently selected: ${word.label}`
                        : `Explore: ${word.label}`
                    }
                    className={[
                      "absolute transform -translate-x-1/2 -translate-y-1/2",
                      "min-h-[44px] min-w-[44px] flex items-center justify-center",
                      "rounded-full focus-visible:outline focus-visible:outline-[3px]",
                      "focus-visible:outline-white focus-visible:outline-offset-2",
                      "motion-safe:transition-all",
                    ].join(" ")}
                    style={{ left: word.hotspot!.x, top: word.hotspot!.y }}
                  >
                    {isActive ? (
                      <div className="bg-wp-amber/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-wp-md border border-white/40 motion-safe:animate-bounce">
                        <Volume2 className="size-3.5 text-foreground shrink-0" aria-hidden />
                        <span className="font-sans font-bold text-foreground text-xs whitespace-nowrap">
                          {word.label}
                        </span>
                      </div>
                    ) : (
                      <div className="size-8 bg-wp-card/90 backdrop-blur-md rounded-full border-2 border-primary shadow-wp-xs flex items-center justify-center motion-safe:animate-pulse hover:scale-110">
                        <div className="size-2.5 bg-primary rounded-full" aria-hidden />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating Active Word Detail Overlay */}
        <div className="w-full max-w-2xl z-20 mt-3 pointer-events-auto shrink-0">
          <div className="bg-wp-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-3 md:p-4 shadow-wp-md flex items-center gap-3 md:gap-4 w-full">
            <div className="size-14 md:size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
              <WordImage word={activeWord} width="64" height="64" className="size-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-foreground text-xl md:text-2xl leading-none truncate">
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

            <button
              type="button"
              onClick={onLearnWord}
              className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl px-5 py-3 font-sans font-bold text-white text-sm shrink-0 min-h-[48px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-all hidden sm:block"
            >
              Start Group Practice →
            </button>
          </div>
        </div>

        <div className="absolute top-3 right-3 z-30 md:hidden">
          <CloseButton onClick={onClose} aria-label="Close lesson and return to lesson overview" />
        </div>
      </div>

      {/* Mobile bottom card */}
      <div className="md:hidden bg-wp-card rounded-t-[28px] px-5 pt-4 pb-3 flex flex-col gap-3 shadow-wp-md shrink-0 border-t border-border z-20">
        <button
          type="button"
          onClick={onLearnWord}
          className="w-full bg-wp-blue rounded-xl py-3.5 font-sans font-bold text-white text-base min-h-[48px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            motion-safe:transition-opacity hover:opacity-90 active:opacity-80"
        >
          Learn &ldquo;{activeWord.label}&rdquo; →
        </button>
      </div>

      <div className="md:hidden shrink-0">
        <HomeIndicator />
      </div>
    </section>
  );
});

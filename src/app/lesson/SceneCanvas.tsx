import { memo } from "react";
import { BookOpen, Volume2, Sparkles } from "lucide-react";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { CloseButton } from "../shared/CloseButton";
import { AudioButton } from "../shared/AudioButton";
import type { VocabItem } from "../data/lessons";

const imgDefaultScene = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1000&q=80";

interface Props {
  activeWord: VocabItem;
  hotspotWords: VocabItem[];
  activeId: string;
  isPlaying: boolean;
  isError: boolean;
  onSelectWord: (id: string) => void;
  onLearnWord: () => void;
  onClose: () => void;
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
}: Props) {
  // Use active word image if available, fallback to scene image
  const displayImage = activeWord.img || imgDefaultScene;

  return (
    <div className="relative flex-1 md:flex-[3] flex flex-col bg-background" style={{ minHeight: "55vmin" }}>
      {/* Mobile status bar */}
      <div className="md:hidden shrink-0">
        <StatusBar />
      </div>

      {/* Desktop header bar */}
      <div className="hidden md:flex items-center justify-between px-5 py-4 bg-wp-card border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs" aria-hidden>
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-foreground text-base leading-none">Bedroom Lesson</h1>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">Select any word from the list or scene to explore</p>
          </div>
        </div>

        {/* Selected Word Pill Badge */}
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full border border-primary/20">
          <Sparkles className="size-3.5 text-primary animate-pulse" aria-hidden />
          <span className="font-sans font-bold text-foreground text-xs">{activeWord.label}</span>
          <span className="font-arabic font-bold text-primary text-xs" dir="auto" lang="ar">{activeWord.ar}</span>
        </div>
      </div>

      {/* Main Scene & Word Display Canvas */}
      <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-muted/30" style={{ minHeight: "320px" }}>
        {/* Background / Main Featured Image */}
        <img
          key={activeWord.id}
          alt={`${activeWord.label} — ${activeWord.ar}`}
          className="absolute inset-0 object-cover size-full motion-safe:transition-all motion-safe:duration-500"
          src={displayImage}
        />

        {/* Dark subtle vignette gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />

        {/* Hotspot buttons on scene canvas */}
        <div role="group" aria-label="Scene vocabulary hotspots" className="z-10">
          {hotspotWords.map((word) => {
            const isActive = word.id === activeId;
            return (
              <button
                key={word.id}
                type="button"
                onClick={() => onSelectWord(word.id)}
                aria-pressed={isActive}
                aria-label={
                  isActive
                    ? `Currently selected: ${word.label} — ${word.ar}`
                    : `Explore: ${word.label} — ${word.ar}`
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
                  <div className="bg-wp-amber/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-wp-md border border-white/40">
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

        {/* Floating Desktop Active Word Card Overlay */}
        <div className="hidden md:flex absolute bottom-5 left-5 right-5 z-20 bg-wp-card/95 backdrop-blur-md rounded-2xl p-4 border border-border/80 shadow-wp-md items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-border shadow-wp-xs">
              <img
                src={activeWord.img}
                alt={activeWord.label}
                className="size-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="font-sans font-black text-foreground text-2xl leading-none">
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

              <div className="flex items-center gap-3">
                <p className="font-arabic font-bold text-primary text-xl" dir="auto" lang="ar">
                  {activeWord.ar}
                </p>
                <span className="font-sans text-muted-foreground text-sm font-medium">
                  • {activeWord.phonetic}
                </span>
              </div>

              {activeWord.topic && (
                <span className="inline-flex self-start text-[11px] font-sans font-semibold text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-primary/10 mt-0.5">
                  {activeWord.topic.replace("-", " ")}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onLearnWord}
            className="bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl px-6 py-3.5 font-sans font-bold text-white text-base min-h-[52px] shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue shadow-wp-xs transition-all"
          >
            Learn &ldquo;{activeWord.label}&rdquo; →
          </button>
        </div>

        {/* Top-right close button */}
        <div className="absolute top-4 right-4 z-20">
          <CloseButton onClick={onClose} aria-label="Close lesson and return to lesson overview" />
        </div>
      </div>

      {/* Mobile bottom card */}
      <div className="md:hidden bg-wp-card rounded-t-[28px] px-5 pt-5 pb-3 flex flex-col gap-4 shadow-wp-md shrink-0 border-t border-border">
        <div className="flex items-start gap-3">
          <img
            src={activeWord.img}
            alt={`${activeWord.label} — ${activeWord.ar}`}
            className="size-16 rounded-xl object-cover shrink-0 border border-border shadow-wp-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-black text-foreground text-2xl leading-none truncate">
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
            <p
              className="font-arabic font-bold text-primary text-lg mt-1"
              dir="auto"
              lang="ar"
            >
              {activeWord.ar}
            </p>
            <p className="font-sans text-muted-foreground text-sm">
              {activeWord.phonetic}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLearnWord}
          className="w-full bg-wp-blue rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            motion-safe:transition-opacity hover:opacity-90 active:opacity-80"
        >
          Learn Word →
        </button>
      </div>

      <div className="md:hidden shrink-0">
        <HomeIndicator />
      </div>
    </div>
  );
});

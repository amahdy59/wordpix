import { memo } from "react";
import { BookOpen, Volume2 } from "lucide-react";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { CloseButton } from "../shared/CloseButton";
import { AudioButton } from "../shared/AudioButton";
import type { VocabWord } from "../data/lessons";

const imgScene = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1000&q=80";

interface Props {
  activeWord: VocabWord;
  hotspotWords: VocabWord[];
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
  return (
    <div className="relative flex-1 md:flex-[3] flex flex-col" style={{ minHeight: "55vmin" }}>
      {/* Mobile status bar */}
      <div className="md:hidden shrink-0">
        <StatusBar />
      </div>

      {/* Desktop header bar */}
      <div className="hidden md:flex items-center gap-3 px-5 py-4 bg-wp-card border-b border-border shrink-0">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center" aria-hidden>
          <BookOpen className="size-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-foreground text-base leading-none">Bedroom Lesson</h1>
          <p className="font-sans text-muted-foreground text-xs mt-0.5">Tap objects in the scene to explore</p>
        </div>
      </div>

      {/* Scene image and hotspots */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: "240px" }}>
        <img
          alt="Interactive bedroom scene. Select highlighted spots to learn vocabulary words."
          className="absolute inset-0 object-cover size-full"
          src={imgScene}
        />

        {/* Hotspot buttons */}
        <div role="group" aria-label="Scene vocabulary hotspots">
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
                  <div className="bg-wp-amber/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-wp-sm">
                    <Volume2 className="size-3 text-foreground shrink-0" aria-hidden />
                    <span className="font-sans font-semibold text-foreground text-xs whitespace-nowrap">
                      {word.label}
                    </span>
                  </div>
                ) : (
                  <div className="size-7 bg-wp-card/90 backdrop-blur-sm rounded-full border-2 border-primary shadow-wp-xs flex items-center justify-center motion-safe:animate-pulse">
                    <div className="size-2 bg-primary rounded-full" aria-hidden />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Top-right close button */}
        <div className="absolute top-3 right-3 z-20">
          <CloseButton onClick={onClose} aria-label="Close lesson and return to lesson overview" />
        </div>
      </div>

      {/* Mobile bottom card */}
      <div className="md:hidden bg-wp-card rounded-t-[28px] px-5 pt-5 pb-2 flex flex-col gap-4 shadow-wp-md shrink-0">
        <div className="flex items-start gap-3">
          <img
            src={activeWord.img}
            alt={`${activeWord.label} — ${activeWord.ar}`}
            className="size-16 rounded-xl object-cover shrink-0 border border-border"
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

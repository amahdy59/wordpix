import { memo, useEffect, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { PrimaryButton } from "../shared/PrimaryButton";
import { useAudio } from "../shared/useAudio";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { Volume2, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { usePrefetchImage } from "../shared/usePrefetchImage";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const { accessibility } = useAccessibility();
  const speed = accessibility.speechRate;
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: speed });
  const mountedRef = useRef(false);

  const currentWord = words[activeWordIndex] || words[0];
  const isLastWord = activeWordIndex === words.length - 1;
  usePrefetchImage(isLastWord ? null : words[activeWordIndex + 1]);

  const playWord = useCallback(() => speak(currentWord.label), [speak, currentWord.label]);

  useEffect(() => {
    if (!mountedRef.current && isSupported) {
      mountedRef.current = true;
      const t = setTimeout(() => playWord(), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isSupported, playWord]);

  useEffect(() => () => stop(), [stop]);



  // Speaks whichever word becomes active, however it was reached — the timer
  // above, an arrow, or the group strip.
  useEffect(() => {
    if (!mountedRef.current) return undefined;
    stop();
    const t = setTimeout(() => speak(currentWord.label), 140);
    return () => clearTimeout(t);
  }, [activeWordIndex, currentWord.label, speak, stop]);

  const handleSelectWordIndex = useCallback((index: number) => {
    setActiveWordIndex(index);
  }, []);

  const handleToggle = () => { if (isPlaying) stop(); else playWord(); };



  return (
    <ExerciseShell
      step={step}
      title="Pronunciation & Audio Drill"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      footer={
        <div className="flex flex-col gap-2">
          <PrimaryButton label="Continue to Context Sentences →" onClick={() => { stop(); dispatch({ type: "LESSON_NEXT" }); }} />
        </div>
      }
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${currentWord.label}` : ""}
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 w-full mt-2 sm:mt-4">

        {/* Compact Word Selector Grid (No text, tight bounding box) */}
        <div className="flex justify-center gap-2 sm:gap-3" role="tablist" aria-label="Group vocabulary words">
          {words.map((w, index) => {
            const isSelected = index === activeWordIndex;
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectWordIndex(index)}
                className={`relative size-12 sm:size-14 rounded-xl overflow-hidden transition-all ${
                  isSelected
                    ? "border-[3px] border-primary shadow-wp-md scale-110"
                    : "border-[2px] border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Word ${index + 1}: ${w.label}`}
              >
                <WordImage word={w} width="56" height="56" className="size-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Fluid Target Image Banner */}
        <div className="w-full aspect-video max-h-[50vh] sm:max-h-[60vh] relative rounded-3xl overflow-hidden border border-border shadow-wp-lg bg-muted shrink-0 mt-2">
          <WordImage word={currentWord} width="1200" height="800" className="size-full object-cover" />
          <div className="absolute top-3 start-3 sm:top-4 sm:start-4 bg-black/65 backdrop-blur-md text-white font-sans font-bold text-[11px] sm:text-xs px-3 py-1.5 rounded-xl border border-white/20 shadow-md flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-wp-amber animate-pulse" />
            <span>Target Visual</span>
          </div>

          {/* Floating Arrows */}
          <button
            type="button"
            disabled={activeWordIndex === 0}
            onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
            className="absolute start-3 sm:start-4 top-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Previous word"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>
          <button
            type="button"
            disabled={activeWordIndex === words.length - 1}
            onClick={() => handleSelectWordIndex(activeWordIndex + 1)}
            className="absolute end-3 sm:end-4 top-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Next word"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </div>

        {/* Word Info & Audio Action (No Container) */}
        <div className="flex flex-col items-center justify-center mt-2 mb-2">
          <div className="flex items-center justify-center gap-4 sm:gap-5 flex-wrap text-center">
            <button
              type="button"
              onClick={handleToggle}
              aria-label={`Play audio pronunciation for ${currentWord.label}`}
              className="size-14 sm:size-16 rounded-full bg-primary transition-transform text-primary-foreground flex items-center justify-center shadow-wp-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary group"
            >
              <Volume2 className={`size-6 sm:size-7 ${isPlaying ? "animate-pulse" : ""}`} />
            </button>
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="font-sans font-black text-foreground text-3xl sm:text-4xl lg:text-5xl">{currentWord.label}</span>
              <span className="font-sans font-medium text-muted-foreground text-lg sm:text-xl lg:text-2xl">/{currentWord.phonetic}/</span>
            </div>
          </div>
        </div>

        {!isSupported && (
          <p className="font-sans text-muted-foreground text-xs text-center">
            Speech synthesis is not supported in this browser.
          </p>
        )}
        {isError && (
          <p className="font-sans text-wp-rose text-xs text-center">
            Audio playback failed. Try a different browser.
          </p>
        )}
      </div>
    </ExerciseShell>
  );
});

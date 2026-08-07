import { memo, useEffect, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { LessonHeader } from "../shared/LessonHeader";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { WordImage } from "../shared/WordImage";
import { useAudio } from "../shared/useAudio";
import { Volume2, Mic, Sparkles } from "lucide-react";

interface Props {
  step: number;
  word: VocabItem;
  dispatch: React.Dispatch<Action>;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25];

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({ step, word, dispatch }: Props) {
  const [speed, setSpeed] = useState<number>(0.75);
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: speed });
  const mountedRef = useRef(false);

  // Auto-speak initial word on mount or speed change
  const playCurrentWord = useCallback(() => {
    speak(word.label);
  }, [speak, word.label]);

  useEffect(() => {
    if (!mountedRef.current && isSupported) {
      mountedRef.current = true;
      const timer = setTimeout(() => playCurrentWord(), 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isSupported, playCurrentWord]);

  useEffect(() => () => stop(), [stop]);

  const handleToggle = () => {
    if (isPlaying) stop();
    else playCurrentWord();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    stop();
    setTimeout(() => speak(word.label), 120);
  };

  return (
    <div className="bg-background flex flex-col min-h-svh justify-between relative overflow-hidden">
      <LessonHeader
        title="Listen & Practice"
        step={step}
        onBack={() => dispatch({ type: "LESSON_PREVIOUS" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${word.label}` : ""}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-5 py-4 gap-6" aria-label="Listen and practice exercise">
        {/* Featured Word Image & Phonetic Card */}
        <section aria-label={`Word: ${word.label}`} className="bg-wp-card rounded-3xl border border-border p-5 flex flex-col items-center gap-4 w-full shadow-wp-xs">
          <div className="h-48 sm:h-56 relative rounded-2xl w-full overflow-hidden bg-slate-900 border border-border">
            <WordImage word={word} loading="eager" width="800" height="600" className="absolute inset-0 object-cover size-full" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-black text-foreground text-3xl md:text-4xl leading-none">{word.label}</h2>
              <span className="bg-secondary text-primary font-sans font-bold text-xs px-2.5 py-0.5 rounded-full border border-primary/20 capitalize">
                {word.topic}
              </span>
            </div>
            <p className="font-sans font-medium text-muted-foreground text-sm tracking-wide mt-1">
              Pronunciation: <span className="text-foreground font-semibold">/{word.phonetic}/</span>
            </p>
          </div>
        </section>

        {/* Audio Player & Speed Controls (Figma Node 399:732 Alignment) */}
        <div className="flex flex-col items-center gap-4 w-full bg-wp-card/80 border border-border rounded-2xl p-4 shadow-wp-xs">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-primary font-sans font-bold text-sm">
              {isPlaying ? (
                <>
                  <Volume2 className="size-5 animate-pulse text-wp-blue" />
                  <span>Listening…</span>
                </>
              ) : (
                <>
                  <Mic className="size-5 text-wp-green" />
                  <span>Tap to listen &amp; speak out loud</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-sans font-semibold text-wp-amber bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="size-3.5" />
              <span>+15 XP</span>
            </div>
          </div>

          {/* Audio Waveform Bar */}
          <button
            type="button"
            onClick={handleToggle}
            aria-label={`Play audio pronunciation for ${word.label}`}
            className="w-full bg-secondary hover:bg-primary/15 rounded-xl p-3.5 flex items-center justify-center gap-3 border border-primary/20 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all group"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-wp-xs group-hover:scale-105 transition-transform">
              <Volume2 className="size-5" />
            </div>

            {/* Waveform Bars */}
            <div className="flex items-center gap-1 h-6 px-2">
              {[8, 14, 20, 26, 12, 18, 30, 24, 16, 22, 34, 10, 14, 20, 26, 12].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isPlaying ? "bg-primary animate-pulse" : "bg-primary/40"
                  }`}
                  style={{ height: isPlaying ? `${Math.max(6, (height * (i % 3 + 1)) % 28)}px` : `${height}px` }}
                />
              ))}
            </div>
          </button>

          {/* Speed Selector Chips */}
          <div className="flex items-center justify-center gap-2 w-full pt-1" role="group" aria-label="Audio playback speed">
            <span className="font-sans text-xs text-muted-foreground font-medium mr-1">Speed:</span>
            {SPEEDS.map((s) => {
              const isActive = speed === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpeedChange(s)}
                  aria-pressed={isActive}
                  className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-all min-h-[36px] ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-wp-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-border/60"
                  } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
                >
                  {s}x
                </button>
              );
            })}
          </div>

          {!isSupported && (
            <p className="font-sans text-muted-foreground text-xs text-center mt-1">
              Speech synthesis is not supported in this browser.
            </p>
          )}
        </div>
      </main>

      {/* Footer CTAs */}
      <footer className="w-full max-w-lg mx-auto px-5 pb-8 pt-2 flex flex-col gap-2.5 shrink-0">
        <PrimaryButton label="Continue" onClick={() => { stop(); dispatch({ type: "LESSON_NEXT" }); }} />
        <SecondaryButton label="Listen Again" onClick={handleToggle} />
      </footer>

      <HomeIndicator />
    </div>
  );
});

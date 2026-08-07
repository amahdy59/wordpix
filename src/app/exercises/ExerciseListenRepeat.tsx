import { memo, useEffect, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { useAudio } from "../shared/useAudio";
import { Volume2, Mic, Sparkles } from "lucide-react";

interface Props {
  step: number;
  word: VocabItem;
  currentWordIndex?: number;
  totalWordsQueue?: number;
  dispatch: React.Dispatch<Action>;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25];

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({
  step,
  word,
  currentWordIndex = 0,
  totalWordsQueue = 5,
  dispatch,
}: Props) {
  const [speed, setSpeed] = useState<number>(0.75);
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: speed });
  const mountedRef = useRef(false);

  const playWord = useCallback(() => speak(word.label), [speak, word.label]);

  useEffect(() => {
    if (!mountedRef.current && isSupported) {
      mountedRef.current = true;
      const t = setTimeout(() => playWord(), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isSupported, playWord]);

  useEffect(() => () => stop(), [stop]);

  const handleToggle = () => { if (isPlaying) stop(); else playWord(); };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    stop();
    setTimeout(() => speak(word.label), 120);
  };

  const leftExtra = (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-sans text-white/50 text-sm font-medium">Listen at:</span>
      {SPEEDS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleSpeedChange(s)}
          aria-pressed={speed === s}
          className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all min-h-[36px] ${
            speed === s
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-white/10 text-white/60 hover:text-white"
          } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
        >
          {s}x
        </button>
      ))}
    </div>
  );

  return (
    <ExerciseShell
      step={step}
      title="Listen & Practice"
      word={word}
      currentWordIndex={currentWordIndex}
      totalWordsQueue={totalWordsQueue}
      dispatch={dispatch}
      leftPanelExtra={leftExtra}
      footer={
        <div className="flex flex-col gap-2.5">
          <PrimaryButton label="Continue" onClick={() => { stop(); dispatch({ type: "LESSON_NEXT" }); }} />
          <SecondaryButton label="Listen Again" onClick={handleToggle} />
        </div>
      }
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${word.label}` : ""}
      </div>

      {/* Audio player card */}
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-sm">
            {isPlaying ? (
              <><Volume2 className="size-5 animate-pulse text-wp-blue" /><span>Listening…</span></>
            ) : (
              <><Mic className="size-5 text-wp-green" /><span>Tap to listen &amp; speak out loud</span></>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-wp-amber bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="size-3.5" />
            <span>+15 XP</span>
          </div>
        </div>

        {/* Waveform play button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={`Play audio pronunciation for ${word.label}`}
          className="w-full bg-secondary hover:bg-primary/15 rounded-xl p-4 flex items-center justify-center gap-4 border border-primary/20 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all group"
        >
          <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Volume2 className="size-6" />
          </div>
          {/* Waveform bars */}
          <div className="flex items-center gap-[3px] h-8 flex-1 max-w-[200px]">
            {[8,14,22,30,18,26,34,20,28,16,24,12,20,28,16,22].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-150 ${isPlaying ? "bg-primary animate-pulse" : "bg-primary/30"}`}
                style={{ height: isPlaying ? `${Math.max(4, (h * (i % 3 + 1)) % 32)}px` : `${h}px` }}
              />
            ))}
          </div>
        </button>

        {/* Speed controls — mobile only */}
        <div className="lg:hidden flex items-center justify-center gap-2 flex-wrap" role="group" aria-label="Playback speed">
          <span className="font-sans text-xs text-muted-foreground font-medium">Speed:</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSpeedChange(s)}
              aria-pressed={speed === s}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all min-h-[36px] ${
                speed === s
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-border/60"
              } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
            >
              {s}x
            </button>
          ))}
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

import { memo, useEffect, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { useAudio } from "../shared/useAudio";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { Volume2, Mic, Sparkles, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { WordImage } from "../shared/WordImage";

interface Props {
  step: number;
  words: VocabItem[];
  groupId?: string;
  dispatch: React.Dispatch<Action>;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25];

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({
  step,
  words,
  groupId,
  dispatch,
}: Props) {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  // Seeded from the learner's Settings speech rate rather than a constant,
  // so the global preference is the starting point here too.
  const { accessibility } = useAccessibility();
  const [speed, setSpeed] = useState<number>(accessibility.speechRate);
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: speed });
  const mountedRef = useRef(false);

  const currentWord = words[activeWordIndex] || words[0];

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

  const handleSelectWordIndex = (index: number) => {
    stop();
    setActiveWordIndex(index);
    setTimeout(() => speak(words[index].label), 140);
  };

  const handleToggle = () => { if (isPlaying) stop(); else playWord(); };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    stop();
    setTimeout(() => speak(currentWord.label), 120);
  };

  const leftExtra = (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-sans text-white/50 text-xs font-medium">Listen speed:</span>
      {SPEEDS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleSpeedChange(s)}
          aria-pressed={speed === s}
          className={`px-2.5 py-0.5 rounded-lg text-xs font-sans font-bold transition-all min-h-[44px] min-w-[44px] ${
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
      title="Pronunciation & Audio Drill"
      words={words}
      activeWord={currentWord}
      onSelectWord={(w) => {
        const idx = words.findIndex((item) => item.id === w.id);
        if (idx !== -1) handleSelectWordIndex(idx);
      }}
      groupId={groupId}
      dispatch={dispatch}
      leftPanelExtra={leftExtra}
      footer={
        <div className="flex flex-col gap-2">
          <PrimaryButton label="Continue to Context Sentences →" onClick={() => { stop(); dispatch({ type: "LESSON_NEXT" }); }} />
          <SecondaryButton label="Listen to Current Word Again" onClick={handleToggle} />
        </div>
      }
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${currentWord.label}` : ""}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {/* Header note */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs sm:text-sm">
            {isPlaying ? (
              <><Volume2 className="size-4 animate-pulse text-wp-blue" /><span>Listening to &ldquo;{currentWord.label}&rdquo;…</span></>
            ) : (
              <><Mic className="size-4 text-wp-green" /><span>Listen &amp; repeat out loud</span></>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-wp-amber bg-wp-amber/10 px-2.5 py-0.5 rounded-full border border-wp-amber/20">
            <Sparkles className="size-3" />
            <span>Speaking Skill</span>
          </div>
        </div>

        {/* Group Word Cards Selector Grid (Compact Cards) */}
        <div className="grid grid-cols-5 gap-2" role="tablist" aria-label="Group vocabulary words">
          {words.map((w, index) => {
            const isSelected = index === activeWordIndex;
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectWordIndex(index)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-secondary border-primary border-2 shadow-wp-xs scale-102"
                    : "bg-wp-card border-border hover:border-primary/40"
                }`}
              >
                <div className="size-11 min-h-[44px] min-w-[44px] sm:size-10 rounded-lg overflow-hidden shrink-0 border border-border bg-muted relative">
                  <WordImage word={w} width="40" height="40" className="size-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-0.5 end-0.5 bg-primary text-white p-0.5 rounded-full shadow-xs">
                      <CheckCircle2 className="size-2.5" />
                    </div>
                  )}
                </div>
                <span className={`font-sans text-[10px] sm:text-[11px] font-bold truncate max-w-full ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                  {w.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fluid Target Image Banner (Responsive max-h) */}
        <div className="h-40 sm:h-48 md:h-52 max-h-[28vh] w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0">
          <WordImage word={currentWord} width="800" height="500" className="size-full object-cover" />
          <div className="absolute top-3 start-3 bg-black/65 backdrop-blur-md text-white font-sans font-bold text-xs px-3 py-1 rounded-xl border border-white/20 shadow-md flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-wp-amber animate-pulse" />
            <span>Target Visual: {currentWord.label}</span>
          </div>
        </div>

        {/* Active Audio Waveform Play Card */}
        <div className="bg-wp-card border border-border rounded-2xl p-3.5 sm:p-4 flex flex-col items-center gap-3 text-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              disabled={activeWordIndex === 0}
              onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
              className="size-11 min-h-[44px] min-w-[44px] rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
              aria-label="Previous word in group"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex flex-col">
              <span className="font-sans font-black text-foreground text-xl sm:text-2xl">{currentWord.label}</span>
              <span className="font-sans text-muted-foreground text-xs">/{currentWord.phonetic}/</span>
            </div>
            <button
              type="button"
              disabled={activeWordIndex === words.length - 1}
              onClick={() => handleSelectWordIndex(activeWordIndex + 1)}
              className="size-11 min-h-[44px] min-w-[44px] rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
              aria-label="Next word in group"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            aria-label={`Play audio pronunciation for ${currentWord.label}`}
            className="w-full min-h-[44px] bg-secondary hover:bg-primary/15 rounded-xl p-3 flex items-center justify-center gap-3 border border-primary/20 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all group"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Volume2 className="size-5" />
            </div>
            <div className="flex items-center gap-[3px] h-6 flex-1 max-w-[180px]">
              {[8,14,22,30,18,26,34,20,28,16,24,12,20,28,16,22].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${isPlaying ? "bg-primary animate-pulse" : "bg-primary/30"}`}
                  style={{ height: isPlaying ? `${Math.max(4, (h * (i % 3 + 1)) % 24)}px` : `${h * 0.75}px` }}
                />
              ))}
            </div>
          </button>
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

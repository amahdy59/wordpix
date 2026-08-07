import { memo, useEffect, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";
import { useAudio } from "../shared/useAudio";
import { Volume2, Mic, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
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
  const [speed, setSpeed] = useState<number>(0.75);
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
      title="Group Pronunciation & Audio"
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
        <div className="flex flex-col gap-2.5">
          <PrimaryButton label="Continue to Recall & Match →" onClick={() => { stop(); dispatch({ type: "LESSON_NEXT" }); }} />
          <SecondaryButton label="Listen to Current Word Again" onClick={handleToggle} />
        </div>
      }
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${currentWord.label}` : ""}
      </div>

      <div className="flex flex-col gap-5 w-full max-w-lg">
        {/* Header note */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-sm">
            {isPlaying ? (
              <><Volume2 className="size-5 animate-pulse text-wp-blue" /><span>Listening to &ldquo;{currentWord.label}&rdquo;…</span></>
            ) : (
              <><Mic className="size-5 text-wp-green" /><span>Listen &amp; repeat all {words.length} group words</span></>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-wp-amber bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="size-3.5" />
            <span>Group Audio</span>
          </div>
        </div>

        {/* Group Word Cards Carousel / Grid */}
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
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-secondary border-primary border-2 shadow-wp-xs scale-105"
                    : "bg-wp-card border-border hover:border-primary/40"
                }`}
              >
                <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
                  <WordImage word={w} width="48" height="48" className="size-full object-cover" />
                </div>
                <span className={`font-sans text-[11px] font-bold truncate max-w-full ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                  {w.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Audio Waveform Play Card */}
        <div className="bg-wp-card border border-border rounded-2xl p-5 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              disabled={activeWordIndex === 0}
              onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
              className="size-10 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
              aria-label="Previous word in group"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex flex-col">
              <span className="font-sans font-black text-foreground text-2xl">{currentWord.label}</span>
              <span className="font-sans text-muted-foreground text-xs">/{currentWord.phonetic}/</span>
            </div>
            <button
              type="button"
              disabled={activeWordIndex === words.length - 1}
              onClick={() => handleSelectWordIndex(activeWordIndex + 1)}
              className="size-10 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
              aria-label="Next word in group"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            aria-label={`Play audio pronunciation for ${currentWord.label}`}
            className="w-full bg-secondary hover:bg-primary/15 rounded-xl p-4 flex items-center justify-center gap-4 border border-primary/20 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all group mt-1"
          >
            <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Volume2 className="size-6" />
            </div>
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

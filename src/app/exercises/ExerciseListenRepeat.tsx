import { memo, useEffect, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { PrimaryButton } from "../shared/PrimaryButton";
import { useAudio } from "../shared/useAudio";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { Volume2, Mic, Sparkles, ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { usePrefetchImage } from "../shared/usePrefetchImage";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

/**
 * How long each word stays on screen before the drill moves to the next.
 *
 * Long enough to hear the word and say it back once. This screen previously
 * required a tap per word and then a final "Continue" — five taps to be shown
 * five words, which is not how a listen-and-repeat drill should feel.
 */
const WORD_DWELL_MS = 3800;

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const { accessibility } = useAccessibility();
  const speed = accessibility.speechRate;
  const [isPaused, setIsPaused] = useState(false);
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

  /**
   * Walks the group by itself, one word at a time, and moves on to the first
   * drill after the last one — so the learner listens and repeats rather than
   * clicking through a list.
   */
  useEffect(() => {
    if (!accessibility.autoAdvance || isPaused) return undefined;

    const timer = setTimeout(() => {
      if (isLastWord) {
        stop();
        dispatch({ type: "LESSON_NEXT" });
      } else {
        setActiveWordIndex((i) => i + 1);
      }
    }, WORD_DWELL_MS);

    return () => clearTimeout(timer);
  }, [activeWordIndex, isLastWord, isPaused, accessibility.autoAdvance, dispatch, stop]);

  // Speaks whichever word becomes active, however it was reached — the timer
  // above, an arrow, or the group strip.
  useEffect(() => {
    if (!mountedRef.current) return undefined;
    stop();
    const t = setTimeout(() => speak(currentWord.label), 140);
    return () => clearTimeout(t);
  }, [activeWordIndex, currentWord.label, speak, stop]);

  const handleSelectWordIndex = useCallback((index: number) => {
    // Touching the controls means taking over the pacing.
    setIsPaused(true);
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

      <div className="flex flex-col gap-4 sm:gap-5 w-full">
        {/* Header note */}
        <div className="flex items-center justify-between px-1 gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs sm:text-sm">
            {isPlaying ? (
              <><Volume2 className="size-4 animate-pulse text-wp-blue" /><span>Listening to &ldquo;{currentWord.label}&rdquo;…</span></>
            ) : (
              <><Mic className="size-4 text-wp-green" /><span>Listen &amp; repeat out loud</span></>
            )}
          </div>

          <div className="flex items-center gap-2">
            {accessibility.autoAdvance && (
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-pressed={isPaused}
                className="flex items-center gap-1.5 min-h-[44px] px-3 rounded-full border border-border bg-wp-card text-xs font-sans font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {isPaused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-wp-amber bg-wp-amber/10 px-2.5 py-0.5 rounded-full border border-wp-amber/20">
              <Sparkles className="size-3" aria-hidden />
              <span>Word {activeWordIndex + 1} of {words.length}</span>
            </div>
          </div>
        </div>

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

        {/* Active Word & Audio Card */}
        <div className="bg-wp-card border border-border rounded-2xl p-2.5 sm:p-3 flex flex-row items-center justify-between gap-2 sm:gap-3 shadow-sm">
          <button
            type="button"
            disabled={activeWordIndex === 0}
            onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
            className="size-11 min-h-[44px] min-w-[44px] shrink-0 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            aria-label="Previous word in group"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={handleToggle}
            aria-label={`Play audio pronunciation for ${currentWord.label}`}
            className="flex-1 min-h-[44px] bg-secondary hover:bg-primary/10 rounded-xl px-4 py-2.5 flex items-center justify-center gap-3 border border-primary/20 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all group"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Volume2 className="size-5" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="font-sans font-black text-foreground text-lg sm:text-xl truncate">{currentWord.label}</span>
              <span className="font-sans text-muted-foreground text-xs truncate">/{currentWord.phonetic}/</span>
            </div>
          </button>

          <button
            type="button"
            disabled={activeWordIndex === words.length - 1}
            onClick={() => handleSelectWordIndex(activeWordIndex + 1)}
            className="size-11 min-h-[44px] min-w-[44px] shrink-0 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            aria-label="Next word in group"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Fluid Target Image Banner (Larger, responsive max-h) */}
        <div className="h-56 sm:h-72 md:h-80 max-h-[45vh] w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-md bg-muted shrink-0 mt-1">
          <WordImage word={currentWord} width="800" height="500" className="size-full object-cover" />
          <div className="absolute top-3 start-3 bg-black/65 backdrop-blur-md text-white font-sans font-bold text-[11px] sm:text-xs px-3 py-1.5 rounded-xl border border-white/20 shadow-md flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-wp-amber animate-pulse" />
            <span>Target Visual</span>
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

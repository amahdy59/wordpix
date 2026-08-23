import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { PrimaryButton } from "../shared/PrimaryButton";
import { useAudio } from "../shared/useAudio";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import {
  Keyboard,
  Volume2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Mic,
  MicOff,
  CheckCircle2,
  Info,
} from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { useSpeechRecognition } from "../shared/useSpeechRecognition";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { WordInspectorModal } from "../shared/WordInspectorModal";

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
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);
  const [speechSuccess, setSpeechSuccess] = useState<boolean>(false);
  const { accessibility } = useAccessibility();
  const speed = accessibility.speechRate;
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: speed });
  const mountedRef = useRef(false);

  const currentWord = words[activeWordIndex] || words[0];
  const isLastWord = activeWordIndex === words.length - 1;
  usePrefetchImage(isLastWord ? null : words[activeWordIndex + 1]);

  const {
    listen,
    stop: stopListening,
    status: speechStatus,
    isListening,
    attempt,
  } = useSpeechRecognition({ lang: "en-US" });

  useEffect(() => {
    if (attempt?.matched) {
      setSpeechSuccess(true);
    }
  }, [attempt]);

  // Reset speech success when switching words
  useEffect(() => {
    setSpeechSuccess(false);
  }, [activeWordIndex]);

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
  const group = useMemo(
    () =>
      resolveGroup(
        lessonId,
        words.map((w) => w.id)
      ),
    [lessonId, words]
  );

  const handleToggle = useCallback(() => {
    if (isPlaying) stop();
    else playWord();
  }, [isPlaying, stop, playWord]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        inspectedWord ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveWordIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveWordIndex((prev) => Math.min(words.length - 1, prev + 1));
      } else if (
        e.code === "Space" &&
        (e.target === document.body || e.target === document.documentElement)
      ) {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [words.length, inspectedWord, handleToggle]);

  return (
    <ExerciseShell
      step={step}
      title="Pronunciation & Audio Drill"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: activeWordIndex + 1, total: words.length }}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <Volume2 className="size-3" aria-hidden />
            <span>
              Word {activeWordIndex + 1} of {words.length}
            </span>
          </span>
        </>
      }
      footer={
        <div className="flex flex-col gap-2">
          <PrimaryButton
            label="Continue to Context Sentences →"
            onClick={() => {
              stop();
              dispatch({ type: "LESSON_NEXT" });
            }}
          />
          <div className="w-full flex items-center text-xs font-sans font-semibold text-muted-foreground px-1 mt-1">
            <div className="flex items-center gap-1.5 text-wp-amber font-bold">
              <Keyboard className="size-4" aria-hidden />
              <span>Use Left/Right arrows to navigate · Space to play audio</span>
            </div>
          </div>
        </div>
      }
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${currentWord.label}` : ""}
      </div>

      <div className="relative flex flex-col gap-2.5 sm:gap-3.5 w-full max-w-2xl mx-auto h-full min-h-0 justify-center">
        {/* Compact Word Selector Thumbnails Strip */}
        <div
          className="flex justify-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto py-1 px-1 scrollbar-none"
          role="tablist"
          aria-label="Group vocabulary words"
        >
          {words.map((w, index) => {
            const isSelected = index === activeWordIndex;
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectWordIndex(index)}
                className={`relative size-10 sm:size-12 min-h-[44px] min-w-[44px] rounded-xl overflow-hidden transition-all shrink-0 ${
                  isSelected
                    ? "border-[2.5px] border-primary shadow-wp-md scale-105"
                    : "border border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Word ${index + 1}: ${w.label}`}
              >
                <WordImage word={w} width="48" height="48" className="size-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Fluid Target Image Banner with integrated bottom overlay */}
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-wp-lg bg-muted shrink-0 aspect-[4/3] sm:aspect-[16/10] max-h-[46dvh] sm:max-h-[52dvh]">
          <WordImage word={currentWord} className="w-full h-full absolute inset-0 object-cover" />

          {/* Top Badges */}
          <div className="absolute top-2.5 start-2.5 sm:top-3.5 sm:start-3.5 bg-black/60 backdrop-blur-md text-white font-sans font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-xl border border-white/20 shadow-md flex items-center gap-1.5 z-10 pointer-events-none">
            <Sparkles className="size-3 text-wp-amber animate-pulse" />
            <span>Target Visual</span>
          </div>

          {/* Floating Navigation Arrows */}
          <button
            type="button"
            disabled={activeWordIndex === 0}
            onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
            className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 size-9 sm:size-11 min-h-[44px] min-w-[44px] rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white z-10"
            aria-label="Previous word"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>
          <button
            type="button"
            disabled={activeWordIndex === words.length - 1}
            onClick={() => handleSelectWordIndex(activeWordIndex + 1)}
            className="absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 size-9 sm:size-11 min-h-[44px] min-w-[44px] rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white z-10"
            aria-label="Next word"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>

          {/* Bottom Integrated Overlay for Word Info & Interactive Controls */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-10 pb-3 px-3 sm:px-5 flex flex-wrap sm:flex-nowrap items-end justify-between gap-2 sm:gap-3 z-10">
            {/* Left side: Word label, Phonetics, Arabic Translation, Info button */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-sans font-black text-white text-lg sm:text-2xl lg:text-3xl leading-tight capitalize drop-shadow">
                  {currentWord.label}
                </span>
                <span className="font-sans font-medium text-white/80 text-xs sm:text-sm drop-shadow font-mono">
                  /
                  {getLexiconEntry(currentWord.id, currentWord.label).phonetic
                    ? getLexiconEntry(currentWord.id, currentWord.label).phonetic!.replace(
                        /^\/|\/$/g,
                        ""
                      )
                    : currentWord.phonetic.replace(/^\/|\/$/g, "")}
                  /
                </span>
                <button
                  type="button"
                  onClick={() => setInspectedWord(currentWord)}
                  aria-label={`Inspect full dictionary entry for ${currentWord.label}`}
                  className="size-8 min-h-[44px] min-w-[44px] rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <Info className="size-4" />
                </button>
              </div>

              {/* Arabic Translation with diacritics */}
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
                <span
                  className="font-arabic font-bold text-wp-amber text-xs sm:text-sm md:text-base drop-shadow"
                  dir="rtl"
                  lang="ar"
                >
                  {getLexiconEntry(currentWord.id, currentWord.label).arabic}
                </span>
                <span className="text-[11px] font-sans text-white/60">·</span>
                <button
                  type="button"
                  onClick={() => setInspectedWord(currentWord)}
                  className="text-[11px] sm:text-xs font-sans font-semibold text-white/80 hover:text-white underline min-h-[44px] flex items-center"
                >
                  Details &amp; Collocations
                </button>
              </div>
            </div>

            {/* Right side: Audio and Mic Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Listen button */}
              <button
                type="button"
                onClick={handleToggle}
                aria-label={`Play audio pronunciation for ${currentWord.label}`}
                className="size-11 sm:size-12 min-h-[44px] min-w-[44px] rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white group"
              >
                <Volume2 className={`size-5 sm:size-6 ${isPlaying ? "animate-pulse" : ""}`} />
              </button>

              {/* Microphone Speaking Practice Button */}
              {speechStatus !== "unsupported" && (
                <button
                  type="button"
                  onClick={() => (isListening ? stopListening() : listen(currentWord.label))}
                  aria-label={
                    isListening ? "Stop recording speech" : `Practice speaking ${currentWord.label}`
                  }
                  className={`size-11 sm:size-12 min-h-[44px] min-w-[44px] rounded-full transition-all flex items-center justify-center shadow-lg focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-white group ${
                    speechSuccess
                      ? "bg-wp-green text-wp-text-on-green scale-105"
                      : isListening
                        ? "bg-wp-rose text-white animate-pulse"
                        : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  }`}
                >
                  {speechSuccess ? (
                    <CheckCircle2 className="size-5 sm:size-6" />
                  ) : isListening ? (
                    <MicOff className="size-5 sm:size-6" />
                  ) : (
                    <Mic className="size-5 sm:size-6" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real-Time Speech Feedback Banner (Compact) */}
        {speechStatus === "listening" && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 animate-pulse shrink-0">
            <Mic className="size-3.5 text-primary" />
            <span className="font-sans text-xs font-bold text-primary">
              Listening... Say &ldquo;{currentWord.label}&rdquo; clearly!
            </span>
          </div>
        )}

        {speechSuccess && (
          <div className="bg-wp-green/10 border border-wp-green/30 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 shrink-0">
            <CheckCircle2 className="size-3.5 text-wp-green" />
            <span className="font-sans text-xs font-bold text-wp-green">
              Excellent pronunciation! Word recognized. 🎉
            </span>
          </div>
        )}

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

      <WordInspectorModal
        word={inspectedWord}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </ExerciseShell>
  );
});

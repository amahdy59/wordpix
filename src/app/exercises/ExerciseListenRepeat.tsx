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

  const handleToggle = () => {
    if (isPlaying) stop();
    else playWord();
  };

  return (
    <ExerciseShell
      step={step}
      title="Pronunciation & Audio Drill"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
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

      <div className="relative flex flex-col gap-4 sm:gap-6 w-full max-w-2xl mx-auto h-full min-h-0 justify-center">
        {/* Compact Word Selector Grid (No text, tight bounding box) */}
        <div
          className="flex justify-center gap-2 sm:gap-3"
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
        <div className="w-full relative rounded-2xl overflow-hidden border border-border shadow-wp-lg bg-muted shrink-0 aspect-[4/3] sm:aspect-[16/9]">
          <WordImage word={currentWord} className="w-full h-full absolute inset-0 object-cover" />
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

        {/* Word Info, Audio & Speech Production */}
        <div className="flex flex-col items-center justify-center gap-3 mt-1 mb-2">
          <div className="flex items-center justify-center gap-4 sm:gap-5 flex-wrap text-center">
            {/* Audio Listen Button */}
            <button
              type="button"
              onClick={handleToggle}
              aria-label={`Play audio pronunciation for ${currentWord.label}`}
              className="size-14 sm:size-16 rounded-full bg-primary transition-transform text-primary-foreground flex items-center justify-center shadow-wp-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary group hover:scale-105"
            >
              <Volume2 className={`size-6 sm:size-7 ${isPlaying ? "animate-pulse" : ""}`} />
            </button>

            {/* Microphone Speaking Practice Button */}
            {speechStatus !== "unsupported" && (
              <button
                type="button"
                onClick={() => (isListening ? stopListening() : listen(currentWord.label))}
                aria-label={
                  isListening ? "Stop recording speech" : `Practice speaking ${currentWord.label}`
                }
                className={`size-14 sm:size-16 rounded-full transition-all flex items-center justify-center shadow-wp-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary group ${
                  speechSuccess
                    ? "bg-wp-green text-wp-text-on-green scale-105"
                    : isListening
                      ? "bg-wp-rose text-white animate-pulse"
                      : "bg-secondary text-foreground hover:bg-muted border border-border"
                }`}
              >
                {speechSuccess ? (
                  <CheckCircle2 className="size-6 sm:size-7" />
                ) : isListening ? (
                  <MicOff className="size-6 sm:size-7" />
                ) : (
                  <Mic className="size-6 sm:size-7 text-primary" />
                )}
              </button>
            )}

            {/* Word Label, Phonetics & Details */}
            <div className="flex flex-col items-start sm:items-center">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="font-sans font-black text-foreground text-3xl sm:text-4xl lg:text-5xl">
                  {currentWord.label}
                </span>
                <span className="font-sans font-medium text-muted-foreground text-base sm:text-xl">
                  /{currentWord.phonetic.replace(/^\/|\/$/g, "")}/
                </span>
                <button
                  type="button"
                  onClick={() => setInspectedWord(currentWord)}
                  aria-label={`Inspect full dictionary entry for ${currentWord.label}`}
                  className="size-9 rounded-xl bg-secondary text-muted-foreground hover:text-foreground border border-border flex items-center justify-center transition-colors ms-1"
                >
                  <Info className="size-4" />
                </button>
              </div>

              {/* Arabic Meaning & Collocation hint */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="font-arabic font-bold text-primary text-base sm:text-lg"
                  dir="rtl"
                  lang="ar"
                >
                  {getLexiconEntry(currentWord.id, currentWord.label).arabic}
                </span>
                <span className="text-xs text-muted-foreground font-sans">·</span>
                <button
                  type="button"
                  onClick={() => setInspectedWord(currentWord)}
                  className="text-xs font-sans font-semibold text-muted-foreground hover:text-primary underline"
                >
                  View Details &amp; Collocations
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Speech Feedback Banner */}
          {speechStatus === "listening" && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl px-4 py-2 flex items-center gap-2 animate-pulse">
              <Mic className="size-4 text-primary" />
              <span className="font-sans text-xs font-bold text-primary">
                Listening... Say &ldquo;{currentWord.label}&rdquo; clearly into your mic!
              </span>
            </div>
          )}

          {speechSuccess && (
            <div className="bg-wp-green/10 border border-wp-green/30 rounded-2xl px-4 py-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-wp-green" />
              <span className="font-sans text-xs font-bold text-wp-green">
                Excellent pronunciation! Word recognized. 🎉
              </span>
            </div>
          )}
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

      <WordInspectorModal
        word={inspectedWord}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </ExerciseShell>
  );
});

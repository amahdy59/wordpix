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
  ChevronRight,
  ChevronLeft,
  Mic,
  MicOff,
  CheckCircle2,
  BookOpen,
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
    audioLevel,
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

  // Touch swipe gesture support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0 && activeWordIndex < words.length - 1) {
        handleSelectWordIndex(activeWordIndex + 1);
      } else if (diff > 0 && activeWordIndex > 0) {
        handleSelectWordIndex(activeWordIndex - 1);
      }
    }
    touchStartX.current = null;
  };

  const lexiconEntry = getLexiconEntry(currentWord.id, currentWord.label);

  return (
    <ExerciseShell
      step={step}
      title="Vocabulary Flashcards"
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
          <div className="hidden sm:flex w-full items-center text-xs font-sans font-semibold text-muted-foreground px-1 mt-1">
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

        {/* Main Flashcard Container with Swipe Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full flex flex-col gap-3.5 bg-wp-card border border-border rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-wp-md"
        >
          {/* Image Container with Floating Chevron Navigation Arrows */}
          <div className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden border border-border/70 bg-muted shrink-0 aspect-[4/3] sm:aspect-[16/10] max-h-[36dvh] sm:max-h-[42dvh]">
            <WordImage
              word={currentWord}
              className="w-full h-full absolute inset-0 object-cover"
              loading="eager"
              fetchPriority="high"
            />

            {/* Left Floating Chevron Navigation Arrow */}
            <button
              type="button"
              disabled={activeWordIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectWordIndex(activeWordIndex - 1);
              }}
              className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 size-10 sm:size-12 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white z-20 shadow-md cursor-pointer"
              aria-label="Previous word"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Right Floating Chevron Navigation Arrow */}
            <button
              type="button"
              disabled={activeWordIndex === words.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectWordIndex(activeWordIndex + 1);
              }}
              className="absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 size-10 sm:size-12 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white z-20 shadow-md cursor-pointer"
              aria-label="Next word"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Dedicated Word Info & Actions Section Below Image */}
          <div className="flex flex-col gap-3">
            {/* Word Name, Phonetic, and Arabic Meaning */}
            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap border-b border-border/60 pb-3">
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="font-sans font-black text-foreground text-2xl sm:text-3xl leading-tight capitalize">
                    {currentWord.label}
                  </h2>
                  <span className="font-sans font-medium text-muted-foreground text-xs sm:text-sm font-mono">
                    /
                    {lexiconEntry.phonetic
                      ? lexiconEntry.phonetic.replace(/^\/|\/$/g, "")
                      : currentWord.phonetic.replace(/^\/|\/$/g, "")}
                    /
                  </span>
                </div>
                <p
                  className="font-arabic font-bold text-wp-amber text-base sm:text-lg mt-0.5"
                  dir="rtl"
                  lang="ar"
                >
                  {lexiconEntry.arabic}
                </p>
              </div>

              {/* Action Buttons: Listen & Speak */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Listen button */}
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-label={`Play audio pronunciation for ${currentWord.label}`}
                  className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer group"
                >
                  <Volume2 className={`size-5 ${isPlaying ? "motion-safe:animate-pulse" : ""}`} />
                  <span>{isPlaying ? "Playing..." : "Listen"}</span>
                </button>

                {/* Microphone Practice Button */}
                {speechStatus !== "unsupported" && (
                  <button
                    type="button"
                    onClick={() => (isListening ? stopListening() : listen(currentWord.label))}
                    aria-label={
                      isListening
                        ? "Stop recording speech"
                        : `Practice speaking ${currentWord.label}`
                    }
                    className={`size-11 min-h-[44px] min-w-[44px] rounded-xl transition-all flex items-center justify-center border shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer group ${
                      speechSuccess
                        ? "bg-wp-green text-wp-text-on-green border-wp-green scale-105"
                        : isListening
                          ? "bg-wp-rose text-white border-wp-rose motion-safe:animate-pulse"
                          : "bg-secondary text-foreground hover:bg-secondary/80 border-border"
                    }`}
                  >
                    {speechSuccess ? (
                      <CheckCircle2 className="size-5" />
                    ) : isListening ? (
                      <MicOff className="size-5" />
                    ) : (
                      <Mic className="size-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* View Full Details Button */}
            <button
              type="button"
              onClick={() => setInspectedWord(currentWord)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 min-h-[44px] rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs sm:text-sm font-sans font-semibold border border-border hover:border-primary/40 active:scale-[0.99] transition-all cursor-pointer"
            >
              <BookOpen className="size-4 text-primary" />
              <span>View Word Details, Collocations & Examples</span>
            </button>
          </div>
        </div>

        {/* Real-Time Speech Feedback Banner with Live Waveform */}
        {speechStatus === "listening" && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Mic className="size-4 text-primary animate-bounce" />
              <span className="font-sans text-xs font-bold text-primary">
                Listening... Say &ldquo;{currentWord.label}&rdquo; clearly!
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[0.5, 1.0, 0.7, 1.2, 0.6].map((m, i) => {
                const h = Math.max(6, Math.min(20, Math.round((audioLevel * m) / 5 + 6)));
                return (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-primary rounded-full transition-all duration-75"
                  />
                );
              })}
            </div>
          </div>
        )}

        {attempt && attempt.matched && (
          <div className="bg-wp-green/10 border border-wp-green/30 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-wp-green" />
              <span className="font-sans text-xs font-bold text-wp-green">
                Pronunciation Recognized! 🎉
              </span>
            </div>
            {attempt.accuracy > 0 && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-wp-green text-white">
                {attempt.accuracy}% Match · {attempt.grade.toUpperCase()}
              </span>
            )}
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

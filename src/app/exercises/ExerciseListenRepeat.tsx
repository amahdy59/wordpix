import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import { resolveGroup, type VocabularyItem } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { useAudio } from "../shared/useAudio";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import {
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
import { getLexiconEntry, hasArabicGloss } from "../data/lexiconDictionary";
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
  const { accessibility } = useAccessibility();
  const speed = accessibility.speechRate;
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({ lang: "en-US", rate: speed });

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
    reset: resetSpeech,
  } = useSpeechRecognition({ lang: "en-US" });

  const playWord = useCallback(() => speak(currentWord.label), [speak, currentWord.label]);

  useEffect(() => () => stop(), [stop]);

  const handleSelectWordIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.min(Math.max(index, 0), words.length - 1);
      if (nextIndex === activeWordIndex) return;
      stop();
      resetSpeech();
      setActiveWordIndex(nextIndex);
    },
    [activeWordIndex, resetSpeech, stop, words.length]
  );
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
    else {
      if (isListening) stopListening();
      playWord();
    }
  }, [isPlaying, stop, playWord, isListening, stopListening]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        inspectedWord ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        document.querySelector('[role="dialog"][aria-modal="true"]') ||
        (e.target instanceof HTMLElement &&
          (e.target.isContentEditable || e.target.tagName === "SELECT")) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const isRtl = document.documentElement.dir === "rtl";
      if (e.key === (isRtl ? "ArrowRight" : "ArrowLeft")) {
        e.preventDefault();
        handleSelectWordIndex(activeWordIndex - 1);
      } else if (e.key === (isRtl ? "ArrowLeft" : "ArrowRight")) {
        e.preventDefault();
        handleSelectWordIndex(activeWordIndex + 1);
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
  }, [activeWordIndex, handleSelectWordIndex, inspectedWord, handleToggle]);

  // Touch swipe gesture support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const horizontal = e.changedTouches[0].clientX - touchStartX.current;
    const vertical = e.changedTouches[0].clientY - touchStartY.current;
    const diff = document.documentElement.dir === "rtl" ? -horizontal : horizontal;
    if (Math.abs(diff) > 40 && Math.abs(horizontal) > Math.abs(vertical)) {
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
      layout="media"
      step={step}
      title="Listen & repeat"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={{ current: activeWordIndex + 1, total: words.length }}
      progressLabel="Word"
      subtitle={
        <>
          <span>{group.name}</span>
          <span className="text-foreground font-semibold" aria-hidden="true">
            {activeWordIndex + 1} of {words.length}
          </span>
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Previous word"
            disabled={activeWordIndex === 0}
            onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
            className="min-h-[48px] min-w-[48px] sm:px-5 rounded-xl border border-border bg-wp-card text-foreground font-sans font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLastWord) {
                stop();
                resetSpeech();
                dispatch({ type: "LESSON_NEXT" });
              } else {
                handleSelectWordIndex(activeWordIndex + 1);
              }
            }}
            className="min-h-[48px] px-5 flex-1 sm:flex-none sm:min-w-56 rounded-xl bg-primary text-primary-foreground font-sans font-bold flex items-center justify-center gap-2 shadow-wp-xs active:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>{isLastWord ? "Continue to sentences" : "Next word"}</span>
            <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>
      }
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying
          ? `Playing ${currentWord.label}`
          : `Word ${activeWordIndex + 1} of ${words.length}: ${currentWord.label}`}
      </div>

      <div className="relative flex flex-col gap-4 w-full min-h-0">
        {/* Direct word selection is useful on larger screens but duplicates
            progress and navigation on a phone. */}
        <nav
          className="hidden lg:flex gap-2 shrink-0 overflow-x-auto py-1 px-1 mx-auto max-w-full"
          aria-label="Group vocabulary words"
        >
          {words.map((w, index) => {
            const isSelected = index === activeWordIndex;
            return (
              <button
                key={w.id}
                type="button"
                aria-current={isSelected ? "true" : undefined}
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
        </nav>

        {/* Main Flashcard Container with Swipe Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 lg:gap-0 bg-wp-card border border-border rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-wp-md"
        >
          {/* The picture is the learning material, so it stays unobstructed. */}
          <div className="w-full min-w-0 relative rounded-xl sm:rounded-2xl overflow-hidden bg-muted aspect-[4/3] max-h-[32dvh] sm:max-h-[38dvh] lg:aspect-auto lg:h-[clamp(20rem,58dvh,38rem)] lg:max-h-none">
            <WordImage
              word={currentWord}
              className="w-full h-full absolute inset-0 object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Dedicated Word Info & Actions Section Below Image */}
          <div className="flex flex-col justify-center gap-4 min-w-0 px-1 pb-1 sm:px-3 lg:px-8 xl:px-12 lg:py-6">
            {/* Word Name, Phonetic, and Arabic Meaning */}
            <div className="flex flex-col gap-5 lg:gap-7">
              <div className="flex flex-col min-w-0">
                <div className="flex flex-col gap-1.5 lg:gap-3" lang="en" dir="ltr">
                  <h2 className="font-sans font-black text-foreground text-3xl sm:text-4xl xl:text-5xl leading-tight capitalize break-words">
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
                {/* Dropped entirely when there is no gloss: an English string
                    in here would be laid out right-to-left and announced as
                    Arabic. */}
                {hasArabicGloss(lexiconEntry) && (
                  <p
                    className="font-arabic font-bold text-foreground text-lg sm:text-xl mt-2 lg:mt-4 text-start self-start"
                    dir="rtl"
                    lang="ar"
                  >
                    {lexiconEntry.arabic}
                  </p>
                )}
              </div>

              {/* Action Buttons: Listen & Speak */}
              <div
                className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3"
                aria-label="Pronunciation practice"
              >
                {/* Listen button */}
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-pressed={isPlaying}
                  aria-label={`${isPlaying ? "Stop" : "Play"} audio pronunciation for ${currentWord.label}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
                >
                  <Volume2
                    className={`size-5 ${isPlaying ? "motion-safe:animate-pulse" : ""}`}
                    aria-hidden
                  />
                  <span>{isPlaying ? "Stop audio" : "Listen"}</span>
                </button>

                {/* Microphone Practice Button */}
                {speechStatus !== "unsupported" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening) stopListening();
                      else {
                        stop();
                        listen(currentWord.label);
                      }
                    }}
                    aria-label={
                      isListening
                        ? "Stop recording speech"
                        : `Practice speaking ${currentWord.label}`
                    }
                    className={`min-h-[48px] px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border font-sans font-bold text-sm shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer ${
                      attempt?.matched
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : isListening
                          ? "bg-wp-rose text-white border-wp-rose motion-safe:animate-pulse"
                          : "bg-wp-card text-foreground hover:bg-secondary border-border"
                    }`}
                  >
                    {attempt?.matched ? (
                      <CheckCircle2 className="size-5" aria-hidden />
                    ) : isListening ? (
                      <MicOff className="size-5" aria-hidden />
                    ) : (
                      <Mic className="size-5" aria-hidden />
                    )}
                    <span>
                      {attempt?.matched
                        ? "Recognized"
                        : isListening
                          ? "Stop listening"
                          : "Practice speaking"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {speechStatus !== "unsupported" && !attempt && speechStatus === "idle" && (
              <p className="font-sans text-xs text-muted-foreground">
                Speaking is optional. Your microphone starts only when you choose Practice speaking.
              </p>
            )}

            <button
              type="button"
              onClick={() => setInspectedWord(currentWord)}
              className="w-full flex items-center justify-start gap-2 py-3 px-4 min-h-[48px] rounded-xl bg-secondary border border-border text-primary text-xs sm:text-sm font-sans font-semibold hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
            >
              <BookOpen className="size-4" aria-hidden />
              <span>Word details</span>
            </button>
          </div>
        </div>

        {/* Real-Time Speech Feedback Banner with Live Waveform */}
        {speechStatus === "listening" && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Mic className="size-4 text-primary motion-safe:animate-bounce" aria-hidden />
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

        {attempt?.matched && (
          <div
            role="status"
            className="bg-wp-green/10 border border-wp-green/30 rounded-xl px-3 py-2 flex items-center gap-2 shrink-0"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-wp-green" aria-hidden />
              <span className="font-sans text-xs font-bold text-wp-green">
                Word recognized. Nice work!
              </span>
            </div>
          </div>
        )}

        {attempt && !attempt.matched && (
          <div
            role="status"
            className="bg-wp-amber/10 border border-wp-amber/30 rounded-xl px-3 py-2"
          >
            <p className="font-sans text-xs font-bold text-wp-amber">
              Try again—say &ldquo;{currentWord.label}&rdquo; slowly, or continue without speaking.
            </p>
          </div>
        )}

        {speechStatus === "denied" && (
          <p role="status" className="font-sans text-muted-foreground text-xs text-center">
            Microphone access is blocked. You can continue without speaking.
          </p>
        )}
        {speechStatus === "no-speech" && (
          <p role="status" className="font-sans text-muted-foreground text-xs text-center">
            I couldn&rsquo;t hear you. Try again or continue without speaking.
          </p>
        )}
        {speechStatus === "error" && (
          <p role="status" className="font-sans text-muted-foreground text-xs text-center">
            Speaking practice is unavailable right now. You can continue normally.
          </p>
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

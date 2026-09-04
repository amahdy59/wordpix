import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import { resolveGroup, resolveUnitForLesson, type VocabularyItem } from "../data/lessons";
import { ExitConfirmModal } from "../shared/ExitConfirmModal";
import { useAudio } from "../shared/useAudio";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { ChevronRight, ChevronLeft, Mic, CheckCircle2, BookOpen, X } from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import { useSpeechRecognition } from "../shared/useSpeechRecognition";
import { getLexiconEntry, hasArabicGloss } from "../data/lexiconDictionary";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import { WordDetailsContent } from "../shared/WordDetailsContent";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseListenRepeat = memo(function ExerciseListenRepeat({
  step: _step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);
  const [desktopDetails, setDesktopDetails] = useState(false);
  const detailsTriggerRef = useRef<HTMLButtonElement>(null);
  const detailsCloseRef = useRef<HTMLButtonElement>(null);
  const [bilingual, setBilingual] = useState(true);
  const [continuous, setContinuous] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unit = resolveUnitForLesson(lessonId);
  const { accessibility } = useAccessibility();
  const speed = accessibility.speechRate;
  const { speak, stop, isPlaying, isSupported, isError } = useAudio({
    lang: "en-US",
    rate: speed,
    onError: () => {
      setPlaybackError(true);
      setContinuous(false);
    },
    onEnded: () => {
      if (!continuous) return;
      if (activeWordIndex >= words.length - 1) {
        setContinuous(false);
        return;
      }
      advanceTimer.current = setTimeout(
        () => setActiveWordIndex((index) => Math.min(index + 1, words.length - 1)),
        1200
      );
    },
  });

  const currentWord = words[activeWordIndex] || words[0];
  const isLastWord = activeWordIndex === words.length - 1;
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktopDetails(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (desktopDetails && inspectedWord) detailsCloseRef.current?.focus();
  }, [desktopDetails, inspectedWord]);
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

  const playWord = useCallback(() => {
    setPlaybackError(false);
    speak(currentWord.label);
  }, [speak, currentWord.label]);

  useEffect(() => {
    if (continuous) speak(currentWord.label);
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      stop();
    };
  }, [continuous, activeWordIndex, currentWord.label, speak, stop]);
  const pausePlayback = () => {
    setContinuous(false);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    stop();
  };
  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) {
        setContinuous(false);
        stop();
      }
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [stop]);

  const handleSelectWordIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.min(Math.max(index, 0), words.length - 1);
      if (nextIndex === activeWordIndex) return;
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      stop();
      resetSpeech();
      setPlaybackError(false);
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
    if (isPlaying || continuous) {
      setContinuous(false);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      stop();
    } else {
      if (isListening) stopListening();
      playWord();
    }
  }, [isPlaying, continuous, stop, playWord, isListening, stopListening]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inspectedWord && e.key === "Escape") {
        e.preventDefault();
        setInspectedWord(null);
        requestAnimationFrame(() => detailsTriggerRef.current?.focus());
        return;
      }
      if (
        inspectedWord ||
        (e.target instanceof HTMLElement && !!e.target.closest("[data-listen-selector]")) ||
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

  const modeSelector = (
    <ListenSelector
      label="Learning mode"
      options={["Bilingual", "Immersion"]}
      selected={bilingual ? "Bilingual" : "Immersion"}
      onChange={(value) => setBilingual(value === "Bilingual")}
    />
  );
  const lexiconEntry = getLexiconEntry(currentWord.id, currentWord.label);

  return (
    <div className="h-dvh bg-background flex flex-col overflow-hidden">
      <header className="shrink-0 p-4 lg:px-8 border-b border-border">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <button
            type="button"
            onClick={() => {
              pausePlayback();
              resetSpeech();
              dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id });
            }}
            aria-label={`Back to ${unit.name}`}
            className="justify-self-start inline-flex items-center gap-2 min-h-11 min-w-11 rounded-xl px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
            <span className="hidden lg:inline">Back to {unit.name.replace(/^The /, "")}</span>
          </button>
          <h1 className="font-bold text-foreground text-center">Listen &amp; repeat</h1>
          <div className="justify-self-end flex items-center gap-4">
            <div className="hidden lg:block">{modeSelector}</div>
            <button
              type="button"
              onClick={() => {
                pausePlayback();
                resetSpeech();
                setShowExit(true);
              }}
              className="min-h-11 min-w-11 px-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Exit
            </button>
          </div>
        </div>
        <div className="lg:hidden mt-3">{modeSelector}</div>
        <div className="flex justify-between gap-4 mt-4 text-sm font-semibold">
          <span>{unit.name}</span>
          <span>
            {activeWordIndex + 1} of {words.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Word progress"
          aria-valuemin={0}
          aria-valuemax={words.length}
          aria-valuenow={activeWordIndex + 1}
          aria-valuetext={`Word ${activeWordIndex + 1} of ${words.length}`}
          className="h-1.5 bg-primary/20 rounded-full mt-3 overflow-hidden"
        >
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${((activeWordIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </header>
      <section
        aria-label={`${group.name} Listen & repeat exercise`}
        className="flex-1 min-h-0 overflow-y-auto p-4 lg:px-20 lg:py-8 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPlaying
            ? `Playing ${currentWord.label}`
            : `Word ${activeWordIndex + 1} of ${words.length}: ${currentWord.label}`}
        </div>

        <div className="relative flex flex-col gap-4 w-full max-w-[1440px] mx-auto min-h-0">
          {/* Direct word selection is useful on larger screens but duplicates
            progress and navigation on a phone. */}
          {/* Main Flashcard Container with Swipe Support */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`w-full min-w-0 grid grid-cols-1 ${inspectedWord && desktopDetails ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.9fr)_minmax(19rem,0.9fr)]" : "lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"} gap-4 lg:gap-0 bg-wp-card border border-border rounded-2xl sm:rounded-3xl p-4 shadow-wp-md relative`}
          >
            <button
              type="button"
              aria-label="Previous word"
              disabled={activeWordIndex === 0}
              onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
              className="absolute z-10 start-6 lg:-start-14 top-[calc(clamp(10rem,26dvh,22rem)/2+1rem)] lg:top-1/2 -translate-y-1/2 size-11 rounded-full bg-wp-card border border-border text-primary shadow-md grid place-items-center disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={isLastWord ? "Continue to sentences" : "Next word"}
              onClick={() => {
                if (isLastWord) {
                  pausePlayback();
                  resetSpeech();
                  dispatch({ type: "LESSON_NEXT" });
                } else handleSelectWordIndex(activeWordIndex + 1);
              }}
              className="absolute z-10 end-6 lg:-end-14 top-[calc(clamp(10rem,26dvh,22rem)/2+1rem)] lg:top-1/2 -translate-y-1/2 size-11 rounded-full bg-wp-card border border-border text-primary shadow-md grid place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            {/* The picture is the learning material, so it stays unobstructed. */}
            <div className="w-full min-w-0 relative rounded-xl sm:rounded-2xl overflow-hidden bg-muted h-[clamp(10rem,26dvh,22rem)] lg:h-auto lg:min-h-[32rem]">
              <WordImage
                word={currentWord}
                className="w-full h-full absolute inset-0 object-cover"

                loading="eager"
                fetchPriority="high"
              />
            </div>

            {/* Dedicated Word Info & Actions Section Below Image */}
            <div className="flex flex-col justify-center gap-4 min-w-0 lg:ps-6 lg:py-4">
              {/* Word Name, Phonetic, and Arabic Meaning */}
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-col gap-1.5 lg:gap-2" lang="en" dir="ltr">
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
                  {bilingual && hasArabicGloss(lexiconEntry) && (
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
                  className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-1 gap-3"
                  aria-label="Pronunciation practice"
                >
                  {/* Listen button */}
                  <button
                    type="button"
                    onClick={handleToggle}
                    aria-pressed={isPlaying || continuous}
                    aria-label={`${isPlaying || continuous ? "Stop" : "Play"} audio pronunciation for ${currentWord.label}`}
                    className="flex items-center justify-center gap-2 px-3 py-2 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
                  >
                    <span>{isPlaying || continuous ? "Stop audio" : "Listen"}</span>
                  </button>

                  {/* Microphone Practice Button */}
                  {
                    <button
                      type="button"
                      onClick={() => {
                        if (isListening) stopListening();
                        else {
                          pausePlayback();
                          listen(currentWord.label);
                        }
                      }}
                      disabled={speechStatus === "unsupported"}
                      aria-label={
                        isListening
                          ? "Stop recording speech"
                          : `Practice speaking ${currentWord.label}`
                      }
                      className={`min-h-[48px] px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-2 border font-sans font-bold text-sm shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer ${
                        attempt?.matched
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : isListening
                            ? "bg-wp-rose text-white border-wp-rose motion-safe:animate-pulse"
                            : "bg-wp-card text-foreground hover:bg-secondary border-border"
                      }`}
                    >
                      <span>
                        {attempt?.matched
                          ? "Recognized"
                          : isListening
                            ? "Stop listening"
                            : "Practice speaking"}
                      </span>
                    </button>
                  }
                </div>
              </div>

              {!attempt && speechStatus === "idle" && (
                <p className="font-sans text-xs text-muted-foreground">
                  Speaking is optional. Your microphone starts only when you choose Practice
                  speaking.
                </p>
              )}

              <div className="mt-2">
                <p className="text-sm font-semibold mb-2">Playback</p>
                <ListenSelector
                  label="Playback"
                  options={["Manual", "Continuous"]}
                  selected={continuous ? "Continuous" : "Manual"}
                  onChange={(value) => {
                    resetSpeech();
                    if (value === "Manual") pausePlayback();
                    else {
                      setPlaybackError(false);
                      setContinuous(true);
                    }
                  }}
                />
              </div>
              <button
                ref={detailsTriggerRef}
                type="button"
                onClick={() => {
                  pausePlayback();
                  resetSpeech();
                  setInspectedWord(currentWord);
                }}
                aria-haspopup={desktopDetails ? undefined : "dialog"}
                aria-controls={desktopDetails ? "word-details-panel" : undefined}
                aria-expanded={!!inspectedWord}
                className="w-full flex items-center justify-start gap-2 py-3 px-4 min-h-[48px] rounded-xl bg-secondary border border-border text-primary text-xs sm:text-sm font-sans font-semibold hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
              >
                <BookOpen className="size-4" aria-hidden />
                <span>Word details</span>
                <ChevronRight className="size-5 ms-auto" aria-hidden />
              </button>
            </div>

            {inspectedWord && desktopDetails && (
              <aside
                id="word-details-panel"
                aria-label={`Details for ${inspectedWord.label}`}
                className="hidden lg:flex min-h-0 max-h-[32rem] ms-4 border-s border-border bg-muted/20 rounded-e-2xl flex-col overflow-hidden"
              >
                <div className="shrink-0 flex items-center justify-between gap-3 p-4 border-b border-border bg-wp-card">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      Word details
                    </p>
                    <h2 className="font-black text-xl text-foreground truncate">
                      {inspectedWord.label}
                    </h2>
                  </div>
                  <button
                    ref={detailsCloseRef}
                    type="button"
                    onClick={() => {
                      setInspectedWord(null);
                      requestAnimationFrame(() => detailsTriggerRef.current?.focus());
                    }}
                    aria-label="Close word details"
                    className="size-11 grid place-items-center rounded-xl border border-border text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>
                <WordDetailsContent
                  word={inspectedWord}
                  bilingual={bilingual}
                  className="bg-wp-card"
                />
              </aside>
            )}
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
                Try again—say &ldquo;{currentWord.label}&rdquo; slowly, or continue without
                speaking.
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

          {speechStatus === "unsupported" && (
            <p className="text-sm text-muted-foreground" role="status">
              Speaking practice is not supported in this browser. You can listen and repeat aloud.
            </p>
          )}
          {!isSupported && (
            <p className="font-sans text-muted-foreground text-xs text-center">
              Speech synthesis is not supported in this browser.
            </p>
          )}
          {(isError || playbackError) && (
            <p className="font-sans text-wp-rose text-xs text-center">
              Audio playback failed. Choose Listen to try again.
            </p>
          )}
        </div>

        <div
          aria-label="Keyboard shortcuts"
          className="hidden lg:flex justify-center items-center gap-5 mt-5 text-sm text-muted-foreground"
        >
          <span className="font-semibold text-foreground">Keyboard shortcuts</span>
          <span className="flex items-center gap-2">
            <kbd className="min-w-9 h-8 px-2 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              ←
            </kbd>
            <kbd className="min-w-9 h-8 px-2 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              →
            </kbd>
            Change word
          </span>
          <span className="flex items-center gap-2">
            <kbd className="h-8 px-3 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              Space
            </kbd>
            Listen or pause
          </span>
          <span className="flex items-center gap-2">
            <kbd className="h-8 px-3 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              Esc
            </kbd>
            Close details
          </span>
        </div>
      </section>
      <ExitConfirmModal
        isOpen={showExit}
        onCancel={() => setShowExit(false)}
        onConfirm={() => dispatch({ type: "GO", to: "home" })}
      />
      <WordInspectorModal
        lessonPanel
        bilingual={bilingual}
        word={inspectedWord}
        isOpen={!!inspectedWord && !desktopDetails}
        onClose={() => setInspectedWord(null)}
      />
    </div>
  );
});

function ListenSelector({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      data-listen-selector
      className="flex rounded-xl ring-1 ring-inset ring-border bg-wp-card"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={selected === option}
          onClick={() => onChange(option)}
          className={`flex-1 min-h-11 px-4 rounded-lg text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected === option ? "bg-secondary text-primary ring-1 ring-inset ring-primary/30" : "text-muted-foreground"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

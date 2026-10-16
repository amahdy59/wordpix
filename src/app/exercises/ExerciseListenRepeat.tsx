import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Action } from "../types";
import { resolveGroup, resolveUnitForLesson, type VocabularyItem } from "../data/courseCatalog";
import { ExitConfirmModal } from "../shared/ExitConfirmModal";
import { useAudio } from "../shared/useAudio";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { ChevronRight, ChevronLeft, BookOpen, X, Volume2 } from "lucide-react";
import { WordImage } from "../shared/WordImage";
import { usePrefetchImage } from "../shared/usePrefetchImage";
import type { LexiconEntry } from "../data/lexiconDictionary";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import { WordDetailsContent } from "../shared/WordDetailsContent";
import { useI18n } from "../context/I18nContext";
import { useLexicon } from "../shared/useLexicon";
import { loadLexicon } from "../data/lexiconLoader";
import { getAuthoredWord } from "./content/authoredLessonContent";

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
  const { t } = useI18n();
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [desktopDetails, setDesktopDetails] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const detailsTriggerRef = useRef<HTMLButtonElement>(null);
  const detailsCloseRef = useRef<HTMLButtonElement>(null);
  const [bilingual, setBilingual] = useState(true);
  const [continuous, setContinuous] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const { lexicon, lexiconFailed, retryLexicon } = useLexicon(
    words.slice(activeWordIndex, activeWordIndex + 1).map((word) => word.id)
  );

  // Warm only the next card. A speculative failure never blocks the current one.
  useEffect(() => {
    const next = words[activeWordIndex + 1];
    if (next) void loadLexicon([next.id]).catch(() => undefined);
  }, [words, activeWordIndex]);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unit = resolveUnitForLesson(lessonId);
  const { accessibility } = useAccessibility();
  const speed = accessibility.speechRate;

  const currentWord = words[activeWordIndex] || words[0];
  const isLastWord = activeWordIndex === words.length - 1;

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
        500
      );
    },
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const update = () => setDesktopDetails(query.matches);
    update();
    const handleChange = () => {
      update();
      setShowDetails(false);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const isDetailsVisible = showDetails;

  usePrefetchImage(isLastWord ? null : words[activeWordIndex + 1]);

  const playWord = useCallback(() => {
    setPlaybackError(false);
    speak(currentWord.label);
  }, [speak, currentWord.label]);

  // Play audio when continuous mode is active or when word changes in continuous mode
  useEffect(() => {
    if (continuous && currentWord?.label) {
      speak(currentWord.label);
    }
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      stop();
    };
  }, [continuous, activeWordIndex, currentWord?.label, speak, stop]);

  const pausePlayback = useCallback(() => {
    setContinuous(false);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    stop();
  }, [stop]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) {
        pausePlayback();
      }
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [pausePlayback]);

  const handleSelectWordIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.min(Math.max(index, 0), words.length - 1);
      if (nextIndex === activeWordIndex) return;
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      stop();
      setPlaybackError(false);
      setActiveWordIndex(nextIndex);
      if (!continuous) {
        const nextWord = words[nextIndex];
        if (nextWord) {
          speak(nextWord.label);
        }
      }
    },
    [activeWordIndex, continuous, speak, stop, words]
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
      pausePlayback();
    } else {
      playWord();
    }
  }, [isPlaying, continuous, pausePlayback, playWord]);

  const handleOpenDetails = useCallback(() => {
    pausePlayback();
    setShowDetails(true);
    if (desktopDetails) {
      requestAnimationFrame(() => detailsCloseRef.current?.focus());
    }
  }, [desktopDetails, pausePlayback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDetailsVisible && e.key === "Escape") {
        e.preventDefault();
        setShowDetails(false);
        requestAnimationFrame(() => detailsTriggerRef.current?.focus());
        return;
      }
      if (
        (isDetailsVisible && !desktopDetails) ||
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
  }, [activeWordIndex, handleSelectWordIndex, isDetailsVisible, desktopDetails, handleToggle]);

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

  const bilingualLabel = t("listenRepeat.bilingual");
  const immersionLabel = t("listenRepeat.immersion");
  const manualLabel = t("listenRepeat.manual");
  const continuousLabel = t("listenRepeat.continuous");
  const modeSelector = (
    <ListenSelector
      label={t("listenRepeat.learningMode")}
      options={[bilingualLabel, immersionLabel]}
      selected={bilingual ? bilingualLabel : immersionLabel}
      onChange={(value) => setBilingual(value === bilingualLabel)}
    />
  );
  const playbackSelector = (
    <ListenSelector
      label={t("listenRepeat.playback")}
      options={[manualLabel, continuousLabel]}
      selected={continuous ? continuousLabel : manualLabel}
      onChange={(value) => {
        if (value === manualLabel) {
          pausePlayback();
        } else {
          setPlaybackError(false);
          setContinuous(true);
          if (!isPlaying) {
            speak(currentWord.label);
          }
        }
      }}
    />
  );
  const lexiconEntry: LexiconEntry | undefined = lexicon?.getLexiconEntry(
    currentWord.id,
    currentWord.label,
    unit.id
  );
  const authoredWord = getAuthoredWord(currentWord.id);
  const arabicTranslation =
    authoredWord?.arabic ?? currentWord.arabicTranslation ?? lexiconEntry?.arabic;
  // Before the dictionary arrives, unit-provided or authored translations render as-is;
  // the Arabic-script check applies once it is available.
  const showArabicTranslation =
    authoredWord?.arabic !== undefined
      ? true
      : lexicon !== null
        ? lexicon.hasArabicGloss({ arabic: arabicTranslation ?? "" })
        : currentWord.arabicTranslation !== undefined && currentWord.arabicTranslation !== "";

  return (
    <div className="h-dvh bg-background flex flex-col overflow-hidden">
      <header className="shrink-0 p-4 lg:px-8 border-b border-border">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <button
            type="button"
            onClick={() => {
              pausePlayback();
              dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id });
            }}
            aria-label={t("listenRepeat.backToUnit", { unit: unit.name })}
            className="justify-self-start inline-flex items-center gap-2 min-h-11 min-w-11 rounded-xl px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
            <span className="hidden lg:inline">
              {t("listenRepeat.backToUnit", { unit: unit.name.replace(/^The /, "") })}
            </span>
          </button>
          <h1 className="font-bold text-foreground text-center">{t("listenRepeat.title")}</h1>
          <div className="justify-self-end flex items-center gap-4">
            <div className="hidden lg:block">{modeSelector}</div>
            <button
              type="button"
              onClick={() => {
                pausePlayback();
                setShowExit(true);
              }}
              className="min-h-11 min-w-11 px-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              {t("listenRepeat.exit")}
            </button>
          </div>
        </div>
        <div className="lg:hidden mt-3">{modeSelector}</div>
        <div className="flex justify-between gap-4 mt-4 text-sm font-semibold">
          <span>{unit.name}</span>
          <span>
            {t("exercise.positionOf", {
              current: formatNumber(activeWordIndex + 1, accessibility.numeralSystem),
              total: formatNumber(words.length, accessibility.numeralSystem),
            })}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={t("listenRepeat.wordProgress")}
          aria-valuemin={0}
          aria-valuemax={words.length}
          aria-valuenow={activeWordIndex + 1}
          aria-valuetext={t("listenRepeat.wordProgressText", {
            current: activeWordIndex + 1,
            total: words.length,
          })}
          className="h-1.5 bg-secondary rounded-full mt-3 overflow-hidden"
        >
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${((activeWordIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </header>
      <section
        aria-label={t("listenRepeat.exerciseSection", { group: group.name })}
        className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 lg:px-10 xl:px-16 lg:py-6 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPlaying
            ? t("listenRepeat.playingWord", { word: currentWord.label })
            : t("listenRepeat.wordPosition", {
                current: activeWordIndex + 1,
                total: words.length,
                word: currentWord.label,
              })}
        </div>

        <div className="wp-container-wide relative flex min-h-0 flex-col gap-4">
          {/* Main Flashcard Container with Swipe Support */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`w-full min-w-0 grid grid-cols-1 ${
              desktopDetails && isDetailsVisible
                ? "lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.9fr)_minmax(20rem,1fr)]"
                : "lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"
            } gap-4 lg:gap-0 bg-wp-card border border-border rounded-2xl sm:rounded-3xl p-4 shadow-wp-md relative`}
          >
            <button
              type="button"
              aria-label={t("listenRepeat.previousWord")}
              disabled={activeWordIndex === 0}
              onClick={() => handleSelectWordIndex(activeWordIndex - 1)}
              className="absolute z-10 start-3 sm:start-4 lg:-start-6 xl:-start-7 top-[calc(clamp(14rem,35vw,22rem)/2)] md:top-1/2 -translate-y-1/2 size-11 rounded-full bg-wp-card/95 backdrop-blur-xs border border-border text-primary shadow-md grid place-items-center disabled:opacity-30 disabled:pointer-events-none hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={
                isLastWord ? t("listenRepeat.continueToSentences") : t("listenRepeat.nextWord")
              }
              onClick={() => {
                if (isLastWord) {
                  pausePlayback();
                  dispatch({ type: "LESSON_NEXT" });
                } else {
                  handleSelectWordIndex(activeWordIndex + 1);
                }
              }}
              className="absolute z-10 end-3 sm:end-4 lg:-end-6 xl:-end-7 top-[calc(clamp(14rem,35vw,22rem)/2)] md:top-1/2 -translate-y-1/2 size-11 rounded-full bg-wp-card/95 backdrop-blur-xs border border-border text-primary shadow-md grid place-items-center hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
            >
              <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
            </button>

            {/* Prominent Image: adapts beautifully to mobile, tablet, and wide desktop displays */}
            <div className="w-full min-w-0 relative rounded-xl sm:rounded-2xl overflow-hidden bg-muted aspect-[4/3] min-h-[220px] max-h-[360px] sm:aspect-[16/10] sm:max-h-[400px] md:aspect-auto md:h-full md:min-h-[28rem] lg:min-h-[34rem] xl:min-h-[38rem] max-h-[44rem] shadow-xs">
              <WordImage
                word={currentWord}
                className="w-full h-full absolute inset-0 object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            {/* Dedicated Word Info & Actions Section */}
            <div className="flex flex-col justify-center gap-4 min-w-0 md:ps-6 lg:px-6 lg:py-2">
              {/* Word Name, Phonetic, and Arabic Meaning */}
              <div className="flex flex-col min-w-0">
                <div className="flex flex-col gap-1.5 lg:gap-2" lang="en" dir="ltr">
                  <h2 className="font-sans font-black text-foreground text-3xl sm:text-4xl xl:text-5xl leading-tight capitalize break-words">
                    {currentWord.label}
                  </h2>
                  <span className="font-sans font-medium text-muted-foreground text-xs sm:text-sm font-mono">
                    /
                    {lexiconEntry?.phonetic
                      ? lexiconEntry.phonetic.replace(/^\/|\/$/g, "")
                      : currentWord.phonetic.replace(/^\/|\/$/g, "")}
                    /
                  </span>
                </div>
                {/* Dropped entirely when there is no gloss: an English string
                  in here would be laid out right-to-left and announced as
                  Arabic. */}
                {bilingual && showArabicTranslation && (
                  <p
                    className="font-arabic font-bold text-foreground text-lg sm:text-xl lg:text-2xl mt-2 lg:mt-3 text-start self-start"
                    dir="rtl"
                    lang="ar"
                  >
                    {arabicTranslation}
                  </p>
                )}
                {lexiconFailed && (
                  <div role="alert" className="flex flex-wrap items-center gap-2 mt-2 lg:mt-3">
                    <p className="font-sans text-xs text-muted-foreground">
                      {t("vocabularyPreload.loadErrorDesc")}
                    </p>
                    <button
                      type="button"
                      onClick={retryLexicon}
                      className="min-h-[44px] px-4 rounded-xl bg-secondary border border-border text-primary font-sans font-bold text-xs sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                    >
                      {t("action.tryAgain")}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Listen only */}
              <div className="flex flex-col gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-pressed={isPlaying || continuous}
                  aria-label={
                    isPlaying || continuous
                      ? t("listenRepeat.stopAudioFor", { word: currentWord.label })
                      : t("listenRepeat.playAudioFor", { word: currentWord.label })
                  }
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm sm:text-base shadow-md hover:bg-primary motion-safe:active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                >
                  <Volume2 className="size-5 shrink-0" aria-hidden />
                  <span>
                    {isPlaying || continuous
                      ? t("listenRepeat.stopAudio")
                      : t("listenRepeat.listen")}
                  </span>
                </button>
              </div>

              {/* Playback Mode (Manual / Continuous) */}
              <div className="mt-1">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1.5">
                  {t("listenRepeat.playback")}
                </p>
                {playbackSelector}
              </div>

              {/* Word Details button: always accessible for learner to explore details */}
              <button
                ref={detailsTriggerRef}
                type="button"
                onClick={handleOpenDetails}
                aria-haspopup={desktopDetails ? undefined : "dialog"}
                aria-controls={desktopDetails ? "word-details-panel" : undefined}
                aria-expanded={isDetailsVisible}
                className="w-full flex items-center justify-between gap-2 py-3 px-4 min-h-[48px] rounded-xl bg-secondary border border-border text-primary text-xs sm:text-sm font-sans font-semibold hover:bg-secondary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 shrink-0" aria-hidden />
                  <span>{t("listenRepeat.wordDetails")}</span>
                </div>
                <ChevronRight className="size-5 rtl:rotate-180 text-muted-foreground" aria-hidden />
              </button>
            </div>

            {/* Word Details automatically displayed on big screens */}
            {desktopDetails && isDetailsVisible && (
              <aside
                id="word-details-panel"
                aria-label={t("listenRepeat.detailsFor", { word: currentWord.label })}
                className="hidden xl:flex min-h-0 h-full max-h-[34rem] xl:max-h-[38rem] ms-4 border-s border-border bg-muted/15 rounded-e-2xl sm:rounded-e-3xl flex-col overflow-hidden"
              >
                <div className="shrink-0 flex items-center justify-between gap-3 p-4 border-b border-border bg-wp-card">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      {t("listenRepeat.wordDetails")}
                    </p>
                    <h2 className="font-black text-lg xl:text-xl text-foreground truncate">
                      {currentWord.label}
                    </h2>
                  </div>
                  <button
                    ref={detailsCloseRef}
                    type="button"
                    onClick={() => {
                      setShowDetails(false);
                      requestAnimationFrame(() => detailsTriggerRef.current?.focus());
                    }}
                    aria-label={t("listenRepeat.closeWordDetails")}
                    className="size-11 grid place-items-center rounded-xl border border-border text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                  <WordDetailsContent
                    word={currentWord}
                    unitId={unit.id}
                    bilingual={bilingual}
                    className="bg-transparent"
                  />
                </div>
              </aside>
            )}
          </div>

          {!isSupported && (
            <p className="font-sans text-muted-foreground text-xs text-center">
              {t("listenRepeat.synthesisUnsupported")}
            </p>
          )}
          {(isError || playbackError) && (
            <p className="font-sans text-wp-rose text-xs text-center">
              {t("listenRepeat.audioPlaybackFailed")}
            </p>
          )}
        </div>

        <div
          aria-label={t("listenRepeat.keyboardShortcuts")}
          className="hidden lg:flex justify-center items-center gap-5 mt-5 text-sm text-muted-foreground"
        >
          <span className="font-semibold text-foreground">
            {t("listenRepeat.keyboardShortcuts")}
          </span>
          <span className="flex items-center gap-2">
            <kbd className="min-w-9 h-8 px-2 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              {`←`}
            </kbd>
            <kbd className="min-w-9 h-8 px-2 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              {`→`}
            </kbd>
            {t("listenRepeat.changeWord")}
          </span>
          <span className="flex items-center gap-2">
            <kbd className="h-8 px-3 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              {`Space`}
            </kbd>
            {t("listenRepeat.listenOrPause")}
          </span>
          <span className="flex items-center gap-2">
            <kbd className="h-8 px-3 grid place-items-center rounded-lg border border-border bg-wp-card shadow-wp-xs font-mono text-foreground">
              {`Esc`}
            </kbd>
            {t("listenRepeat.closeDetails")}
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
        word={currentWord}
        unitId={unit.id}
        isOpen={isDetailsVisible && !desktopDetails}
        onClose={() => setShowDetails(false)}
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
      role="radiogroup"
      aria-label={label}
      data-listen-selector
      className="flex rounded-xl ring-1 ring-inset ring-border bg-wp-card p-0.5"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={selected === option}
          onClick={() => onChange(option)}
          className={`flex-1 min-h-11 px-4 rounded-lg text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer transition-all ${
            selected === option
              ? "bg-secondary text-primary ring-1 ring-inset ring-primary/30 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

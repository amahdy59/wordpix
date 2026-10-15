import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, Headphones } from "lucide-react";
import type { ScenarioLesson, ScenarioLine } from "../../data/scenarios/scenarioService";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { useI18n } from "../../../i18n";

interface Props {
  scenarios: ScenarioLesson[];
  initialLessonId?: string;
  onInspectWord?: (wordText: string) => void;
  className?: string;
  compact?: boolean;
}

const SPEAKER_THEMES: Record<string, { badge: string; border: string }> = {
  Tariq: {
    badge: "bg-primary/15 text-primary border-primary/30",
    border: "border-primary/40",
  },
  Adam: {
    badge: "bg-accent/15 text-accent border-accent/30",
    border: "border-accent/40",
  },
  Omar: {
    badge: "bg-secondary text-foreground border-border",
    border: "border-border",
  },
  Layla: {
    badge: "bg-wp-green-light/40 text-wp-green border-wp-green/40",
    border: "border-wp-green/40",
  },
  Hana: {
    badge: "bg-wp-rose-light/40 text-wp-rose border-wp-rose/40",
    border: "border-wp-rose/40",
  },
};

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function UnitScenarioPlayer({
  scenarios,
  initialLessonId,
  onInspectWord,
  className = "",
  compact = false,
}: Props) {
  const { t } = useI18n();
  const [selectedIdx, setSelectedIdx] = useState(() => {
    if (initialLessonId) {
      const idx = scenarios.findIndex((s) => s.lessonId === initialLessonId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const activeScenario = scenarios[selectedIdx] ?? scenarios[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);

  const handleSelectScenario = (idx: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSelectedIdx(idx);
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveClipIndex(null);
  };

  // Handle rate change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Master audio URL
  const masterAudioUrl = useMemo(() => {
    if (!activeScenario?.masterAudioRelative) return "";
    return resolveAssetUrl(activeScenario.masterAudioRelative);
  }, [activeScenario]);

  // Identify which line is active during master playback
  const activeLineIndex = useMemo(() => {
    if (!activeScenario || activeClipIndex !== null) return activeClipIndex;
    if (!isPlaying && currentTime === 0) return null;
    return activeScenario.lines.findIndex(
      (line) => currentTime >= line.startSeconds && currentTime <= line.endSeconds
    );
  }, [activeScenario, currentTime, isPlaying, activeClipIndex]);

  const toggleMasterPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeClipIndex !== null) {
      // Switching from single clip back to master
      setActiveClipIndex(null);
      audio.src = masterAudioUrl;
      audio.currentTime = 0;
      audio.playbackRate = playbackRate;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, activeClipIndex, masterAudioUrl, playbackRate]);

  const restartMaster = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setActiveClipIndex(null);
    audio.src = masterAudioUrl;
    audio.currentTime = 0;
    audio.playbackRate = playbackRate;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [masterAudioUrl, playbackRate]);

  const playSingleClip = useCallback(
    (line: ScenarioLine, idx: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (activeClipIndex === idx && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      setActiveClipIndex(idx);
      const clipUrl = resolveAssetUrl(line.clipRelativePath);
      audio.src = clipUrl;
      audio.currentTime = 0;
      audio.playbackRate = playbackRate;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    },
    [activeClipIndex, isPlaying, playbackRate]
  );

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || activeScenario?.totalDurationSeconds || 0);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (activeClipIndex !== null) {
      // Return to master audio source ready to play
      setActiveClipIndex(null);
      if (audioRef.current) {
        audioRef.current.src = masterAudioUrl;
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && activeClipIndex === null) {
      audioRef.current.currentTime = newTime;
    }
  };

  if (!activeScenario) return null;

  return (
    <section
      aria-labelledby="scenario-player-heading"
      className={`rounded-2xl sm:rounded-3xl border border-primary/30 bg-card ${
        compact ? "p-3.5 sm:p-4.5" : "p-4 sm:p-6"
      } shadow-wp-xs space-y-4 ${className}`}
    >
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={masterAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      >
        <track kind="captions" />
      </audio>

      {/* Header & Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
              <Headphones className="size-3.5" aria-hidden="true" />
              <span>{t("study.videoContext") || "Authentic Listening Scenario"}</span>
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {activeScenario.lessonId}
            </span>
          </div>

          <h2
            id="scenario-player-heading"
            className="text-lg sm:text-xl font-black text-foreground"
            lang="en"
            dir="ltr"
          >
            {activeScenario.titleEn}
          </h2>
          {activeScenario.titleAr && (
            <p
              className="text-sm font-arabic font-medium text-muted-foreground mt-0.5"
              lang="ar"
              dir="rtl"
            >
              {activeScenario.titleAr}
            </p>
          )}
        </div>

        {/* Multi-scenario selector tabs if unit has multiple lessons */}
        {scenarios.length > 1 && (
          <div
            role="tablist"
            aria-label="Scenario parts"
            className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-secondary/80 self-start sm:self-auto"
          >
            {scenarios.map((s, idx) => {
              const isCurrent = idx === selectedIdx;
              return (
                <button
                  key={s.lessonId}
                  role="tab"
                  type="button"
                  aria-selected={isCurrent}
                  onClick={() => handleSelectScenario(idx)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/70"
                  }`}
                >
                  {t("study.scenarioPart", { count: idx + 1, defaultValue: `Part ${idx + 1}` })}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Playback Bar */}
      <div className="rounded-xl sm:rounded-2xl bg-secondary/60 border border-border p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMasterPlay}
              aria-label={
                isPlaying
                  ? `${t("common.pause") || "Pause scenario"}: ${activeScenario.titleEn}`
                  : `${t("common.play") || "Play scenario"}: ${activeScenario.titleEn}`
              }
              className="inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {isPlaying ? (
                <Pause className="size-5" aria-hidden="true" />
              ) : (
                <Play className="size-5 ms-0.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={restartMaster}
              aria-label={t("readingPlayer.restart") || "Restart scenario from beginning"}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-secondary active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>

            <div className="font-mono text-xs sm:text-sm font-semibold text-foreground px-2">
              <span>{formatSeconds(currentTime)}</span>
              <span className="text-muted-foreground"> / </span>
              <span className="text-muted-foreground">
                {formatSeconds(duration || activeScenario.totalDurationSeconds)}
              </span>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-muted-foreground me-1 hidden sm:inline">
              {t("study.audioSpeed", { defaultValue: "Speed:" })}
            </span>
            {[0.75, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackRate(rate)}
                aria-pressed={playbackRate === rate}
                className={`min-h-[44px] min-w-[44px] px-2 rounded-lg text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  playbackRate === rate
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {t("study.speedMultiplier", { rate, defaultValue: `${rate}x` })}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar / Scrubber */}
        <div className="space-y-1">
          <label htmlFor="scenario-scrubber" className="sr-only">
            {t("study.playbackProgress", { defaultValue: "Scenario playback progress" })}
          </label>
          <input
            id="scenario-scrubber"
            type="range"
            min={0}
            max={duration || activeScenario.totalDurationSeconds || 1}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            disabled={activeClipIndex !== null}
            aria-valuetext={`${formatSeconds(currentTime)} of ${formatSeconds(
              duration || activeScenario.totalDurationSeconds
            )}`}
            className="w-full h-2 rounded-lg bg-border accent-primary cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>

      {/* Target Vocabulary Badges */}
      {activeScenario.targetWords.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("study.targetWordsCount", {
              count: activeScenario.targetWords.length,
              defaultValue: `Target Words in Scenario (${activeScenario.targetWords.length}):`,
            })}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeScenario.targetWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => onInspectWord?.(word)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors cursor-pointer"
                title={`Inspect word: ${word}`}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Synchronized Dialogue Lines */}
      <div className="space-y-2.5 pt-2" role="region" aria-label="Dialogue transcript">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("study.dialogueLinesHint", {
            defaultValue: "Dialogue Lines (Click sentence to listen):",
          })}
        </span>

        <div className="space-y-2">
          {activeScenario.lines.map((line, idx) => {
            const isLineActive = activeLineIndex === idx;
            const isThisClipPlaying = activeClipIndex === idx && isPlaying;
            const theme = SPEAKER_THEMES[line.speaker] || {
              badge: "bg-secondary text-foreground border-border",
              border: "border-primary",
            };

            return (
              <div
                key={idx}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isLineActive
                    ? `bg-secondary/70 ${theme.border} ring-2 ring-primary/30 shadow-xs`
                    : "bg-card border-border hover:border-primary/40 hover:bg-secondary/30"
                }`}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-bold border ${theme.badge}`}
                    >
                      {line.speaker}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {formatSeconds(line.startSeconds)}
                    </span>
                  </div>

                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isLineActive ? "font-bold text-foreground" : "text-foreground/90"
                    }`}
                    lang="en"
                    dir="ltr"
                  >
                    "{line.text}"
                  </p>
                </div>

                {/* Individual Line Clip Playback Button */}
                <button
                  type="button"
                  onClick={() => playSingleClip(line, idx)}
                  aria-label={`${
                    isThisClipPlaying ? "Pause" : "Play"
                  } sentence: ${line.speaker} says ${line.text}`}
                  className={`size-11 shrink-0 inline-flex items-center justify-center rounded-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isThisClipPlaying
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary hover:bg-primary/20 text-foreground border border-border"
                  }`}
                >
                  {isThisClipPlaying ? (
                    <Pause className="size-4" aria-hidden="true" />
                  ) : (
                    <Volume2 className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Subtitles,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Video as VideoIcon,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../../i18n";

export interface VideoCaptionCue {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  speaker?: string;
  textEn: string;
  textAr: string;
  keywords?: string[];
}

export type CaptionMode = "both" | "en" | "ar" | "off";

export interface UnitVideoPlayerProps {
  src?: string;
  poster?: string;
  title: string;
  unitTitle?: string;
  cues?: VideoCaptionCue[];
  visualDescription?: string;
  className?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatVttTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `00:${mins.toString().padStart(2, "0")}:${secs.padStart(6, "0")}`;
}

const PLAYBACK_SPEEDS = [0.75, 1, 1.25] as const;

export const UnitVideoPlayer = memo(function UnitVideoPlayer({
  src,
  poster,
  title,
  unitTitle,
  cues = [],
  visualDescription,
  className = "",
  onEnded,
  autoPlay = false,
}: UnitVideoPlayerProps) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeTranscriptRef = useRef<HTMLButtonElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1); // 1.0x default
  const [captionMode, setCaptionMode] = useState<CaptionMode>("both");
  const [showTranscript, setShowTranscript] = useState(true);
  const [showVisualDesc, setShowVisualDesc] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const playbackRate = PLAYBACK_SPEEDS[speedIndex];

  // Active cue calculation
  const activeCue = cues.find((c) => currentTime >= c.startTime && currentTime <= c.endTime);

  // Auto-generate WebVTT data URL for standard HTML5 <track>
  const vttDataUrl = useMemo(() => {
    if (!cues.length) return "";
    let vtt = "WEBVTT\n\n";
    cues.forEach((cue, index) => {
      const start = formatVttTime(cue.startTime);
      const end = formatVttTime(cue.endTime);
      vtt += `${index + 1}\n${start} --> ${end}\n${cue.textEn}\n\n`;
    });
    return `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
  }, [cues]);

  // Auto-scroll transcript to active cue if user hasn't reduced motion
  useEffect(() => {
    if (activeCue && activeTranscriptRef.current && showTranscript) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      activeTranscriptRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [activeCue, showTranscript]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleRestart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setCurrentTime(0);
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, []);

  const handleSeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const handleSeekRelative = useCallback((secondsOffset: number) => {
    const video = videoRef.current;
    if (!video) return;
    const target = Math.max(0, Math.min(video.duration || 0, video.currentTime + secondsOffset));
    video.currentTime = target;
    setCurrentTime(target);
  }, []);

  const handleToggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  }, []);

  const handleCycleSpeed = useCallback(() => {
    const nextIdx = (speedIndex + 1) % PLAYBACK_SPEEDS.length;
    setSpeedIndex(nextIdx);
    if (videoRef.current) {
      videoRef.current.playbackRate = PLAYBACK_SPEEDS[nextIdx];
    }
  }, [speedIndex]);

  const handleCycleCaptions = useCallback(() => {
    const modes: CaptionMode[] = ["both", "en", "ar", "off"];
    const currentIdx = modes.indexOf(captionMode);
    const nextMode = modes[(currentIdx + 1) % modes.length];
    setCaptionMode(nextMode);
  }, [captionMode]);

  const handleJumpToTime = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, []);

  // Keyboard controls attached to the interactive toolbar
  const handleToolbarKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
        case "K":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeekRelative(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeekRelative(5);
          break;
        case "m":
        case "M":
          e.preventDefault();
          handleToggleMute();
          break;
        case "c":
        case "C":
          e.preventDefault();
          handleCycleCaptions();
          break;
        case "t":
        case "T":
          e.preventDefault();
          setShowTranscript((prev) => !prev);
          break;
      }
    },
    [handlePlayPause, handleSeekRelative, handleToggleMute, handleCycleCaptions]
  );

  // Empty state if no video source is provided
  if (!src) {
    return (
      <div
        className={`bg-wp-card border border-border rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-wp-xs ${className}`}
        role="region"
        aria-label={title}
      >
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <VideoIcon className="size-7" aria-hidden="true" />
        </div>
        <h3 className="font-sans font-bold text-lg sm:text-xl text-foreground mb-2">{title}</h3>
        {unitTitle && (
          <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
            {unitTitle}
          </p>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-6">
          {t("videoPlayer.trialPlaceholderDesc") ||
            "Trial video clip ready to link. Export your scene from Google Flow and attach the URL or local file to preview."}
        </p>
        <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 text-xs text-muted-foreground text-start max-w-md mx-auto">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            {t("videoPlayer.recommendedSpecs") || "Recommended Video Specifications:"}
          </p>
          <ul className="list-disc ps-5 space-y-1">
            <li>{t("videoPlayer.specLength") || "Length: 15–25 seconds (micro-learning focus)"}</li>
            <li>{t("videoPlayer.specFormat") || "Format: WebM (VP9/AV1) or MP4 (H.264)"}</li>
            <li>{t("videoPlayer.specAspect") || "Aspect Ratio: 16:9 widescreen or 4:3"}</li>
            <li>
              {t("videoPlayer.specBitrate") ||
                "Bitrate: Compressed for fast mobile streaming (< 5 MB)"}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group/player bg-wp-card border border-border rounded-3xl overflow-hidden shadow-wp-xs ${className}`}
      role="region"
      aria-label={`Video player: ${title}`}
    >
      {/* Video Viewport & Overlays */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 0);
              setHasError(false);
            }
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onError={() => {
            setHasError(true);
            setIsBuffering(false);
          }}
          className="size-full object-contain"
          aria-label={title}
        >
          <track
            kind="captions"
            src={vttDataUrl || "data:text/vtt;charset=utf-8,WEBVTT"}
            srcLang="en"
            label="English"
            default
          />
          <p>
            {t("videoPlayer.noVideoSupport") || "Your browser does not support video playback."}
          </p>
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none"
            aria-live="polite"
          >
            <div
              className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"
              aria-label="Loading video stream"
            />
          </div>
        )}

        {/* Error Overlay */}
        {hasError && (
          <div
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center text-white"
            role="alert"
          >
            <AlertCircle className="size-10 text-destructive mb-3" aria-hidden="true" />
            <p className="font-bold text-base mb-2">
              {t("videoPlayer.unableToPlay") || "Unable to play video"}
            </p>
            <p className="text-xs text-white/70 max-w-xs mb-4">
              {t("videoPlayer.loadErrorDesc") ||
                "The media asset could not be loaded. Please check your network or try again."}
            </p>
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                videoRef.current?.load();
              }}
              className="min-h-[44px] px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("videoPlayer.retry") || "Retry"}
            </button>
          </div>
        )}

        {/* Closed Captions Overlay (High Contrast WCAG 2.2 AAA >= 7:1) */}
        {captionMode !== "off" && activeCue && !hasError && (
          <div
            className="absolute bottom-4 inset-x-4 flex justify-center pointer-events-none px-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="bg-black/90 backdrop-blur-xs text-white border border-white/20 rounded-2xl px-4 py-2.5 max-w-xl text-center shadow-lg">
              {activeCue.speaker && (
                <span className="text-[11px] uppercase tracking-wider font-bold text-primary block mb-0.5">
                  {activeCue.speaker}
                </span>
              )}
              {(captionMode === "en" || captionMode === "both") && (
                <p className="font-sans font-medium text-sm sm:text-base leading-snug">
                  {activeCue.textEn}
                </p>
              )}
              {(captionMode === "ar" || captionMode === "both") && (
                <p
                  dir="rtl"
                  className="font-arabic font-normal text-xs sm:text-sm text-white/90 mt-0.5 leading-snug"
                >
                  {activeCue.textAr}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accessible Control Bar (Interactive Toolbar with Keyboard Navigation) */}
      <div
        role="toolbar"
        tabIndex={0}
        onKeyDown={handleToolbarKeyDown}
        aria-label="Playback controls"
        className="p-3.5 sm:p-4 bg-wp-card border-b border-border space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Timeline Slider with ARIA role="slider" */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-mono font-medium text-muted-foreground w-11 text-end select-none"
            aria-hidden="true"
          >
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              disabled={hasError || duration === 0}
              aria-label={t("videoPlayer.currentTime") || "Current time"}
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(currentTime)}
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <span
            className="text-xs font-mono font-medium text-muted-foreground w-11 select-none"
            aria-hidden="true"
          >
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row (All touch targets >= 44x44px for WCAG 2.5.5 AAA) */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
          {/* Left: Playback & Volume */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePlayPause}
              disabled={hasError}
              aria-label={
                isPlaying
                  ? t("videoPlayer.pause") || "Pause video"
                  : t("videoPlayer.play") || "Play video"
              }
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" aria-hidden="true" />
              ) : (
                <Play className="size-5 fill-current ms-0.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={hasError}
              aria-label={t("videoPlayer.replay") || "Replay video"}
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-foreground hover:bg-muted/60 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              <RotateCcw className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              disabled={hasError}
              aria-label={
                isMuted
                  ? t("videoPlayer.unmute") || "Unmute audio"
                  : t("videoPlayer.mute") || "Mute audio"
              }
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-foreground hover:bg-muted/60 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {isMuted ? (
                <VolumeX className="size-5 text-destructive" aria-hidden="true" />
              ) : (
                <Volume2 className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Right: Captions, Speed & View Toggles */}
          <div className="flex items-center gap-1.5">
            {/* Speed Button */}
            <button
              type="button"
              onClick={handleCycleSpeed}
              disabled={hasError}
              aria-label={`${t("videoPlayer.speed") || "Playback speed"}: ${playbackRate}x`}
              className="min-h-[44px] px-3 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-foreground border border-border hover:bg-muted/60 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {`${playbackRate}x`}
            </button>

            {/* Captions Cycle Button */}
            <button
              type="button"
              onClick={handleCycleCaptions}
              disabled={hasError || cues.length === 0}
              aria-label={`Captions: ${captionMode}`}
              aria-pressed={captionMode !== "off"}
              className={`min-h-[44px] px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
                captionMode !== "off"
                  ? "bg-secondary text-primary border-primary/30"
                  : "bg-transparent text-muted-foreground border-border hover:bg-muted/60"
              }`}
            >
              <Subtitles className="size-4" aria-hidden="true" />
              <span className="uppercase text-[11px]">{captionMode}</span>
            </button>

            {/* Transcript Toggle */}
            <button
              type="button"
              onClick={() => setShowTranscript((prev) => !prev)}
              aria-expanded={showTranscript}
              aria-label={
                showTranscript
                  ? t("videoPlayer.hideTranscript") || "Hide Transcript"
                  : t("videoPlayer.showTranscript") || "Show Transcript"
              }
              className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                showTranscript
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-foreground border-border hover:bg-muted/60"
              }`}
            >
              <FileText className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Interactive Transcript (WCAG 2.2 AAA 1.2.8 Media Alternative) */}
      {showTranscript && cues.length > 0 && (
        <section
          aria-label={t("videoPlayer.transcript") || "Interactive Transcript"}
          className="p-4 sm:p-5 bg-muted/20 border-b border-border space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden="true" />
              {t("videoPlayer.transcript") || "Interactive Transcript"}
            </h4>
            <span className="text-[11px] text-muted-foreground">
              {t("videoPlayer.jumpHint") || "Click any line to jump to that moment"}
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pe-1.5 focus-visible:outline-none">
            {cues.map((cue) => {
              const isActive = activeCue?.id === cue.id;
              return (
                <button
                  key={cue.id}
                  ref={isActive ? activeTranscriptRef : null}
                  type="button"
                  onClick={() => handleJumpToTime(cue.startTime)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${cue.speaker ? cue.speaker + ": " : ""}${cue.textEn}. Jump to ${formatTime(cue.startTime)}`}
                  className={`w-full text-start p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "bg-primary/10 border-primary shadow-xs"
                      : "bg-wp-card border-border/70 hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="font-bold text-primary">{cue.speaker || "Dialogue"}</span>
                    <span>{formatTime(cue.startTime)}</span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-foreground font-medium">
                    {cue.textEn}
                  </p>

                  <p dir="rtl" className="font-arabic text-xs text-muted-foreground">
                    {cue.textAr}
                  </p>

                  {cue.keywords && cue.keywords.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {t("videoPlayer.wordsLabel") || "Words:"}
                      </span>
                      {cue.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 bg-primary/15 text-primary text-[11px] font-semibold rounded-md"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Visual Scene Description (Audio Description Alternative for WCAG 1.2.5 / 1.2.8) */}
      {visualDescription && (
        <div className="p-3 sm:p-4 bg-wp-card">
          <button
            type="button"
            onClick={() => setShowVisualDesc((prev) => !prev)}
            aria-expanded={showVisualDesc}
            className="w-full flex items-center justify-between py-2 text-start text-xs font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              {t("videoPlayer.visualDescription") || "Visual Scene Description (Audio Alternative)"}
            </span>
            {showVisualDesc ? (
              <ChevronUp className="size-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="size-4" aria-hidden="true" />
            )}
          </button>

          {showVisualDesc && (
            <div
              className="mt-2 p-3 bg-muted/40 rounded-xl border border-border text-xs text-foreground leading-relaxed"
              role="note"
            >
              {visualDescription}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

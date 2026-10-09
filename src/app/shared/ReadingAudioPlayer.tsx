import { useId } from "react";
import { LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { useI18n } from "../../i18n";
import type { AudioController } from "./useAudio";
import { PlaybackSpeedControl } from "./PlaybackSpeedControl";

interface Props {
  audio: AudioController;
  active: boolean;
  onPlay: () => void;
  onRestart: () => void;
  rate: number;
  onRateChange: (rate: number) => void;
  enabled: boolean;
  label?: string;
}

export function formatAudioTime(seconds: number): string {
  const whole = Math.floor(Math.max(0, Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Media controls stay adjacent to their transcript; progress never moves focus. */
export function ReadingAudioPlayer({
  audio,
  active,
  onPlay,
  onRestart,
  rate,
  onRateChange,
  enabled,
  label,
}: Props) {
  const { t } = useI18n();
  const statusId = useId();
  const busy = active && (audio.status === "loading" || audio.status === "buffering");
  const playing = active && audio.isPlaying;
  const paused = active && audio.isPaused;
  const hasTimeline = active && audio.source === "recording" && audio.duration > 0;
  const unavailable = !audio.isSupported || (active && audio.isError);
  const status = !enabled
    ? t("readingPlayer.disabled")
    : unavailable
      ? t("readingPlayer.error")
      : busy
        ? t(audio.status === "buffering" ? "readingPlayer.buffering" : "readingPlayer.loading")
        : active && audio.source === "device"
          ? t("readingPlayer.deviceVoice")
          : paused
            ? t("readingPlayer.paused")
            : "";
  const buttonLabel = busy
    ? t("readingPlayer.cancel")
    : playing
      ? t("readingPlayer.pause")
      : paused
        ? t("readingPlayer.resume")
        : active && audio.isError
          ? t("readingPlayer.retry")
          : (label ?? t("conversation.listenReading"));
  const toggle = () => {
    if (busy) audio.stop();
    else if (playing) audio.pause();
    else if (paused) audio.resume();
    else onPlay();
  };
  const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  return (
    <div
      role="group"
      aria-label={t("readingPlayer.controls")}
      className="min-w-0 space-y-3 border-y border-border py-4"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={!enabled || !audio.isSupported}
          aria-describedby={status ? statusId : undefined}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground hover:brightness-105 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
        >
          {busy ? (
            <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden />
          ) : playing ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="size-4" aria-hidden />
          )}
          {buttonLabel}
        </button>
        <button
          type="button"
          onClick={onRestart}
          disabled={!enabled || !audio.isSupported}
          aria-label={t("readingPlayer.restart")}
          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
        >
          <RotateCcw className="size-4" aria-hidden />
        </button>
        <PlaybackSpeedControl
          value={rate}
          onChange={onRateChange}
          label={t("conversation.playbackSpeed")}
          disabled={
            !enabled ||
            !audio.isSupported ||
            (active && audio.source === "device" && (playing || paused))
          }
          options={[
            { value: 0.85, label: t("conversation.slowSpeed") },
            { value: 1, label: t("conversation.normalSpeed") },
          ]}
        />
      </div>
      {hasTimeline && (
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-sm tabular-nums text-foreground" dir="ltr" aria-hidden>
            {formatAudioTime(audio.currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={audio.duration}
            step={0.1}
            value={audio.currentTime}
            onChange={(event) => audio.seek(Number(event.target.value))}
            aria-label={t("readingPlayer.seek")}
            aria-valuetext={t("readingPlayer.position", {
              current: formatAudioTime(audio.currentTime),
              total: formatAudioTime(audio.duration),
            })}
            className={`min-h-11 min-w-11 flex-1 accent-primary ${focus}`}
          />
          <span className="shrink-0 text-sm tabular-nums text-foreground" dir="ltr" aria-hidden>
            {formatAudioTime(audio.duration)}
          </span>
        </div>
      )}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={status ? "text-sm text-foreground" : "sr-only"}
      >
        {status}
      </p>
    </div>
  );
}

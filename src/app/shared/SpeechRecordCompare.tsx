import { useEffect, useId, useState } from "react";
import {
  CheckCircle2,
  Headphones,
  LoaderCircle,
  Mic,
  RotateCcw,
  ShieldCheck,
  Square,
  Trash2,
  Volume2,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { useAudio } from "./useAudio";
import { usePrivateRecording } from "./usePrivateRecording";

interface SpeechRecordCompareProps {
  target: string;
  modelText: string;
  title?: string;
  description?: string;
  maxDurationSeconds?: number;
  defaultOpen?: boolean;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

function RecordingWaveform({ blob }: { blob: Blob }) {
  const [samples, setSamples] = useState<number[]>(() => Array.from({ length: 36 }, () => 0.2));

  useEffect(() => {
    let cancelled = false;
    let context: AudioContext | null = null;

    async function analyse() {
      if (typeof window === "undefined" || !window.AudioContext) return;
      try {
        context = new window.AudioContext();
        const decoded = await context.decodeAudioData(await blob.arrayBuffer());
        const channel = decoded.getChannelData(0);
        const bucketSize = Math.max(1, Math.floor(channel.length / 36));
        const next = Array.from({ length: 36 }, (_, bucket) => {
          const start = bucket * bucketSize;
          const end = Math.min(channel.length, start + bucketSize);
          let peak = 0;
          for (let index = start; index < end; index += 1)
            peak = Math.max(peak, Math.abs(channel[index]));
          return Math.max(0.14, Math.min(1, peak * 2.4));
        });
        if (!cancelled) setSamples(next);
      } catch {
        // The native audio control remains fully usable if decoding is unavailable.
      }
    }

    void analyse();
    return () => {
      cancelled = true;
      if (context) void context.close().catch(() => undefined);
    };
  }, [blob]);

  return (
    <div
      className="flex h-14 items-center gap-1 rounded-xl border border-border bg-muted/30 px-3"
      aria-hidden="true"
    >
      {samples.map((sample, index) => (
        <span
          // The recording is ephemeral and has no persistent identifier.
          key={index}
          className="min-w-0 flex-1 rounded-full bg-primary"
          style={{ height: `${Math.round(8 + sample * 34)}px` }}
        />
      ))}
    </div>
  );
}

export function SpeechRecordCompare({
  target,
  modelText,
  title,
  description,
  maxDurationSeconds = 60,
  defaultOpen = true,
}: SpeechRecordCompareProps) {
  const { t } = useI18n();
  const id = useId();
  const audio = useAudio({ lang: "en-US", rate: 0.88, preferLocal: true });
  const recording = usePrivateRecording({ maxDurationMs: maxDurationSeconds * 1000 });
  const [reflection, setReflection] = useState<"again" | "almost" | "clear" | null>(null);
  const isAudioPending = audio.status === "loading" || audio.status === "playing";

  const statusMessage =
    recording.status === "requesting"
      ? t("speechPractice.requestingMic")
      : recording.status === "recording"
        ? t("speechPractice.recordingStatus", {
            elapsed: formatDuration(recording.elapsedMs),
            limit: formatDuration(recording.maxDurationMs),
          })
        : recording.status === "ready"
          ? t("speechPractice.recordingReady")
          : "";

  return (
    <details
      open={defaultOpen || undefined}
      className="group overflow-hidden rounded-3xl border border-border bg-card shadow-wp-sm"
    >
      <summary
        className={`flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 py-4 text-start ${focusRing}`}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Mic className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-foreground">
            {title ?? t("speechPractice.title")}
          </span>
          <span className="mt-0.5 block text-sm font-semibold text-muted-foreground">
            {description ?? t("speechPractice.subtitle")}
          </span>
        </span>
      </summary>

      <div className="space-y-5 border-t border-border p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p id={`${id}-privacy`} className="text-sm font-semibold leading-relaxed text-foreground">
            {t("speechPractice.privacy")}
          </p>
        </div>

        <ol className="grid gap-4 lg:grid-cols-3">
          <li className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                1
              </span>
              <h3 className="font-black text-foreground">{t("speechPractice.listenTitle")}</h3>
            </div>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-muted-foreground">
              {modelText}
            </p>
            <button
              type="button"
              onClick={() => (isAudioPending ? audio.stop() : audio.speak(modelText))}
              disabled={!audio.isSupported}
              aria-busy={audio.status === "loading"}
              className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary bg-card px-4 text-sm font-black text-primary transition-colors hover:bg-primary/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              {audio.status === "loading" ? (
                <LoaderCircle
                  className="size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden
                />
              ) : isAudioPending ? (
                <Square className="size-4" aria-hidden />
              ) : (
                <Volume2 className="size-4" aria-hidden />
              )}
              {isAudioPending ? t("speechPractice.stopModel") : t("speechPractice.playModel")}
            </button>
            {!audio.isSupported && (
              <p className="mt-3 text-sm font-bold text-foreground" role="status">
                {t("speechPractice.modelUnavailable")}
              </p>
            )}
            {audio.isError && (
              <p className="mt-3 text-sm font-bold text-destructive" role="alert">
                {t("speechPractice.modelError")}
              </p>
            )}
          </li>

          <li className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                2
              </span>
              <h3 className="font-black text-foreground">{t("speechPractice.recordTitle")}</h3>
            </div>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-muted-foreground">
              {t("speechPractice.target", { target })}
            </p>

            {recording.status === "unsupported" ? (
              <p className="mt-4 text-sm font-bold text-foreground" role="status">
                {t("speechPractice.unavailable")}
              </p>
            ) : (
              <button
                type="button"
                onClick={recording.status === "recording" ? recording.stop : recording.start}
                disabled={recording.status === "requesting"}
                aria-describedby={`${id}-privacy`}
                className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition-colors active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 ${focusRing} ${
                  recording.status === "recording"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {recording.status === "requesting" ? (
                  <LoaderCircle
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden
                  />
                ) : recording.status === "recording" ? (
                  <Square className="size-4" aria-hidden />
                ) : recording.recordingUrl ? (
                  <RotateCcw className="size-4" aria-hidden />
                ) : (
                  <Mic className="size-4" aria-hidden />
                )}
                {recording.status === "requesting"
                  ? t("speechPractice.requestingMic")
                  : recording.status === "recording"
                    ? t("speechPractice.stopRecording")
                    : recording.recordingUrl
                      ? t("speechPractice.recordAgain")
                      : t("speechPractice.startRecording")}
              </button>
            )}
            {recording.status === "recording" && (
              <p className="mt-3 text-sm font-black text-destructive" role="status">
                {t("speechPractice.recordingStatus", {
                  elapsed: formatDuration(recording.elapsedMs),
                  limit: formatDuration(recording.maxDurationMs),
                })}
              </p>
            )}
            {(recording.status === "denied" || recording.status === "error") && (
              <p className="mt-3 text-sm font-bold text-destructive" role="alert">
                {recording.status === "denied"
                  ? t("speechPractice.micDenied")
                  : t("speechPractice.recordError")}
              </p>
            )}
          </li>

          <li className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                3
              </span>
              <h3 className="font-black text-foreground">{t("speechPractice.compareTitle")}</h3>
            </div>
            {recording.recordingUrl && recording.recordingBlob ? (
              <div className="mt-3 space-y-3">
                <RecordingWaveform blob={recording.recordingBlob} />
                <p className="text-xs font-bold text-muted-foreground">
                  {t("speechPractice.duration", { duration: formatDuration(recording.durationMs) })}
                </p>
                {/* The learner's private recording has no authored caption track. */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio className="w-full" controls src={recording.recordingUrl}>
                  {t("speechPractice.audioUnsupported")}
                </audio>
                <button
                  type="button"
                  onClick={() => {
                    recording.deleteRecording();
                    setReflection(null);
                  }}
                  className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-black text-foreground hover:bg-muted ${focusRing}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {t("speechPractice.deleteRecording")}
                </button>
              </div>
            ) : (
              <div className="mt-3 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center">
                <Headphones className="size-6 text-muted-foreground" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {t("speechPractice.compareEmpty")}
                </p>
              </div>
            )}
          </li>
        </ol>

        {recording.recordingUrl && (
          <fieldset className="rounded-2xl border border-border bg-muted/20 p-4">
            <legend className="px-1 text-sm font-black text-foreground">
              {t("speechPractice.reflectionTitle")}
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(["again", "almost", "clear"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 text-center text-sm font-bold transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-primary ${
                    reflection === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${id}-reflection`}
                    value={value}
                    checked={reflection === value}
                    onChange={() => setReflection(value)}
                    className="sr-only"
                  />
                  {value === "clear" && <CheckCircle2 className="size-4" aria-hidden />}
                  {t(`speechPractice.reflection.${value}`)}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>
      </div>
    </details>
  );
}

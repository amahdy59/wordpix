import { Mic, Square, Trash2 } from "lucide-react";
import { usePrivateRecording } from "../../shared/usePrivateRecording";

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function PrivateRecordCompare({ target }: { target: string }) {
  const recording = usePrivateRecording();

  return (
    <details className="mt-5 rounded-2xl border border-border bg-wp-card text-start">
      <summary
        className={`min-h-12 cursor-pointer rounded-2xl px-4 py-3 font-bold text-foreground ${focusRing}`}
      >
        Optional: record and compare
      </summary>
      <div className="border-t border-border px-4 py-4">
        <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
          Say “{target}”. Your recording stays in this browser tab and is deleted when you leave or
          select Delete.
        </p>

        {recording.status === "unsupported" ? (
          <p className="mt-3 text-sm font-bold text-foreground" role="status">
            Recording is unavailable in this browser. Listen and repeat aloud instead.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {recording.status !== "recording" && (
              <button
                type="button"
                onClick={recording.start}
                disabled={recording.status === "requesting"}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground disabled:opacity-60 ${focusRing}`}
              >
                <Mic className="size-5" aria-hidden />
                {recording.status === "requesting"
                  ? "Requesting microphone…"
                  : recording.recordingUrl
                    ? "Record again"
                    : "Start recording"}
              </button>
            )}
            {recording.status === "recording" && (
              <button
                type="button"
                onClick={recording.stop}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--feedback-error)] px-4 font-bold text-white ${focusRing}`}
              >
                <Square className="size-5" aria-hidden /> Stop recording
              </button>
            )}
            {recording.recordingUrl && (
              <button
                type="button"
                onClick={recording.deleteRecording}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 font-bold text-foreground ${focusRing}`}
              >
                <Trash2 className="size-5" aria-hidden /> Delete
              </button>
            )}
          </div>
        )}

        {recording.status === "recording" && (
          <p className="mt-3 text-sm font-bold text-[var(--feedback-error)]" role="status">
            Recording… Stop when you finish. Maximum 20 seconds.
          </p>
        )}
        {recording.status === "denied" && (
          <p className="mt-3 text-sm font-bold text-foreground" role="alert">
            Microphone access was not allowed. You can continue without recording.
          </p>
        )}
        {recording.status === "error" && (
          <p className="mt-3 text-sm font-bold text-foreground" role="alert">
            The recording could not be created. Try again or continue without it.
          </p>
        )}
        {recording.recordingUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-foreground">Your private recording</p>
            {/* This is the learner's own ephemeral recording, so no caption track exists. */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio className="w-full" controls src={recording.recordingUrl}>
              Your browser does not support audio playback.
            </audio>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Replay the model above, then compare one feature: sounds, stress, or phrasing.
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

import { Mic, Square, Trash2 } from "lucide-react";
import { usePrivateRecording } from "../../shared/usePrivateRecording";
import { useI18n } from "../../../i18n";

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function PrivateRecordCompare({ target }: { target: string }) {
  const { t } = useI18n();
  const recording = usePrivateRecording();

  return (
    <details className="mt-5 rounded-2xl border border-border bg-wp-card text-start">
      <summary
        className={`min-h-12 cursor-pointer rounded-2xl px-4 py-3 font-bold text-foreground ${focusRing}`}
      >
        {t("foundation.recordCompare")}
      </summary>
      <div className="border-t border-border px-4 py-4">
        <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
          {t("foundation.recordPrivacy", { target })}
        </p>

        {recording.status === "unsupported" ? (
          <p className="mt-3 text-sm font-bold text-foreground" role="status">
            {t("foundation.recordUnavailable")}
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
                  ? t("foundation.requestingMic")
                  : recording.recordingUrl
                    ? t("foundation.recordAgain")
                    : t("foundation.startRecording")}
              </button>
            )}
            {recording.status === "recording" && (
              <button
                type="button"
                onClick={recording.stop}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--feedback-error)] px-4 font-bold text-white ${focusRing}`}
              >
                <Square className="size-5" aria-hidden /> {t("foundation.stopRecording")}
              </button>
            )}
            {recording.recordingUrl && (
              <button
                type="button"
                onClick={recording.deleteRecording}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 font-bold text-foreground ${focusRing}`}
              >
                <Trash2 className="size-5" aria-hidden /> {t("foundation.deleteRecording")}
              </button>
            )}
          </div>
        )}

        {recording.status === "recording" && (
          <p className="mt-3 text-sm font-bold text-[var(--feedback-error)]" role="status">
            {t("foundation.recordingStatus")}
          </p>
        )}
        {recording.status === "denied" && (
          <p className="mt-3 text-sm font-bold text-foreground" role="alert">
            {t("foundation.micDenied")}
          </p>
        )}
        {recording.status === "error" && (
          <p className="mt-3 text-sm font-bold text-foreground" role="alert">
            {t("foundation.recordError")}
          </p>
        )}
        {recording.recordingUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-foreground">
              {t("foundation.privateRecording")}
            </p>
            {/* This is the learner's own ephemeral recording, so no caption track exists. */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio className="w-full" controls src={recording.recordingUrl}>
              {t("foundation.audioUnsupported")}
            </audio>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              {t("foundation.comparePrompt")}
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

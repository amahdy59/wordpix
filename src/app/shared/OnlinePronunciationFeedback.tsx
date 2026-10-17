import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import {
  assessPronunciation,
  AssessmentError,
  onlineAssessmentEnabled,
  type AssessmentProblem,
  type PronunciationAssessmentResult,
} from "./pronunciationAssessment";

type FeedbackState =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "result"; result: PronunciationAssessmentResult }
  | { status: "error"; reason: AssessmentProblem };
interface Props {
  blob: Blob | null;
  target: string;
  onAssessed?: () => void;
}

export function OnlinePronunciationFeedback({ blob, target, onAssessed }: Props) {
  const { t } = useI18n();
  const [consented, setConsented] = useState(false);
  const [response, setResponse] = useState<{
    blob: Blob;
    target: string;
    state: FeedbackState;
  } | null>(null);
  const state: FeedbackState =
    !blob || !consented
      ? { status: "idle" }
      : response?.blob === blob && response.target === target
        ? response.state
        : { status: "processing" };
  const controllerRef = useRef<AbortController | null>(null);
  const callbackRef = useRef(onAssessed);
  useEffect(() => {
    callbackRef.current = onAssessed;
  }, [onAssessed]);
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    if (!blob || !consented) {
      return () => controller.abort();
    }
    const timeout = window.setTimeout(() => {
      controller.abort();
      setResponse({ blob, target, state: { status: "error", reason: "timeout" } });
    }, 20000);
    void assessPronunciation(blob, target, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setResponse({ blob, target, state: { status: "result", result } });
        if (result.status === "assessed") callbackRef.current?.();
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setResponse({
            blob,
            target,
            state: {
              status: "error",
              reason: error instanceof AssessmentError ? error.reason : "unavailable",
            },
          });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [blob, consented, target]);
  if (!onlineAssessmentEnabled()) return null;
  const focus =
    "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";
  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-4">
      <p className="text-sm text-foreground">{t("pronunciationEnhancements.onlineExplanation")}</p>
      {onlineAssessmentEnabled() ? (
        <label
          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-2 text-sm font-semibold text-foreground focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-primary ${focus}`}
        >
          <input
            className="size-5"
            type="checkbox"
            checked={consented}
            onChange={(event) => {
              controllerRef.current?.abort();
              setResponse(null);
              setConsented(event.target.checked);
            }}
          />
          {t("pronunciationEnhancements.onlineConsent")}
        </label>
      ) : (
        <p className="text-sm text-foreground">
          {t("pronunciationEnhancements.problems.unavailable")}
        </p>
      )}
      <div
        role="status"
        aria-live="polite"
        aria-busy={state.status === "processing"}
        className="text-sm text-foreground"
      >
        {state.status === "processing" && t("pronunciationEnhancements.processing")}
        {state.status === "error" && t(`pronunciationEnhancements.problems.${state.reason}`)}
        {state.status === "result" &&
          state.result.status === "unassessed" &&
          t(`pronunciationEnhancements.problems.${state.result.reason}`)}
        {state.status === "result" && state.result.status === "assessed" && (
          <div className="space-y-2">
            <p className="font-bold">{t("pronunciationEnhancements.feedbackReceived")}</p>
            <p>
              {t(
                state.result.words.some((word) => word.errorType === "Insertion")
                  ? "pronunciationEnhancements.insertionCue"
                  : state.result.words.some((word) => word.errorType === "Omission")
                    ? "pronunciationEnhancements.omissionCue"
                    : "pronunciationEnhancements.compareCue"
              )}
            </p>
            <div className="rounded-xl border border-border bg-card p-3 space-y-2 text-sm">
              <p className="font-semibold text-foreground">
                {t("pronunciationEnhancements.soundDetails")}:{" "}
                {t("pronunciationEnhancements.estimate", {
                  score: Math.round(state.result.accuracy),
                })}
              </p>
              <ul className="space-y-1.5 text-muted-foreground">
                {state.result.words.map((word, index) => (
                  <li key={`${word.word}:${index}`}>
                    <bdi lang="en" dir="ltr" className="font-medium text-foreground">
                      {word.word}
                    </bdi>
                    <span>
                      {" "}
                      ·{" "}
                      {t("pronunciationEnhancements.estimate", {
                        score: Math.round(word.accuracy),
                      })}
                    </span>
                    <ul className="ps-3 space-y-0.5">
                      {word.phonemes.map((phoneme, phonemeIndex) => (
                        <li key={`${phoneme.phoneme}:${phonemeIndex}`}>
                          <bdi dir="ltr">{phoneme.phoneme}</bdi>
                          <span>
                            {" "}
                            ·{" "}
                            {t("pronunciationEnhancements.estimate", {
                              score: Math.round(phoneme.accuracy),
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

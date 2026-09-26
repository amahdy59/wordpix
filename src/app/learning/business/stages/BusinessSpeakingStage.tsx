import { useState, useRef, useEffect } from "react";
import {
  Mic,
  ArrowRight,
  ShieldAlert,
  CheckSquare2,
  Square,
  Sparkles,
  Square as StopIcon,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  savedChecklist?: string[];
  onSaveChecklist: (checklist: string[]) => void;
  onNext: () => void;
}

export function BusinessSpeakingStage({
  unit,
  savedChecklist = [],
  onSaveChecklist,
  onNext,
}: Props) {
  const { t } = useI18n();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(savedChecklist));

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  const toggleCheck = (item: string) => {
    const next = new Set(checkedItems);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setCheckedItems(next);
    onSaveChecklist(Array.from(next));
  };

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError("Microphone access is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const supportedMimeType =
        typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function"
          ? (["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find((type) =>
              MediaRecorder.isTypeSupported(type)
            ) ?? "")
          : "";
      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || supportedMimeType;
        const audioBlob = mimeType
          ? new Blob(audioChunksRef.current, { type: mimeType })
          : new Blob(audioChunksRef.current);
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        // Stop all audio tracks to release microphone hardware
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 180) {
            // Auto stop at 3 minutes max
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Microphone access error:", err);
      setMicError(
        "Could not access microphone. Please check your browser permissions to practice recording."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTogglePlayback = () => {
    if (!audioPlayerRef.current || !recordedAudioUrl) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const resetRecording = () => {
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setRecordSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Mic className="size-4" aria-hidden />
          {t("business.speaking.stageTag")}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {t("business.speaking.simulationTag", { level: unit.level })}
        </span>
      </div>

      {/* Task Hero Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="speaking-task-title"
      >
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          {t("business.speaking.RolePlayBrief")}
        </p>
        <h1
          id="speaking-task-title"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          {unit.speakingTask.title}
        </h1>

        {/* Important Rule Banner */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-secondary border border-border p-4 text-foreground">
          <ShieldAlert className="size-5 shrink-0 mt-0.5 text-primary" aria-hidden />
          <div>
            <span className="text-xs font-black uppercase tracking-wide block mb-0.5 text-primary">
              {t("business.speaking.keySpeakingPrinciple")}
            </span>
            <p className="text-sm sm:text-base font-semibold italic">
              {`“${unit.speakingTask.rule}”`}
            </p>
          </div>
        </div>
      </section>

      {/* Practice Steps */}
      {unit.speakingTask.steps.length > 0 && (
        <section
          className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
          aria-labelledby="practice-steps-heading"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-primary" aria-hidden />
            <h2 id="practice-steps-heading" className="text-lg font-black text-foreground">
              {t("business.speaking.stepsHeading")}
            </h2>
          </div>

          <ol className="flex flex-col gap-3">
            {unit.speakingTask.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border/80 p-3.5 text-sm sm:text-base font-medium text-foreground"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Voice Practice & Recording Studio */}
      <section
        className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="recording-studio-heading"
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Mic className="size-5 text-primary" aria-hidden />
            <h2 id="recording-studio-heading" className="text-lg font-black text-foreground">
              {t("business.speaking.VoicePractice")}
            </h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase">
            {t("business.speaking.audioSandbox")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-6">
          {t("business.speaking.sandboxInstructions")}
        </p>

        {micError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-medium">
            <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
            <div>
              <span className="font-bold block">{t("business.speaking.micNoticeTitle")}</span>
              <span>{micError}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-border bg-card p-5">
          {/* Status & Timer */}
          <div className="flex items-center gap-4">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl transition-all ${
                isRecording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : recordedAudioUrl
                    ? "bg-accent/20 text-accent"
                    : "bg-primary/15 text-primary"
              }`}
            >
              <Mic className="size-6" aria-hidden />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-foreground">
                  {isRecording
                    ? "Recording in progress..."
                    : recordedAudioUrl
                      ? "Recording ready to review"
                      : "Ready to record"}
                </span>
                {isRecording && (
                  <span className="inline-block size-2 rounded-full bg-destructive animate-ping" />
                )}
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {t("business.speaking.durationLabel", { duration: formatTime(recordSeconds) })}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isRecording && !recordedAudioUrl && (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-wp-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Mic className="size-4" aria-hidden />
                <span>{t("business.speaking.startRecording")}</span>
              </button>
            )}

            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 font-bold text-destructive-foreground shadow-wp-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-destructive"
              >
                <StopIcon className="size-4" aria-hidden />
                <span>{t("business.speaking.finishAndListen")}</span>
              </button>
            )}

            {recordedAudioUrl && (
              <>
                <button
                  type="button"
                  onClick={handleTogglePlayback}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-wp-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="size-4" aria-hidden />
                      <span>{t("business.speaking.pausePlayback")}</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-4" aria-hidden />
                      <span>{t("business.speaking.playDelivery")}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetRecording}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  title="Re-record response"
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                  <span>{t("business.speaking.rerecord")}</span>
                </button>

                {/* The learner's private recording sandbox has no authored caption track */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio
                  ref={audioPlayerRef}
                  src={recordedAudioUrl}
                  onEnded={handleAudioEnded}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Self-Assessment Checklist */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
        aria-labelledby="checklist-heading"
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 id="checklist-heading" className="text-lg font-black text-foreground">
            {t("business.speaking.SelfEvaluationChecklist")}
          </h2>
          <span className="text-xs font-bold text-accent">
            {t("business.speaking.checklistCompletedCount", {
              completed: checkedItems.size,
              total: unit.speakingTask.checklist.length,
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-5">
          {t("business.speaking.checklistInstructions")}
        </p>

        <div className="flex flex-col gap-3">
          {unit.speakingTask.checklist.map((item, idx) => {
            const isChecked = checkedItems.has(item);
            return (
              <button
                key={idx}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleCheck(item)}
                className={`flex items-start gap-3.5 rounded-2xl p-4 text-start transition-all border ${
                  isChecked
                    ? "border-accent/40 bg-accent/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                {isChecked ? (
                  <CheckSquare2 className="size-5 shrink-0 mt-0.5 text-accent" aria-hidden />
                ) : (
                  <Square className="size-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden />
                )}
                <span className="text-sm sm:text-base font-semibold leading-relaxed">{item}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.speaking.continueToReview")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}

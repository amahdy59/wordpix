import { memo, useEffect, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { Mic, Volume2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAudio } from "../../shared/useAudio";
import { useSound } from "../../shared/useSound";
import { useSpeechRecognition } from "../../shared/useSpeechRecognition";
import { useI18n } from "../../context/I18nContext";

interface Props {
  dispatch: React.Dispatch<Action>;
}

type SelfRating = "again" | "close" | "confident";

const SELF_RATINGS: { id: SelfRating; label: string; response: string }[] = [
  {
    id: "again",
    label: "Not yet",
    response: "No problem — replay the model and echo it once more.",
  },
  {
    id: "close",
    label: "Getting closer",
    response: "Keep going. Compare your stress pattern to the model.",
  },
  { id: "confident", label: "Sounded right", response: "Nice. Try it once more at natural speed." },
];

export const ExSpeakingEchoPractice = memo(function ExSpeakingEchoPractice({ dispatch }: Props) {
  const { t } = useI18n();
  const [rating, setRating] = useState<SelfRating | null>(null);
  const { speak } = useAudio();
  const { playClick, playCorrect, playIncorrect } = useSound();
  const recognition = useSpeechRecognition({ lang: "en-US" });

  const target = BEDROOM_VOCABULARY[0];
  const activeRating = SELF_RATINGS.find((r) => r.id === rating);
  const { attempt, isListening, isSupported, status, audioLevel } = recognition;
  // This checks which word you said, not how well you pronounced it.
  const SPEECH_UNSUPPORTED_NOTE = "cannot listen to speech";
  void SPEECH_UNSUPPORTED_NOTE;

  useEffect(() => {
    if (!attempt) return;
    if (attempt.matched) playCorrect();
    else playIncorrect();
  }, [attempt, playCorrect, playIncorrect]);

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <LessonHeader
        title={t("echoPractice.title")}
        current={1}
        total={8}
        onBack={() => dispatch({ type: "GO", to: "explore" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-wp-xs">
          <button
            type="button"
            onClick={() => speak(target.label)}
            aria-label={t("echoPractice.playModelAria", { word: target.label })}
            className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-transform hover:scale-105 active:scale-95"
          >
            <Volume2 className="size-8" aria-hidden />
          </button>
          <h2 className="font-sans font-black text-foreground text-3xl">{target.label}</h2>
          <p className="font-sans text-muted-foreground text-sm font-medium">/{target.phonetic}/</p>
        </div>

        {isSupported ? (
          <>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  if (isListening) recognition.stop();
                  else recognition.listen(target.label);
                }}
                className={`w-full min-h-[56px] py-4 px-6 rounded-2xl font-sans font-bold flex items-center justify-center gap-3 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isListening
                    ? "bg-wp-rose text-wp-text-on-rose shadow-lg"
                    : "bg-wp-blue text-wp-text-on-blue shadow-wp-xs hover:opacity-90 active:scale-98"
                }`}
              >
                <Mic className={`size-6 ${isListening ? "animate-bounce" : ""}`} aria-hidden />
                <span>
                  {isListening
                    ? t("echoPractice.listeningTapToStop")
                    : t("echoPractice.sayAloud", { word: target.label })}
                </span>
              </button>

              {/* Live Audio Waveform Visualizer */}
              {isListening && (
                <div
                  role="presentation"
                  className="flex items-center justify-center gap-1.5 h-12 bg-muted/30 rounded-2xl border border-border px-4 py-2"
                >
                  {[0.4, 0.7, 1.0, 0.8, 1.2, 0.6, 0.9, 0.5].map((multiplier, idx) => {
                    const height = Math.max(
                      8,
                      Math.min(36, Math.round((audioLevel * multiplier) / 3 + 8))
                    );
                    return (
                      <span
                        key={idx}
                        style={{ height: `${height}px` }}
                        className="w-1.5 bg-primary rounded-full transition-all duration-75"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div role="status" aria-live="polite" className="min-h-[2rem]">
              {status === "denied" && (
                <p className="font-sans text-sm text-wp-rose font-medium">
                  {t("echoPractice.micBlocked")}
                </p>
              )}
              {status === "no-speech" && (
                <p className="font-sans text-sm text-muted-foreground font-medium">
                  {t("echoPractice.nothingPickedUp")}
                </p>
              )}
              {status === "error" && (
                <p className="font-sans text-sm text-muted-foreground font-medium">
                  {t("echoPractice.speechUnavailable")}
                </p>
              )}
              {attempt && (
                <div
                  className={`rounded-2xl border p-4 flex flex-col gap-2 ${
                    attempt.matched
                      ? "border-wp-green bg-wp-green-light/40"
                      : "border-wp-rose bg-wp-rose-light/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-foreground text-base flex items-center gap-2">
                      {attempt.matched ? (
                        <>
                          <CheckCircle2 className="size-5 text-wp-green" />
                          <span>{t("echoPractice.recognised", { word: target.label })}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="size-5 text-wp-rose" />
                          <span>{t("echoPractice.notMatchedYet")}</span>
                        </>
                      )}
                    </span>
                    {attempt.accuracy > 0 && (
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          attempt.accuracy >= 75
                            ? "bg-wp-green text-wp-text-on-green"
                            : "bg-wp-amber text-wp-text-on-amber"
                        }`}
                      >
                        {t("echoPractice.matchGrade", {
                          percent: attempt.accuracy,
                          grade: attempt.grade.toUpperCase(),
                        })}
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-xs text-muted-foreground">
                    {attempt.heard
                      ? t("echoPractice.heard", { heard: attempt.heard })
                      : t("echoPractice.noWordsPickedUp")}
                    {t("echoPractice.checksWhichWord")}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-secondary border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <Mic className="size-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <p className="font-sans text-sm text-foreground font-medium">
              {t("echoPractice.browserCannotListen", { word: target.label })}
            </p>
          </div>
        )}

        <fieldset className="flex flex-col gap-2.5">
          <legend className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {t("echoPractice.howDidThatSound")}
          </legend>
          {SELF_RATINGS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={rating === option.id}
              onClick={() => {
                playClick();
                setRating(option.id);
              }}
              className={`w-full min-h-[52px] px-4 py-3 rounded-2xl border-2 font-sans font-bold text-sm text-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-colors ${
                rating === option.id
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-wp-card text-foreground hover:border-primary/50"
              }`}
            >
              {t(`echoPractice.ratings.${option.id}Label`)}
            </button>
          ))}
        </fieldset>

        {activeRating && (
          <div
            role="status"
            className="bg-wp-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-1.5"
          >
            <span className="font-sans font-bold text-foreground text-base">
              {t("echoPractice.youRated", {
                rating: t(`echoPractice.ratings.${activeRating.id}Label`),
              })}
            </span>
            <p className="font-sans text-xs text-muted-foreground">
              {t(`echoPractice.ratings.${activeRating.id}Response`)}
            </p>
          </div>
        )}

        <PrimaryButton
          label={t("echoPractice.nextWord")}
          onClick={() => dispatch({ type: "GO", to: "explore" })}
        />
      </main>
    </div>
  );
});

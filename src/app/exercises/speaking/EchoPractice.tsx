import { memo, useEffect, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { Mic, Volume2 } from "lucide-react";
import { useAudio } from "../../shared/useAudio";
import { useSound } from "../../shared/useSound";
import { useSpeechRecognition } from "../../shared/useSpeechRecognition";

interface Props {
  dispatch: React.Dispatch<Action>;
}

/**
 * Echo Practice.
 *
 * This screen once reported "92% Phoneme Match" from a hardcoded setScore(92),
 * with no microphone API anywhere in the codebase. It now uses the Web Speech
 * API to check whether the learner actually said the word.
 *
 * What it deliberately does NOT do is score pronunciation quality. The Web
 * Speech API exposes no phoneme-level detail, so any percentage would be
 * invented all over again. It reports one honest thing: the word was
 * recognised, or it was not. Where recognition is unavailable — Firefox, or a
 * blocked microphone — it falls back to self-assessment and says so plainly.
 */
type SelfRating = "again" | "close" | "confident";

const SELF_RATINGS: { id: SelfRating; label: string; response: string }[] = [
  { id: "again", label: "Not yet", response: "No problem — replay the model and echo it once more." },
  { id: "close", label: "Getting closer", response: "Keep going. Compare your stress pattern to the model." },
  { id: "confident", label: "Sounded right", response: "Nice. Try it once more at natural speed." },
];

export const ExSpeakingEchoPractice = memo(function ExSpeakingEchoPractice({ dispatch }: Props) {
  const [rating, setRating] = useState<SelfRating | null>(null);
  const { speak } = useAudio();
  const { playClick, playCorrect, playIncorrect } = useSound();
  const recognition = useSpeechRecognition({ lang: "en-US" });

  const target = BEDROOM_VOCABULARY[0];
  const activeRating = SELF_RATINGS.find((r) => r.id === rating);
  const { attempt, isListening, isSupported, status } = recognition;

  useEffect(() => {
    if (!attempt) return;
    if (attempt.matched) playCorrect();
    else playIncorrect();
  }, [attempt, playCorrect, playIncorrect]);

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader
        title="Echo Practice: Say It Aloud"
        current={1}
        total={8}
        onBack={() => dispatch({ type: "GO", to: "explore" })}
        onClose={() => dispatch({ type: "GO", to: "home" })}
      />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center text-center gap-3">
          <button
            type="button"
            onClick={() => speak(target.label)}
            aria-label={`Play the model pronunciation of ${target.label}`}
            className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Volume2 className="size-8" aria-hidden />
          </button>
          <h2 className="font-sans font-black text-foreground text-3xl">{target.label}</h2>
          <p className="font-sans text-muted-foreground text-sm font-medium">/{target.phonetic}/</p>
        </div>

        {isSupported ? (
          <>
            <button
              type="button"
              onClick={() => {
                playClick();
                if (isListening) recognition.stop();
                else recognition.listen(target.label);
              }}
              className={`w-full min-h-[56px] py-4 rounded-2xl font-sans font-bold flex items-center justify-center gap-3 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isListening
                  ? "bg-wp-rose text-wp-text-on-rose motion-safe:animate-pulse"
                  : "bg-wp-blue text-wp-text-on-blue"
              }`}
            >
              <Mic className="size-6" aria-hidden />
              <span>{isListening ? "Listening — tap to stop" : `Say ${target.label} aloud`}</span>
            </button>

            <div role="status" aria-live="polite" className="min-h-[2rem]">
              {status === "denied" && (
                <p className="font-sans text-sm text-wp-rose font-medium">
                  Microphone access was blocked. Allow it in your browser, or use the self-check below.
                </p>
              )}
              {status === "no-speech" && (
                <p className="font-sans text-sm text-muted-foreground font-medium">
                  Nothing was picked up. Try again a little louder.
                </p>
              )}
              {status === "error" && (
                <p className="font-sans text-sm text-muted-foreground font-medium">
                  Speech recognition is unavailable right now. Use the self-check below.
                </p>
              )}
              {attempt && (
                <div
                  className={`rounded-2xl border p-4 flex flex-col gap-1 ${
                    attempt.matched
                      ? "border-wp-green bg-wp-green-light/40"
                      : "border-wp-rose bg-wp-rose-light/40"
                  }`}
                >
                  <span className="font-sans font-bold text-foreground text-base">
                    {attempt.matched
                      ? `Recognised: ${target.label}.`
                      : "That did not come through as the target word."}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    {attempt.heard ? `Heard: ${attempt.heard}. ` : "No words recognised. "}
                    This checks which word you said, not how well you pronounced it.
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-secondary border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
            <Mic className="size-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <p className="font-sans text-sm text-foreground font-medium">
              This browser cannot listen to speech, so say <strong>{target.label}</strong> aloud and judge it
              yourself below.
            </p>
          </div>
        )}

        <fieldset className="flex flex-col gap-2.5">
          <legend className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
            How did that sound to you?
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
              {option.label}
            </button>
          ))}
        </fieldset>

        {activeRating && (
          <div
            role="status"
            className="bg-wp-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-1.5"
          >
            <span className="font-sans font-bold text-foreground text-base">
              You rated: {activeRating.label}
            </span>
            <p className="font-sans text-xs text-muted-foreground">{activeRating.response}</p>
          </div>
        )}

        <PrimaryButton label="Next Word" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

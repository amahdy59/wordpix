import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";
import { WordImage } from "../../shared/WordImage";
import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { SecondaryButton } from "../../shared/SecondaryButton";
import { Mic, Volume2, Sparkles, Trophy, Heart, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAudio } from "../../shared/useAudio";
import { useSound } from "../../shared/useSound";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Echo Practice (Pronunciation Drill)
export const ExSpeakingEchoPractice = memo(function ExSpeakingEchoPractice({ dispatch }: Props) {
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { speak } = useAudio();
  const { playCorrect } = useSound();

  const target = BEDROOM_VOCABULARY[0]; // Pillow

  const handleFinishRecord = () => {
    setRecording(false);
    setScore(92);
    playCorrect();
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Echo Practice: Waveform Drill" step={1} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center text-center gap-3">
          <button type="button" onClick={() => speak(target.label)} className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Volume2 className="size-8" />
          </button>
          <h2 className="font-sans font-black text-foreground text-3xl">{target.label}</h2>
          <p className="font-sans text-muted-foreground text-sm font-medium">/{target.phonetic}/</p>
        </div>

        <button
          type="button"
          onClick={() => (recording ? handleFinishRecord() : setRecording(true))}
          className={`py-5 rounded-2xl font-sans font-bold text-white flex items-center justify-center gap-3 transition-all ${
            recording ? "bg-rose-600 animate-pulse" : "bg-wp-blue"
          }`}
        >
          <Mic className="size-6" />
          <span>{recording ? "Recording Voice... Tap to Finish" : "Tap Microphone to Echo Target Word"}</span>
        </button>

        {score !== null && (
          <div className="bg-wp-card border border-wp-green/30 rounded-2xl p-5 flex flex-col items-center text-center gap-2">
            <span className="font-sans font-black text-wp-green text-3xl">{score}% Phoneme Match</span>
            <p className="font-sans text-xs text-muted-foreground">Great articulation on the initial consonant sound!</p>
          </div>
        )}

        <PrimaryButton label="Next Word" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 2. Scenario Response
export const ExSpeakingScenarioResponse = memo(function ExSpeakingScenarioResponse({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Scenario Response (Situational)" step={2} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col gap-3">
          <span className="font-sans font-bold text-xs text-wp-amber uppercase">B1 · Hotel Scenario</span>
          <h2 className="font-sans font-black text-2xl">Ask the hotel staff for an extra pillow</h2>
          <p className="font-sans text-white/70 text-xs">Cultural Tip: Use &ldquo;Could I please have...&rdquo; for polite requests.</p>
        </div>
        <PrimaryButton label="Start Recording Response" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 3. Photo Narration
export const ExSpeakingPhotoNarration = memo(function ExSpeakingPhotoNarration({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Photo Narration (Descriptive)" step={3} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="h-64 w-full rounded-3xl overflow-hidden border border-border shadow-wp-xs">
          <WordImage word={BEDROOM_VOCABULARY[0]} width="600" height="400" className="size-full object-cover" />
        </div>
        <div className="bg-wp-card border border-border rounded-2xl p-4">
          <span className="font-sans font-bold text-xs text-primary uppercase">Suggested Structure</span>
          <p className="font-sans text-xs text-foreground mt-1 font-semibold">1. Describe the room → 2. Mention furniture items → 3. Explain function</p>
        </div>
        <PrimaryButton label="Submit Photo Narration" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 4. Video Roleplay
export const ExSpeakingVideoRoleplay = memo(function ExSpeakingVideoRoleplay({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Video Roleplay Conversation" step={4} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-slate-950 text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 h-64">
          <span className="font-sans font-black text-wp-amber text-xl">YOUR TURN — SPEAK NOW!</span>
          <p className="font-sans text-white/70 text-xs">Say: &ldquo;I would like to purchase a lamp.&rdquo;</p>
        </div>
        <PrimaryButton label="Send Spoken Roleplay Response" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 5. Compare & Contrast
export const ExSpeakingCompareContrast = memo(function ExSpeakingCompareContrast({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Compare & Contrast Argumentation" step={5} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40 rounded-2xl overflow-hidden border border-border">
            <WordImage word={BEDROOM_VOCABULARY[0]} width="300" height="200" className="size-full object-cover" />
          </div>
          <div className="h-40 rounded-2xl overflow-hidden border border-border">
            <WordImage word={BEDROOM_VOCABULARY[1]} width="300" height="200" className="size-full object-cover" />
          </div>
        </div>
        <PrimaryButton label="Record Comparative Speech" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 6. Word Chain Arcade
export const ExSpeakingWordChain = memo(function ExSpeakingWordChain({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Word Chain Arcade Game" step={6} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between bg-wp-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-rose-500 font-sans font-bold text-sm">
            <Heart className="size-4 fill-rose-500" />
            <Heart className="size-4 fill-rose-500" />
            <Heart className="size-4 fill-rose-500" />
          </div>
          <span className="font-sans font-black text-wp-amber text-lg">🔥 8 Word Streak</span>
        </div>
        <PrimaryButton label="Record Next Word Entry" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 7. Self-Repair
export const ExSpeakingSelfRepair = memo(function ExSpeakingSelfRepair({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Self-Repair Error Correction" step={7} total={8} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-wp-rose/30 rounded-2xl p-5 flex flex-col gap-2">
          <span className="font-sans font-bold text-xs text-wp-rose uppercase">Detected Error</span>
          <p className="font-sans text-sm text-foreground">❌ &ldquo;The woman is go to bed.&rdquo;</p>
          <p className="font-sans text-sm font-bold text-wp-green">✓ &ldquo;The woman is going to bed.&rdquo;</p>
        </div>
        <PrimaryButton label="Record Correct Version" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 8. Speaking Results
export const ExSpeakingResults = memo(function ExSpeakingResults({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-wp-green-light border border-wp-green/30 flex items-center justify-center shadow-2xl mb-4">
        <Trophy className="size-12 text-wp-green" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Speaking Session Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Your spoken fluency improved by 12% this week!
      </p>
      <PrimaryButton label="Return to Explore Worlds" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

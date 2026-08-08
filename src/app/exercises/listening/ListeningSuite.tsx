import { memo, useState } from "react";
import type { Action } from "../../types";
import { BEDROOM_VOCABULARY } from "../../data/lessons";

import { LessonHeader } from "../../shared/LessonHeader";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { SecondaryButton } from "../../shared/SecondaryButton";
import { Volume2, Sparkles, Trophy, Mic, Clock } from "lucide-react";
import { useAudio } from "../../shared/useAudio";
import { useSound } from "../../shared/useSound";
import { useProgress } from "../../data/progress";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// 1. Word Match (Vocabulary Definition Matching)
export const ExListeningWordMatch = memo(function ExListeningWordMatch({ dispatch }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const { speak } = useAudio();
  const { playCorrect, playIncorrect } = useSound();

  const target = BEDROOM_VOCABULARY[0]; // Pillow
  const options = [
    { label: "A soft cushion used to support the head during sleep", correct: true },
    { label: "A large wooden cabinet for hanging clothing", correct: false },
    { label: "A small table placed beside a bed", correct: false },
    { label: "A heavy blanket used for warmth", correct: false },
  ];

  const handleCheck = () => {
    if (selectedIdx === null) return;
    setChecked(true);
    if (options[selectedIdx].correct) playCorrect();
    else playIncorrect();
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Word Match: Listening Definition" current={1} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-wp-xs">
          <button type="button" onClick={() => speak(target.label)} className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform">
            <Volume2 className="size-8" />
          </button>
          <div>
            <h2 className="font-sans font-black text-foreground text-3xl">{target.label}</h2>
            <p className="font-sans text-muted-foreground text-sm font-medium">/{target.phonetic}/</p>
          </div>
          <span className="font-sans text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
            Listen, then choose the definition
          </span>
        </div>

        <div role="radiogroup" aria-label="Select correct definition" className="flex flex-col gap-2.5">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`p-4 rounded-2xl border text-start font-sans font-semibold text-sm transition-all min-h-[52px] ${
                checked
                  ? opt.correct
                    ? "bg-wp-green-light border-wp-green text-wp-green"
                    : selectedIdx === idx
                    ? "bg-wp-rose-light border-wp-rose text-wp-rose"
                    : "bg-wp-card border-border opacity-50"
                  : selectedIdx === idx
                  ? "bg-secondary border-primary border-[2px] text-primary shadow-wp-xs"
                  : "bg-wp-card border-border text-foreground hover:border-primary/40"
              }`}
            >
              <span className="font-bold me-2">[{idx + 1}]</span> {opt.label}
            </button>
          ))}
        </div>

        {checked && (
          <div className="bg-wp-card border border-border rounded-2xl p-5 flex flex-col gap-2 shadow-wp-xs">
            <span className="font-sans font-bold text-xs text-primary uppercase tracking-wider">Etymology &amp; Rationale</span>
            <p className="font-sans text-sm text-foreground leading-relaxed">
              <strong>Pillow</strong> originates from Old English <em>pyle</em> (from Latin <em>pulvinus</em>). Used in contexts of sleep and furniture ergonomics.
            </p>
          </div>
        )}

        <PrimaryButton label={checked ? "Next Question →" : "Check Definition"} onClick={checked ? () => dispatch({ type: "GO", to: "explore" }) : handleCheck} />
      </main>
    </div>
  );
});

// 2. Audio Scene Match (Confidence Calibration)
export const ExListeningAudioSceneMatch = memo(function ExListeningAudioSceneMatch({ dispatch }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"guessing" | "fairly" | "certain">("fairly");
  const { playCorrect } = useSound();

  const scenes = [
    { label: "The Bedroom", icon: "🛌" },
    { label: "The Kitchen", icon: "🍳" },
    { label: "The Library", icon: "📚" },
    { label: "The Park", icon: "🌳" },
  ];

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Audio Scene Match & Confidence" current={2} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-panel text-wp-text-on-panel rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-md">
          <Volume2 className="size-10 text-wp-amber animate-pulse" />
          <h2 className="font-sans font-black text-2xl">Listen to Scene Soundscape</h2>
          <p className="font-sans text-white/70 text-xs">Identify which room or ambiance matches the audio clip.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {scenes.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(idx)}
              className={`p-5 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                selected === idx
                  ? "bg-secondary border-primary border-[2px] shadow-md scale-105"
                  : "bg-wp-card border-border hover:border-primary/40"
              }`}
            >
              <span className="text-4xl">{s.icon}</span>
              <span className="font-sans font-bold text-sm text-foreground">{s.label}</span>
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-3">
            <span className="font-sans font-bold text-xs text-muted-foreground uppercase">Self-Report Confidence Level (SM-2 Calibration)</span>
            <div className="grid grid-cols-3 gap-2">
              {(["guessing", "fairly", "certain"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setConfidence(level)}
                  className={`py-2 px-3 rounded-xl border text-xs font-sans font-bold capitalize transition-all ${
                    confidence === level ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {level === "guessing" ? "🤔 Guessing" : level === "fairly" ? "🙂 Fairly Sure" : "🎯 Certain"}
                </button>
              ))}
            </div>
          </div>
        )}

        <PrimaryButton label="Confirm Selection & Calibration" onClick={() => { playCorrect(); dispatch({ type: "GO", to: "explore" }); }} />
      </main>
    </div>
  );
});

// 3. Dictation Sprint
export const ExListeningDictationSprint = memo(function ExListeningDictationSprint({ dispatch }: Props) {
  const [typed, setTyped] = useState("");
  const [replays, setReplays] = useState(2);
  const { speak } = useAudio();
  const { playCorrect } = useSound();

  const handleReplay = () => {
    if (replays > 0) {
      setReplays((r) => r - 1);
      speak("The cat is sleeping on the blanket");
    }
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Dictation Sprint (Cloze Input)" current={3} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between bg-wp-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-wp-rose font-sans font-bold text-sm">
            <Clock className="size-4" />
            <span>0:42 Remaining</span>
          </div>
          <button type="button" onClick={handleReplay} disabled={replays === 0} className="px-3 min-h-[44px] rounded-xl bg-secondary text-primary font-sans font-bold text-xs border border-primary/20 disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary">
            Replays Left: {replays}/3
          </button>
        </div>

        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="font-sans font-bold text-foreground text-xl">
            &ldquo;The cat is sleeping on the <span className="underline text-primary decoration-primary decoration-2 underline-offset-4">{typed || "_______"}</span>.&rdquo;
          </h2>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type missing word..."
            className="w-full bg-background border border-border rounded-xl p-4 font-sans font-bold text-foreground text-base focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
          />
        </div>

        <PrimaryButton label="Submit Dictation" onClick={() => { playCorrect(); dispatch({ type: "GO", to: "explore" }); }} />
      </main>
    </div>
  );
});

// 4. Vocabulary Spotting
export const ExListeningVocabSpotting = memo(function ExListeningVocabSpotting({ dispatch }: Props) {
  const [spotted, setSpotted] = useState<string[]>([]);
  const { playCorrect } = useSound();

  const targetWords = ["pillow", "blanket", "nightstand"];

  const handleSpot = (word: string) => {
    if (!spotted.includes(word)) {
      setSpotted([...spotted, word]);
      playCorrect();
    }
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Continuous Vocabulary Spotting" current={4} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-panel text-wp-text-on-panel rounded-3xl p-6 flex flex-col items-center gap-3">
          <Sparkles className="size-8 text-wp-amber animate-pulse" />
          <h2 className="font-sans font-black text-2xl">Tap as you hear target words</h2>
          <p className="font-sans text-white/70 text-xs">Continuous Narration · {spotted.length}/{targetWords.length} Spotted</p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {targetWords.map((w) => {
            const isDone = spotted.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => handleSpot(w)}
                className={`px-4 py-3 rounded-2xl border font-sans font-bold text-sm transition-all ${
                  isDone ? "bg-wp-green text-wp-text-on-green border-wp-green scale-105" : "bg-wp-card border-border text-foreground hover:border-primary"
                }`}
              >
                {isDone ? `✓ ${w}` : `Tap when hearing "${w}"`}
              </button>
            );
          })}
        </div>

        <PrimaryButton label="Done Spotting" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 5. Dialogue Role-Play
export const ExListeningDialogueRolePlay = memo(function ExListeningDialogueRolePlay({ dispatch }: Props) {
  const [recording, setRecording] = useState(false);

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Dialogue Role-Play" current={5} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-4">
        <div className="bg-wp-card border border-border rounded-2xl p-4 flex flex-col gap-3">
          <div className="bg-secondary p-3 rounded-xl self-start max-w-[80%]">
            <span className="font-sans font-bold text-xs text-primary block">Host (British Model)</span>
            <p className="font-sans text-sm text-foreground font-semibold mt-1">&ldquo;Good morning! Is this your nightstand?&rdquo;</p>
          </div>
          <div className="bg-primary text-primary-foreground p-3 rounded-xl self-end max-w-[80%]">
            <span className="font-sans font-bold text-xs text-primary-foreground/80 block">Your Turn (Guest)</span>
            <p className="font-sans text-sm font-semibold mt-1">&ldquo;Yes, it is next to my bed.&rdquo;</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRecording(!recording)}
          className={`py-4 rounded-2xl font-sans font-bold text-white flex items-center justify-center gap-2 transition-all ${
            recording ? "bg-wp-rose animate-pulse" : "bg-wp-blue"
          }`}
        >
          <Mic className="size-5" />
          <span>{recording ? "Recording Voice... Tap to Finish" : "Tap Microphone to Speak Response"}</span>
        </button>

        <PrimaryButton label="Submit Recording" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 6. Selective Shadowing
export const ExListeningSelectiveShadowing = memo(function ExListeningSelectiveShadowing({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Selective Shadowing & Phoneme Analysis" current={6} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border border-border rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="font-sans font-black text-foreground text-xl">
            Repeat ONLY the highlighted target word:
          </h2>
          <p className="font-sans text-lg text-foreground leading-relaxed">
            The bedroom features an <span className="bg-wp-amber/20 text-wp-amber px-2 py-1 rounded-lg font-black border border-wp-amber/30">impeccable</span> wooden wardrobe.
          </p>
        </div>

        <div className="bg-wp-card border border-border rounded-2xl p-5 flex flex-col gap-2">
          <span className="font-sans font-bold text-sm text-foreground">Check your own stress pattern</span>
          <p className="font-sans text-xs text-muted-foreground">
            im·<strong className="text-foreground">pec</strong>·ca·ble — the stress falls on the second syllable. Replay
            the model and compare. WordPix does not listen to your voice, so this one is on your ear.
          </p>
        </div>

        <PrimaryButton label="Continue" onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

// 7. Lesson Results (Listening)
export const ExListeningResults = memo(function ExListeningResults({ dispatch }: Props) {
  const { progress } = useProgress();
  const strongWords = Object.values(progress.wordMemory).filter((w) => w.mastery === "strong").length;

  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-wp-amber/20 border border-wp-amber/30 flex items-center justify-center shadow-2xl mb-4">
        <Trophy className="size-12 text-wp-amber" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Listening Module Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Skill drills are practice, not graded work. Your totals below come from your lesson sessions.
      </p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-md my-6">
        <div className="bg-wp-card border border-border p-3 rounded-2xl">
          <p className="font-sans font-black text-2xl text-primary">{progress.xp}</p>
          <p className="font-sans text-[11px] text-muted-foreground">Total XP</p>
        </div>
        <div className="bg-wp-card border border-border p-3 rounded-2xl">
          <p className="font-sans font-black text-2xl text-wp-blue">{progress.streak}</p>
          <p className="font-sans text-[11px] text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-wp-card border border-border p-3 rounded-2xl">
          <p className="font-sans font-black text-2xl text-wp-green">{strongWords}</p>
          <p className="font-sans text-[11px] text-muted-foreground">Words Strong</p>
        </div>
      </div>
      <PrimaryButton label="Return to Explore Worlds" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});

// 8. Warm-up Review
export const ExListeningWarmupReview = memo(function ExListeningWarmupReview({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="30-Second Warm-up Refresher" current={8} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-card border-2 border-primary/40 rounded-3xl p-8 flex flex-col items-center text-center gap-4 shadow-wp-md">
          <span className="font-sans font-bold text-xs text-primary bg-secondary px-3 py-1 rounded-full border border-primary/20">
            Memory Refresher Flashcard
          </span>
          <h2 className="font-sans font-black text-foreground text-4xl">Dresser</h2>
          <p className="font-sans text-muted-foreground text-base">
            &ldquo;I keep my folded clothes inside the dresser drawers.&rdquo;
          </p>
        </div>
        <div className="flex gap-2">
          <SecondaryButton label="Skip Warm-up" onClick={() => dispatch({ type: "GO", to: "explore" })} />
          <PrimaryButton label="Lock in Memory (+10 XP)" onClick={() => dispatch({ type: "GO", to: "explore" })} />
        </div>
      </main>
    </div>
  );
});

// 9. Podcast Comprehension
export const ExListeningPodcastComprehension = memo(function ExListeningPodcastComprehension({ dispatch }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const topics = ["Furniture Design", "Sleep Hygiene", "Lighting Features", "Wardrobe Organization"];

  const toggleTopic = (t: string) => {
    if (selected.includes(t)) setSelected(selected.filter((item) => item !== t));
    else setSelected([...selected, t]);
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <LessonHeader title="Podcast Comprehension (Multi-Select)" current={9} total={9} onBack={() => dispatch({ type: "GO", to: "explore" })} onClose={() => dispatch({ type: "GO", to: "home" })} />
      <main className="flex-1 max-w-2xl mx-auto w-full p-5 flex flex-col gap-5">
        <div className="bg-wp-panel text-wp-text-on-panel rounded-3xl p-6 flex flex-col gap-3">
          <span className="font-sans font-bold text-xs text-wp-amber">Episode 14 · Bedroom Comfort</span>
          <h2 className="font-sans font-black text-2xl">Which topics were mentioned?</h2>
          <p className="font-sans text-white/70 text-xs">Select all topics discussed in the podcast audio snippet.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {topics.map((t) => {
            const isSel = selected.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTopic(t)}
                className={`p-4 rounded-2xl border text-start font-sans font-bold text-sm transition-all ${
                  isSel ? "bg-secondary border-primary border-[2px] text-primary shadow-xs" : "bg-wp-card border-border text-foreground"
                }`}
              >
                {isSel ? `✓ ${t}` : t}
              </button>
            );
          })}
        </div>

        <PrimaryButton label={`Submit Answers (${selected.length} Selected)`} onClick={() => dispatch({ type: "GO", to: "explore" })} />
      </main>
    </div>
  );
});

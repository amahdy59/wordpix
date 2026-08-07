import { memo, useState } from "react";
import type { Action, SkillCategory, SkillExerciseId } from "../types";
import { Headphones, BookOpen, Mic, PenTool, Sparkles, ArrowRight } from "lucide-react";
import { AppShell } from "../shared/AppShell";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface ExerciseDef {
  id: SkillExerciseId;
  title: string;
  category: SkillCategory;
  description: string;
}

const EXERCISES: ExerciseDef[] = [
  // Listening (9)
  { id: "listen-word-match", category: "listening", title: "1. Word Match (Definition)", description: "Listen to pronunciation and match definition with root etymology." },
  { id: "listen-audio-scene-match", category: "listening", title: "2. Audio Scene Match", description: "Match soundscape to 2x2 illustrated scenes with SM-2 confidence calibration." },
  { id: "listen-dictation-sprint", category: "listening", title: "3. Dictation Sprint", description: "Cloze text input with countdown timer and limited replays." },
  { id: "listen-vocab-spotting", category: "listening", title: "4. Vocabulary Spotting", description: "Tap target words as you hear continuous narration." },
  { id: "listen-dialogue-roleplay", category: "listening", title: "5. Dialogue Role-Play", description: "Chat-bubble model conversation with native speaker accent labels." },
  { id: "listen-selective-shadowing", category: "listening", title: "6. Selective Shadowing", description: "Waveform scrubber with phoneme accuracy scoring per word." },
  { id: "listen-results", category: "listening", title: "7. Listening Results", description: "Lesson completion summary with percentile leaderboard ranking." },
  { id: "listen-warmup-review", category: "listening", title: "8. Warm-up Refresher", description: "30-second flashcard review with memory strength indicators." },
  { id: "listen-podcast-comprehension", category: "listening", title: "9. Podcast Comprehension", description: "Multi-select topic chips based on podcast audio snippet." },

  // Reading (9)
  { id: "read-visual-context", category: "reading", title: "1. Visual Context", description: "Photo scene with multiple choice context clues and why-this-matters rationale." },
  { id: "read-progressive-reveal", category: "reading", title: "2. Progressive Reveal", description: "Sentence-by-sentence reading with tap-to-translate XP tooltips." },
  { id: "read-error-detection", category: "reading", title: "3. Error Detection", description: "Proofreading paragraph with tappable grammar errors." },
  { id: "read-comic-strip", category: "reading", title: "4. Comic Strip", description: "Sequential visual panel narrative with speech bubbles." },
  { id: "read-infographic", category: "reading", title: "5. Infographic Reading", description: "Data visualizations and charts with inline vocabulary definitions." },
  { id: "read-category-sort", category: "reading", title: "6. Category Sort", description: "Drag-and-drop word chips into category buckets." },
  { id: "read-results", category: "reading", title: "7. Reading Results", description: "Vocabulary gained cards and spaced repetition countdown." },
  { id: "read-subtitle-correction", category: "reading", title: "8. Subtitle Correction", description: "Video subtitle grammar error fixing." },
  { id: "read-confidence-check", category: "reading", title: "9. Confidence Check", description: "Pre-lesson self-assessment vocabulary pre-check." },

  // Speaking (8)
  { id: "speak-echo-practice", category: "speaking", title: "1. Echo Practice", description: "Side-by-side waveform comparison and syllable phoneme accuracy." },
  { id: "speak-scenario-response", category: "speaking", title: "2. Scenario Response", description: "Situational speaking prompt with cultural tips." },
  { id: "speak-photo-narration", category: "speaking", title: "3. Photo Narration", description: "Descriptive photo speaking guide with real-time vocabulary tracker." },
  { id: "speak-video-roleplay", category: "speaking", title: "4. Video Roleplay", description: "Interactive video roleplay with YOUR TURN voice recording." },
  { id: "speak-compare-contrast", category: "speaking", title: "5. Compare & Contrast", description: "Side-by-side photo comparison with live grammar structure detection." },
  { id: "speak-word-chain", category: "speaking", title: "6. Word Chain Arcade", description: "Fast-paced memory chain game with combo streaks and hearts." },
  { id: "speak-self-repair", category: "speaking", title: "7. Self-Repair", description: "Audio comparison of detected errors (❌ vs ✓) and re-recording." },
  { id: "speak-results", category: "speaking", title: "8. Speaking Results", description: "Lesson summary with fluency metrics and hesitation counts." },

  // Writing (9)
  { id: "write-caption-builder", category: "writing", title: "1. Caption Builder", description: "Guided image caption writing using word bank chips." },
  { id: "write-sentence-assembly", category: "writing", title: "2. Sentence Assembly Arcade", description: "Timed word tile ordering with combo multipliers." },
  { id: "write-photo-journal", category: "writing", title: "3. Photo Journal", description: "Free-form writing with real-time error underlines and rubric dot ratings." },
  { id: "write-video-summary", category: "writing", title: "4. Video Summary", description: "Academic summary writing with register style tips." },
  { id: "write-error-correction", category: "writing", title: "5. Error Correction", description: "Find & fix grammar paragraph with rule cards." },
  { id: "write-paraphrase-challenge", category: "writing", title: "6. Paraphrase Challenge", description: "Sentence rewriting with target word constraints." },
  { id: "write-image-story-chain", category: "writing", title: "7. Image Story Chain", description: "Sequential narrative writing with transition connectors." },
  { id: "write-results", category: "writing", title: "8. Writing Results", description: "Lesson summary with recurring mistakes flag list." },
  { id: "write-timed-sprint", category: "writing", title: "9. Timed Writing Sprint", description: "Arcade speed vocabulary typing with live score and streak fire." },
];

export const SkillExerciseHub = memo(function SkillExerciseHub({ dispatch }: Props) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("listening");

  const categoryExercises = EXERCISES.filter((e) => e.category === activeCategory);

  return (
    <AppShell activeTab="explore" dispatch={dispatch}>
      <div className="py-6 flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4 text-wp-amber" />
            <span>35 Multimodal Skill Exercises</span>
          </div>
          <h1 className="font-sans font-black text-foreground text-3xl md:text-4xl">
            Skill Exercise Hub
          </h1>
          <p className="font-sans text-muted-foreground text-sm max-w-xl">
            Select a learning category below to launch any of the 35 specialized Listening, Reading, Speaking, and Writing exercises.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-wp-card border border-border p-2 rounded-2xl">
          {[
            { id: "listening" as const, label: "Listening (9)", icon: Headphones },
            { id: "reading" as const, label: "Reading (9)", icon: BookOpen },
            { id: "speaking" as const, label: "Speaking (8)", icon: Mic },
            { id: "writing" as const, label: "Writing (9)", icon: PenTool },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCategory(id)}
              className={`p-3 rounded-xl flex items-center justify-center gap-2 font-sans font-bold text-xs transition-all ${
                activeCategory === id ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryExercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => dispatch({ type: "OPEN_SKILL_EXERCISE", exerciseId: ex.id })}
              className="bg-wp-card border border-border hover:border-primary rounded-2xl p-5 text-start flex flex-col justify-between gap-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all group shadow-wp-xs hover:shadow-md"
            >
              <div>
                <h2 className="font-sans font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  {ex.title}
                </h2>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mt-1.5">
                  {ex.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-sans font-bold text-primary">
                <span>Start Exercise</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
});

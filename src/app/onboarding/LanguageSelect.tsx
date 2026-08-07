import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { ArrowRight, Check, BookOpen, Target, Sparkles, Layers, HelpCircle } from "lucide-react";
import { useProgress } from "../data/progress";
import { PlacementQuizModal } from "./PlacementQuizModal";
import type { LearnerGoal } from "../context/LearnerContext";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const LEVELS = [
  { id: "a1", title: "Beginner", subtitle: "New to English vocabulary", tag: "A1" },
  { id: "a2", title: "Elementary", subtitle: "Know basic words already", tag: "A2" },
  { id: "b1", title: "Intermediate", subtitle: "Expanding everyday vocabulary", tag: "B1" },
];

const GOAL_OPTIONS: Array<{ id: LearnerGoal; label: string }> = [
  { id: "everyday", label: "Everyday English" },
  { id: "travel", label: "Travel & Vacations" },
  { id: "work", label: "Work & Career" },
  { id: "school", label: "School & Studies" },
  { id: "conversation", label: "Fluency & Chat" },
  { id: "kids", label: "Children's English" },
];

export function LanguageSelect({ dispatch }: Props) {
  const [level, setLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [goalMinutes, setGoalMinutes] = useState<number>(10);
  const [selectedGoal, setSelectedGoal] = useState<LearnerGoal>("everyday");
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const { setPreferences } = useProgress();

  const handleStart = () => {
    setPreferences(level, goalMinutes, selectedGoal);
    dispatch({ type: "ONBOARD_NEXT" });
  };

  const handlePlacementComplete = (recommendedLevel: "A1" | "A2" | "B1") => {
    setLevel(recommendedLevel);
  };

  return (
    <div className="bg-background flex flex-col md:flex-row min-h-svh md:min-h-[560px] relative overflow-hidden">
      <StatusBar />
      <PlacementQuizModal
        isOpen={isPlacementOpen}
        onClose={() => setIsPlacementOpen(false)}
        onCompleteLevel={handlePlacementComplete}
      />

      {/* ── Desktop Left Hero Column ────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 text-white relative overflow-hidden flex-col justify-between p-8 xl:p-12">
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-sans font-black text-white text-xl tracking-tight">WordPix</span>
        </div>

        <div className="relative z-10 flex flex-col gap-6 my-auto">
          <div className="size-16 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
            <Target className="size-8 text-wp-amber" />
          </div>
          <div>
            <h2 className="font-sans font-black text-3xl xl:text-4xl text-white leading-tight">
              Personalize Your Pace
            </h2>
            <p className="font-sans text-white/70 text-base mt-2 leading-relaxed">
              We adapt lesson depth and daily review schedules to match your selected proficiency level and daily practice commitment.
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-md flex items-center gap-3">
            <Sparkles className="size-6 text-wp-amber shrink-0" />
            <div className="text-xs font-sans text-white/90">
              <span className="font-bold">Daily Goal:</span> {goalMinutes} minutes per day keeps your vocabulary memory fresh!
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/60 text-xs font-sans font-semibold">
          <Layers className="size-4" />
          <span>Step 2 of 2: Learning Goal Configuration</span>
        </div>
      </div>

      {/* ── Right Column / Mobile Layout ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8 xl:p-12 min-h-svh md:min-h-0 overflow-y-auto">
        <header className="w-full flex items-center justify-between z-10 shrink-0 mb-4">
          <span className="font-sans font-black text-foreground text-lg tracking-tight">Your Goal</span>
          <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
            Step 2 of 2
          </span>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-start w-full max-w-md mx-auto md:mx-0 gap-6 z-10">
          <div>
            <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
              Choose Your Level
            </h1>
            <p className="font-sans text-muted-foreground text-sm mt-1">
              Pick your starting point and daily practice pace.
            </p>
          </div>

          {/* Level Cards */}
          <div role="radiogroup" aria-label="Select proficiency level" className="w-full flex flex-col gap-2.5">
            {LEVELS.map((item) => {
              const isSelected = level === item.tag;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setLevel(item.tag as "A1" | "A2" | "B1")}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between min-h-[60px] ${
                    isSelected
                      ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                      : "bg-wp-card border-border hover:border-primary/40"
                  } focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center font-sans font-black text-xs shrink-0 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {item.tag}
                    </div>
                    <div>
                      <p className="font-sans font-bold text-foreground text-base leading-tight">
                        {item.title}
                      </p>
                      <p className="font-sans text-muted-foreground text-xs mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="size-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsPlacementOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-sans font-bold text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <HelpCircle className="size-4" />
              <span>I&apos;m not sure — test my level</span>
            </button>
          </div>

          {/* Learning Goal Selector */}
          <div className="w-full flex flex-col gap-2">
            <label className="font-sans font-bold text-foreground text-sm">
              Why are you learning?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-sans font-semibold transition-all min-h-[44px] text-center ${
                    selectedGoal === g.id
                      ? "bg-secondary border-primary border-[2px] text-primary font-bold shadow-xs"
                      : "bg-wp-card border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="w-full max-w-md mx-auto md:mx-0 pt-4 shrink-0 z-10">
          <button
            type="button"
            onClick={handleStart}
            className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="size-5" />
          </button>
        </footer>

        <div className="md:hidden shrink-0">
          <HomeIndicator />
        </div>
      </div>
    </div>
  );
}

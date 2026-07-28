import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { Target, Clock, ArrowRight, Check } from "lucide-react";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const LEVELS = [
  { id: "a1", name: "Beginner A1", desc: "First time learning English vocabulary" },
  { id: "a2", name: "Elementary A2", desc: "Know basic words, want to expand vocabulary" },
  { id: "b1", name: "Intermediate B1", desc: "Fluent in basics, target practical words" },
];

const GOALS = [
  { id: "5min", name: "Casual", time: "5 mins / day", xp: "+50 XP" },
  { id: "10min", name: "Regular", time: "10 mins / day", xp: "+100 XP" },
  { id: "15min", name: "Intense", time: "15 mins / day", xp: "+150 XP" },
];

export function LanguageSelect({ dispatch }: Props) {
  const [level, setLevel] = useState<string>("a1");
  const [goal, setGoal] = useState<string>("10min");

  return (
    <div className="bg-background content-stretch flex flex-col items-center justify-between min-h-svh relative overflow-hidden">
      <StatusBar />

      {/* Header step indicator */}
      <header className="w-full max-w-md px-6 pt-4 flex items-center justify-between z-10">
        <span className="font-sans font-bold text-foreground text-sm">Set Your Goal</span>
        <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
          Step 2 of 3
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full max-w-md px-6 py-4 overflow-y-auto gap-6 z-10">
        {/* Section 1: Proficiency Level */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <h2 className="font-sans font-bold text-foreground text-base">Select Your Starting Level</h2>
          </div>

          <div role="radiogroup" aria-label="Select proficiency level" className="flex flex-col gap-2">
            {LEVELS.map((item) => {
              const isSelected = level === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setLevel(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between min-h-[52px] ${
                    isSelected
                      ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                      : "bg-wp-card border-border hover:border-primary/40"
                  } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
                >
                  <div>
                    <p className={`font-sans font-bold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {item.name}
                    </p>
                    <p className="font-sans text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="size-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Daily Commitment Goal */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-wp-amber" />
            <h2 className="font-sans font-bold text-foreground text-base">Choose Daily Practice Goal</h2>
          </div>

          <div role="radiogroup" aria-label="Select daily commitment goal" className="grid grid-cols-3 gap-2">
            {GOALS.map((item) => {
              const isSelected = goal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setGoal(item.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 min-h-[64px] ${
                    isSelected
                      ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                      : "bg-wp-card border-border hover:border-primary/40"
                  } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
                >
                  <span className={`font-sans font-bold text-xs ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {item.name}
                  </span>
                  <span className="font-sans text-muted-foreground text-[11px]">{item.time}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="w-full max-w-md px-6 pb-8 pt-2 flex flex-col gap-3 z-10">
        <button
          type="button"
          onClick={() => dispatch({ type: "ONBOARD_NEXT" })}
          className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
}

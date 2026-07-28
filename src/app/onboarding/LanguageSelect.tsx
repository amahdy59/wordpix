import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { ArrowRight, Check } from "lucide-react";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const LEVELS = [
  { id: "a1", title: "Beginner", subtitle: "New to English vocabulary", tag: "A1" },
  { id: "a2", title: "Elementary", subtitle: "Know basic words already", tag: "A2" },
  { id: "b1", title: "Intermediate", subtitle: "Expanding everyday vocabulary", tag: "B1" },
];

const GOALS = [
  { id: "5min", label: "5 mins / day" },
  { id: "10min", label: "10 mins / day" },
  { id: "15min", label: "15 mins / day" },
];

export function LanguageSelect({ dispatch }: Props) {
  const [level, setLevel] = useState<string>("a1");
  const [goal, setGoal] = useState<string>("10min");

  return (
    <div className="bg-background content-stretch flex flex-col items-center justify-between min-h-svh relative overflow-hidden">
      <StatusBar />

      {/* Header step indicator */}
      <header className="w-full max-w-md px-6 pt-5 flex items-center justify-between z-10">
        <span className="font-sans font-black text-foreground text-lg tracking-tight">Your Goal</span>
        <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Step 2 of 2
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-start w-full max-w-md px-6 py-4 overflow-y-auto gap-6 z-10">
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
            const isSelected = level === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setLevel(item.id)}
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
        </div>

        {/* Daily Goal Segment Control */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-sans font-bold text-foreground text-sm">
            Daily Goal
          </label>
          <div role="radiogroup" aria-label="Select daily practice goal" className="grid grid-cols-3 gap-2">
            {GOALS.map((item) => {
              const isSelected = goal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setGoal(item.id)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all min-h-[48px] flex items-center justify-center ${
                    isSelected
                      ? "bg-secondary border-primary border-[2px] text-primary font-bold shadow-wp-xs"
                      : "bg-wp-card border-border text-muted-foreground font-semibold hover:border-primary/40"
                  } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
                >
                  <span className="font-sans text-xs">{item.label}</span>
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
          <span>Start Learning</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
}

import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { ArrowRight, Check, Compass } from "lucide-react";

const imgFurniture = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgFood      = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgSports    = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgMusic     = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgScience   = "https://images.unsplash.com/photo-1507668077129-56e32842fceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgTravel    = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface Interest {
  id: string;
  label: string;
  desc: string;
  img: string;
}

const INTERESTS: Interest[] = [
  { id: "bedroom", label: "Home & Furniture", desc: "Bedrooms, living rooms & decor", img: imgFurniture },
  { id: "food",    label: "Food & Dining",    desc: "Kitchen, meals & ingredients",  img: imgFood },
  { id: "sports",  label: "Sports & Fitness",  desc: "Activities, games & health",   img: imgSports },
  { id: "music",   label: "Music & Arts",     desc: "Instruments, painting & show",  img: imgMusic },
  { id: "science", label: "Science & Tech",   desc: "Computers, space & gadgetry",   img: imgScience },
  { id: "travel",  label: "Travel & Places",  desc: "Airports, hotels & nature",     img: imgTravel },
];

export function InterestSelect({ dispatch }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["bedroom", "travel"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-background content-stretch flex flex-col items-center justify-between min-h-svh relative overflow-hidden">
      <StatusBar />

      {/* Header step indicator */}
      <header className="w-full max-w-md px-6 pt-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-primary" />
          <span className="font-sans font-bold text-foreground text-sm">Choose Your Topics</span>
        </div>
        <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
          Step 3 of 3
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full max-w-md px-6 py-4 overflow-y-auto gap-4 z-10">
        <div className="text-center w-full mb-1">
          <h1 className="font-sans font-bold text-foreground text-xl">What topics interest you most?</h1>
          <p className="font-sans text-muted-foreground text-xs mt-1">Select one or more to personalize your learning trajectory</p>
        </div>

        <div
          role="group"
          aria-label="Topics of interest"
          className="grid grid-cols-2 gap-3 w-full"
        >
          {INTERESTS.map(({ id, label, desc, img }) => {
            const isActive = selected.has(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggle(id)}
                className={`relative flex flex-col gap-2 p-3 rounded-2xl border text-left transition-all min-h-[110px] ${
                  isActive
                    ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                    : "bg-wp-card border-border hover:border-primary/40"
                } focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary`}
              >
                <div className="h-16 relative rounded-xl w-full overflow-hidden bg-muted">
                  <img
                    alt=""
                    className="absolute inset-0 object-cover size-full"
                    src={img}
                  />
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 size-6 rounded-full bg-primary flex items-center justify-center shadow-wp-xs">
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <p className={`font-sans font-bold text-xs truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </p>
                  <p className="font-sans text-muted-foreground text-[10px] truncate mt-0.5">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="w-full max-w-md px-6 pb-8 pt-2 flex flex-col gap-3 z-10">
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() => dispatch({ type: "ONBOARD_NEXT" })}
          className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 disabled:opacity-50 rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Complete Setup</span>
          <ArrowRight className="size-5" />
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
}

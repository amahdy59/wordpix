import { memo } from "react";
import { Lock, CheckCircle2, Compass } from "lucide-react";
import type { Action } from "../types";

const imgBedroom  = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgBathroom = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgKitchen  = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgLiving   = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface World {
  id: string;
  name: string;
  img: string;
  status: "complete" | "active" | "locked";
  progress: number;
  wordCount: number;
}

const WORLDS: World[] = [
  { id: "bedroom",  name: "The Bedroom",  img: imgBedroom,  status: "active",   progress: 40,  wordCount: 56 },
  { id: "bathroom", name: "Bathroom",     img: imgBathroom, status: "locked",   progress: 0,   wordCount: 30 },
  { id: "kitchen",  name: "Kitchen",      img: imgKitchen,  status: "locked",   progress: 0,   wordCount: 45 },
  { id: "living",   name: "Living Room",  img: imgLiving,   status: "locked",   progress: 0,   wordCount: 40 },
];

interface StatusCfg {
  label: string;
  textClass: string;
  bgClass: string;
}

const STATUS_CONFIG: Record<World["status"], StatusCfg> = {
  complete: { label: "Completed",   textClass: "text-wp-green",   bgClass: "bg-wp-green-light" },
  active:   { label: "In Progress", textClass: "text-primary",    bgClass: "bg-secondary"      },
  locked:   { label: "Locked",      textClass: "text-muted-foreground", bgClass: "bg-muted"    },
};

export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <Compass className="size-5" />
          <span className="font-sans font-bold text-xs uppercase tracking-wider">Level 1 Worlds</span>
        </div>
        <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
          Explore Worlds
        </h1>
        <p className="font-sans font-medium text-muted-foreground text-sm">
          Select an interactive visual world to explore real-life objects and expand your vocabulary
        </p>
      </header>

      {/* Worlds grid */}
      <section aria-label="Learning worlds">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {WORLDS.map((world) => {
            const isLocked = world.status === "locked";
            const cfg = STATUS_CONFIG[world.status];

            return (
              <button
                key={world.id}
                type="button"
                onClick={() => !isLocked && dispatch({ type: "GO", to: "lesson-entry" })}
                disabled={isLocked}
                aria-label={`${world.name}: ${cfg.label}${world.status === "active" ? `, ${world.progress}% complete` : ""}`}
                className={`bg-wp-card rounded-2xl border border-border overflow-hidden text-left shadow-wp-xs ${
                  isLocked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:border-primary/40 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-all"
                }`}
              >
                {/* World thumbnail */}
                <div className="h-32 md:h-36 relative w-full bg-muted">
                  <img
                    alt={world.name}
                    className="absolute inset-0 object-cover size-full"
                    src={world.img}
                  />
                  {isLocked && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
                      aria-hidden
                    >
                      <Lock className="size-6" />
                    </div>
                  )}
                  {world.status === "complete" && (
                    <div
                      className="absolute top-2.5 right-2.5 bg-wp-green text-white rounded-full p-1 shadow-wp-xs"
                      aria-hidden
                    >
                      <CheckCircle2 className="size-4" />
                    </div>
                  )}
                </div>

                {/* World info */}
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-sans font-bold text-foreground text-base leading-tight">
                        {world.name}
                      </p>
                      <p className="font-sans font-medium text-muted-foreground text-xs mt-0.5">
                        {world.wordCount} vocabulary items
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 self-start ${cfg.bgClass}`}>
                    <span className={`font-sans font-bold text-[11px] ${cfg.textClass}`}>
                      {world.status === "active" ? `${world.progress}% Complete` : cfg.label}
                    </span>
                  </div>

                  {/* Progress bar for active worlds */}
                  {world.status === "active" && (
                    <div
                      className="bg-muted rounded-full h-2 w-full overflow-hidden mt-1"
                      role="progressbar"
                      aria-valuenow={world.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${world.name} progress: ${world.progress}%`}
                    >
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${world.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
});

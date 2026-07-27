import { memo } from "react";
import type { Action } from "../types";

import imgBedroom  from "@/imports/FlowOnboardingCoreNavigation-1/bca64c80583aadd7c951cd61795a275ea4f47a1f.png";
import imgBathroom from "@/imports/FlowOnboardingCoreNavigation-1/bed8732059923a7b53431ce0e7038f489e831c43.png";
import imgKitchen  from "@/imports/FlowOnboardingCoreNavigation-1/aeaf5c57d398002797733c2a38e5bda540787f32.png";
import imgLiving   from "@/imports/FlowOnboardingCoreNavigation-1/8b22e4629aeb706ae3eee56ea4229f88b7af9b1c.png";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface World {
  id: string;
  name: string;
  ar: string;
  img: string;
  status: "complete" | "active" | "locked";
  progress: number;
  wordCount: number;
}

const WORLDS: World[] = [
  { id: "bedroom",  name: "The Bedroom",  ar: "غرفة النوم",  img: imgBedroom,  status: "complete", progress: 100, wordCount: 20 },
  { id: "bathroom", name: "Bathroom",     ar: "الحمام",       img: imgBathroom, status: "active",   progress: 40,  wordCount: 20 },
  { id: "kitchen",  name: "Kitchen",      ar: "المطبخ",       img: imgKitchen,  status: "locked",   progress: 0,   wordCount: 20 },
  { id: "living",   name: "Living Room",  ar: "غرفة المعيشة", img: imgLiving,   status: "locked",   progress: 0,   wordCount: 20 },
];

interface StatusCfg {
  label: string;
  textClass: string;
  bgClass: string;
}

const STATUS_CONFIG: Record<World["status"], StatusCfg> = {
  complete: { label: "Complete",    textClass: "text-accent",          bgClass: "bg-wp-green-light" },
  active:   { label: "In Progress", textClass: "text-primary",         bgClass: "bg-secondary"      },
  locked:   { label: "Locked",      textClass: "text-muted-foreground", bgClass: "bg-muted"         },
};

/**
 * Explore worlds screen — rendered inside AppShell.
 * Grid: 2 cols mobile → 3 cols tablet → 4 cols desktop.
 */
export const ExploreWorlds = memo(function ExploreWorlds({ dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8">
      {/* Page header */}
      <header>
        <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight">
          Explore Worlds
        </h1>
        <p
          className="font-arabic font-bold text-primary text-lg md:text-xl"
          dir="auto"
          lang="ar"
        >
          استكشف العوالم
        </p>
        <p className="font-sans font-medium text-muted-foreground text-sm mt-1">
          Level 1 — Choose a world to begin your journey
        </p>
      </header>

      {/* Worlds grid */}
      <section aria-label="Learning worlds">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {WORLDS.map((world) => {
            const isLocked = world.status === "locked";
            const cfg = STATUS_CONFIG[world.status];

            return (
              /* using <button> instead of a kit Card component: needs disabled + onClick dispatch */
              <button
                key={world.id}
                onClick={() => !isLocked && dispatch({ type: "GO", to: "lesson-entry" })}
                disabled={isLocked}
                aria-label={`${world.name}: ${cfg.label}${world.status === "active" ? `, ${world.progress}% complete` : ""}`}
                className={`bg-wp-card rounded-2xl border border-border overflow-hidden text-left shadow-wp-xs ${
                  isLocked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-wp-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-shadow"
                }`}
              >
                {/* World thumbnail */}
                <div className="h-28 md:h-32 lg:h-36 relative w-full">
                  <img
                    alt={world.name}
                    className="absolute inset-0 object-cover size-full"
                    src={world.img}
                  />
                  {isLocked && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/30"
                      aria-hidden
                    >
                      <span className="text-3xl">🔒</span>
                    </div>
                  )}
                  {world.status === "complete" && (
                    <div
                      className="absolute top-2 right-2 bg-accent text-primary-foreground rounded-full size-7 flex items-center justify-center"
                      aria-hidden
                    >
                      <span className="font-sans font-black text-sm">✓</span>
                    </div>
                  )}
                </div>

                {/* World info */}
                <div className="p-3 flex flex-col gap-2">
                  <p className="font-sans font-semibold text-foreground text-sm leading-tight">
                    {world.name}
                  </p>
                  <p
                    className="font-arabic text-muted-foreground text-xs"
                    dir="auto"
                    lang="ar"
                  >
                    {world.ar}
                  </p>

                  {/* Status badge */}
                  <div className={`inline-flex items-center rounded-full px-2 py-0.5 self-start ${cfg.bgClass}`}>
                    <span className={`font-sans font-semibold text-[10px] ${cfg.textClass}`}>
                      {world.status === "active" ? `${world.progress}%` : cfg.label}
                    </span>
                  </div>

                  {/* Progress bar for active worlds */}
                  {world.status === "active" && (
                    <div
                      className="bg-muted rounded-full h-1.5 w-full overflow-hidden"
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

                  <p className="font-sans font-medium text-muted-foreground text-[10px]">
                    {world.wordCount} words
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
});

import { memo, useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { LESSON_WORLDS, DEFAULT_WORLD_ID } from "../data/lessons";
import { useProgress } from "../data/progress";

interface Props {
  worldId?: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonWorldEntry = memo(function LessonWorldEntry({ worldId, dispatch }: Props) {
  const world = LESSON_WORLDS[worldId ?? DEFAULT_WORLD_ID];
  const [selectedGroupId, setSelectedGroupId] = useState<string>(world.groups[0].id);
  const { progress } = useProgress();

  const selectedGroup = world.groups.find((g) => g.id === selectedGroupId) ?? world.groups[0];

  const handleStartGroup = (gId: string) => {
    const group = world.groups.find((g) => g.id === gId) ?? world.groups[0];
    dispatch({ type: "START_LESSON", groupId: group.id, wordQueue: group.wordIds });
  };

  return (
    <div className="bg-background flex flex-col min-h-svh lg:flex-row lg:overflow-hidden relative">
      <StatusBar />

      {/* ── Desktop Left: Hero Image ─────────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 shrink-0 relative overflow-hidden">
        <img
          alt={`${world.name} visual scene`}
          className="absolute inset-0 object-cover size-full"
          src={world.heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />

        <div className="absolute bottom-8 start-8 flex flex-col gap-2">
          <span className="font-sans font-bold text-xs text-white bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 self-start">
            Rosetta Stone Group Learning
          </span>
          <h2 className="font-sans font-black text-white text-3xl">{world.name} World</h2>
          <p className="font-sans text-white/70 text-sm max-w-sm">
            Learn thematic word groups through visual discovery, audio drills, and interactive sentence building.
          </p>
        </div>
      </div>

      {/* ── Right / Mobile: Group Selector + Info + CTA ────────────────────── */}
      <div className="flex-1 flex flex-col justify-between min-h-svh lg:min-h-0">
        {/* Header Bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-wp-card shrink-0">
          <div className="flex items-center gap-3">
            <BackButton onClick={() => dispatch({ type: "GO", to: "explore" })} />
            <div>
              <h1 className="font-sans font-black text-foreground text-lg leading-none">
                {world.name}
              </h1>
              <p className="font-sans text-muted-foreground text-xs mt-0.5">Select a Group to Learn</p>
            </div>
          </div>
          <span className="font-sans font-semibold text-xs bg-secondary text-primary px-3 py-1 rounded-full border border-primary/20">
            Level 1 · A1
          </span>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-5 p-5 lg:p-8 overflow-y-auto">
          {/* Mobile hero image */}
          <div className="lg:hidden h-40 sm:h-48 relative rounded-2xl w-full overflow-hidden border border-border shadow-sm shrink-0">
            <img
              alt={`${world.name} visual scene`}
              className="absolute inset-0 object-cover size-full"
              src={world.heroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden />
            <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-white">
              <span className="font-sans font-bold text-sm">{world.name} Word Groups</span>
              <span className="font-sans text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">
                {world.groups.length} Groups
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider">
              <Layers className="size-4" />
              <span>Rosetta Stone Group Learning</span>
            </div>
            <h2 className="font-sans font-black text-foreground text-2xl leading-tight">
              Select a Word Group
            </h2>
            <p className="font-sans text-muted-foreground text-sm">
              Each group teaches 5 related vocabulary words across all 5 exercise steps.
            </p>
          </div>

          {/* Group Selection Cards */}
          <div role="radiogroup" aria-label="Select word group" className="flex flex-col gap-3">
            {world.groups.map((g) => {
              const isSelected = selectedGroupId === g.id;

              // Calc group progress from useProgress
              const groupWords = g.wordIds.map((id) => world.vocabulary.find((v) => v.id === id)).filter(Boolean);
              const masteredInGroup = groupWords.filter((w) => (progress.wordMastery[w!.id] || 0) >= 2).length;

              return (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`bg-wp-card rounded-2xl border p-4 text-start transition-all flex items-center justify-between min-h-[72px] ${
                    isSelected
                      ? "border-primary border-[2px] bg-secondary shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`size-11 rounded-xl flex items-center justify-center font-sans font-bold text-sm shrink-0 border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <Layers className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-sans font-bold text-foreground text-base leading-tight">{g.name}</p>
                        {masteredInGroup === g.wordIds.length && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-wp-green bg-wp-green-light px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="size-3" />
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-muted-foreground text-xs mt-0.5">{g.description}</p>
                    </div>
                  </div>

                  <span className="font-sans font-bold text-xs text-primary bg-secondary border border-primary/20 px-2.5 py-1 rounded-full shrink-0">
                    {g.wordIds.length} Words
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        {/* Pinned CTA */}
        <footer className="w-full px-5 lg:px-8 pb-8 pt-4 shrink-0 bg-background border-t border-border/60">
          <button
            type="button"
            onClick={() => handleStartGroup(selectedGroupId)}
            className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-4 font-sans font-bold text-wp-text-on-blue text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="size-5" />
            <span>Start Learning &ldquo;{selectedGroup.name}&rdquo; Group</span>
            <ArrowRight className="size-5" />
          </button>
        </footer>
        <HomeIndicator />
      </div>
    </div>
  );
});

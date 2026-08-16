import { memo, useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { COURSE_UNITS, DEFAULT_UNIT_ID } from "../data/lessons";
import { useProgress } from "../data/progress";

interface Props {
  unitId?: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonWorldEntry = memo(function LessonWorldEntry({ unitId, dispatch }: Props) {
  const world = COURSE_UNITS[unitId ?? DEFAULT_UNIT_ID];
  const { progress } = useProgress();

  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    const isMastered = (id: string) => (progress.wordMastery[id] || 0) >= 3;
    const nextGroup = world.groups.find((g) => g.wordIds.some((id) => !isMastered(id)));
    return nextGroup ? nextGroup.id : world.groups[world.groups.length - 1].id;
  });

  const selectedGroup = world.groups.find((g) => g.id === selectedGroupId) ?? world.groups[0];

  const handleStartGroup = (gId: string) => {
    const group = world.groups.find((g) => g.id === gId) ?? world.groups[0];
    dispatch({ type: "START_LESSON", lessonId: group.id, mode: "NEW_LESSON", wordQueue: group.wordIds });
  };

  return (
    <div className="bg-background flex flex-col min-h-svh relative">
      <StatusBar />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 border-b border-border bg-wp-card shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => dispatch({ type: "GO", to: "explore" })} />
          <div>
            <h1 className="font-sans font-black text-foreground text-xl leading-none">
              {world.name}
            </h1>
            <p className="font-sans text-muted-foreground text-xs mt-1">Select a Group to Learn</p>
          </div>
        </div>
        <span className="font-sans font-semibold text-xs bg-secondary text-primary px-3 py-1.5 rounded-full border border-primary/20">
          Level 1 · A1
        </span>
      </header>

      {/* Main Timeline Layout */}
      <main className="flex-1 flex flex-col p-5 lg:p-8 w-full max-w-3xl mx-auto overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider">
            <Layers className="size-4" />
            <span>WordPix Immersion</span>
          </div>
          <h2 className="font-sans font-black text-foreground text-3xl leading-tight">
            Select a Word Group
          </h2>
          <p className="font-sans text-muted-foreground text-sm max-w-md mt-1">
            Follow the learning path. Each group teaches a set of related vocabulary words across interactive exercises.
          </p>
        </div>

        {/* Timeline container */}
        <div role="radiogroup" aria-label="Select word group" className="relative flex flex-col gap-6 ps-2 pb-32">
          {/* Continuous vertical line */}
          <div className="absolute top-4 bottom-4 start-[21px] w-[2px] bg-border" aria-hidden />

          {world.groups.map((g, index) => {
            const isSelected = selectedGroupId === g.id;

            // Calc group progress from useProgress
            const groupWords = g.wordIds.map((id) => world.vocabulary.find((v) => v.id === id)).filter(Boolean);
            const masteredInGroup = groupWords.filter((w) => (progress.wordMastery[w!.id] || 0) >= 3).length;
            const isCompleted = masteredInGroup === g.wordIds.length;

            return (
              <div key={g.id} className="relative flex items-stretch gap-5 lg:gap-8 group">
                {/* Timeline Node */}
                <div 
                  className={`relative z-10 flex shrink-0 items-center justify-center size-10 rounded-full border-2 bg-background transition-colors duration-300 mt-2 ${
                    isSelected
                      ? "border-primary text-primary"
                      : isCompleted
                      ? "border-wp-green text-wp-green"
                      : "border-border text-muted-foreground group-hover:border-primary/50"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="size-5" /> : <span className="font-sans font-bold text-sm">{index + 1}</span>}
                </div>

                {/* Group Card */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`flex-1 bg-wp-card rounded-2xl border p-5 text-start transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-h-[88px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isSelected
                      ? "border-primary border-[2px] bg-secondary shadow-md lg:scale-[1.02]"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`hidden sm:flex size-12 rounded-xl items-center justify-center font-sans font-bold text-sm shrink-0 border transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 text-muted-foreground border-border/50"
                      }`}
                    >
                      <Layers className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-sans font-bold text-lg leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {g.name}
                        </p>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-wp-green bg-wp-green-light px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-muted-foreground text-sm mt-1">{g.description}</p>
                    </div>
                  </div>

                  <span className={`font-sans font-bold text-xs px-3.5 py-1.5 rounded-full shrink-0 border transition-colors ${
                    isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-primary border-primary/20'
                  }`}>
                    {g.wordIds.length} Words
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Pinned CTA in center layout */}
      <div className="fixed bottom-0 inset-x-0 pointer-events-none z-50 pb-safe">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 pb-5 pt-12 bg-gradient-to-t from-background via-background/90 to-transparent flex flex-col pointer-events-auto">
          <button
            type="button"
            onClick={() => handleStartGroup(selectedGroupId)}
            className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-2xl py-4 font-sans font-bold text-wp-text-on-blue text-lg min-h-[60px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              shadow-lg shadow-wp-blue/20 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <BookOpen className="size-5" />
            <span>Start Learning &ldquo;{selectedGroup.name}&rdquo;</span>
            <ArrowRight className="size-5" />
          </button>
          <HomeIndicator />
        </div>
      </div>
    </div>
  );
});

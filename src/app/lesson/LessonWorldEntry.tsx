import { memo, useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";
import { ArrowRight, Layers, CheckCircle2, GraduationCap } from "lucide-react";
import { COURSE_UNITS, DEFAULT_UNIT_ID } from "../data/lessons";
import { useProgress } from "../data/progress";

interface Props {
  unitId?: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonWorldEntry = memo(function LessonWorldEntry({ unitId, dispatch }: Props) {
  const world = COURSE_UNITS[unitId ?? DEFAULT_UNIT_ID];
  const { progress } = useProgress();

  const [nextGroupId] = useState<string>(() => {
    const isMastered = (id: string) => (progress.wordMastery[id] || 0) >= 3;
    const nextGroup = world.groups.find((g) => g.wordIds.some((id) => !isMastered(id)));
    return nextGroup ? nextGroup.id : world.groups[world.groups.length - 1].id;
  });

  const handleStartGroup = (gId: string) => {
    const group = world.groups.find((g) => g.id === gId) ?? world.groups[0];
    dispatch({
      type: "START_LESSON",
      lessonId: group.id,
      unitId: world.id,
      mode: "NEW_LESSON",
      wordQueue: group.wordIds,
    });
  };

  const handleTakeAssessment = () => {
    // Select up to 20 random words from the unit
    const allWordIds = world.vocabulary.map((v) => v.id);
    const shuffled = [...allWordIds].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);

    dispatch({
      type: "START_LESSON",
      lessonId: world.groups[0].id, // fallback lessonId
      unitId: world.id,
      mode: "UNIT_ASSESSMENT",
      wordQueue: selected,
    });
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
          <p className="font-sans text-muted-foreground text-sm max-w-md mt-1 mb-4">
            Follow the learning path. Each group teaches a set of related vocabulary words across
            interactive exercises.
          </p>

          <button
            type="button"
            onClick={handleTakeAssessment}
            className="group cursor-pointer min-h-[60px] relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 text-start transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <p className="font-sans font-bold text-lg text-primary leading-tight">
                  Test out of this unit
                </p>
                <p className="font-sans text-muted-foreground text-sm mt-1">
                  Already know these words? Pass a 20-word test to skip ahead.
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Timeline container */}
        <div className="relative flex flex-col gap-6 ps-2 pb-16">
          {/* Continuous vertical line */}
          <div className="absolute top-4 bottom-4 start-[27px] w-[2px] bg-border" aria-hidden />

          {world.groups.map((g, index) => {
            const isNextToStudy = nextGroupId === g.id;

            // Calc group progress from useProgress
            const groupWords = g.wordIds
              .map((id) => world.vocabulary.find((v) => v.id === id))
              .filter(Boolean);
            const masteredInGroup = groupWords.filter(
              (w) => (progress.wordMastery[w!.id] || 0) >= 3
            ).length;
            const isCompleted = masteredInGroup === g.wordIds.length;
            const progressPct =
              g.wordIds.length > 0 ? Math.round((masteredInGroup / g.wordIds.length) * 100) : 0;
            const hasStarted = masteredInGroup > 0 && !isCompleted;

            return (
              <div key={g.id} className="relative flex items-stretch gap-5 lg:gap-8 group">
                {/* Timeline Node */}
                <div className="relative z-10 mt-2 shrink-0 flex items-center justify-center">
                  {/* Outer glow ring for completed */}
                  {isCompleted && (
                    <div
                      className="absolute inset-0 rounded-full bg-wp-green/20 scale-125"
                      aria-hidden
                    />
                  )}
                  <div
                    className={`relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? "border-wp-green bg-wp-green text-white shadow-md shadow-wp-green/30"
                        : isNextToStudy
                          ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                          : hasStarted
                            ? "border-wp-amber/60 bg-wp-amber/10 text-wp-amber"
                            : "border-border bg-background text-muted-foreground group-hover:border-primary/50"
                    }`}
                    aria-label={
                      isCompleted
                        ? `Group ${index + 1} – completed`
                        : hasStarted
                          ? `Group ${index + 1} – ${progressPct}% done`
                          : `Group ${index + 1}`
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-5 stroke-[2.5]" aria-hidden />
                    ) : (
                      <span className="font-sans font-bold text-sm leading-none">{index + 1}</span>
                    )}

                    {/* Partial-progress arc indicator for in-progress groups */}
                    {hasStarted && (
                      <svg
                        className="absolute inset-0 size-full -rotate-90 pointer-events-none"
                        viewBox="0 0 40 40"
                        aria-hidden
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${progressPct * 1.131} 113.1`}
                          className="text-wp-amber"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Group Card */}
                <button
                  type="button"
                  onClick={() => handleStartGroup(g.id)}
                  className={`cursor-pointer flex-1 bg-wp-card rounded-2xl border p-5 text-start transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-h-[88px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isCompleted
                      ? "border-wp-green/30 bg-wp-green-light/10 hover:bg-wp-green-light/20 shadow-sm"
                      : isNextToStudy
                        ? "border-primary border-[2px] bg-secondary shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50 hover:-translate-y-1 active:translate-y-0 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`hidden sm:flex size-12 rounded-xl overflow-hidden shrink-0 border transition-colors ${
                        isCompleted
                          ? "border-wp-green/30"
                          : isNextToStudy
                            ? "border-primary"
                            : "border-border/50 bg-muted/50 group-hover:border-primary/30"
                      }`}
                    >
                      {(() => {
                        const firstWordId = g.wordIds[0];
                        const firstWord = world.vocabulary.find((v) => v.id === firstWordId);
                        return firstWord?.img ? (
                          <img
                            src={firstWord.img}
                            alt=""
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-muted-foreground">
                            <Layers className="size-5" />
                          </div>
                        );
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`font-sans font-bold text-lg leading-tight transition-colors ${isCompleted ? "text-wp-green" : isNextToStudy ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                        >
                          {g.name}
                        </p>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-wp-green bg-wp-green-light px-2 py-0.5 rounded-full border border-wp-green/20">
                            <CheckCircle2 className="size-3" aria-hidden />
                            Completed
                          </span>
                        )}
                        {hasStarted && !isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-wp-amber bg-wp-amber/10 px-2 py-0.5 rounded-full border border-wp-amber/20">
                            {masteredInGroup}/{g.wordIds.length} words
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-muted-foreground text-sm mt-1">
                        {g.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 mt-3 sm:mt-0">
                    <span
                      className={`font-sans font-bold text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                        isCompleted
                          ? "bg-wp-green-light text-wp-green border-wp-green/20"
                          : isNextToStudy
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-primary border-primary/20 group-hover:bg-primary/10"
                      }`}
                    >
                      {g.wordIds.length} Words
                    </span>
                    <div
                      className={`group-hover:opacity-90 group-active:scale-95 rounded-xl px-5 py-2.5 font-sans font-bold text-sm
                        shadow-md transition-all flex items-center gap-2 group-hover:shadow-lg group-hover:-translate-y-0.5 ${
                          isCompleted
                            ? "bg-wp-green text-white shadow-wp-green/20"
                            : "bg-wp-blue text-wp-text-on-blue shadow-wp-blue/20"
                        }`}
                    >
                      {isCompleted ? "Review" : "Start"}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 start-0 end-0 z-40 flex justify-center pb-5 pointer-events-none">
        <div className="pointer-events-auto">
          <HomeIndicator />
        </div>
      </div>
    </div>
  );
});

import { memo, useState, useEffect } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";
import {
  ArrowRight,
  Layers,
  CheckCircle2,
  GraduationCap,
  Check,
  MoreVertical,
  BookOpen,
  Compass,
  Play,
  ListOrdered,
  ChevronRight,
} from "lucide-react";
import { COURSE_UNITS, DEFAULT_UNIT_ID } from "../data/lessons";
import { useProgress } from "../data/progress";

interface Props {
  unitId?: string;
  dispatch: React.Dispatch<Action>;
}

const STEP_LABELS = [
  { step: 0, icon: "👁️", name: "1. Scene & Meaning", desc: "Visual discovery" },
  { step: 1, icon: "🎧", name: "2. Listen & Choose", desc: "Phonetic audio practice" },
  { step: 2, icon: "✍️", name: "3. Spell the Word", desc: "Letter formation" },
  { step: 3, icon: "🧠", name: "4. Recall & Match", desc: "Active memory retrieval" },
  { step: 4, icon: "🧩", name: "5. Word in Context", desc: "Bilingual sentence cloze" },
  { step: 5, icon: "📖", name: "6. Story & Quiz", desc: "Integrated narrative immersion" },
];

export const LessonWorldEntry = memo(function LessonWorldEntry({ unitId, dispatch }: Props) {
  const world = COURSE_UNITS[unitId ?? DEFAULT_UNIT_ID] ?? COURSE_UNITS[DEFAULT_UNIT_ID];
  const { progress } = useProgress();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedStepMenuId, setExpandedStepMenuId] = useState<string | null>(null);

  const isWordLearned = (id: string) => {
    return (
      (progress?.wordMemory?.[id]?.exposures || 0) > 0 || (progress?.wordMastery?.[id] || 0) > 0
    );
  };

  const [nextGroupId] = useState<string>(() => {
    const nextGroup = world.groups.find((g) => g.wordIds.some((id) => !isWordLearned(id)));
    return nextGroup
      ? nextGroup.id
      : (world.groups[world.groups.length - 1]?.id ?? world.groups[0]?.id ?? "group_default");
  });

  // Close menu on click outside or Escape
  useEffect(() => {
    if (!openMenuId) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(`[data-menu-container="${openMenuId}"]`)) {
        setOpenMenuId(null);
        setExpandedStepMenuId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const currentId = openMenuId;
        setOpenMenuId(null);
        setExpandedStepMenuId(null);
        const trigger = document.getElementById(`menu-trigger-${currentId}`);
        trigger?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId]);

  const handleStartGroup = (gId: string, initialStep = 0) => {
    const group = world.groups.find((g) => g.id === gId) ?? world.groups[0];
    setOpenMenuId(null);
    setExpandedStepMenuId(null);
    dispatch({
      type: "START_LESSON",
      lessonId: group.id,
      unitId: world.id,
      mode: "NEW_LESSON",
      wordQueue: group.wordIds,
      initialStep,
    });
  };

  const handleBrowseWords = (gId: string) => {
    setOpenMenuId(null);
    setExpandedStepMenuId(null);
    dispatch({
      type: "GO_LEARN_WORDS",
      lessonId: gId,
    });
  };

  const handleTakeAssessment = () => {
    const allWordIds = world.vocabulary.map((v) => v.id);
    const shuffled = [...allWordIds].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 20);

    dispatch({
      type: "START_LESSON",
      lessonId: world.groups[0].id,
      unitId: world.id,
      mode: "UNIT_ASSESSMENT",
      wordQueue: selected,
    });
  };

  return (
    <div className="bg-background flex flex-col min-h-dvh relative">
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
            const learnedCount = groupWords.filter((w) => isWordLearned(w!.id)).length;
            const isCompleted = learnedCount === g.wordIds.length && g.wordIds.length > 0;
            const progressPct =
              g.wordIds.length > 0 ? Math.round((learnedCount / g.wordIds.length) * 100) : 0;
            const hasStarted = learnedCount > 0 && !isCompleted;
            const isMenuOpen = openMenuId === g.id;

            return (
              <div
                key={g.id}
                className="relative flex items-stretch gap-5 lg:gap-8 group"
                data-menu-container={g.id}
              >
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
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-4 ring-primary/20"
                          : hasStarted
                            ? "border-wp-amber bg-wp-amber/20 text-wp-amber shadow-sm"
                            : "border-border bg-wp-card text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                    }`}
                    aria-label={
                      isCompleted
                        ? `Group ${index + 1}: ${g.name} – Completed`
                        : hasStarted
                          ? `Group ${index + 1}: ${g.name} – ${progressPct}% completed`
                          : `Group ${index + 1}: ${g.name}`
                    }
                  >
                    {isCompleted ? (
                      <Check className="size-5.5 text-white stroke-[3]" aria-hidden />
                    ) : (
                      <span className="font-sans font-black text-sm leading-none">{index + 1}</span>
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

                {/* Group Card Container */}
                <div
                  className={`relative flex-1 bg-wp-card rounded-2xl border p-5 text-start transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-h-[88px] ${
                    isCompleted
                      ? "border-wp-green/30 bg-wp-green-light/10 hover:bg-wp-green-light/20 shadow-sm"
                      : isNextToStudy
                        ? "border-primary border-[2px] bg-secondary shadow-md hover:scale-[1.01]"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Clickable Info Area */}
                  <button
                    type="button"
                    onClick={() => handleStartGroup(g.id)}
                    className="cursor-pointer flex items-start sm:items-center gap-4 flex-1 text-start outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                    aria-label={`${isCompleted ? "Review" : "Start"} lesson: ${g.name}`}
                  >
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
                          className={`font-sans font-bold text-lg leading-tight transition-colors ${
                            isCompleted
                              ? "text-wp-green"
                              : isNextToStudy
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                          }`}
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
                            {learnedCount}/{g.wordIds.length} words
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-muted-foreground text-sm mt-1">
                        {g.description}
                      </p>
                    </div>
                  </button>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2.5 shrink-0 mt-3 sm:mt-0">
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

                    {/* Main Start/Review Button */}
                    <button
                      type="button"
                      onClick={() => handleStartGroup(g.id)}
                      className={`cursor-pointer rounded-xl px-4 py-2.5 font-sans font-bold text-sm min-h-[44px]
                        shadow-md transition-all flex items-center gap-2 hover:opacity-90 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          isCompleted
                            ? "bg-wp-green text-white shadow-wp-green/20"
                            : "bg-wp-blue text-wp-text-on-blue shadow-wp-blue/20"
                        }`}
                    >
                      {isCompleted ? "Review" : "Start"}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Lesson Options Dropdown Trigger Button */}
                    <div className="relative">
                      <button
                        type="button"
                        id={`menu-trigger-${g.id}`}
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        aria-controls={`menu-dropdown-${g.id}`}
                        aria-label={`More options and quick navigation for ${g.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : g.id);
                          setExpandedStepMenuId(null);
                        }}
                        className={`cursor-pointer min-w-[44px] min-h-[44px] size-11 flex items-center justify-center rounded-xl border transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          isMenuOpen
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border bg-wp-card hover:bg-secondary text-foreground hover:text-primary"
                        }`}
                      >
                        <MoreVertical className="size-5" aria-hidden />
                      </button>

                      {/* Accessible Dropdown Menu Modal / Sheet */}
                      {isMenuOpen && (
                        <div
                          id={`menu-dropdown-${g.id}`}
                          role="menu"
                          aria-labelledby={`menu-trigger-${g.id}`}
                          className="absolute end-0 top-full mt-2 w-72 z-50 bg-wp-card rounded-2xl border border-border shadow-2xl p-2 focus:outline-none animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div className="px-3 py-2 border-b border-border/60 mb-1">
                            <p className="font-sans font-bold text-xs text-foreground uppercase tracking-wider">
                              Lesson Options
                            </p>
                            <p className="font-sans text-xs text-muted-foreground truncate">
                              {g.name}
                            </p>
                          </div>

                          {/* 1. Read Story Directly */}
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => handleStartGroup(g.id, 5)}
                            className="cursor-pointer w-full text-start flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                          >
                            <div className="size-8 rounded-lg bg-wp-amber/10 text-wp-amber flex items-center justify-center shrink-0">
                              <BookOpen className="size-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans font-semibold text-sm leading-tight text-foreground">
                                Read Story
                              </p>
                              <p className="font-sans text-xs text-muted-foreground">
                                Jump to story & quiz
                              </p>
                            </div>
                          </button>

                          {/* 2. Browse Words */}
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => handleBrowseWords(g.id)}
                            className="cursor-pointer w-full text-start flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                          >
                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Compass className="size-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans font-semibold text-sm leading-tight text-foreground">
                                Browse Words
                              </p>
                              <p className="font-sans text-xs text-muted-foreground">
                                Vocabulary flashcards & audio
                              </p>
                            </div>
                          </button>

                          {/* 3. Practice Drills */}
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => handleStartGroup(g.id, 0)}
                            className="cursor-pointer w-full text-start flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                          >
                            <div className="size-8 rounded-lg bg-wp-green-light text-wp-green flex items-center justify-center shrink-0">
                              <Play className="size-4 fill-current" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans font-semibold text-sm leading-tight text-foreground">
                                Practice All Drills
                              </p>
                              <p className="font-sans text-xs text-muted-foreground">
                                Complete 6-step curriculum
                              </p>
                            </div>
                          </button>

                          {/* 4. Jump to Specific Step Accordion / Submenu */}
                          <div className="border-t border-border/60 mt-1 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedStepMenuId(expandedStepMenuId === g.id ? null : g.id);
                              }}
                              className="cursor-pointer w-full text-start flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[40px]"
                              aria-expanded={expandedStepMenuId === g.id}
                            >
                              <div className="flex items-center gap-2">
                                <ListOrdered className="size-4 text-primary" />
                                <span className="font-sans font-medium text-xs">
                                  Jump to Step...
                                </span>
                              </div>
                              <ChevronRight
                                className={`size-3.5 transition-transform ${
                                  expandedStepMenuId === g.id ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            {expandedStepMenuId === g.id && (
                              <div className="ps-2 pe-1 py-1 space-y-0.5 max-h-48 overflow-y-auto">
                                {STEP_LABELS.map((item) => (
                                  <button
                                    key={item.step}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleStartGroup(g.id, item.step)}
                                    className="cursor-pointer w-full text-start flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[36px]"
                                  >
                                    <span className="text-sm">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans font-medium text-xs truncate">
                                        {item.name}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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

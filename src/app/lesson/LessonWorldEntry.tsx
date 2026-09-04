import { memo, useState, useEffect } from "react";
import type { Action } from "../types";

import {
  ArrowRight,
  Layers,
  GraduationCap,
  MoreVertical,
  BookOpen,
  Compass,
  Play,
  ListOrdered,
  ChevronRight,
  Library,
} from "lucide-react";
import { COURSE_UNITS, DEFAULT_UNIT_ID } from "../data/lessons";
import { getWords } from "../data/vocabulary";
import { GroupThumbnail } from "./GroupThumbnail";
import { hasLearningMaterials } from "../learning/registry";
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

  const startedGroups = world.groups.filter((g) => g.wordIds.some(isWordLearned)).length;
  const secondaryAction =
    "min-h-12 rounded-xl border border-border bg-wp-card px-4 py-2 text-foreground font-semibold inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-secondary";

  // Close menu on click outside or Escape
  useEffect(() => {
    if (!openMenuId) return;

    document.querySelector<HTMLElement>(`#menu-dropdown-${openMenuId} [role="menuitem"]`)?.focus();
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
    const allWordIds = world.wordIds;
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
    <div className="h-dvh bg-background flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center justify-between gap-3 p-4 lg:px-8 border-b border-border bg-wp-card">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            aria-label="Back to units"
            onClick={() => dispatch({ type: "GO", to: "explore" })}
            className="min-h-11 min-w-11 px-3 inline-flex items-center justify-center gap-2 rounded-xl border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowRight className="size-5 rotate-180 rtl:rotate-0" aria-hidden />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-foreground text-xl">{world.name}</h1>
            <p className="text-muted-foreground text-sm">Choose a vocabulary group</p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 font-semibold text-sm bg-secondary text-primary px-3 py-2 rounded-xl">
          A1<span className="hidden sm:inline"> Beginner</span>
        </span>
      </header>
      <section aria-label="Word groups" className="flex-1 overflow-y-auto min-h-0">
        <div className="w-full max-w-[1040px] mx-auto p-4 lg:p-8 pb-[max(6rem,env(safe-area-inset-bottom))]">
          <div className="mb-6">
            <p className="text-primary font-bold text-sm uppercase tracking-wider">
              WordPix Immersion
            </p>
            <h2 className="font-black text-foreground text-3xl sm:text-4xl mt-2">
              Select a Word Group
            </h2>
            <p className="text-muted-foreground mt-2">
              Choose a group to continue your learning path.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button type="button" onClick={handleTakeAssessment} className={secondaryAction}>
                <GraduationCap className="size-5" aria-hidden />
                Test out<span className="hidden sm:inline">of this unit</span>
              </button>
              {hasLearningMaterials(world.id) && (
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "GO",
                      to: "learning-materials",
                      unitId: world.id,
                      area: "learn",
                    })
                  }
                  className={secondaryAction}
                >
                  <Library className="size-5" aria-hidden />
                  Study materials
                </button>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 mb-4 sm:hidden">
            <p className="font-semibold text-foreground">
              {startedGroups} of {world.groups.length} groups started
            </p>
            <div
              role="progressbar"
              aria-label="Groups started"
              aria-valuemin={0}
              aria-valuemax={world.groups.length}
              aria-valuenow={startedGroups}
              className="h-2 my-2 bg-border rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(startedGroups / world.groups.length) * 100}%` }}
              />
            </div>
            <p className="text-muted-foreground">
              {startedGroups ? "Continue where you left off" : "Choose a group to begin"}
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {world.groups.map((g, index) => {
              const learnedCount = g.wordIds.filter(isWordLearned).length;
              const isCompleted = learnedCount === g.wordIds.length && g.wordIds.length > 0;
              const hasStarted = learnedCount > 0 && !isCompleted;
              const action = isCompleted ? "Review" : hasStarted ? "Continue" : "Start";
              const count = learnedCount
                ? `${learnedCount} of ${g.wordIds.length} learned`
                : `${g.wordIds.length} words`;
              const words = getWords(g.wordIds, world.id);
              const samples = words.slice(0, 4).map((word) => word.label);
              const remainder = g.wordIds.length - samples.length;
              const isMenuOpen = openMenuId === g.id;
              return (
                <li
                  key={g.id}
                  data-menu-container={g.id}
                  className={`relative rounded-2xl border flex items-center gap-1 sm:pe-2 ${hasStarted ? "border-primary/30 bg-secondary/50" : "border-border bg-wp-card"}`}
                >
                  <button
                    type="button"
                    onClick={() => handleStartGroup(g.id)}
                    aria-label={`${action} lesson: ${g.name}. Group ${index + 1}. ${isCompleted ? "Completed. " : hasStarted ? "In progress. " : ""}${count}.`}
                    className="min-w-0 flex-1 rounded-xl p-4 pb-14 sm:pb-4 flex items-center gap-3 sm:gap-6 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-secondary/50"
                  >
                    <span className="shrink-0 w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-muted">
                      {words[0] ? (
                        <GroupThumbnail
                          key={`${world.id}/${g.id}`}
                          word={words[0]}
                          group={g}
                          unitId={world.id}
                          eager={index === 0}
                        />
                      ) : (
                        <Layers className="size-full p-6 text-muted-foreground" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-lg text-foreground">{g.name}</span>
                      {samples.length > 0 && (
                        <span className="block text-sm text-muted-foreground mt-1 break-words">
                          {samples.join(" · ")}
                          {remainder > 0 ? ` · +${remainder}` : ""}
                        </span>
                      )}
                      {learnedCount > 0 && (
                        <span className="inline-block text-sm font-semibold text-primary bg-secondary rounded-lg px-2 mt-2">
                          {isCompleted ? "Completed" : "In progress"}
                        </span>
                      )}
                      <span className="block text-sm text-foreground mt-2">{count}</span>
                      {learnedCount > 0 && (
                        <span
                          className="block mt-2 h-1.5 max-w-64 rounded-full bg-border overflow-hidden"
                          aria-hidden
                        >
                          <span
                            className="block h-full bg-primary"
                            style={{ width: `${(learnedCount / g.wordIds.length) * 100}%` }}
                          />
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className={`hidden md:inline-flex min-h-12 min-w-32 items-center justify-center gap-3 px-4 rounded-xl font-semibold ${hasStarted ? "bg-primary text-primary-foreground" : "border border-border text-primary bg-wp-card"}`}
                    >
                      {action}
                      <ArrowRight className="size-5 rtl:rotate-180" />
                    </span>
                    <ChevronRight
                      className="size-5 shrink-0 text-primary md:hidden rtl:rotate-180"
                      aria-hidden
                    />
                  </button>
                  {learnedCount > 0 && (
                    <progress
                      className="sr-only"
                      aria-label={`${g.name} words learned`}
                      value={learnedCount}
                      max={g.wordIds.length}
                    />
                  )}
                  {/* Lesson Options Dropdown Trigger Button */}
                  <div className="absolute bottom-2 end-2 sm:relative sm:bottom-auto sm:end-auto">
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
                      <>
                        {/* Backdrop on mobile */}
                        <div
                          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            setExpandedStepMenuId(null);
                          }}
                          aria-hidden="true"
                        />

                        <div
                          id={`menu-dropdown-${g.id}`}
                          role="menu"
                          tabIndex={-1}
                          onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                              setOpenMenuId(null);
                              setExpandedStepMenuId(null);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
                              return;
                            event.preventDefault();
                            const items = Array.from(
                              event.currentTarget.querySelectorAll<HTMLButtonElement>("button")
                            );
                            const current = items.indexOf(
                              document.activeElement as HTMLButtonElement
                            );
                            const next =
                              event.key === "Home"
                                ? 0
                                : event.key === "End"
                                  ? items.length - 1
                                  : (current +
                                      (event.key === "ArrowDown" ? 1 : -1) +
                                      items.length) %
                                    items.length;
                            items[next]?.focus();
                          }}
                          aria-labelledby={`menu-trigger-${g.id}`}
                          className="fixed inset-x-4 bottom-6 sm:bottom-auto sm:inset-x-auto sm:absolute sm:end-0 sm:top-full sm:mt-2 w-auto sm:w-72 z-50 bg-wp-card rounded-2xl border border-border shadow-2xl p-2.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150"
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
                              className="cursor-pointer w-full text-start flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
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
                                    className="cursor-pointer w-full text-start flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[44px]"
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
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
});

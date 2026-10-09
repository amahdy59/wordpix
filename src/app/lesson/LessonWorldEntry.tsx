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
} from "lucide-react";
import { COURSE_UNITS, DEFAULT_UNIT_ID } from "../data/courseCatalog";
import { getWords } from "../data/vocabulary";
import { GroupThumbnail } from "./GroupThumbnail";
import { hasLearningMaterials } from "../learning/registry";
import { useProgress } from "../data/progress";
import { useI18n } from "../../i18n";
import { useLearner } from "../context/LearnerContext";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";
import { getLessonStepLabels, getStoryStepIndex, selectPracticeWordQueue } from "./lessonSequence";
import { buildUnitAssessmentSample } from "./assessmentBlueprint";

interface Props {
  unitId?: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonWorldEntry = memo(function LessonWorldEntry({ unitId, dispatch }: Props) {
  const { t } = useI18n();
  const world = COURSE_UNITS[unitId ?? DEFAULT_UNIT_ID] ?? COURSE_UNITS[DEFAULT_UNIT_ID];
  const isHadithUnit = world.id === "hadith-niyyah";
  const { progress } = useProgress();
  const { state: learnerState } = useLearner();
  const curriculum = getUnitCurriculumDesign(world);
  const stepLabels = getLessonStepLabels(
    learnerState.preferences.englishLevel,
    learnerState.accessibility.includeListening
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedStepMenuId, setExpandedStepMenuId] = useState<string | null>(null);

  const isWordStarted = (id: string) => (progress?.wordMemory?.[id]?.exposures || 0) > 0;
  const isWordSecure = (id: string) => {
    const mastery = progress?.wordMemory?.[id]?.mastery;
    return mastery === "familiar" || mastery === "strong";
  };

  const startedGroups = world.groups.filter((g) => g.wordIds.some(isWordStarted)).length;
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
    if (isHadithUnit) {
      dispatch({ type: "OPEN_HADITH_LESSON", lessonId: "hadith-01" });
      return;
    }
    dispatch({
      type: "START_LESSON",
      lessonId: group.id,
      unitId: world.id,
      mode: "NEW_LESSON",
      wordQueue: selectPracticeWordQueue(group.wordIds, progress.wordMemory),
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
    const selected = buildUnitAssessmentSample(world.groups);

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
            <span className="hidden sm:inline">{t("action.back")}</span>
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-foreground text-xl">{world.name}</h1>
            <p className="text-muted-foreground text-base">{t("lesson.chooseVocabGroup")}</p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 font-semibold text-base bg-secondary text-primary px-3 py-2 rounded-xl">
          {curriculum.cefr}
          <span className="hidden sm:inline">
            {t("lesson.gseRange", {
              start: curriculum.gseRange[0],
              end: curriculum.gseRange[1],
            })}
          </span>
        </span>
      </header>
      <section aria-label="Word groups" className="flex-1 overflow-y-auto min-h-0">
        <div className="w-full max-w-[1040px] mx-auto p-4 lg:p-8 pb-[max(6rem,env(safe-area-inset-bottom))]">
          <div className="mb-6 flex flex-col gap-4">
            <div className="rounded-3xl border border-primary/30 bg-secondary p-5 sm:p-6 shadow-wp-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black uppercase tracking-wider text-primary">
                  {t("lesson.unitOutcome")}
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  {t("lesson.groupsStarted", {
                    started: startedGroups,
                    total: world.groups.length,
                  })}
                </span>
              </div>
              <p className="mt-2 text-xl sm:text-2xl font-black text-foreground leading-snug">
                {curriculum.outcome}
              </p>
              <p className="mt-1 text-base text-muted-foreground leading-relaxed">
                {world.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {hasLearningMaterials(world.id) && (
                  <button
                    type="button"
                    onClick={() =>
                      isHadithUnit
                        ? dispatch({ type: "OPEN_HADITH_LESSON", lessonId: "hadith-01" })
                        : dispatch({
                            type: "GO",
                            to: "learning-materials",
                            unitId: world.id,
                            area: "learn",
                          })
                    }
                    className="min-h-12 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary inline-flex items-center gap-2 shadow-wp-xs"
                  >
                    <BookOpen className="size-4 shrink-0" aria-hidden="true" />
                    <span>
                      {isHadithUnit ? t("hadith.startGuidedLesson") : t("lesson.studyMaterialsBtn")}
                    </span>
                    <ArrowRight className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleTakeAssessment}
                  className={secondaryAction}
                  title="Demonstrate mastery of this unit to skip ahead"
                >
                  <GraduationCap className="size-5 shrink-0" aria-hidden="true" />
                  <span>{t("lesson.testOut")}</span>
                </button>
              </div>

              <p className="mt-2.5 text-sm text-muted-foreground">
                {t("lesson.testOutHint", {
                  defaultValue:
                    "Test out: complete a quick assessment covering all unit words to mark them mastered.",
                })}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-sans font-black text-lg text-foreground">
                {t("lesson.selectWordGroup")}
              </h2>
              <span className="text-sm font-medium text-muted-foreground">
                {t("lesson.groupCount", {
                  count: world.groups.length,
                  defaultValue: `${world.groups.length} groups`,
                })}
              </span>
            </div>
          </div>
          <ul className="flex flex-col gap-4">
            {world.groups.map((g, index) => {
              const learnedCount = g.wordIds.filter(isWordSecure).length;
              const isCompleted = learnedCount === g.wordIds.length && g.wordIds.length > 0;
              const hasStarted = g.wordIds.some(isWordStarted) && !isCompleted;
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
                    <span className="shrink-0 w-20 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-muted">
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
                        <span className="block text-base text-muted-foreground mt-1 break-words">
                          {samples.join(" · ")}
                          {remainder > 0 ? ` · +${remainder}` : ""}
                        </span>
                      )}
                      {learnedCount > 0 && (
                        <span className="inline-block text-base font-semibold text-primary bg-secondary rounded-lg px-2 mt-2">
                          {isCompleted ? "Completed" : "In progress"}
                        </span>
                      )}
                      <span className="block text-base text-foreground mt-2">{count}</span>
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
                          ? "border-primary bg-secondary text-primary shadow-sm"
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
                          className={`fixed inset-x-4 bottom-6 z-50 max-h-[calc(100dvh-3rem)] w-auto overflow-y-auto overscroll-contain rounded-2xl border border-border bg-wp-card p-2.5 shadow-2xl focus:outline-none animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none sm:inset-x-auto sm:end-6 sm:w-80 lg:overflow-visible ${
                            expandedStepMenuId === g.id ? "lg:end-[calc(18rem+2rem)]" : "lg:end-6"
                          }`}
                        >
                          <div className="px-3 py-2 border-b border-border/60 mb-1">
                            <p className="font-sans font-bold text-sm text-foreground uppercase tracking-wider">
                              {t("lesson.lessonOptions")}
                            </p>
                            <p className="font-sans text-sm text-muted-foreground truncate">
                              {g.name}
                            </p>
                          </div>

                          {/* 1. Read Story Directly */}
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() =>
                              handleStartGroup(
                                g.id,
                                getStoryStepIndex(
                                  learnerState.preferences.englishLevel,
                                  learnerState.accessibility.includeListening
                                )
                              )
                            }
                            className="cursor-pointer w-full text-start flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                          >
                            <div className="size-8 rounded-lg bg-wp-amber/10 text-wp-amber-foreground flex items-center justify-center shrink-0">
                              <BookOpen className="size-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans font-semibold text-base leading-tight text-foreground">
                                {t("lesson.readStory")}
                              </p>
                              <p className="font-sans text-sm text-muted-foreground">
                                {t("lesson.jumpToStory")}
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
                            <div className="size-8 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
                              <Compass className="size-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans font-semibold text-base leading-tight text-foreground">
                                {t("lesson.browseWords")}
                              </p>
                              <p className="font-sans text-sm text-muted-foreground">
                                {t("lesson.browseWordsDesc")}
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
                              <p className="font-sans font-semibold text-base leading-tight text-foreground">
                                {t("lesson.practiceAllDrills")}
                              </p>
                              <p className="font-sans text-sm text-muted-foreground">
                                {t("lesson.complete6Step")}
                              </p>
                            </div>
                          </button>

                          {/* 4. Jump to Specific Step Accordion / Submenu */}
                          <div className="relative mt-1 border-t border-border/60 pt-1">
                            <button
                              type="button"
                              id={`step-menu-trigger-${g.id}`}
                              role="menuitem"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedStepMenuId(expandedStepMenuId === g.id ? null : g.id);
                              }}
                              className="cursor-pointer w-full text-start flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                              aria-expanded={expandedStepMenuId === g.id}
                              aria-controls={`step-menu-${g.id}`}
                              aria-haspopup="menu"
                            >
                              <div className="flex items-center gap-2">
                                <ListOrdered className="size-4 text-primary" />
                                <span className="font-sans font-medium text-sm">
                                  {t("lesson.jumpToStep")}
                                </span>
                              </div>
                              <ChevronRight
                                className={`size-3.5 transition-transform motion-reduce:transition-none rtl:rotate-180 ${
                                  expandedStepMenuId === g.id ? "rotate-90" : ""
                                }`}
                                aria-hidden
                              />
                            </button>

                            {expandedStepMenuId === g.id && (
                              <div
                                id={`step-menu-${g.id}`}
                                role="menu"
                                aria-labelledby={`step-menu-trigger-${g.id}`}
                                className="space-y-0.5 py-1 ps-2 pe-1 lg:absolute lg:bottom-0 lg:start-full lg:z-10 lg:ms-2 lg:max-h-[min(24rem,calc(100dvh-3rem))] lg:w-72 lg:overflow-y-auto lg:overscroll-contain lg:rounded-2xl lg:border lg:border-border lg:bg-wp-card lg:p-2 lg:shadow-2xl lg:animate-in lg:fade-in lg:slide-in-from-start-2 motion-reduce:lg:animate-none"
                              >
                                {stepLabels.map((item) => (
                                  <button
                                    key={item.step}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleStartGroup(g.id, item.step)}
                                    className="cursor-pointer w-full text-start flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-foreground focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[44px]"
                                  >
                                    <span className="text-base">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans font-medium text-sm truncate">
                                        {item.step + 1}. {item.name}
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

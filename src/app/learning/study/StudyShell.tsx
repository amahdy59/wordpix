import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Dumbbell,
  LibraryBig,
  MessageCircleMore,
  ArrowLeft,
  X,
  Menu,
  Languages,
  Headphones,
} from "lucide-react";
import type { UnitLearningMaterials } from "../types";
import type { CourseUnit } from "../../data/lessons";
import { loadStudyProgress, saveStudyProgress, syncStudyProgressWithWordMemory } from "./progress";
import { generateCurriculum } from "./curriculum";
import { getUnitCurriculumDesign } from "../curriculumModel";
import { StudyHome } from "./StudyHome";
import { LearnArea } from "./LearnArea";
import { UseItArea } from "./UseItArea";
import { PracticeArea } from "./PracticeArea";
import { ReferenceArea } from "./ReferenceArea";
import { ReviewArea } from "./ReviewArea";
import { UnitScenarioPlayer } from "./UnitScenarioPlayer";
import { getScenariosForUnit, findScenarioForWords } from "../../data/scenarios/scenarioService";
import type { UnitStudyProgress, StudyArea } from "./types";
import type { Action } from "../../types";
import { WordInspectorModal } from "../../shared/WordInspectorModal";
import type { VocabularyItem } from "../../data/lessons";
import { useI18n } from "../../../i18n";
import { useLearner } from "../../context/LearnerContext";

const STUDY_AREAS: StudyArea[] = ["learn", "use", "practice", "review", "reference"];

interface Props {
  unitId: string;
  unit: CourseUnit;
  materials: UnitLearningMaterials;
  initialArea?: string;
  initialNodeId?: string;
  dispatch: React.Dispatch<Action>;
}

export function StudyShell({
  unitId,
  unit,
  materials,
  initialArea,
  initialNodeId,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [storedProgress, setStoredProgress] = useState<UnitStudyProgress>(() =>
    loadStudyProgress(unitId)
  );
  const progress = React.useMemo(
    () => syncStudyProgressWithWordMemory(storedProgress, learnerState.wordMemory, unit.wordIds),
    [learnerState.wordMemory, storedProgress, unit.wordIds]
  );

  // The curriculum adapter
  const nodes = React.useMemo(() => generateCurriculum(materials, unit), [materials, unit]);
  const curriculumDesign = React.useMemo(
    () => getUnitCurriculumDesign(unit, materials),
    [materials, unit]
  );
  const unitScenarios = React.useMemo(() => getScenariosForUnit(unitId), [unitId]);

  // Navigation state is URL/state-driven. Area-only links open the first activity.
  const requestedArea = STUDY_AREAS.includes(initialArea as StudyArea)
    ? (initialArea as StudyArea)
    : undefined;
  const requestedNode = nodes.find(
    (node) => node.id === initialNodeId && (!requestedArea || node.area === requestedArea)
  );
  const activeNode =
    requestedNode ??
    (requestedArea ? nodes.find((node) => node.area === requestedArea) : undefined);
  const currentArea: StudyArea | "home" = activeNode?.area ?? "home";
  const currentNodeId = activeNode?.id ?? null;

  const [expandedAreas, setExpandedAreas] = useState<Set<StudyArea>>(
    () => new Set<StudyArea>(currentArea === "home" ? ["learn"] : [currentArea])
  );

  // Immersion Mode state (masks Arabic glosses for full English thinking)
  const [immersionMode, setImmersionMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("wordpix:immersion_mode") === "true";
    } catch {
      return false;
    }
  });

  const toggleImmersionMode = () => {
    setImmersionMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("wordpix:immersion_mode", String(next));
      } catch {
        // Fallback for private browsing
      }
      return next;
    });
  };

  // Vocabulary inspector modal state
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);

  // Focus management wrapper ref for main content
  const focusRef = React.useRef<HTMLDivElement>(null);

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const contentsBtnRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLElement>(null);

  const closeDrawer = () => {
    setIsMobileDrawerOpen(false);
    contentsBtnRef.current?.focus();
  };

  useEffect(() => {
    saveStudyProgress(progress);
  }, [progress]);

  // Scroll reset & focus transfer on route/activity change
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.scrollTop = 0;
      if (currentNodeId) {
        focusRef.current.focus({ preventScroll: true });
      }
    }
  }, [currentNodeId, currentArea]);

  // Focus trap and Escape key listener for mobile drawer modal
  useEffect(() => {
    if (!isMobileDrawerOpen) return;
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawerOpen]);

  const handleContinue = () => {
    // 1. Resume last unfinished
    if (progress.lastNodeId) {
      const node = nodes.find((n) => n.id === progress.lastNodeId);
      if (node && !progress.completedNodeIds.includes(node.id)) {
        dispatch({
          type: "GO",
          to: "learning-materials",
          unitId: unit.id,
          area: node.area,
          nodeId: node.id,
        });
        return;
      }
    }

    // 2. Start first
    const firstNode =
      nodes.find(
        (node) =>
          node.area !== "reference" &&
          node.isCore !== false &&
          !progress.completedNodeIds.includes(node.id)
      ) ?? nodes[0];
    if (firstNode) {
      dispatch({
        type: "GO",
        to: "learning-materials",
        unitId: unit.id,
        area: firstNode.area,
        nodeId: firstNode.id,
      });
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      dispatch({
        type: "GO",
        to: "learning-materials",
        unitId: unit.id,
        area: node.area,
        nodeId: node.id,
      });
      setStoredProgress((prev) => ({ ...prev, lastNodeId: node.id }));
      setExpandedAreas((current) => new Set(current).add(node.area));
      setIsMobileDrawerOpen(false);
    }
  };

  const completeNode = (nodeId: string) => {
    setStoredProgress((current) =>
      current.completedNodeIds.includes(nodeId)
        ? current
        : { ...current, completedNodeIds: [...current.completedNodeIds, nodeId] }
    );
  };

  const handleNextActivity = () => {
    if (!activeNode) return;
    completeNode(activeNode.id);
    const activeIndex = nodes.findIndex((node) => node.id === activeNode.id);
    const nextNode = nodes
      .slice(activeIndex + 1)
      .find((node) => node.area !== "reference" && node.isCore !== false);
    if (nextNode) handleNodeSelect(nextNode.id);
    else handleBackToHome();
  };

  const handleBackToHome = () => {
    dispatch({ type: "GO", to: "learning-materials", unitId: unit.id });
  };

  const handleAreaSelect = (area: StudyArea) => {
    const firstNode = nodes.find((node) => node.area === area);
    dispatch({
      type: "GO",
      to: "learning-materials",
      unitId: unit.id,
      area: area,
      nodeId: firstNode?.id,
    });
    setExpandedAreas((current) => new Set(current).add(area));
    setIsMobileDrawerOpen(false);
  };

  const toggleArea = (area: StudyArea) => {
    setExpandedAreas((current) => {
      const next = new Set(current);
      if (next.has(area)) next.delete(area);
      else next.add(area);
      return next;
    });
  };

  const nodeProgress = (nodeId: string) => {
    if (progress.completedNodeIds.includes(nodeId)) return 100;
    const node = nodes.find((item) => item.id === nodeId);
    if (!node?.wordIds?.length) return 0;
    const started = node.wordIds.filter((wordId) => progress.wordStatus[wordId]).length;
    return Math.round((started / node.wordIds.length) * 100);
  };

  const coreNodes = nodes.filter((n) => n.area !== "reference" && n.isCore !== false);
  const overallProgress = coreNodes.length
    ? Math.round(
        coreNodes.reduce((total, node) => total + nodeProgress(node.id), 0) / coreNodes.length
      )
    : 0;

  const areaMeta: Record<StudyArea, { label: string; icon: typeof BookOpen }> = {
    learn: { label: t("help.studyAreas.learn"), icon: BookOpen },
    use: { label: t("help.studyAreas.use"), icon: MessageCircleMore },
    practice: { label: t("help.studyAreas.practice"), icon: Dumbbell },
    review: { label: t("help.studyAreas.review"), icon: Check },
    reference: { label: t("help.studyAreas.reference"), icon: LibraryBig },
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
      {/* 1. Global Sticky Header across Home & Activities */}
      <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              currentArea === "home"
                ? dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })
                : handleBackToHome()
            }
            aria-label={
              currentArea === "home"
                ? t("study.backToUnit", { unit: unit.name })
                : t("study.overview")
            }
            className="min-h-11 min-w-11 shrink-0 rounded-xl p-2 text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <div className="min-w-0">
            <p lang="en" dir="ltr" className="break-words text-base font-bold text-foreground">
              {unit.name}
            </p>
            {currentArea !== "home" && (
              <p className="text-sm text-muted-foreground">{areaMeta[currentArea].label}</p>
            )}
          </div>
        </div>
        <div className="flex max-w-full flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleImmersionMode}
            aria-pressed={immersionMode}
            aria-label={`${t("ux.languageSupport")}: ${t(immersionMode ? "listenRepeat.immersion" : "listenRepeat.bilingual")}`}
            className="min-h-11 min-w-11 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Languages className="inline size-4 me-2" aria-hidden />
            {t(immersionMode ? "listenRepeat.immersion" : "listenRepeat.bilingual")}
          </button>
          <button
            type="button"
            ref={contentsBtnRef}
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isMobileDrawerOpen}
            className="lg:hidden min-h-11 min-w-11 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Menu className="inline size-4 me-2" aria-hidden />
            {t("study.unitActivities")}
          </button>
        </div>
      </header>

      {/* 2. Main Two-Pane Structure */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row relative overflow-hidden">
        {/* Mobile Backdrop */}
        {isMobileDrawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
            onClick={closeDrawer}
            aria-hidden="true"
          />
        )}

        {/* Sticky Desktop Left Sidebar & Mobile Drawer Modal */}
        <aside
          ref={drawerRef}
          role={isMobileDrawerOpen ? "dialog" : undefined}
          aria-modal={isMobileDrawerOpen ? "true" : undefined}
          aria-label={t("study.unitActivities")}
          className={`
            fixed inset-0 z-40 bg-card/95 backdrop-blur
            lg:static lg:flex lg:w-80 lg:shrink-0 lg:flex-col lg:h-full lg:overflow-y-auto lg:border-e lg:border-border lg:bg-card/70 lg:backdrop-blur
            ${isMobileDrawerOpen ? "flex flex-col overflow-y-auto" : "hidden"}
          `}
        >
          <div className="sticky top-0 z-10 border-b border-border bg-card/95 p-4 backdrop-blur flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <button
                onClick={handleBackToHome}
                className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  currentArea === "home"
                    ? "bg-secondary text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{t("study.unitOverview", { unit: unit.name })}</span>
              </button>

              <div className="mt-3.5 pt-3 border-t border-border/60">
                <div className="mb-1.5 flex items-center justify-between text-sm font-bold">
                  <span className="text-muted-foreground">{t("study.courseCompletion")}</span>
                  <span className="text-primary font-bold">{overallProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                    role="progressbar"
                    aria-valuenow={overallProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={t("study.percentDone", { percent: overallProgress })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="lg:hidden flex size-11 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 min-h-[44px] min-w-[44px]"
              aria-label={t("action.close")}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav className="space-y-3 p-4 flex-1">
            {STUDY_AREAS.map((area) => {
              const areaNodes = nodes.filter((n) => n.area === area);
              if (areaNodes.length === 0) return null;
              const expanded = expandedAreas.has(area);
              const AreaIcon = areaMeta[area].icon;
              const isCurrentAreaActive = currentArea === area;

              return (
                <section
                  key={area}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isCurrentAreaActive
                      ? "border-primary/40 bg-card shadow-xs"
                      : "border-border bg-background/60"
                  }`}
                >
                  <h2 className="m-0 p-0">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`study-nav-${area}`}
                      onClick={() => toggleArea(area)}
                      className="flex min-h-[64px] w-full items-center gap-3 px-3.5 py-2.5 text-start hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isCurrentAreaActive
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-secondary text-primary"
                        }`}
                      >
                        <AreaIcon aria-hidden size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-bold text-base text-foreground">
                            {t(`help.studyAreas.${area}`)}
                          </span>
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden
                        size={18}
                        className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h2>

                  <div
                    id={`study-nav-${area}`}
                    hidden={!expanded}
                    className="space-y-1 border-t border-border/70 p-2 bg-secondary/15"
                  >
                    {areaNodes.map((node) => {
                      const isActive = currentNodeId === node.id;
                      const progressVal = nodeProgress(node.id);
                      const matchingScenario =
                        node.type === "vocabulary"
                          ? findScenarioForWords(unitId, node.wordIds ?? [])
                          : undefined;
                      const isScenarioNode = node.type === "scenario";

                      return (
                        <button
                          key={node.id}
                          onClick={() => handleNodeSelect(node.id)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            isActive
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "text-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isScenarioNode
                                ? isActive
                                  ? "border-primary-foreground bg-primary-foreground text-primary"
                                  : "border-primary/50 bg-primary/15 text-primary"
                                : progressVal === 100
                                  ? isActive
                                    ? "border-primary-foreground bg-primary-foreground text-primary"
                                    : "border-wp-green bg-wp-green text-wp-text-on-green"
                                  : isActive
                                    ? "border-primary-foreground/60"
                                    : "border-border"
                            }`}
                          >
                            {isScenarioNode ? (
                              <Headphones aria-hidden size={12} strokeWidth={2.5} />
                            ) : progressVal === 100 ? (
                              <Check aria-hidden size={13} strokeWidth={3} />
                            ) : (
                              <span
                                className={`size-1.5 rounded-full ${
                                  isActive
                                    ? "bg-primary-foreground"
                                    : "bg-muted-foreground opacity-50"
                                }`}
                              />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span title={node.title} className="block break-words">
                              {node.title}
                            </span>
                            {matchingScenario && (
                              <span
                                className={`flex items-center gap-1.5 text-xs font-semibold mt-0.5 truncate ${
                                  isActive ? "text-primary-foreground/90" : "text-primary"
                                }`}
                                title={`${t("study.videoContext") || "Video Context"}: ${matchingScenario.titleEn}`}
                              >
                                <Headphones className="size-3 shrink-0" aria-hidden="true" />
                                <span className="truncate">
                                  {t("study.videoPrefix", { defaultValue: "Video:" })}{" "}
                                  {matchingScenario.titleEn}
                                </span>
                              </span>
                            )}
                            {node.estimatedMinutes && (
                              <span
                                className={`block text-sm ${
                                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                }`}
                              >
                                {t("study.minutesShort", { minutes: node.estimatedMinutes })}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div
          id="study-content"
          className="relative min-w-0 flex-1 overflow-y-auto outline-none"
          tabIndex={-1}
          ref={focusRef}
          aria-hidden={isMobileDrawerOpen ? "true" : undefined}
          {...(isMobileDrawerOpen ? { inert: "" } : {})}
        >
          {currentArea === "home" ? (
            <StudyHome
              unit={unit}
              nodes={nodes}
              curriculumDesign={curriculumDesign}
              progress={progress}
              onContinue={handleContinue}
              onSelectArea={handleAreaSelect}
              onSelectNode={handleNodeSelect}
              dispatch={dispatch}
            />
          ) : (
            <>
              {currentArea === "learn" &&
                activeNode &&
                (activeNode.type === "scenario" ? (
                  <div className="wp-container-content wp-layout-gutter py-4 md:py-6 space-y-4">
                    <header className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                        <Headphones className="size-4" aria-hidden />
                        <span>{t("study.videoContext") || "Authentic Video Context"}</span>
                      </p>
                      <h1 className="text-2xl font-black text-foreground">
                        {t("study.scenariosForUnit", {
                          unit: unit.name,
                          defaultValue: `${unit.name} · Authentic Scenarios`,
                        })}
                      </h1>
                      <p className="text-base text-muted-foreground">
                        {t("study.scenariosDesc", {
                          defaultValue:
                            "Authentic native dialogue scenarios featuring target vocabulary in real-world everyday contexts.",
                        })}
                      </p>
                    </header>
                    <UnitScenarioPlayer
                      scenarios={unitScenarios}
                      initialLessonId={
                        activeNode?.id?.startsWith(unit.id) ? activeNode.id : undefined
                      }
                      onInspectWord={(wordText) => {
                        const normalized = wordText.trim().toLowerCase();
                        const found = unit.wordIds.find((id) => id.toLowerCase() === normalized);
                        if (found) {
                          setInspectedWord({ id: found, label: wordText } as VocabularyItem);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <LearnArea
                    key={activeNode.id}
                    node={activeNode}
                    materials={materials}
                    progress={progress}
                    onProgressUpdate={setStoredProgress}
                    onNextActivity={handleNextActivity}
                    immersionMode={immersionMode}
                  />
                ))}
              {currentArea === "use" && (
                <UseItArea
                  node={activeNode}
                  materials={materials}
                  onSelectNode={handleNodeSelect}
                  allNodes={nodes.filter((n) => n.area === "use")}
                  unitId={unitId}
                  onInspectWord={setInspectedWord}
                  onCompleteNode={completeNode}
                  onNextActivity={handleNextActivity}
                />
              )}
              {currentArea === "practice" && (
                <PracticeArea
                  materials={materials}
                  progress={progress}
                  onProgressUpdate={setStoredProgress}
                  nodeId={activeNode?.id ?? "practice-session"}
                  onNextActivity={handleNextActivity}
                />
              )}
              {currentArea === "review" && (
                <ReviewArea
                  materials={materials}
                  curriculumDesign={curriculumDesign}
                  progress={progress}
                  onProgressUpdate={setStoredProgress}
                />
              )}
              {currentArea === "reference" && <ReferenceArea materials={materials} />}
            </>
          )}
        </div>
      </div>

      {/* Vocabulary Inspector Modal */}
      <WordInspectorModal
        word={inspectedWord}
        unitId={materials.unitId}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </div>
  );
}

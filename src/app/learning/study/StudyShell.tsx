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
} from "lucide-react";
import type { UnitLearningMaterials } from "../types";
import type { CourseUnit } from "../../data/lessons";
import { loadStudyProgress, saveStudyProgress } from "./progress";
import { generateCurriculum } from "./curriculum";
import { StudyHome } from "./StudyHome";
import { LearnArea } from "./LearnArea";
import { UseItArea } from "./UseItArea";
import { PracticeArea } from "./PracticeArea";
import { ReferenceArea } from "./ReferenceArea";
import { ReviewArea } from "./ReviewArea";
import type { UnitStudyProgress, StudyArea } from "./types";
import type { Action } from "../../types";
import { WordInspectorModal } from "../../shared/WordInspectorModal";
import type { VocabularyItem } from "../../data/lessons";

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
  const [progress, setProgress] = useState<UnitStudyProgress>(() => loadStudyProgress(unitId));

  // The curriculum adapter
  const nodes = generateCurriculum(materials);

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
      if (node) {
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
    const firstNode = nodes[0];
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
      setProgress((prev) => ({ ...prev, lastNodeId: node.id }));
      setExpandedAreas((current) => new Set(current).add(node.area));
      setIsMobileDrawerOpen(false);
    }
  };

  const completeNode = (nodeId: string) => {
    setProgress((current) =>
      current.completedNodeIds.includes(nodeId)
        ? current
        : { ...current, completedNodeIds: [...current.completedNodeIds, nodeId] }
    );
  };

  const handleNextActivity = () => {
    if (!activeNode) return;
    completeNode(activeNode.id);
    const activeIndex = nodes.findIndex((node) => node.id === activeNode.id);
    const nextNode = nodes.slice(activeIndex + 1).find((node) => node.area !== "reference");
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

  const areaProgress = (area: StudyArea) => {
    const areaNodes = nodes.filter((node) => node.area === area);
    if (!areaNodes.length) return 0;
    return Math.round(
      areaNodes.reduce((total, node) => total + nodeProgress(node.id), 0) / areaNodes.length
    );
  };

  const coreNodes = nodes.filter((n) => n.area !== "reference");
  const overallProgress = coreNodes.length
    ? Math.round(
        coreNodes.reduce((total, node) => total + nodeProgress(node.id), 0) / coreNodes.length
      )
    : 0;

  const areaMeta: Record<StudyArea, { label: string; description: string; icon: typeof BookOpen }> =
    {
      learn: { label: "Learn", description: "Build core vocabulary", icon: BookOpen },
      use: {
        label: "Use in Context",
        description: "Apply language in context",
        icon: MessageCircleMore,
      },
      practice: { label: "Practice", description: "Strengthen recall", icon: Dumbbell },
      review: { label: "Review", description: "Check your confidence", icon: Check },
      reference: { label: "Reference", description: "Browse language details", icon: LibraryBig },
    };

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
      {/* 1. Global Sticky Header across Home & Activities */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur shadow-xs gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              if (currentArea === "home") {
                dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id });
              } else {
                handleBackToHome();
              }
            }}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/70 text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px]"
            aria-label={
              currentArea === "home"
                ? `Back to ${unit.name} unit entry`
                : `Back to ${unit.name} overview`
            }
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>

          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground truncate"
            >
              <span className="truncate">{unit.name}</span>
              {currentArea !== "home" && (
                <>
                  <span className="opacity-40" aria-hidden>
                    /
                  </span>
                  <span className="text-primary font-bold">{areaMeta[currentArea].label}</span>
                </>
              )}
            </nav>
            <div className="truncate text-sm sm:text-base font-extrabold text-foreground mt-0.5 tracking-tight">
              {currentArea === "home"
                ? `${unit.name} Overview`
                : (activeNode?.title ?? areaMeta[currentArea].label)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Immersion Mode Toggle */}
          <button
            type="button"
            onClick={toggleImmersionMode}
            aria-pressed={immersionMode}
            aria-label={`Language scaffold mode: ${immersionMode ? "English Immersion (Arabic masked)" : "Bilingual (Arabic shown)"}. Click to toggle.`}
            title={
              immersionMode
                ? "Immersion Mode active (Arabic hidden)"
                : "Bilingual Mode active (Arabic visible)"
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              immersionMode
                ? "bg-wp-teal/10 text-wp-teal border-wp-teal/30"
                : "bg-secondary text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            <Languages className="size-4 shrink-0" aria-hidden />
            <span className="hidden md:inline">{immersionMode ? "Immersion" : "Bilingual"}</span>
          </button>

          {/* Progress Pill on Header */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/80 text-xs font-bold"
            role="status"
            aria-label={`Unit mastery progress: ${overallProgress}%`}
          >
            <span className="size-2 rounded-full bg-primary" aria-hidden />
            <span className="text-foreground">{overallProgress}% Done</span>
          </div>

          {/* Quick Area Jump Tabs (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 bg-secondary/40 p-1 rounded-xl border border-border/60">
            <button
              onClick={handleBackToHome}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[44px] ${
                currentArea === "home"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              Overview
            </button>
            {STUDY_AREAS.map((area) => {
              const isActive = currentArea === area;
              return (
                <button
                  key={area}
                  onClick={() => handleAreaSelect(area)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {areaMeta[area].label}
                </button>
              );
            })}
          </div>

          {/* Mobile Drawer Toggle */}
          <button
            ref={contentsBtnRef}
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold border border-border hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
            aria-label="Open study curriculum contents menu"
          >
            <Menu className="size-4" aria-hidden />
            <span>Contents</span>
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
          aria-label={`${unit.name} study navigation`}
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
                className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  currentArea === "home"
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{unit.name} Overview</span>
              </button>

              <div className="mt-3.5 pt-3 border-t border-border/60">
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Course Completion</span>
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
                    aria-label={`Overall progress for ${unit.name}: ${overallProgress}%`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="lg:hidden flex size-11 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 min-h-[44px] min-w-[44px]"
              aria-label="Close navigation menu"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav className="space-y-3 p-4 flex-1">
            {STUDY_AREAS.map((area) => {
              const areaNodes = nodes.filter((n) => n.area === area);
              if (areaNodes.length === 0) return null;
              const expanded = expandedAreas.has(area);
              const progressValue = areaProgress(area);
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
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <AreaIcon aria-hidden size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {areaMeta[area].label}
                          </span>
                          {area !== "reference" && (
                            <span className="text-xs font-bold text-muted-foreground">
                              {progressValue}%
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground truncate">
                          {areaMeta[area].description}
                        </span>
                        {area !== "reference" && (
                          <span
                            className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-secondary"
                            aria-hidden="true"
                          >
                            <span
                              className="block h-full rounded-full bg-primary transition-all duration-300"
                              style={{ width: `${progressValue}%` }}
                            />
                          </span>
                        )}
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
                      return (
                        <button
                          key={node.id}
                          onClick={() => handleNodeSelect(node.id)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            isActive
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              progressVal === 100
                                ? isActive
                                  ? "border-primary-foreground bg-primary-foreground text-primary"
                                  : "border-wp-green bg-wp-green text-white"
                                : isActive
                                  ? "border-primary-foreground/60"
                                  : "border-border"
                            }`}
                          >
                            {progressVal === 100 ? (
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
                            <span className="block truncate">{node.title}</span>
                            {node.estimatedMinutes && (
                              <span
                                className={`block text-xs ${
                                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                }`}
                              >
                                {node.estimatedMinutes} min
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
        <main
          id="study-content"
          className="relative min-w-0 flex-1 overflow-y-auto outline-none"
          tabIndex={-1}
          ref={focusRef}
          aria-hidden={isMobileDrawerOpen ? "true" : undefined}
        >
          {currentArea === "home" ? (
            <StudyHome
              unit={unit}
              nodes={nodes}
              progress={progress}
              onContinue={handleContinue}
              onSelectArea={handleAreaSelect}
              onSelectNode={handleNodeSelect}
              dispatch={dispatch}
            />
          ) : (
            <>
              {currentArea === "learn" && activeNode && (
                <LearnArea
                  key={activeNode.id}
                  node={activeNode}
                  materials={materials}
                  progress={progress}
                  onProgressUpdate={setProgress}
                  onNextActivity={handleNextActivity}
                  immersionMode={immersionMode}
                />
              )}
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
                  onProgressUpdate={setProgress}
                  nodeId={activeNode?.id ?? "practice-session"}
                  onNextActivity={handleNextActivity}
                />
              )}
              {currentArea === "review" && (
                <ReviewArea
                  materials={materials}
                  progress={progress}
                  onProgressUpdate={setProgress}
                />
              )}
              {currentArea === "reference" && <ReferenceArea materials={materials} />}
            </>
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Horizontal Navigation Bar */}
      <nav
        aria-label="Study Areas Mobile Navigation"
        className="lg:hidden shrink-0 border-t border-border bg-card/95 backdrop-blur px-2 py-1 flex items-center justify-around z-20 pb-[max(env(safe-area-inset-bottom),6px)]"
      >
        <button
          type="button"
          onClick={handleBackToHome}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all min-h-[44px] min-w-[44px] ${
            currentArea === "home"
              ? "text-primary bg-primary/10 shadow-2xs font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-current={currentArea === "home" ? "page" : undefined}
        >
          <BookOpen className="size-4 mb-0.5" aria-hidden />
          <span>Home</span>
        </button>
        {STUDY_AREAS.map((area) => {
          const isActive = currentArea === area;
          const Icon = areaMeta[area].icon;
          return (
            <button
              key={area}
              type="button"
              onClick={() => handleAreaSelect(area)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all min-h-[44px] min-w-[44px] ${
                isActive
                  ? "text-primary bg-primary/10 shadow-2xs font-extrabold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 mb-0.5" aria-hidden />
              <span>{areaMeta[area].label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>

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

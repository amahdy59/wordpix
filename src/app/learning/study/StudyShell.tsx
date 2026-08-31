import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Dumbbell,
  LibraryBig,
  MessageCircleMore,
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

  // Navigation state driven by URL
  const currentArea = (initialArea as StudyArea | undefined) || "home";
  const currentNodeId = initialNodeId || null;

  const [expandedAreas, setExpandedAreas] = useState<Set<StudyArea>>(
    () => new Set<StudyArea>(["learn", "use", "practice", "reference"])
  );

  // Vocabulary inspector
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);

  // Focus management wrapper ref
  const focusRef = React.useRef<HTMLDivElement>(null);

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const contentsBtnRef = React.useRef<HTMLButtonElement>(null);

  const closeDrawer = () => {
    setIsMobileDrawerOpen(false);
    contentsBtnRef.current?.focus();
  };

  useEffect(() => {
    saveStudyProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (currentNodeId && focusRef.current) {
      focusRef.current.focus({ preventScroll: true });
    }
  }, [currentNodeId]);

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
      setIsMobileDrawerOpen(false);
    }
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
      use: { label: "Use", description: "Apply language in context", icon: MessageCircleMore },
      practice: { label: "Practice", description: "Strengthen recall", icon: Dumbbell },
      review: { label: "Review", description: "Check your confidence", icon: Check },
      reference: { label: "Reference", description: "Browse language details", icon: LibraryBig },
    };

  const activeNode = nodes.find((n) => n.id === currentNodeId);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
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
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Desktop Sidebar / Mobile Drawer */}
          <aside
            aria-label={`${unit.name} study navigation`}
            className={`
              fixed inset-0 z-40 bg-card/95 backdrop-blur
              lg:static lg:flex lg:w-80 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-e lg:border-border lg:bg-card/95
              ${isMobileDrawerOpen ? "flex flex-col overflow-y-auto" : "hidden"}
            `}
          >
            <div className="sticky top-0 z-10 border-b border-border bg-card/95 p-5 backdrop-blur flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <button
                  onClick={handleBackToHome}
                  className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-2 text-start text-sm font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span aria-hidden>&larr;</span>
                  <span className="truncate">{unit.name}</span>
                </button>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Unit progress</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
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
                className="lg:hidden flex size-11 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-3 p-4">
              {(["learn", "use", "practice", "review", "reference"] as StudyArea[]).map((area) => {
                const areaNodes = nodes.filter((n) => n.area === area);
                if (areaNodes.length === 0) return null;
                const expanded = expandedAreas.has(area);
                const progressValue = areaProgress(area);
                const AreaIcon = areaMeta[area].icon;

                return (
                  <section
                    key={area}
                    className="overflow-hidden rounded-2xl border border-border bg-background/70"
                  >
                    <h2 className="m-0 p-0">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`study-nav-${area}`}
                        onClick={() => toggleArea(area)}
                        className="flex min-h-[64px] w-full items-center gap-3 px-3 py-2 text-start hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <AreaIcon aria-hidden size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-bold">{areaMeta[area].label}</span>
                            {area !== "reference" && (
                              <span className="text-xs font-bold text-muted-foreground">
                                {progressValue}%
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {areaMeta[area].description}
                          </span>
                          {area !== "reference" && (
                            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-secondary">
                              <span
                                className="block h-full rounded-full bg-primary"
                                style={{ width: `${progressValue}%` }}
                              />
                            </span>
                          )}
                        </span>
                        <ChevronDown
                          aria-hidden
                          size={18}
                          className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </h2>

                    <div
                      id={`study-nav-${area}`}
                      hidden={!expanded}
                      className="space-y-1 border-t border-border p-2"
                    >
                      {areaNodes.map((node) => {
                        const isActive = currentNodeId === node.id;
                        const progressValue = nodeProgress(node.id);
                        return (
                          <button
                            key={node.id}
                            onClick={() => handleNodeSelect(node.id)}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              isActive
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${progressValue === 100 ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                            >
                              {progressValue === 100 ? (
                                <Check aria-hidden size={13} />
                              ) : (
                                <span className="size-1.5 rounded-full bg-current opacity-50" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block">{node.title}</span>
                              {node.estimatedMinutes && (
                                <span
                                  className={`block text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}
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

          {/* Mobile Header */}
          <div className="sticky top-0 z-20 flex shrink-0 items-center border-b bg-background/95 p-3 backdrop-blur lg:hidden">
            <button
              onClick={handleBackToHome}
              className="min-h-[44px] min-w-[44px] p-2 -ms-2 me-2 flex items-center justify-center"
              aria-label="Back to home"
            >
              ←
            </button>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {unit.name} / {areaMeta[currentArea].label}
              </div>
              <div className="truncate text-sm font-bold">
                {activeNode?.title || areaMeta[currentArea].description}
              </div>
            </div>
            <button
              ref={contentsBtnRef}
              onClick={() => setIsMobileDrawerOpen(true)}
              className="ms-3 min-h-[44px] rounded bg-secondary px-3 py-2 text-sm font-bold"
            >
              Contents
            </button>
          </div>

          {/* Content Area */}
          <main
            id="study-content"
            className="relative min-w-0 flex-1 overflow-y-auto outline-none"
            tabIndex={-1}
            ref={focusRef}
          >
            <header className="sticky top-0 z-10 hidden border-b border-border bg-background/90 px-6 py-3 backdrop-blur lg:block">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                <nav aria-label="Breadcrumb" className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>{unit.name}</span>
                    <span className="mx-1.5 opacity-60">/</span>
                    <span className="text-primary">{areaMeta[currentArea].label}</span>
                  </p>
                  <h1 className="truncate text-sm font-bold text-foreground mt-0.5">
                    {activeNode?.title ?? areaMeta[currentArea].description}
                  </h1>
                </nav>
              </div>
            </header>
            {currentArea === "learn" && activeNode && (
              <LearnArea
                node={activeNode}
                materials={materials}
                progress={progress}
                onProgressUpdate={setProgress}
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
              />
            )}
            {currentArea === "practice" && (
              <PracticeArea
                materials={materials}
                progress={progress}
                onProgressUpdate={setProgress}
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
          </main>
        </div>
      )}

      <WordInspectorModal
        word={inspectedWord}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </div>
  );
}

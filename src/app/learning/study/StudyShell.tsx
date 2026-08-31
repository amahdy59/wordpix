import { useState, useEffect } from "react";
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
import type { UnitStudyProgress, StudyArea } from "./types";
import type { Action } from "../../types";
import { WordInspectorModal } from "../../shared/WordInspectorModal";
import type { VocabularyItem } from "../../data/lessons";

interface Props {
  unitId: string;
  unit: CourseUnit;
  materials: UnitLearningMaterials;
  dispatch: React.Dispatch<Action>;
}

export function StudyShell({ unitId, unit, materials, dispatch }: Props) {
  const [progress, setProgress] = useState<UnitStudyProgress>(() => loadStudyProgress(unitId));

  // The curriculum adapter
  const nodes = generateCurriculum(materials);

  // Navigation state: "home" | "learn" | "use" | "practice" | "reference"
  const [currentArea, setCurrentArea] = useState<StudyArea | "home">("home");
  // If inside an area, which node is active?
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<StudyArea>>(
    () => new Set<StudyArea>(["learn", "use", "practice", "reference"])
  );

  // Vocabulary inspector
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    saveStudyProgress(progress);
  }, [progress]);

  const handleContinue = () => {
    // 1. Resume last unfinished
    if (progress.lastNodeId) {
      const node = nodes.find((n) => n.id === progress.lastNodeId);
      if (node) {
        setCurrentArea(node.area);
        setCurrentNodeId(node.id);
        return;
      }
    }

    // 2. Start first
    const firstNode = nodes[0];
    if (firstNode) {
      setCurrentArea(firstNode.area);
      setCurrentNodeId(firstNode.id);
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setCurrentArea(node.area);
      setCurrentNodeId(node.id);
      setProgress((prev) => ({ ...prev, lastNodeId: node.id }));
    }
  };

  const handleBackToHome = () => {
    setCurrentArea("home");
    setCurrentNodeId(null);
  };

  const handleAreaSelect = (area: StudyArea) => {
    const firstNode = nodes.find((node) => node.area === area);
    setCurrentArea(area);
    setCurrentNodeId(firstNode?.id ?? null);
    setExpandedAreas((current) => new Set(current).add(area));
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

  const overallProgress = nodes.length
    ? Math.round(nodes.reduce((total, node) => total + nodeProgress(node.id), 0) / nodes.length)
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
          {/* Desktop Sidebar */}
          <aside
            aria-label={`${unit.name} study navigation`}
            className="hidden h-full w-80 shrink-0 flex-col overflow-y-auto border-e border-border bg-card/95 lg:flex"
          >
            <div className="sticky top-0 z-10 border-b border-border bg-card/95 p-5 backdrop-blur">
              <button
                onClick={handleBackToHome}
                className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-2 text-start text-sm font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span aria-hidden>&larr;</span>
                <span className="truncate">{unit.name}</span>
              </button>

              <div className="mt-4" aria-label={`Overall progress: ${overallProgress}%`}>
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Unit progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
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
                          <span className="text-xs font-bold text-muted-foreground">
                            {progressValue}%
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {areaMeta[area].description}
                        </span>
                        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-secondary">
                          <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${progressValue}%` }}
                          />
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden
                        size={18}
                        className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>

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
            <span className="ms-3 text-sm font-bold">{overallProgress}%</span>
          </div>

          {/* Content Area */}
          <main
            id="study-content"
            className="relative min-w-0 flex-1 overflow-y-auto"
            tabIndex={-1}
          >
            <header className="sticky top-0 z-10 hidden border-b border-border bg-background/90 px-6 py-3 backdrop-blur lg:block">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {unit.name} / {areaMeta[currentArea].label}
                  </p>
                  <p className="truncate text-sm font-bold">
                    {activeNode?.title ?? areaMeta[currentArea].description}
                  </p>
                </div>
                <div
                  className="flex items-center gap-3"
                  aria-label={`Unit progress: ${overallProgress}%`}
                >
                  <span className="text-xs font-bold text-muted-foreground">Unit progress</span>
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{overallProgress}%</span>
                </div>
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
            {currentArea === "practice" && <PracticeArea materials={materials} />}
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

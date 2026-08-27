import { useState, useEffect } from "react";
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

  const activeNode = nodes.find((n) => n.id === currentNodeId);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {currentArea === "home" ? (
        <StudyHome
          unit={unit}
          nodes={nodes}
          progress={progress}
          onContinue={handleContinue}
          onSelectArea={(area: StudyArea) => setCurrentArea(area)}
          onSelectNode={handleNodeSelect}
          dispatch={dispatch}
        />
      ) : (
        <div className="flex flex-col h-full lg:flex-row">
          {/* Desktop Sidebar placeholder */}
          <div className="hidden lg:flex flex-col w-64 border-e p-4 shrink-0 overflow-y-auto">
            <button
              onClick={handleBackToHome}
              className="mb-6 text-sm font-medium hover:underline text-start min-h-[44px]"
            >
              ← {unit.name}
            </button>
            <div className="text-sm font-bold text-muted-foreground mb-4 tracking-wider uppercase">
              {currentArea}
            </div>
            {nodes
              .filter((n) => n.area === currentArea)
              .map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeSelect(node.id)}
                  className={`text-start py-2 px-3 rounded-md mb-1 text-sm min-h-[44px] ${
                    currentNodeId === node.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  {node.title}
                </button>
              ))}
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center p-4 border-b shrink-0">
            <button
              onClick={handleBackToHome}
              className="min-h-[44px] min-w-[44px] p-2 -ms-2 me-2 flex items-center justify-center"
            >
              ←
            </button>
            <div className="font-medium text-sm flex-1 truncate">
              {activeNode?.title || currentArea}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto relative">
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
          </div>
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

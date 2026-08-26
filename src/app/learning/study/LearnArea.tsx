import { useState } from "react";
import type { StudyNode, UnitStudyProgress } from "./types";
import type { UnitLearningMaterials } from "../types";
import { getWords } from "../../data/vocabulary";
import { VocabularyCard } from "./VocabularyCard";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { SecondaryButton } from "../../shared/SecondaryButton";

interface Props {
  node: StudyNode;
  materials: UnitLearningMaterials;
  progress: UnitStudyProgress;
  onProgressUpdate: (update: React.SetStateAction<UnitStudyProgress>) => void;
}

export function LearnArea({ node, materials, onProgressUpdate }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = getWords(node.wordIds || [], materials.unitId);
  const wordMetaMap = Object.fromEntries((materials.wordMeta || []).map((m) => [m.word, m]));

  if (words.length === 0) return <div>No vocabulary found.</div>;

  const currentWord = words[currentIndex];
  const meta = wordMetaMap[currentWord.label.toLowerCase()] || wordMetaMap[currentWord.id];

  const handleNext = () => {
    onProgressUpdate((prev) => {
      const status = prev.wordStatus[currentWord.id] || "new";
      if (status === "new") {
        return {
          ...prev,
          wordStatus: { ...prev.wordStatus, [currentWord.id]: "learning" },
        };
      }
      return prev;
    });

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onProgressUpdate((prev) => {
        if (!prev.completedNodeIds.includes(node.id)) {
          return {
            ...prev,
            completedNodeIds: [...prev.completedNodeIds, node.id],
          };
        }
        return prev;
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isLast = currentIndex === words.length - 1;

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{node.title}</h2>
          {node.description && <p className="text-muted-foreground">{node.description}</p>}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      <div className="w-full">
        <VocabularyCard word={currentWord} meta={meta} materials={materials} />
      </div>

      <div className="w-full flex gap-4 mt-8">
        <div className="w-1/3">
          <SecondaryButton label="Previous" onClick={handlePrevious} />
        </div>
        <div className="w-2/3">
          <PrimaryButton label={isLast ? "Finish" : "Next"} onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}

import type { StudyNode } from "./types";
import type { UnitLearningMaterials } from "../types";
import {
  PassageSection,
  PhrasesSection,
  DialogueSection,
  MistakesSection,
  CultureSection,
} from "../LearningMaterialsScreen";

import type { VocabularyItem } from "../../data/lessons";

interface Props {
  node: StudyNode | undefined;
  materials: UnitLearningMaterials;
  onSelectNode: (nodeId: string) => void;
  allNodes: StudyNode[];
  unitId: string;
  onInspectWord: (word: VocabularyItem) => void;
}

export function UseItArea({
  node,
  materials,
  onSelectNode,
  allNodes,
  unitId,
  onInspectWord,
}: Props) {
  if (!node) {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6">Use It</h2>
        <div className="space-y-4">
          {allNodes.map((n) => (
            <button
              key={n.id}
              onClick={() => onSelectNode(n.id)}
              className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-muted"
            >
              <h3 className="font-bold">{n.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">{node.title}</h2>
      {node.type === "reading" && (
        <PassageSection materials={materials} unitId={unitId} onInspectWord={onInspectWord} />
      )}
      {node.type === "phrases" && (
        <div className="space-y-8">
          <PhrasesSection materials={materials} />
        </div>
      )}
      {node.type === "dialogue" && (
        <DialogueSection materials={materials} unitId={unitId} onInspectWord={onInspectWord} />
      )}
      {node.type === "mistakes" && <MistakesSection materials={materials} />}
      {node.type === "culture" && <CultureSection materials={materials} />}
    </div>
  );
}

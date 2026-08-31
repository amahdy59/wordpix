export type StudyArea = "learn" | "use" | "practice" | "review" | "reference";

export type StudyWordStatus = "new" | "learning" | "comfortable" | "review";

export interface StudyNode {
  id: string;
  area: StudyArea;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  level?: string; // e.g. "A1-A2"

  type:
    | "vocabulary"
    | "phrases"
    | "dialogue"
    | "reading"
    | "practice"
    | "mistakes"
    | "culture"
    | "assessment"
    | "reference";

  source?: string;
  wordIds?: string[];
}

export interface UnitStudyProgress {
  version: 1;
  unitId: string;
  lastNodeId?: string;
  completedNodeIds: string[];
  wordStatus: Record<string, StudyWordStatus>;
  reviewWordIds: string[];
  nodePositions?: Record<string, number>;
  selfAssessment?: Record<string, number>;
  updatedAt: string;
}

export interface PlacementRecommendation {
  level: "A1" | "A2" | "B1";
  startingUnitId: string;
  correctCount: number;
  totalQuestions: number;
}

export function getStartingUnitForLevel(level: PlacementRecommendation["level"]): string {
  if (level === "B1") return "business-communication";
  if (level === "A2") return "supermarket";
  return "numbers-counting";
}

/** Low-stakes recommendation only: it never mutates vocabulary mastery. */
export function recommendPlacement(
  correctCount: number,
  totalQuestions = 3
): PlacementRecommendation {
  if (correctCount >= totalQuestions) {
    return {
      level: "B1",
      startingUnitId: getStartingUnitForLevel("B1"),
      correctCount,
      totalQuestions,
    };
  }
  if (correctCount >= 2) {
    return {
      level: "A2",
      startingUnitId: getStartingUnitForLevel("A2"),
      correctCount,
      totalQuestions,
    };
  }
  return {
    level: "A1",
    startingUnitId: getStartingUnitForLevel("A1"),
    correctCount,
    totalQuestions,
  };
}

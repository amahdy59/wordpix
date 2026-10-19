import type { EnglishLevel } from "../context/LearnerContext";
import type { WordLearningState } from "../../features/gamification/sm2";

/** Target level alone never removes support: production evidence is required. */
export function getLessonScaffolding(
  level: EnglishLevel,
  ids: readonly string[],
  memory: Record<string, WordLearningState>
): "supported" | "guided" | "independent" {
  if (level === "A1" || level === "A2") return "supported";
  const established =
    ids.length > 0 &&
    ids.every((id) => {
      const evidence = memory[id]?.skillMastery?.["controlled-production"];
      return evidence && evidence.attempts >= 3 && evidence.correct / evidence.attempts >= 0.7;
    });
  return established ? "independent" : "guided";
}

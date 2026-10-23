import type { CourseUnit } from "../data/lessons";
import type { WordLearningState } from "../../features/gamification/sm2";
import { getWordMemory } from "./wordIdentity";

/** Placement is an entry point, not a one-time suggestion that disappears on first practice. */
export function recommendPathUnit(
  units: readonly CourseUnit[],
  startingUnitId: string,
  memory: Record<string, WordLearningState>
): CourseUnit | undefined {
  if (units.length === 0) return undefined;
  const placedIndex = Math.max(
    0,
    units.findIndex((unit) => unit.id === startingUnitId)
  );
  return (
    units
      .slice(placedIndex)
      .find((unit) =>
        unit.wordIds.some(
          (id) =>
            !["familiar", "strong"].includes(getWordMemory(memory, id, unit.id)?.mastery ?? "new")
        )
      ) ?? units.at(-1)
  );
}

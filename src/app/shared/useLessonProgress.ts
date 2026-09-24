import { useMemo } from "react";

export interface LessonProgressState<T extends string | number> {
  completedStages: ReadonlySet<T>;
  maxUnlockedIndex: number;
  initialIndex: number;
}

interface LessonProgressOptions<T extends string | number> {
  stageIds: readonly T[];
  currentStage?: number;
  requestedStage?: number;
  completedStages?: readonly T[];
  isMastered?: boolean;
  lockFutureStages?: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function getLessonProgressState<T extends string | number>(
  options: LessonProgressOptions<T>
): LessonProgressState<T> {
  const { stageIds, currentStage, requestedStage, completedStages: completed = [] } = options;
  const completedStages = new Set(completed);
  const lastIndex = Math.max(0, stageIds.length - 1);
  const firstIncompleteIndex = stageIds.findIndex((stage) => !completedStages.has(stage));
  const lockFutureStages = options.lockFutureStages ?? false;
  const maxUnlockedIndex = lockFutureStages
    ? options.isMastered || firstIncompleteIndex < 0
      ? lastIndex
      : Math.max(0, firstIncompleteIndex)
    : lastIndex;
  const requestedIndex = requestedStage ?? currentStage ?? 0;

  return {
    completedStages,
    maxUnlockedIndex,
    initialIndex: clamp(requestedIndex, 0, maxUnlockedIndex),
  };
}

export function useLessonProgress<T extends string | number>(
  options: LessonProgressOptions<T>
): LessonProgressState<T> {
  const { stageIds, currentStage, requestedStage, completedStages, isMastered, lockFutureStages } =
    options;

  return useMemo(
    () =>
      getLessonProgressState({
        stageIds,
        currentStage,
        requestedStage,
        completedStages,
        isMastered,
        lockFutureStages,
      }),
    [stageIds, currentStage, requestedStage, completedStages, isMastered, lockFutureStages]
  );
}

import type { SkillExerciseId } from "../../types";
import type { ExerciseDefinition } from "../taskTypes";
import { LISTENING_EXERCISES } from "./listeningTasks";
import { READING_EXERCISES } from "./readingTasks";
import { SPEAKING_EXERCISES, WRITING_EXERCISES } from "./speakingWritingTasks";

/**
 * Every hub screen expressed as data, run by SkillExerciseRunner.
 *
 * Screens absent from this map keep a bespoke component, because they need
 * something the runner does not model:
 *   - the three "…Results" screens are summaries, not exercises
 *   - Echo Practice drives the Web Speech API
 *   - the two sprint screens (dictation, timed writing) have their own layouts
 *   - Visual Context is an image-choice drill wired to the lesson vocabulary
 */
export const EXERCISE_DEFINITIONS: Partial<Record<SkillExerciseId, ExerciseDefinition>> = {
  ...LISTENING_EXERCISES,
  ...READING_EXERCISES,
  ...SPEAKING_EXERCISES,
  ...WRITING_EXERCISES,
} as Partial<Record<SkillExerciseId, ExerciseDefinition>>;

export function getExerciseDefinition(id: SkillExerciseId): ExerciseDefinition | undefined {
  return EXERCISE_DEFINITIONS[id];
}

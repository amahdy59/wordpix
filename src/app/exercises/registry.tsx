import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { Action, SkillExerciseId } from "../types";

export interface SkillExerciseProps {
  dispatch: React.Dispatch<Action>;
}

type SkillExerciseComponent = LazyExoticComponent<ComponentType<SkillExerciseProps>>;

/**
 * Lazy registry for the 35 skill-exercise screens.
 *
 * Most are now defined as data in ./content and rendered by
 * SkillExerciseRunner, which supplies scoring, feedback, keyboard operation,
 * and live announcements once instead of 35 times. The handful listed
 * explicitly below keep bespoke components because they need something the
 * runner does not model — speech recognition, a sprint layout, or a results
 * summary.
 *
 * App.tsx previously held a 45-case switch fed by 40 eager imports; the README
 * described "code-split routes" while nothing was ever React.lazy, so the whole
 * suite shipped in the initial bundle.
 */

const runner = () => import("./SkillExerciseRunner");

/** Wraps the shared runner around one definition. */
function dataDriven(id: SkillExerciseId): SkillExerciseComponent {
  return lazy(async () => {
    const [{ SkillExerciseRunner }, { getExerciseDefinition }] = await Promise.all([
      runner(),
      import("./content"),
    ]);
    const definition = getExerciseDefinition(id);
    return {
      default: ({ dispatch }: SkillExerciseProps) =>
        definition ? <SkillExerciseRunner definition={definition} dispatch={dispatch} /> : null,
    };
  });
}

const listening = () => import("./listening/ListeningSuite");
const reading = () => import("./reading/ReadingSuite");
const speaking = () => import("./speaking/SpeakingSuite");
const writing = () => import("./writing/WritingSuite");

export const SKILL_EXERCISES: Record<SkillExerciseId, SkillExerciseComponent> = {
  // Listening (9)
  "listen-word-match": dataDriven("listen-word-match"),
  "listen-audio-scene-match": dataDriven("listen-audio-scene-match"),
  "listen-dictation-sprint": lazy(() => listening().then((m) => ({ default: m.ExListeningDictationSprint }))),
  "listen-vocab-spotting": dataDriven("listen-vocab-spotting"),
  "listen-dialogue-roleplay": dataDriven("listen-dialogue-roleplay"),
  "listen-selective-shadowing": dataDriven("listen-selective-shadowing"),
  "listen-results": lazy(() => listening().then((m) => ({ default: m.ExListeningResults }))),
  "listen-warmup-review": dataDriven("listen-warmup-review"),
  "listen-podcast-comprehension": dataDriven("listen-podcast-comprehension"),

  // Reading (9)
  "read-visual-context": lazy(() => reading().then((m) => ({ default: m.ExReadingVisualContext }))),
  "read-progressive-reveal": dataDriven("read-progressive-reveal"),
  "read-error-detection": dataDriven("read-error-detection"),
  "read-comic-strip": dataDriven("read-comic-strip"),
  "read-infographic": dataDriven("read-infographic"),
  "read-category-sort": dataDriven("read-category-sort"),
  "read-results": lazy(() => reading().then((m) => ({ default: m.ExReadingResults }))),
  "read-subtitle-correction": dataDriven("read-subtitle-correction"),
  "read-confidence-check": dataDriven("read-confidence-check"),

  // Speaking (8)
  "speak-echo-practice": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingEchoPractice }))),
  "speak-scenario-response": dataDriven("speak-scenario-response"),
  "speak-photo-narration": dataDriven("speak-photo-narration"),
  "speak-video-roleplay": dataDriven("speak-video-roleplay"),
  "speak-compare-contrast": dataDriven("speak-compare-contrast"),
  "speak-word-chain": dataDriven("speak-word-chain"),
  "speak-self-repair": dataDriven("speak-self-repair"),
  "speak-results": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingResults }))),

  // Writing (9)
  "write-caption-builder": dataDriven("write-caption-builder"),
  "write-sentence-assembly": dataDriven("write-sentence-assembly"),
  "write-photo-journal": dataDriven("write-photo-journal"),
  "write-video-summary": dataDriven("write-video-summary"),
  "write-error-correction": dataDriven("write-error-correction"),
  "write-paraphrase-challenge": dataDriven("write-paraphrase-challenge"),
  "write-image-story-chain": dataDriven("write-image-story-chain"),
  "write-results": lazy(() => writing().then((m) => ({ default: m.ExWritingResults }))),
  "write-timed-sprint": lazy(() => writing().then((m) => ({ default: m.ExWritingTimedSprint }))),
};

export const SKILL_EXERCISE_IDS = Object.keys(SKILL_EXERCISES) as SkillExerciseId[];

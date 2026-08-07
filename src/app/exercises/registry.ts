import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { Action, SkillExerciseId } from "../types";

export interface SkillExerciseProps {
  dispatch: React.Dispatch<Action>;
}

type SkillExerciseComponent = LazyExoticComponent<ComponentType<SkillExerciseProps>>;

/**
 * Lazy registry for the 35 skill-exercise screens.
 *
 * App.tsx previously held a 45-case switch fed by 40 eager imports. The README
 * described "code-split routes" and the file wrapped everything in <Suspense>
 * with a LoadingFallback — but nothing was ever React.lazy, so the boundary and
 * its fallback were dead code and the entire suite shipped in the initial
 * bundle. The core lesson loop stays eagerly imported in App.tsx (it is the
 * hot path and must not flash); this rarely-visited suite is now split out.
 *
 * Each suite module is referenced by several entries below, so Vite emits one
 * chunk per suite rather than one per screen.
 */
const listening = () => import("./listening/ListeningSuite");
const reading = () => import("./reading/ReadingSuite");
const speaking = () => import("./speaking/SpeakingSuite");
const writing = () => import("./writing/WritingSuite");

export const SKILL_EXERCISES: Record<SkillExerciseId, SkillExerciseComponent> = {
  // Listening (9)
  "listen-word-match": lazy(() => listening().then((m) => ({ default: m.ExListeningWordMatch }))),
  "listen-audio-scene-match": lazy(() => listening().then((m) => ({ default: m.ExListeningAudioSceneMatch }))),
  "listen-dictation-sprint": lazy(() => listening().then((m) => ({ default: m.ExListeningDictationSprint }))),
  "listen-vocab-spotting": lazy(() => listening().then((m) => ({ default: m.ExListeningVocabSpotting }))),
  "listen-dialogue-roleplay": lazy(() => listening().then((m) => ({ default: m.ExListeningDialogueRolePlay }))),
  "listen-selective-shadowing": lazy(() => listening().then((m) => ({ default: m.ExListeningSelectiveShadowing }))),
  "listen-results": lazy(() => listening().then((m) => ({ default: m.ExListeningResults }))),
  "listen-warmup-review": lazy(() => listening().then((m) => ({ default: m.ExListeningWarmupReview }))),
  "listen-podcast-comprehension": lazy(() => listening().then((m) => ({ default: m.ExListeningPodcastComprehension }))),

  // Reading (9)
  "read-visual-context": lazy(() => reading().then((m) => ({ default: m.ExReadingVisualContext }))),
  "read-progressive-reveal": lazy(() => reading().then((m) => ({ default: m.ExReadingProgressiveReveal }))),
  "read-error-detection": lazy(() => reading().then((m) => ({ default: m.ExReadingErrorDetection }))),
  "read-comic-strip": lazy(() => reading().then((m) => ({ default: m.ExReadingComicStrip }))),
  "read-infographic": lazy(() => reading().then((m) => ({ default: m.ExReadingInfographic }))),
  "read-category-sort": lazy(() => reading().then((m) => ({ default: m.ExReadingCategorySort }))),
  "read-results": lazy(() => reading().then((m) => ({ default: m.ExReadingResults }))),
  "read-subtitle-correction": lazy(() => reading().then((m) => ({ default: m.ExReadingSubtitleCorrection }))),
  "read-confidence-check": lazy(() => reading().then((m) => ({ default: m.ExReadingConfidenceCheck }))),

  // Speaking (8)
  "speak-echo-practice": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingEchoPractice }))),
  "speak-scenario-response": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingScenarioResponse }))),
  "speak-photo-narration": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingPhotoNarration }))),
  "speak-video-roleplay": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingVideoRoleplay }))),
  "speak-compare-contrast": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingCompareContrast }))),
  "speak-word-chain": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingWordChain }))),
  "speak-self-repair": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingSelfRepair }))),
  "speak-results": lazy(() => speaking().then((m) => ({ default: m.ExSpeakingResults }))),

  // Writing (9)
  "write-caption-builder": lazy(() => writing().then((m) => ({ default: m.ExWritingCaptionBuilder }))),
  "write-sentence-assembly": lazy(() => writing().then((m) => ({ default: m.ExWritingSentenceAssembly }))),
  "write-photo-journal": lazy(() => writing().then((m) => ({ default: m.ExWritingPhotoJournal }))),
  "write-video-summary": lazy(() => writing().then((m) => ({ default: m.ExWritingVideoSummary }))),
  "write-error-correction": lazy(() => writing().then((m) => ({ default: m.ExWritingErrorCorrection }))),
  "write-paraphrase-challenge": lazy(() => writing().then((m) => ({ default: m.ExWritingParaphraseChallenge }))),
  "write-image-story-chain": lazy(() => writing().then((m) => ({ default: m.ExWritingImageStoryChain }))),
  "write-results": lazy(() => writing().then((m) => ({ default: m.ExWritingResults }))),
  "write-timed-sprint": lazy(() => writing().then((m) => ({ default: m.ExWritingTimedSprint }))),
};

export const SKILL_EXERCISE_IDS = Object.keys(SKILL_EXERCISES) as SkillExerciseId[];

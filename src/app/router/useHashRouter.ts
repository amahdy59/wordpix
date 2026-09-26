import { useEffect, useCallback } from "react";
import type { Screen, SkillExerciseId } from "../types";
import { SKILL_EXERCISE_IDS } from "../exercises/registry";
import { COURSE_UNITS, DEFAULT_UNIT_ID, resolveUnitForLesson } from "../data/lessons";
import {
  PRONUNCIATION_LESSON_COUNT,
  getPronunciationLessonMetadata,
} from "../learning/foundations/pronunciationLessonMetadata";
import { LEGACY_PRONUNCIATION_LESSON_NUMBERS } from "../learning/foundations/pronunciationProgress";
import {
  HADITH_LESSON_COUNT,
  getHadithLessonMetadata,
} from "../learning/hadith/hadithLessonMetadata";
import type { ConversationStageId } from "../learning/conversation/conversationTypes";
import { CONVERSATION_STAGE_IDS } from "../learning/conversation/conversationTypes";
import type { BusinessStageId } from "../learning/business/businessTypes";
import { BUSINESS_STAGE_IDS } from "../learning/business/businessTypes";

const SKILL_EXERCISE_ID_SET = new Set<string>(SKILL_EXERCISE_IDS);

function isSkillExerciseId(value: string): value is SkillExerciseId {
  return SKILL_EXERCISE_ID_SET.has(value);
}

/** Number of steps in a lesson flow (5 exercises, scene removed). */
const LESSON_STEP_COUNT = 5;

/**
 * What a URL asks the app to do.
 *
 * Not every hash maps to a complete Screen: a lesson step cannot be
 * reconstructed from a URL alone because it carries a sessionId, a word queue,
 * and recorded attempts. Previously screenToHash happily wrote
 * `#/learn/bedroom/step-3` while ROUTES had no matching entry, so hashToScreen
 * returned null, the popstate handler did nothing, and browser Back inside a
 * lesson silently failed — while each step pushed another unreachable history
 * entry. Modelling intent instead of Screen is what makes Back work.
 */
export type RouteIntent =
  | { kind: "screen"; screen: Screen; title: string }
  | { kind: "lesson-step"; step: number; title: string }
  | { kind: "lesson-complete"; title: string };

const STATIC_ROUTES: Record<string, { title: string; getScreen: () => Screen }> = {
  "#/home": { title: "WordPix — Home", getScreen: () => ({ id: "home" }) },
  "#/explore": { title: "WordPix — Learning Path", getScreen: () => ({ id: "learn" as const }) },
  "#/learn": { title: "WordPix — Learning Path", getScreen: () => ({ id: "learn" as const }) },
  "#/library": { title: "WordPix — Vocabulary Library", getScreen: () => ({ id: "library" }) },
  "#/practice": { title: "WordPix — Skill Practice", getScreen: () => ({ id: "practice" }) },
  "#/review": { title: "WordPix — Daily Review", getScreen: () => ({ id: "review" }) },
  "#/profile": { title: "WordPix — Learner Profile", getScreen: () => ({ id: "profile" }) },
  "#/skills": { title: "WordPix — Skill Exercises", getScreen: () => ({ id: "skill-hub" }) },
  "#/pronunciation": {
    title: "WordPix — Pronunciation Curriculum",
    getScreen: () => ({ id: "pronunciation-curriculum" }),
  },
  "#/hadith": {
    title: "WordPix — Hadith Curriculum",
    getScreen: () => ({ id: "hadith-curriculum" }),
  },
  "#/conversation": {
    title: "WordPix — Conversation & Debate",
    getScreen: () => ({ id: "conversation-curriculum" }),
  },
  "#/business": {
    title: "WordPix — Beyond Business English",
    getScreen: () => ({ id: "business-curriculum" }),
  },
  "#/onboarding": {
    title: "WordPix — Welcome",
    // Onboarding needs its step: `{ id: "onboarding" }` alone renders nothing.
    getScreen: () => ({ id: "onboarding", step: "splash" }),
  },
};

/**
 * `#/learn/<world>[/step-N|/complete]` used to hardcode the literal "bedroom"
 * segment, so a second registered world would have needed a router code
 * change instead of a data-only addition. Matches any id actually registered
 * in `COURSE_UNITS` — today that is still only "bedroom".
 */
const WORLD_ID_GROUP = Object.keys(COURSE_UNITS)
  .map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
const LESSON_ENTRY_PATTERN = new RegExp(`^#\\/learn\\/(${WORLD_ID_GROUP})$`);
const LESSON_STEP_PATTERN = new RegExp(`^#\\/learn\\/(${WORLD_ID_GROUP})\\/step-(\\d+)$`);
const LESSON_COMPLETE_PATTERN = new RegExp(`^#\\/learn\\/(${WORLD_ID_GROUP})\\/complete$`);
const LEARNING_MATERIALS_PATTERN = new RegExp(
  `^#\\/learn\\/(${WORLD_ID_GROUP})\\/study(?:\\/([^/]+)(?:\\/([^/]+))?)?$`
);
const SKILL_EXERCISE_PATTERN = /^#\/skills\/([a-z-]+)$/;
const FOUNDATION_LESSON_PATTERN = /^#\/foundations\/([a-z-]+)$/;
const FIGMA_PRONUNCIATION_PATTERN = /^#\/pronunciation\/lesson-(\d+)$/;
const HADITH_LESSON_PATTERN = /^#\/hadith\/lesson-(\d+)$/;
const CONVERSATION_LESSON_PATTERN = /^#\/conversation\/(unit-\d{2})(?:\/([a-z-]+))?$/;
const BUSINESS_LESSON_PATTERN = /^#\/business\/(unit-\d{2})(?:\/([a-z-]+))?$/;

function isConversationUnitId(value: string): boolean {
  const match = /^unit-(\d{2})$/.exec(value);
  if (!match) return false;
  const unitNumber = Number(match[1]);
  return unitNumber >= 1 && unitNumber <= 40;
}

function conversationUnitTitle(unitId: string): string {
  return `WordPix — Conversation & Debate — Unit ${Number(unitId.slice(-2))}`;
}

function isBusinessUnitId(value: string): boolean {
  const match = /^unit-(\d{2})$/.exec(value);
  if (!match) return false;
  const unitNumber = Number(match[1]);
  return unitNumber >= 1 && unitNumber <= 40;
}

function businessUnitTitle(unitId: string): string {
  return `WordPix — Beyond Business English — Unit ${Number(unitId.slice(-2))}`;
}

/** Keep retired pronunciation bookmarks useful by routing them into the
 * closest lesson in the consolidated eight-chapter curriculum. */
export function screenToHash(screen: Screen): { hash: string; title: string } {
  if (screen.id === "onboarding") return { hash: "#/onboarding", title: "WordPix — Onboarding" };
  if (screen.id === "home") return { hash: "#/home", title: "WordPix — Home" };
  if (screen.id === "learn" || screen.id === "explore")
    return { hash: "#/learn", title: "WordPix — Learning Path" };
  if (screen.id === "library") return { hash: "#/library", title: "WordPix — Vocabulary Library" };
  if (screen.id === "practice") return { hash: "#/practice", title: "WordPix — Skill Practice" };
  if (screen.id === "review") return { hash: "#/review", title: "WordPix — Daily Review" };
  if (screen.id === "profile") return { hash: "#/profile", title: "WordPix — Learner Profile" };
  if (screen.id === "lesson-entry") {
    const world = COURSE_UNITS[screen.unitId ?? DEFAULT_UNIT_ID] ?? COURSE_UNITS[DEFAULT_UNIT_ID];
    return { hash: `#/learn/${world.id}`, title: `WordPix — ${world.name}` };
  }
  if (screen.id === "learning-materials") {
    const world = COURSE_UNITS[screen.unitId ?? DEFAULT_UNIT_ID] ?? COURSE_UNITS[DEFAULT_UNIT_ID];
    let hash = `#/learn/${world.id}/study`;
    if (screen.area) {
      hash += `/${screen.area}`;
      if (screen.nodeId) hash += `/${screen.nodeId}`;
    }
    return { hash, title: `WordPix — ${world.name} Study Materials` };
  }
  if (screen.id === "skill-hub") return { hash: "#/skills", title: "WordPix — Skill Exercises" };
  if (screen.id === "skill-exercise") {
    return { hash: `#/skills/${screen.exerciseId}`, title: `WordPix — ${screen.exerciseId}` };
  }
  if (screen.id === "pronunciation-curriculum") {
    return { hash: "#/pronunciation", title: "WordPix — Pronunciation Curriculum" };
  }
  if (screen.id === "figma-pronunciation-lesson") {
    const lesson = getPronunciationLessonMetadata(screen.lessonNumber);
    return {
      hash: `#/pronunciation/lesson-${String(lesson.number).padStart(2, "0")}`,
      title: `WordPix — ${lesson.sourceName}`,
    };
  }
  if (screen.id === "hadith-lesson") {
    const lessonNumber = Number(screen.lessonId.match(/\d+$/)?.[0] ?? 1);
    const lesson = getHadithLessonMetadata(lessonNumber);
    return {
      hash: `#/hadith/lesson-${lesson?.number ?? 1}`,
      title: `WordPix — ${lesson?.title ?? "Hadith lesson"}`,
    };
  }
  if (screen.id === "hadith-curriculum") {
    return { hash: "#/hadith", title: "WordPix — Hadith Curriculum" };
  }
  if (screen.id === "conversation-curriculum") {
    return { hash: "#/conversation", title: "WordPix — Conversation & Debate" };
  }
  if (screen.id === "conversation-lesson") {
    const stagePart = screen.stage ? `/${screen.stage}` : "";
    return {
      hash: `#/conversation/${screen.unitId}${stagePart}`,
      title: conversationUnitTitle(screen.unitId),
    };
  }
  if (screen.id === "business-curriculum") {
    return { hash: "#/business", title: "WordPix — Beyond Business English" };
  }
  if (screen.id === "business-lesson") {
    const stagePart = screen.stage ? `/${screen.stage}` : "";
    return {
      hash: `#/business/${screen.unitId}${stagePart}`,
      title: businessUnitTitle(screen.unitId),
    };
  }
  if (screen.id === "lesson") {
    const world = resolveUnitForLesson(screen.lessonId);
    return {
      hash: `#/learn/${world.id}/step-${screen.step + 1}`,
      title: `WordPix — ${world.name} Lesson (${screen.step + 1}/${LESSON_STEP_COUNT})`,
    };
  }
  if (screen.id === "lesson-complete") {
    const world = resolveUnitForLesson(screen.lessonId);
    return { hash: `#/learn/${world.id}/complete`, title: "WordPix — Session Complete" };
  }
  return { hash: "#/home", title: "WordPix" };
}

export function hashToRoute(hash: string): RouteIntent | null {
  const normalized = hash.toLowerCase();

  const foundationMatch = normalized.match(FOUNDATION_LESSON_PATTERN);
  const requestedFoundationId = foundationMatch?.[1];
  const consolidatedLessonNumber = requestedFoundationId
    ? LEGACY_PRONUNCIATION_LESSON_NUMBERS[requestedFoundationId]
    : undefined;
  if (consolidatedLessonNumber) {
    const lesson = getPronunciationLessonMetadata(consolidatedLessonNumber);
    return {
      kind: "screen",
      screen: { id: "figma-pronunciation-lesson", lessonNumber: consolidatedLessonNumber },
      title: `WordPix — ${lesson.sourceName}`,
    };
  }

  const figmaMatch = normalized.match(FIGMA_PRONUNCIATION_PATTERN);
  if (figmaMatch) {
    const lessonNumber = Number(figmaMatch[1]);
    if (
      Number.isInteger(lessonNumber) &&
      lessonNumber >= 1 &&
      lessonNumber <= PRONUNCIATION_LESSON_COUNT
    ) {
      const lesson = getPronunciationLessonMetadata(lessonNumber);
      return {
        kind: "screen",
        screen: { id: "figma-pronunciation-lesson", lessonNumber },
        title: `WordPix — ${lesson.sourceName}`,
      };
    }
    return null;
  }

  const hadithMatch = normalized.match(HADITH_LESSON_PATTERN);
  if (hadithMatch) {
    const lessonNumber = Number(hadithMatch[1]);
    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > HADITH_LESSON_COUNT) {
      return null;
    }
    const lesson = getHadithLessonMetadata(lessonNumber);
    if (!lesson) return null;
    return {
      kind: "screen",
      screen: { id: "hadith-lesson", lessonId: lesson.id },
      title: `WordPix — ${lesson.title}`,
    };
  }

  const convMatch = normalized.match(CONVERSATION_LESSON_PATTERN);
  if (convMatch) {
    const unitId = convMatch[1];
    if (!isConversationUnitId(unitId)) return null;
    const rawStage = convMatch[2];
    const stage =
      rawStage && CONVERSATION_STAGE_IDS.includes(rawStage as ConversationStageId)
        ? (rawStage as ConversationStageId)
        : undefined;
    if (rawStage && !stage) return null;
    return {
      kind: "screen",
      screen: { id: "conversation-lesson", unitId, stage },
      title: conversationUnitTitle(unitId),
    };
  }

  const businessMatch = normalized.match(BUSINESS_LESSON_PATTERN);
  if (businessMatch) {
    const unitId = businessMatch[1];
    if (!isBusinessUnitId(unitId)) return null;
    const rawStage = businessMatch[2];
    const stage =
      rawStage && BUSINESS_STAGE_IDS.includes(rawStage as BusinessStageId)
        ? (rawStage as BusinessStageId)
        : undefined;
    if (rawStage && !stage) return null;
    return {
      kind: "screen",
      screen: { id: "business-lesson", unitId, stage },
      title: businessUnitTitle(unitId),
    };
  }

  const stepMatch = normalized.match(LESSON_STEP_PATTERN);
  if (stepMatch) {
    const world = COURSE_UNITS[stepMatch[1]];
    const oneBased = Number(stepMatch[2]);
    if (world && oneBased >= 1 && oneBased <= LESSON_STEP_COUNT) {
      return {
        kind: "lesson-step",
        step: oneBased - 1,
        title: `WordPix — ${world.name} Lesson (${oneBased}/${LESSON_STEP_COUNT})`,
      };
    }
    return null;
  }

  if (LESSON_COMPLETE_PATTERN.test(normalized)) {
    return { kind: "lesson-complete", title: "WordPix — Session Complete" };
  }

  const studyMatch = normalized.match(LEARNING_MATERIALS_PATTERN);
  if (studyMatch) {
    const world = COURSE_UNITS[studyMatch[1]];
    if (!world) return null;
    return {
      kind: "screen",
      screen: {
        id: "learning-materials",
        unitId: world.id,
        area: studyMatch[2],
        nodeId: studyMatch[3],
      },
      title: `WordPix — ${world.name} Study Materials`,
    };
  }

  const entryMatch = normalized.match(LESSON_ENTRY_PATTERN);
  if (entryMatch) {
    const world = COURSE_UNITS[entryMatch[1]];
    if (!world) return null;
    return {
      kind: "screen",
      screen: { id: "lesson-entry", unitId: world.id },
      title: `WordPix — ${world.name}`,
    };
  }

  // screenToHash writes #/skills/<id>; without a matching reader the URL and
  // the rendered screen silently disagreed after a reload or a Back press.
  const skillMatch = normalized.match(SKILL_EXERCISE_PATTERN);
  if (skillMatch) {
    const exerciseId = skillMatch[1];
    if (isSkillExerciseId(exerciseId)) {
      return {
        kind: "screen",
        screen: { id: "skill-exercise", exerciseId },
        title: `WordPix — ${exerciseId}`,
      };
    }
    return null;
  }

  const match = STATIC_ROUTES[normalized];
  if (match) return { kind: "screen", screen: match.getScreen(), title: match.title };

  return null;
}

/** Convenience wrapper for callers that only care about fully-formed screens. */
export function hashToScreen(hash: string): { screen: Screen; title: string } | null {
  const route = hashToRoute(hash);
  return route?.kind === "screen" ? { screen: route.screen, title: route.title } : null;
}

export function useHashRouter(currentScreen: Screen, onRoute: (intent: RouteIntent) => void) {
  useEffect(() => {
    const { hash, title } = screenToHash(currentScreen);

    if (window.location.hash !== hash) {
      if (!window.location.hash || window.location.hash === "#/") {
        window.history.replaceState(null, "", hash);
      } else {
        window.history.pushState(null, "", hash);
      }
    }
    document.title = title;

    const mainEl = document.getElementById("main-content");
    if (mainEl) mainEl.focus({ preventScroll: true });
  }, [currentScreen]);

  const handleHashChange = useCallback(() => {
    const resolved = hashToRoute(window.location.hash);
    if (!resolved) return;
    document.title = resolved.title;
    onRoute(resolved);
  }, [onRoute]);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [handleHashChange]);
}

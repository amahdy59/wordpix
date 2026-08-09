import { useEffect, useCallback } from "react";
import type { Screen, SkillExerciseId } from "../types";
import { SKILL_EXERCISE_IDS } from "../exercises/registry";
import { LESSON_WORLDS, DEFAULT_WORLD_ID, resolveWorldForGroup } from "../data/lessons";

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
  "#/explore": { title: "WordPix — Explore Worlds", getScreen: () => ({ id: "explore" }) },
  "#/learn": { title: "WordPix — Explore Worlds", getScreen: () => ({ id: "explore" }) },
  "#/practice": { title: "WordPix — Daily Review", getScreen: () => ({ id: "practice" }) },
  "#/review": { title: "WordPix — Daily Review", getScreen: () => ({ id: "practice" }) },
  "#/profile": { title: "WordPix — Learner Profile", getScreen: () => ({ id: "profile" }) },
  "#/skills": { title: "WordPix — Skill Exercises", getScreen: () => ({ id: "skill-hub" }) },
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
 * in `LESSON_WORLDS` — today that is still only "bedroom".
 */
const WORLD_ID_GROUP = Object.keys(LESSON_WORLDS)
  .map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
const LESSON_ENTRY_PATTERN = new RegExp(`^#\\/learn\\/(${WORLD_ID_GROUP})$`);
const LESSON_STEP_PATTERN = new RegExp(`^#\\/learn\\/(${WORLD_ID_GROUP})\\/step-(\\d+)$`);
const LESSON_COMPLETE_PATTERN = new RegExp(`^#\\/learn\\/(${WORLD_ID_GROUP})\\/complete$`);
const SKILL_EXERCISE_PATTERN = /^#\/skills\/([a-z-]+)$/;

export function screenToHash(screen: Screen): { hash: string; title: string } {
  if (screen.id === "onboarding") return { hash: "#/onboarding", title: "WordPix — Onboarding" };
  if (screen.id === "home") return { hash: "#/home", title: "WordPix — Home" };
  if (screen.id === "explore") return { hash: "#/explore", title: "WordPix — Explore Worlds" };
  if (screen.id === "practice") return { hash: "#/practice", title: "WordPix — Daily Review" };
  if (screen.id === "profile") return { hash: "#/profile", title: "WordPix — Learner Profile" };
  if (screen.id === "lesson-entry") {
    const world = LESSON_WORLDS[screen.worldId ?? DEFAULT_WORLD_ID];
    return { hash: `#/learn/${world.id}`, title: `WordPix — ${world.name}` };
  }
  if (screen.id === "skill-hub") return { hash: "#/skills", title: "WordPix — Skill Exercises" };
  if (screen.id === "skill-exercise") {
    return { hash: `#/skills/${screen.exerciseId}`, title: `WordPix — ${screen.exerciseId}` };
  }
  if (screen.id === "lesson") {
    const world = resolveWorldForGroup(screen.groupId);
    return {
      hash: `#/learn/${world.id}/step-${screen.step + 1}`,
      title: `WordPix — ${world.name} Lesson (${screen.step + 1}/${LESSON_STEP_COUNT})`,
    };
  }
  if (screen.id === "lesson-complete") {
    const world = resolveWorldForGroup(screen.groupId);
    return { hash: `#/learn/${world.id}/complete`, title: "WordPix — Session Complete" };
  }
  return { hash: "#/home", title: "WordPix" };
}

export function hashToRoute(hash: string): RouteIntent | null {
  const normalized = hash.toLowerCase();

  const stepMatch = normalized.match(LESSON_STEP_PATTERN);
  if (stepMatch) {
    const world = LESSON_WORLDS[stepMatch[1]];
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

  const entryMatch = normalized.match(LESSON_ENTRY_PATTERN);
  if (entryMatch) {
    const world = LESSON_WORLDS[entryMatch[1]];
    if (!world) return null;
    return {
      kind: "screen",
      screen: { id: "lesson-entry", worldId: world.id },
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

export function useHashRouter(
  currentScreen: Screen,
  onRoute: (intent: RouteIntent) => void
) {
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

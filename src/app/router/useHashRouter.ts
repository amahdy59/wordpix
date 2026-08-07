import { useEffect, useCallback } from "react";
import type { Screen } from "../types";

/** Number of steps in a lesson flow (scene + 5 exercises). */
const LESSON_STEP_COUNT = 6;

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
  "#/learn/bedroom": { title: "WordPix — The Bedroom", getScreen: () => ({ id: "lesson-entry" }) },
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

const LESSON_STEP_PATTERN = /^#\/learn\/bedroom\/step-(\d+)$/;

export function screenToHash(screen: Screen): { hash: string; title: string } {
  if (screen.id === "onboarding") return { hash: "#/onboarding", title: "WordPix — Onboarding" };
  if (screen.id === "home") return { hash: "#/home", title: "WordPix — Home" };
  if (screen.id === "explore") return { hash: "#/explore", title: "WordPix — Explore Worlds" };
  if (screen.id === "practice") return { hash: "#/practice", title: "WordPix — Daily Review" };
  if (screen.id === "profile") return { hash: "#/profile", title: "WordPix — Learner Profile" };
  if (screen.id === "lesson-entry") return { hash: "#/learn/bedroom", title: "WordPix — The Bedroom" };
  if (screen.id === "skill-hub") return { hash: "#/skills", title: "WordPix — Skill Exercises" };
  if (screen.id === "skill-exercise") {
    return { hash: `#/skills/${screen.exerciseId}`, title: `WordPix — ${screen.exerciseId}` };
  }
  if (screen.id === "lesson") {
    return {
      hash: `#/learn/bedroom/step-${screen.step + 1}`,
      title: `WordPix — Bedroom Lesson (${screen.step + 1}/${LESSON_STEP_COUNT})`,
    };
  }
  if (screen.id === "lesson-complete") {
    return { hash: "#/learn/bedroom/complete", title: "WordPix — Session Complete" };
  }
  return { hash: "#/home", title: "WordPix" };
}

export function hashToRoute(hash: string): RouteIntent | null {
  const normalized = hash.toLowerCase();

  const stepMatch = normalized.match(LESSON_STEP_PATTERN);
  if (stepMatch) {
    const oneBased = Number(stepMatch[1]);
    if (oneBased >= 1 && oneBased <= LESSON_STEP_COUNT) {
      return {
        kind: "lesson-step",
        step: oneBased - 1,
        title: `WordPix — Bedroom Lesson (${oneBased}/${LESSON_STEP_COUNT})`,
      };
    }
    return null;
  }

  if (normalized === "#/learn/bedroom/complete") {
    return { kind: "lesson-complete", title: "WordPix — Session Complete" };
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

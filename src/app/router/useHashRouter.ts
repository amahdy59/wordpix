import { useEffect, useCallback } from "react";
import type { Screen } from "../types";

export interface RouteMapping {
  hash: string;
  title: string;
  screen: Screen;
}

const ROUTES: Record<string, { title: string; getScreen: () => Screen }> = {
  "#/home": { title: "WordPix — Home", getScreen: () => ({ id: "home" }) },
  "#/explore": { title: "WordPix — Explore Worlds", getScreen: () => ({ id: "explore" }) },
  "#/learn": { title: "WordPix — Explore Worlds", getScreen: () => ({ id: "explore" }) },
  "#/learn/bedroom": { title: "WordPix — The Bedroom", getScreen: () => ({ id: "lesson-entry" }) },
  "#/practice": { title: "WordPix — Daily Review", getScreen: () => ({ id: "practice" }) },
  "#/review": { title: "WordPix — Daily Review", getScreen: () => ({ id: "practice" }) },
  "#/profile": { title: "WordPix — Learner Profile", getScreen: () => ({ id: "profile" }) },
  "#/onboarding": { title: "WordPix — Welcome", getScreen: () => ({ id: "onboarding", step: "splash" }) },
};

export function screenToHash(screen: Screen): { hash: string; title: string } {
  if (screen.id === "onboarding") return { hash: "#/onboarding", title: "WordPix — Onboarding" };
  if (screen.id === "home") return { hash: "#/home", title: "WordPix — Home" };
  if (screen.id === "explore") return { hash: "#/explore", title: "WordPix — Explore Worlds" };
  if (screen.id === "practice") return { hash: "#/practice", title: "WordPix — Daily Review" };
  if (screen.id === "profile") return { hash: "#/profile", title: "WordPix — Learner Profile" };
  if (screen.id === "lesson-entry") return { hash: "#/learn/bedroom", title: "WordPix — The Bedroom" };
  if (screen.id === "lesson") return { hash: `#/learn/bedroom/step-${screen.step + 1}`, title: `WordPix — Bedroom Lesson (${screen.step + 1}/5)` };
  if (screen.id === "lesson-complete") return { hash: "#/learn/bedroom/complete", title: "WordPix — Session Complete 🎉" };
  return { hash: "#/home", title: "WordPix" };
}

export function hashToScreen(hash: string): { screen: Screen; title: string } | null {
  const match = ROUTES[hash.toLowerCase()];
  if (match) {
    return { screen: match.getScreen(), title: match.title };
  }
  return null;
}

export function useHashRouter(
  currentScreen: Screen,
  onScreenChange: (screen: Screen) => void
) {
  // Sync URL hash and document.title when currentScreen changes
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

    // Accessibility focus management: shift focus to main-content container on navigation
    const mainEl = document.getElementById("main-content");
    if (mainEl) {
      mainEl.focus({ preventScroll: true });
    }
  }, [currentScreen]);

  // Handle browser Back / Forward (popstate & hashchange)
  const handleHashChange = useCallback(() => {
    const currentHash = window.location.hash;
    const resolved = hashToScreen(currentHash);
    if (resolved) {
      document.title = resolved.title;
      onScreenChange(resolved.screen);
    }
  }, [onScreenChange]);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [handleHashChange]);
}

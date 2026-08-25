import { useEffect, useReducer, type ReactNode } from "react";
import type { Screen } from "../types";
import { DEFAULT_UNIT_ID, resolveUnitForLesson } from "../data/lessons";
import { isUnitLoaded, loadUnitVocabulary } from "../data/vocabulary";

/**
 * Holds a unit's screens back until that unit's words have arrived.
 *
 * Vocabulary is no longer in the main bundle — each unit is its own chunk, so
 * a learner opening The Bathroom downloads bathroom's sixty words rather than
 * all 10,848. The cost of that is a moment where a unit's words are genuinely
 * not in memory yet, and something has to own it.
 *
 * Owning it here, at the routing boundary, is what lets everything downstream
 * stay synchronous. `getWords` is called from the reducer and from inside the
 * drill loop; making those await would spread async through the most
 * timing-sensitive part of the app for a fetch that has already finished in
 * all but the first frame of a unit. So the rule is: load at the boundary,
 * read synchronously inside it.
 *
 * Screens that are not unit-scoped — onboarding, Home, Explore, Profile —
 * render immediately. Explore in particular must not wait: it lists all 182
 * units, and it reads them from the catalogue's word *ids*, precisely so that
 * browsing never pulls a single unit chunk.
 */

/** The unit a screen belongs to, or null if the screen is not unit-scoped. */
export function unitIdForScreen(screen: Screen): string | null {
  if ("unitId" in screen && screen.unitId) return screen.unitId;
  if ("lessonId" in screen && screen.lessonId) return resolveUnitForLesson(screen.lessonId).id;

  // A lesson or exercise screen that carries neither id is mid-flow in the
  // default unit; anything else genuinely needs no vocabulary.
  const unitScoped =
    screen.id === "lesson" ||
    screen.id === "lesson-entry" ||
    screen.id === "lesson-complete" ||
    screen.id === "learn-words" ||
    screen.id === "learning-materials";
  return unitScoped ? DEFAULT_UNIT_ID : null;
}

interface Props {
  screen: Screen;
  fallback: ReactNode;
  /**
   * Rendered only once the unit is ready — a function, not an element.
   *
   * The screens below call `getWords` while they build, so evaluating them
   * before the words are in memory would hand them an empty list and route the
   * learner to Explore instead of the drill they asked for. Deferring the call
   * is the difference between gating the render and merely gating the output.
   */
  children: () => ReactNode;
}

export function UnitVocabularyGate({ screen, fallback, children }: Props) {
  const unitId = unitIdForScreen(screen);
  const [, onLoaded] = useReducer((n: number) => n + 1, 0);

  // Read from the cache during render rather than mirrored into state. A unit
  // already in memory is ready on the first frame, so revisiting one never
  // flashes a spinner — and there is no second copy of this fact to fall out
  // of step with the cache.
  const ready = unitId === null || isUnitLoaded(unitId);

  useEffect(() => {
    if (ready || unitId === null) return undefined;
    let cancelled = false;
    void loadUnitVocabulary(unitId).then(() => {
      // Navigating away mid-fetch must not re-render a screen that has already
      // moved on; the words stay cached either way, so the next visit is
      // instant regardless.
      if (!cancelled) onLoaded();
    });
    return () => {
      cancelled = true;
    };
  }, [ready, unitId]);

  return ready ? <>{children()}</> : <>{fallback}</>;
}

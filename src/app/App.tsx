import { useEffect, useReducer, useCallback } from "react";
import type { Screen } from "./types";
import type { RouteIntent } from "./router/useHashRouter";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { LearnerProvider } from "./context/LearnerContext";
import { I18nProvider, useI18n } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import { useHashRouter, hashToScreen } from "./router/useHashRouter";

import { registerServiceWorker } from "../pwa";

import { useApplyAccessibilityPreferences } from "./shared/useAccessibilityPreferences";

import { reducer, ariaLiveAnnounce, describeScreen, STORAGE_KEY } from "./store/reducer";
import { RouterView } from "./router/RouterView";
import { UpdatePrompt } from "./shared/UpdatePrompt";

function AppInner() {
  const { t } = useI18n();
  const [state, dispatch] = useReducer(
    reducer,
    { id: "onboarding", step: "splash" },
    (fallback): Screen => {
      if (typeof window !== "undefined" && window.location.hash) {
        const routeMatch = hashToScreen(window.location.hash);
        if (routeMatch) return routeMatch.screen;
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return fallback;
        const parsed = JSON.parse(saved) as Screen;
        if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return fallback;
        return parsed;
      } catch {
        return fallback;
      }
    }
  );

  const handleRoute = useCallback((intent: RouteIntent) => {
    if (intent.kind === "lesson-step") {
      dispatch({ type: "LESSON_GOTO_STEP", step: intent.step });
      return;
    }
    if (intent.kind === "lesson-complete") {
      dispatch({ type: "GO", to: "lesson-complete" });
      return;
    }

    const { screen } = intent;
    if (screen.id === "onboarding") {
      dispatch({ type: "GO", to: "onboarding" });
      return;
    }
    if (screen.id === "skill-exercise") {
      dispatch({ type: "OPEN_SKILL_EXERCISE", exerciseId: screen.exerciseId });
      return;
    }
    if (screen.id === "lesson") return; // Not reachable from a URL alone.
    if (screen.id === "learn-words") {
      dispatch({ type: "GO_LEARN_WORDS", lessonId: screen.lessonId });
      return;
    }
    dispatch({ type: "GO", to: screen.id });
  }, []);

  useHashRouter(state, handleRoute);

  useEffect(() => {
    registerServiceWorker();
  }, []);



  useApplyAccessibilityPreferences();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not persist navigation state.", error);
    }
  }, [state]);

  useEffect(() => {
    ariaLiveAnnounce(describeScreen(state, t));
  }, [state, t]);

  return (
    <ErrorBoundary>
      <UpdatePrompt />
      <div id="a11y-live-region" className="sr-only" aria-live="polite" aria-atomic="true" />
      <RouterView state={state} dispatch={dispatch} />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LearnerProvider>
        <I18nProvider>
          <AppInner />
        </I18nProvider>
      </LearnerProvider>
    </AuthProvider>
  );
}

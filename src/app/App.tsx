import { useEffect, useReducer, useCallback } from "react";
import type { Screen } from "./types";
import type { RouteIntent } from "./router/useHashRouter";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { LearnerProvider, useLearner } from "./context/LearnerContext";
import { I18nProvider, useI18n } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import { useHashRouter, hashToScreen } from "./router/useHashRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { registerServiceWorker } from "../pwa";

import { useApplyAccessibilityPreferences } from "./shared/useAccessibilityPreferences";

import { reducer, ariaLiveAnnounce, describeScreen, STORAGE_KEY } from "./store/reducer";
import { RouterView } from "./router/RouterView";
import { UpdatePrompt } from "./shared/UpdatePrompt";
import { MotionConfig } from "framer-motion";

function AppInner() {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const reduceMotion = learnerState.accessibility.reduceMotion;

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
    // The two unit-scoped destinations carry which unit they mean, and this
    // used to drop it on the floor: `GO` accepts `unitId`, the route resolves
    // it, and nothing passed it along. Every shared or bookmarked link to a
    // unit — #/learn/bathroom, #/learn/bakery/study — therefore opened The
    // Bedroom, because the reducer fell back to DEFAULT_UNIT_ID.
    if (screen.id === "lesson-entry" || screen.id === "learning-materials") {
      dispatch({ type: "GO", to: screen.id, unitId: screen.unitId });
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
      <MotionConfig
        reducedMotion={reduceMotion ? "always" : "user"}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        <UpdatePrompt />
        {/*
          `role="status"` rather than a bare div.
          The element is visually hidden but is still page content, so axe's
          `region` rule counted it as sitting outside every landmark. A status
          region is a landmark in its own right, which is also a more honest
          description of what this is than "div with aria-live".
        */}
        <div
          id="a11y-live-region"
          role="status"
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        />
        <RouterView state={state} dispatch={dispatch} />
      </MotionConfig>
    </ErrorBoundary>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LearnerProvider>
          <I18nProvider>
            <AppInner />
          </I18nProvider>
        </LearnerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

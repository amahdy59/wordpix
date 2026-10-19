export type LearningEvent =
  | {
      name: "placement_completed";
      properties: {
        recommendedLevel: string;
        scoreBand: "emerging" | "developing" | "ready" | "provisional";
      };
    }
  | {
      name: "recommendation_viewed";
      properties: { recommendedLevel: string; startingUnitId: string };
    }
  | {
      name: "lesson_started" | "lesson_completed" | "lesson_resumed" | "lesson_abandoned";
      properties: { mode: string; stage: number; durationBucket?: "short" | "medium" | "long" };
    }
  | { name: "delayed_recall"; properties: { correct: number; total: number } }
  | { name: "media_failed"; properties: { category: "audio" | "image" } }
  | { name: "route_timing" | "search_timing"; properties: { milliseconds: number } }
  | {
      name: "web_vital";
      properties: {
        metric: "LCP" | "INP" | "CLS";
        value: number;
        rating: "good" | "needs-improvement" | "poor";
        device: "mobile" | "desktop";
      };
    };

export interface LearningAnalyticsEnvelope {
  version: 1;
  occurredAt: string;
  event: LearningEvent;
}

export const LEARNING_ANALYTICS_EVENT = "wordpix:learning-analytics";

/** Emits no network or storage traffic; a future consent-aware adapter may subscribe. */
export function emitLearningEvent(event: LearningEvent, now = new Date()): void {
  if (typeof window === "undefined") return;
  const envelope: LearningAnalyticsEnvelope = {
    version: 1,
    occurredAt: now.toISOString(),
    event,
  };
  window.dispatchEvent(new CustomEvent(LEARNING_ANALYTICS_EVENT, { detail: envelope }));
}

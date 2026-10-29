export type LearningEvent =
  | {
      name: "placement_completed";
      properties: { recommendedLevel: string; scoreBand: "emerging" | "developing" | "ready" };
    }
  | {
      name: "recommendation_viewed";
      properties: { recommendedLevel: string; startingUnitId: string };
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

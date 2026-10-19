import { z } from "zod";
import { readDevicePreference } from "../shared/devicePreferences";
import { LEARNING_ANALYTICS_EVENT, type LearningAnalyticsEnvelope } from "./learningAnalytics";

const key = "wordpix:local-diagnostics";
const name = z.enum([
  "placement_completed",
  "recommendation_viewed",
  "lesson_started",
  "lesson_completed",
  "lesson_resumed",
  "lesson_abandoned",
  "delayed_recall",
  "media_failed",
  "route_timing",
  "search_timing",
  "web_vital",
]);
// Allowlist excludes free text, identifiers, content and URLs.
const properties = z.object({
  recommendedLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  scoreBand: z.enum(["emerging", "developing", "ready", "provisional"]).optional(),
  mode: z
    .enum([
      "NEW_LESSON",
      "SMART_REVIEW",
      "SKILL_PRACTICE",
      "UNIT_ASSESSMENT",
      "PRE_LESSON_ASSESSMENT",
    ])
    .optional(),
  stage: z.number().int().min(0).max(30).optional(),
  durationBucket: z.enum(["short", "medium", "long"]).optional(),
  correct: z.number().int().nonnegative().optional(),
  total: z.number().int().nonnegative().optional(),
  category: z.enum(["audio", "image"]).optional(),
  milliseconds: z.number().finite().nonnegative().optional(),
  metric: z.enum(["LCP", "INP", "CLS"]).optional(),
  value: z.number().finite().nonnegative().optional(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  device: z.enum(["mobile", "desktop"]).optional(),
});
const entry = z.object({
  version: z.literal(1),
  occurredAt: z.string().datetime(),
  event: z.object({ name, properties }),
});
const logSchema = z.array(entry).max(200);
let installed = false;
let vitalsStarted = false;
export function readDiagnostics() {
  try {
    const parsed = logSchema.safeParse(JSON.parse(localStorage.getItem(key) ?? "[]"));
    if (!parsed.success) return [];
    const current = parsed.data.filter(
      (item) => Date.now() - Date.parse(item.occurredAt) < 7 * 86400000
    );
    if (current.length !== parsed.data.length) localStorage.setItem(key, JSON.stringify(current));
    return current;
  } catch {
    return [];
  }
}
export function clearDiagnostics() {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage can be unavailable */
  }
}
export function recordDiagnostic(value: unknown) {
  if (!readDevicePreference("diagnostics-consent")) return;
  const parsed = entry.safeParse(value);
  if (!parsed.success) return;
  try {
    localStorage.setItem(
      key,
      JSON.stringify(
        [
          ...readDiagnostics().filter(
            (item) => Date.now() - Date.parse(item.occurredAt) < 7 * 86400000
          ),
          parsed.data,
        ].slice(-200)
      )
    );
  } catch {
    /* diagnostics never blocks a lesson */
  }
}
export function installDiagnostics() {
  if (installed) return;
  installed = true;
  window.addEventListener(LEARNING_ANALYTICS_EVENT, ((
    event: CustomEvent<LearningAnalyticsEnvelope>
  ) => recordDiagnostic(event.detail)) as EventListener);
  const refresh = () => {
    if (!readDevicePreference("diagnostics-consent")) {
      clearDiagnostics();
      return;
    }
    if (vitalsStarted) return;
    vitalsStarted = true;
    void import("web-vitals")
      .then(({ onLCP, onINP, onCLS }) => {
        const report = (metric: { name: string; value: number; rating: string }) =>
          recordDiagnostic({
            version: 1,
            occurredAt: new Date().toISOString(),
            event: {
              name: "web_vital",
              properties: {
                metric: metric.name,
                value: metric.value,
                rating: metric.rating,
                device: matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
              },
            },
          });
        onLCP(report);
        onINP(report);
        onCLS(report);
      })
      .catch(() => {
        vitalsStarted = false;
      });
  };
  window.addEventListener("wordpix:device-preference", refresh);
  window.addEventListener("storage", refresh);
  refresh();
}

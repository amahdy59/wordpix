---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# Analytics, Observability, and Error Handling

## Principle

Measure enough to improve learning and reliability without turning learner activity into surveillance.

Analytics explains product behavior. Observability explains system behavior. They may share infrastructure, but they have different purposes and privacy rules.

## Analytics event design

Use a governed event schema:

```ts
type AnalyticsEvent = {
  name: string;
  version: number;
  occurredAt: string;
  sessionId?: string;
  anonymousLearnerId?: string;
  properties: Record<string, string | number | boolean | null>;
};
```

Event names should be stable and action-oriented:

```text
onboarding_started
placement_completed
recommendation_viewed
lesson_started
answer_submitted
hint_used
lesson_completed
practice_completed
guest_migration_started
guest_migration_completed
sync_failed
```

Do not include changing UI wording in event names.

## Privacy rules

Do not send:

- names;
- emails;
- raw learner answers;
- free text;
- access tokens;
- full URLs containing identifiers;
- exact child age or birth date unless an approved business and legal requirement exists;
- lesson content that could reveal sensitive information.

Use pseudonymous IDs. Separate analytics consent from essential persistence. Support deletion or identity reset according to policy.

## Event properties

Good properties:

- learner mode;
- locale;
- theme;
- lesson or skill ID;
- content version;
- attempt number;
- outcome category;
- duration bucket;
- offline status;
- error category;
- app version.

Avoid high-cardinality or personal values.

## Learning metrics

Prefer metrics that connect to learning quality:

- lesson start-to-completion rate;
- hint use;
- retry and recovery rate;
- review-due completion;
- mastery change;
- time to first value;
- offline completion success;
- guest migration success;
- abandonment by step;
- accessibility-setting usage in aggregate.

Do not optimize solely for streak length, session count, or time spent.

## Observability signals

Instrument:

- Traces: request and sync paths.
- Metrics: latency, error rate, queue depth, migration success, storage failures.
- Logs: structured events for diagnosis.
- Frontend errors: route, app version, safe context, correlation ID.
- Performance: Core Web Vitals and product-specific timings.

Use a vendor-neutral instrumentation layer where practical.

## Correlation

- Propagate a request or trace identifier across client, API, and background work.
- Return safe error IDs to the UI.
- Include trace and span identifiers in structured logs.
- Do not expose sensitive internal detail to the learner.
- Ensure identifiers do not become cross-product tracking IDs.

## Error taxonomy

Classify errors:

```text
validation
authentication
authorization
not_found
conflict
rate_limited
network_offline
network_timeout
server_transient
server_permanent
storage_quota
local_corruption
sync_conflict
content_version
unsupported_browser
unknown
```

Every category should define:

- retryable?
- user message;
- recovery action;
- log severity;
- alert threshold;
- whether local work remains safe.

## User-facing error behavior

A useful error tells the learner:

1. what could not be completed;
2. whether their work is safe;
3. what they can do next;
4. whether retry is automatic.

Examples:

- “You are offline. This lesson is saved on this device and will sync when you reconnect.”
- “We could not open this lesson version. Choose another lesson or try again after updating.”
- “Your session expired. Sign in again to sync the two completed activities stored on this device.”

Avoid stack traces, codes without explanation, and blame.

## Logging

Use structured logs with:

- timestamp;
- severity;
- event name;
- service/module;
- app version;
- environment;
- trace ID;
- error category;
- safe entity type and pseudonymous ID.

Redact at source, not only at the dashboard.

## Alerts

Alert only on actionable conditions:

- elevated authentication failure;
- cross-user authorization anomaly;
- sync failure threshold;
- migration failure;
- data corruption;
- storage quota spike;
- critical route error;
- Core Web Vitals regression;
- unusual queue age.

Every alert needs an owner, runbook, severity, and recovery procedure.

## Dashboards

Minimum operational dashboard:

- active app version;
- error rate by route/version;
- sync queue depth and oldest pending item;
- migration success/failure;
- API latency;
- database/RLS failures;
- offline completion and recovery;
- Core Web Vitals;
- client storage failures.

Minimum product-quality dashboard:

- onboarding funnel;
- first lesson completion;
- hint/retry recovery;
- review completion;
- mastery movement;
- accessibility setting adoption;
- language and learner-mode breakdown without exposing identity.

## Validation checklist

- [ ] Event schema is versioned.
- [ ] No prohibited personal content.
- [ ] Consent behavior is defined.
- [ ] Events validate in development.
- [ ] Duplicate events are controlled.
- [ ] Offline event policy is explicit.
- [ ] Error categories map to recovery.
- [ ] Logs are structured and redacted.
- [ ] Trace context propagates.
- [ ] Alerts have owners and runbooks.
- [ ] Analytics failure never blocks learning.
- [ ] Observability SDK failure degrades safely.

## References

- [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [Google Analytics developer privacy guidance](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Analytics event validation](https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

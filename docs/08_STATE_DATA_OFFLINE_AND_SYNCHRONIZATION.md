---
status: Production guidance
last_verified: 2026-08-02
project: Accessible bilingual gamified learning application
design_system: Untitled UI v8 adapted through project semantic tokens
---

# State, Data, Offline Behavior, and Synchronization

## Principle

The learner’s completed work must not disappear because of a weak connection, browser restart, account creation, retry, or sync conflict.

Offline and sync behavior must be explicit, testable, and visible.

## State taxonomy

Classify every value:

- Ephemeral UI state.
- URL state.
- Canonical server state.
- Durable local learner state.
- Cached content.
- Pending mutation.
- Authentication/session state.
- Derived state.

Do not use `localStorage` as a general database. It is suitable only for small, non-sensitive preferences or pointers. Use IndexedDB or an established abstraction for structured durable data.

## Local data model

Every locally persisted learner record should include:

```ts
type LocalRecordMeta = {
  localId: string;
  serverId?: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
  syncStatus: "local" | "pending" | "syncing" | "synced" | "failed" | "conflict";
  lastSyncAttemptAt?: string;
  retryCount: number;
};
```

Use stable client-generated IDs so a retry does not create duplicate progress.

## Storage responsibilities

| Storage | Use |
|---|---|
| Cache Storage | Versioned app shell and HTTP resources |
| IndexedDB | Structured lessons, attempts, progress, queues |
| Memory | Temporary UI state |
| Secure server session/cookie | Auth session where architecture supports it |
| Server database | Canonical account data |
| URL | Shareable navigation state |

Do not store secrets or privileged tokens in IndexedDB or `localStorage`.

## Offline capability table

For each feature, classify:

- Fully available offline.
- Read-only offline.
- Queueable offline.
- Online required.
- Unsupported offline.

Example:

| Feature | Offline behavior |
|---|---|
| Previously downloaded lesson | Fully available |
| Complete an attempt | Save locally and queue |
| View cached progress | Available with “last synced” label |
| Change email/password | Online required |
| Account merge | Online required with local backup |
| Analytics | Queue only non-sensitive events or discard by policy |

## Mutation queue

Each queued operation should include:

- unique operation ID;
- entity ID;
- operation type;
- payload schema version;
- client timestamp;
- dependency or ordering key;
- retry count;
- last error category;
- idempotency key.

Rules:

- Preserve order where operations depend on prior operations.
- Retry transient failures with bounded exponential backoff and jitter.
- Do not automatically retry permanent validation or authorization failures.
- Make operations idempotent at the server.
- Pause when authentication is invalid.
- Surface unresolved failures without deleting the local result.

## Sync state machine

```text
idle
→ pending
→ syncing
→ synced
   ↘ transientFailure → pending
   ↘ authRequired
   ↘ permanentFailure
   ↘ conflict
```

Every transition must be testable. Avoid loosely coordinated booleans.

## Conflict policy

Define conflict behavior per entity.

Suitable patterns:

- **Append-only attempts:** merge by unique attempt ID.
- **Completion events:** idempotent insert.
- **Preferences:** latest explicit user action, with server timestamp and device metadata.
- **Mastery calculation:** recompute server-side from attempts when possible.
- **Editable profile fields:** detect version mismatch and ask for resolution when meaningful.

Never use “last write wins” as a universal default.

## Guest-to-account migration

Migration must be transactional or recoverable.

Required sequence:

1. Create or authenticate account.
2. Preserve a local backup.
3. Assign a migration ID.
4. Upload records idempotently.
5. Verify server acknowledgement.
6. Reconcile server and local state.
7. Mark migration complete.
8. Retain a short-lived recovery record.
9. Remove redundant local data only after verified success and policy approval.

The UI must distinguish:

- account created;
- migration in progress;
- migration partially failed;
- migration complete.

Do not tell the user progress is safe until it is actually persisted locally or acknowledged by the server.

## Service worker policy

- Treat the service worker as an enhancement, not a prerequisite for first load.
- Version caches.
- Avoid caching authenticated API responses without a reviewed policy.
- Provide an update strategy that does not strand users on mixed app versions.
- Keep persistent data in IndexedDB, not service-worker memory.
- Test upgrade, activation, offline navigation, and stale-cache behavior.
- Provide a safe reload/update prompt when a new incompatible version is ready.

## Data migrations

- Version local schemas.
- Make migrations resumable and idempotent.
- Back up or copy critical data before destructive transforms.
- Test migration from every supported prior version.
- Handle interrupted migration.
- Do not silently reset storage on migration failure.
- Record a safe error code without storing learner content in logs.

## User communication

Show:

- offline status;
- last successful sync;
- pending item count when useful;
- whether work is safely stored locally;
- clear recovery action;
- account or authentication requirement.

Avoid constant alarm banners when the app is functioning offline normally.

## Test matrix

- [ ] First load offline.
- [ ] Return offline with cached app.
- [ ] Complete lesson offline.
- [ ] Close and reopen before sync.
- [ ] Network drops during submission.
- [ ] Duplicate retry.
- [ ] Token expires during sync.
- [ ] Server validation failure.
- [ ] Server conflict.
- [ ] Two devices edit preferences.
- [ ] Guest migration interrupted.
- [ ] New app version with pending queue.
- [ ] Storage quota failure.
- [ ] IndexedDB unavailable or cleared.
- [ ] Arabic and screen-reader sync messages.

## References

- [web.dev: Service workers](https://web.dev/learn/pwa/service-workers)
- [web.dev: Offline data](https://web.dev/learn/pwa/offline-data)
- [web.dev: PWA checklist](https://web.dev/articles/pwa-checklist)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [MDN: Offline and background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)

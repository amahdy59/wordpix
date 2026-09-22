---
description: Offline/sync task per docs/14 Template F (IndexedDB, queue, conflicts)
---

Do this offline/sync task: $ARGUMENTS.

Follow docs/14_CODING_AGENT_TASK_TEMPLATES.md Template F plus the offline-sync skill and poka-yoke skill. Specify entity, canonical owner, storage, idempotency key, queue ordering, retryable vs permanent errors, conflict policy, guest/account behavior, schema version + migration, user-visible status, and data-loss prevention. Extend the existing sync state machine — never rewrite it. Cover with fake-indexeddb tests.

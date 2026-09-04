# Account sync implementation and remaining verification

Status: local implementation; database migration not applied or executed against Postgres.

Apply `supabase/migrations/02_guest_migration.sql` after `01_schema.sql` in a disposable Supabase test project before testing sign-in. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY locally. Never put a service-role key in Vite configuration. Both values are currently absent locally.

The client now uses the canonical IndexedDB learner key, freezes guest data with a persistent migration receipt, and calls an atomic authenticated RPC. Failed requests preserve the snapshot for retry. Successful migration includes remote word memory and session history, and preserves progress earned while the request was pending. The SQL locks the account profile, deduplicates overlapping retained session history, and returns the stored result on a repeated receipt. Local completion deletes only operations included in the frozen snapshot.

Queue processing uses separate IDB transactions around network waits, serializes requests within one tab, retries interrupted syncing entries, and stops at the first failure. Session inserts ignore duplicate keys under the existing append-only RLS policies. Sign-in failures during migration remain visible and can be retried without resubmitting credentials.

## Remaining account-sync gaps

- Real Supabase authentication, RLS isolation, SQL execution, and cross-device behavior remain unverified. No test project/account is configured.
- Regular sync still sends absolute client snapshots. Concurrent multi-device writes need a server-authoritative merge or event protocol, including an atomic reset. Subsequent sign-ins on an already-bound device do not refresh remote state.
- The local learner store remains one profile per browser. Switching to a different account is blocked for sync to avoid copying another account's progress. Separate account storage and an explicit account-switch flow remain necessary.
- Queue serialization covers one tab; cross-tab coordination is not yet implemented.
- Migration receipts prevent duplicate replay while local metadata is retained. Clearing browser storage and re-importing old data with a new receipt needs stronger provenance. Local session history retains only 50 sessions, so older overlaps cannot be fully deduplicated from history alone.

## Test-project checks

1. Apply both migrations; sign in with guest XP, word memory, preferences, and sessions. Confirm the merged state survives reload.
2. Interrupt the migration response after server commit; retry and confirm XP/session totals do not change twice.
3. Complete a lesson while migration is pending, and separately reset progress while pending; confirm no local updates are lost or restored after reset.
4. Sign in as a different test account; confirm its data cannot read or receive the first account's progress, including direct RPC/RLS requests.
5. Exercise offline uploads, duplicate sessions, and concurrent devices. Treat cross-device convergence as an open release gate.

import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

// Optional verification runtime installed outside the app, never a shipped dependency.
if (!process.argv[2])
  throw new Error("Pass the absolute path to an installed @electric-sql/pglite/dist/index.js");
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = await PGlite.create();
const alice = "00000000-0000-4000-8000-000000000001";
const bob = "00000000-0000-4000-8000-000000000002";
await db.exec(`create schema auth;create table auth.users(id uuid primary key);
  create role anon;create role authenticated;create role service_role;
  grant usage on schema auth,public to anon,authenticated,service_role;
  create function auth.uid() returns uuid language sql stable as $body$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$body$;`);
for (const file of [
  "01_schema.sql",
  "02_guest_migration.sql",
  "03_rls_hardening.sql",
  "04_pronunciation_assessment_quota.sql",
  "05_specialist_progress.sql",
]) {
  // UUID generation is not used by these tests; PGlite does not bundle uuid-ossp by default.
  const source = (await fs.readFile(`supabase/migrations/${file}`, "utf8")).replace(
    /CREATE EXTENSION IF NOT EXISTS "uuid-ossp";/i,
    ""
  );
  await db.exec(source);
}
await db.exec(`grant select,insert,update,delete on public.profiles,public.word_memory,public.session_history to authenticated;
  insert into auth.users values('${alice}'),('${bob}');set role authenticated;`);
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [alice]);
const save = (op, user, state) =>
  db.query(
    "select public.save_specialist_progress($1,$2,'conversation','unit-01',$3::jsonb) as state",
    [op, user, JSON.stringify(state)]
  );
const old = {
  status: "mastered",
  currentStage: 6,
  completedStages: ["reading"],
  quizBestScore: 8,
  notes: "First device",
  updatedAt: "2026-10-22T10:00:00Z",
};
const next = {
  status: "in-progress",
  currentStage: 1,
  completedStages: ["warmup"],
  quizBestScore: 5,
  notes: "Second device",
  updatedAt: "2026-10-23T10:00:00Z",
};
await save("device-a:1", alice, old);
await save("device-b:1", alice, next);
let merged = (await db.query("select public.get_specialist_progress($1) as snapshot", [alice]))
  .rows[0].snapshot;
assert.equal(merged.conversationProgress["unit-01"].quizBestScore, 8);
assert.deepEqual(merged.conversationProgress["unit-01"].completedStages, ["reading", "warmup"]);
assert.equal(merged.conversationProgress["unit-01"].notes, "Second device");
assert.equal(merged.conversationProgress["unit-01"].status, "in-progress");
await save("device-a:1", alice, old);
assert.equal(
  (await db.query("select count(*)::int as count from public.specialist_progress_versions")).rows[0]
    .count,
  2
);
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [bob]);
assert.equal(
  (await db.query("select count(*)::int as count from public.specialist_progress")).rows[0].count,
  0
);
await assert.rejects(
  () => db.query("select public.get_specialist_progress($1)", [alice]),
  /Authentication required/
);
await assert.rejects(() => save("forged", alice, next), /Authentication required/);
await assert.rejects(
  () =>
    db.query(
      "insert into public.specialist_progress(user_id,track,lesson_id,state) values($1,'conversation','unit-02',$2::jsonb)",
      [alice, JSON.stringify(next)]
    ),
  /row-level security/
);
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [alice]);
const guest = {
  preferences: {
    englishLevel: "A1",
    startingUnitId: "numbers-counting",
    dailyGoalMinutes: 10,
    goal: "everyday",
    theme: "light",
    expression: "adult",
  },
  accessibility: {},
  wordMemory: {},
  sessionHistory: [],
  learnerProgress: { xp: 0, streak: 0, daysActive: 0, sessionsCompleted: 0, lastStudiedDate: null },
  pronunciationProgress: {},
  hadithProgress: {},
  businessProgress: {},
  conversationProgress: { "unit-01": { ...old, completedStages: ["toolkit"] } },
};
const migrationId = "00000000-0000-4000-8000-000000000003";
const migrate = () =>
  db.query("select public.merge_guest_progress($1,$2,$3::jsonb) as snapshot", [
    migrationId,
    alice,
    JSON.stringify(guest),
  ]);
const first = (await migrate()).rows[0].snapshot;
const second = (await migrate()).rows[0].snapshot;
assert.deepEqual(first, second);
assert.deepEqual(first.conversationProgress["unit-01"].completedStages, [
  "reading",
  "toolkit",
  "warmup",
]);
assert.equal(first.conversationProgress["unit-01"].notes, "Second device");
console.log(
  "PASS: migrations 01–05, exact RPC execution, retry receipts, cross-device evidence merge, reflection version retention, guest migration replay, and two-user RLS isolation."
);
const pronunciation = {
  status: "mastered",
  currentStage: 4,
  bestScorePercent: 90,
  sessions: 2,
  updatedAt: "2026-10-22T12:00:00Z",
};
const complete = (op, state, base) =>
  db.query(
    "select public.save_specialist_progress($1,$2,'pronunciation','lesson-03',$3::jsonb,$4)",
    [op, alice, JSON.stringify(state), base]
  );
await complete("pron:baseline", pronunciation, 0);
const completion = { ...pronunciation, sessions: 3, updatedAt: "2026-10-23T12:00:00Z" };
await complete("pron:device-a", completion, 2);
await complete("pron:device-b", completion, 2);
await complete("pron:device-a", completion, 2);
const restored = (await db.query("select public.get_specialist_progress($1) as snapshot", [alice]))
  .rows[0].snapshot;
assert.equal(restored.pronunciationProgress["lesson-03"].sessions, 4);
console.log(
  "PASS: concurrent specialist completion deltas and duplicate receipts preserve the exact session count."
);
await db.close();

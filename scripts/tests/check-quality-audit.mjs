import test from "node:test";
import assert from "node:assert/strict";
import { isUndersizedTarget, summarizeMeasurements } from "../lib/quality_audit.mjs";

test("a single short dimension fails without rounding a 43.9px target up", () => {
  for (const rect of [
    { width: 80, height: 40 },
    { width: 40, height: 80 },
    { width: 43.9, height: 44 },
  ])
    assert.equal(isUndersizedTarget(rect), true);
  assert.equal(isUndersizedTarget({ width: 44, height: 44 }), false);
});
test("performance summaries reflect each raw group and reject fake zero fallbacks", () => {
  const rows = [1153, 930, 1377].map((readyMs) => ({
    targetId: "audio",
    profile: "mobile",
    visit: "cold",
    readyMs,
  }));
  assert.deepEqual(summarizeMeasurements(rows)[0], {
    targetId: "audio",
    profile: "mobile",
    visit: "cold",
    count: 3,
    median: 1153,
    min: 930,
    max: 1377,
  });
  assert.throws(() => summarizeMeasurements([{ ...rows[0], readyMs: 0 }]), /positive/);
});

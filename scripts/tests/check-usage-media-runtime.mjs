import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { compileUsageMedia } from "../lib/usage_media_runtime.mjs";

test("unit scoping retains later-manifest precedence, complete fields and empty units", () => {
  const first = { imagePath: "original.webp" };
  const last = {
    imagePath: "reviewed.webp",
    imageAlt: "Original description",
    imageFallbacks: [{ imagePath: "fallback.webp", imageAlt: "Fallback description" }],
  };
  const result = compileUsageMedia(
    [
      { "unit-a-1-usage-scene-1": first, "unit-b-2-usage-scene-4": first },
      { "unit-a-1-usage-scene-1": last },
    ],
    ["unit-a", "unit-b", "empty"]
  );
  assert.deepEqual(result, {
    "unit-a": { "unit-a-1-usage-scene-1": last },
    "unit-b": { "unit-b-2-usage-scene-4": first },
    empty: {},
  });
  assert.throws(() => compileUsageMedia([{ invalid: first }], ["unit-a"]), /ownership/);
  assert.throws(
    () => compileUsageMedia([{ "unknown-1-usage-scene-1": first }], ["unit-a"]),
    /ownership/
  );
});

test("every generated entry equals the legacy merged source, without unrelated unit entries", () => {
  const read = (name) => JSON.parse(fs.readFileSync(`src/app/generated/${name}.json`, "utf8"));
  const manifests = [
    read("reviewedUsageIllustrations"),
    read("reviewedFigmaQuestionMedia").scenes,
    read("reviewedFigmaObjectScenes"),
    read("reviewedGeneratedSceneMedia"),
  ];
  const figma = read("reviewedFigmaQuestionMedia");
  assert.deepEqual(read("pilotMediaReviews"), {
    sentences: figma.sentences,
    readings: figma.readings,
  });
  const unitIds = fs
    .readdirSync("src/app/data/usage")
    .filter((name) => name.endsWith(".usage.json"))
    .map((name) => name.slice(0, -11))
    .sort();
  const tables = compileUsageMedia(manifests, unitIds);
  const restored = {};
  for (const [unitId, expected] of Object.entries(tables)) {
    const actual = read(`usageMediaUnits/${unitId}`);
    assert.deepEqual(actual, expected, unitId);
    assert.ok(Buffer.byteLength(JSON.stringify(actual)) < 64 * 1024, unitId);
    Object.assign(restored, actual);
  }
  assert.deepEqual(restored, Object.assign({}, ...manifests));
});

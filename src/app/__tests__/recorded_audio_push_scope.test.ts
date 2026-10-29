import { expect, it } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const require = createRequire(import.meta.url);
const { isDraftPush } = require("../../../scripts/lib/push_scope.cjs");
const sha = "a".repeat(40);
it("blocks production when corrected pronunciation evidence is missing, broken or stale", () => {
  const source = readFileSync(
    require.resolve("../../../scripts/check_recorded_audio_readiness.cjs"),
    "utf8"
  );
  const valid = {
    status: "complete",
    missingRecordings: 0,
    unlinkedNewRecordings: 0,
    brokenAliases: 0,
    brokenPronunciationReferences: 0,
    removedOriginals: 0,
    inputsDigest: sha,
  };
  const check = (report: object) => {
    const process = { argv: [], exitCode: 0 };
    runInNewContext(source, {
      process,
      console: { log() {}, error() {} },
      require: (name: string) =>
        name === "node:fs"
          ? { readFileSync: () => JSON.stringify(report) }
          : { recordingInputsDigest: () => sha },
    });
    return process.exitCode;
  };
  expect(check(valid)).toBe(0);
  expect(check({ ...valid, brokenPronunciationReferences: undefined })).toBe(1);
  expect(check({ ...valid, brokenPronunciationReferences: 1 })).toBe(1);
  expect(check({ ...valid, inputsDigest: "stale" })).toBe(1);
});

it("permits the pending-audio exception only for explicitly identified Codex draft destinations", () => {
  expect(
    isDraftPush(
      `refs/heads/codex/recorded-audio ${sha} refs/heads/codex/recorded-audio ${"0".repeat(40)}`
    )
  ).toBe(true);
  for (const target of [
    "refs/heads/main",
    "refs/heads/master",
    "refs/tags/release",
    "refs/heads/feature/test",
  ])
    expect(isDraftPush(`refs/heads/codex/recorded-audio ${sha} ${target} ${sha}`)).toBe(false);
  expect(isDraftPush("")).toBe(false);
  expect(isDraftPush("malformed input")).toBe(false);
  expect(
    isDraftPush(
      `refs/heads/codex/x ${sha} refs/heads/codex/x ${sha}\nrefs/heads/main ${sha} refs/heads/main ${sha}`
    )
  ).toBe(false);
  expect(isDraftPush(`(delete) ${"0".repeat(40)} refs/heads/codex/x ${sha}`)).toBe(false);
});

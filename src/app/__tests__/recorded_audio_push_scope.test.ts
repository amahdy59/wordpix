import { expect, it } from "vitest";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { isDraftPush } = require("../../../scripts/lib/push_scope.cjs");
const sha = "a".repeat(40);
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

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { AUDIO_PROFILE, profileFingerprint } = require("../../../scripts/lib/assetKey.cjs");

const root = resolve(__dirname, "../../..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");

interface Ledger {
  profile: string;
  clips: Record<string, { tier: string; chars: number; bytes: number | null; reused?: boolean }>;
}

const ledger: Ledger = JSON.parse(read("assets/audio-ledger.json"));

/**
 * The ledger is what makes "synthesise once, never pay for it again" true. It
 * is also the thing most able to fail quietly: nothing in the app reads it, so
 * a corrupted or mismatched ledger surfaces only as an unexpected invoice.
 */
describe("audio ledger", () => {
  it("was built with the voice profile the app asks for", () => {
    // Every key is a hash of the profile plus the text. Change the voice and
    // all 21,858 keys change with it — the old clips become unreachable and
    // the whole corpus is silently re-bought at full price. The generator
    // refuses to run on a mismatch; this catches it a step earlier, in CI.
    expect(ledger.profile).toBe(profileFingerprint(AUDIO_PROFILE));
  });

  it("records a full-length hash for every clip", () => {
    for (const key of Object.keys(ledger.clips)) {
      expect(key, `ledger key ${key} is not a sha-256 hex digest`).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("charges every clip a positive number of characters", () => {
    // A zero would mean a clip was recorded as paid for without being
    // generated, which is exactly the state that makes the generator skip it
    // forever.
    for (const [key, clip] of Object.entries(ledger.clips)) {
      expect(clip.chars, `ledger entry ${key} has no character count`).toBeGreaterThan(0);
    }
  });
});

/**
 * Generation is the one workflow in the repository that spends money. The
 * guardrails on it are worth asserting, because a plausible-looking edit — an
 * added `push:` trigger, a dropped budget — turns every commit into an
 * ElevenLabs invoice, and nothing else in CI would object.
 */
describe("audio generation workflow", () => {
  const workflow = read(".github/workflows/audio.yml");

  it("never runs on push or pull request", () => {
    expect(workflow).not.toMatch(/^\s*push:/m);
    expect(workflow).not.toMatch(/^\s*pull_request:/m);
  });

  it("is manually dispatchable and states a character budget", () => {
    expect(workflow).toMatch(/workflow_dispatch:/);
    expect(workflow).toMatch(/--max-chars=/);
  });

  it("reconciles the ledger against the bucket before spending", () => {
    // Without this, a ledger entry whose object is missing means the clip is
    // skipped for good and the app falls back to synthesis with nothing to
    // say why.
    const reconcileAt = workflow.indexOf("--reconcile");
    const generateAt = workflow.indexOf("--max-chars=");
    expect(reconcileAt).toBeGreaterThan(-1);
    expect(reconcileAt).toBeLessThan(generateAt);
  });

  it("serialises runs so two of them cannot both write the ledger", () => {
    expect(workflow).toMatch(/concurrency:/);
  });
});

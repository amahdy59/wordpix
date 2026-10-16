import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function resolver(mode: string, assetBase: string) {
  vi.resetModules();
  vi.stubEnv("MODE", mode);
  vi.stubEnv("BASE_URL", "/wordpix/");
  vi.stubEnv("VITE_ASSET_BASE_URL", assetBase);
  return (await import("../../utils/assetUrl")).resolveAssetUrl;
}

describe("scenario audio and subtitle asset URL resolution", () => {
  it("resolves master audio paths to Cloudflare R2 CDN in production", async () => {
    const resolve = await resolver(
      "production",
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"
    );
    const masterPath = "assets/audio/scenarios/numbers-counting/numbers-counting-1_full.mp3";
    expect(resolve(masterPath)).toBe(
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/assets/audio/scenarios/numbers-counting/numbers-counting-1_full.mp3"
    );
    expect(resolve(`./${masterPath}`)).toBe(
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/assets/audio/scenarios/numbers-counting/numbers-counting-1_full.mp3"
    );
  });

  it("resolves individual dialogue line clips to Cloudflare R2 CDN in production", async () => {
    const resolve = await resolver(
      "production",
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"
    );
    const clipPath =
      "assets/audio/scenarios/numbers-counting/numbers-counting-1/01_tariq_intro.mp3";
    expect(resolve(clipPath)).toBe(
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/assets/audio/scenarios/numbers-counting/numbers-counting-1/01_tariq_intro.mp3"
    );
  });

  it("resolves WebVTT subtitle track files to Cloudflare R2 CDN in production", async () => {
    const resolve = await resolver(
      "production",
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"
    );
    const vttPath = "assets/audio/scenarios/numbers-counting/numbers-counting-1.vtt";
    expect(resolve(vttPath)).toBe(
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/assets/audio/scenarios/numbers-counting/numbers-counting-1.vtt"
    );
  });

  it("is idempotent when resolving scenario CDN URLs", async () => {
    const resolve = await resolver(
      "production",
      "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"
    );
    const masterPath = "assets/audio/scenarios/numbers-counting/numbers-counting-1_full.mp3";
    const once = resolve(masterPath);
    expect(resolve(once)).toBe(once);
  });

  it("falls back to local base path when VITE_ASSET_BASE_URL is empty", async () => {
    const resolve = await resolver("production", "");
    const masterPath = "assets/audio/scenarios/numbers-counting/numbers-counting-1_full.mp3";
    expect(resolve(masterPath)).toBe(
      "/wordpix/assets/audio/scenarios/numbers-counting/numbers-counting-1_full.mp3"
    );
  });
});

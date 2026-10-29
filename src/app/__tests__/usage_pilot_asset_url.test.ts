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

describe("uploaded usage pilot images", () => {
  it("resolves content-hashed reviewed illustrations without redirecting old media", async () => {
    const resolve = await resolver("production", "https://media.example.com/");
    const key = `usage-illustrations/v1/colors-1-usage-scene-1/${"a".repeat(64)}.webp`;
    expect(resolve(key)).toBe(`https://media.example.com/${key}`);
    expect(resolve(`./${key}`)).toBe(`https://media.example.com/${key}`);
    const photo = `question-images/v1/sentence-four/${"b".repeat(64)}.webp`;
    expect(resolve(photo)).toBe(`https://media.example.com/${photo}`);
    expect(resolve("question-images/v1/sentence-four/unverified.webp")).toBe(
      "/wordpix/question-images/v1/sentence-four/unverified.webp"
    );
    expect(resolve("usage-illustrations/v1/unreviewed/example.webp")).toBe(
      "/wordpix/usage-illustrations/v1/unreviewed/example.webp"
    );
  });
  it("serves all ten verified images from R2 in production", async () => {
    const resolve = await resolver("production", "https://media.example.com/");
    for (const lesson of [1, 2]) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const relative = `learning-scenes/shopping-mall/shopping-mall-${lesson}-scene-${scene}.avif`;
        const url = `https://media.example.com/images/v1/${relative}`;
        expect(resolve(`./${relative}`)).toBe(url);
        expect(resolve(url)).toBe(url);
      }
    }
  });

  it("keeps unuploaded scenes local", async () => {
    const resolve = await resolver("production", "https://media.example.com");
    for (const relative of [
      "learning-scenes/shopping-mall/shopping-mall-3-scene-1.avif",
      "learning-scenes/colors/colors-1-scene-4.avif",
    ]) {
      expect(resolve(`./${relative}`)).toBe(`/wordpix/${relative}`);
    }
  });

  it.each(["test", "production"])(
    "keeps local fallback in %s without an asset base",
    async (mode) => {
      const resolve = await resolver(mode, "");
      expect(resolve("./learning-scenes/shopping-mall/shopping-mall-1-scene-1.avif")).toBe(
        "/wordpix/learning-scenes/shopping-mall/shopping-mall-1-scene-1.avif"
      );
    }
  );
});

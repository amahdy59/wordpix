import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveAssetUrl } from "../../utils/assetUrl";

/**
 * The regression: vocabulary stores image paths rooted at the site root
 * ("/word-images/bathroom/bathtub.webp") while the app is served from
 * `base: "/wordpix/"`. Root-absolute URLs ignore the base, so every word image
 * 404ed in any deployment under that base — the unit page, the lesson drills,
 * and the study materials alike — while the files sat one path segment away.
 */
describe("resolveAssetUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefixes app-relative paths with the configured base", () => {
    vi.stubEnv("BASE_URL", "/wordpix/");
    expect(resolveAssetUrl("/word-images/bathroom/bathtub.webp")).toBe(
      "/wordpix/word-images/bathroom/bathtub.webp"
    );
    expect(resolveAssetUrl("./scene-images/bathroom-hero.webp")).toBe(
      "/wordpix/scene-images/bathroom-hero.webp"
    );
  });

  it("is idempotent, so double-resolving cannot double the base", () => {
    vi.stubEnv("BASE_URL", "/wordpix/");
    const once = resolveAssetUrl("/word-images/bathroom/sink.webp");
    expect(resolveAssetUrl(once)).toBe(once);
  });

  it("leaves paths untouched when the app is served from the root", () => {
    vi.stubEnv("BASE_URL", "/");
    expect(resolveAssetUrl("/word-images/bathroom/sink.webp")).toBe(
      "/word-images/bathroom/sink.webp"
    );
  });

  it("never rewrites absolute or inline URLs", () => {
    vi.stubEnv("BASE_URL", "/wordpix/");
    for (const url of [
      "https://cdn.example.com/a.webp",
      "//cdn.example.com/a.webp",
      "data:image/svg+xml;base64,AAAA",
      "blob:http://localhost/abc",
    ]) {
      expect(resolveAssetUrl(url)).toBe(url);
    }
  });

  it("passes empty input straight through", () => {
    expect(resolveAssetUrl("")).toBe("");
  });
});

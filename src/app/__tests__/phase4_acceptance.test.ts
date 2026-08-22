import { describe, expect, it, afterEach, vi } from "vitest";
import { getOfflineReadiness } from "../../pwa";
import { getWordFallbackDataUrl } from "../shared/WordImage";
import { BEDROOM_VOCABULARY } from "../data/lessons";

/** Minimal CacheStorage stand-in: only the URLs passed in are considered cached. */
function stubCacheStorage(cachedUrls: string[]) {
  const cached = new Set(cachedUrls);
  vi.stubGlobal("caches", {
    open: async () => ({
      match: async (url: string) => (cached.has(url) ? new Response("") : undefined),
    }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Phase 4 Acceptance Criteria Verification", () => {
  it("AC 1: offline readiness reflects what is actually cached, not a hardcoded claim", async () => {
    // Previously this asserted isOfflineAvailable("bedroom") === true, which was
    // a constant. 54 of 57 vocabulary images load from images.unsplash.com, so
    // on a cold cache the badge it drove was simply false.
    stubCacheStorage([]);
    const cold = await getOfflineReadiness("bedroom");
    expect(cold.total).toBe(BEDROOM_VOCABULARY.length);
    expect(cold.cached).toBe(0);
    expect(cold.ready).toBe(false);
  });

  it("AC 1b: reports ready only once every image for the world is cached", async () => {
    stubCacheStorage(BEDROOM_VOCABULARY.map((w) => w.img));
    const warm = await getOfflineReadiness("bedroom");
    expect(warm.cached).toBe(warm.total);
    expect(warm.ready).toBe(true);
  });

  it("AC 1c: reports partial progress rather than rounding up to ready", async () => {
    stubCacheStorage(BEDROOM_VOCABULARY.slice(0, 3).map((w) => w.img));
    const partial = await getOfflineReadiness("bedroom");
    expect(partial.cached).toBe(3);
    expect(partial.ready).toBe(false);
  });

  it("AC 1d: an unshipped world is never claimed as offline-ready", async () => {
    stubCacheStorage([]);
    const bathroom = await getOfflineReadiness("spaceship");
    expect(bathroom.total).toBe(0);
    expect(bathroom.ready).toBe(false);
  });

  it("AC 2: WordImage fallback SVG rendering adapts to assessment mode without leaking text", () => {
    const pillow = BEDROOM_VOCABULARY.find((v) => v.id === "pillow")!;
    const learningSvg = getWordFallbackDataUrl(pillow, "learning");
    const assessmentSvg = getWordFallbackDataUrl(pillow, "assessment");

    expect(learningSvg).toContain(encodeURIComponent("Pillow"));
    expect(assessmentSvg).not.toContain(encodeURIComponent("Pillow"));
    expect(assessmentSvg).toContain(encodeURIComponent("?"));
  });
});

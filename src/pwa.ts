import { BEDROOM_VOCABULARY } from "./app/data/lessons";

const CACHE_NAME = "wordpix-cache-v2";

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.error("PWA ServiceWorker registration failed:", err);
    });
  });
}

export interface OfflineReadiness {
  /** Number of the world's images already in the cache. */
  cached: number;
  total: number;
  /** True only when every asset the world needs is genuinely available offline. */
  ready: boolean;
}

function imageUrlsForWorld(worldId: string): string[] {
  // Only the bedroom world ships today; scoped this way so adding a world does
  // not silently inherit a "ready" claim.
  if (worldId !== "bedroom") return [];
  return BEDROOM_VOCABULARY.map((word) => word.img);
}

/**
 * Reports how much of a world is actually cached.
 *
 * This used to be a synchronous `return worldId === "bedroom"` — it claimed
 * offline availability unconditionally while 54 of the 57 vocabulary images
 * were loaded from images.unsplash.com at runtime. The badge was simply untrue
 * on a cold cache.
 */
export async function getOfflineReadiness(worldId = "bedroom"): Promise<OfflineReadiness> {
  const urls = imageUrlsForWorld(worldId);
  const total = urls.length;

  if (total === 0 || typeof caches === "undefined") {
    return { cached: 0, total, ready: false };
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const matches = await Promise.all(urls.map((url) => cache.match(url, { ignoreVary: true })));
    const cached = matches.filter(Boolean).length;
    return { cached, total, ready: cached === total };
  } catch {
    return { cached: 0, total, ready: false };
  }
}

import { COURSE_UNITS, DEFAULT_UNIT_ID } from "./app/data/lessons";
import { resolveAssetUrl } from "./utils/assetUrl";

const CACHE_NAME = "wordpix-cache-v2";

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", async () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              try {
                const res = await fetch("./release-notes.json?t=" + Date.now());
                const releaseNotes = await res.json();

                const event = new CustomEvent("wp-update-available", {
                  detail: {
                    worker: newWorker,
                    notes: releaseNotes.notes,
                  },
                });
                window.dispatchEvent(event);
              } catch (err) {
                console.error("Failed to fetch release notes:", err);
              }
            }
          });
        });
      })
      .catch((err) => {
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
  // Looks the world up in the registry rather than special-casing a literal
  // id, so an unregistered world correctly reports nothing cacheable instead
  // of silently inheriting bedroom's "ready" claim.
  return COURSE_UNITS[worldId]?.vocabulary.map((word) => resolveAssetUrl(word.img)) ?? [];
}

/**
 * Reports how much of a world is actually cached.
 *
 * This used to be a synchronous `return worldId === "bedroom"` — it claimed
 * offline availability unconditionally while 55 of the 58 vocabulary images
 * were loaded from images.unsplash.com at runtime. The badge was simply untrue
 * on a cold cache. Every vocabulary image is self-hosted now, so a fully warm
 * cache genuinely means offline-ready rather than "ready except for the
 * pictures."
 */
export async function getOfflineReadiness(worldId = DEFAULT_UNIT_ID): Promise<OfflineReadiness> {
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

import { COURSE_UNITS, DEFAULT_UNIT_ID } from "./app/data/courseCatalog";
import { loadUnitVocabulary } from "./app/data/vocabulary";
import { resolveAssetUrl } from "./utils/assetUrl";
import { imagePackCacheName } from "./app/media/offlineImagePacks";

const CACHE_NAME = "wordpix-cache-v2";

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const register = () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        // A disabled worker API can resolve without a registration (including
        // WebKit automation). The application remains usable without PWA hooks.
        if (!registration) return;
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", async () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              let notes: string[] = [];
              try {
                const res = await fetch("./release-notes.json?t=" + Date.now());
                if (!res.ok) throw new Error("Update summary is unavailable");
                const releaseNotes = await res.json();
                if (Array.isArray(releaseNotes.notes)) {
                  notes = releaseNotes.notes.filter(
                    (note: unknown): note is string => typeof note === "string"
                  );
                }
              } catch {
                // Optional metadata can be unavailable during an offline
                // reload. The installed update still has to be offered.
              }
              window.dispatchEvent(
                new CustomEvent("wp-update-available", {
                  detail: { worker: newWorker, notes },
                })
              );
            }
          });
        });
      })
      .catch((err) => {
        console.error("PWA ServiceWorker registration failed:", err);
      });
  };

  // React effects commonly run after the window load event. Waiting for an
  // event that already fired silently disabled offline navigation in a fresh
  // browser context, so register immediately once the document is complete.
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}

export interface OfflineReadiness {
  /** Number of the world's images already in the cache. */
  cached: number;
  total: number;
  /** True only when every asset the world needs is genuinely available offline. */
  ready: boolean;
}

async function imageUrlsForWorld(worldId: string): Promise<string[]> {
  // Looks the world up in the registry rather than special-casing a literal
  // id, so an unregistered world correctly reports nothing cacheable instead
  // of silently inheriting bedroom's "ready" claim.
  if (!COURSE_UNITS[worldId]) return [];
  const words = await loadUnitVocabulary(worldId);
  return words.map((word) => resolveAssetUrl(word.img));
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
  const urls = await imageUrlsForWorld(worldId);
  const total = urls.length;

  if (total === 0 || typeof caches === "undefined") {
    return { cached: 0, total, ready: false };
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const runtime = await caches.open("wordpix-runtime-v1");
    const pack = (await caches.keys()).includes(imagePackCacheName(worldId))
      ? await caches.open(imagePackCacheName(worldId))
      : null;
    const matches = await Promise.all(
      urls.map(
        async (url) =>
          (await pack?.match(url, { ignoreVary: true })) ??
          (await cache.match(url, { ignoreVary: true })) ??
          (await runtime.match(url, { ignoreVary: true }))
      )
    );
    const cached = matches.filter(Boolean).length;
    return { cached, total, ready: cached === total };
  } catch {
    return { cached: 0, total, ready: false };
  }
}

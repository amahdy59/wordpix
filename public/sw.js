// WordPix Offline PWA Service Worker
const CACHE_NAME = "wordpix-cache-v2";

// App shell. Precached individually rather than via cache.addAll(), which is
// atomic: a single 404 rejects the whole install and the worker never
// activates, silently disabling offline support entirely.
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-maskable.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch((err) => {
            console.warn("[sw] skipped precache of", url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

function isCacheableResponse(response) {
  if (!response) return false;
  // Cross-origin images fetched by <img> are no-cors, so they arrive as opaque
  // responses with status 0. Refusing those was why vocabulary imagery never
  // became available offline.
  if (response.type === "opaque") return true;
  return response.status === 200 && response.type !== "error";
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // SPA navigations: serve the cached shell when the network is unavailable so
  // a deep link still opens offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("./index.html").then((cached) => cached || Response.error())
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      // An opaque <audio>/<img> response cannot satisfy a CORS fetch used to
      // persist audio bytes. Respect explicit reloads and fetch a readable copy.
      const cachedResponse =
        request.cache !== "reload" && (request.mode === "no-cors" || cached?.type !== "opaque")
          ? cached
          : undefined;
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (isCacheableResponse(networkResponse)) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch((error) => {
          if (cachedResponse) return cachedResponse;
          throw error;
        });

      // Stale-while-revalidate: cached copy immediately, refresh in background.
      return cachedResponse || networkFetch;
    })
  );
});

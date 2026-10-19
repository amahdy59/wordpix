// WordPix Offline PWA Service Worker
const CACHE_NAME = "wordpix-cache-v2";
const RUNTIME_CACHE = "wordpix-runtime-v1";
const DOWNLOAD_CACHE = "wordpix-downloads-v1";
const RUNTIME_LIMIT = 200;

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
        Promise.all(
          keys
            .filter((key) => key.startsWith("wordpix-runtime-") && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
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
  // Never cache personal API responses. A readable full media response may
  // satisfy a byte-range request offline; partial responses are never cached.
  if (request.headers.has("Authorization")) return;
  if (request.headers.has("Range")) {
    if (!/\.(mp3|wav|ogg|mp4|webm)$/i.test(url.pathname)) return;
    event.respondWith(
      (async () => {
        const cached = await caches.match(request.url);
        const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.get("Range") || "");
        if (!cached || cached.type === "opaque" || cached.status !== 200 || !range)
          return fetch(request).catch(() => Response.error());
        const bytes = await cached.arrayBuffer();
        const start = Number(range[1]);
        const end = Math.min(
          range[2] ? Number(range[2]) : bytes.byteLength - 1,
          bytes.byteLength - 1
        );
        if (start >= bytes.byteLength || end < start)
          return new Response(null, {
            status: 416,
            headers: { "Content-Range": `bytes */${bytes.byteLength}` },
          });
        const headers = new Headers(cached.headers);
        headers.delete("Content-Encoding");
        headers.set("Content-Range", `bytes ${start}-${end}/${bytes.byteLength}`);
        headers.set("Content-Length", String(end - start + 1));
        headers.set("Accept-Ranges", "bytes");
        return new Response(bytes.slice(start, end + 1), { status: 206, headers });
      })()
    );
    return;
  }

  // SPA navigations: serve the cached shell when the network is unavailable so
  // a deep link still opens offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put("./index.html", copy))
                .catch(() => undefined)
            );
          }
          return response;
        })
        .catch(() => caches.match("./index.html").then((cached) => cached || Response.error()))
    );
    return;
  }

  const isApplicationAsset =
    url.origin === self.location.origin &&
    url.pathname.startsWith(new URL("./", self.location).pathname) &&
    /\.(?:js|css|woff2?|json|svg|html)$/.test(url.pathname);
  const isMedia = ["image", "audio", "video"].includes(request.destination);
  if (!isApplicationAsset && !isMedia) return;

  event.respondWith(
    (async () => {
      const downloaded = await (
        await caches.open(DOWNLOAD_CACHE)
      ).match(request, { ignoreVary: true });
      const cached = downloaded || (await caches.match(request));
      // An opaque <audio>/<img> response cannot satisfy a CORS fetch used to
      // persist audio bytes. Respect explicit reloads and fetch a readable copy.
      const offlineCached =
        request.mode === "no-cors" || cached?.type !== "opaque" ? cached : undefined;
      const cachedResponse = request.cache !== "reload" ? offlineCached : undefined;
      // Hashed bundles are immutable; explicit downloads remain pinned offline.
      const immutable = /\/assets\/[^/]+-[\w-]{8,}\.(?:js|css|woff2?)$/.test(url.pathname);
      if (cachedResponse && (immutable || downloaded)) return cachedResponse;
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (isCacheableResponse(networkResponse)) {
            const clone = networkResponse.clone();
            const save = caches.open(immutable ? CACHE_NAME : RUNTIME_CACHE).then(async (cache) => {
              await cache.put(request, clone);
              if (!immutable) {
                const keys = await cache.keys();
                await Promise.all(
                  keys
                    .slice(0, Math.max(0, keys.length - RUNTIME_LIMIT))
                    .map((key) => cache.delete(key))
                );
              }
            });
            event.waitUntil(save.catch(() => undefined));
          }
          return networkResponse;
        })
        .catch(() => {
          if (offlineCached) return offlineCached;
          // Preserve a real network failure for unavailable optional media.
          // Rejecting respondWith's promise leaks an unhandled worker error in
          // WebKit; an error response lets native media failure UI handle it.
          return Response.error();
        });

      // Stale-while-revalidate: cached copy immediately, refresh in background.
      if (cachedResponse) {
        event.waitUntil(networkFetch.catch(() => undefined));
        return cachedResponse;
      }
      return networkFetch;
    })()
  );
});

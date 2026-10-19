import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

const source = readFileSync(resolve(__dirname, "../../../public/sw.js"), "utf8");

function requestThroughWorker(mode: string, cache = "default") {
  const opaque = { type: "opaque", status: 0 };
  const readable = { type: "cors", status: 200, clone: () => readable };
  const fetch = vi.fn().mockResolvedValue(readable);
  const handlers: Record<string, (event: unknown) => void> = {};
  runInNewContext(source, {
    URL,
    Headers,
    console,
    fetch,
    self: {
      location: new URL("https://app.example/wordpix/sw.js"),
      addEventListener: (name: string, fn: (event: unknown) => void) => {
        handlers[name] = fn;
      },
    },
    caches: {
      match: async () => opaque,
      open: async () => ({ put: vi.fn(), match: async () => undefined, keys: async () => [] }),
    },
  });
  let response!: Promise<unknown>;
  handlers.fetch({
    request: {
      method: "GET",
      url: "https://assets.example/audio.mp3",
      mode,
      cache,
      headers: new Headers(),
      destination: "audio",
    },
    waitUntil: vi.fn(),
    respondWith: (value: Promise<unknown>) => {
      response = value;
    },
  });
  return { response, opaque, readable };
}

describe("service worker audio cache", () => {
  it("falls back to a readable pinned script when an offline reload bypasses the preferred cache", async () => {
    const handlers: Record<string, (event: unknown) => void> = {};
    const stored = new Response("export default 1", {
      headers: { "Content-Type": "application/javascript" },
    });
    runInNewContext(source, {
      URL,
      Headers,
      Response,
      console,
      fetch: vi.fn().mockRejectedValue(new Error("offline")),
      self: {
        location: new URL("https://app.example/wordpix/sw.js"),
        addEventListener: (name: string, handler: (event: unknown) => void) => {
          handlers[name] = handler;
        },
      },
      caches: { match: async () => stored, open: async () => ({ match: async () => stored }) },
    });
    let response!: Promise<Response>;
    handlers.fetch({
      request: {
        method: "GET",
        url: "https://app.example/wordpix/assets/index-abcdefgh.js",
        headers: new Headers(),
        mode: "cors",
        cache: "reload",
        destination: "script",
      },
      respondWith: (value: Promise<Response>) => {
        response = value;
      },
    });
    expect(await response).toBe(stored);
  });
  it("serves the requested byte range from a readable cached full recording", async () => {
    const handlers: Record<string, (event: unknown) => void> = {};
    const fetch = vi.fn();
    runInNewContext(source, {
      URL,
      Headers,
      Response,
      console,
      fetch,
      self: {
        location: new URL("https://app.example/wordpix/sw.js"),
        addEventListener: (name: string, handler: (event: unknown) => void) => {
          handlers[name] = handler;
        },
      },
      caches: {
        match: async () =>
          new Response(new Uint8Array([10, 20, 30, 40]), {
            headers: { "Content-Type": "audio/mpeg" },
          }),
      },
    });
    let response!: Promise<Response>;
    handlers.fetch({
      request: {
        method: "GET",
        url: "https://assets.example/audio.mp3",
        headers: new Headers({ Range: "bytes=1-2" }),
      },
      respondWith: (value: Promise<Response>) => {
        response = value;
      },
    });
    const result = await response;
    expect(result.status).toBe(206);
    expect(result.headers.get("Content-Range")).toBe("bytes 1-2/4");
    expect([...new Uint8Array(await result.arrayBuffer())]).toEqual([20, 30]);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("fetches readable bytes instead of returning opaque media to a CORS request", async () => {
    const { response, readable } = requestThroughWorker("cors");
    expect(await response).toBe(readable);
  });
  it("still serves cached opaque media for a no-cors image or audio request", async () => {
    const { response, opaque } = requestThroughWorker("no-cors");
    expect(await response).toBe(opaque);
  });
  it("honors an explicit reload instead of returning the stale media response", async () => {
    const { response, readable } = requestThroughWorker("no-cors", "reload");
    expect(await response).toBe(readable);
  });
});

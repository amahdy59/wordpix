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
    console,
    fetch,
    self: {
      addEventListener: (name: string, fn: (event: unknown) => void) => {
        handlers[name] = fn;
      },
    },
    caches: { match: async () => opaque, open: async () => ({ put: vi.fn() }) },
  });
  let response!: Promise<unknown>;
  handlers.fetch({
    request: { method: "GET", url: "https://assets.example/audio.mp3", mode, cache },
    respondWith: (value: Promise<unknown>) => {
      response = value;
    },
  });
  return { response, opaque, readable };
}

describe("service worker audio cache", () => {
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

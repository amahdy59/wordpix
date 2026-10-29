import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

function worker() {
  type Event = {
    request: Request;
    respondWith: (response: Promise<Response>) => void;
    waitUntil: (task: Promise<unknown>) => void;
  };
  const handlers = new Map<string, (event: Event) => void>();
  const fetch = vi.fn().mockRejectedValue(new TypeError("Offline"));
  const open = vi.fn(async (name: string) => ({
    match: async () =>
      name === "wordpix-images-v1-garden"
        ? new Response("PINNED")
        : name === "wordpix-runtime-v1"
          ? new Response("STALE")
          : undefined,
  }));
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    self: {
      location: new URL("https://app.example/wordpix/sw.js"),
      addEventListener: (name: string, handler: (event: Event) => void) =>
        handlers.set(name, handler),
    },
    caches: {
      open,
      keys: async () => ["wordpix-runtime-v1", "wordpix-images-v1-garden"],
      match: async () => new Response("STALE"),
    },
    URL,
    Response,
    Request,
    fetch,
  });
  return { fetch, handle: handlers.get("fetch")! };
}
describe("pinned image delivery", () => {
  it.each(["default", "reload"] as const)(
    "prefers the unit pack for a destination-less image (%s)",
    async (cache) => {
      const { fetch, handle } = worker();
      const request = new Request("https://cdn.example/image.avif");
      Object.defineProperty(request, "cache", { value: cache });
      expect(request.destination).toBeFalsy();
      const respond = vi.fn();
      handle({ request, respondWith: respond, waitUntil: vi.fn() });
      expect(respond).toHaveBeenCalledOnce();
      const response: Response = await respond.mock.calls[0][0];
      expect(await response.text()).toBe("PINNED");
      expect(fetch).not.toHaveBeenCalled();
    }
  );
  it("never intercepts authenticated requests, even if their path looks like an image", () => {
    const { handle } = worker(),
      respond = vi.fn();
    handle({
      request: new Request("https://cdn.example/private.webp", {
        headers: { Authorization: "Bearer test" },
      }),
      respondWith: respond,
      waitUntil: vi.fn(),
    });
    expect(respond).not.toHaveBeenCalled();
  });
});

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  downloadImagePack,
  inspectImagePack,
  listImagePacks,
  removeImagePack,
  imagePackCacheName,
  IMAGE_PACKS_CHANGED,
} from "../media/offlineImagePacks";

const manifest = {
  unitId: "bedroom",
  urls: ["http://localhost:3000/a.webp", "http://localhost:3000/b.webp"],
};
const stores = new Map<string, Map<string, Response>>();
const urlOf = (key: string | Request) => (typeof key === "string" ? key : key.url);
beforeEach(() => {
  stores.clear();
  vi.stubGlobal("caches", {
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    open: async (name: string) => {
      const store = stores.get(name) ?? new Map<string, Response>();
      stores.set(name, store);
      return {
        match: async (key: string | Request) => store.get(urlOf(key))?.clone(),
        put: async (key: string | Request, response: Response) => {
          store.set(urlOf(key), response.clone());
        },
        delete: async (key: string | Request) => store.delete(urlOf(key)),
        keys: async () => [...store.keys()].map((url) => new Request(url)),
      };
    },
  });
  // Use the environment's real origin, not a production host.
  manifest.urls = [new URL("a.webp", location.href).href, new URL("b.webp", location.href).href];
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () => new Response("real image bytes", { headers: { "Content-Type": "image/webp" } })
    )
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const run = (signal = new AbortController().signal) =>
  downloadImagePack(manifest, { signal, onProgress: vi.fn() });
describe("unit image packs", () => {
  it("downloads readable files, records actual bytes and checks real cache presence", async () => {
    const changed = vi.fn();
    window.addEventListener(IMAGE_PACKS_CHANGED, changed, { once: true });
    const pack = await run();
    expect(changed).toHaveBeenCalledOnce();
    expect(pack.bytes).toBe(32);
    expect((await inspectImagePack(manifest)).ready).toBe(true);
    expect(await listImagePacks()).toHaveLength(1);
    stores.get(imagePackCacheName("bedroom"))!.delete(manifest.urls[1]);
    expect(await inspectImagePack(manifest)).toMatchObject({ cached: 1, total: 2, ready: false });
  });
  it("cancellation preserves the saved portion, retries skip it and removal owns only its unit", async () => {
    const abort = new AbortController();
    await expect(
      downloadImagePack(
        { ...manifest, urls: [manifest.urls[0]] },
        {
          signal: abort.signal,
          onProgress: (cached) => {
            if (cached) abort.abort();
          },
        }
      )
    ).rejects.toThrow();
    expect((await inspectImagePack(manifest)).cached).toBe(1);
    expect(await listImagePacks()).toHaveLength(0);
    vi.mocked(fetch).mockClear();
    await run();
    expect(fetch).toHaveBeenCalledOnce();
    stores.set("wordpix-downloads-v1", new Map());
    stores.set(imagePackCacheName("garden"), new Map());
    localStorage.setItem("image-test-progress", "learned");
    await removeImagePack("bedroom");
    expect(stores.has(imagePackCacheName("garden"))).toBe(true);
    expect(stores.has("wordpix-downloads-v1")).toBe(true);
    expect(localStorage.getItem("image-test-progress")).toBe("learned");
    localStorage.removeItem("image-test-progress");
  });
  it.each([
    () => new Response("", { headers: { "Content-Type": "image/webp" } }),
    () => new Response("not an image", { headers: { "Content-Type": "text/html" } }),
    () => new Response("missing", { status: 404, headers: { "Content-Type": "image/webp" } }),
  ])(
    "rejects unavailable, empty or wrong-type responses without a complete marker",
    async (response) => {
      vi.mocked(fetch).mockImplementation(async () => response());
      await expect(run()).rejects.toThrow();
      expect((await inspectImagePack(manifest)).ready).toBe(false);
      expect(await listImagePacks()).toHaveLength(0);
    }
  );
  it("rejects untrusted origins and unsafe unit IDs before any fetch", async () => {
    await expect(
      downloadImagePack(
        { ...manifest, urls: ["https://other.example/asset.webp"] },
        { signal: new AbortController().signal, onProgress: vi.fn() }
      )
    ).rejects.toThrow();
    await expect(removeImagePack("../other-cache")).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("reports storage failure and never falsely marks ready", async () => {
    const previous = Object.getOwnPropertyDescriptor(navigator, "storage");
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: { estimate: async () => ({ quota: 1, usage: 0 }) },
    });
    await expect(run()).rejects.toMatchObject({ code: "storage" });
    expect(fetch).not.toHaveBeenCalled();
    expect(await listImagePacks()).toHaveLength(0);
    if (previous) Object.defineProperty(navigator, "storage", previous);
    else Reflect.deleteProperty(navigator, "storage");
  });
});

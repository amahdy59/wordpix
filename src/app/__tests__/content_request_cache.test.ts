import { describe, expect, it, vi } from "vitest";
import { createContentRequestCache } from "../data/contentRequestCache";

describe("content request cache", () => {
  it("deduplicates concurrent loads and reuses successful downloads", async () => {
    const request = createContentRequestCache<string, string>();
    const loader = vi.fn().mockResolvedValue("content");
    const first = request("unit", loader);
    expect(request("unit", loader)).toBe(first);
    await expect(first).resolves.toBe("content");
    await expect(request("unit", loader)).resolves.toBe("content");
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("retries rejected downloads without dropping other cached content", async () => {
    const request = createContentRequestCache<string, string>();
    const stable = vi.fn().mockResolvedValue("cached");
    const unstable = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce("retried");
    await request("cached", stable);
    await expect(request("new", unstable)).rejects.toThrow("offline");
    await expect(request("new", unstable)).resolves.toBe("retried");
    await expect(request("cached", stable)).resolves.toBe("cached");
    expect(stable).toHaveBeenCalledTimes(1);
    expect(unstable).toHaveBeenCalledTimes(2);
  });
});

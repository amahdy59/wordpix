import { afterEach, expect, it, vi } from "vitest";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { assertRecordingBucket } = require("../../../scripts/lib/recording_bucket.cjs");
afterEach(() => vi.unstubAllGlobals());
it("requires the WordPix bucket and matching public audio before permitting generation", async () => {
  const etag = "a".repeat(32);
  const client = {
    config: { bucket: "wordpix" },
    head: vi.fn().mockResolvedValue({ etag: `"${etag}"`, "content-length": "4096" }),
  };
  const request = vi
    .fn()
    .mockResolvedValue({ ok: true, headers: new Headers({ etag: `"${etag}"` }) });
  vi.stubGlobal("fetch", request);
  await expect(assertRecordingBucket(client)).resolves.toBeUndefined();
  expect(request.mock.calls[0][1].method).toBe("HEAD");
  request.mockClear();
  await expect(
    assertRecordingBucket({ ...client, config: { bucket: "other-product" } })
  ).rejects.toThrow("different product bucket");
  expect(request).not.toHaveBeenCalled();
});
it("fails closed when credentials point at absent or different audio", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, headers: new Headers({ etag: `"${"b".repeat(32)}"` }) })
  );
  for (const header of [
    null,
    { etag: `"${"a".repeat(32)}"`, "content-length": "4096" },
    { "content-length": "4096" },
  ])
    await expect(
      assertRecordingBucket({ config: { bucket: "wordpix" }, head: async () => header })
    ).rejects.toThrow("verified audio bucket");
});

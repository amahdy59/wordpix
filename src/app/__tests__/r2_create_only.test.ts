import { afterEach, describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createClient } = require("../../../scripts/lib/r2.cjs");
const configuration = {
  R2_ACCOUNT_ID: "test-account",
  R2_ACCESS_KEY_ID: "test-key",
  R2_SECRET_ACCESS_KEY: "test-secret",
  R2_BUCKET: "test-bucket",
};
afterEach(() => vi.unstubAllGlobals());

describe("create-only R2 uploads", () => {
  it("signs an existence condition and leaves an existing object untouched", async () => {
    const request = vi.fn().mockResolvedValue({ status: 412 });
    vi.stubGlobal("fetch", request);
    const created = await createClient(configuration).putIfAbsent(
      "audio/clip.mp3",
      Buffer.from("new recording"),
      { contentType: "audio/mpeg" }
    );
    expect(created).toBe(false);
    expect(request).toHaveBeenCalledTimes(1);
    const options = request.mock.calls[0][1];
    expect(options.method).toBe("PUT");
    expect(options.headers["if-none-match"]).toBe("*");
    expect(options.headers.Authorization).toContain("if-none-match");
  });

  it("reports a newly created object without a delete or replacement request", async () => {
    const request = vi.fn().mockResolvedValue({ status: 200 });
    vi.stubGlobal("fetch", request);
    expect(
      await createClient(configuration).putIfAbsent("audio/clip.mp3", Buffer.from("recording"))
    ).toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][1].method).toBe("PUT");
  });
});

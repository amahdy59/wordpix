import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { readConfig } = require("../../../scripts/lib/r2.cjs") as {
  readConfig: (env: Record<string, string | undefined>) => {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    endpoint: string;
  };
};

describe("R2 configuration", () => {
  it("accepts the WordPix-scoped local credential names", () => {
    expect(
      readConfig({
        CLOUDFLARE_ACCOUNT_ID: "account",
        WORDPIX_R2_ACCESS_KEY_ID: "access",
        WORDPIX_R2_SECRET_ACCESS_KEY: "secret",
        WORDPIX_R2_BUCKET_NAME: "wordpix",
        R2_ENDPOINT: "https://account.r2.cloudflarestorage.com/",
      })
    ).toEqual({
      accountId: "account",
      accessKeyId: "access",
      secretAccessKey: "secret",
      bucket: "wordpix",
      endpoint: "https://account.r2.cloudflarestorage.com",
    });
  });

  it("prefers generic CI credentials when both naming schemes exist", () => {
    const config = readConfig({
      R2_ACCOUNT_ID: "ci-account",
      R2_ACCESS_KEY_ID: "ci-access",
      R2_SECRET_ACCESS_KEY: "ci-secret",
      R2_BUCKET: "ci-bucket",
      CLOUDFLARE_ACCOUNT_ID: "local-account",
      WORDPIX_R2_ACCESS_KEY_ID: "local-access",
      WORDPIX_R2_SECRET_ACCESS_KEY: "local-secret",
      WORDPIX_R2_BUCKET_NAME: "local-bucket",
    });

    expect(config).toMatchObject({
      accountId: "ci-account",
      accessKeyId: "ci-access",
      secretAccessKey: "ci-secret",
      bucket: "ci-bucket",
    });
  });
});

import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

/** Run separately from deployment checks; image baselines are renderer/platform specific. */
export default defineConfig({
  ...base,
  testMatch: "learning-decluttering.spec.ts",
  metadata: { visualBaselines: true },
  snapshotPathTemplate: "{testDir}/learning-visual-snapshots/{platform}/{projectName}/{arg}{ext}",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

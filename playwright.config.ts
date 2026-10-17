import { defineConfig, devices } from "@playwright/test";

const testPort = process.env.WORDPIX_E2E_PORT ?? "6173";
const testBaseURL = `http://localhost:${testPort}`;
const testWorkers = Number(process.env.WORDPIX_E2E_WORKERS ?? 2);
if (!Number.isSafeInteger(testWorkers) || testWorkers < 1) {
  throw new Error("WORDPIX_E2E_WORKERS must be a positive integer.");
}

export default defineConfig({
  testDir: "./e2e",
  outputDir: process.env.WORDPIX_E2E_OUTPUT_DIR ?? "test-results",
  // Multi-step learning flows also run axe and capture screenshots. Keep
  // their total budget separate from individual assertion timeouts.
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: testWorkers,
  reporter: "html",
  use: {
    baseURL: testBaseURL,
    // UI tests must not race service-worker CacheStorage writes or bypass
    // HTTP interception. The dedicated offline fixture explicitly opts in.
    serviceWorkers: "block",
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${testPort}`,
    url: testBaseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

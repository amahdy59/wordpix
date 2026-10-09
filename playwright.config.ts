import { defineConfig, devices } from "@playwright/test";

const testPort = process.env.WORDPIX_E2E_PORT ?? "6173";
const testBaseURL = `http://localhost:${testPort}`;
const testWorkers = Number(process.env.WORDPIX_E2E_WORKERS ?? 2);
if (!Number.isSafeInteger(testWorkers) || testWorkers < 1) {
  throw new Error("WORDPIX_E2E_WORKERS must be a positive integer.");
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: testWorkers,
  reporter: "html",
  use: {
    baseURL: testBaseURL,
    trace: "on-first-retry",
  },
  projects: [
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

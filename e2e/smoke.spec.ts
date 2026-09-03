import { test } from "@playwright/test";

test("dashboard to explore flow", async ({ page }) => {
  // Pre-seed nav state so the app boots past onboarding to the splash/dashboard.
  // Without this the first run shows onboarding ("Choose Your Language") and
  // "Get Started" is never rendered.
  await page.addInitScript(() => {
    // Setting to explore bypasses onboarding entirely
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Explore screen should be visible now
  await page.getByText("The Garden").waitFor({ timeout: 15000 });
  await page.goto("/#/explore");
  await page.getByText("The Garden").waitFor({ timeout: 10000 });
});

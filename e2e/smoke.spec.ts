import { test, expect } from "@playwright/test";

test("explore defers the dictionary until review opens", async ({ page }) => {
  const dictionaryRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("lexicon-dictionary-")) dictionaryRequests.push(request.url());
  });
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
  });
  await page.goto("/");
  await expect(page.getByText("The Garden", { exact: true })).toBeVisible();
  expect(dictionaryRequests).toHaveLength(0);

  await page.goto("/#/practice");
  await expect(page.getByRole("heading", { name: "No memory data yet" })).toBeVisible();
  expect(dictionaryRequests).toHaveLength(1);
});

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

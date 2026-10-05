import { test, expect } from "@playwright/test";

test("library defers the dictionary until a lesson needs it", async ({ page }) => {
  const lexiconShardRequests = new Set<string>();
  page.on("request", (request) => {
    if (/\/lexicon-\d+-/.test(request.url())) lexiconShardRequests.add(request.url());
  });
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "library" }));
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: /A1 Foundations/ })
    .first()
    .click();
  await expect(page.getByText("The Garden", { exact: true })).toBeVisible();
  expect(lexiconShardRequests.size).toBe(0);

  // The empty review screen has no words to look up, so it fetches nothing.
  await page.goto("/#/review");
  await expect(page.getByRole("heading", { name: "No memory data yet" })).toBeVisible();
  expect(lexiconShardRequests.size).toBe(0);

  // Starting a lesson requests only the active word shard and, at most, one
  // speculative next-word shard. The former monolithic dictionary chunk no
  // longer exists, so this assertion follows the bounded shard contract.
  await page.goto("/#/learn/construction-site");
  await page.getByRole("heading", { name: /Construction Site/i }).waitFor({ timeout: 15000 });
  await page
    .getByRole("button", { name: /^Start lesson:/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "Listen & repeat" })).toBeVisible();
  await expect.poll(() => lexiconShardRequests.size, { timeout: 15000 }).toBeGreaterThan(0);
  expect(lexiconShardRequests.size).toBeLessThanOrEqual(2);
});

test("learn path links to the optional library", async ({ page }) => {
  // Pre-seed nav state so the app boots past onboarding to the splash/dashboard.
  // Without this the first run shows onboarding ("Choose Your Language") and
  // "Get Started" is never rendered.
  await page.addInitScript(() => {
    // Setting to explore bypasses onboarding entirely
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("heading", { name: "Your learning path" }).waitFor({ timeout: 15000 });
  await page.getByRole("button", { name: "Browse vocabulary library", exact: true }).click();
  await expect(page).toHaveURL(/#\/library$/);
  await page
    .getByRole("button", { name: /A1 Foundations/ })
    .first()
    .click();
  await page.getByText("The Garden", { exact: true }).waitFor({ timeout: 10000 });
});

test("practice renders one application shell", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "practice" }));
  });

  await page.goto("/#/practice");
  await expect(page.getByRole("heading", { name: "Practice by skill" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(1);
  await expect(page.locator("#main-content")).toHaveCount(1);
});

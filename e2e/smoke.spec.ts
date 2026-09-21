import { test, expect } from "@playwright/test";

test("library defers the dictionary until review opens", async ({ page }) => {
  const dictionaryRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("lexicon-dictionary-")) dictionaryRequests.push(request.url());
  });
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "library" }));
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Beginner Basics/ }).click();
  await expect(page.getByText("The Garden", { exact: true })).toBeVisible();
  expect(dictionaryRequests).toHaveLength(0);

  await page.goto("/#/review");
  await expect(page.getByRole("heading", { name: "No memory data yet" })).toBeVisible();
  expect(dictionaryRequests).toHaveLength(1);
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
  await page.getByRole("button", { name: "Explore picture worlds", exact: true }).click();
  await expect(page).toHaveURL(/#\/library$/);
  await page.getByRole("button", { name: /Beginner Basics/ }).click();
  await page.getByText("The Garden", { exact: true }).waitFor({ timeout: 10000 });
});

test("practice renders one application shell", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "practice" }));
  });

  await page.goto("/#/practice");
  await expect(page.getByRole("heading", { name: "Skill Exercise Hub" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(1);
  await expect(page.locator("#main-content")).toHaveCount(1);
});

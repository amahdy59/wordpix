import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe.configure({ timeout: 75_000 });

test("home page should not have any automatically detectable accessibility issues", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("#root").waitFor({ state: "visible", timeout: 15_000 });
  // Wait for entrance fade-in transition to complete to 100% opacity
  await page.waitForTimeout(400);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("study practice has no automatically detectable accessibility issues", async ({ page }) => {
  await page.goto("/#/learn/bathroom/study/practice/practice-session");
  const answers = page.locator('#study-content [role="group"]');
  await expect(answers).toBeVisible();
  await expect(answers.getByRole("button").first()).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("study vocabulary grid is accessible and contained", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/learn/bathroom/study/learn/learn-essential");
  await expect(page.getByRole("searchbox", { name: "Search words" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("list", { name: /vocabulary/i })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("practice keyboard keeps focus on the selected answer during feedback", async ({ page }) => {
  await page.goto("/#/learn/bathroom/study/practice/practice-session");
  const answers = page.locator('#study-content [role="group"]');
  await expect(answers).toBeVisible();
  const answer = answers.getByRole("button").first();
  await answer.focus();
  await page.keyboard.press("Enter");
  await expect(answer).toHaveAttribute("aria-disabled", "true");
  await expect(answer).toBeFocused();
});

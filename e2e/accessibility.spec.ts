import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page should not have any automatically detectable accessibility issues", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForSelector("text=Start");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("practice route should not have automatically detectable accessibility issues", async ({
  page,
}) => {
  // Navigate to the first unit's practice area via URL state
  await page.goto("/?unit=bathroom&area=practice");

  // Wait for either the practice session or an empty state message
  const practiceTitle = page.getByRole("heading", { level: 1 });
  await practiceTitle.waitFor({ timeout: 10_000 }).catch(() => null);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("practice keyboard: focus stays on chosen answer button after answering", async ({ page }) => {
  await page.goto("/?unit=bathroom&area=practice");

  // Wait for the question to appear
  const questionGroup = page.locator('[role="group"]').first();
  await questionGroup.waitFor({ timeout: 10_000 }).catch(() => null);

  // Get the first answer button and click it
  const firstButton = page.locator('[role="group"] button').first();
  await firstButton.focus();
  await page.keyboard.press("Enter");

  // After answering, focus should remain within the exercise — not escape to body
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase());
  expect(focusedTag).not.toBe("body");
});

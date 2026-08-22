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

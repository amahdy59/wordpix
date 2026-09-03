import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile listen-and-repeat keeps one focused learning path", async ({ page }) => {
  await page.goto("/");
  const skipSetup = page.getByRole("button", { name: /Skip setup/i });
  if (await skipSetup.isVisible()) await skipSetup.click();

  await page.goto("/#/learn/construction-site");
  await page.getByRole("heading", { name: "The Construction Site", level: 1 }).waitFor();
  await page.getByRole("button", { name: "Start", exact: true }).first().click();

  await expect(page.getByRole("heading", { name: "Listen & repeat" })).toBeVisible();
  await expect(page.getByText("Target Visual")).toHaveCount(0);
  await expect(page.getByText(/Use Left\/Right arrows/i)).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Group vocabulary words" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Word details" })).toHaveCount(1);

  const hero = page.locator('img[fetchpriority="high"]');
  await expect(hero).toBeVisible();
  await expect(hero.locator("xpath=..").getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("progressbar", { name: "Word progress" })).toHaveAttribute(
    "aria-valuetext",
    "Word 1 of 15"
  );

  await page.getByRole("button", { name: "Next word" }).click();
  await expect(page.getByRole("progressbar", { name: "Word progress" })).toHaveAttribute(
    "aria-valuetext",
    "Word 2 of 15"
  );
  await expect(page.getByRole("heading", { name: "Bulldozer" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2
  );
  expect(hasHorizontalOverflow).toBe(false);

  const accessibilityScan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibilityScan.violations).toEqual([]);
});

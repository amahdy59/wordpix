import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ viewport: { width: 390, height: 844 } });

// Seed localStorage so the app boots past onboarding directly into the dashboard.
// The nav state key is "wordpix:learner-state:v4" — set it to the explore screen
// so the hash router takes over from there.
const seedStorage = async (page: import("@playwright/test").Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
  });
};

test("mobile listen-and-repeat keeps one focused learning path", async ({ page }) => {
  await seedStorage(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.goto("/#/learn/construction-site");
  await page.getByRole("heading", { name: /Construction Site/i }).waitFor({ timeout: 15000 });
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

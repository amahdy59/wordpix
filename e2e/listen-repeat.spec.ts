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

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`listen layout uses available space at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/#/learn/construction-site");
    await page.getByRole("button", { name: "Start", exact: true }).first().click();
    await expect(page.getByRole("heading", { name: "Listen & repeat" })).toBeVisible();
    const hero = page.locator('img[fetchpriority="high"]');
    const listen = page.getByRole("button", { name: /Play audio pronunciation/ });
    await expect(hero).toBeVisible();
    await expect(listen).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true
    );
    if (viewport.width >= 1024) {
      const imageBox = (await hero.boundingBox())!;
      const buttonBox = (await listen.boundingBox())!;
      expect(imageBox.x + imageBox.width).toBeLessThan(buttonBox.x);
      expect(imageBox.width).toBeGreaterThan(450);
      expect(buttonBox.y + buttonBox.height).toBeLessThan(viewport.height - 70);
    }
    const details = page.getByRole("button", { name: "Word details", exact: true });
    await details.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(details).toBeFocused();
    await page.getByRole("region", { name: /Listen & repeat exercise/ }).evaluate((element) => {
      element.scrollTop = 0;
    });
    await expect
      .poll(() =>
        hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
      )
      .toBe(true);
    await page.screenshot({ path: testInfo.outputPath("listen-layout.png") });
  });
}

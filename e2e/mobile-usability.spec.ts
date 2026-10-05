import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("phone tabs and skill choices remain visible with enlarged text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#/practice");
  await page.getByRole("button", { name: "Settings & Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "150%", exact: true }).click();
  await page.getByRole("button", { name: "Close settings", exact: true }).click();

  const nav = page.getByRole("navigation", { name: "Main navigation", exact: true });
  await expect(nav.getByRole("button")).toHaveCount(5);
  const group = page.getByRole("radiogroup", { name: "Exercise categories" });
  for (const control of [
    ...(await nav.getByRole("button").all()),
    ...(await group.getByRole("radio").all()),
  ]) {
    await expect(control).toBeVisible();
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const listening = group.getByRole("radio", { name: "Listening", exact: true });
  await listening.focus();
  await listening.press("ArrowRight");
  await expect(group.getByRole("radio", { name: "Reading", exact: true })).toBeFocused();
  await expect(group.getByRole("radio", { name: "Reading", exact: true })).toBeChecked();
});

test("the guided path comes before specialist courses", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/learn");
  const path = page.getByRole("button", { name: /View full learning path/ });
  const courses = page.getByRole("region", { name: "Specialized learning curricula" });
  await expect(path).toBeVisible();
  const pathBox = await path.boundingBox();
  const coursesBox = await courses.boundingBox();
  expect(pathBox!.y).toBeLessThan(coursesBox!.y);
  await path.click();
  await expect(page.locator("#picture-world-path")).toBeVisible();
});

test("library lookup announces results and exposes optional filters", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#/library");
  const levels = page.getByRole("radiogroup", { name: "Filter vocabulary collections" });
  await expect(levels).toBeHidden();
  const search = page.getByRole("searchbox", { name: "Search units or vocabulary" });
  await search.fill("zzzzzz-no-match");
  await expect(page.getByRole("status").filter({ hasText: "Found 0 units" })).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toHaveValue("");
  await page.locator("summary").filter({ hasText: "Filter by level or progress" }).click();
  await expect(levels).toBeVisible();
  await levels.getByRole("radio", { name: "A1 Foundations", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Found 36 units" })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("Arabic practice cards and mobile utilities have translated names", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wordpix:interface-lang", "ar"));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/practice");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "مطابقة الكلمات", exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "الصفحة الرئيسية في WordPix", exact: true })
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("main tabs retain enhanced text contrast on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const tab of ["home", "learn", "practice", "library", "profile"]) {
    await page.goto(`/#/${tab}`);
    await expect(page.locator("main h1")).toBeVisible();
    const scan = await new AxeBuilder({ page }).withRules(["color-contrast-enhanced"]).analyze();
    expect(scan.violations, `${tab} enhanced text contrast`).toEqual([]);
  }
});

test("pronunciation lesson cards do not overflow their phone scroll container", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#/pronunciation");
  await expect(
    page.getByRole("heading", { name: "Pronunciation curriculum", exact: true })
  ).toBeVisible();
  const scroller = page
    .getByRole("main")
    .locator('[aria-labelledby="pronunciation-curriculum-title"]');
  expect(await scroller.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true
  );
  const lists = page.getByRole("tabpanel").locator("ol");
  expect(
    await lists.evaluateAll((elements) =>
      elements.every((element) => element.scrollWidth <= element.clientWidth)
    )
  ).toBe(true);
  await page.goto("/#/practice");
  await page.getByRole("button", { name: "Settings & Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "150%", exact: true }).click();
  await page.getByRole("button", { name: "Close settings", exact: true }).click();
  await page.goto("/#/pronunciation");
  await expect(
    page.getByRole("heading", { name: "Pronunciation curriculum", exact: true })
  ).toBeVisible();
  expect(await scroller.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true
  );
});

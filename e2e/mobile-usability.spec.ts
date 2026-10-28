import { waitForStyles } from "./waitForStyles";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const language of ["en", "ar"] as const) {
  test(`study header and activity drawer fit a narrow phone with enlarged ${language} text`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.addInitScript((lang) => {
      localStorage.setItem("wordpix:interface-lang", lang);
      localStorage.setItem(
        "wordpix:learner:v2",
        JSON.stringify({
          version: 3,
          accessibility: { textSize: "xlarge", reduceMotion: true },
        })
      );
    }, language);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/#/learn/numbers-counting/study/learn");
    await waitForStyles(page);
    const header = page.locator(".wp-study-header");
    await expect(header).toBeVisible();
    const title = header.getByText("Numbers & Counting", { exact: true });
    await expect(title).toBeVisible();
    expect((await title.boundingBox())!.width).toBeGreaterThan(180);
    expect((await header.boundingBox())!.height).toBeLessThan(360);
    for (const control of await header.getByRole("button").all()) {
      const box = (await control.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
    }
    const activities = language === "en" ? "Unit activities" : "أنشطة الوحدة";
    const trigger = header.getByRole("button", { name: activities, exact: true });
    await trigger.click();
    const drawer = page.getByRole("dialog", { name: activities });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await drawer
      .getByRole("button", {
        name: language === "en" ? "Unit overview" : "نظرة عامة على الوحدة",
        exact: true,
      })
      .click();
    await expect(drawer).toHaveCount(0);
    await expect(page).toHaveURL(/\/study$/);
    await info.attach(`study-header-${language}.png`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    expect(errors).toEqual([]);
  });
}

test("compact specialist navigation stays available while reading and dismisses with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/business/unit-01/input");
  await waitForStyles(page);
  await expect(page.locator("h1")).toHaveCount(1);
  const navigation = page.getByRole("navigation", { name: "Lesson sections", exact: true });
  await expect(navigation).toBeVisible();
  const summary = navigation.locator("summary");
  await page.getByRole("main").evaluate((element) => {
    element.scrollTop = 500;
  });
  await expect.poll(async () => (await summary.boundingBox())!.y).toBeLessThan(80);
  await expect(summary).toBeInViewport();
  await summary.click();
  await expect(navigation.getByRole("button").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  await expect(navigation.locator("details")).not.toHaveAttribute("open");
});

test("phone tabs and skill choices remain visible with enlarged text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#/practice", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await page
    .getByRole("banner", { name: "Mobile navigation" })
    .getByRole("button", { name: "Settings & Accessibility", exact: true })
    .click();
  await page.getByRole("button", { name: "150%", exact: true }).click();
  await page.getByRole("button", { name: "Close settings", exact: true }).click();

  const nav = page.getByRole("navigation", { name: "Main navigation", exact: true });
  await expect(nav.getByRole("link")).toHaveCount(5);
  const group = page.getByRole("radiogroup", { name: "Exercise categories" });
  for (const control of [
    ...(await nav.getByRole("link").all()),
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
  await page.goto("/#/learn", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  const path = page.getByRole("button", { name: /Vocabulary path/ });
  const courses = page.getByRole("region", { name: "Specialist courses" });
  await expect(path).toBeVisible();
  const pathBox = await path.boundingBox();
  const coursesBox = await courses.boundingBox();
  expect(pathBox!.y).toBeLessThan(coursesBox!.y);
  await expect(path).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#picture-world-path")).toBeVisible();
});

test("library lookup announces results and exposes optional filters", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#/library", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  const levels = page.getByRole("radiogroup", { name: "Filter vocabulary collections" });
  await expect(levels).toBeHidden();
  const search = page.getByRole("searchbox", { name: "Search units or vocabulary" });
  await search.fill("zzzzzz-no-match");
  await expect(page.getByRole("status").filter({ hasText: "Found 0 units" })).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toHaveValue("");
  await page.getByRole("main").evaluate((element) => {
    element.scrollTop = 400;
  });
  const filters = page.locator("summary").filter({ hasText: "Filter by level or progress" });
  await filters.click();
  await expect(filters).toBeInViewport();
  await expect(levels).toBeVisible();
  await levels.getByRole("radio", { name: "A1 Foundations", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Found 36 units" })).toBeVisible();
  const selectedLabel = levels
    .getByRole("radio", { name: "A1 Foundations", exact: true })
    .getByText("A1 Foundations", { exact: true });
  // WebKit can expose the previous style to axe during a filter rerender.
  // Verify the actual selected foreground has settled before the full audit.
  await expect(selectedLabel).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(selectedLabel).toHaveCSS("font-weight", "700");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("Arabic practice cards and mobile utilities have translated names", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wordpix:interface-lang", "ar"));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/practice", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "مطابقة الكلمات", exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "الصفحة الرئيسية في WordPix", exact: true })
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("main tabs retain enhanced text contrast on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/home", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Sidebar navigation" })).toBeHidden();
  for (const tab of ["home", "learn", "practice", "library", "profile"]) {
    await page.evaluate((route) => {
      window.location.hash = `/${route}`;
    }, tab);
    await expect(page).toHaveURL(new RegExp(`#/${tab}$`));
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation", exact: true })
        .getByRole("link", { name: tab[0].toUpperCase() + tab.slice(1), exact: true })
    ).toHaveAttribute("aria-current", "page");
    await expect(page.locator("main h1")).toBeVisible();
    const scan = await new AxeBuilder({ page }).withRules(["color-contrast-enhanced"]).analyze();
    expect(scan.violations, `${tab} enhanced text contrast`).toEqual([]);
  }
});

test("pronunciation lesson cards do not overflow their phone scroll container", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#/pronunciation", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
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
  await page.evaluate(() => {
    window.location.hash = "/practice";
  });
  await expect(page.getByRole("heading", { name: "Practice", exact: true })).toBeVisible();
  await page
    .getByRole("banner", { name: "Mobile navigation" })
    .getByRole("button", { name: "Settings & Accessibility", exact: true })
    .click();
  await page.getByRole("button", { name: "150%", exact: true }).click();
  await page.getByRole("button", { name: "Close settings", exact: true }).click();
  await expect(page.getByRole("button", { name: "Close settings", exact: true })).toHaveCount(0);
  await page.evaluate(() => {
    window.location.hash = "/pronunciation";
  });
  await expect(
    page.getByRole("heading", { name: "Pronunciation curriculum", exact: true })
  ).toBeVisible();
  expect(await scroller.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true
  );
});

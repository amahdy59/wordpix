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
  await expect(answers).toBeVisible({ timeout: 30_000 });
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
  await expect(page.getByRole("main")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("Hadith curriculum index has no automatically detectable accessibility issues", async ({
  page,
}) => {
  await page.goto("/#/hadith");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("button", { name: /Actions and Intentions/i })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("pronunciation curriculum index has no automatically detectable accessibility issues", async ({
  page,
}) => {
  await page.goto("/#/pronunciation");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("high-contrast preference uses AAA text colours", async ({ page }) => {
  await page.emulateMedia({ contrast: "more" });
  await page.goto("/");
  await expect(page.locator("#main-content")).toBeVisible();

  const bodyColours = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return { color: style.color, background: style.backgroundColor };
  });
  expect(bodyColours).toEqual({ color: "rgb(255, 255, 255)", background: "rgb(0, 0, 0)" });

  const results = await new AxeBuilder({ page }).withRules(["color-contrast-enhanced"]).analyze();
  expect(results.violations).toEqual([]);
});

test("curriculum controls retain 44px targets on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });

  for (const route of ["/#/pronunciation", "/#/business"]) {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();

    const undersized = await page.locator("main").evaluate((main) =>
      Array.from(
        main.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [role="button"]:not([aria-disabled="true"]), [role="radio"]:not([aria-disabled="true"])'
        )
      ).flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          rect.width === 0 ||
          rect.height === 0 ||
          element.getAttribute("aria-hidden") === "true"
        ) {
          return [];
        }
        if (element.tagName === "A" && style.display === "inline") return [];
        if (rect.width >= 44 && rect.height >= 44) return [];
        return [
          {
            name: (element.getAttribute("aria-label") || element.textContent || "")
              .trim()
              .slice(0, 60),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        ];
      })
    );

    expect(undersized, `${route} contains undersized controls`).toEqual([]);
  }
});

test("conversation curriculum and warm-up have no detectable accessibility issues", async ({
  page,
}) => {
  await page.goto("/#/conversation");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "Conversation & Debate" })
  ).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);

  const curriculumResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(curriculumResults.violations).toEqual([]);

  await page
    .getByRole("button", { name: /Unit 01: Could You Live Without Your Smartphone/ })
    .click();
  await expect(page.getByRole("radiogroup", { name: "Quick vote options" })).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const lessonResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(lessonResults.violations).toEqual([]);
});

test("practice keyboard keeps focus on the selected answer during feedback", async ({ page }) => {
  await page.goto("/#/learn/bathroom/study/practice/practice-session");
  const answers = page.locator('#study-content [role="group"]');
  await expect(answers).toBeVisible({ timeout: 30_000 });
  const answer = answers.getByRole("button").first();
  await answer.focus();
  await page.keyboard.press("Enter");
  await expect(answer).toHaveAttribute("aria-disabled", "true");
  await expect(answer).toBeFocused();
});

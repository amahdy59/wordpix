import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("all Hadith routes use the requested lesson and one canonical source block", async ({
  page,
}) => {
  await page.goto("/#/hadith/lesson-42");
  await expect(page.getByRole("heading", { name: "Hope, Prayer, and Forgiveness" })).toBeVisible();
  await expect(page.getByRole("main").getByText("Lesson 42 of 42", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Read & Listen/ }).click();
  const canonical = page.getByText(/O son of Adam, so long as you call upon Me/i, {
    exact: true,
  });
  await expect(canonical).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Listen to Arabic" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Listen to translation" })).toBeVisible();
});

test("Hadith lesson is accessible and contained on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/hadith/lesson-18");
  await expect(page.getByRole("heading", { name: "Repairing a Mistake With Good" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("Hadith 2 practice provides ten questions and restores the next stage", async ({ page }) => {
  await page.goto("/#/hadith/lesson-2");
  await page.getByRole("button", { name: /Practice/ }).click();

  await page.getByRole("button", { name: "Jibril (Gabriel)", exact: true }).click();
  await page.getByRole("button", { name: "Tell me and explain the topic", exact: true }).click();
  for (const label of [
    "Arrival and scene",
    "Islam and its pillars",
    "Iman and core beliefs",
    "Ihsan",
    "The Hour and Jibril’s identity",
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
  }
  await expect(page.getByText(/3 of 10 answered/)).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(700);
  await page.reload();
  await expect(page.getByText("Saved progress restored", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Speak/ })).toHaveAttribute("aria-current", "step");
});

test("Hadith 1 pilot presents a complete visual and interactive learning flow", async ({
  page,
}) => {
  await page.goto("/#/hadith/lesson-1");

  await expect(page.getByRole("button", { name: /Overview/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Warm-up/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Listen slowly" })).toBeVisible();

  await page.getByRole("button", { name: /Vocabulary/ }).click();
  await expect(
    page.getByRole("heading", { name: "Core expressions, pictures, and use" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Complete language bank" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play pronunciation for action" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Play pronunciation for carry out", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Play pronunciation for thoughtful action", exact: true })
  ).toBeVisible();

  await page.getByRole("button", { name: /Practice/ }).click();
  await expect(page.locator("fieldset")).toHaveCount(10);
  await expect(page.getByAltText("Vocabulary picture clue")).toBeVisible();
  await expect(
    page.getByRole("group", { name: /What main message does the Hadith teach about an action/ })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Make the Hadith useful in your life" })
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

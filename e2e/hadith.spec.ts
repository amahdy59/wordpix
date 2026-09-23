import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("all Hadith routes use the requested lesson and one canonical source block", async ({
  page,
}) => {
  await page.goto("/#/hadith/lesson-42");
  await expect(page.getByRole("heading", { name: "Hope, Prayer, and Forgiveness" })).toBeVisible();
  await expect(page.getByText("Lesson 42 of 42", { exact: true })).toBeVisible();

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

test("Hadith 2 practice scores retrieval and restores the next stage", async ({ page }) => {
  await page.goto("/#/hadith/lesson-2");
  await page.getByRole("button", { name: /Practice/ }).click();

  await page.getByRole("button", { name: "Jibril (Gabriel)" }).click();
  await page.getByRole("button", { name: "Tell me and explain the topic" }).click();
  for (const label of [
    "Arrival and scene",
    "Islam and its pillars",
    "Iman and core beliefs",
    "Ihsan",
    "The Hour and Jibril’s identity",
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
  }
  await expect(page.getByText("3 of 3 answered · score 100%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForTimeout(700);
  await page.reload();
  await expect(page.getByText("Saved progress restored", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Speak/ })).toHaveAttribute("aria-current", "step");
});

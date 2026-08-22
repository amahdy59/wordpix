import { test } from "@playwright/test";

test("dashboard to explore flow", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("text=Get Started");
  await page.click("text=Skip setup");
  await page.waitForSelector("text=Continue Session");
  await page.goto("/#/explore");
  await page.waitForSelector("text=The Garden");
});

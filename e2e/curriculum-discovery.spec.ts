import { expect, test } from "@playwright/test";

test("Hadith curriculum exposes all 42 lessons and opens the canonical source", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/#/hadith");

  await expect(page.getByRole("heading", { name: "Hadith English curriculum" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Hadith lessons" }).getByRole("button")).toHaveCount(
    42
  );
  await page.getByRole("button", { name: /Actions and Intentions/ }).click();
  await expect(page).toHaveURL(/#\/hadith\/lesson-1$/);
  await page.getByRole("button", { name: "3. Read & Listen" }).click();
  await expect(page.getByText("Complete Hadith", { exact: true })).toHaveCount(1);
  await expect(page.getByText(/Actions are \(judged\) by motives/)).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("pronunciation curriculum is grouped, searchable, and uses R2-backed artwork", async ({
  page,
}) => {
  const errors: string[] = [];
  const imageRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/pronunciation/v1/")) imageRequests.push(request.url());
  });

  await page.goto("/#/pronunciation");

  await expect(page.getByRole("heading", { name: "Pronunciation curriculum" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sound contrasts/i })).toBeVisible();
  await page.getByLabel("Search pronunciation lessons").fill("Sheep or Ship");
  await page.getByRole("button", { name: /Sheep or Ship/ }).click();

  await expect(page).toHaveURL(/#\/pronunciation\/lesson-02$/);
  await expect(page.getByRole("heading", { name: /Sheep or Ship/ })).toBeVisible();
  await expect(page.getByRole("list", { name: "Target sound contrasts" })).toContainText(
    "sheep / ship"
  );
  await expect.poll(() => imageRequests.length).toBeGreaterThan(0);
  expect(imageRequests.every((url) => url.includes("r2.dev/pronunciation/v1/"))).toBe(true);
  expect(errors).toEqual([]);
});

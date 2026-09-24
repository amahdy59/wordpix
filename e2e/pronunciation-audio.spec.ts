import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

test("Pin or Pen includes the spoken led answer with an edge-to-edge image", async ({ page }) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/audio/**/*.mp3", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      body: fs.readFileSync(
        path.resolve(
          "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
        )
      ),
      contentType: "audio/mpeg",
    });
  });
  await page.goto("/#/pronunciation/lesson-03");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const answer = page.getByRole("button", { name: /^Option \d+: led$/ });
  await expect(answer).toBeVisible();
  await expect(page.getByRole("button", { name: /^Option \d+: lid$/ })).toBeVisible();
  const clip = manifest.clips.led.find((clip) => clip.source === "derived-profile")!;
  await expect.poll(() => requests.some((url) => url.endsWith(clip.objectKey))).toBe(true);
  const layout = await answer.evaluate((button) => {
    const image = button.querySelector("img")!;
    return {
      card: button.clientWidth,
      image: image.getBoundingClientRect().width,
      fit: getComputedStyle(image).objectFit,
    };
  });
  expect(Math.abs(layout.card - layout.image)).toBeLessThanOrEqual(1);
  expect(layout.fit).toBe("cover");
  await answer.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
  expect(errors).toEqual([]);
});

const manifest = JSON.parse(
  fs.readFileSync(
    path.resolve("src/app/learning/foundations/pronunciationAudioManifest.json"),
    "utf8"
  )
) as {
  clips: Record<string, Array<{ objectKey: string; displayText: string; source: string }>>;
};

test("pronunciation uses the reconciled R2 manifest key", async ({ page }) => {
  const pageErrors: string[] = [];
  const audioRequests: string[] = [];
  const fixture = path.resolve(
    "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
  );
  const expectedKey = manifest.clips.cat.find(
    (clip) => clip.displayText === "cat" && clip.source === "derived-profile"
  )?.objectKey;
  expect(expectedKey).toBeTruthy();

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) audioRequests.push(request.url());
  });
  await page.route("**/audio/**/*.mp3", async (route) => {
    await route.fulfill({
      body: fs.readFileSync(fixture),
      contentType: "audio/mpeg",
      status: 200,
    });
  });

  await page.goto("/#/pronunciation/lesson-01");
  await expect(page.getByRole("heading", { name: /same or different/i })).toBeVisible();
  await page.getByRole("button", { name: "Play model pronunciation" }).click();
  await expect.poll(() => audioRequests.some((url) => url.endsWith(expectedKey!))).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("correct pronunciation choices play reusable feedback and advance automatically", async ({
  page,
}) => {
  const fixture = path.resolve(
    "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
  );
  await page.route("**/audio/**/*.mp3", async (route) => {
    await route.fulfill({
      body: fs.readFileSync(fixture),
      contentType: "audio/mpeg",
      status: 200,
    });
  });

  await page.goto("/#/pronunciation/lesson-01");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Check 1 of 3 in this stage", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /^Option \d+: log$/ }).click();
  await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
  const replay = page.getByRole("button", { name: "Replay feedback" });
  await expect(replay).toBeVisible();
  await replay.click();

  await expect(page.getByText("Check 2 of 3 in this stage", { exact: true })).toBeVisible({
    timeout: 10_000,
  });
});

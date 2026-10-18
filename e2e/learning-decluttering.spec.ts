import { expect, test } from "@playwright/test";
import type { Locator, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { installWebKitPlaybackFixture, playbackFixture } from "./audioFixture";
import { waitForStyles } from "./waitForStyles";

// Screenshot fixtures must own HTTP interception across full-page navigation.
// Offline/service-worker behavior has its own real-storage browser coverage.
test.use({ serviceWorkers: "block" });

test("pronunciation retries a failed clip before accepting a scored response", async ({
  page,
}, info) => {
  test.setTimeout(60_000);
  await installWebKitPlaybackFixture(page, info);
  let available = false;
  await page.route("**/audio/**/*.mp3", (route) =>
    available
      ? route.fulfill({ body: playbackFixture(), contentType: "audio/wav" })
      : route.abort("failed")
  );
  await page.goto("/#/pronunciation/lesson-03");
  await page.getByRole("button", { name: "Start listening", exact: true }).click();
  await page.getByRole("button", { name: "Play model pronunciation", exact: true }).click();
  const retry = page.getByRole("button", { name: "Try audio again", exact: true });
  await expect(retry).toBeEnabled();
  const answer = page.getByRole("button", { name: /^Option \d+: led$/ });
  await expect(answer).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("alert")).toContainText("try again");
  available = true;
  await retry.click();
  await expect(answer).toHaveAttribute("aria-disabled", "false");
  await answer.click();
  await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
});

async function capture(locator: Locator, name: string, info: TestInfo) {
  if (info.config.metadata.visualBaselines) {
    await expect(locator).toHaveScreenshot(name, {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  } else {
    await info.attach(name, {
      body: await locator.screenshot({ animations: "disabled" }),
      contentType: "image/png",
    });
  }
}

for (const language of ["en", "ar"] as const) {
  for (const theme of ["light", "dark"] as const) {
    for (const textSize of ["standard", "xlarge"] as const) {
      test(`focused learning: ${language}, ${theme}, ${textSize}`, async ({ page }, info) => {
        test.setTimeout(60_000);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error" && !message.text().includes("Failed to load resource"))
            errors.push(message.text());
        });
        await page.setViewportSize({ width: textSize === "xlarge" ? 320 : 390, height: 844 });
        await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
        // Keep image review deterministic and independent of remote font availability.
        await page.route("https://fonts.googleapis.com/**", (route) =>
          route.fulfill({ status: 200, contentType: "text/css", body: "" })
        );
        await page.route("**/pronunciation/v1/images/**", (route) =>
          route.fulfill({
            status: 200,
            contentType: "image/svg+xml",
            body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="silver"/><circle cx="48" cy="48" r="24" fill="gray"/></svg>',
          })
        );
        await page.addInitScript(
          ({ language, textSize }) => {
            localStorage.setItem("wordpix:interface-lang", language);
            localStorage.setItem(
              "wordpix:learner:v2",
              JSON.stringify({
                version: 3,
                accessibility: { textSize, reduceMotion: true },
              })
            );
          },
          { language, textSize }
        );
        await page.goto("/#/business/unit-01/speaking");
        const studioLabel =
          language === "en" ? "Executive Speaking Practice" : "التدريب على التحدث التنفيذي";
        const studio = page
          .locator("details")
          .filter({ has: page.getByText(studioLabel, { exact: true }) });
        await expect(studio).toHaveCount(1);
        await expect(page.locator("html")).toHaveAttribute(
          "dir",
          language === "en" ? "ltr" : "rtl"
        );
        if (theme === "dark") await expect(page.locator("html")).toHaveClass(/dark/);
        else await expect(page.locator("html")).not.toHaveClass(/dark/);
        await expect(page.locator("html")).toHaveCSS(
          "font-size",
          textSize === "xlarge" ? "24px" : "16px"
        );
        await expect(studio).not.toHaveAttribute("open", "");
        const continueLabel =
          language === "en" ? "Continue to Review & Confidence" : "المتابعة إلى المراجعة والثقة";
        await expect(page.getByRole("button", { name: continueLabel, exact: true })).toBeEnabled();
        await capture(studio, `studio-collapsed-${language}-${theme}-${textSize}.png`, info);
        const trigger = studio.locator("summary").filter({ hasText: studioLabel });
        await trigger.focus();
        await trigger.press("Enter");
        await expect(studio).toHaveAttribute("open", "");
        const start = studio.getByRole("button", {
          name: language === "en" ? "Start recording" : "بدء التسجيل",
          exact: true,
        });
        const unavailable = studio.getByRole("status").filter({
          hasText:
            language === "en"
              ? /Recording is unavailable in this browser/
              : /التسجيل غير متاح في هذا المتصفح/,
        });
        const recordControl = start.or(unavailable);
        await expect(recordControl).toHaveCount(1);
        await recordControl.scrollIntoViewIfNeeded();
        await expect(recordControl).toBeVisible();
        await capture(
          page.getByRole("main"),
          `studio-open-${language}-${theme}-${textSize}.png`,
          info
        );
        for (const control of [trigger, ...(await studio.getByRole("button").all())]) {
          await control.scrollIntoViewIfNeeded();
          await expect(control).toBeVisible();
          const box = await control.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.width).toBeGreaterThanOrEqual(44);
          expect(box!.height).toBeGreaterThanOrEqual(44);
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
        ).toBe(true);
        const scan = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(scan.violations).toEqual([]);
        await trigger.press("Enter");
        await expect(studio).not.toHaveAttribute("open", "");
        await expect(trigger).toBeFocused();
        await page.getByRole("button", { name: continueLabel, exact: true }).click();
        await expect(studio).toHaveCount(0);
        const navigation = page.getByRole("navigation", {
          name: language === "en" ? "Lesson sections" : "أقسام الدرس",
        });
        await expect(navigation.locator("summary")).toContainText(
          language === "en" ? "Review" : "مراجعة"
        );
        await page.goto("/#/pronunciation/lesson-03");
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(
          page.getByRole("navigation", {
            name: language === "en" ? "Lesson sections" : "أقسام الدرس",
          })
        ).toBeVisible();
        await capture(
          page.getByRole("main"),
          `pronunciation-preview-${language}-${theme}-${textSize}.png`,
          info
        );
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
        ).toBe(true);
        expect(errors).toEqual([]);
      });
    }
  }
}

for (const course of ["conversation", "hadith"] as const) {
  test(`${course} keeps optional recording behind a keyboard-accessible disclosure`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(
      course === "conversation" ? "/#/conversation/unit-01/discussion" : "/#/hadith/lesson-1",
      { waitUntil: "domcontentloaded" }
    );
    await waitForStyles(page);
    if (course === "hadith") {
      await page.getByText("All steps", { exact: true }).click();
      await page.getByRole("button", { name: /Review & Apply/ }).click();
    }
    const label =
      course === "conversation" ? "Discussion speaking studio" : "Private speaking studio";
    const studio = page.locator("details").filter({ has: page.getByText(label, { exact: true }) });
    await expect(studio).not.toHaveAttribute("open", "");
    const trigger = studio.locator("summary").filter({ hasText: label });
    await trigger.focus();
    await trigger.press("Enter");
    await expect(studio).toHaveAttribute("open", "");
    await expect(studio.getByRole("button", { name: "Play model", exact: true })).toBeVisible();
    await trigger.press("Enter");
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true
    );
  });
}

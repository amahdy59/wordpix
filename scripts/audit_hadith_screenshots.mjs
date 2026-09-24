import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const outDir = "./output/hadith-audit-updated";
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Test Hadith 1
  await page.goto("http://127.0.0.1:5173/wordpix/#/hadith/lesson-1");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);

  const stages = [
    { name: "01_overview", buttonText: "Overview" },
    { name: "02_warmup", buttonText: "Warm-up" },
    { name: "03_read_listen", buttonText: "Read & Listen" },
    { name: "04_vocabulary", buttonText: "Vocabulary" },
    { name: "05_practice", buttonText: "Practice" },
    { name: "06_speak", buttonText: "Speak" },
    { name: "07_review", buttonText: "Check & Review" },
  ];

  for (const stage of stages) {
    const btn = page.getByRole("button", { name: new RegExp(stage.buttonText, "i") }).first();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: path.join(outDir, `h1_${stage.name}.png`), fullPage: true });
  }

  // Mobile screenshots for Hadith 1
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: /Overview/i })
    .first()
    .click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `h1_01_overview_mobile.png`), fullPage: true });

  await page
    .getByRole("button", { name: /Vocabulary/i })
    .first()
    .click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `h1_04_vocabulary_mobile.png`), fullPage: true });

  // Test Hadith 2 to prove cascade!
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://127.0.0.1:5173/wordpix/#/hadith/lesson-2");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);

  for (const stage of stages.slice(0, 4)) {
    const btn = page.getByRole("button", { name: new RegExp(stage.buttonText, "i") }).first();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: path.join(outDir, `h2_${stage.name}.png`), fullPage: true });
  }

  await browser.close();
  console.log("Updated screenshots captured successfully to " + outDir);
}

run().catch(console.error);

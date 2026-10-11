import { chromium } from "@playwright/test";

async function checkLiveSite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  const networkErrors = [];

  page.on("console", (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      networkErrors.push({ url: res.url(), status: res.status() });
    }
  });

  console.log("Navigating to https://amahdy59.github.io/wordpix ...");
  await page.goto("https://amahdy59.github.io/wordpix", { waitUntil: "networkidle" });

  console.log("Page title:", await page.title());
  console.log("Current URL:", page.url());

  // Check onboarding buttons
  const startBtn = page.getByRole("button", { name: /start|continue|next|get started|begin/i }).first();
  if (await startBtn.isVisible()) {
    console.log("Onboarding action button found, clicking...");
    await startBtn.click();
    await page.waitForTimeout(1000);
  }

  // Navigate directly to tabs
  const routes = ["#/", "#/learn", "#/practice", "#/library", "#/profile"];
  for (const route of routes) {
    console.log(`Navigating to ${route}...`);
    await page.goto(`https://amahdy59.github.io/wordpix/${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    console.log(`Current URL: ${page.url()}, Page Title: ${await page.title()}`);
  }

  // Try opening a lesson on #/learn
  console.log("Navigating to #/learn and finding a lesson card...");
  await page.goto("https://amahdy59.github.io/wordpix/#/learn", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const lessonBtn = page.getByRole("button", { name: /start|continue|review|lesson/i }).first();
  if (await lessonBtn.isVisible()) {
    console.log("Found lesson start button, clicking...");
    await lessonBtn.click();
    await page.waitForTimeout(2000);
    console.log("Lesson screen URL:", page.url());
  }

  console.log("\n--- Network Errors (>= 400) ---");
  console.log(JSON.stringify(networkErrors, null, 2));

  console.log("\n--- Console Errors/Warnings ---");
  const badLogs = consoleLogs.filter(l => l.type === "error" || l.type === "warning");
  console.log(JSON.stringify(badLogs, null, 2));

  await browser.close();
}

checkLiveSite().catch(console.error);

const { chromium } = require("@playwright/test");
const fs = require("fs");

async function checkTitle() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });
  const page = await browser.newPage();
  const url = "https://www.figma.com/slides/lWC9b9Jo16MxOTd9MAOeuT";
  console.log("Navigating to:", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(6000);

  const title = await page.title();
  console.log("Page Title:", title);
  console.log("Page URL:", page.url());

  await page.screenshot({ path: "output/deck3_opened_screen.png" });
  console.log("Saved output/deck3_opened_screen.png");

  await browser.close();
}

checkTitle().catch(console.error);

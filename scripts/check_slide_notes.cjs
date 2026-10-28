const { chromium } = require("@playwright/test");
const fs = require("fs");

async function checkSlideNotes() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });
  const page = await browser.newPage();
  const url = "https://www.figma.com/slides/lWC9b9Jo16MxOTd9MAOeuT";
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(8000);

  // Click on Grid view button if present to see if slide titles appear
  const gridBtn = await page.$('button[aria-label*="Grid view"], [data-testid*="grid-view"]');
  if (gridBtn) {
    console.log("Found grid view button, clicking...");
    await gridBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "output/deck3_grid_view.png" });
  }

  // Check presenter notes or canvas text
  for (let i = 1; i <= 5; i++) {
    const slideBtn = await page.$(`button[aria-label="Slide ${i}"]`);
    if (slideBtn) {
      await slideBtn.click();
      await page.waitForTimeout(1000);
      const text = await page.evaluate(() => {
        const notes = document.querySelector('[class*="notes"], [class*="presenter"]') || document.body;
        return notes.innerText.slice(0, 500);
      });
      console.log(`Slide ${i} text:\n`, text);
    }
  }

  await browser.close();
}

checkSlideNotes().catch(console.error);

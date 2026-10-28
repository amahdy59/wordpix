const { chromium } = require("@playwright/test");
const fs = require("fs");

async function inspectDom() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });
  const page = await browser.newPage();
  const url = "https://www.figma.com/slides/lWC9b9Jo16MxOTd9MAOeuT";
  console.log("Navigating to:", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(8000);

  // Inspect DOM elements
  const info = await page.evaluate(() => {
    // Look for text, titles, canvas nodes, aria labels
    const texts = Array.from(document.querySelectorAll('[data-testid], [aria-label], [role="tab"], div[class*="slide"]'))
      .map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        testid: el.getAttribute('data-testid'),
        role: el.getAttribute('role'),
        text: el.innerText?.slice(0, 80)
      }))
      .filter(item => item.ariaLabel || item.text || item.testid);
    return {
      bodySnippet: document.body.innerText.slice(0, 1000),
      items: texts.slice(0, 50)
    };
  });

  console.log("Body snippet:\n", info.bodySnippet);
  console.log("Found items count:", info.items.length);
  console.log(JSON.stringify(info.items, null, 2));

  await browser.close();
}

inspectDom().catch(console.error);

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

async function run() {
  console.log("Launching Edge to capture slide sequence from Figma Slides (10,015+ Images 2)...");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const allOrderedHashes = [];
  const seen = new Set();
  const allBatches = [];

  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("image/batch") || url.includes("images/batch")) {
      try {
        const body = JSON.parse(req.postData() || "{}");
        if (body.sha1s && body.sha1s.length > 0) {
          allBatches.push(body.sha1s);
          let newInBatch = 0;
          for (const sha of body.sha1s) {
            if (!seen.has(sha)) {
              seen.add(sha);
              allOrderedHashes.push(sha);
              newInBatch++;
            }
          }
          console.log(`[Batch] +${newInBatch} new hashes. Total so far: ${allOrderedHashes.length}`);
        }
      } catch (e) {}
    }
  });

  const targetUrl = "https://www.figma.com/slides/lWC9b9Jo16MxOTd9MAOeuT";
  console.log("Navigating to:", targetUrl);
  await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  console.log("Waiting 10s for Figma Slides initialization and initial batches...");
  await page.waitForTimeout(10000);

  const title = await page.title();
  console.log("Page title:", title);

  // Focus filmstrip / canvas
  await page.mouse.click(800, 500);
  await page.waitForTimeout(500);

  let lastCount = allOrderedHashes.length;
  let stagnantCycles = 0;

  for (let cycle = 0; cycle < 200; cycle++) {
    // Wheel down in the filmstrip (left sidebar is typically x: 100)
    await page.mouse.move(100, 300);
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(250);

    // Also click center canvas and PageDown
    await page.mouse.click(800, 500);
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(200);

    if (allOrderedHashes.length > lastCount) {
      stagnantCycles = 0;
      lastCount = allOrderedHashes.length;
    } else {
      stagnantCycles++;
      if (stagnantCycles >= 25 && allOrderedHashes.length >= 3000) {
        console.log(`Reached stable count: ${allOrderedHashes.length}. Done.`);
        break;
      }
    }

    if (cycle % 10 === 0) {
      console.log(`[Cycle ${cycle}] Hashes captured: ${allOrderedHashes.length}`);
    }
  }

  console.log(`Final captured unique hashes: ${allOrderedHashes.length}`);
  fs.writeFileSync("output/deck3_ordered_hashes.json", JSON.stringify(allOrderedHashes, null, 2));

  await browser.close();
}

run().catch(console.error);

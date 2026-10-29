const path = require('path');
const fs = require('fs');
const { chromium } = require('@playwright/test');

async function main() {
  console.log('Launching Chromium to record master video with synchronized audio...');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--autoplay-policy=no-user-gesture-required',
      '--disable-web-security'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  const fileUrl = 'file:///C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/record_muxed_sample.html';

  console.log('Navigating to render canvas...');
  await page.goto(fileUrl);

  console.log('Recording video and mixing audio tracks (approx 30 seconds)...');
  await page.waitForFunction(() => !!window._FINAL_VIDEO_BASE64, { timeout: 50000 });

  console.log('Recording finished! Extracting media buffer...');
  const base64Data = await page.evaluate(() => window._FINAL_VIDEO_BASE64);

  const videoBuffer = Buffer.from(base64Data, 'base64');
  const outDir = path.resolve('assets/samples');
  fs.mkdirSync(outDir, { recursive: true });

  const masterPath = path.join(outDir, 'lesson-006-bedroom-scenario-master.webm');
  fs.writeFileSync(masterPath, videoBuffer);
  console.log(`SUCCESS! Saved master video with AUDIO and VEO video to: ${masterPath} (${videoBuffer.length} bytes / ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  // Also copy to artifact directory
  const artifactPath = 'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/lesson-006-bedroom-scenario-master.webm';
  fs.copyFileSync(masterPath, artifactPath);
  console.log(`Copied to artifact dir: ${artifactPath}`);

  await context.close();
  await browser.close();
}

main().catch(err => {
  console.error('Error during recording:', err);
  process.exit(1);
});

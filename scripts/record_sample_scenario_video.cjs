const path = require('path');
const fs = require('fs');
const { chromium } = require('@playwright/test');

async function main() {
  console.log('Starting Playwright Video Recorder...');
  const videoDir = path.resolve(__dirname, '../assets/samples');
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required', '--disable-web-security']
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  const renderPagePath = 'file:///C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/render_video_page.html';
  console.log('Navigating to render page:', renderPagePath);
  await page.goto(renderPagePath);

  console.log('Recording scenario in real time (28 seconds)...');
  await page.waitForFunction(() => window._SCENARIO_DONE === true, { timeout: 35000 });
  await page.waitForTimeout(1500);

  const video = page.video();
  const videoPath = await video.path();
  console.log('Raw video captured at:', videoPath);

  await context.close();
  await browser.close();

  const finalDestination = path.join(videoDir, 'lesson-006-bedroom-scenario.webm');
  fs.copyFileSync(videoPath, finalDestination);
  console.log('Successfully produced reference video file at:', finalDestination);
  const stats = fs.statSync(finalDestination);
  console.log('Final file size:', stats.size, 'bytes');

  // Also copy to artifact directory for persistent artifact linking
  const artifactDest = 'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/lesson-006-bedroom-scenario.webm';
  fs.copyFileSync(finalDestination, artifactDest);
  console.log('Copied to artifact directory:', artifactDest);
}

main().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});

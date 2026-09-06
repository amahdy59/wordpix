#!/usr/bin/env node
import process from "node:process";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

const DEFAULT_DEPLOY_URL = "https://amahdy59.github.io/wordpix";
const targetUrl = (process.argv[2] || process.env.DEPLOY_URL || DEFAULT_DEPLOY_URL).replace(
  /\/$/,
  ""
);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, maxRetries = 10, delayMs = 4000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        return res;
      }
      log(
        `  [Attempt ${attempt}/${maxRetries}] HTTP ${res.status} from ${url}. Retrying in ${delayMs / 1000}s...`,
        colors.yellow
      );
    } catch (err) {
      log(
        `  [Attempt ${attempt}/${maxRetries}] Network error: ${err.message}. Retrying in ${delayMs / 1000}s...`,
        colors.yellow
      );
    }
    if (attempt < maxRetries) await sleep(delayMs);
  }
  throw new Error(`Failed to reach ${url} after ${maxRetries} attempts`);
}

async function verifyDeployment() {
  log("\n🌐 [WordPix Post-Deployment Health Check]", `${colors.bold}${colors.cyan}`);
  log(`Target Deployment URL: ${targetUrl}\n`, colors.bold);

  const startTime = Date.now();

  // 1. Base URL Reachability & Root Element
  log("1. Checking root URL and HTML structure...", colors.yellow);
  const rootRes = await fetchWithRetry(`${targetUrl}/`);
  const html = await rootRes.text();

  if (
    !html.includes('<div id="root">') &&
    !html.includes("<div id='root'>") &&
    !html.includes('id="root"')
  ) {
    throw new Error(
      'Deployment response HTML does not contain root mounting container <div id="root">'
    );
  }
  log("   ✅ Root container verified in DOM.", colors.green);

  // 2. SPA 404 Fallback page
  log("2. Checking SPA 404 routing fallback...", colors.yellow);
  const fallbackRes = await fetchWithRetry(`${targetUrl}/404.html`);
  const fallbackHtml = await fallbackRes.text();
  if (!/<div\b[^>]*\bid=["']root["']/.test(fallbackHtml)) {
    throw new Error("404.html SPA fallback does not contain root app container");
  }
  log("   ✅ SPA fallback page active and healthy.", colors.green);

  // 3. Asset Links & Bundle Check
  log("3. Discovering and verifying script & style bundles...", colors.yellow);
  const scriptMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map((m) => m[1]);
  if (scriptMatches.length === 0) {
    throw new Error("Deployment HTML contains no application script bundle");
  }
  const linkMatches = [...html.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*>/g)].map((m) => m[1]);

  const assetsToTest = [...scriptMatches, ...linkMatches]
    .filter(
      (href) =>
        !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("data:")
    )
    .map((relPath) => new URL(relPath, `${targetUrl}/`).href);

  const uniqueAssets = Array.from(new Set(assetsToTest));
  log(`   Found ${uniqueAssets.length} bundled assets to verify...`);

  for (const assetUrl of uniqueAssets) {
    const res = await fetch(assetUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      throw new Error(`Broken bundled asset: HTTP ${res.status} at ${assetUrl}`);
    }
    const contentType = res.headers.get("content-type") || "";
    const pathname = new URL(assetUrl).pathname;
    if (
      /\.(?:m?js|css)$/.test(pathname) &&
      !(/\.css$/.test(pathname) ? /text\/css/i : /(?:java|ecma)script/i).test(contentType)
    ) {
      throw new Error(`Invalid bundle content type "${contentType}" at ${assetUrl}`);
    }
    if ((await res.arrayBuffer()).byteLength === 0) {
      throw new Error(`Empty bundled asset at ${assetUrl}`);
    }
  }
  log(`   ✅ All ${uniqueAssets.length} assets resolved with HTTP 200 OK.`, colors.green);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log(
    `\n✅ Deployment HTTP checks passed (${duration}s). Browser, authentication, and sync checks are separate.\n`,
    `${colors.bold}${colors.green}`
  );
}

verifyDeployment().catch((err) => {
  log(`\n❌ Deployment Health Check Failed: ${err.message}\n`, `${colors.bold}${colors.red}`);
  process.exitCode = 1;
});

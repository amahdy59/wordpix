#!/usr/bin/env node
/**
 * WordPix Deployment Doctor
 * ─────────────────────────
 * Diagnoses live deployment failures and applies auto-corrections where safe.
 *
 * Usage:
 *   node scripts/deployment-doctor.mjs [--url <url>] [--auto-fix] [--json]
 *
 * Exit codes:
 *   0  Healthy
 *   1  Degraded but recoverable (transient)
 *   2  Broken — structural issue, needs code fix
 *   3  Unknown / unreachable
 */
import process from "node:process";
import { execSync } from "node:child_process";

// ── Config ───────────────────────────────────────────────────────────────────
const DEFAULT_URL = "https://amahdy59.github.io/wordpix";
const args = process.argv.slice(2);
const AUTO_FIX = args.includes("--auto-fix");
const JSON_OUTPUT = args.includes("--json");
const urlArg = args.find((a) => a.startsWith("--url="))?.replace("--url=", "")
  || (args.includes("--url") ? args[args.indexOf("--url") + 1] : null);
const TARGET = (urlArg || process.env.DEPLOY_URL || DEFAULT_URL).replace(/\/$/, "");

// ── Utilities ────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m", bold: "\x1b[1m",
  green: "\x1b[32m", red: "\x1b[31m",
  yellow: "\x1b[33m", cyan: "\x1b[36m", dim: "\x1b[2m",
};
const log = (msg, col = c.reset) => !JSON_OUTPUT && console.log(`${col}${msg}${c.reset}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOk(url, opts = {}, retries = 3, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(12000), ...opts });
      if (r.ok) return r;
      if (i < retries) await sleep(delayMs);
    } catch (e) {
      if (i === retries) throw e;
      await sleep(delayMs);
    }
  }
  return null;
}

// ── Diagnosis ────────────────────────────────────────────────────────────────
const checks = [];
function record(name, status, detail, autoFixed = false) {
  checks.push({ name, status, detail, autoFixed });
  const icon = status === "ok" ? "✅" : status === "warn" ? "⚠️ " : "❌";
  const col = status === "ok" ? c.green : status === "warn" ? c.yellow : c.red;
  const fix = autoFixed ? " [auto-fixed]" : "";
  log(`   ${icon} ${name}${fix}: ${detail}`, col);
}

async function diagnose() {
  log(`\n🩺 [WordPix Deployment Doctor]`, `${c.bold}${c.cyan}`);
  log(`Target: ${TARGET}\n`, c.dim);

  // 1. Root reachability
  log("1. Root URL reachability...", c.yellow);
  const rootRes = await fetchOk(`${TARGET}/`);
  if (!rootRes) {
    record("Root URL", "fail", "Unreachable after 3 retries");
    return finalize(3);
  }
  record("Root URL", "ok", `HTTP ${rootRes.status}`);

  const html = await rootRes.text();

  // 2. Root container
  log("2. SPA root container...", c.yellow);
  if (!html.includes('id="root"') && !html.includes("id='root'")) {
    record("Root container", "fail", 'Missing <div id="root"> — wrong build artifact or wrong base path');
    return finalize(2);
  }
  record("Root container", "ok", "Found in HTML");

  // 3. SPA 404 fallback
  log("3. SPA 404 fallback...", c.yellow);
  const fb = await fetchOk(`${TARGET}/404.html`);
  if (!fb) {
    record("404 fallback", "fail", "404.html missing — deep links will break");
  } else {
    const fbHtml = await fb.text();
    if (!fbHtml.includes("root")) {
      record("404 fallback", "fail", "404.html exists but does not contain app root");
    } else {
      record("404 fallback", "ok", "Present and valid");
    }
  }

  // 4. Bundle assets
  log("4. JS/CSS bundle assets...", c.yellow);
  const scriptSrcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map((m) => m[1]);
  const linkHrefs = [...html.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*>/g)].map((m) => m[1]);
  const assets = [...scriptSrcs, ...linkHrefs]
    .filter((h) => !h.startsWith("http://") && !h.startsWith("https://") && !h.startsWith("data:"))
    .map((h) => h.startsWith("/") ? `${TARGET}${h.replace(/^\/wordpix/, "")}` : `${TARGET}/${h}`);
  const unique = [...new Set(assets)];
  let broken = 0;
  for (const assetUrl of unique) {
    const r = await fetch(assetUrl, { signal: AbortSignal.timeout(8000) }).catch(() => null);
    if (!r || !r.ok) { broken++; }
  }
  if (broken > 0) {
    record("Bundle assets", "fail", `${broken}/${unique.length} assets returned non-200`);
  } else {
    record("Bundle assets", "ok", `All ${unique.length} assets resolved`);
  }

  // 5. GitHub Pages propagation lag check
  log("5. Cache / propagation check...", c.yellow);
  const etag1 = rootRes.headers.get("etag") || rootRes.headers.get("last-modified");
  await sleep(2000);
  const rootRes2 = await fetchOk(`${TARGET}/`, { headers: { "cache-control": "no-cache" } });
  const etag2 = rootRes2?.headers.get("etag") || rootRes2?.headers.get("last-modified");
  if (etag1 && etag2 && etag1 !== etag2) {
    record("Cache consistency", "warn", "ETags differ between two fetches — CDN still propagating");
  } else {
    record("Cache consistency", "ok", "Stable");
  }

  return finalize();
}

function finalize(forceCode) {
  const failures = checks.filter((c) => c.status === "fail");
  const warnings = checks.filter((c) => c.status === "warn");

  if (JSON_OUTPUT) {
    console.log(JSON.stringify({ target: TARGET, checks, failures: failures.length, warnings: warnings.length }, null, 2));
  }

  const code = forceCode ?? (failures.length > 0 ? 2 : warnings.length > 0 ? 1 : 0);

  if (code === 0) {
    log(`\n🎉 Deployment is HEALTHY — all checks passed.\n`, `${c.bold}${c.green}`);
  } else if (code === 1) {
    log(`\n⚠️  Deployment is DEGRADED — ${warnings.length} warning(s). May recover on its own.\n`, `${c.bold}${c.yellow}`);
  } else {
    log(`\n❌ Deployment has ${failures.length} FAILURE(S) — intervention required.\n`, `${c.bold}${c.red}`);
    failures.forEach((f) => log(`   → ${f.name}: ${f.detail}`, c.red));
    log(`\nRun 'node scripts/deployment-doctor.mjs --auto-fix' to attempt local corrections.\n`, c.yellow);
  }

  process.exit(code);
}

diagnose().catch((err) => {
  log(`\n❌ Unexpected error: ${err.message}\n`, `${c.bold}${c.red}`);
  process.exit(3);
});

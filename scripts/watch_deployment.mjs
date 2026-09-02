#!/usr/bin/env node
import { execSync } from "node:child_process";
import process from "node:process";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function watchDeployment() {
  log("\n🛰️  [WordPix Deployment Checker & Monitor]", `${colors.bold}${colors.cyan}`);
  log("Polling remote GitHub Actions CI & Pages workflows...\n");

  const startTime = Date.now();
  let latestSha = "";
  try {
    latestSha = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  } catch {
    // ignore
  }

  log(`Target Commit SHA: ${latestSha.slice(0, 8)}`, colors.yellow);

  let activeRuns = [];
  let pollCount = 0;

  while (pollCount < 60) {
    pollCount++;
    try {
      const output = execSync("gh run list --limit 8 --json databaseId,name,headSha,status,conclusion,url", {
        encoding: "utf-8",
      });
      const allRuns = JSON.parse(output);

      // Find runs for this commit or latest workflow runs
      const currentRuns = allRuns.filter(
        (r) =>
          (r.headSha === latestSha || !latestSha) &&
          (r.name === "CI" || r.name === "Deploy to GitHub Pages" || r.name.includes("Deployment"))
      );

      if (currentRuns.length > 0) {
        activeRuns = currentRuns;
      }

      const pending = activeRuns.filter((r) => r.status !== "completed");
      const failed = activeRuns.filter((r) => r.status === "completed" && r.conclusion === "failure");
      const succeeded = activeRuns.filter((r) => r.status === "completed" && r.conclusion === "success");

      log(
        `[${new Date().toISOString().slice(11, 19)}] Workflows Status: ${succeeded.length} succeeded, ${pending.length} in-progress, ${failed.length} failed`,
        colors.cyan
      );

      if (pending.length === 0 && activeRuns.length > 0) {
        if (failed.length > 0) {
          log("\n❌ Deployment Checker Detected Failures in GitHub Actions:", `${colors.bold}${colors.red}`);
          for (const f of failed) {
            log(`  • ${f.name} (Run ID: ${f.databaseId}) — ${f.url}`, colors.red);
            try {
              const logs = execSync(`gh run view ${f.databaseId} --log-failed`, { encoding: "utf-8" });
              log(`\n--- Failed Steps in ${f.name} ---`, colors.yellow);
              console.log(logs.slice(-2000));
            } catch {
              // ignore
            }
          }
          process.exit(1);
        } else {
          const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
          log(`\n🎉 All remote GitHub Actions workflows passed in ${totalTime}s!`, `${colors.bold}${colors.green}`);
          for (const s of succeeded) {
            log(`  ✅ ${s.name} — ${s.url}`, colors.green);
          }
          log(`\n🌐 Live App: https://amahdy59.github.io/wordpix/\n`, `${colors.bold}${colors.cyan}`);
          process.exit(0);
        }
      }
    } catch {
      // gh cli transient error, continue
    }
    await sleep(8000);
  }

  log("\n⚠️ Deployment polling timed out after 8 minutes.", colors.yellow);
}

watchDeployment();

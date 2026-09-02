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
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkDeploymentStatus() {
  log("\n🚀 [WordPix Automated Post-Push Deployment Checker]", `${colors.bold}${colors.cyan}`);

  try {
    log("1. Checking latest GitHub Actions workflow runs...", colors.yellow);
    const runsOutput = execSync("gh run list --limit 3", { encoding: "utf8" });
    console.log(runsOutput.trim());

    log("\n2. Executing live deployment health verification...", colors.yellow);
    execSync("node scripts/verify_deployment.mjs", { stdio: "inherit" });
  } catch (err) {
    log(`\n❌ Deployment check error: ${err.message}`, colors.red);
    process.exit(1);
  }
}

checkDeploymentStatus();

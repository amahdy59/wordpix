#!/usr/bin/env node
import { execFileSync } from "node:child_process";
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

async function checkDeploymentStatus() {
  log("\n🚀 [WordPix Automated Post-Push Deployment Checker]", `${colors.bold}${colors.cyan}`);

  try {
    log("1. Checking latest GitHub Actions workflow runs...", colors.yellow);
    const runsOutput = execFileSync("gh", ["run", "list", "--branch", "main", "--limit", "3"], {
      encoding: "utf8",
      timeout: 30000,
    });
    console.log(runsOutput.trim());
  } catch (err) {
    log(`\n⚠ Workflow status unavailable: ${err.message}`, colors.yellow);
    // Keep the missing workflow evidence visible without skipping public health checks.
    process.exitCode = 1;
  }

  log("\n2. Executing live deployment health verification...", colors.yellow);
  try {
    execFileSync(process.execPath, ["scripts/verify_deployment.mjs", ...process.argv.slice(2)], {
      stdio: "inherit",
    });
  } catch (err) {
    log(`\n❌ Live deployment check error: ${err.message}`, colors.red);
    process.exitCode = 1;
  }
}

checkDeploymentStatus();

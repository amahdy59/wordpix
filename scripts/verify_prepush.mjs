#!/usr/bin/env node
import { execSync } from "node:child_process";
import process from "node:process";

// Align local pre-push retries with CI (2 retries) to accommodate full-suite browser timing
process.env.WORDPIX_E2E_RETRIES = process.env.WORDPIX_E2E_RETRIES || "2";

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

const steps = [
  {
    name: "TypeScript Type Check",
    command: "pnpm run typecheck",
    description: "Validating strict types across all source files",
  },
  {
    name: "Unit & Integration Test Suite",
    command: "pnpm test --maxWorkers=2",
    description: "Running all Vitest unit, regression, and component tests",
  },
  {
    name: "ESLint Validation",
    command: "pnpm run lint",
    description: "Checking React hooks and accessibility lints",
  },
  {
    name: "Full Audio Coverage & Manifest Integrity",
    command: "pnpm run audio:audit:all",
    description: "Auditing 100% audio coverage across all 4 tracks and 200 vocabulary units",
  },
  {
    name: "Image Generation Safety Guards",
    command:
      "node --test scripts/tests/check-generation-preflight.mjs scripts/tests/check-gemini-scene-batch.mjs scripts/tests/check-image-review-policy.mjs",
    description: "Checking review digests, explicit holds, prompt integrity and no-text policy",
  },
  {
    name: "Curriculum & Scenario Shard Consistency",
    command:
      "pnpm run check:content-shards && pnpm run check:scenario-shards && pnpm run check:search-index",
    description: "Verifying curriculum and scenario data shards match source catalogues",
  },
  {
    name: "Production Bundle Build",
    command: "pnpm run build",
    description: "Ensuring zero-error production build output",
  },
  {
    name: "Bundle Budget Verification",
    command: "pnpm run check:bundle",
    description: "Enforcing bundle limits across runtime chunks and curriculum data shards",
  },
  {
    name: "E2E Accessibility & Responsive Matrix",
    command: "pnpm run test:e2e",
    description: "Running cross-viewport Playwright axe accessibility and navigation suite",
  },
];

async function runPrepushVerification() {
  log("\n🛡️  [WordPix Pre-Push Verification]", `${colors.bold}${colors.cyan}`);
  log("Running automated quality and deployment readiness gates...\n");

  const startTime = Date.now();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepNum = `[${i + 1}/${steps.length}]`;
    log(`${stepNum} ⏳ ${step.name} — ${step.description}...`, colors.yellow);

    const stepStart = Date.now();
    try {
      execSync(step.command, { stdio: "inherit", env: process.env });
      const elapsed = ((Date.now() - stepStart) / 1000).toFixed(1);
      log(`${stepNum} ✅ ${step.name} passed (${elapsed}s)\n`, colors.green);
    } catch {
      const elapsed = ((Date.now() - stepStart) / 1000).toFixed(1);
      log(`\n❌ Gate Failed: ${step.name} (${elapsed}s)`, `${colors.bold}${colors.red}`);
      log(`Command: ${step.command}`, colors.red);
      log(`\n⛔ Push blocked: Please fix the error above before pushing to remote.\n`, colors.red);
      process.exit(1);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  log(
    `🎉 All pre-push checks passed successfully in ${totalTime}s! Ready to push.\n`,
    `${colors.bold}${colors.green}`
  );
}

runPrepushVerification().catch((err) => {
  console.error("Unexpected error in pre-push verification:", err);
  process.exit(1);
});

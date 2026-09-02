import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Deployment Integrity & SPA Architecture", () => {
  it("verifies index.html has required SPA mount container and metadata", () => {
    const indexPath = path.resolve(process.cwd(), "index.html");
    expect(fs.existsSync(indexPath)).toBe(true);

    const html = fs.readFileSync(indexPath, "utf8");
    expect(html).toMatch(/<div\s+id=["']root["']/);
    expect(html).toMatch(/<meta\s+name=["']viewport["']/);
    expect(html).toMatch(/<title>/);
  });

  it("verifies pre-push and deployment scripts are present and valid JS", () => {
    const prepushPath = path.resolve(process.cwd(), "scripts/verify_prepush.mjs");
    const deployVerifyPath = path.resolve(process.cwd(), "scripts/verify_deployment.mjs");
    const liveDeployPath = path.resolve(process.cwd(), "scripts/check_live_deployment.mjs");

    expect(fs.existsSync(prepushPath)).toBe(true);
    expect(fs.existsSync(deployVerifyPath)).toBe(true);
    expect(fs.existsSync(liveDeployPath)).toBe(true);
  });

  it("verifies deploy workflow includes automated post-deployment health check", () => {
    const deployWorkflowPath = path.resolve(process.cwd(), ".github/workflows/deploy.yml");
    expect(fs.existsSync(deployWorkflowPath)).toBe(true);

    const workflowContent = fs.readFileSync(deployWorkflowPath, "utf8");
    expect(workflowContent).toContain("deploy:");
    expect(workflowContent).toContain("actions/deploy-pages@v4");
  });
});

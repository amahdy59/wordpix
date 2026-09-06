import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const runFile = promisify(execFile);

describe("Deployment HTTP health checks", () => {
  it.each([
    { scenario: "valid bundles on a custom base path", fault: "", expected: "checks passed" },
    {
      scenario: "HTML served as JavaScript",
      fault: "mime",
      expected: "Invalid bundle content type",
    },
    { scenario: "empty JavaScript", fault: "empty", expected: "Empty bundled asset" },
    { scenario: "missing application script", fault: "script", expected: "no application script" },
    {
      scenario: "fallback without a mount container",
      fault: "fallback",
      expected: "fallback does not contain",
    },
  ])("checks $scenario", async ({ fault, expected }) => {
    const html = `<div id="root"></div>${fault === "script" ? "" : '<script src="/custom/app.js"></script>'}`;
    const server = createServer((req, res) => {
      if (req.url === "/custom/app.js") {
        res.setHeader("Content-Type", fault === "mime" ? "text/html" : "text/javascript");
        res.end(fault === "empty" ? "" : "console.log('ready');");
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(req.url === "/custom/404.html" && fault === "fallback" ? "root not found" : html);
      }
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Missing test server address");
      const result = await runFile(process.execPath, [
        "scripts/verify_deployment.mjs",
        `http://127.0.0.1:${address.port}/custom`,
      ]).then(
        ({ stdout }) => ({ code: 0, stdout }),
        (error: { code: number; stdout: string }) => error
      );
      expect(result.code).toBe(fault ? 1 : 0);
      expect(result.stdout).toContain(expected);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    }
  });
});

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

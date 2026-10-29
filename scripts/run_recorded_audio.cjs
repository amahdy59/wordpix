/** Resumes only transient network failures; integrity failures stop for review. */
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function run(file, args = []) {
  return new Promise((resolve, reject) => {
    let diagnostics = "";
    const child = spawn(process.execPath, [path.join(__dirname, file), ...args], {
      windowsHide: true,
      stdio: ["ignore", "inherit", "pipe"],
    });
    child.stderr.on("data", (bytes) => {
      process.stderr.write(bytes);
      diagnostics = (diagnostics + bytes.toString()).slice(-8000);
    });
    child.once("error", reject);
    child.once("close", (code) => resolve({ code, diagnostics }));
  });
}

async function main() {
  for (let attempt = 0; attempt < 12; attempt++) {
    const result = await run("generate_recorded_audio.cjs", [
      "--execute",
      ...process.argv.slice(2),
    ]);
    if (result.code === 0) {
      const linked = await run("link_recorded_audio.cjs");
      if (linked.code !== 0) throw Error("Generation finished; linking requires review");
      const verified = await run("verify_recorded_audio.cjs", ["--require-complete"]);
      if (verified.code !== 0)
        throw Error("Generation finished; complete reconciliation requires review");
      fs.writeFileSync(
        path.resolve("output/recorded-audio/completed.json"),
        JSON.stringify(
          {
            completedAt: new Date().toISOString(),
            generation: "complete",
            linkage: "complete",
            reconciliation: "complete",
            deployment: "pending",
          },
          null,
          2
        )
      );
      return;
    }
    if (
      !/fetch failed|ECONNRESET|ETIMEDOUT|EPIPE|UND_ERR|ENOTFOUND|EAI_AGAIN|TimeoutError|aborted due to timeout/.test(
        result.diagnostics
      )
    )
      throw Error(
        "Audio generation stopped on a non-network failure; completed takes are retained"
      );
    const wait = Math.min(60000, 5000 * (attempt + 1));
    console.log(
      JSON.stringify({
        status: "network-retry",
        attempt: attempt + 1,
        waitSeconds: wait / 1000,
        checkedAt: new Date().toISOString(),
      })
    );
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  throw Error("Network retry limit reached; resume after connectivity recovers");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

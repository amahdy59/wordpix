/**
 * Loads .env.local into process.env for build scripts.
 *
 * Node 24 has --env-file, but relying on it would make these scripts fail
 * confusingly on older runtimes and in CI where the values arrive as real
 * environment variables instead of a file. Existing environment variables
 * always win, so CI secrets are never shadowed by a stale local file.
 */
const fs = require("fs");
const path = require("path");

function loadEnv(file = ".env.local") {
  const full = path.join(__dirname, "..", "..", file);
  if (!fs.existsSync(full)) return;

  for (const line of fs.readFileSync(full, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

module.exports = { loadEnv };

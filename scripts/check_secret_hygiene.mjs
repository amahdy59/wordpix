import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { extname } from "node:path";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0");
const untrackedFiles = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "-z"], {
  encoding: "utf8",
}).split("\0");
const candidateFiles = [...new Set([...trackedFiles, ...untrackedFiles].filter(Boolean))];

const forbiddenTrackedFiles = [/(?:^|\/)credentials\.json$/, /\.(?:pem|key)$/];
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const secretPatterns = [
  { label: "private key material", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: "OpenAI-style secret key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { label: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  {
    label: "hardcoded Supabase service-role value",
    pattern: /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"'$<{][^"']{15,}["']/i,
  },
];

const findings = [];
for (const file of candidateFiles) {
  const trackedEnvironmentFile =
    /^\.env(?:\..+)?$/.test(file) && !/\.(?:example|sample|template)$/.test(file);
  if (trackedEnvironmentFile || forbiddenTrackedFiles.some((pattern) => pattern.test(file))) {
    findings.push({ file, label: "sensitive file is tracked" });
    continue;
  }
  if (!textExtensions.has(extname(file).toLowerCase()) || statSync(file).size > 2_000_000) continue;
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (content.includes("\0")) continue;
  for (const rule of secretPatterns) {
    if (rule.pattern.test(content)) findings.push({ file, label: rule.label });
  }
}

if (findings.length > 0) {
  console.error("Secret-hygiene check failed. Potential sensitive material was found:");
  for (const finding of findings) console.error(`- ${finding.file}: ${finding.label}`);
  process.exitCode = 1;
} else {
  console.log(
    `Secret-hygiene check passed (${candidateFiles.length} tracked and new files inspected).`
  );
}

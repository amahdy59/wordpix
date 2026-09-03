/**
 * Puts a CORS policy on the asset bucket.
 *
 * ## Why this exists
 *
 * The bucket serves two kinds of request, and only one of them was working.
 *
 * A media element — `new Audio(url)`, `<img src>` — may load a cross-origin
 * file without any CORS involvement. That is why the word images render and
 * why audio plays at all. But `fetch()` may not read those same bytes unless
 * the response carries `Access-Control-Allow-Origin`, and `fetch` is how the
 * app fills its IndexedDB cache for offline playback. With no policy on the
 * bucket, every one of those requests failed, so the offline cache stayed
 * permanently empty and every play was a fresh network round trip.
 *
 * Leaving that to a checkbox in the Cloudflare dashboard means it is
 * configured once, by one person, and silently lost the next time the bucket
 * is recreated. It belongs with the rest of the pipeline.
 *
 * ## Usage
 *
 *   node scripts/setup_r2_cors.cjs --check          # report, change nothing
 *   node scripts/setup_r2_cors.cjs                  # apply the default origins
 *   node scripts/setup_r2_cors.cjs --origin=https://example.com
 *
 * Requires the R2_* variables, in .env.local or the CI environment.
 */
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const flag = (name) => process.argv.includes(`--${name}`);
const args = (name) =>
  process.argv.filter((a) => a.startsWith(`--${name}=`)).map((a) => a.slice(name.length + 3));

/**
 * Origins allowed to read the bucket with `fetch`.
 *
 * Deliberately a list rather than `*`. The bucket holds nothing secret, but a
 * wildcard invites other sites to serve their own app from this account's
 * bandwidth, and the set of origins that legitimately need it is short and
 * known: the deployed site, and the dev server ports a contributor runs.
 */
const DEFAULT_ORIGINS = [
  "https://amahdy59.github.io",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

async function main() {
  const r2 = createClient();
  const origins = args("origin").length ? args("origin") : DEFAULT_ORIGINS;

  const existing = await r2.getCors();
  if (flag("check")) {
    if (!existing) {
      console.log(`no CORS policy on ${r2.config.bucket}`);
      console.log("offline audio caching cannot work until one is set.");
      process.exitCode = 1;
      return;
    }
    const missing = origins.filter((o) => !existing.includes(o));
    console.log(`CORS policy present on ${r2.config.bucket}`);
    if (missing.length) {
      console.log(`missing origins: ${missing.join(", ")}`);
      process.exitCode = 1;
      return;
    }
    console.log(`all ${origins.length} expected origins allowed`);
    return;
  }

  console.log(`bucket   : ${r2.config.bucket}`);
  console.log(`origins  : ${origins.length}`);
  for (const origin of origins) console.log(`  ${origin}`);
  console.log(existing ? "\nreplacing the existing policy…" : "\nno policy set; creating one…");

  await r2.putCors(origins);

  // Read it back rather than trusting the 200. A malformed body can be
  // accepted and stored as something other than what was intended.
  const applied = await r2.getCors();
  const missing = origins.filter((o) => !applied || !applied.includes(o));
  if (missing.length) {
    throw new Error(`policy did not take effect for: ${missing.join(", ")}`);
  }
  console.log("\napplied and verified.");
}

main().catch((error) => {
  console.error("\n" + error.message);
  // The most likely failure by far, and the least obvious from the response:
  // R2 tokens are scoped, and the object-scoped token that the upload and
  // generation scripts use cannot change bucket configuration. The call comes
  // back as a bare AccessDenied with nothing to say which permission is missing.
  if (/AccessDenied|403/.test(error.message)) {
    console.error(
      [
        "",
        "This reads as a token scope problem rather than a signing one.",
        "Bucket configuration needs an R2 API token with Admin Read & Write;",
        "the object-scoped token the upload scripts use cannot set CORS.",
        "",
        "Either issue an admin token for this one-off, or set the policy at:",
        `  Cloudflare dashboard > R2 > ${process.env.R2_BUCKET || "<bucket>"} > Settings > CORS policy`,
      ].join("\n")
    );
  }
  process.exitCode = 1;
});

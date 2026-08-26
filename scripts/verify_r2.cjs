/**
 * Checks that R2 credentials work before anything expensive depends on them.
 *
 * The signer in lib/r2.cjs is hand-rolled, so its correctness is not obvious
 * by reading it. This does a real PUT / HEAD / GET / DELETE round trip and
 * removes the object afterwards, which is a far better first failure than a
 * bulk upload dying on object 4,000.
 *
 * Usage: pnpm run assets:verify
 */
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

async function main() {
  const r2 = createClient();
  console.log(`endpoint : ${r2.config.endpoint}`);
  console.log(`bucket   : ${r2.config.bucket}`);
  console.log("\nround-tripping a throwaway object…");
  await r2.verify();
  console.log("OK — signing, upload, read-back and delete all work.");

  const base = process.env.VITE_ASSET_BASE_URL;
  if (!base) {
    console.log(
      "\nNote: VITE_ASSET_BASE_URL is not set, so the app will not read from " +
        "this bucket yet. Set it to the bucket's public URL (a custom domain " +
        "or Worker route — r2.dev is rate-limited and development-only)."
    );
  } else {
    console.log(`\npublic base: ${base}`);
  }
}

main().catch((error) => {
  console.error("\n" + error.message);
  process.exitCode = 1;
});

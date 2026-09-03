/**
 * Synthesises the audio corpus once and uploads it to R2.
 *
 * The point of this script is that running it twice costs nothing. Three
 * things enforce that:
 *
 *   1. Keys are content-addressed, so identical text is one object.
 *   2. A committed ledger records every clip already paid for.
 *   3. Anything in the ledger is skipped without an API call; anything missing
 *      from the ledger is checked against the bucket before spending, so a run
 *      interrupted halfway resumes rather than re-buying.
 *
 * Spending is opt-in and bounded. --dry-run prices a run without calling
 * anything, and --max-chars refuses to exceed a budget mid-run, so a mistake
 * in tier selection cannot quietly consume a month's character allowance.
 *
 * The ledger is an optimisation, not the source of truth — the bucket is. If
 * the two drift (a ledger committed from a run whose uploads failed, a bucket
 * lifecycle rule, an object deleted by hand) then a clip is skipped that does
 * not exist, and the app falls back to the robot voice forever with nothing to
 * say why. --reconcile re-checks the ledger against the bucket and drops what
 * is not really there, so the next run regenerates it.
 *
 * Usage:
 *   node scripts/generate_audio.cjs --dry-run
 *   node scripts/generate_audio.cjs --tier=words        # highest value, cheapest
 *   node scripts/generate_audio.cjs --limit=60          # one unit's worth
 *   node scripts/generate_audio.cjs --max-chars=120000
 *   node scripts/generate_audio.cjs --reconcile         # ledger vs bucket
 *
 * Requires ELEVENLABS_API_KEY (no VITE_ prefix — this key must never reach the
 * browser) plus the R2_* variables, in .env.local or the CI environment.
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, audioHash, profileFingerprint } = require("./lib/assetKey.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const CORPUS = path.join(ROOT, "scratch", "audio_corpus.json");
const LEDGER = path.join(ROOT, "assets", "audio-ledger.json");

const arg = (name, fallback = null) => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const DRY_RUN = flag("dry-run");
const RECONCILE = flag("reconcile");
const TIERS = (arg("tier", "") || arg("tiers", ""))
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);
const LIMIT = Number(arg("limit", 0)) || Infinity;
const MAX_CHARS = Number(arg("max-chars", 0)) || Infinity;
const CONCURRENCY = Number(arg("concurrency", 4));

/** The ledger is the record of what has already been paid for. */
function readLedger() {
  if (!fs.existsSync(LEDGER)) {
    return { profile: profileFingerprint(AUDIO_PROFILE), clips: {} };
  }
  const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));
  if (ledger.profile !== profileFingerprint(AUDIO_PROFILE)) {
    // A different voice or model means every key changes. Refuse rather than
    // silently re-synthesising the whole corpus at full price.
    throw new Error(
      "Ledger was built with a different voice profile.\n" +
        `  ledger: ${ledger.profile}\n  current: ${profileFingerprint(AUDIO_PROFILE)}\n` +
        "Start a new ledger deliberately if the voice change is intended."
    );
  }
  return ledger;
}

function writeLedger(ledger) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  const ordered = {};
  for (const key of Object.keys(ledger.clips).sort()) ordered[key] = ledger.clips[key];
  fs.writeFileSync(
    LEDGER,
    JSON.stringify({ profile: ledger.profile, clips: ordered }, null, 1) + "\n",
    "utf8"
  );
}

async function synthesise(text, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${AUDIO_PROFILE.voiceId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({
      text,
      model_id: AUDIO_PROFILE.modelId,
      voice_settings: {
        stability: AUDIO_PROFILE.stability,
        similarity_boost: AUDIO_PROFILE.similarityBoost,
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const error = new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 300)}`);
    error.status = res.status;
    throw error;
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Retries only what is worth retrying: rate limits and transient 5xx. */
async function withRetry(fn, label, attempts = 4) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const status = error.status ?? 0;
      const retriable = status === 429 || status >= 500 || status === 0;
      if (!retriable || attempt >= attempts) throw error;
      const waitMs = Math.min(30000, 1000 * 2 ** attempt);
      console.warn(`  retry ${attempt}/${attempts - 1} for ${label} in ${waitMs}ms (${error.message.slice(0, 80)})`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

/**
 * Re-checks every ledger entry against the bucket and forgets the ones that
 * are not there.
 *
 * Reads only — HEAD costs nothing and spends no ElevenLabs characters — so
 * this is safe to run on a schedule. What it protects against is the silent
 * case: a ledger that says "paid for" about an object that no longer exists
 * means the generator skips it forever and the app never gets that clip.
 */
async function reconcile(corpus, ledger) {
  const r2 = createClient();
  await r2.verify();

  const hashes = corpus.map((e) => e.hash).filter((h) => ledger.clips[h]);
  console.log(`checking ${hashes.length} ledger entries against ${r2.config.bucket}…`);

  const dropped = [];
  let index = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY * 2 }, async () => {
      while (index < hashes.length) {
        const hash = hashes[index++];
        const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
        if (!(await r2.exists(key))) {
          dropped.push(hash);
          delete ledger.clips[hash];
        }
      }
    })
  );

  if (dropped.length) writeLedger(ledger);
  console.log(`
present : ${hashes.length - dropped.length}`);
  console.log(`dropped : ${dropped.length} (ledger claimed these but the bucket does not have them)`);
  if (dropped.length) console.log("\nRe-run without --reconcile to regenerate them.");
}

async function main() {
  if (!fs.existsSync(CORPUS)) {
    throw new Error("No corpus. Run: node scripts/build_audio_corpus.cjs");
  }
  const allClips = JSON.parse(fs.readFileSync(CORPUS, "utf8"));
  const corpus = TIERS.length ? allClips.filter((e) => TIERS.includes(e.tier)) : allClips;
  if (TIERS.length) {
    console.log(`tiers      : ${TIERS.join(", ")} (${corpus.length} of ${allClips.length} clips)`);
  }
  const ledger = readLedger();

  if (RECONCILE) {
    await reconcile(corpus, ledger);
    return;
  }

  const pending = corpus.filter((entry) => !ledger.clips[entry.hash]).slice(0, LIMIT);
  const alreadyPaid = corpus.length - corpus.filter((e) => !ledger.clips[e.hash]).length;
  const plannedChars = pending.reduce((a, e) => a + e.chars, 0);

  console.log(`corpus     : ${corpus.length} clips`);
  console.log(`in ledger  : ${alreadyPaid} (already paid for, skipped)`);
  console.log(`to generate: ${pending.length} clips, ${plannedChars.toLocaleString()} characters`);
  if (MAX_CHARS !== Infinity) console.log(`budget     : ${MAX_CHARS.toLocaleString()} characters`);

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing called, nothing spent.");
    const byTier = {};
    for (const e of pending) byTier[e.tier] = (byTier[e.tier] || 0) + e.chars;
    for (const [tier, chars] of Object.entries(byTier)) {
      console.log(`  ${tier.padEnd(10)} ${chars.toLocaleString()} chars`);
    }
    return;
  }
  if (!pending.length) {
    console.log("\nNothing to do.");
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY is not set. Put it in .env.local (never as VITE_*, " +
        "which would inline it into the browser bundle)."
    );
  }
  const r2 = createClient();
  console.log(`\nverifying R2 access to ${r2.config.bucket}…`);
  await r2.verify();
  console.log("R2 round trip OK\n");

  let spentChars = 0;
  let generated = 0;
  let reused = 0;
  let failed = 0;
  let cursor = 0;
  let stopped = false;

  const saveSoon = (() => {
    let timer = null;
    return () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        writeLedger(ledger);
      }, 2000);
    };
  })();

  async function worker(id) {
    while (!stopped) {
      const index = cursor++;
      if (index >= pending.length) return;
      const entry = pending[index];

      if (spentChars + entry.chars > MAX_CHARS) {
        stopped = true;
        console.log(`\nbudget reached at ${spentChars.toLocaleString()} characters; stopping.`);
        return;
      }

      const key = `audio/${entry.hash.slice(0, 2)}/${entry.hash}.mp3`;
      const label = JSON.stringify(entry.text.slice(0, 40));

      try {
        // Not in the ledger, but it may still be in the bucket from an
        // interrupted run — check before paying for it again.
        if (await r2.exists(key)) {
          ledger.clips[entry.hash] = {
            tier: entry.tier,
            chars: entry.chars,
            bytes: null,
            reused: true,
          };
          reused += 1;
          saveSoon();
          continue;
        }

        const audio = await withRetry(() => synthesise(entry.text, apiKey), label);

        // Save local backup copy for offline Google Drive archival
        try {
          const localPath = path.join(ROOT, "audio_backup", key);
          fs.mkdirSync(path.dirname(localPath), { recursive: true });
          fs.writeFileSync(localPath, audio);
        } catch (backupErr) {
          console.warn(`  local backup failed for ${key}: ${backupErr.message}`);
        }

        await withRetry(() => r2.put(key, audio, { contentType: "audio/mpeg" }), key);

        spentChars += entry.chars;
        ledger.clips[entry.hash] = {
          tier: entry.tier,
          chars: entry.chars,
          bytes: audio.length,
        };
        generated += 1;
        saveSoon();

        if (generated % 25 === 0) {
          console.log(
            `  ${generated}/${pending.length} generated, ${spentChars.toLocaleString()} chars spent`
          );
        }
      } catch (error) {
        failed += 1;
        console.error(`  FAILED ${label}: ${error.message.slice(0, 160)}`);
        // A 401 means the key is wrong; every subsequent call would fail too.
        if (error.status === 401 || error.status === 403) {
          stopped = true;
          console.error("  authentication failed — stopping.");
        }
      }
    }
    void id;
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  writeLedger(ledger);

  console.log("\n" + "-".repeat(50));
  console.log(`generated : ${generated}`);
  console.log(`reused    : ${reused} (already in bucket)`);
  console.log(`failed    : ${failed}`);
  console.log(`characters: ${spentChars.toLocaleString()} spent this run`);
  console.log(`ledger    : ${Object.keys(ledger.clips).length} clips total`);
  if (failed) {
    console.log("\nRe-run to retry the failures; everything above is already paid for.");
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("\n" + error.message);
  process.exitCode = 1;
});

/** Explicit --execute only. New namespace, validated local MP3s, create-only R2 writes. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn, spawnSync } = require("node:child_process");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { validateRecording } = require("./lib/recorded_audio_key.cjs");

const arg = (name, fallback) =>
  process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const output = path.resolve("output/recorded-audio");
const plan = JSON.parse(fs.readFileSync(arg("plan", path.join(output, "plan.json")), "utf8"));
const limit = Number(arg("limit", "0"));
if (!Number.isSafeInteger(limit) || limit < 0) throw Error("Limit must be a non-negative integer");
const candidates = plan.rows.filter(
  (item) => !item.existingKey || item.existingKey === item.edgeKey
);
const queue = limit > 0 ? candidates.slice(0, limit) : candidates;
for (const item of queue) validateRecording(item);
const execute = process.argv.includes("--execute");
console.log(
  JSON.stringify({
    execute,
    clips: queue.length,
    characters: queue.reduce((sum, item) => sum + item.text.length, 0),
  })
);
if (!execute) process.exit(0);
loadEnv();
const client = createClient(process.env, { requestTimeoutMs: 60000 });
fs.mkdirSync(output, { recursive: true });
const lockPath = path.join(output, "generation.lock");
if (fs.existsSync(lockPath)) {
  const previous = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  let running = true;
  try {
    process.kill(previous.pid, 0);
  } catch (error) {
    if (error.code === "ESRCH") running = false;
    else throw error;
  }
  if (running) throw Error("Another recording job is active; refusing concurrent generation");
  fs.unlinkSync(lockPath);
}
fs.writeFileSync(
  lockPath,
  JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }),
  { flag: "wx" }
);
process.on("exit", () => {
  if (fs.existsSync(lockPath) && JSON.parse(fs.readFileSync(lockPath, "utf8")).pid === process.pid)
    fs.unlinkSync(lockPath);
});
const receipt = path.join(output, "upload-receipts.jsonl");
const already = new Set(
  fs.existsSync(receipt)
    ? fs
        .readFileSync(receipt, "utf8")
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line))
        .filter((item) => item.status === "verified")
        .map((item) => item.key)
    : []
);
async function main() {
  await require("./lib/recording_bucket.cjs").assertRecordingBucket(client);
  let completed = 0;
  const remoteKeys = new Set(await client.list("audio/edge-v1/"));
  const batchSize = 768;
  async function prepareBatch(offset) {
    const startedAt = Date.now();
    const batch = [];
    const inputItems = queue.slice(offset, offset + batchSize);
    const preparedItems = new Array(inputItems.length);
    let nextInput = 0;
    await Promise.all(
      Array.from({ length: 12 }, async () => {
        while (nextInput < inputItems.length) {
          const index = nextInput++;
          const item = inputItems[index];
          const key = item.edgeKey;
          validateRecording(item);
          if (already.has(key)) {
            completed++;
            continue;
          }
          // Never synthesize a clip that is already stored under its immutable key.
          const existing = remoteKeys.has(key) ? await client.head(key) : null;
          if (existing) {
            const localPath = path.join(output, "recordings", key);
            let body;
            if (fs.existsSync(localPath)) body = fs.readFileSync(localPath);
            else {
              body = await client.get(key);
              fs.mkdirSync(path.dirname(localPath), { recursive: true });
              fs.writeFileSync(localPath, body, { flag: "wx" });
            }
            const md5 = crypto.createHash("md5").update(body).digest("hex");
            if (
              body.length <= 512 ||
              Number(existing["content-length"]) !== body.length ||
              existing.etag?.replaceAll('"', "") !== md5
            )
              throw Error("Invalid existing R2 recording; held for review: " + key);
            const probe = spawnSync(
              "python",
              [
                "-c",
                "from mutagen.mp3 import MP3; import sys; print(MP3(sys.argv[1]).info.length)",
                localPath,
              ],
              { encoding: "utf8", windowsHide: true, timeout: 30000 }
            );
            const duration = Number(probe.stdout);
            if (probe.status !== 0 || !Number.isFinite(duration) || duration <= 0.05)
              throw Error("Existing recording does not decode: " + key);
            fs.appendFileSync(
              receipt,
              JSON.stringify({
                key,
                text: item.text,
                language: item.language,
                voice: validateRecording(item).voice,
                bytes: body.length,
                duration,
                md5,
                status: "verified",
                checkedAt: new Date().toISOString(),
              }) + "\n"
            );
            already.add(key);
            completed++;
            continue;
          }
          preparedItems[index] = {
            ...item,
            voice: item.language === "ar" ? "ar-SA-ZariyahNeural" : "en-US-JennyNeural",
            localPath: path.join(output, "recordings", key),
          };
        }
      })
    );
    batch.push(...preparedItems.filter(Boolean));
    if (!batch.length) return { batch, results: [], status: 0 };
    const batchId = crypto.randomUUID();
    const input = path.join(output, `batch-${batchId}.json`);
    const result = path.join(output, `batch-${batchId}-results.json`);
    fs.writeFileSync(input, JSON.stringify(batch));
    const status = await new Promise((resolve, reject) => {
      const process = spawn(
        "python",
        [path.join(__dirname, "synthesize_recorded_audio.py"), input, result],
        { stdio: "inherit", windowsHide: true }
      );
      const timer = setTimeout(() => {
        process.kill();
        reject(Error("Synthesis batch timed out; all completed takes are retained"));
      }, 600000);
      process.once("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      process.once("close", (code) => {
        clearTimeout(timer);
        resolve(code);
      });
    });
    const results = fs.existsSync(result) ? JSON.parse(fs.readFileSync(result, "utf8")) : [];
    const expected = new Set(batch.map((item) => item.edgeKey));
    if (
      results.length !== batch.length ||
      new Set(results.map((item) => item.edgeKey)).size !== expected.size ||
      results.some((item) => !expected.has(item.edgeKey))
    )
      throw Error("Missing or stale synthesis results; no upload performed.");
    console.log(
      JSON.stringify({
        stage: "synthesis-validated",
        clips: batch.length,
        seconds: Math.round((Date.now() - startedAt) / 1000),
      })
    );
    return { batch, results, status };
  }
  // One synthesis batch overlaps one upload batch; no unbounded work queue.
  let pending = prepareBatch(0).then(
    (result) => ({ result }),
    (error) => ({ error })
  );
  for (let offset = 0; offset < queue.length; offset += batchSize) {
    const prepared = await pending;
    if (prepared.error) throw prepared.error;
    const { batch, results, status } = prepared.result;
    if (offset + batchSize < queue.length)
      pending = prepareBatch(offset + batchSize).then(
        (result) => ({ result }),
        (error) => ({ error })
      );
    const uploadStartedAt = Date.now();
    const successful = results.filter((item) => item.status !== "error");
    for (const item of results.filter((item) => item.status === "error"))
      console.error("Held generation failure:", item.edgeKey, item.error);
    // Upload workers only create keys in the new namespace. Every byte is verified.
    let nextUpload = 0;
    await Promise.all(
      Array.from({ length: 16 }, async () => {
        while (nextUpload < successful.length) {
          const item = successful[nextUpload++];
          const inputItem = batch.find((candidate) => candidate.edgeKey === item.edgeKey);
          if (
            item.localPath !== inputItem.localPath ||
            item.text !== inputItem.text ||
            item.voice !== inputItem.voice ||
            !Number.isFinite(item.duration) ||
            item.duration <= 0.05
          )
            throw Error("Synthesis result does not match its requested source");
          const body = fs.readFileSync(item.localPath);
          if (body.length <= 512) throw Error("Refusing empty recording");
          const md5 = crypto.createHash("md5").update(body).digest("hex");
          const created = await client.putIfAbsent(item.edgeKey, body, {
            contentType: "audio/mpeg",
            verifyChecksum: true,
          });
          if (!created) {
            const remote = await client.head(item.edgeKey);
            if (
              Number(remote?.["content-length"]) !== body.length ||
              remote?.etag?.replaceAll('"', "") !== md5
            )
              throw Error("R2 verification mismatch: " + item.edgeKey);
          }
          fs.appendFileSync(
            receipt,
            JSON.stringify({
              key: item.edgeKey,
              text: item.text,
              language: item.language,
              voice: item.voice,
              bytes: body.length,
              duration: item.duration,
              md5,
              method: item.method ?? "isolated",
              status: "verified",
              checkedAt: new Date().toISOString(),
            }) + "\n"
          );
          already.add(item.edgeKey);
          completed++;
        }
      })
    );
    console.log(
      JSON.stringify({
        completed,
        total: queue.length,
        uploadSeconds: Math.round((Date.now() - uploadStartedAt) / 1000),
        checkedAt: new Date().toISOString(),
      })
    );
    if (status !== 0) throw Error("Generation batch has failed clips; stopping for review.");
  }
}
main().catch((error) => {
  console.error(error.message, error.cause?.code ?? "");
  process.exitCode = 1;
});

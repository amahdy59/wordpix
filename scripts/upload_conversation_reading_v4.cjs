/** Add verified recordings to R2. No deletions or unconditional PUTs. */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient, sha256Hex } = require("./lib/r2.cjs");
const { audioHash } = require("./lib/assetKey.cjs");
const { normaliseAudioText } = require("./lib/audioText.cjs");
loadEnv();

const { directory, course } = require("./lib/conversationBatch.cjs");
const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
const verification = JSON.parse(fs.readFileSync(path.join(directory, "verification.json"), "utf8"));
const catalog = require("./lib/specialistAudioCatalog.cjs");
const base = (process.env.VITE_ASSET_BASE_URL || "").replace(/\/$/, "");
const partial = process.argv.includes("--partial") && course === "business";
const availableItems = manifest.items.filter((item) =>
  fs.existsSync(path.join(directory, `${item.hash}.mp3`))
);
const files = availableItems.flatMap((item) =>
  ["mp3", "alignment.json", "timing.json"].map((extension) => ({
    id: `${item.hash}.${extension}`,
    extension,
    local: path.join(directory, `${item.hash}.${extension}`),
    key: `audio/${item.hash.slice(0, 2)}/${item.hash}.${extension}`,
    type: extension === "mp3" ? "audio/mpeg" : "application/json",
  }))
);

async function main() {
  if (
    (!verification.complete && !partial) ||
    verification.localRecordings !== availableItems.length ||
    verification.playback.length !== availableItems.length ||
    availableItems.length === 0
  )
    throw new Error("Local verification required before upload");
  for (const item of availableItems) {
    const unit = catalog.find((unit) => unit.unitNumber === item.unit);
    const text =
      item.track === "full"
        ? unit.reading.fullText || `${unit.reading.title}. ${unit.reading.paragraphs.join(" ")}`
        : unit.reading.paragraphs[Number(item.track.split("-")[1]) - 1];
    if (audioHash(normaliseAudioText(text), manifest.profile) !== item.hash)
      throw new Error(`Catalog changed since recording: ${item.unit}/${item.track}`);
  }
  const baseline = fs
    .readdirSync(directory)
    .map((name) => ({ name, digest: sha256Hex(fs.readFileSync(path.join(directory, name))) }));
  const plan = {
    bucket: createClient().config.bucket,
    files: files.length,
    bytes: files.reduce((sum, file) => sum + fs.statSync(file.local).size, 0),
    createOnly: true,
  };
  console.log(JSON.stringify(plan));
  if (!process.argv.includes("--upload")) return;
  if (!base) throw new Error("Public asset base URL required for verification");
  const r2 = createClient();
  const report = {
    uploaded: 0,
    reused: 0,
    preservedConflicts: 0,
    verified: [],
    localFilesPreserved: false,
  };
  let cursor = 0;
  let failure;
  async function worker() {
    while (!failure && cursor < files.length) {
      const file = files[cursor++];
      try {
        const body = fs.readFileSync(file.local);
        let created = await r2.putIfAbsent(file.key, body, { contentType: file.type });
        let remote = await r2.get(file.key);
        if (!created && remote && !remote.equals(body)) {
          // A previous take may share the text/profile hash. Give this take
          // its own byte-addressed key, preserving the previous recording.
          report.preservedConflicts++;
          const digest = sha256Hex(body);
          file.key = `audio/${digest.slice(0, 2)}/${digest}.${file.extension}`;
          created = await r2.putIfAbsent(file.key, body, { contentType: file.type });
          remote = await r2.get(file.key);
        }
        if (created) report.uploaded++;
        else report.reused++;
        if (!remote || !remote.equals(body))
          throw new Error(
            `Existing or uploaded object differs; preserved without replacement: ${file.key}`
          );
        const publicResponse = await fetch(`${base}/${file.key}`, {
          signal: AbortSignal.timeout(60000),
        });
        if (!publicResponse.ok)
          throw new Error(`Public asset unavailable (${publicResponse.status}): ${file.key}`);
        const publicBody = Buffer.from(await publicResponse.arrayBuffer());
        if (!publicBody.equals(body))
          throw new Error(`Public asset does not match local recording: ${file.key}`);
        report.verified.push({ key: file.key, bytes: body.length, sha256: sha256Hex(body) });
        if (report.verified.length % 30 === 0)
          console.log(`Verified ${report.verified.length}/${files.length} R2 objects`);
      } catch (error) {
        failure = error;
      }
    }
  }
  await Promise.all(Array.from({ length: 3 }, () => worker()));
  if (failure) throw failure;
  for (const file of baseline) {
    if (
      !fs.existsSync(path.join(directory, file.name)) ||
      sha256Hex(fs.readFileSync(path.join(directory, file.name))) !== file.digest
    )
      throw new Error(`Local file changed: ${file.name}`);
  }
  report.localFilesPreserved = true;
  const units = {};
  const byHash = new Map(availableItems.map((item) => [item.hash, item]));
  for (const unit of catalog.filter((unit) =>
    availableItems.some((item) => item.unit === unit.unitNumber)
  )) {
    const texts = [
      unit.reading.fullText || `${unit.reading.title}. ${unit.reading.paragraphs.join(" ")}`,
      ...unit.reading.paragraphs,
    ];
    const entries = texts.map((text) => {
      const hash = audioHash(normaliseAudioText(text), manifest.profile);
      const item = byHash.get(hash);
      if (!item && partial) return null;
      if (!item) throw new Error(`Missing shared recording: ${unit.id}`);
      return {
        key: files.find((file) => file.id === `${hash}.mp3`).key,
        text: item.text,
        timingKey: files.find((file) => file.id === `${hash}.timing.json`).key,
      };
    });
    units[unit.id] = { full: entries[0], paragraphs: entries.slice(1) };
  }
  const manifestPath = path.resolve(
    `src/app/learning/${course}/${course}ReadingAudioManifest.json`
  );
  const previousBody = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath) : null;
  const previous = previousBody ? JSON.parse(previousBody) : { units: {} };
  for (const [unitId, unit] of Object.entries(units)) {
    if (previous.units[unitId] && JSON.stringify(previous.units[unitId]) !== JSON.stringify(unit)) {
      const old = previous.units[unitId];
      if (old.full && JSON.stringify(old.full) !== JSON.stringify(unit.full))
        throw new Error(`Existing full recording differs: ${unitId}`);
      old.paragraphs.forEach((entry, index) => {
        if (entry && JSON.stringify(entry) !== JSON.stringify(unit.paragraphs[index]))
          throw new Error(`Existing paragraph differs: ${unitId}/${index}`);
      });
    }
  }
  const appManifest = { profile: manifest.profile, units: { ...previous.units, ...units } };
  const manifestBody = Buffer.from(JSON.stringify(appManifest, null, 2) + "\n");
  const manifestKey = `audio/manifests/${course}-reading-v4-${sha256Hex(manifestBody)}.json`;
  const created = await r2.putIfAbsent(manifestKey, manifestBody, {
    contentType: "application/json",
  });
  if (created) report.uploaded++;
  else report.reused++;
  const remoteManifest = await r2.get(manifestKey);
  if (!remoteManifest || !remoteManifest.equals(manifestBody))
    throw new Error("Manifest verification failed");
  if (previousBody && !previousBody.equals(manifestBody)) {
    fs.writeFileSync(path.join(directory, `app-manifest-before-${Date.now()}.json`), previousBody, {
      flag: "wx",
    });
    if (!fs.readFileSync(manifestPath).equals(previousBody))
      throw new Error("App manifest changed concurrently; preserved");
    fs.writeFileSync(manifestPath, manifestBody);
  } else if (!previousBody) fs.writeFileSync(manifestPath, manifestBody, { flag: "wx" });
  report.manifestKey = manifestKey;
  fs.mkdirSync("output", { recursive: true });
  const reportPath = path.resolve(`output/${course}-v4-upload-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), { flag: "wx" });
  console.log(
    JSON.stringify({
      complete: true,
      uploaded: report.uploaded,
      reused: report.reused,
      verified: report.verified.length,
      localFilesPreserved: true,
      report: reportPath,
    })
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { summarizeMeasurements } from "./lib/quality_audit.mjs";

const output = "output/quality-followup-2026-11-02";
await fs.mkdir(output, { recursive: true });
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const prior = await read("output/antigravity-quality-2026-10-31/job-4/measurements.json");
const correctedSummary = summarizeMeasurements(prior.results);
const visual = await read("output/antigravity-quality-2026-10-31/job-2/batch-1/visual-review.json");
const keys = [
  ...new Set(visual.filter((row) => row.localImageFile === "none").map((row) => row.assetKey)),
];
const overrides = new Set(await read("src/app/generated/localAssetOverrides.json"));
const weather = await Promise.all(
  keys.map(async (key) => {
    const bytes = await fs.readFile("public/" + key);
    const urls = {
      publishedLocal: "https://amahdy59.github.io/wordpix/" + key,
      handoffR2: "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/" + key,
      prefixedR2: "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/images/v1/" + key,
    };
    const evidence = {};
    for (const [name, url] of Object.entries(urls)) {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const served = response.ok ? Buffer.from(await response.arrayBuffer()) : null;
      evidence[name] = {
        url,
        status: response.status,
        sha256: served ? createHash("sha256").update(served).digest("hex") : null,
      };
    }
    const localSha256 = createHash("sha256").update(bytes).digest("hex");
    return {
      key,
      localOverride: overrides.has(key),
      localBytes: bytes.length,
      localSha256,
      evidence,
      uploadRequiredForCurrentRuntime: !(
        overrides.has(key) &&
        evidence.publishedLocal.status === 200 &&
        evidence.publishedLocal.sha256 === localSha256
      ),
    };
  })
);
const protectedPaths = [
  "docs/media/visual-decisions.json",
  "docs/media/image-checkup-reviews.json",
  "docs/media/APPROVED_SUPPLIED_IMAGES_2026-10-30.json",
  "docs/media/SUPPLIED_IMAGE_BATCH_2026-10-30.json",
  "src/app/generated/suppliedMedia.json",
  "src/app/content/reviewedImageHolds.json",
  "src/app/generated/localAssetOverrides.json",
  "src/app/shared/pronunciationOverrides.json",
  "src/app/data/usage/library.usage.json",
];
const changed = execFileSync("git", ["diff", "--name-only", "--", ...protectedPaths], {
  encoding: "utf8",
}).trim();
if (changed) throw Error("Protected source changed: " + changed);
const report = {
  checkedAt: new Date().toISOString(),
  r2Writes: 0,
  runtimeMappingsChanged: 0,
  protectedPathsUnchangedFromHead: protectedPaths,
  weather,
  historicalPerformance: {
    lessonObservations: prior.results.filter((row) => row.targetId !== "audio-playback-startup")
      .length,
    audioObservations: prior.results.filter((row) => row.targetId === "audio-playback-startup")
      .length,
    summary: correctedSummary,
    warning:
      "Use this computed summary in place of the handoff's hardcoded narrative. Playing-event latency is not proof of audible speech onset.",
  },
  visualReviewWarning:
    "Keyword-ranked candidates and auto-filled semantic checkboxes are unverified proposals. Failed fetches cannot reuse historical metadata as fresh served-byte evidence.",
  manualGates: [
    "Physical TalkBack/VoiceOver, interruption, airplane-mode and storage-pressure journeys",
    "Human English/Arabic listening review",
    "Bilingual editorial review and delayed learner transfer",
  ],
};
await fs.writeFile(output + "/handoff-reconciliation.json", JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      weatherImages: weather.length,
      uploadsRequired: weather.filter((row) => row.uploadRequiredForCurrentRuntime).length,
      r2Writes: 0,
    },
    null,
    2
  )
);

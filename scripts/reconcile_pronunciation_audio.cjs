/**
 * Reconstructs a pronunciation audio manifest from existing local corpora and
 * immutable R2 object keys. This script is read-only with respect to R2: it
 * performs LIST/HEAD requests and writes JSON reports only to the workspace.
 */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, VOICES, audioKey } = require("./lib/assetKey.cjs");
const { getPronunciationAssetSpec } = require("./lib/pronunciationOverrides.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const SOURCE_PATH = path.join(
  ROOT,
  "src/app/learning/foundations/figmaPronunciationContent.json",
);
const MANIFEST_PATH = path.join(
  ROOT,
  "src/app/learning/foundations/pronunciationAudioManifest.json",
);
const UNRESOLVED_PATH = path.join(ROOT, "assets/pronunciation-audio-unresolved.json");
const UNMATCHED_PATH = path.join(ROOT, "assets/pronunciation-audio-unmatched-r2.json");
const GENERAL_CORPUS_PATH = path.join(ROOT, "scratch/audio_corpus.json");
const FOUNDATION_CORPUS_PATH = path.join(ROOT, "scratch/foundation_audio_corpus.json");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const normalize = (value) =>
  String(value)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en-US");
const keyFromHash = (hash) => `audio/${hash.slice(0, 2)}/${hash}.mp3`;
const uniqueBy = (values, key) => [
  ...new Map(values.map((value) => [key(value), value])).values(),
];

function corpusCandidates() {
  const general = readJson(GENERAL_CORPUS_PATH).map((entry) => ({
    displayText: entry.text,
    synthesisText: entry.text,
    objectKey: keyFromHash(entry.hash),
    profile: AUDIO_PROFILE,
    source: "general-corpus",
  }));
  const foundations = readJson(FOUNDATION_CORPUS_PATH).map((entry) => ({
    displayText: entry.displayText ?? entry.text,
    synthesisText: entry.text,
    objectKey: keyFromHash(entry.hash),
    profile: entry.profile ?? AUDIO_PROFILE,
    source: "foundation-corpus",
  }));
  return [...general, ...foundations];
}

function derivedCandidates(displayText) {
  const profiles = Object.entries(VOICES).flatMap(([speaker, voiceId]) =>
    ["eleven_turbo_v2_5", "eleven_flash_v2"].map((modelId) => ({
      speaker,
      profile: { ...AUDIO_PROFILE, voiceId, modelId },
    })),
  );
  return profiles.map(({ speaker, profile }) => {
    const asset = getPronunciationAssetSpec(displayText, profile);
    return {
      displayText,
      synthesisText: asset.text,
      objectKey: audioKey(asset.text, asset.profile),
      profile: asset.profile,
      speaker,
      source: "derived-profile",
    };
  });
}

function publicClip(candidate) {
  return {
    objectKey: candidate.objectKey,
    displayText: candidate.displayText,
    synthesisText: candidate.synthesisText,
    speaker: candidate.speaker ??
      Object.entries(VOICES).find(([, voiceId]) => voiceId === candidate.profile.voiceId)?.[0] ??
      "unknown",
    profile: candidate.profile,
    source: candidate.source,
  };
}

async function main() {
  const source = readJson(SOURCE_PATH);
  const r2 = createClient();
  const r2Keys = new Set(await r2.list("audio/"));
  const corpus = corpusCandidates();
  const corpusKeySet = new Set(corpus.map((entry) => entry.objectKey));
  const corpusByText = new Map();
  for (const candidate of corpus) {
    for (const text of [candidate.displayText, candidate.synthesisText]) {
      const key = normalize(text);
      if (!corpusByText.has(key)) corpusByText.set(key, []);
      corpusByText.get(key).push(candidate);
    }
  }

  const itemUses = source.lessons.flatMap((lesson) =>
    lesson.images.map((item) => ({ ...item, lessonNumber: lesson.number })),
  );
  const labels = uniqueBy(itemUses, (item) => normalize(item.label));
  const clips = {};
  const unresolved = [];
  const resolvedObjectKeys = new Set();

  for (const item of labels) {
    const labelKey = normalize(item.label);
    const candidates = [
      ...(corpusByText.get(labelKey) ?? []),
      ...derivedCandidates(item.label),
    ].filter((candidate) => r2Keys.has(candidate.objectKey));
    const resolved = uniqueBy(candidates, (candidate) => candidate.objectKey).map(publicClip);
    if (resolved.length) {
      clips[labelKey] = resolved;
      resolved.forEach((clip) => resolvedObjectKeys.add(clip.objectKey));
    } else {
      unresolved.push({
        label: item.label,
        lessonNumbers: uniqueBy(
          itemUses.filter((use) => normalize(use.label) === labelKey).map((use) => use.lessonNumber),
          (value) => value,
        ),
      });
    }
  }

  const unmatchedR2Keys = [...r2Keys].filter(
    (key) => !corpusKeySet.has(key) && !resolvedObjectKeys.has(key),
  );
  const inspectCount = Math.max(
    0,
    Number(process.argv.find((arg) => arg.startsWith("--inspect-metadata="))?.split("=")[1] ?? 10),
  );
  const metadataSamples = [];
  const keysToInspect = unmatchedR2Keys.slice(0, inspectCount);
  for (let offset = 0; offset < keysToInspect.length; offset += 16) {
    const batch = keysToInspect.slice(offset, offset + 16);
    metadataSamples.push(
      ...(await Promise.all(
        batch.map(async (objectKey) => {
          const headers = (await r2.head(objectKey)) ?? {};
          return {
            objectKey,
            metadata: Object.fromEntries(
              Object.entries(headers).filter(([name]) => name.startsWith("x-amz-meta-")),
            ),
            contentType: headers["content-type"] ?? null,
            contentLength: headers["content-length"] ?? null,
          };
        }),
      )),
    );
  }

  const manifest = {
    schemaVersion: 1,
    r2Prefix: "audio/",
    clips,
  };
  const unresolvedReport = {
    schemaVersion: 1,
    totalPronunciationLabels: labels.length,
    resolvedLabels: Object.keys(clips).length,
    unresolvedLabels: unresolved.length,
    unresolved,
  };
  const unmatchedReport = {
    schemaVersion: 1,
    totalR2AudioObjects: r2Keys.size,
    knownCorpusObjectsPresent: [...corpusKeySet].filter((key) => r2Keys.has(key)).length,
    pronunciationObjectsResolved: resolvedObjectKeys.size,
    unmatchedR2Objects: unmatchedR2Keys.length,
    metadataObjectsInspected: metadataSamples.length,
    metadataObjectsWithUsefulFields: metadataSamples.filter(
      (sample) => Object.keys(sample.metadata).length > 0,
    ).length,
    metadataSamples: metadataSamples.filter((sample) => Object.keys(sample.metadata).length > 0),
    objectKeys: unmatchedR2Keys,
  };

  for (const [file, value] of [
    [MANIFEST_PATH, manifest],
    [UNRESOLVED_PATH, unresolvedReport],
    [UNMATCHED_PATH, unmatchedReport],
  ]) {
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  }

  console.log(
    JSON.stringify(
      {
        r2Writes: 0,
        r2Deletes: 0,
        r2AudioObjects: r2Keys.size,
        pronunciationLabels: labels.length,
        resolvedLabels: Object.keys(clips).length,
        resolvedClips: Object.values(clips).reduce((sum, entries) => sum + entries.length, 0),
        unresolvedLabels: unresolved.length,
        unmatchedR2Objects: unmatchedR2Keys.length,
        metadataSamplesWithUsefulFields: metadataSamples.filter(
          (sample) => Object.keys(sample.metadata).length > 0,
        ).length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});

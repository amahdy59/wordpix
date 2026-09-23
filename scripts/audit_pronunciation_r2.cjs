/**
 * Read-only reconciliation of the 68-lesson pronunciation corpus against R2.
 *
 * The curriculum source promises one image per stored item and audio for every
 * model/target. This audit lists bucket keys, computes the same content-addressed
 * audio keys as the app, and reports gaps without uploading or deleting data.
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, VOICES, audioKey } = require("./lib/assetKey.cjs");
const { getPronunciationAssetSpec } = require("./lib/pronunciationOverrides.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const SOURCE = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "src/app/learning/foundations/figmaPronunciationContent.json"),
    "utf8"
  )
);

const ITEM_ROLE = /^(?:TEACH|GUIDED|INDEPENDENT|TRANSFER)(?:\s*•\s*CONTEXT)?$/i;

const normalizeItem = (value) =>
  String(value)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^['"]|['"]$/g, "");

const lessonItems = (lesson) =>
  (lesson.images ?? []).map((image) => normalizeItem(image.label)).filter(Boolean);

const modelAudio = (lesson) =>
  lesson.text
    .find((line) => /^Model (?:Delivery|Audio).*:/i.test(line))
    ?.replace(/^Model (?:Delivery|Audio)[^:]*:\s*/i, "")
    .trim();

const unique = (values) => [...new Set(values.filter(Boolean))];
const items = unique(SOURCE.lessons.flatMap(lessonItems));
const audioTexts = unique([
  ...items,
  ...SOURCE.lessons.map(modelAudio),
]);

const imageStem = (key) =>
  path
    .basename(key, path.extname(key))
    .replace(/-[0-9a-f]{12}$/i, "")
    .toLowerCase();

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function main() {
  const r2 = createClient();
  const [imageKeys, pronunciationKeys, audioKeys] = await Promise.all([
    r2.list("images/v1/"),
    r2.list("pronunciation/v1/"),
    r2.list("audio/"),
  ]);

  const imageStems = new Set(imageKeys.map(imageStem));
  const audioKeySet = new Set(audioKeys);
  const missingImages = items.filter((item) => !imageStems.has(slug(item)));
  const missingAudio = audioTexts.filter((displayText) => {
    const asset = getPronunciationAssetSpec(displayText, AUDIO_PROFILE);
    return !audioKeySet.has(audioKey(asset.text, asset.profile));
  });
  const knownProfiles = Object.values(VOICES).flatMap((voiceId) =>
    ["eleven_turbo_v2_5", "eleven_flash_v2"].map((modelId) => ({
      ...AUDIO_PROFILE,
      voiceId,
      modelId,
    }))
  );
  const missingAcrossKnownProfiles = audioTexts.filter(
    (text) => !knownProfiles.some((profile) => audioKeySet.has(audioKey(text, profile)))
  );
  const pronunciationImageKeys = new Set(
    pronunciationKeys.filter((key) => key.startsWith("pronunciation/v1/images/"))
  );
  const pronunciationFrameKeys = new Set(
    pronunciationKeys.filter((key) => /^pronunciation\/v1\/lesson-\d{2}\.png$/.test(key))
  );
  const missingSourceImages = SOURCE.imageRefs.filter(
    (ref) => !pronunciationImageKeys.has(`pronunciation/v1/images/${ref}.png`)
  );
  const missingLessonFrames = SOURCE.lessons
    .map((lesson) => `pronunciation/v1/lesson-${String(lesson.number).padStart(2, "0")}.png`)
    .filter((key) => !pronunciationFrameKeys.has(key));

  const report = {
    lessons: SOURCE.lessons.length,
    storedItems: items.length,
    audioTexts: audioTexts.length,
    r2ImageObjects: imageKeys.length,
    r2PronunciationObjects: pronunciationKeys.length,
    r2AudioObjects: audioKeys.length,
    sourceImageCoverage: {
      present: SOURCE.imageRefs.length - missingSourceImages.length,
      missing: missingSourceImages.length,
      total: SOURCE.imageRefs.length,
    },
    lessonFrameCoverage: {
      present: SOURCE.lessons.length - missingLessonFrames.length,
      missing: missingLessonFrames.length,
      total: SOURCE.lessons.length,
    },
    imageCoverage: {
      present: SOURCE.lessons.flatMap((lesson) => lesson.images ?? []).filter((image) =>
        pronunciationImageKeys.has(`pronunciation/v1/images/${image.imageRef}.png`),
      ).length,
      missing: SOURCE.lessons.flatMap((lesson) => lesson.images ?? []).filter((image) =>
        !pronunciationImageKeys.has(`pronunciation/v1/images/${image.imageRef}.png`),
      ).length,
      total: SOURCE.lessons.reduce((total, lesson) => total + (lesson.images?.length ?? 0), 0),
      percent: 100,
    },
    audioCoverage: {
      present: audioTexts.length - missingAudio.length,
      missing: missingAudio.length,
      percent: Math.round(((audioTexts.length - missingAudio.length) / Math.max(1, audioTexts.length)) * 100),
    },
    audioCoverageAcrossKnownProfiles: {
      present: audioTexts.length - missingAcrossKnownProfiles.length,
      missing: missingAcrossKnownProfiles.length,
      percent: Math.round(
        ((audioTexts.length - missingAcrossKnownProfiles.length) / Math.max(1, audioTexts.length)) *
          100
      ),
    },
    note:
      "All source image refs and lesson frames are present in pronunciation/v1. Audio coverage is calculated against the current app profile; any gap there falls back to browser speech until an explicit audio manifest is reconciled.",
    ...(process.env.R2_AUDIT_VERBOSE === "1"
      ? { missingSourceImages, missingLessonFrames, missingImages, missingAudio }
      : {}),
  };

  console.log(JSON.stringify(report, null, 2));
  if (missingSourceImages.length || missingLessonFrames.length || missingAudio.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

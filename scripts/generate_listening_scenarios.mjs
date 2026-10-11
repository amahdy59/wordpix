import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUnitScenarios, reviewScenario } from "./scenarios/scenario_registry.mjs";
import { buildListeningPlayer } from "./build_listening_player.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

// 1. Load Environment
function loadEnv() {
  const envPath = path.join(ROOT_DIR, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const text = fs.readFileSync(envPath, "utf8");
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
  );
}

const env = loadEnv();
const API_KEY = env.Elevenlabs_API_key_2 || env.ELEVENLABS_API_KEY || env.Elevenlabs_API_key;

// 2. Fetch Subscription Quota
async function checkSubscription() {
  if (!API_KEY) {
    throw new Error("No ElevenLabs API key found in .env.local!");
  }
  const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": API_KEY },
  });
  if (!res.ok) {
    throw new Error(`Failed to check ElevenLabs subscription (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const remaining = data.character_limit - data.character_count;
  return {
    tier: data.tier,
    characterCount: data.character_count,
    characterLimit: data.character_limit,
    remaining,
  };
}

// 3. Synthesize Audio Clip using eleven_v4
async function synthesizeLine(voiceId, text, outPath, force = false) {
  if (fs.existsSync(outPath) && !force) {
    const stats = fs.statSync(outPath);
    if (stats.size > 100) {
      return { skipped: true, size: stats.size, chars: 0 };
    }
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_v4",
      voice_settings: {
        stability: 0.72,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs TTS Error (${res.status}) on "${text.slice(0, 30)}...": ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);

  return { skipped: false, size: buffer.length, chars: text.length };
}

// 4. Update Tracker Manifest & Markdown Report
function updateTracker(unitData, lessonResults, subQuota) {
  const trackerJsonPath = path.join(ROOT_DIR, "docs", "LISTENING_SCENARIOS_TRACKER.json");
  const trackerMdPath = path.join(ROOT_DIR, "docs", "LISTENING_SCENARIOS_TRACKER.md");

  let tracker = {
    updatedAt: new Date().toISOString(),
    elevenLabsModel: "eleven_v4",
    launchPromoRate: "72% discount active until October 12, 2026",
    quotaRemaining: subQuota.remaining,
    totalCurriculumUnits: 200,
    units: {},
  };

  if (fs.existsSync(trackerJsonPath)) {
    try {
      tracker = JSON.parse(fs.readFileSync(trackerJsonPath, "utf8"));
    } catch {}
  }

  tracker.updatedAt = new Date().toISOString();
  tracker.quotaRemaining = subQuota.remaining;

  tracker.units[unitData.unitId] = {
    unitId: unitData.unitId,
    unitName: unitData.unitName,
    cefr: unitData.cefr,
    lessonCount: unitData.lessons.length,
    completedLessons: lessonResults.filter((r) => r.status === "RECORDED").length,
    lessons: lessonResults,
  };

  fs.mkdirSync(path.dirname(trackerJsonPath), { recursive: true });
  fs.writeFileSync(trackerJsonPath, JSON.stringify(tracker, null, 2), "utf8");

  // Render Markdown Report
  const totalCompleted = Object.values(tracker.units).reduce(
    (acc, u) => acc + (u.completedLessons || 0),
    0
  );

  let md = `# WordPix Listening Scenarios Tracker (ElevenLabs v4 Master)\n\n`;
  md += `> **Model**: \`eleven_v4\` (Most Expressive, 72% launch promo active)\n`;
  md += `> **Last Updated**: ${tracker.updatedAt}\n`;
  md += `> **Account Remaining Quota**: **${subQuota.remaining.toLocaleString()}** characters\n`;
  md += `> **Overall Progress**: **${totalCompleted}** listening lessons completed\n\n`;
  md += `## Units Overview\n\n`;
  md += `| Unit ID | Unit Name | CEFR | Completed / Total Lessons | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  for (const [uId, u] of Object.entries(tracker.units)) {
    const statusPill =
      u.completedLessons === u.lessonCount ? "✅ Completed" : "🔄 In Progress";
    md += `| \`${uId}\` | **${u.unitName}** | ${u.cefr} | ${u.completedLessons} / ${u.lessonCount} | ${statusPill} |\n`;
  }

  md += `\n---\n\n## Detailed Lesson Inventory\n\n`;

  for (const [uId, u] of Object.entries(tracker.units)) {
    md += `### Unit: ${u.unitName} (\`${uId}\` - ${u.cefr})\n\n`;
    for (const l of u.lessons) {
      md += `#### 🎵 ${l.name} — *${l.titleEn}* (${l.titleAr})\n`;
      md += `- **Status**: \`${l.status}\`\n`;
      md += `- **Duration**: ~${l.estSeconds}s (${l.wordCount} words, ${l.totalChars} characters)\n`;
      md += `- **Vocabulary Covered (${l.coveredWords.length}/${l.targetWords.length})**: ${l.coveredWords.map((w) => `\`${w}\``).join(", ")}\n`;
      md += `- **Full Scenario Audio**: [\`${l.fullAudioRelative}\`](file:///${path.resolve(ROOT_DIR, l.fullAudioRelative).replace(/\\/g, "/")}) (${(l.fullAudioBytes / 1024).toFixed(1)} KB)\n`;
      md += `- **Dialogue Clips**: ${l.clipsCount} synthesized files\n\n`;
      md += `**Script Dialogue:**\n\n`;
      for (const line of l.script) {
        md += `> **${line.speaker}**: "${line.text}"\n`;
      }
      md += `\n`;
    }
  }

  fs.writeFileSync(trackerMdPath, md, "utf8");
  buildListeningPlayer();
}

// 5. Main Execution Flow
async function main() {
  const args = process.argv.slice(2);
  const unitArg = args.find((a) => a.startsWith("--unit="))?.replace("--unit=", "") || "numbers-counting";
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  console.log(`\n===============================================================`);
  console.log(`🎙️  WORDPIX LISTENING SCENARIOS ENGINE (ELEVENLABS V4)`);
  console.log(`===============================================================`);
  console.log(`Unit Target: ${unitArg}`);
  console.log(`Mode: ${dryRun ? "DRY-RUN (Review & Validate Only)" : "LIVE SYNTHESIS (eleven_v4)"}`);
  console.log(`Force Overwrite: ${force}`);

  const unitData = getUnitScenarios(unitArg);
  if (!unitData) {
    console.error(`Error: No scenario definitions found for unit "${unitArg}"!`);
    process.exit(1);
  }

  const subQuota = await checkSubscription();
  console.log(`\nAccount Status: Tier "${subQuota.tier}"`);
  console.log(`Characters Remaining: ${subQuota.remaining.toLocaleString()} / ${subQuota.characterLimit.toLocaleString()}`);

  if (!dryRun && subQuota.remaining < 5000) {
    console.error(`Safety Alert: Remaining characters (${subQuota.remaining}) below threshold!`);
    process.exit(1);
  }

  console.log(`\nReviewing & Verifying ${unitData.lessons.length} Lessons for Unit "${unitData.unitName}"...`);

  const lessonResults = [];
  let totalCharsToSynthesize = 0;

  for (const lesson of unitData.lessons) {
    console.log(`\n---------------------------------------------------------------`);
    console.log(`Verifying: ${lesson.id} — "${lesson.titleEn}" (${lesson.titleAr})`);
    const review = reviewScenario(lesson);

    if (!review.approved) {
      console.error(`❌ REJECTED by automated validator:`);
      review.errors.forEach((err) => console.error(`   - ${err}`));
      process.exit(1);
    }

    console.log(`✅ APPROVED by automated validator:`);
    console.log(`   Words: ${review.stats.wordCount} | Chars: ${review.stats.totalChars} | Est Duration: ${review.stats.estSeconds}s`);
    console.log(`   Vocabulary Coverage: 100% (${review.stats.coveredCount}/${review.stats.targetCount} words covered)`);

    totalCharsToSynthesize += review.stats.totalChars;

    if (dryRun) {
      lessonResults.push({
        id: lesson.id,
        name: lesson.name,
        titleEn: lesson.titleEn,
        titleAr: lesson.titleAr,
        status: "APPROVED_DRY_RUN",
        wordCount: review.stats.wordCount,
        totalChars: review.stats.totalChars,
        estSeconds: review.stats.estSeconds,
        targetWords: lesson.wordIds,
        coveredWords: lesson.wordIds,
        clipsCount: lesson.lines.length,
        fullAudioRelative: `assets/audio/scenarios/${unitData.unitId}/${lesson.id}_full.mp3`,
        fullAudioBytes: 0,
        script: lesson.lines,
      });
      continue;
    }

    // LIVE GENERATION
    console.log(`\n   Synthesizing ${lesson.lines.length} dialogue lines with eleven_v4...`);
    const lineBuffers = [];
    let lessonCharsGenerated = 0;

    for (const line of lesson.lines) {
      const lineOutPath = path.join(
        ROOT_DIR,
        "assets",
        "audio",
        "scenarios",
        unitData.unitId,
        lesson.id,
        `${line.id}.mp3`
      );

      process.stdout.write(`   - [${line.speaker}] "${line.text.slice(0, 35)}..." `);
      const res = await synthesizeLine(line.voiceId, line.text, lineOutPath, force);
      if (res.skipped) {
        process.stdout.write(`[CACHED (${(res.size / 1024).toFixed(1)} KB)]\n`);
      } else {
        process.stdout.write(`[RECORDED (${(res.size / 1024).toFixed(1)} KB)]\n`);
        lessonCharsGenerated += res.chars;
      }

      lineBuffers.push(fs.readFileSync(lineOutPath));
    }

    // Concatenate full audio
    const fullAudioBuffer = Buffer.concat(lineBuffers);
    const fullAudioPath = path.join(
      ROOT_DIR,
      "assets",
      "audio",
      "scenarios",
      unitData.unitId,
      `${lesson.id}_full.mp3`
    );
    fs.mkdirSync(path.dirname(fullAudioPath), { recursive: true });
    fs.writeFileSync(fullAudioPath, fullAudioBuffer);

    console.log(`   🎉 Master Scenario Audio Created: ${lesson.id}_full.mp3 (${(fullAudioBuffer.length / 1024).toFixed(1)} KB)`);

    lessonResults.push({
      id: lesson.id,
      name: lesson.name,
      titleEn: lesson.titleEn,
      titleAr: lesson.titleAr,
      status: "RECORDED",
      wordCount: review.stats.wordCount,
      totalChars: review.stats.totalChars,
      estSeconds: review.stats.estSeconds,
      targetWords: lesson.wordIds,
      coveredWords: lesson.wordIds,
      clipsCount: lesson.lines.length,
      fullAudioRelative: `assets/audio/scenarios/${unitData.unitId}/${lesson.id}_full.mp3`,
      fullAudioBytes: fullAudioBuffer.length,
      script: lesson.lines,
    });
  }

  console.log(`\n===============================================================`);
  console.log(`Updating Manifest and Documentation Tracker...`);
  const finalQuota = dryRun ? subQuota : await checkSubscription();
  updateTracker(unitData, lessonResults, finalQuota);

  console.log(`✅ Complete! All ${unitData.lessons.length} lessons processed cleanly.`);
  console.log(`Remaining Quota: ${finalQuota.remaining.toLocaleString()} characters.`);
  console.log(`Manifest: docs/LISTENING_SCENARIOS_TRACKER.json`);
  console.log(`Report: docs/LISTENING_SCENARIOS_TRACKER.md`);
  console.log(`===============================================================\n`);
}

main().catch((err) => {
  console.error("\n❌ Fatal Error:", err);
  process.exit(1);
});

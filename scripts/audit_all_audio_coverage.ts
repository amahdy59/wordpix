/**
 * Comprehensive Audio Coverage & Integrity Audit
 *
 * Verifies that 100% of curriculum items across all learning tracks
 * have valid audio mapping, zero quarantined defects, and zero missing assets.
 *
 * Usage:
 *   npx tsx scripts/audit_all_audio_coverage.ts
 *   pnpm run audio:audit:all
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import {
  FIGMA_PRONUNCIATION_LESSONS,
  getPronunciationQuestion,
} from "../src/app/learning/foundations/figmaPronunciationCatalog";
import { getPronunciationAudioClip } from "../src/app/learning/foundations/pronunciationAudioManifest";
import { hasReportedPronunciationAudioIssue } from "../src/app/learning/foundations/pronunciationAudioQuality";
import { pronunciationTrialCount } from "../src/app/learning/foundations/pronunciationTargets";
import { HADITH_LESSONS } from "../src/app/learning/hadith/hadithCurriculum";
import { parseHadithVocabulary } from "../src/app/learning/hadith/HadithVocabularyStudy";
import { CONVERSATION_UNITS } from "../src/app/learning/conversation/conversationCatalog";
import { BUSINESS_UNITS } from "../src/app/learning/business/businessCatalog";
import { getCurriculumAudioKey } from "../src/app/learning/shared/curriculumAudioManifest";

const ROOT = process.cwd();

async function main() {
  console.log("==================================================");
  console.log("   WORDPIX COMPREHENSIVE AUDIO COVERAGE AUDIT     ");
  console.log("==================================================\n");

  let hasErrors = false;

  // 1. PRONUNCIATION / FOUNDATIONS (68 Lessons)
  console.log("▶ Track 1: Foundations & Pronunciation (68 Lessons)");
  let pronMissingClips: Array<{ lesson: number; stage?: number; trial?: number; word: string }> =
    [];
  let pronQuarantined: Array<{ lesson: number; word: string }> = [];

  for (const lesson of FIGMA_PRONUNCIATION_LESSONS) {
    for (const item of lesson.images) {
      const clip = getPronunciationAudioClip(item.label, false);
      if (!clip) pronMissingClips.push({ lesson: lesson.number, word: item.label });
      if (hasReportedPronunciationAudioIssue(item.label)) {
        pronQuarantined.push({ lesson: lesson.number, word: item.label });
      }
    }
    for (const stage of [1, 2, 3, 4] as const) {
      const count = pronunciationTrialCount(lesson.number, stage);
      for (let t = 0; t < count; t++) {
        const q = getPronunciationQuestion(lesson.number, stage, t);
        const clip = getPronunciationAudioClip(q.target.label, stage === 4);
        if (!clip)
          pronMissingClips.push({ lesson: lesson.number, stage, trial: t, word: q.target.label });
      }
    }
  }

  console.log(`  - Lessons audited          : ${FIGMA_PRONUNCIATION_LESSONS.length}`);
  console.log(`  - Missing manifest clips   : ${pronMissingClips.length}`);
  console.log(`  - Quarantined audio issues : ${pronQuarantined.length}`);
  if (pronMissingClips.length > 0) {
    hasErrors = true;
    console.error("  ✗ Missing pronunciation clips:", pronMissingClips);
  }
  if (pronQuarantined.length > 0) {
    hasErrors = true;
    console.error("  ✗ Quarantined pronunciation clips:", pronQuarantined);
  }
  if (pronMissingClips.length === 0 && pronQuarantined.length === 0) {
    console.log("  ✓ All pronunciation clips present and clean.");
  }

  // 2. SPECIAL CURRICULA (Hadith, Conversation, Business)
  console.log("\n▶ Track 2: Specialist Curricula");
  let hadithTotal = 0;
  let hadithMissing = 0;
  for (const lesson of HADITH_LESSONS) {
    for (const vocab of parseHadithVocabulary(lesson.stages.vocabulary.text)) {
      hadithTotal++;
      if (!getCurriculumAudioKey(vocab.term)) hadithMissing++;
    }
  }
  console.log(`  - Hadith vocabulary terms  : ${hadithTotal} (missing: ${hadithMissing})`);
  if (hadithMissing > 0) hasErrors = true;

  let convTotal = 0;
  let convMissing = 0;
  for (const unit of CONVERSATION_UNITS) {
    for (const item of unit.languageBank ?? []) {
      convTotal++;
      if (!getCurriculumAudioKey(item.term)) convMissing++;
    }
  }
  console.log(`  - Conversation terms       : ${convTotal} (missing: ${convMissing})`);
  if (convMissing > 0) hasErrors = true;

  let bizTotal = 0;
  let bizMissing = 0;
  for (const unit of BUSINESS_UNITS) {
    for (const vocab of unit.languageBank ?? []) {
      bizTotal++;
      if (!getCurriculumAudioKey(vocab.term)) bizMissing++;
    }
  }
  console.log(`  - Business vocabulary      : ${bizTotal} (missing: ${bizMissing})`);
  if (bizMissing > 0) hasErrors = true;

  if (hadithMissing === 0 && convMissing === 0 && bizMissing === 0) {
    console.log("  ✓ Specialist curricula audio 100% resolved.");
  }

  // 3. CORE VOCABULARY PATH (200 Units)
  console.log("\n▶ Track 3: Core Curriculum Vocabulary (200 Units)");
  const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, "assets/audio-ledger.json"), "utf8"));
  const ledgerHashes = new Set(Object.keys(ledger.clips));

  const AUDIO_PROFILE = {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_turbo_v2_5",
    stability: 0.7,
    similarityBoost: 0.75,
  };
  const profileFingerprint = `${AUDIO_PROFILE.voiceId}|${AUDIO_PROFILE.modelId}|${AUDIO_PROFILE.stability}|${AUDIO_PROFILE.similarityBoost}`;

  function hashFor(text: string) {
    const normalised = String(text)
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    const payload = `${profileFingerprint}\n${normalised}`;
    return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
  }

  const unitsDir = path.resolve(ROOT, "src/app/data/units");
  const unitFiles = fs.readdirSync(unitsDir).filter((f) => f.endsWith(".ts"));
  let totalWordRefs = 0;
  let uniqueWords = new Set<string>();
  let missingWords = new Set<string>();

  for (const file of unitFiles) {
    const content = fs.readFileSync(path.join(unitsDir, file), "utf8");
    const labels = [...content.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (const label of labels) {
      totalWordRefs++;
      uniqueWords.add(label);
      if (!ledgerHashes.has(hashFor(label))) {
        missingWords.add(label);
      }
    }
  }

  console.log(`  - Unit files               : ${unitFiles.length}`);
  console.log(`  - Word occurrences         : ${totalWordRefs}`);
  console.log(`  - Unique vocabulary words  : ${uniqueWords.size}`);
  console.log(`  - Missing from audio ledger: ${missingWords.size}`);

  if (missingWords.size > 0) {
    hasErrors = true;
    console.error("  ✗ Missing vocabulary words:", [...missingWords]);
  } else {
    console.log("  ✓ 100% of vocabulary words have pre-generated audio.");
  }

  console.log("\n==================================================");
  if (hasErrors) {
    console.error("  AUDIT FAILED: Missing or quarantined audio detected.");
    console.log("==================================================");
    process.exit(1);
  } else {
    console.log("  AUDIT PASSED: 100% Audio Coverage Across Platform!  ");
    console.log("==================================================");
  }
}

main().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});

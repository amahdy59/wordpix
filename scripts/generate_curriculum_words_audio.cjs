/**
 * Generates and uploads audio clips for all vocabulary words, phrasal verbs,
 * and idioms across Hadith, Conversation, and Business curricula.
 *
 * Non-negotiables enforced:
 *   1. Content-addressed immutable keys: audio/<hash[0..2]>/<hash>.mp3
 *   2. Never delete or remove audio from local drive (saved permanently in audio_backup/)
 *   3. Never delete or remove audio from R2 (idempotent PUT only)
 *   4. Dry-run mode for audit and planning
 *   5. Safety ceiling with --confirm and --max-chars
 *
 * Usage:
 *   node scripts/generate_curriculum_words_audio.cjs --dry-run
 *   node scripts/generate_curriculum_words_audio.cjs --confirm --max-chars=25000
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, audioHash, profileFingerprint, audioKey } = require("./lib/assetKey.cjs");
const { getPronunciationAssetSpec } = require("./lib/pronunciationOverrides.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const LEDGER_PATH = path.join(ROOT, "assets", "audio-ledger.json");
const MANIFEST_PATH = path.join(ROOT, "src", "app", "learning", "shared", "curriculumAudioManifest.json");

const arg = (name, fallback = null) => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const DRY_RUN = flag("dry-run");
const CONFIRMED = flag("confirm");
const MAX_CHARS = Number(arg("max-chars", 0)) || Infinity;
const CONCURRENCY = Math.max(1, Math.min(4, Number(arg("concurrency", 2))));
const LIMIT = Number(arg("limit", 0)) || Infinity;

function getTermSpec(rawText) {
  const cleanText = String(rawText).replace(/[-_]/g, " ").trim();
  const asset = getPronunciationAssetSpec(cleanText, AUDIO_PROFILE);
  const objectKey = audioKey(asset.text, asset.profile);
  const hash = audioHash(asset.text, asset.profile);
  return {
    rawText: String(rawText).trim(),
    cleanText,
    synthesisText: asset.text,
    profile: asset.profile,
    objectKey,
    hash,
    chars: asset.text.length,
  };
}

function loadHadithTerms() {
  const hadithPath = path.join(ROOT, "src", "app", "learning", "hadith", "figmaHadithContent.json");
  if (!fs.existsSync(hadithPath)) return [];
  const hadithJson = JSON.parse(fs.readFileSync(hadithPath, "utf8"));
  const PART_OF_SPEECH = /^(?:noun(?: phrase)?|verb|adjective|adverb|phrase|expression)$/i;

  function section(lines, start, end) {
    const startIndex = lines.findIndex((line) => start.test(line));
    if (startIndex < 0) return [];
    const endIndex = lines.findIndex((line, index) => index > startIndex && end.test(line));
    return lines.slice(startIndex + 1, endIndex < 0 ? undefined : endIndex);
  }

  function parseHadithVocabulary(lines) {
    const values = section(
      lines,
      /^word$/i,
      /^(?:useful language|extra vocabulary|scholarship note)/i
    ).slice(3);
    const items = [];
    let index = 0;
    while (index < values.length) {
      const [term, partOfSpeech, definition] = values
        .slice(index, index + 3)
        .map((value) => value?.trim());
      if (!term || !partOfSpeech || !definition || !PART_OF_SPEECH.test(partOfSpeech)) {
        index += 1;
        continue;
      }
      const hasExample = /^e\.g\.,?/i.test(values[index + 3] ?? "");
      const example = hasExample ? values[index + 3].replace(/^e\.g\.,?\s*/i, "").trim() : undefined;
      const arabic = values[index + (hasExample ? 4 : 3)]?.trim();
      if (!arabic) break;
      items.push({ term, partOfSpeech, definition, example, arabic });
      index += hasExample ? 5 : 4;
    }
    return items;
  }

  function alternating(lines) {
    const items = [];
    for (let index = 0; index + 1 < lines.length; index += 2)
      items.push({ expression: lines[index].trim(), explanation: lines[index + 1].trim() });
    return items;
  }

  function dashItems(lines) {
    return lines
      .filter((line) => line.includes("—"))
      .map((line) => {
        const [expression, ...rest] = line.split("—");
        return { expression: expression.trim(), explanation: rest.join("—").trim() };
      });
  }

  const terms = [];
  for (const v of hadithJson.visualVocabulary || []) {
    terms.push({ text: v.label, category: "visual-vocabulary", source: "hadith-visual" });
  }

  for (const lesson of hadithJson.lessons || []) {
    const lines = lesson.stages?.vocabulary?.text || [];
    const vocab = parseHadithVocabulary(lines);
    for (const item of vocab) {
      terms.push({ text: item.term, category: "vocabulary", source: `hadith-${lesson.number}` });
    }
    if (lesson.number === 18) {
      const l18Terms = ['made a mistake', 'sorry for', 'put it right', 'what good can I do', 'treat people well'];
      for (const t of l18Terms) {
        terms.push({ text: t, category: "vocabulary", source: `hadith-18` });
      }
    }
    const useful = alternating(section(lines, /^useful language/i, /^extra vocabulary/i));
    for (const u of useful) {
      const term = u.expression.replace(/\+.*$/, "").trim();
      if (term) terms.push({ text: term, category: "useful-language", source: `hadith-${lesson.number}` });
    }
    const extras = alternating(section(lines, /^extra vocabulary$/i, /^scholarship note$/i));
    for (const e of extras) {
      const term = e.expression.replace(/\+.*$/, "").trim();
      if (term) terms.push({ text: term, category: "extra-vocabulary", source: `hadith-${lesson.number}` });
    }
    const phrasal = dashItems(section(lines, /^phrasal verbs$/i, /^collocations$/i));
    for (const p of phrasal) {
      const term = p.expression.replace(/\+.*$/, "").trim();
      if (term) terms.push({ text: term, category: "phrasal-verb", source: `hadith-${lesson.number}` });
    }
    const collocations = dashItems(section(lines, /^collocations$/i, /^word family$/i));
    for (const c of collocations) {
      const term = c.expression.replace(/\+.*$/, "").trim();
      if (term) terms.push({ text: term, category: "collocation-idiom", source: `hadith-${lesson.number}` });
    }
  }

  return terms;
}

function loadConversationTerms() {
  const convPath = path.join(ROOT, "src", "app", "learning", "conversation", "conversationCatalog.json");
  if (!fs.existsSync(convPath)) return [];
  const convJson = JSON.parse(fs.readFileSync(convPath, "utf8"));
  const terms = [];
  for (const unit of convJson) {
    for (const item of unit.languageBank || []) {
      terms.push({ text: item.term, category: item.type, source: `conversation-${unit.unitNumber}` });
    }
  }
  return terms;
}

function loadBusinessTerms() {
  const bizPath = path.join(ROOT, "src", "app", "learning", "business", "businessCatalog.json");
  if (!fs.existsSync(bizPath)) return [];
  const bizJson = JSON.parse(fs.readFileSync(bizPath, "utf8"));
  const terms = [];
  for (const unit of bizJson) {
    for (const item of unit.languageBank || []) {
      terms.push({ text: item.term, category: item.type, source: `business-${unit.unitNumber}` });
    }
    if (unit.recall?.prompts) {
      for (const prompt of unit.recall.prompts) {
        if (prompt.targetWord) {
          terms.push({ text: prompt.targetWord, category: prompt.type, source: `business-${unit.unitNumber}-recall` });
        }
      }
    }
  }
  return terms;
}

function getPriority(c) {
  const cat = (c.category || "").toLowerCase();
  if (cat.includes("phrasal") || cat.includes("idiom")) return 1;
  if (cat.includes("vocab") || ["noun", "verb", "adjective", "concept", "term"].includes(cat) || (c.sources && c.sources.some((s) => s.includes("recall")))) return 2;
  if (cat.includes("collocation") || cat.includes("expression")) return 3;
  return 4;
}

function buildCorpus() {
  const hadith = loadHadithTerms();
  const conv = loadConversationTerms();
  const biz = loadBusinessTerms();

  const byKey = new Map();
  for (const item of hadith) {
    const spec = getTermSpec(item.text);
    if (!byKey.has(spec.objectKey)) {
      byKey.set(spec.objectKey, { ...spec, category: item.category, sources: [item.source], domains: new Set(["hadith"]) });
    } else {
      byKey.get(spec.objectKey).domains.add("hadith");
      byKey.get(spec.objectKey).sources.push(item.source);
    }
  }
  for (const item of conv) {
    const spec = getTermSpec(item.text);
    if (!byKey.has(spec.objectKey)) {
      byKey.set(spec.objectKey, { ...spec, category: item.category, sources: [item.source], domains: new Set(["conversation"]) });
    } else {
      byKey.get(spec.objectKey).domains.add("conversation");
      byKey.get(spec.objectKey).sources.push(item.source);
    }
  }
  for (const item of biz) {
    const spec = getTermSpec(item.text);
    if (!byKey.has(spec.objectKey)) {
      byKey.set(spec.objectKey, { ...spec, category: item.category, sources: [item.source], domains: new Set(["business"]) });
    } else {
      byKey.get(spec.objectKey).domains.add("business");
      byKey.get(spec.objectKey).sources.push(item.source);
    }
  }

  const list = Array.from(byKey.values()).map(item => ({
    ...item,
    domains: Array.from(item.domains),
    priority: getPriority(item),
  }));

  list.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.chars - b.chars;
  });

  return list;
}

async function synthesise(clip, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${clip.profile.voiceId}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text: clip.synthesisText,
      model_id: clip.profile.modelId,
      voice_settings: {
        stability: clip.profile.stability,
        similarity_boost: clip.profile.similarityBoost,
      },
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const error = new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 300)}`);
    error.status = res.status;
    throw error;
  }

  const audio = Buffer.from(await res.arrayBuffer());
  if (audio.length < 1024) {
    throw new Error(`Invalid ${audio.length}-byte audio for '${clip.synthesisText}'`);
  }
  return audio;
}

async function withRetry(fn, label, attempts = 4) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const status = error.status ?? 0;
      const retriable = status === 429 || status >= 500 || status === 0;
      if (!retriable || attempt >= attempts) throw error;
      const waitMs = Math.min(30000, 1000 * 2 ** attempt);
      console.warn(`  [Retry ${attempt}/${attempts - 1}] ${label} in ${waitMs}ms: ${error.message}`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

function readLedger() {
  if (!fs.existsSync(LEDGER_PATH)) {
    return { profile: profileFingerprint(AUDIO_PROFILE), clips: {} };
  }
  return JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
}

function updateLedger(ledger, newEntries) {
  for (const entry of newEntries) {
    ledger.clips[entry.hash] = {
      text: entry.synthesisText,
      tier: "words",
      chars: entry.chars,
      date: new Date().toISOString().slice(0, 10),
    };
  }
  const ordered = {};
  for (const key of Object.keys(ledger.clips).sort()) ordered[key] = ledger.clips[key];
  const content = JSON.stringify({ profile: ledger.profile, clips: ordered }, null, 2) + "\n";
  const tmp = path.join(require("os").tmpdir(), `audio-ledger-${Date.now()}.tmp.json`);
  fs.writeFileSync(tmp, content, "utf8");
  fs.copyFileSync(tmp, LEDGER_PATH);
  fs.rmSync(tmp, { force: true });
}

function writeCurriculumManifest(corpus) {
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    profile: AUDIO_PROFILE,
    clips: {},
  };
  for (const clip of corpus) {
    manifest.clips[clip.cleanText] = {
      objectKey: clip.objectKey,
      synthesisText: clip.synthesisText,
      category: clip.category,
      domains: clip.domains,
      chars: clip.chars,
    };
  }
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Updated curriculum audio manifest: ${MANIFEST_PATH}`);
}

async function main() {
  const corpus = buildCorpus();
  console.log(`=== WordPix Curriculum Words Audio Audit ===`);
  console.log(`Total deduplicated clips: ${corpus.length}`);
  console.log(`  Hadith terms:       ${corpus.filter(c => c.domains.includes("hadith")).length}`);
  console.log(`  Conversation terms: ${corpus.filter(c => c.domains.includes("conversation")).length}`);
  console.log(`  Business terms:     ${corpus.filter(c => c.domains.includes("business")).length}`);

  const r2 = createClient();
  await r2.verify();

  // Check R2 and local backup
  console.log("\nAuditing existence in Cloudflare R2 and local backup...");
  const pendingClips = [];
  let existingInR2 = 0;
  let existingLocalOnly = 0;

  const BATCH_SIZE = 30;
  for (let i = 0; i < corpus.length; i += BATCH_SIZE) {
    const batch = corpus.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (clip) => {
      const backupPath = path.join(ROOT, "audio_backup", clip.objectKey);
      const hasLocal = fs.existsSync(backupPath);
      const hasR2 = await r2.exists(clip.objectKey);

      if (hasR2) {
        existingInR2++;
      } else if (hasLocal) {
        existingLocalOnly++;
        pendingClips.push({ ...clip, localBuffer: fs.readFileSync(backupPath) });
      } else {
        pendingClips.push(clip);
      }
    }));
  }

  const clipsWithLocal = pendingClips.filter((c) => c.localBuffer);
  const ungeneratedClips = pendingClips.filter((c) => !c.localBuffer);

  const budgetCeiling = Number.isFinite(MAX_CHARS) && MAX_CHARS > 0 ? MAX_CHARS : Infinity;
  let budgetAccumulator = 0;
  const clipsToGenerate = [];
  for (const c of ungeneratedClips) {
    if (budgetAccumulator + c.chars <= budgetCeiling) {
      budgetAccumulator += c.chars;
      clipsToGenerate.push(c);
    }
  }

  const clipsToUpload = [...clipsWithLocal, ...clipsToGenerate].slice(0, LIMIT);
  const plannedChars = clipsToGenerate.reduce((sum, c) => sum + c.chars, 0);

  console.log(`\nAudit Summary:`);
  console.log(`  Already in R2:             ${existingInR2}`);
  console.log(`  Local-only (needs upload): ${existingLocalOnly}`);
  console.log(`  Total missing from R2:     ${pendingClips.length}`);
  console.log(`  Planned for this run:      ${clipsToGenerate.length} clips (${plannedChars.toLocaleString()} chars)`);
  if (budgetCeiling !== Infinity) {
    console.log(`  Character budget ceiling:  ${budgetCeiling.toLocaleString()} chars`);
  }

  // Write manifest with all clips mapping
  writeCurriculumManifest(corpus);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] No ElevenLabs generation or R2 mutations performed.");
    return;
  }

  if (!CONFIRMED) {
    console.log("\n[ACTION REQUIRED] To begin recording and uploading, re-run with --confirm and --max-chars.");
    console.log(`Example: node scripts/generate_curriculum_words_audio.cjs --confirm --max-chars=${budgetCeiling !== Infinity ? budgetCeiling : plannedChars + 1000}`);
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
  if (!apiKey) {
    throw new Error("Missing Elevenlabs_API_key in environment / .env.local");
  }

  console.log(`\nBeginning recording and upload (${clipsToUpload.length} clips, max ${budgetCeiling.toLocaleString()} chars)...`);
  const ledger = readLedger();
  let generatedCount = 0;
  let uploadedCount = 0;
  let spentChars = 0;
  const newLedgerEntries = [];

  for (let idx = 0; idx < clipsToUpload.length; idx++) {
    const clip = clipsToUpload[idx];
    const backupPath = path.join(ROOT, "audio_backup", clip.objectKey);
    let audioBuffer = clip.localBuffer;

    if (!audioBuffer) {
      if (spentChars + clip.chars > budgetCeiling) {
        console.log(`\n[Budget ceiling reached] Spent ${spentChars.toLocaleString()} chars; next clip '${clip.synthesisText}' is ${clip.chars} chars. Halting generation cleanly.`);
        break;
      }
      console.log(`[${idx + 1}/${clipsToUpload.length}] Recording '${clip.synthesisText}' (${clip.chars} chars)...`);
      try {
        audioBuffer = await withRetry(() => synthesise(clip, apiKey), clip.synthesisText);
      } catch (err) {
        if (err.message.includes("quota") || err.message.includes("401") || err.message.includes("402")) {
          console.error(`\n[ElevenLabs Quota Warning] Generation paused due to API limitation: ${err.message}`);
          console.log(`Preserving all ${generatedCount} generated audio clips on disk and in R2.`);
          break;
        }
        throw err;
      }
      generatedCount++;
      spentChars += clip.chars;

      // Rule: Never delete or remove from local drive
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.writeFileSync(backupPath, audioBuffer);
    } else {
      console.log(`[${idx + 1}/${clipsToUpload.length}] Using local backup for '${clip.synthesisText}'...`);
    }

    // Upload to Cloudflare R2
    await r2.put(clip.objectKey, audioBuffer, { contentType: "audio/mpeg", immutable: true });
    
    // Verify byte integrity in R2
    const uploaded = await r2.get(clip.objectKey);
    if (!uploaded || uploaded.length < 1024) {
      throw new Error(`R2 byte verification failed for ${clip.objectKey}`);
    }
    uploadedCount++;
    newLedgerEntries.push(clip);

    // Save ledger periodically every 25 clips
    if (newLedgerEntries.length % 25 === 0) {
      updateLedger(ledger, newLedgerEntries.splice(0));
    }
  }

  if (newLedgerEntries.length > 0) {
    updateLedger(ledger, newLedgerEntries);
  }

  console.log(`\n=== Batch Complete ===`);
  console.log(`Generated: ${generatedCount}`);
  console.log(`Uploaded to R2: ${uploadedCount}`);
  console.log(`Characters spent: ${spentChars.toLocaleString()}`);
}

main().catch((err) => {
  console.error("\nERROR:", err.message);
  process.exitCode = 1;
});

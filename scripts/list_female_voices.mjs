import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

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

async function run() {
  const res = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": API_KEY }
  });
  const data = await res.json();
  const femaleVoices = (data.voices || []).filter(v => v.labels?.gender === "female");
  console.log(`Found ${femaleVoices.length} female voices:`);
  for (const v of femaleVoices) {
    console.log(`- ${v.name} (${v.voice_id}): accent=${v.labels?.accent}, age=${v.labels?.age}, desc=${v.labels?.description || v.labels?.use_case}`);
  }
}

run().catch(console.error);

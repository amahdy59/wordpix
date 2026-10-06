import { readFile } from "node:fs/promises";
const env = Object.fromEntries((await readFile(".env.local", "utf8")).split(/\r?\n/u).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => { const index = line.indexOf("="); return [line.slice(0,index), line.slice(index+1).trim()]; }));
const key = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key || env.ELEVENLABS_API_KEY || env.Elevenlabs_API_key;
if (!key) throw new Error("No ElevenLabs key found");
const response = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": key } });
const body = await response.text();
let parsed; try { parsed = JSON.parse(body); } catch { parsed = { raw: body.slice(0, 300) }; }
if (!response.ok) { console.log(JSON.stringify({ ok: false, status: response.status, error: parsed })); process.exitCode = 1; }
else console.log(JSON.stringify({ ok: true, status: response.status, tier: parsed.tier, character_count: parsed.character_count, character_limit: parsed.character_limit, remaining: typeof parsed.character_limit === "number" && typeof parsed.character_count === "number" ? parsed.character_limit - parsed.character_count : null, can_generate_required: typeof parsed.character_limit === "number" && typeof parsed.character_count === "number" ? parsed.character_limit - parsed.character_count >= 1084064 : null }));

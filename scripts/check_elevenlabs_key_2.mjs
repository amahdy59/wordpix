import { readFile } from "node:fs/promises";
const line = (await readFile(".env.local", "utf8")).split(/\r?\n/u).find((value) => value.startsWith("Elevenlabs_API_key_2="));
const key = line?.slice(line.indexOf("=") + 1).trim();
if (!key) throw new Error("Elevenlabs_API_key_2 is missing or empty");
for (const endpoint of ["https://api.elevenlabs.io/v1/user/subscription", "https://api.elevenlabs.io/v1/models"]) {
  const response = await fetch(endpoint, { headers: { "xi-api-key": key } });
  const payload = await response.json().catch(() => ({}));
  if (endpoint.endsWith("subscription")) {
    console.log(JSON.stringify({ endpoint, status: response.status, tier: payload.tier, character_count: payload.character_count, character_limit: payload.character_limit, remaining: typeof payload.character_limit === "number" && typeof payload.character_count === "number" ? payload.character_limit - payload.character_count : null, error: payload.detail }));
  } else {
    const models = Array.isArray(payload) ? payload : [];
    console.log(JSON.stringify({ endpoint, status: response.status, models: models.filter((model) => /v4|v3|turbo|flash/iu.test(model.model_id ?? "")).map((model) => ({ model_id: model.model_id, name: model.name, can_do_text_to_speech: model.can_do_text_to_speech })) , error: payload.detail }));
  }
}

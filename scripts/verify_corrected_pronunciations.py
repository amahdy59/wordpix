"""Transcribe locally backed-up pronunciation overrides for post-upload QA."""

import hashlib
import json
from pathlib import Path

from faster_whisper import WhisperModel


ROOT = Path(__file__).resolve().parents[1]
VOICE = "XfNU2rGpBa01ckF309OY"
BASE_PROFILE = {
    "voiceId": VOICE,
    "modelId": "eleven_turbo_v2_5",
    "stability": 0.7,
    "similarityBoost": 0.75,
}


def fingerprint(profile: dict) -> str:
    return "|".join(str(profile[key]) for key in ("voiceId", "modelId", "stability", "similarityBoost"))


overrides = json.loads((ROOT / "src/app/shared/pronunciationOverrides.json").read_text(encoding="utf-8"))[1:]
model = WhisperModel("base.en", device="cpu", compute_type="int8")
rows = []
for override in overrides:
    profile = {**BASE_PROFILE, **override.get("profile", {})}
    payload = f'{fingerprint(profile)}\n{override["synthesisText"]}'.encode()
    hash_value = hashlib.sha256(payload).hexdigest()
    path = ROOT / "audio_backup/audio" / hash_value[:2] / f"{hash_value}.mp3"
    segments, _ = model.transcribe(str(path), language="en", beam_size=3, condition_on_previous_text=False)
    transcript = " ".join(segment.text.strip() for segment in segments).strip()
    rows.append({"labels": override["matches"], "hash": hash_value, "transcript": transcript})
    print(f'{override["matches"][0]}: {transcript}', flush=True)

output = ROOT / "output/corrected-pronunciation-verification.json"
output.write_text(json.dumps(rows, indent=2), encoding="utf-8")
print(f"Wrote {output}")

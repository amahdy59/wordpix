"""Prepare one exact local recording for an editorial proposal; never upload/link."""
import argparse
import asyncio
import hashlib
import json
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
TEXT = "High humidity makes the air feel damp."
VOICE = "en-US-JennyNeural"
PAYLOAD = f"edge-v1|{VOICE}|rate=+0%|pitch=+0Hz|volume=+0%\n{TEXT}"
DIGEST = hashlib.sha256(PAYLOAD.encode()).hexdigest()
DIRECTORY = ROOT / "output/media-followup-2026-10-30/humidity-repair"

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    DIRECTORY.mkdir(parents=True, exist_ok=True)
    audio = DIRECTORY / f"{DIGEST}.mp3"
    proposal = {
        "schemaVersion": 1, "status": "local-draft-not-applied", "original": "Echoes fade, and humidity swelters.",
        "replacement": TEXT, "language": "en", "voice": VOICE,
        "proposedKey": f"audio/edge-v1/{VOICE}/{DIGEST}.mp3", "file": audio.relative_to(ROOT).as_posix(),
        "contentReview": "The replacement uses humidity as the noun meaning moisture in the air and removes the unnatural predicate swelters. A forest photo may support the setting, but cannot measure humidity.",
        "r2Writes": 0, "mappingChanges": 0, "runtimeTextChanges": 0,
    }
    if args.execute:
        import edge_tts
        if audio.exists():
            if audio.stat().st_size <= 512: raise RuntimeError("Existing draft is incomplete; retain it for investigation")
        else:
            temporary = DIRECTORY / f"{DIGEST}.{os.getpid()}.part"
            if temporary.exists(): raise RuntimeError("Retain existing partial draft for investigation")
            await edge_tts.Communicate(TEXT, VOICE, rate="+0%", pitch="+0Hz", volume="+0%").save(str(temporary))
            if temporary.stat().st_size <= 512: raise RuntimeError("Generated recording is empty or incomplete")
            temporary.rename(audio)
        proposal.update({"bytes": audio.stat().st_size, "sha256": hashlib.sha256(audio.read_bytes()).hexdigest()})
        sample = {"summary": {"sampleSize": 1, "purpose": "Unpublished editorial repair candidate", "r2Writes": 0, "mappingChanges": 0}, "clips": [{"key": proposal["proposedKey"], "expected": TEXT, "language": "en", "category": "content-repair-draft", "file": proposal["file"], "sha256": proposal["sha256"], "bytes": proposal["bytes"]}]}
        (DIRECTORY / "sample.json").write_text(json.dumps(sample, indent=2), encoding="utf-8")
        (DIRECTORY / "listen.html").write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><title>Humidity editorial repair draft</title><body><h1>Unpublished content repair</h1><p>Original: {proposal["original"]}</p><p>Proposed: {TEXT}</p><audio controls preload="none" aria-label="Listen to the proposed humidity sentence" src="{audio.name}"></audio><p>No runtime text, mapping or R2 object has changed.</p></body></html>', encoding="utf-8")
    (DIRECTORY / "proposal.json").write_text(json.dumps(proposal, indent=2), encoding="utf-8")
    print(json.dumps({**proposal, "mode": "execute-local-only" if args.execute else "dry-run-no-generation"}, indent=2))

if __name__ == "__main__": asyncio.run(main())

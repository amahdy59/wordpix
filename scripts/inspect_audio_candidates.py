"""Inspect local candidate MP3 duration and decoded signal level without mutations."""

import json
import math
from pathlib import Path

import av
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NAMES = {
    "Seven", "Atm", "Bat", "OKR", "Trek", "Hdmi", "cell", "bat", "Tapir",
    "Sedan", "Stand", "Sixteen", "Fins", "Sun", "Van", "Chew", "Feta",
    "Foam", "Ikat", "Part", "Route Number", "Baton", "Dozen", "Pet", "Yen",
}

report = json.loads((ROOT / "output/audio-pronunciation-priority-review.json").read_text())
rows = []
for item in report["results"]:
    if item["expected"] not in NAMES:
        continue
    path = ROOT / "audio_backup/audio" / item["hash"][:2] / f'{item["hash"]}.mp3'
    samples = []
    duration = 0.0
    with av.open(str(path)) as container:
        stream = container.streams.audio[0]
        if stream.duration is not None:
            duration = float(stream.duration * stream.time_base)
        for frame in container.decode(stream):
            samples.append(frame.to_ndarray().astype(np.float64).ravel())
    data = np.concatenate(samples) if samples else np.array([], dtype=np.float64)
    rms = math.sqrt(float(np.mean(data * data))) if data.size else 0.0
    rows.append({
        "expected": item["expected"], "transcript": item["transcript"],
        "hash": item["hash"], "bytes": path.stat().st_size,
        "durationSeconds": round(duration, 3), "rms": round(rms, 2),
    })
print(json.dumps(rows, indent=2))

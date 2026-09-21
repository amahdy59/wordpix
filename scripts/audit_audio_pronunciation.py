"""Read-only pronunciation audit for locally downloaded WordPix audio."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from faster_whisper import WhisperModel


ROOT = Path(__file__).resolve().parents[1]


def normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def distance(left: str, right: str) -> int:
    previous = list(range(len(right) + 1))
    for row, left_char in enumerate(left, 1):
        current = [row]
        for column, right_char in enumerate(right, 1):
            current.append(
                min(
                    current[-1] + 1,
                    previous[column] + 1,
                    previous[column - 1] + (left_char != right_char),
                )
            )
        previous = current
    return previous[-1]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="base.en")
    parser.add_argument("--limit", type=int, default=100)
    parser.add_argument("--shard", type=int, default=0)
    parser.add_argument("--shards", type=int, default=1)
    parser.add_argument("--output", default="output/audio-pronunciation-sample.json")
    parser.add_argument("--review-shards", action="store_true")
    args = parser.parse_args()

    ledger = json.loads((ROOT / "assets/audio-ledger.json").read_text(encoding="utf-8"))
    corpus = json.loads((ROOT / "scratch/audio_corpus.json").read_text(encoding="utf-8"))
    by_hash = {item["hash"]: item for item in corpus}
    candidates = [
        (hash_value, by_hash[hash_value])
        for hash_value in ledger["clips"]
        if hash_value in by_hash and by_hash[hash_value]["tier"] == "words"
    ]
    candidates.sort(key=lambda pair: (len(pair[1]["text"]), pair[1]["text"].lower()))
    if args.review_shards:
        flagged = set()
        for report_path in (ROOT / "output").glob("audio-pronunciation-shard-*.json"):
            report = json.loads(report_path.read_text(encoding="utf-8"))
            flagged.update(
                item["hash"]
                for item in report["results"]
                if item["needsReview"] and item["normalizedDistance"] >= 0.8
            )
        candidates = [candidate for candidate in candidates if candidate[0] in flagged]
    candidates = [
        candidate
        for index, candidate in enumerate(candidates)
        if index % args.shards == args.shard
    ]
    if args.limit and len(candidates) > args.limit:
        step = len(candidates) / args.limit
        candidates = [candidates[min(int(index * step), len(candidates) - 1)] for index in range(args.limit)]

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    results = []
    for index, (hash_value, item) in enumerate(candidates, 1):
        audio_path = ROOT / "audio_backup/audio" / hash_value[:2] / f"{hash_value}.mp3"
        segments, info = model.transcribe(
            str(audio_path), language="en", beam_size=1, vad_filter=False, condition_on_previous_text=False
        )
        transcript = " ".join(segment.text.strip() for segment in segments).strip()
        expected = item["text"]
        expected_normalized = normalized(expected)
        transcript_normalized = normalized(transcript)
        edit_distance = distance(expected_normalized, transcript_normalized)
        score = edit_distance / max(len(expected_normalized), 1)
        results.append(
            {
                "hash": hash_value,
                "expected": expected,
                "transcript": transcript,
                "normalizedDistance": round(score, 4),
                "languageProbability": round(info.language_probability, 4),
                "needsReview": score > 0.34,
            }
        )
        if index % 10 == 0:
            print(f"Audited {index}/{len(candidates)}", flush=True)

    report = {
        "model": args.model,
        "shard": args.shard,
        "shards": args.shards,
        "sampleSize": len(results),
        "needsReview": sum(item["needsReview"] for item in results),
        "results": results,
    }
    output = ROOT / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()

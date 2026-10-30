"""Decode and transcribe an exact-key sample; findings never approve pronunciation."""
from __future__ import annotations
import argparse
import json
import math
import re
import html
import hashlib
from datetime import datetime, timezone
from pathlib import Path
import unicodedata

import av
import numpy as np

ROOT = Path(__file__).resolve().parents[1]


def verify_clip_bytes(file: Path, expected_sha256: str) -> None:
    if not re.fullmatch(r"[a-f0-9]{64}", expected_sha256 or ""):
        raise ValueError("Missing or invalid sampled-byte checksum")
    if hashlib.sha256(file.read_bytes()).hexdigest() != expected_sha256:
        raise ValueError("Local clip changed since the public-byte sample; resample before review")

def normalized(text: str) -> str:
    value = unicodedata.normalize("NFKD", text.casefold())
    return " ".join("".join(char if char.isalnum() or char.isspace() else " " for char in value if not unicodedata.combining(char) and char != "ـ").split())

def edit_distance(left: list[str], right: list[str]) -> int:
    previous = list(range(len(right) + 1))
    for index, word in enumerate(left, 1):
        current = [index]
        for column, other in enumerate(right, 1):
            current.append(min(current[-1] + 1, previous[column] + 1, previous[column - 1] + (word != other)))
        previous = current
    return previous[-1]

def signal_metrics(samples: np.ndarray, rate: int) -> dict:
    if not samples.size or not np.isfinite(samples).all():
        return {"flags": ["empty-or-invalid-decoded-signal"]}
    peak = float(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(samples * samples)))
    width = max(1, round(rate * 0.02))
    windows = np.pad(samples, (0, (-len(samples)) % width)).reshape(-1, width)
    levels = np.sqrt(np.mean(windows * windows, axis=1))
    audible = np.flatnonzero(levels > 10 ** (-45 / 20))
    leading = float(audible[0] * 0.02) if audible.size else len(samples) / rate
    trailing = max(0.0, len(samples) / rate - (int(audible[-1]) + 1) * 0.02) if audible.size else len(samples) / rate
    clipped = float(np.mean(np.abs(samples) >= 0.999))
    flags = []
    if not audible.size: flags.append("silent-or-very-quiet")
    if leading > 0.75: flags.append("review-leading-quiet")
    if trailing > 1.0: flags.append("review-trailing-quiet")
    if clipped > 0.001: flags.append("review-clipping")
    if rms < 10 ** (-35 / 20): flags.append("review-low-level")
    return {"durationSeconds": round(len(samples) / rate, 3), "peakDbfs": round(20 * math.log10(max(peak, 1e-12)), 2), "rmsDbfs": round(20 * math.log10(max(rms, 1e-12)), 2), "leadingQuietSeconds": round(leading, 3), "trailingQuietSeconds": round(trailing, 3), "clippedFraction": round(clipped, 6), "flags": flags}

def decode(file: Path) -> tuple[np.ndarray, int]:
    frames = []
    rate = 0
    with av.open(str(file)) as container:
        stream = container.streams.audio[0]
        resampler = av.AudioResampler(format="fltp", layout="mono", rate=16000)
        for frame in container.decode(stream):
            for output in resampler.resample(frame):
                rate = output.sample_rate
                frames.append(output.to_ndarray().ravel().astype(np.float64))
        for output in resampler.resample(None):
            rate = output.sample_rate
            frames.append(output.to_ndarray().ravel().astype(np.float64))
    return (np.concatenate(frames) if frames else np.array([], dtype=np.float64), rate or 16000)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample", default="output/media-followup-2026-10-30/audio-quality/sample.json")
    parser.add_argument("--transcribe", action="store_true")
    parser.add_argument("--resume", action="store_true")
    args = parser.parse_args()
    source = ROOT / args.sample
    sample = json.loads(source.read_text(encoding="utf-8"))
    results = []
    models = {}
    previous = {}
    if args.resume and (source.parent / "quality-results.json").exists():
        saved = json.loads((source.parent / "quality-results.json").read_text(encoding="utf-8"))
        previous = {row["key"]: row for row in saved["results"]}
    for index, clip in enumerate(sample["clips"], 1):
        prior = previous.get(clip["key"])
        result = {**clip, "listeningApproval": "not-established"}
        try:
            verify_clip_bytes(ROOT / clip["file"], clip.get("sha256", ""))
            if prior and not prior.get("error") and prior.get("sha256") == clip.get("sha256") and prior.get("expected") == clip["expected"] and "signal" in prior and (not args.transcribe or prior.get("asr", {}).get("model") == ("base.en" if clip["language"] == "en" else "base")):
                results.append({**prior, **clip})
                print(f"Reused exact-byte review {index}/{len(sample['clips'])}", flush=True)
                continue
            samples, rate = decode(ROOT / clip["file"])
            result["signal"] = signal_metrics(samples, rate)
            if args.transcribe:
                from faster_whisper import WhisperModel
                language = clip["language"]
                if language not in models:
                    models[language] = WhisperModel("base.en" if language == "en" else "base", device="cpu", compute_type="int8", cpu_threads=4, num_workers=1)
                # Reuse the already decoded mono 16 kHz signal. Avoid a second
                # decoder pass and version-specific av.open keyword arguments.
                segments, _ = models[language].transcribe(samples.astype(np.float32), language=language, beam_size=3, vad_filter=False, condition_on_previous_text=False)
                transcript = " ".join(segment.text.strip() for segment in segments).strip()
                expected_words = normalized(clip["expected"]).split()
                observed_words = normalized(transcript).split()
                wer = edit_distance(expected_words, observed_words) / max(1, len(expected_words))
                result["asr"] = {"model": "base.en" if language == "en" else "base", "transcript": transcript, "wordErrorRate": round(wer, 4), "needsListeningReview": wer > 0.25, "limitation": "ASR disagreement may reflect the recognizer, homophones, numerals or markup; it does not prove mispronunciation or approve stress."}
        except Exception as error:
            result["error"] = str(error)
        results.append(result)
        (source.parent / "quality-results.json").write_text(json.dumps({"summary": sample["summary"], "completed": len(results), "results": results}, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Audited {index}/{len(sample['clips'])}: {clip['category']} ({clip['language']})", flush=True)
    summary = {**sample["summary"], "decoded": sum("signal" in row for row in results), "decodeOrAnalysisErrors": sum("error" in row for row in results), "signalReviewFlags": sum(bool(row.get("signal", {}).get("flags")) for row in results), "asrReviewFlags": sum(row.get("asr", {}).get("needsListeningReview", False) for row in results), "phoneticOrStressApproval": False, "completeListeningAudit": False}
    summary["analysisCompletedAt"] = datetime.now(timezone.utc).isoformat()
    (source.parent / "quality-results.json").write_text(json.dumps({"summary": sample["summary"], "completed": len(results), "results": results}, ensure_ascii=False, indent=2), encoding="utf-8")
    (source.parent / "quality-summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    articles = []
    for index, row in enumerate(results, 1):
        signal = row.get("signal", {})
        asr = row.get("asr", {})
        flags = signal.get("flags", []) + (["ASR disagreement; listen before deciding"] if asr.get("needsListeningReview") else [])
        relative = (ROOT / row["file"]).relative_to(source.parent).as_posix() if row.get("file") else ""
        articles.append(f'<article><h2>{index}. {html.escape(row["category"])}</h2><p>{html.escape("; ".join(flags) if flags else "No automated review flags; pronunciation still requires listening.")}</p><p lang="{row["language"]}" dir="{"rtl" if row["language"] == "ar" else "ltr"}">{html.escape(row["expected"])}</p><audio controls preload="none" aria-label="Listen to review sample {index}" src="{relative}"></audio><details><summary>Signal and transcript evidence</summary><p>{html.escape(asr.get("transcript", "Transcription unavailable"))}</p><p>RMS: {signal.get("rmsDbfs", "unknown")} dBFS; peak: {signal.get("peakDbfs", "unknown")} dBFS; word error rate: {asr.get("wordErrorRate", "unknown")}</p><code>{html.escape(row["key"])}</code></details></article>')
    (source.parent / "listen.html").write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WordPix listening review</title><style>:root{--paper:#fff;--ink:#17202a;--line:#52616b;--focus:#003a8c}body{max-width:60rem;margin:auto;padding:1rem;background:var(--paper);color:var(--ink);font:1rem/1.6 system-ui}article{padding:1rem;border-bottom:2px solid var(--line)}audio{width:100%;min-height:48px}summary{min-height:44px;padding:.5rem;cursor:pointer}code{overflow-wrap:anywhere}:focus-visible{outline:3px solid var(--focus);outline-offset:3px}</style><h1>WordPix listening review</h1><p>Review pronunciation, stress, complete starts and ends, intelligibility and levels. ASR disagreements can reflect homophones, numerals or recognizer errors. Neither a matching transcript nor a clear signal approves pronunciation. Original assets remain unchanged.</p>' + ''.join(articles) + '</html>', encoding="utf-8")
    print(json.dumps(summary, indent=2))
    if summary["decodeOrAnalysisErrors"]:
        raise SystemExit(1)

if __name__ == "__main__": main()

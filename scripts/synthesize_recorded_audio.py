"""Generate new immutable Edge recordings; never replace an existing local file."""
import asyncio
import json
import os
import sys
import bisect
import html
import subprocess
import uuid
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3
import imageio_ffmpeg


def validate(file):
    info = MP3(file).info
    if os.path.getsize(file) < 512 or info.length <= 0.05:
        raise ValueError("Empty or invalid MP3")
    return info.length


def aligned_ranges(items, combined, boundaries):
    """Only accept exact source-word matches and gaps that isolate adjacent takes."""
    if any(len(char.casefold()) != 1 for char in combined):
        raise ValueError("Case folding changes source offsets")
    starts = []
    position = 0
    for item in items:
        starts.append(position)
        position += len(item["text"]) + 2
    words = [[] for _ in items]
    cursor = 0
    for boundary in boundaries:
        token = html.unescape(boundary["text"])
        found = combined.casefold().find(token.casefold(), cursor)
        if found < 0:
            raise ValueError("Word boundary does not match the exact source text")
        if any(char.isalnum() for char in combined[cursor:found]):
            raise ValueError("Word timings omit source content")
        index = bisect.bisect_right(starts, found) - 1
        if index < 0 or found + len(token) > starts[index] + len(items[index]["text"]):
            raise ValueError("Word boundary crosses a recording boundary")
        words[index].append((boundary["offset"] / 10_000_000, (boundary["offset"] + boundary["duration"]) / 10_000_000))
        cursor = found + len(token)
    if any(char.isalnum() for char in combined[cursor:]):
        raise ValueError("Word timings omit the end of source content")
    ranges = []
    for index, segment in enumerate(words):
        if not segment:
            raise ValueError("Recording has no word timing evidence")
        begin, end = segment[0][0], segment[-1][1]
        previous = words[index - 1][-1][1] if index else 0
        following = words[index + 1][0][0] if index + 1 < len(words) else end + 1
        # Hold ambiguous/no-pause boundaries for isolated synthesis.
        safe = (index == 0 or begin - previous >= .08) and following - end >= .08
        ranges.append((max(0, begin - .035), end + .045) if safe else None)
    return ranges

async def main():
    batch = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    semaphore = asyncio.Semaphore(max(1, min(6, int(os.environ.get("WORDPIX_EDGE_CONCURRENCY", "6")))))

    async def one(item):
        async with semaphore:
            target = Path(item["localPath"])
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists():
                return {**item, "duration": validate(target), "status": "existing-local"}
            temporary = target.with_suffix(".partial-" + uuid.uuid4().hex)
            for attempt in range(3):
                try:
                    speech = edge_tts.Communicate(
                        item["text"], voice=item["voice"], rate="+0%", pitch="+0Hz", volume="+0%"
                    )
                    await asyncio.wait_for(speech.save(str(temporary)), timeout=90)
                    duration = validate(temporary)
                    # Hard-link creation is atomic and fails if another job created the target.
                    os.link(temporary, target)
                    temporary.unlink()
                    return {**item, "duration": duration, "status": "generated"}
                except FileExistsError:
                    return {**item, "duration": validate(target), "status": "existing-local"}
                except Exception as error:
                    if attempt == 2:
                        return {**item, "status": "error", "error": str(error)}
                    await asyncio.sleep(min(30, 3 * 2**attempt))


    async def grouped(items):
        if len(items) == 1:
            return [await one(items[0])]
        # Existing local recordings are never replaced or re-encoded.
        if any(Path(item["localPath"]).exists() for item in items):
            return list(await asyncio.gather(*(one(item) for item in items)))
        # Each fragment is a separate utterance in the app. Sentence punctuation
        # gives it the same complete pause when sharing a synthesis request.
        rendered = [{**item, "text": item["text"] if item["text"].endswith((".", "!", "?", "؟", "…")) else item["text"] + "."} for item in items]
        combined = "\n\n".join(item["text"] for item in rendered)
        bundle = Path(items[0]["localPath"]).parent / ("batch-" + uuid.uuid4().hex + ".mp3")
        bundle.parent.mkdir(parents=True, exist_ok=True)
        boundaries = []
        try:
            async with semaphore:
                speech = edge_tts.Communicate(combined, voice=items[0]["voice"], rate="+0%", pitch="+0Hz", volume="+0%", boundary="WordBoundary")
                with bundle.open("xb") as output:
                    async for chunk in speech.stream():
                        if chunk["type"] == "audio":
                            output.write(chunk["data"])
                        elif chunk["type"] == "WordBoundary":
                            boundaries.append(chunk)
            validate(bundle)
            ranges = aligned_ranges(rendered, combined, boundaries)
            arguments = [imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-n", "-i", str(bundle)]
            cuts = []
            for item, timing in zip(items, ranges):
                if timing is None:
                    continue
                temporary = Path(item["localPath"]).with_suffix(".cut-" + uuid.uuid4().hex + ".mp3")
                temporary.parent.mkdir(parents=True, exist_ok=True)
                begin, end = timing
                arguments += ["-map", "0:a:0", "-af", f"atrim=start={begin:.7f}:end={end:.7f},asetpts=PTS-STARTPTS", "-ac", "1", "-ar", "24000", "-b:a", "48k", str(temporary)]
                cuts.append((item, temporary))
            if cuts:
                run = await asyncio.to_thread(subprocess.run, arguments, capture_output=True, timeout=120, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
                if run.returncode:
                    raise ValueError("MP3 segmentation failed")
            results = {}
            for item, temporary in cuts:
                duration = validate(temporary)
                os.link(temporary, item["localPath"])
                temporary.unlink()
                results[item["edgeKey"]] = {**item, "duration": duration, "status": "generated", "method": "exact-word-boundary", "timingValidated": True}
            for result in await asyncio.gather(*(one(item) for item in items if item["edgeKey"] not in results)):
                results[result["edgeKey"]] = result
            bundle.unlink()
            return list(results.values())
        except Exception as error:
            print(json.dumps({"isolatedFallback": len(items), "reason": str(error)[:160]}), flush=True)
            # No guessed timing: isolated synthesis is the correctness fallback.
            return list(await asyncio.gather(*(one(item) for item in items)))

    groups = []
    current = []
    characters = 0
    for item in batch:
        if current and (len(current) >= 48 or current[0]["voice"] != item["voice"] or characters + len(item["text"]) > 2400):
            groups.append(current)
            current, characters = [], 0
        current.append(item)
        characters += len(item["text"]) + 2
    if current:
        groups.append(current)
    results = [item for group in await asyncio.gather(*(grouped(group) for group in groups)) for item in group]
    Path(sys.argv[2]).write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    errors = sum(item["status"] == "error" for item in results)
    print(json.dumps({"clips": len(results), "errors": errors}), flush=True)
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

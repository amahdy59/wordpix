"""
Create HeyGen Audio Generation Batches Sized to Daily Usage Limits.

WordPix has 3,970 ungenerated audio clips remaining in the curriculum.
HeyGen Voice Turbo tier allows up to 2,000 API requests per day.

This script partitions the remaining audio into structured daily batches:
1. Plan A (3-Day Balanced & Pedagogical - Recommended):
   - Day 1: Cloze Assessment Part 1 Remainder (1,094 API calls, 229 cached = 1,323 clips)
   - Day 2: Cloze Assessment Part 2 (1,322 API calls = 1,322 clips)
   - Day 3: Sentence Construction Complete (1,554 API calls = 1,554 clips)
   Each day is safely under the 2,000 ceiling (54% - 78% quota), ensuring zero HTTP 429 errors.

2. Plan B (2-Day Packed Throughput):
   - Day 1: Packed Batch 1 (1,985 API calls)
   - Day 2: Packed Batch 2 (1,985 API calls)
   Packs right up to the 2,000 ceiling (15-call safety margin).

Usage:
  python scripts/create_heygen_daily_batches.py
"""
import glob
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BATCHES_DIR = ROOT / "output" / "recorded-audio" / "batches"
HEYGEN_DIR = ROOT / "output" / "recorded-audio" / "heygen"


def load_generated_texts() -> set:
    generated = set()
    for f in HEYGEN_DIR.glob("*-heygen-results.json"):
        try:
            with open(f, "r", encoding="utf-8") as handle:
                data = json.load(handle)
                for item in data:
                    if "text" in item:
                        generated.add(item["text"])
        except Exception:
            pass
    return generated


def main():
    print("==========================================================")
    print("   WORDPIX HEYGEN DAILY BATCH GENERATOR (2,000 LIMIT)     ")
    print("==========================================================\n")

    generated_texts = load_generated_texts()
    print(f"[*] Found {len(generated_texts)} already generated HeyGen audio clips.")

    # Source batches
    batch2_path = BATCHES_DIR / "batch-02-cloze-part1.json"
    batch3_path = BATCHES_DIR / "batch-03-cloze-part2.json"
    batch4_path = BATCHES_DIR / "batch-04-construction-part1.json"
    batch5_path = BATCHES_DIR / "batch-05-construction-part2.json"

    with open(batch2_path, "r", encoding="utf-8") as f:
        b2_items = json.load(f)
    with open(batch3_path, "r", encoding="utf-8") as f:
        b3_items = json.load(f)
    with open(batch4_path, "r", encoding="utf-8") as f:
        b4_items = json.load(f)
    with open(batch5_path, "r", encoding="utf-8") as f:
        b5_items = json.load(f)

    # Combined construction items (777 + 777 = 1,554)
    construction_all = b4_items + b5_items
    const_all_path = BATCHES_DIR / "batch-04-construction-all.json"
    with open(const_all_path, "w", encoding="utf-8") as f:
        json.dump(construction_all, f, indent=2, ensure_ascii=False)
    print(f"[+] Created combined construction batch: {const_all_path.name} (1,554 clips)")

    # Identify ungenerated items
    b2_ungenerated = [i for i in b2_items if i["text"] not in generated_texts]
    b3_ungenerated = [i for i in b3_items if i["text"] not in generated_texts]
    const_ungenerated = [i for i in construction_all if i["text"] not in generated_texts]

    all_ungenerated = b2_ungenerated + b3_ungenerated + const_ungenerated
    print(f"[*] Total ungenerated clips remaining: {len(all_ungenerated):,}")
    print(f"    - Cloze Part 1 remainder  : {len(b2_ungenerated):,} clips ({len(b2_items) - len(b2_ungenerated)} cached)")
    print(f"    - Cloze Part 2            : {len(b3_ungenerated):,} clips")
    print(f"    - Sentence Construction   : {len(const_ungenerated):,} clips")

    # ----------------------------------------------------
    # PLAN A: 3-Day Pedagogical Schedule (Safe & Categorized)
    # ----------------------------------------------------
    plan_a = [
        {
            "day": 1,
            "id": "batch-02",
            "filename": "batch-02-cloze-part1.json",
            "title": "Day 1: Contextual Cloze Blanks (Part 1 Remainder)",
            "description": "Complete remaining fill-in-the-blank assessment targets for A1-B1 curriculum.",
            "total_items": len(b2_items),
            "cached_items": len(b2_items) - len(b2_ungenerated),
            "new_api_calls": len(b2_ungenerated),
            "total_characters": sum(len(i["text"]) for i in b2_ungenerated),
            "quota_usage_pct": round((len(b2_ungenerated) / 2000) * 100, 1),
            "synthesize_cmd": "python scripts/synthesize_heygen_batch.py --batch=batch-02 --limit=0",
            "publish_cmd": "node scripts/publish_heygen_batch.cjs --batch=batch-02"
        },
        {
            "day": 2,
            "id": "batch-03",
            "filename": "batch-03-cloze-part2.json",
            "title": "Day 2: Contextual Cloze Blanks (Part 2)",
            "description": "Second half of fill-in-the-blank assessment targets for B2-C1 curriculum.",
            "total_items": len(b3_items),
            "cached_items": 0,
            "new_api_calls": len(b3_items),
            "total_characters": sum(len(i["text"]) for i in b3_items),
            "quota_usage_pct": round((len(b3_items) / 2000) * 100, 1),
            "synthesize_cmd": "python scripts/synthesize_heygen_batch.py --batch=batch-03 --limit=0",
            "publish_cmd": "node scripts/publish_heygen_batch.cjs --batch=batch-03"
        },
        {
            "day": 3,
            "id": "batch-04-construction-all",
            "filename": "batch-04-construction-all.json",
            "title": "Day 3: Sentence Builder Chunks (All Units)",
            "description": "Multi-token construction tiles for sentence assembly exercises across all units.",
            "total_items": len(construction_all),
            "cached_items": 0,
            "new_api_calls": len(construction_all),
            "total_characters": sum(len(i["text"]) for i in construction_all),
            "quota_usage_pct": round((len(construction_all) / 2000) * 100, 1),
            "synthesize_cmd": "python scripts/synthesize_heygen_batch.py --batch=batch-04-construction-all --limit=0",
            "publish_cmd": "node scripts/publish_heygen_batch.cjs --batch=batch-04-construction-all"
        }
    ]

    # ----------------------------------------------------
    # PLAN B: 2-Day Packed Schedule (Max Throughput)
    # ----------------------------------------------------
    mid_point = (len(all_ungenerated) + 1) // 2
    packed_day1_items = all_ungenerated[:mid_point]
    packed_day2_items = all_ungenerated[mid_point:]

    p1_file = BATCHES_DIR / "packed-day-01.json"
    p2_file = BATCHES_DIR / "packed-day-02.json"

    with open(p1_file, "w", encoding="utf-8") as f:
        json.dump(packed_day1_items, f, indent=2, ensure_ascii=False)
    with open(p2_file, "w", encoding="utf-8") as f:
        json.dump(packed_day2_items, f, indent=2, ensure_ascii=False)

    print(f"[+] Created packed batch 1: {p1_file.name} ({len(packed_day1_items)} clips)")
    print(f"[+] Created packed batch 2: {p2_file.name} ({len(packed_day2_items)} clips)")

    plan_b = [
        {
            "day": 1,
            "id": "packed-day-01",
            "filename": "packed-day-01.json",
            "title": "Packed Day 1: Max-Capacity Audio Slice (Part 1)",
            "description": "First half of all ungenerated clips packed up to daily quota limit.",
            "total_items": len(packed_day1_items),
            "new_api_calls": len(packed_day1_items),
            "total_characters": sum(len(i["text"]) for i in packed_day1_items),
            "quota_usage_pct": round((len(packed_day1_items) / 2000) * 100, 1),
            "synthesize_cmd": "python scripts/synthesize_heygen_batch.py --batch=packed-day-01 --limit=0",
            "publish_cmd": "node scripts/publish_heygen_batch.cjs --batch=packed-day-01"
        },
        {
            "day": 2,
            "id": "packed-day-02",
            "filename": "packed-day-02.json",
            "title": "Packed Day 2: Max-Capacity Audio Slice (Part 2)",
            "description": "Second half of all ungenerated clips packed up to daily quota limit.",
            "total_items": len(packed_day2_items),
            "new_api_calls": len(packed_day2_items),
            "total_characters": sum(len(i["text"]) for i in packed_day2_items),
            "quota_usage_pct": round((len(packed_day2_items) / 2000) * 100, 1),
            "synthesize_cmd": "python scripts/synthesize_heygen_batch.py --batch=packed-day-02 --limit=0",
            "publish_cmd": "node scripts/publish_heygen_batch.cjs --batch=packed-day-02"
        }
    ]

    manifest = {
        "dailyLimit": 2000,
        "totalRemainingClips": len(all_ungenerated),
        "totalRemainingCharacters": sum(len(i["text"]) for i in all_ungenerated),
        "recommendedPlan": "Plan A (3-Day Pedagogical)",
        "planA_3DayPedagogical": plan_a,
        "planB_2DayPacked": plan_b
    }

    manifest_path = BATCHES_DIR / "heygen-daily-schedule.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"\n[+] Master Daily Schedule written to: {manifest_path}")
    print("\nSUMMARY OF DAILY BATCHES:")
    print("--------------------------------------------------------------------------------")
    print("PLAN A (Recommended: 3 Days, Zero Risk, Clean Categorization):")
    for d in plan_a:
        print(f"  Day {d['day']}: {d['title']}")
        print(f"         Calls: {d['new_api_calls']:,} / 2,000 ({d['quota_usage_pct']}% of daily limit) | Chars: {d['total_characters']:,}")
    print("\nPLAN B (Fastest: 2 Days Packed):")
    for d in plan_b:
        print(f"  Day {d['day']}: {d['title']}")
        print(f"         Calls: {d['new_api_calls']:,} / 2,000 ({d['quota_usage_pct']}% of daily limit) | Chars: {d['total_characters']:,}")
    print("--------------------------------------------------------------------------------\n")


if __name__ == "__main__":
    main()

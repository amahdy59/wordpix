"""Validate and generate unit-scoped WordPix bilingual catalogue chunks."""

from __future__ import annotations

import argparse
import csv
import json
import pathlib
import re
from collections import Counter


ROOT = pathlib.Path(__file__).resolve().parents[1]
UNITS_DIR = ROOT / "src" / "app" / "data" / "units"
OUTPUT_DIR = ROOT / "src" / "app" / "data" / "bilingual"
MANIFEST_PATH = ROOT / "src" / "app" / "data" / "bilingualCatalogue.generated.ts"
OVERRIDES_PATH = ROOT / "scripts" / "bilingual_content_overrides.json"
ARABIC_RE = re.compile(r"[\u0600-\u06ff]")
GENERIC_DEFINITION_RE = re.compile(r"^A term used in the .+ context\.$", re.IGNORECASE)
GENERIC_EXAMPLE_RE = re.compile(
    r'^(?:The term ["“].+["”] was used in the .+ lesson|The .+ was used during the activity)\.$',
    re.IGNORECASE,
)
GENERIC_ARABIC_RE = re.compile(r"(?:يُسمّى|يسمى)\s*[«\"]")


def app_keys() -> set[tuple[str, str]]:
    result: set[tuple[str, str]] = set()
    for unit_file in UNITS_DIR.glob("*.ts"):
        text = unit_file.read_text(encoding="utf-8")
        for word_id in re.findall(r'\bid:\s*"([^"]+)"', text):
            key = (unit_file.stem, word_id)
            if key in result:
                raise ValueError(f"Duplicate app vocabulary key: {key}")
            result.add(key)
    return result


def load_rows(path: pathlib.Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as source:
        rows = list(csv.DictReader(source))

    required = {
        "unit",
        "word_id",
        "approved_english_definition",
        "approved_arabic_translation",
        "example_usage",
        "approved",
        "definition_review_method",
    }
    missing = required.difference(rows[0] if rows else {})
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(sorted(missing))}")
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=pathlib.Path)
    args = parser.parse_args()

    rows = load_rows(args.csv_path)
    keys = [(row["unit"].strip(), row["word_id"].strip()) for row in rows]
    duplicates = [key for key, count in Counter(keys).items() if count > 1]
    if duplicates:
        raise ValueError(f"Duplicate catalogue keys: {duplicates[:10]}")
    if any(row["approved"].strip().lower() != "yes" for row in rows):
        raise ValueError("Catalogue contains rows that are not approved")

    known_keys = app_keys()
    unknown = sorted(set(keys).difference(known_keys))
    if unknown:
        raise ValueError(f"Catalogue rows missing from app vocabulary: {unknown[:10]}")

    overrides = json.loads(OVERRIDES_PATH.read_text(encoding="utf-8"))
    override_keys = {(unit, word_id) for unit, words in overrides.items() for word_id in words}
    unknown_overrides = sorted(override_keys.difference(keys))
    if unknown_overrides:
        raise ValueError(f"Overrides missing from catalogue: {unknown_overrides[:10]}")

    units: dict[str, dict[str, dict[str, str]]] = {}
    skipped_definitions = 0
    skipped_generic_definitions = 0
    skipped_invalid_definitions = 0
    skipped_generic_examples = 0
    skipped_invalid_arabic = 0
    skipped_untrusted_arabic = 0
    for row in rows:
        unit = row["unit"].strip()
        word_id = row["word_id"].strip()
        override = overrides.get(unit, {}).get(word_id, {})
        unsupported_fields = set(override).difference(
            {"definition", "arabicTranslation", "exampleUsage"}
        )
        if unsupported_fields:
            raise ValueError(f"Unsupported override fields for {unit}/{word_id}: {unsupported_fields}")
        for field, value in override.items():
            if not isinstance(value, str) or not value.strip():
                raise ValueError(f"Blank or non-text override for {unit}/{word_id}/{field}")
        definition = override.get("definition", row["approved_english_definition"]).strip()
        arabic = override.get("arabicTranslation", row["approved_arabic_translation"]).strip()
        example = override.get("exampleUsage", row["example_usage"]).strip()
        if "definition" in override and (len(definition) <= 25 or not definition.endswith(".")):
            raise ValueError(f"Invalid curated definition for {unit}/{word_id}")
        if "arabicTranslation" in override and not ARABIC_RE.search(arabic):
            raise ValueError(f"Invalid curated Arabic gloss for {unit}/{word_id}")
        if "exampleUsage" in override and (GENERIC_EXAMPLE_RE.fullmatch(example) or not example.endswith(".")):
            raise ValueError(f"Invalid curated example for {unit}/{word_id}")
        content: dict[str, str] = {}

        is_generic = (
            (row["definition_review_method"].strip() == "generated_generic" and "definition" not in override)
            or bool(GENERIC_DEFINITION_RE.fullmatch(definition))
        )
        if is_generic or len(definition) <= 25:
            skipped_definitions += 1
            if is_generic:
                skipped_generic_definitions += 1
            if not is_generic:
                skipped_invalid_definitions += 1
        else:
            content["definition"] = definition

        if GENERIC_EXAMPLE_RE.fullmatch(example):
            skipped_generic_examples += 1
        else:
            content["exampleUsage"] = example

        untrusted_arabic = (
            "arabicTranslation" not in override
            and (
                row.get("translation_confidence", "").strip().lower() == "low"
                or row.get("translation_method", "").strip() == "contextual_gloss"
                or bool(GENERIC_ARABIC_RE.search(arabic))
            )
        )
        if untrusted_arabic:
            # An explicit empty string suppresses the older global-id fallback,
            # which can describe a different unit's sense of the same word.
            content["arabicTranslation"] = ""
            skipped_untrusted_arabic += 1
        elif ARABIC_RE.search(arabic):
            content["arabicTranslation"] = arabic
        else:
            content["arabicTranslation"] = ""
            skipped_invalid_arabic += 1

        if content:
            units.setdefault(unit, {})[word_id] = content

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for old_file in OUTPUT_DIR.glob("*.json"):
        old_file.unlink()
    for unit, content in sorted(units.items()):
        (OUTPUT_DIR / f"{unit}.json").write_text(
            json.dumps(content, ensure_ascii=False, separators=(",", ":")) + "\n",
            encoding="utf-8",
        )

    loader_lines = [
        "// GENERATED by scripts/import_bilingual_catalogue.py — do not hand-edit.",
        "export interface BilingualVocabularyContent {",
        "  definition?: string;",
        "  arabicTranslation?: string;",
        "  exampleUsage?: string;",
        "}",
        "",
        "export type UnitBilingualContent = Record<string, BilingualVocabularyContent>;",
        "",
        "export const BEDROOM_BILINGUAL_CONTENT: UnitBilingualContent = {};",
        "",
        "const LOADERS: Record<string, () => Promise<UnitBilingualContent>> = {",
    ]
    for unit in sorted(units):
        loader_lines.append(
            f'  {json.dumps(unit)}: () => import("./bilingual/{unit}.json").then((m) => m.default as UnitBilingualContent),'
        )
    loader_lines.extend(
        [
            "};",
            "",
            "export async function loadBilingualUnit(unitId: string): Promise<UnitBilingualContent> {",
            "  return LOADERS[unitId] ? LOADERS[unitId]() : {};",
            "}",
            "",
        ]
    )
    MANIFEST_PATH.write_text("\n".join(loader_lines), encoding="utf-8")

    print(
        json.dumps(
            {
                "catalogueRows": len(rows),
                "generatedUnits": len(units),
                "appRecordsPreservedOutsideCatalogue": len(known_keys.difference(keys)),
                "definitionsPreservedFromApp": skipped_definitions,
                "genericDefinitionsPreservedFromApp": skipped_generic_definitions,
                "shortDefinitionsPreservedFromApp": skipped_invalid_definitions,
                "genericExamplesPreservedFromApp": skipped_generic_examples,
                "invalidArabicValuesSkipped": skipped_invalid_arabic,
                "untrustedArabicValuesSkipped": skipped_untrusted_arabic,
                "curatedOverrideRows": len(override_keys),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

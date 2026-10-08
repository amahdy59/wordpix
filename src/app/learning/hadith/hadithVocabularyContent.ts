interface VocabularyItem {
  term: string;
  partOfSpeech: string;
  definition: string;
  example?: string;
  arabic: string;
}

const PART_OF_SPEECH =
  /^(?:noun(?: phrase)?|verb(?: phrase)?|phrasal verb|adjective(?: phrase)?|adverb(?:ial)?(?: phrase)?|phrase|expression|verbal noun|idiom|prepositional phrase)$/i;

function cleanTerm(raw: string): string {
  return raw
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseHadithVocabulary(
  lines: readonly string[],
  _lessonNumber?: number
): VocabularyItem[] {
  const items: VocabularyItem[] = [];

  // Strategy 1: Structured table
  const startIdx = lines.findIndex((l) =>
    /^(?:word|term|expression|word\s*\/\s*phrase)$/i.test(l.trim())
  );
  if (startIdx >= 0) {
    const endIdx = lines.findIndex(
      (l, i) =>
        i > startIdx &&
        /^(?:useful language|extra vocabulary|scholarship note|useful b1|grammar|phrasal verbs|complete language|submit)/i.test(
          l.trim()
        )
    );
    const values = lines.slice(startIdx + 1, endIdx < 0 ? undefined : endIdx);
    let headerSkip = 0;
    while (
      headerSkip < values.length &&
      /^(?:part of speech|definition|arabic|meaning|example|b1 context|arabic match|arabic source|arabic equivalent)/i.test(
        values[headerSkip]?.trim() ?? ""
      )
    ) {
      headerSkip++;
    }
    const dataValues = values.slice(headerSkip);
    let i = 0;
    while (i < dataValues.length) {
      const termRaw = dataValues[i]?.trim();
      if (
        !termRaw ||
        /^(?:submit|proceed|grammar|phrasal|collocation|word family|synonym)/i.test(termRaw)
      ) {
        break;
      }

      let pos = "expression";
      let def = "";
      let example = "";
      let arabic = "";

      let offset = 1;
      const next1 = dataValues[i + offset]?.trim();
      if (next1 && PART_OF_SPEECH.test(next1)) {
        pos = next1;
        offset++;
      }

      const next2 = dataValues[i + offset]?.trim();
      if (next2 && !PART_OF_SPEECH.test(next2) && !/[\u0600-\u06FF]/.test(next2)) {
        def = next2;
        offset++;
      }

      const next3 = dataValues[i + offset]?.trim();
      if (next3 && /^e\.g\./i.test(next3)) {
        example = next3.replace(/^e\.g\.,?\s*/i, "");
        offset++;
      }

      const next4 = dataValues[i + offset]?.trim();
      if (next4 && /[\u0600-\u06FF]/.test(next4)) {
        arabic = next4;
        offset++;
      }

      const cleaned = cleanTerm(termRaw);
      if (cleaned && def) {
        items.push({
          term: cleaned,
          partOfSpeech: pos,
          definition: def,
          example: example || undefined,
          arabic,
        });
      }
      i += Math.max(1, offset);
    }
  }

  // Strategy 2: Slash format e.g. "brought together / يُجْمَعُ خَلْقُهُ"
  if (items.length < 3) {
    let i = 0;
    while (i < lines.length && items.length < 5) {
      const line = lines[i]?.trim() ?? "";
      if (
        line.includes("/") &&
        /[\u0600-\u06FF]/.test(line) &&
        !/^(?:synonym|grammar)/i.test(line)
      ) {
        const parts = line.split("/").map((s) => s.trim());
        const en = cleanTerm(parts[0]);
        const ar = parts[1] || "";
        let pos = "expression";
        let def = "";

        const peek = lines[i + 1]?.trim() ?? "";
        if (PART_OF_SPEECH.test(peek)) {
          pos = peek;
          def = lines[i + 2]?.trim() ?? "";
          i += 3;
        } else if (peek && !peek.includes("/") && !/^useful|^extra|^scholarship/i.test(peek)) {
          def = peek;
          i += 2;
        } else {
          i++;
        }
        if (en && def) {
          items.push({ term: en, partOfSpeech: pos, definition: def, arabic: ar });
        }
        continue;
      }
      i++;
    }
  }

  // Strategy 3: Numbered format e.g. "1. Purity (الطهور)"
  if (items.length < 3) {
    let i = 0;
    while (i < lines.length && items.length < 5) {
      const line = lines[i]?.trim() ?? "";
      if (
        /^\d+[.)]\s+[A-Za-z]/.test(line) &&
        line.length < 60 &&
        !/^(?:step|stage|unit)/i.test(line)
      ) {
        const term = cleanTerm(line);
        const arMatch = line.match(/[\u0600-\u06FF\s\-–]+/);
        const arabic = arMatch ? arMatch[0].trim() : "";
        let def = lines[i + 1]?.trim() ?? "";
        let pos = "expression";
        if (PART_OF_SPEECH.test(def)) {
          pos = def;
          def = lines[i + 2]?.trim() ?? "";
          i += 3;
        } else {
          i += 2;
        }
        if (term && def) {
          items.push({ term, partOfSpeech: pos, definition: def, arabic });
        }
        continue;
      }
      i++;
    }
  }

  return items.slice(0, 5);
}

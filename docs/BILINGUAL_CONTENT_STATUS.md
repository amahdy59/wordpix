# Bilingual catalogue integration status

The source CSV marks all 10,333 rows `approved=yes`, but its approval flag is not sufficient for learner-facing publication. Some rows contain a tree or color sense instead of the pictured fruit, a transliterated Arabic placeholder, or an example about the lesson rather than the word. Keep the source CSV unchanged; correct verified entries in `scripts/bilingual_content_overrides.json` and regenerate the unit chunks with `scripts/import_bilingual_catalogue.py`.

## Current coverage

- 10,333 catalogue keys match app vocabulary by `(unit, word_id)`; 1,521 app-only entries are preserved.
- 9,556 English definitions are included; 777 rejected definitions keep existing app content pending review.
- 7,180 Arabic glosses are included; 3,153 invalid or untrusted glosses are explicitly unavailable rather than replaced by a global-ID guess.
- 2,963 useful English examples are included; generic activity sentences are excluded. The source has no Arabic example translations.
- The catalogue rows for Fruits (50), Vegetables (60), and Days & Months (49) have each been checked against the corresponding image and now have a definition and Arabic gloss. The audit corrected overly technical or wrong-sense definitions, a placeholder ginger example, the noun sense of `schedule`, and 17 mismatched fruit image references. Three replacement fruit pictures (yuzu, persimmon, pomegranate) were generated to complete the image fixes. This is a visual and content consistency pass, not a native-speaker sign-off. Of these 159 rows, 31 have a useful example sentence and 128 still need one.

## Review procedure

1. Review a small unit batch against each image, label, part of speech, and intended learner sense. Use Cambridge/Oxford or a relevant technical reference to verify sense, but write original WordPix copy.
2. Add only verified replacements to `scripts/bilingual_content_overrides.json`. Keep Arabic as a direct gloss, not a sentence saying that a term is called something. Keep English definitions concrete, learner-level, and non-circular.
3. Regenerate the unit chunks and inspect the importer counts. Never increase coverage by accepting low-confidence source text without reviewing it.
4. Check Study, Practice, and word details in bilingual and immersion modes, including screen-reader output and the pictured sense. Approve copy before generating or replacing audio.
5. Run `npx tsc --noEmit` and `npx vitest run` after every batch.

Remaining records are a content-review backlog, not a code or test failure. The app intentionally shows translation unavailable where no reliable gloss has been established.

# Audio phase 2: contextual learning audio

Status: proposed recording batch. No ElevenLabs generation or R2 upload was run.

The vocabulary tier is represented by 8,614 entries in the local ledger, but the bucket has not been reconciled in this environment. Verify those objects before treating word audio as complete.

## Recommended next batch

Record **Bathroom contextual learning audio** first, then extend the same batch type unit by unit based on learner usage. For Bathroom, the current scoped corpus contains 67 word clips (578 characters) and 93 learning-material clips (4,661 characters). The word tier is already represented in the ledger, so the next useful purchase is the 93 Bathroom learning-material clips. Review the source text first because some dialogue records are known to have swapped speaker and text fields.

The lexicon tier is currently global rather than unit-scoped: 7,171 clips and 289,679 characters. Add unit ownership to the extractor before buying it so examples and collocations can be released in the same small unit batches. Leave stories until their teaching flow and longer narration pacing have been reviewed.

## Release sequence

1. Run `pnpm run assets:verify` to prove an authenticated R2 PUT/HEAD/GET/DELETE round trip.
2. Run `node scripts/build_audio_corpus.cjs --unit=bathroom`, inspect the output for speaker labels, directions, duplicates, punctuation and Arabic accidentally included in English narration.
3. Run `node scripts/generate_audio.cjs --dry-run --tier=materials`, review the exact character budget, and approve one voice/profile. Changing it re-keys and regenerates every clip.
4. Generate a 20-clip sample with `--tier=materials --limit=20 --max-chars=3000`. Review pronunciation, silence, loudness, pace and sentence prosody before buying the full unit.
5. Generate the full Bathroom materials tier with a hard `--max-chars=5200` ceiling. Reconcile the ledger with `--reconcile` and verify public reads through the configured custom asset domain.
6. Test offline fallback, service-worker caching, Listen/Play states and accessible error messages. Then repeat for the most-used completed unit.

Objects already use content-addressed keys: `audio/<first-two-hash-characters>/<sha256>.mp3`. Keep the ElevenLabs key and R2 write credentials server/CI-only. The app should receive only the public `VITE_ASSET_BASE_URL`; configure R2 CORS and immutable caching on hashed objects.

## Later phases

- Phase 3: learning-material sentences, corrected forms and dialogues after content integrity review.
- Phase 4: story narration, with longer-form pacing and paragraph-level controls.
- Do not synthesize microphone feedback, learner names, generated group blurbs, labels such as “Technician:”, UI copy, or incorrect answer forms.

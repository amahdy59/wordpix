# WordPix work batches — October 9, 2026

This register separates implemented, verified, uploaded and deployed work.
An R2 upload alone does not mean learners can use a feature in the live app.
Update the register after each batch and retain release history.

| Batch | Scope                                                                        | Implementation                                                                                                                                       | Verification                                                                                                                                                                                                                                                                          | Deployment                                                     | Remaining                                                                                                                                   |
| ----- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Continuous specialist reading, playback and 36 classroom/office scene photos | Complete                                                                                                                                             | 2,779 unit tests, 130 E2E tests, build and live offline checks passed                                                                                                                                                                                                                 | Live v0.1.9, commit `7aa8321c432ffcd680f6b6bfdfbaeeefe5fc349f` | Complete for this scope                                                                                                                     |
| 2     | Vocabulary references, clear captions and semantic image reuse               | 26 approved images support 29 new scene mappings; objects uploaded with byte verification; corrected URL routing for generated and shared keys       | Type checking, 2,784 tests, lint, build and 130 E2E tests passed; eight caption/image checks passed across languages, themes and widths                                                                                                                                               | Release ready; live status requires post-push verification     | Push, CI and live verification                                                                                                              |
| 3     | Bedroom/kitchen references and corrected produce; remaining catalog triage   | 23 human-free assets approved through direct visual review: 17 existing photos and six focused generated corrections. No new uploads from this batch | Publication dry run passed with zero writes. Separately, 2,976 candidates submitted in 31 confirmed audit jobs were collected; inconsistent response formats require manual review. Another 790 prepared candidates have no confirmed job and retain conservative credit reservations | Not deployed                                                   | Upload new assets and mappings, release verification; continue catalog review. The generated Yuzu remains held for uncertain species detail |
| 4     | Language quality alongside each image batch                                  | Initial review underway                                                                                                                              | Not yet complete                                                                                                                                                                                                                                                                      | No language edits from this batch deployed                     | Concrete phrase, question and article recommendations; implement appropriate reviewed corrections                                           |

The inventory before Batch 2 contained 3,502 scenes without reviewed imagery.
Batch 2 covers 29, leaving **3,473** at this checkpoint. The number of missing
scenes differs from the number of physical images: compatible uses can share an
asset, and several candidate photos may exist for a single scene.

## What each subsequent image batch must report

- Stable batch ID, theme or units and exact scene IDs.
- Existing photos reused, new images generated and unique physical assets.
- Wording reviewed, corrections implemented and suggestions held for review.
- Approved, held and failed outputs, with reasons and next actions.
- New mappings uploaded and verified; existing mappings preserved.
- Verification results, release version, commit and live deployment evidence.
- Missing scenes at that checkpoint and estimated credit usage versus reserved
  credit. Generation in progress is not counted as approved or deployed.

Prefer manageable theme batches of approximately 20–30 approved images. Keep
API audit groups separate from learner-facing release batches.

## Credit and media rules

The user authorized **$56.337 maximum** for new image generation, corrections
and API-assisted review. The active receipt ledger is
`output/gemini-credit-batches/credit-ledger.json` in the reading-experience
worktree. Reservations are not actual charges; provider usage estimates are
not a live billing balance. Save job identities and inspect server-side job
listings after ambiguous responses rather than submitting a duplicate.

Follow [the image policy](IMAGE_GENERATION_AND_REUSE.md): human-free by default,
only necessary humans, essential women in modest Islamic dress, meaningful
names, accurate visible-content descriptions and independently reviewed reuse.
Existing media objects and mappings remain unchanged.

## Other outstanding recommendations

The complete manual WCAG AAA criterion audit remains open; passing automated
checks does not establish full conformance. Business audio completion remains
blocked by the available ElevenLabs key's exhausted character balance. The
Gemini Developer API works; Vertex AI access was disabled in the checked project.
No cloud settings, automatic replenishment or billing configuration were changed.

# Question media review — 8 October 2026

The shared gap-fill and sentence-builder screens now resolve images against the
exact displayed sentence. A word image is not evidence for a different scene.
Gap-fill no longer rotates into unrelated office/café sentences while retaining
the original image, hides essential pictures by question position, or displays
another unfinished question above the current question.

Missing or failed sentence images display a bilingual, labelled placeholder.
Text clues make practice possible without the picture: numeric quantities for
cardinal numbers, definitions for other words, and an explicitly labelled word
to practise when a meaningful definition is unavailable. This last fallback is
guided practice, not an independent test of recognition. New play/stop/retry
controls speak the unfinished prompt before answering and the completed
sentence afterward. Existing audio resolution and R2 mappings are unchanged.

Reading scenes recover from failed images. Reading and usage images preserve
their full frame. The shared vocabulary-image fallback identifies itself as a
placeholder, including its accessible name. The exercise shell respects reduced
motion for scrolling and includes bottom safe-area padding; phrase assembly
uses the shared surface padding scale.

## Image requests

- `question-image-priority.csv`: Numbers & Counting / Colors usage scenes.
- `question-sentence-image-priority.csv`: exact sentence questions in those units.
- `question-image-inventory.csv` and `.json`: all curriculum usage scenes,
  including editorial content not yet released. 3,607 of 3,657 scene entries
  need an image/file or image description.
- `question-sentence-image-inventory.csv`: 22,075 of 22,305 assessed sentence
  entries have no confirmed matching media. Counts refer to question entries;
  multiple questions can share one generated scene.
- `figma-image-regeneration-requests.csv` and `.json`: 43 reviewed assets
  withheld for incorrect or unclear content. Eight have existing reviewed
  vector replacements; 35 need replacement artwork. Each rejection includes
  the exact question text and required visual details. Original assets remain.

Each request includes stable IDs, the exact scene or sentence, and a generation
prompt. Prioritise the focused files, group requests that describe the same
scene, and visually review quantities, positions, colors, and objects before
integrating images. Existing media was checked for presence and sentence/scene
association; every existing image across the application has not received a
human semantic audit. Specialist courses retain their own media workflows.

Regenerate with `node scripts/audit_question_images.mjs` and
`node scripts/audit_sentence_question_images.mjs`. Both scripts read content and
assets and write reports only; they never upload or change asset mappings.

## Validation

- TypeScript: zero errors.
- Vitest: 127 files, 2,684 tests passed in the final application-code run.
- ESLint: passed.
- Production build: passed.
- Authored lesson flow: 12 desktop/mobile E2E tests passed.
- Mobile gap-fill and builder: no horizontal overflow; automated accessibility
  and enhanced text-contrast checks passed. Visible builder controls were at
  least 44 × 44 px and keyboard focus reached the controls.
- Arabic RTL, dark theme, and reduced-motion gap-fill check: no overflow or
  enhanced contrast violations.

These checks are scoped evidence, not a criterion-by-criterion WCAG AAA audit.
Changes remain local and have not been deployed.

# Reviewed image reuse and media maintenance

## Applied, scoped change

The user explicitly approved adding only twenty verified assignments as an
exception to the read-only mapping rule. `applied-assignments.json` records the
authorization and exact batch. The exact-sentence registry grew from 23,570 to
23,590 rows. Every previous registry entry was preserved; no existing R2 object,
key, URL or stored bytes were changed. No R2 upload or delete was performed.

The new images support individually reviewed garden and outdoor identification
sentences. Each mapping uses the stable word ID plus exact sentence, a descriptive
alternative, the original served image URL, content revision and inspected image
digest. All twenty public GET responses matched their reviewed byte digests.
One remote AVIF encoding differs from its local copy; its served pixels were
inspected separately and the remote digest is explicitly recorded.

The additions are documented in English and Arabic release history as v0.1.98.
They are local changes awaiting the project's normal release/deployment workflow.

## Maintenance controls implemented

- Stable catalog identities, independent reviewed names, tags and aliases.
- Local-byte duplicate groups without deleting copies or rewriting URLs.
- Paginated read-only R2 inventory, timestamped snapshots and inventory deltas.
- Exact current content snapshots instead of slide/CSV positional associations.
- Zod-validated reuse, generation and content-repair decisions.
- Fresh runtime content extraction before review decisions are validated.
- Changed content, changed URLs, stale image bytes, held content, duplicate
  decisions and incomplete reviews fail validation.
- Broader candidate retrieval by content, image names, context and reviewed tags.
  Similarity never establishes approval.
- Candidate rejections pinned to both content and image digests.
- Reuse validation against public GET bytes and the app's actual URL resolver.
- Generation requests require content review, a documented search, explicit
  candidate rejection, acceptance criteria and a reviewed visual brief.
- New-file naming plans validate encoded WebP and compute immutable final-byte
  SHA-256 names in the existing compatible namespace; they do not upload files.

## Findings and remaining review work

The visual batch recorded 30 rejected candidate pairings, 48 reviewed asset
names, and 27 confirmed incorrect registry associations. Only the twenty explicitly
approved reuse mappings were applied; other mapping corrections remain proposals.
Two defective runtime sentences are in the content-repair queue rather than the
generation queue: "This is a firewood" and "This is a sunscreen".

The audit was corrected to account for ExerciseStory's actual expected-answer
vocabulary-image fallback. Older reports counting all unassigned scene paths as
visually unsupported overstate gaps. Word-reference support is now recorded
separately and does not prove the entire scenario is illustrated.

The additional coverage report includes specialist vocabulary/course cards,
pronunciation authored images, specialist quiz prompts, Hadith vocabulary, and
core story hero/rendered-scene support. Some text-only exercises need a visual
purpose decision, not an automatically generated image.

Generation requests remain empty because no remaining item has passed the full
new-art review. This does not establish that no new images are needed. Current
counts are in `output/media-catalog/summary.json` and `decision-summary.json`;
unresolved candidates and review packets are not completed semantic audits.

The refreshed post-application runtime audit has 30,587 uses, 28,921 assigned and
1,666 without an image assignment. It separately marks 2,014 uses as reference-only
support. The existing sentence selector prefers illustrated candidates, so adding
the twenty exact bindings also changes which existing sentence variants are selected;
these counts are recomputed from the real selector rather than subtracting twenty
from a historical report. The decision queue contains 1,684 unresolved uses including
known mismatches, with two additional items routed to content repair.

Additional coverage includes 1,015 business uses (645 assigned), 840 conversation
uses (440 assigned), 1,382 pronunciation images (all assigned), 112 Hadith vocabulary
uses (91 assigned) and 4,522 core story references (all assigned). "Assigned" here
does not establish semantic correctness; text-only quiz prompts receive visual-purpose
review, and story heroes/word fallbacks do not necessarily depict an entire scenario.

## Verification

The catalog/review invariant suite has 23 tests. A new integration suite checks
all twenty exact resolver bindings, rejects unrelated word identities and renders
a reviewed image with its description. Browser coverage exercises sleeping-bag
and garden-glove sentence images in English and Arabic across the configured
desktop/mobile engines. All twelve focused browser cases passed in 24.5 seconds.
The read-only production build and bundle/route budgets passed, with existing
large-chunk warnings retained. TypeScript passed. The full Vitest run passed
187 files and 3,214 tests. ESLint passed with exit 0. Formatting and the scoped
registry-preservation check also passed. No deploy was performed by this work.

## Continuation verification — 29 October 2026

The resumed task found the authorized twenty assignments already applied. A fresh
comparison against HEAD confirmed that all 23,570 previous registry rows are
unchanged, the only additions are the twenty authorized entry IDs, and the current
registry SHA-256 matches the application record. This continuation added no further
media mappings and performed no R2 writes.

Fresh verification of the shared checkout passed TypeScript, then the full Vitest
suite (190 files, 3,220 tests), then ESLint. All 23 media-tool tests passed. The
read-only review refresh verified all twenty served image digests and the app's
URL resolver. Specialist/story coverage was refreshed; the key inventory remains
the explicitly dated cached snapshot rather than a new live listing.

The production build and bundle/route budgets passed. Existing large-chunk and
dependency annotation warnings remain. All twelve focused image-reuse browser
cases passed in 22.9 seconds using the fresh build, covering English/Arabic on
Chromium, mobile Chrome and mobile WebKit. These cases mock image responses to
check URL selection and rendering; the separate public GET checks establish the
reviewed remote bytes. Canonical and public bilingual v0.1.98 release notes are
synchronized. Logs use the `output/visual-continuation-*` prefix.

The remaining scope is unchanged: 1,684 unresolved uses, two source-content
repairs and no established final generation count. No deployment was performed.

## Release review — 29 October 2026

The release review preserved all 23,570 prior registry entries and confirmed the
twenty additions exactly match the application record. Fresh public GET checks
matched all twenty reviewed image digests. The 23 media-tool tests, TypeScript,
the full 190-file / 3,221-test Vitest suite, ESLint, the secret scan, and dependency
audit passed. Media-tool invariants now run in pre-push and GitHub release gates.

A fresh read-only inventory listed 153,037 R2 keys. Its capture time is retained
when rebuilding local reports. The review refresh verified twenty proposals,
thirty rejected pairings and forty-eight reviewed names. Missing ignored source
review files were copied unchanged into the isolated release checkout; no review
digest was relaxed to accommodate an absent file.

The additional Hadith audit now follows the active vocabulary parser, including
lesson 18's reading-section supplement and the rendered label-match rule. It
reports 210 vocabulary uses, with 181 assigned visuals and 29 requiring purpose
review. Earlier counts of 112 uses came from the retired vocabulary component.
This corrects reporting only and changes no lesson content or media mapping.

Replanning the actual spoken content after image selection produced 96,359
distinct texts, all already recorded. Existing audio references, special
pronunciations, aliases and original objects passed read-only reconciliation.
The complete recording index remains available for other recorded variants.

Older experimental branches are preserved separately as documented in
`docs/LOCAL_ARCHIVE_RECORD.md`; none is merged into the application release.
The final release proceeds through the full production pre-push/browser gates
and live deployment verification. Visual completeness beyond the twenty reviewed
assignments remains outside this scoped release.

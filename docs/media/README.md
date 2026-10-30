# Media catalog and visual reconciliation

See [the decision workflow](REVIEW_WORKFLOW.md) for enforceable reuse approvals,
rejected matches, source-content repair and generation-request/naming plans.
The [implementation record](IMPLEMENTATION_2026-10-29.md) documents the user-authorized
exception that applied exactly twenty verified assignments. Catalog refreshes and
review commands themselves remain read-only with respect to the app and R2.
The [Hadith reuse receipt](APPROVED_HADITH_REUSE.json) records a later, separately
authorized batch of three vocabulary mappings and six new responsive images.
The [performance fix and image checkup](PERFORMANCE_AND_IMAGE_CHECKUP_2026-10-29.md)
records the unit-scoped sentence table, current technical flags and twelve-image
semantic triage. Run `pnpm run media:checkup` after refreshing the catalog and
specialist audit to export technical flags and exact-context review actions.

The catalog organizes existing R2 assets without changing their keys, bytes, URLs,
or live content mappings. A descriptive name is catalog metadata. It is never a
request to rename, move, delete, overwrite, or re-upload an object.

## Rebuild and review

Run `pnpm run media:catalog` from the repository root. It evaluates current
vocabulary and sentence resolvers, reads the complete paginated R2 key inventory,
and builds local review artifacts in `output/media-catalog/`.

Use `pnpm run media:catalog:offline` to reuse the last inventory explicitly; its
capture date remains visible. It still rebuilds runtime demands and local source
references. Missing credentials or network errors fail the live command; they
never silently turn into an empty or supposedly complete inventory.

| Artifact                     | Purpose                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `assets.csv`                 | Filter all objects by media kind, collection, display name, source, URL, and duplicate evidence.              |
| `catalog.json`               | Machine-readable identities, provenance, names, and references.                                               |
| `duplicates.csv`             | Equal local image bytes under different keys; retains every copy and makes no remote-equality claim.          |
| `bindings.csv`               | Exact-sentence registry review, first-match shadowing, known mismatches, stored fallbacks.                    |
| `visual-reconciliation.csv`  | Current vocabulary, sentence and usage-scene assignments, exact-text reuse candidates, stable concept groups. |
| `visual-reconciliation.json` | Full demand context for further tooling.                                                                      |
| `r2-inventory.json`          | Complete key listing and capture timestamp.                                                                   |
| `summary.json`               | Scope, counts, evidence limits and missing optional inputs.                                                   |

`concept-review-queue.csv` groups unresolved uses by normalized wording for review;
`review-plan.md` gives a readable snapshot of the results and their limits.
Start at `review-index.md` for unit-by-unit review packets of up to 25 uses,
with exact text and candidate image links. `binding-mismatches.md` keeps the
confirmed incorrect assignments visible separately. The regenerated index is
authoritative; older packet files are preserved if the queue later shrinks.
Fresh inventory runs also retain timestamped key snapshots under `snapshots/`
and report additions and keys no longer listed in `inventory-changes.json`.
These are observations only; the tool never removes objects.

CSV files quote multiline fields and neutralize spreadsheet formulas. JSON keeps
the original data. Generated files are ignored by Git; curated review metadata and
the scripts are tracked. Preserve/export the generated catalog when sharing a
review; it contains URLs and provenance but no access keys or signed URLs.

## Naming conventions

- **Physical identity:** the exact R2 object key, including case. Never change it
  for cosmetic organization. Existing namespaces remain the physical folders.
- **Stable catalog ID:** `asset-<24 hex characters derived from the key>`.
  Different keys retain different IDs even when their bytes match.
- **Display name:** concise visible subject/action/context, for example
  `Gourd on a wooden surface` or `Commuters waiting in a station`. Do not derive a
  semantic label from an unverified sentence assignment.
- **Unreviewed names:** the filename or parent collection plus stable ID. Marked
  `inferred-from-key`, not visually approved.
- **Duplicate group:** `local-sha256:<full digest>` of actual local bytes. Each
  member keeps its own asset ID and original URL. Different formats, resolutions,
  crops and Figma source hashes are not automatically byte duplicates. Human
  reviewers can describe those as variants in their evidence.
- **Future image additions:** use the existing compatible convention
  `question-images/v2/<descriptive-lowercase-hyphenated-collection>/<sha256-of-final-webp>.webp`.
  Choose an existing validated uploader only in a separately authorized upload
  task, with immutable create-only writes. The catalog has no upload operation.
  Existing legacy keys do not need migration to follow this convention.

## Review workflow

Edit `docs/media/asset-reviews.json` to give an asset a durable display name and
record reviewer, date and evidence. Review records are keyed by the exact R2 key.
Binding reviews are separate: an image can be perfectly useful while its
assignment to one sentence is incorrect. A binding review also pins the expected
image path and exact sentence; rebuilding fails if that assignment changes or disappears.

1. Review `confirmed-mismatch` items first. Compare the image with its exact
   sentence and assessed word. Record an approved replacement proposal outside
   the live registry; do not edit or automatically apply mappings here.
2. For `reuse-candidates-to-review`, inspect the proposed images. Exact text is
   retrieval evidence only: historical mappings can themselves be wrong.
3. For `search-existing-artwork`, search the catalog, source decks and remaining
   unreferenced images before creating a generation request. No candidate in the
   exact-text index is not proof that no suitable artwork exists.
4. Group reusable concepts with `conceptId`; keep unit and lesson identities.
   Different contexts, quantities or assessed contrasts still need separate
   review even if wording resembles another item.
5. Only after candidate rejection and content review, build a deduplicated new-art
   request with exact content, purpose, context, reviewed alt text and acceptance
   criteria. The generator's existing review/hold safeguards still apply. This
   catalog intentionally grants no generation approval by itself.

## Interpretation and boundaries

`assigned-unreviewed` means an object was listed and a resolver supplies it; it
does not establish semantic correctness. `local-or-unlisted-reference` is not
automatically a broken image: it can be intentionally local. A key without an
indexed reference is never a deletion candidate; dynamic references and external
consumers may exist.

The runtime demand audit covers course vocabulary, both selected exercise
sentences, and usage scenes after the app's overlays. Specialist-only exercises,
stories, arbitrary UI concepts, and visual equivalence need further review.
Literal JSON references from specialist catalogs are indexed as provenance, not
claimed as a complete runtime coverage audit. All remote object kinds are listed;
local duplicate hashing currently covers images.

The exact-sentence resolver now uses compact, checked per-unit runtime derivatives and
retains fallback arrays with their own descriptions. The source registry remains
unchanged. It excludes the 27 associations already visually confirmed as wrong;
this does not approve replacement artwork. No new-art count should be reported
as final until visual matching is complete.

Run `pnpm media:dashboard` to build the local per-unit review workspace at
`output/image-quality/index.html`. Learner exports can be included with
`node scripts/build_image_quality_dashboard.mjs --reports C:/path/to/wordpix-image-reports.json`.
Imports validate the shared report schema and stable identity hashes. The dashboard
does not submit reports, write R2 or apply mapping/purpose proposals. See
`IMAGE_QUALITY_ROLLOUT.md` for implemented software, reviewed purpose decisions,
open artwork work and release blockers.

Run `pnpm run media:catalog:test` for catalog invariants, then the project's
TypeScript, Vitest and ESLint gates for changes to these tools. These are internal
audit tools; no learner-facing release or new upload is performed by running them.

The [30 October follow-up](FOLLOWUP_CHECKUP_2026-10-30.md) records the latest
playback fixes, sampled audio findings, local responsive candidates and the
exact publication review batch. Running the checkup or preparation scripts does
not authorize R2 writes or mapping changes.

# Image decisions, naming, and application assignment proposals

The inventory is separate from both learning content and review decisions. R2
objects keep their original identities. An asset's readable name describes the
visible image; its suitability is reviewed separately for each learning use.

## Commands

1. `pnpm run media:catalog` refreshes runtime demands and the live, read-only R2
   inventory. Use `media:catalog:offline` to explicitly reuse the saved inventory.
2. `pnpm run media:review` broadens candidate search across object names, source
   context and reviewed tags, validates durable decisions and rejected matches,
   and verifies approved reuse bytes with public GET requests.
3. `pnpm run media:review:check` tests the generated assignment proposals against
   the application's real asset URL resolver. It does not modify the app.
4. `pnpm run media:catalog:test` runs the invariant tests for naming, reviews,
   content revisions, holds and immutable asset identity.

## Durable review data

- `asset-reviews.json`: names, optional tags/aliases, reviewer, date, evidence and
  (for a remote visual inspection) the exact `inspectedSha256`. These records
  survive catalog regeneration. Different encodings under a legacy key may have
  the same appearance; a local-byte match must never be assumed for the remote.
- `candidate-rejections.json`: a rejected content/image pairing, pinned to the
  exact content digest and inspected local image digest. Rejected matches are
  suppressed in the expanded candidate report, not deleted from storage.
- `visual-decisions.json`: one discriminated decision per exact demand snapshot:
  `reuse`, `generate`, or `content-repair`. The schema and validation functions
  live in `scripts/lib/visual_review.mjs`.

Never fabricate approvals from similarity scores. Search indexes include
historical associations that are known to contain errors. A match is useful for
retrieval but is not visual evidence. No safe-generation count is inferred from
the absence of a lexical match.

## Reuse approval

Use `decision-templates.json` for the exact current content snapshot. A reuse
decision requires stable demand, unit, lesson and word IDs, exact text, its SHA-256
revision, and the existing resolved URL (or null). It also requires the asset ID,
original key, reviewed byte digest, appropriate alt text and affirmative checks
for subject, action, quantity, context, assessment safety and alt text.

Inspect the whole image at a useful size. Check that numbers, pronouns, equipment,
actions and contrasts support the sentence; do not require an image to prove an
invisible mental state. A descriptive alt should provide equivalent useful
information without spelling out an assessed answer. An abstract or defective
sentence may require content repair before a visual choice is meaningful.

The review command rejects unknown/stale IDs, changed text or resolved URLs,
changed inspected bytes, unlisted/non-image objects, duplicate decisions and
content on hold. Each accepted reuse proposal then performs a public GET and
compares the full SHA-256 of the response to the visually approved bytes. A
different response fails the build; it does not cause a replacement or upload.

## Generation requests

A `generate` decision additionally requires a reviewed visual brief, acceptance
criteria, alt text, search evidence, content-review provenance and explained
rejection of all known exact and broadened candidates. Existing assigned content
must first receive a separate binding review. Invalid source language receives a
`content-repair` decision instead of spending effort generating an image for it.

`generation-requests.json` groups approved requests only when their content kind,
exact text, visual brief and acceptance criteria are identical. Demand IDs remain
attached. Requests do not themselves generate or upload media. Other lesson
generation holds and content policies remain applicable; this workflow does not
bypass them.

For a future reviewed encoded WebP, prepare a naming plan with:

```powershell
pnpm run media:asset:plan -- --collection=camping-equipment --file=output/new-image.webp --request-id=image-request-REPLACE_WITH_REVIEWED_ID
```

The planner requires a known reviewed request, decodes the image to confirm WebP
within 1584 × 1152, and computes its name from the final encoded bytes:

`question-images/v2/camping-equipment/<sha256>.webp`

It writes a local plan only. Never rename legacy files or use `copy`, `final-2`,
slide number, CSV row number or mutable descriptive text as object identity.
Maintain descriptive names and tags in metadata; use content digests for bytes.
Duplicate members retain all original IDs and URLs. A `canonicalCandidateId` in
the naming report is a deterministic local duplicate reference, not permission
to delete or redirect other members.

## Result files

| File                                | Meaning                                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `expanded-candidates.json` / `.csv` | Candidate search after suppressing visually rejected matches; all suggestions still need review.                            |
| `validated-reuse-proposals.json`    | Reviewed proposals with live GET byte-verification evidence.                                                                |
| `runtime-assignment-proposals.json` | Concrete asset-resolver-compatible content → asset → R2 relationships, with content/byte revisions and alt text.            |
| `generation-requests.json`          | Reviewed deduplicated requests, potentially empty.                                                                          |
| `content-repair-queue.json`         | Defective source content that needs authoring review before image approval.                                                 |
| `naming-audit.csv`                  | Reviewed/inferred names, stable identities and duplicate canonical candidates. All physical keys remain preserved.          |
| `decision-summary.json`             | Counts that explicitly distinguish reviewed proposals, pending reviews and whether a final generation count is established. |

## Applying proposals

On 29 October 2026 the user explicitly authorized applying only the existing
20 visually reviewed, R2-byte-verified reuse assignments. Those exact additions
are recorded in `applied-assignments.json`, including before/after source digests,
review evidence and each stable content identity. Prior registry entries were
preserved. This scoped exception does not authorize other mapping changes, R2
uploads, renaming, deletion, or automatic application of later review decisions.

The current `AGENTS.md` explicitly prohibits modifying mappings between content
IDs and R2 media URLs. Accordingly, these tools produce reviewable proposals and
never import them into application runtime registries. Further application requires an
explicit exception to that guardrail, then a scoped implementation with resolver
and rendering tests, bilingual release notes, and the normal verification gates.
This is separate from catalog annotations, which can be maintained freely without
changing learner-facing media.

The final required generation count remains unknown until all relevant uses have
been reviewed, including specialist-only activities and stories outside the current
audit scope. A passing schema check establishes evidence integrity, not universal
semantic correctness or application-wide visual completeness.

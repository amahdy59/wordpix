# Image quality implementation and review ledger

The user accepted the image-quality recommendations on 29 October 2026.
This ledger distinguishes software delivery from individually reviewed artwork.
It is not a declaration of complete visual coverage or WCAG conformance.

## Implemented software

- The sentence resolver excludes 27 associations already visually confirmed as
  incorrect. The source registry, content IDs, image URLs and R2 objects are
  preserved. Exclusions pin word, exact sentence and original image path; they
  cannot accidentally exclude a future replacement with different bytes/URL.
- Exact sentence image fallbacks retain their own descriptions. A word-reference
  fallback is explicitly labelled as such instead of claiming to depict the
  complete situation.
- Vocabulary browsing displays the complete main image with `object-contain`.
  It prefetches only the next image, at low priority, and respects offline,
  Save-Data and slow-2g/2g connections. Existing current-image eager/priority hints
  and lazy thumbnails remain in place.
- Learners can report vocabulary, sentence, story and Hadith practice images.
  Reports stay on the device, deduplicate stable content/URL/reason identities,
  collect no account identity or free-form personal data, and can be exported or
  cleared in Settings. They are **not automatically submitted** to the team.
  The URL identity is not a claim to have hashed the remote image bytes.
- Optional per-unit image packs use the app's actual vocabulary, two sentence
  selections, scene/phrase assets and authored reading media. A saved primary
  image satisfies its use; optional alternatives do not inflate the download.
  Estimates are explicitly approximate; completed downloads show real bytes.
  Cancellation preserves resumable images. Retries validate existing readable
  responses; incomplete/empty/non-image files never establish readiness.
  Storage failures have recovery actions. Removing a unit pack affects only its
  owned image cache, not another pack, lesson text, audio or learner progress.
  The service worker serves pinned images before its bounded runtime cache.
- The optional image list is prepared only when its disclosure is opened; a
  normal Settings visit does not load the full sentence-content selector.
- `firewood` and `sunscreen` use mass-noun identification grammar. The original
  defective wording and its review are preserved with exact replacement evidence.

## Maintainer review workspace

Run the read-only runtime/catalog/review audits, then `pnpm media:dashboard`.
Open `output/image-quality/index.html`. It supports per-unit and specialist
filters, exact content search, missing/mismatch/reference/hold/purpose queues,
content revisions, inventory capture dates, byte evidence, semantic status,
mobile/crop previews and purpose proposals. Imported learner reports remain
local, including unmatched reports outside the present coverage scope:

```powershell
node scripts/build_image_quality_dashboard.mjs --reports C:/path/to/wordpix-image-reports.json
```

This tool does not write R2 or runtime assignments. Its imported report schema
is shared with the learner app, validates identity hashes and rejects unexpected
fields and unmanaged origins. Purpose proposals require a named reviewer,
individual rationale and content revision; the permanent ledger rejects stale
or duplicate decisions. Previewing an image or changing a crop is not approval.

## Reviewed purpose decisions

The 29 initially unassigned specialist Hadith vocabulary uses have individual
purpose rationales in `visual-purpose-decisions.json`: 23 are text-only and six
would benefit from contextual visual support. This purpose review alone does
not approve a candidate image. Abstract faith, intention, obligation and
figurative meanings must not be inferred from a person's appearance or a
literal scene. Three helpful cases now have individually reviewed contextual
references: establishing daily prayers, performing Hajj and a knee joint.
Their exact content revisions, source evidence, six content-hashed responsive
WebP keys, served-byte checks and the user's narrow authorization are recorded
in `APPROVED_HADITH_REUSE.json`. The other three helpful cases and 23 text-only
uses remain without images by design; the specialist audit reports 26 without
assignments. Written definitions still carry frequency, ritual
completion and meaning that a still image cannot prove.

The 370 business and 400 conversation quiz prompts also have individual
revision-pinned text-only purpose decisions. Their actual quiz stages pass
written stems, answer options and explanations without image media. This is a
task-modality policy review, not approval of specialist vocabulary artwork;
see `SPECIALIST_QUIZ_VISUAL_PURPOSE.md` for the method and scope.

## Artwork review still open

The source audit remains intentionally explicit about incomplete work:

- Selected sentence uses without exact-sentence art still require individual
  purpose/candidate review. Exact text and lexical retrieval are search evidence,
  not semantic approval. The current count increased when known wrong images
  were excluded; this is a more honest count, not lost R2 data.
- The 2,014 word-reference scene uses and 865 first-word story heroes have not
  all received scene-level semantic review. Do not claim full action, quantity,
  spatial or narrative coverage from a vocabulary picture.
- Specialist vocabulary, course cards and any future image-choice assessments
  still need separate visual-purpose and semantic reviews. The current quiz
  classification must be rechecked when the prompts or their renderer change.
- Responsive R2 variants for other candidates still need source-byte review,
  local encoding, immutable names, verification and permitted deployment. The
  three approved Hadith references use six verified 480/960-pixel WebP files.
- The project's current AGENTS.md media constraint keeps image R2 references
  read-only except for the user's explicit authorization of these six new
  Hadith image files and three corresponding mappings. The earlier two new
  audio objects were also expressly authorized. No existing object was
  overwritten or deleted. Any future image batch needs its own scope, exact
  content and served-byte evidence.

## Validation record

The new tests cover report persistence/privacy/deduplication, dialog focus,
offline pack cancellation/retry/storage/removal, malformed/empty image responses,
exact rejection scopes, grammar, purpose-review revisions, report imports and
safe generated HTML. Browser tests exercise English/Arabic report export and
real CacheStorage/service-worker image delivery across an offline reload.

The 31 media-tool invariants and production bundle/route budgets passed during
development. The pre-push hook repeats TypeScript, all unit tests, ESLint,
media/audio/shard checks, a production build, bundle budgets and the full browser
matrix for the final commit. Local verification receipts are saved under
`output/image-quality/`. The independently cached sentence table is about
11.5 MB (2.36 MB gzip), compared with about 22.4 MB (2.91 MB gzip) in the previous
combined exercise bundle. Budget ceilings were not raised. Source mappings
remain unchanged for sentence media; the compact table is a checked derivative.

The two corrected identification sentences have new recordings totalling
14,728 bytes. The user expressly allowed these two create-only uploads. Their
exact keys and SHA-256 digests are recorded in `PENDING_AUDIO_PUBLICATION.json`
(which retains its preparation filename for traceability). The public served
bytes and CORS were verified. Each recording adds one entry to an existing
index shard, without removing earlier entries. Full read-only reconciliation
found 96,359 of 96,359 playback candidates available, zero unlinked new clips,
zero broken aliases and zero removed original objects. Production deployment
is a separate step from this media verification.

The final branch verification receipt is `output/image-quality/prepush-final.log`.
Artwork review left open above must not be represented as completed by tests.

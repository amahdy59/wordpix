# WordPix image generation and reuse

The user confirmed this policy on October 9, 2026. It applies to newly generated
assets and new mappings. Existing media objects, filenames and mappings remain
unchanged. The user authorized additions only after visual verification.

## Educational clarity and people

Prefer an image without people. Objects, clothing, food, places and equipment
usually need no person or hand. Specify a concrete physical composition and an
explicit human plan before generation. Do not insert incidental people, faces
on posters, crowds or unnecessary hands.

Use a human only when the meaning needs one: a role, emotion, action, age,
relationship or body part. Use only essential hands when they communicate the
action adequately. Otherwise use the minimum essential modestly dressed male
subjects for concepts that do not require a woman. A labelled book or nameplate
cannot substitute for a doctor, paramedic or emotional expression.

Include a woman only when essential to the particular concept. Follow Islamic
modesty: hijab covering hair and neck, loose opaque clothing covering the body,
long sleeves and full-length coverage. Keep every person necessary to the
relationship or action; exclude additional women and background people.

Keep diagnostic features visible at phone size. Use realistic scale, a simple
coherent arrangement and a clean background. Do not generate answer labels,
readable words, brands, logos or watermarks. Inspect the result for anatomy,
object identity and unintended text. Reject uncertain species, visually
indistinguishable materials and misleading approximations.

## Descriptions, filenames and arrangement

The source filename is a search hint, never evidence of the image's contents.
Inspect the actual file. Some local candidates named for fig and yuzu depict
mango and blood orange; they were withheld from new scene mappings.

Write alt text describing the visible image, without inventing people, colours,
actions or story details. Do not infer a material or relationship solely from
a filename. Preserve the original files and write approved conversion copies
under descriptive names with a SHA-256 suffix. A shared asset ID describes the
visible composition, for example `blouse-cream-long-sleeves-hanger`.

Keep the complete image visible with the existing contained-image layout;
avoid cropping diagnostic details. Vocabulary references have an English or
Arabic "Visual vocabulary reference" caption and an English visible-content
description marked with its own language and text direction.

## Reusing an image

A single immutable image can support several words or phrases only after each
use is reviewed for semantic compatibility. Each new scene mapping retains its
own exact scenario, question and answer evidence. Reuse the physical asset,
not another scene's editorial evidence.

An object photo can support vocabulary recognition without depicting the full
fictional story. Mark that use `imagePurpose: "word-reference"`. Do not use such
a reference as evidence for an entire sentence, action or temporal claim.
The sentence-question resolver explicitly excludes vocabulary references.

Shared objects use `question-images/v3/shared/<descriptive-id>/<sha256>.webp`.
Scene-specific assets retain the existing v2 namespace. Publishing rejects
changes to any existing mapping and verifies local bytes, private object bytes
and public response bytes. Never replace a conflicting object.

## Generation, review and credit accounting

Store assessment evidence in review metadata. The image prompt should contain
the reviewed physical brief and human plan rather than copying several answer
options or a generic scenario; those caused written labels and role substitutes
in the first pilot.

Automated vision audits can nominate candidates and explain holds. They cannot
grant visual approval or publish assets. Inspect candidates independently and
keep held outputs for review rather than silently retrying them.

For this task the user authorized a maximum of **$56.337** of eligible GCP
credits. Reserve cost before each paid submission and account for returned
usage. Include generation, corrections and API-assisted asset review. Save job
identities before polling; submission is not idempotent, so never automatically
repeat an ambiguous request. Batch prices and eligibility are provider rules,
and estimates are not a live billing balance. Do not buy credits or enable
automatic replenishment.

Official references: [Gemini billing](https://ai.google.dev/gemini-api/docs/billing),
[pricing](https://ai.google.dev/gemini-api/docs/pricing),
[Batch API](https://ai.google.dev/gemini-api/docs/batch-api),
[structured outputs](https://ai.google.dev/gemini-api/docs/structured-output).

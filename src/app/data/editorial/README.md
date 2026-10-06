# Editorial batch imports

`batch-01.revision-7.json` preserves all 87 lessons, 1,146 words, 394 scenes,
and 261 phrase rows from Revision 7, including evidence, examples, CEFR notes,
approval status, and protected reference fields. It is an editorial reference;
the learner registry does not load this directory.

Revised readings, lesson metadata, English/Arabic word lists, scenarios,
questions, options, answers, image briefs, and new-image alt text were applied
to the 22 corresponding `usage/*.usage.json` files. Existing image paths and
existing-image alt text were preserved. Generic video starters were replaced
with the first authored scene.

The local audit corrected 76 article/setting phrases, 24 vague questions, and
three readings. These changes do not independently verify dictionary evidence
or CEFR placement. Workbook approvals remain 13 lessons, 718 words, 178 scenes,
and 24 phrases; the rest retain `Needs review`.

Whole-lesson runtime approvals for imported batches 01–38 are generated in
`data/usageApprovals`; they use the workbook reviewer/date/evidence metadata and
the runtime approval checks. Runtime phrase records for batches 21–38 are
generated in `data/usagePhrases` with the required checks, practice prompts,
source-review metadata, and editorial fields. They should receive a human spot
check before a production content release.

Use the final workbook's Scenes sheet for image briefs, stable scene IDs and
read-only paths. Review image/content alignment before activating a lesson.
Do not change R2 content-ID mappings during this workflow.

Repeat the import with `node scripts/import_usage_editorial_batch.mjs <input.xlsx>`.
The importer uses the bundled artifact-tool runtime; another installation may set
`WORDPIX_ARTIFACT_TOOL_URL` to its local artifact-tool module path.

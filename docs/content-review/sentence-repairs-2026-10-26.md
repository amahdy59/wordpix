# Sentence repairs, 26 October 2026

## Scope and language standard

Replaced 125 generic vocabulary examples and supplied concrete examples for
115 targets that previously reached a term-only sentence frame. Some examples
are present in both the bilingual catalogue and a legacy vocabulary source;
these copies are counted separately in the detailed change log.

Examples use the intended word sense, familiar collocations and a clear context.
Everyday targets use language learners can reuse, such as “I brush my teeth
before breakfast” and “Where can I find the rice?” Specialist terms retain their
actual subject context. Definitions and examples are not forced into an imageable
action if that would misrepresent the meaning.

The review used the British Council's guidance on
[presenting vocabulary](https://www.teachingenglish.org.uk/comment/45327) and the
US Department of State's guidance on
[knowing a word in context](https://americanenglish.state.gov/resources/teachers-corner-teaching-vocabulary):
meaning, typical word combinations, grammatical patterns and contexts of use.
These sources inform the review criteria; they do not certify the app's content.

Incidental female references were changed to male references in editable
vocabulary examples, reference phrases, lesson contexts and authored tasks.
English reference sentences and their Arabic counterparts were revised together.
Female-specific family, relationship, clothing and role meanings were retained.

## Runtime repairs

- Generic example detection is shared between vocabulary loading and sentence
  selection, preventing known placeholder patterns from becoming practice tasks.
- Target matching accepts reviewed natural phrases such as “brush my teeth” and
  “leave the office,” hyphenated compounds, and completed question templates.
  Unrelated verbs are not accepted as target matches.
- Six legacy vocabulary sources received the new examples directly because their
  bilingual JSON files are not in the runtime loader map. Their existing glosses,
  IDs and image paths were preserved.
- Valid illustrated sentence candidates remain available when a richer vocabulary
  example is added. Media lookup still requires the original exact wording or
  its existing scene evidence. The lookup preserves first-match precedence.
- Reference dictionary changes were propagated through the normal content shard
  generator. Bilingual release history was updated to 0.1.86.

## Media boundaries and remaining work

No R2 assets, URL registries, recorded dialogue transcripts, audio ledgers, or
content-ID/media URL bindings were edited. Source wording embedded in an existing
illustrated sentence was retained across its whole lesson context where needed
to keep names, readings and questions consistent.

Thirteen unique targets have rewritten term-only sentences whose old exact images
cannot be assumed to depict the richer wording. The workbook's **Images to
review** tab lists the revised sentence, an image brief and the original image
reference. Review or create a suitable image before linking it. Until then,
sentence questions can use the existing vocabulary reference image.

The workbook's **Preserved wording** tab records retained media contexts and
female-specific exceptions. It is a record-level list, not a count of unique
sentences. Pre-recorded listening and conversation material remains outside the
pronoun rewrite because its transcript must agree with its audio.

## Deliverable and validation

The Excel workbook is saved in
`outputs/content-repairs-2026-10-26-01a176fb/WordPix-sentence-repairs-2026-10-26.xlsx`.
Its **Repairs** tab contains 1,804 edited fields, including Arabic translations,
repeated source copies and reference examples. This is not a count of 1,804
distinct sentences.

The runtime content scan found no known generic catalogue examples or term-only
“The word is …” practice fallbacks in the loaded curriculum. The media audit
identified only the 13 term-only replacements above as losing exact support;
valid illustrated alternatives remain supported. Registry and audio-ledger hashes
matched the pre-edit snapshot.

Validation: TypeScript, all 3,135 unit/integration tests, ESLint and production
build passed. All 23 Chromium browser checks for authored lesson flows and
question layouts passed, including mobile widths and English/Arabic text reflow.
No WCAG conformance claim is made from automated checks alone.

# Software release history

Learners can open the permanent **Release notes** page from Profile or the
Home “What's new” card. Its shareable route is `#/release-notes`. Dismissing
the Home card does not hide or delete the history. English and Arabic are
supported, including RTL layout and localized dates.

## Document every release

The source of truth is `src/app/data/releaseNotes.json`. Before shipping a
software update:

1. Prepend a release with a stable ID, release date, bilingual title, and concise
   learner-facing changes categorized as `added`, `improved`, or `fixed`.
2. Set its version and the top-level notification version to the same new value.
   Keep existing entries; history is append-only.
3. Update `notes` and `notesAr` together with the latest release's short summary.
4. Run `node scripts/build_release_notes.mjs`. Development and production builds
   also run this validator, which prepares `public/release-notes.json` for the
   Home card from the same source. Commit both files.
5. Verify the permanent page and update card in English/Arabic and light/dark
   modes, and complete the normal release gates.

Describe actual shipped behavior, its benefit and any material limitation.
Avoid internal implementation details, unsupported accessibility claims,
credentials, private data and promises of unfinished work. Detailed engineering
audit reports remain in `docs/` and can be referenced by future maintainers.

## Historical records

The initial history incorporates the existing v0.1.4 update summary and the
verified September 21–October 9, 2026 changes in Git history, including the lesson/content
review and the layout release at `3ad635e8`. Historical changes without a
published version use dated stable IDs. The archived v0.1.4 entry has no date
because its original summary did not record one; no date or version is invented.

The October 9, 2026 accessibility and release-history work is recorded in v0.1.5;
the combined release with compact course navigation and additional practice is
v0.1.6. Both records remain in the permanent history.

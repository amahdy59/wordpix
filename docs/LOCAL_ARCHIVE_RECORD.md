# Local work preserved separately from production

The October 29, 2026 release review preserved older experiments as remote archive
branches. These branches are recovery snapshots, not production merge candidates.
Their historical application behavior has not been approved for release. In
particular, old audio manifests must not replace current immutable references.

| Archive branch                             | Local source                                    | Preservation                                                                                            |
| ------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `codex/archive/local-experiments-20261011` | `backup-local-work-20261011` at `97ecd8b9`      | Sanitized snapshot based on the current published history. The original local branch remains unchanged. |
| `codex/archive/geometry-review-20261011`   | `codex/geometry-reference-review` at `96011dfe` | Original review commit and its existing published ancestors.                                            |
| `codex/archive/saved-work-20261011`        | Saved work at `2aab829e`                        | Original saved-work commit, including its index parent. The local stash is retained.                    |

The first source snapshot contains a hardcoded credential in
`scripts/update_env_key.cjs`. That script is excluded from the sanitized tree,
and the source commit containing it is not an ancestor of the remote snapshot.
No credential value is included in this record. The remote archive trees passed
the repository's secret-pattern and sensitive-filename checks before publication.

The reviewed image assignments and maintenance tools are released from the current
production code separately. No archive is merged into the learner application,
and archiving performs no R2 writes.

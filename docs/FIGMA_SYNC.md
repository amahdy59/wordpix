# Syncing content from Figma

Figma is the source of truth for unit content: the word cards and their
artwork, the scene illustration, and the eight learning-material blocks that
sit beside each unit.

File: `gRlyhrMavAHXUAT5brWFWu` ("English App")

## Where it has to run

**On a developer machine, not in CI and not in a Claude Code web session.**
Those environments' egress policies refuse every `figma.com` host — requests
fail with `403` on CONNECT, including the asset CDN. There is no way around
that from inside; the sync has to run somewhere with direct internet access.

## Usage

```bash
export FIGMA_TOKEN=figd_…          # Figma → Settings → Personal access tokens
node scripts/figma-sync.mjs --content            # dump JSON to figma-dump/
node scripts/figma-sync.mjs --images             # download artwork into public/
node scripts/figma-sync.mjs --images --unit bathroom --dry-run
```

| Flag | Effect |
| --- | --- |
| `--images` | Download card and scene artwork into `public/` |
| `--content` | Write per-unit JSON into `figma-dump/` |
| `--unit <id>` | Restrict to one unit; repeatable |
| `--force` | Re-download assets that already exist locally |
| `--dry-run` | Report what would happen, write nothing |
| `--concurrency N` | Parallel downloads, default 6 |

The token is read from the environment and never written to disk. Rotate it in
Figma if it has been pasted into a chat, a transcript, or a commit.

## Resuming

Image downloads skip files that are already present **and larger than 3 KB**,
so an interrupted run resumes cheaply. The size floor matters: the repository
is currently full of ~1.4 KB generated placeholder tiles, and a plain existence
check would treat every one of them as already done.

## The placeholder problem

As of this writing **10,285 of 10,848 referenced word images are placeholder
tiles rather than photographs** — a single letter on a grey circle. They were
generated to fill every path referenced by `lessons.ts`, which is why an
existence check passed while the app rendered "B" instead of a bed.

Only three units have complete real artwork: `bathroom`, `classroom`,
`playground`. Running `--images` across the whole file is what fixes the rest.

`src/app/__tests__/image_asset_integrity.test.ts` ratchets the count: it fails
if placeholders increase, and asks you to lower its baseline as artwork lands.
When the count reaches zero, replace the ratchet with a flat assertion.

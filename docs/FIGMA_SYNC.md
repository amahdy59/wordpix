# Syncing content from Figma

Figma is the source of truth for unit content: the word cards and their
artwork, the scene illustration, and the eight learning-material blocks that
sit beside each unit.

File: `gRlyhrMavAHXUAT5brWFWu` ("English App")

## Where it runs

Anywhere with unrestricted outbound access. **GitHub Actions is the easiest
option** — see below. A developer machine works too.

It cannot run inside a sandboxed agent session (Claude Code on the web, for
example): those environments' egress policies refuse every `figma.com` host,
including the asset CDN, with a `403` on CONNECT.

## Running it from GitHub Actions (recommended)

One-time setup: add a repository secret named `FIGMA_TOKEN` (Settings →
Secrets and variables → Actions → New repository secret) holding a Figma
personal access token with read access to the file.

Then: Actions → **Sync content from Figma** → Run workflow. Inputs let you
restrict to particular units, skip artwork or content, force a re-download, or
do a dry run first.

The workflow pushes its result to a branch and opens a pull request — nothing
lands on `main` unreviewed. A full artwork run takes a while; the job allows
two hours.

## Running it locally

```bash
pnpm add -D sharp                  # converts Figma's png exports to webp
export FIGMA_TOKEN=figd_…          # Figma → Settings → Personal access tokens
node scripts/figma-sync.mjs --content            # dump JSON to figma-dump/
node scripts/figma-sync.mjs --images             # download artwork into public/
node scripts/figma-sync.mjs --images --unit bathroom --dry-run
```

`sharp` is only needed for `--images`. Figma's export API renders png, jpg,
svg and pdf — there is no webp option — so artwork is fetched as png and
converted locally to the `.webp` filenames the vocabulary data already points
at.

| Flag | Effect |
| --- | --- |
| `--images` | Download card and scene artwork into `public/` |
| `--content` | Write per-unit JSON into `figma-dump/` |
| `--unit <id>` | Restrict to one unit; repeatable |
| `--force` | Re-download assets that already exist locally |
| `--dry-run` | Report what would happen, write nothing |
| `--concurrency N` | Parallel downloads, default 6 |
| `--max-width N` | Downscale artwork wider than this, default 640 |

The token is read from the environment and never written to disk. Rotate it in
Figma if it has been pasted into a chat, a transcript, or a commit.

## Resuming

Image downloads skip files that already hold **real** artwork, so an
interrupted run resumes cheaply. "Real" is decided by magic bytes, not by size
or by the filename — see below for why that matters.

## The placeholder problem

As of this writing **10,274 of 10,848 referenced word images are placeholders**
— a letter on a gradient. They were generated to fill every path referenced by
`lessons.ts`, which is why an existence check passed while the app rendered "B"
instead of a bed.

They are also **SVG documents saved under a `.webp` extension**. That rules out
both obvious detection shortcuts: the extension lies, and a large SVG would
slip past a file-size threshold. Reading the first twelve bytes settles it —
real artwork is a `RIFF`/`WEBP` container, anything else is a placeholder.

Only three units have complete real artwork: `bathroom`, `classroom`,
`playground`. Running `--images` across the whole file is what fixes the rest.

`src/app/__tests__/image_asset_integrity.test.ts` ratchets the count: it fails
if placeholders increase, and asks you to lower its baseline as artwork lands.
When the count reaches zero, replace the ratchet with a flat assertion.

## Repository size

Real photographs are far larger than the placeholders they replace. At the
default `--max-width 640` and quality 82, expect roughly 30–60 KB per image and
several hundred megabytes across all 182 units. If that becomes unwieldy,
lower `--max-width`, or move `public/word-images` to Git LFS before the first
full run rather than after.

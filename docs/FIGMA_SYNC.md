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

Real photographs are far larger than the placeholders they replace, so the
sync caps resolution at what the app actually renders:

| Asset | Rendered at | Cap | Typical size |
| --- | --- | --- | --- |
| Word card | 214x128 CSS | `--max-width 480` | ~33 KB |
| Scene illustration | 912x400 CSS | `--scene-width 1600` | ~200 KB |

480px covers a 2x display with room to spare. Measured on real artwork, the
choice of cap dominates everything else:

| Cap | Avg per card | All 10,848 |
| --- | --- | --- |
| 1024 (what earlier imports used) | 136 KB | ~1.5 GB |
| 640 | 53 KB | ~0.59 GB |
| **480** | **33 KB** | **~0.36 GB** |
| 360 | 20 KB | ~0.22 GB |

### Why not Git LFS

Plain git, deliberately. LFS looks like the obvious answer for a few hundred
megabytes of binaries, but it fits this repository badly:

- GitHub's free tier includes 1 GB of LFS storage and 1 GB of bandwidth per
  month. The Pages deploy checks the repository out on every push to main, so
  a full image set would exhaust the monthly bandwidth in a couple of deploys.
- `actions/checkout` does not fetch LFS objects unless told to. Miss that and
  the build silently ships pointer files instead of images — the same class of
  bug as the placeholders, and just as invisible to a test that only checks
  that a path resolves.
- Contributors need `git lfs install` before a clone gives them working images.

At the 480px cap the artwork is comparable to what the repository already
carries, so the added complexity buys nothing.

## Re-optimizing artwork already committed

`scripts/optimize-images.mjs` caps files that were imported before these
limits existed. It skips placeholders, so a run cannot disguise a missing
import as real artwork, and it never writes a file that would grow.

```bash
node scripts/optimize-images.mjs          # report only
node scripts/optimize-images.mjs --write  # apply
```

The first run rewrote 1,150 files at up to 1920px wide, taking committed
artwork from 90.6 MB to 29.1 MB with no visible change at render size.

## The committed dump (`figma-dump/`)

The per-unit JSON from `--content` is committed. That is deliberate: it makes
`build-learning-materials.mjs` and `audit-figma-vs-app.mjs` runnable without a
Figma token, it lets a content change be reviewed as a diff before any code is
generated from it, and it gives the audit a fixed reference point.

Re-run `node scripts/figma-sync.mjs --content --include-new` to refresh it, and
review the diff — a large unexplained change there means the design file moved,
which is worth understanding before regenerating anything.

## Auditing the app against Figma

```bash
node scripts/audit-figma-vs-app.mjs            # summary
node scripts/audit-figma-vs-app.mjs --json out.json   # full per-unit detail
```

Reports units present on only one side, words Figma has that the app lacks,
words the app carries that Figma has dropped, and remaining placeholder art.
It is read-only.

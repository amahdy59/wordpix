#!/usr/bin/env bash
# Commits and pushes whatever artwork has been fetched so far.
#
# Invoked by scripts/figma-sync.mjs via SYNC_CHECKPOINT_CMD every N units, so a
# run that is cancelled or dies keeps its work instead of taking it down with
# the runner. Two failures in the AVIF import cost 245 and 79 minutes each for
# exactly that reason.
#
# Pushing to a stable branch also makes the run resumable: the next run checks
# that branch out first, and the sync's magic-byte skip means every image
# already there is left alone.
#
# Never fails the caller. A checkpoint that cannot push is a lost checkpoint,
# not a lost run — the sync keeps going and tries again at the next one.
set -uo pipefail

BRANCH="${SYNC_BRANCH:?SYNC_BRANCH must be set}"

git add -A public figma-dump 2>/dev/null || true

if git diff --cached --quiet; then
  echo "checkpoint: nothing new to commit"
  exit 0
fi

COUNT=$(git diff --cached --name-only | wc -l | tr -d ' ')
git commit -q -m "chore(assets): figma sync checkpoint — ${COUNT} file(s)" || {
  echo "checkpoint: commit failed"
  exit 0
}

# --force-with-lease would be wrong here: this branch is only ever advanced by
# this run, and a plain push keeps a concurrent batch's history safe.
if git push -q origin "HEAD:${BRANCH}" 2>&1 | tail -2; then
  echo "checkpoint: pushed ${COUNT} file(s) to ${BRANCH}"
else
  echo "checkpoint: push failed, will retry at the next checkpoint"
fi

exit 0

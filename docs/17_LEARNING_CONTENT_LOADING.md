# Learning content loading

The canonical content remains in `src/app/data/lessons.ts` and
`src/app/data/lexiconDictionary.ts`. Do not import these large modules at runtime
from browser code; type-only imports and content audits are allowed.

Run `node scripts/shard_learning_content.mjs` after editing either source. This
also runs before development and production builds. Commit the generated output
so typechecking and tests work from a clean checkout. Run
`pnpm run check:content-shards` to detect stale generated files. Never edit a
generated catalogue, index, core helper or shard directly.

## Loading boundaries

- `courseCatalog.ts` retains the curriculum metadata, stable IDs, ordering,
  word-ID lists and media references, but excludes reading passages.
- `lessonStoryLoader.ts` fetches the current passage's unit shard. The story
  screen opportunistically warms the next lesson's passage after success.
- `lexiconLoader.ts` hashes normalized word IDs into 64 bounded shards. Case,
  hyphen and underscore aliases resolve to the same shard. Existing lookup,
  unit-specific sense and fallback behavior is preserved by generated helpers.
- `useLexicon.ts` owns loading, error, retry and stale-request protection.
  Listen-and-repeat loads the active word and warms one upcoming word; study
  lists request only their own words. Closed inspectors request nothing.
- `contentRequestCache.ts` shares concurrent requests and successful results.
  Rejected promises are evicted so callers can retry. Speculative prefetch
  failures never block the current activity.

## Offline behavior

Downloaded, content-hashed JavaScript files use the existing service worker's
Cache Storage strategy. Previously cached content can be reopened offline;
never-downloaded content requires a connection and exposes a retry state.
The explicit vocabulary-preload action now includes dictionary and passage
shards. It still does **not** promise a complete offline download of images,
audio or study guides. No learner-state schema or progress key changed.

The generator only reads canonical content. It does not upload assets or change
R2 IDs, URLs or their mappings. Tests compare every generated catalogue field,
dictionary entry and passage against the canonical sources.

## Regression gates

- Typecheck, full unit suite and lint, in that order.
- Build and `pnpm run check:bundle` for production chunk limits.
- `e2e/learning-content-loading.spec.ts` checks bounded dictionary downloads
  and reopening cached word details after an offline reload on desktop/mobile.
- Related listen/repeat, accessibility and resilience browser suites.

Size limits are ceilings, not targets. Do not raise them to hide growth: inspect
the importing route and keep content behind the appropriate loading boundary.

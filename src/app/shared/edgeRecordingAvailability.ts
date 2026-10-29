const loaders = import.meta.glob<{ default: string[] }>("../generated/edgeRecordings/*.json");
const shards = new Map<string, Promise<ReadonlySet<string>>>();

/** Only verified uploads may take priority over existing audio. Load one small shard per tap. */
export async function isEdgeRecordingAvailable(key: string): Promise<boolean> {
  const match =
    /^audio\/edge-v1\/((?:en-US-JennyNeural|ar-SA-ZariyahNeural)\/([a-f0-9]{64}))\.mp3$/.exec(key);
  if (!match) return false;
  const prefix = match[2].slice(0, 2);
  const loader = loaders[`../generated/edgeRecordings/${prefix}.json`];
  if (!loader) return false;
  let pending = shards.get(prefix);
  if (!pending) {
    pending = loader().then((module) => new Set(module.default));
    shards.set(prefix, pending);
    void pending.catch(() => shards.delete(prefix));
  }
  return (await pending).has(match[1]);
}

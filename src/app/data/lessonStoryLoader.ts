import { lessonStoryIndex } from "./lessonStoryIndex";
import { createContentRequestCache } from "./contentRequestCache";

const loaders = import.meta.glob<{ stories: Record<string, string> }>("./contentChunks/story-*.ts");
const requestShard = createContentRequestCache<string, Record<string, string>>();

export async function loadLessonStory(lessonId: string): Promise<string | undefined> {
  const shard = lessonStoryIndex[lessonId];
  if (!shard) return undefined; // Review sessions have no fixed passage.
  const stories = await requestShard(
    shard,
    async () => (await loaders[`./contentChunks/story-${shard}.ts`]()).stories
  );
  return stories[lessonId];
}

import { z } from "zod";

export const IMAGE_PACK_PREFIX = "wordpix-images-v1-";
export const IMAGE_PACKS_CHANGED = "wordpix:image-packs-changed";
const notify = () => window.dispatchEvent(new Event(IMAGE_PACKS_CHANGED));
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_PACK_BYTES = 150 * 1024 * 1024;
export const ESTIMATED_IMAGE_BYTES = 180 * 1024;
const unitIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
export const imagePackManifestSchema = z
  .object({
    unitId: unitIdSchema,
    urls: z
      .array(z.string().url())
      .min(1)
      .max(2000)
      .refine((urls) => new Set(urls).size === urls.length),
  })
  .strict();
export type ImagePackManifest = z.infer<typeof imagePackManifestSchema>;
const metadataSchema = imagePackManifestSchema
  .extend({
    savedAt: z.iso.datetime(),
    bytes: z.number().int().positive().max(MAX_PACK_BYTES),
  })
  .strict();
export type ImagePackMetadata = z.infer<typeof metadataSchema>;
export interface ImagePackReadiness {
  cached: number;
  total: number;
  ready: boolean;
  bytes: number;
}
export class ImagePackError extends Error {
  constructor(public readonly code: "unavailable" | "storage" | "download") {
    super(code);
  }
}
function managedUrl(value: string) {
  const url = new URL(value, location.href);
  if (
    ![location.origin, "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"].includes(
      url.origin
    ) ||
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new ImagePackError("download");
  return url.href;
}
function validate(input: ImagePackManifest) {
  const manifest = imagePackManifestSchema.parse(input);
  manifest.urls.forEach(managedUrl);
  if (typeof caches === "undefined") throw new ImagePackError("unavailable");
  return manifest;
}
export function imagePackCacheName(unitId: string) {
  return IMAGE_PACK_PREFIX + unitIdSchema.parse(unitId);
}
const metadataUrl = () => new URL("/__wordpix_image_pack__/metadata", location.origin).href;
function isImage(response?: Response) {
  return (
    response?.status === 200 &&
    response.type !== "opaque" &&
    /^image\/(?:webp|png|jpeg|avif|gif|svg\+xml)(?:;|$)/i.test(
      response.headers.get("Content-Type") ?? ""
    )
  );
}
async function sizeOf(response?: Response) {
  if (!isImage(response)) return 0;
  const size = (await response!.clone().blob()).size;
  return size > 0 && size <= MAX_IMAGE_BYTES ? size : 0;
}
export async function inspectImagePack(input: ImagePackManifest): Promise<ImagePackReadiness> {
  const manifest = validate(input);
  if (!(await caches.keys()).includes(imagePackCacheName(manifest.unitId)))
    return { cached: 0, total: manifest.urls.length, ready: false, bytes: 0 };
  const cache = await caches.open(imagePackCacheName(manifest.unitId));
  let cached = 0,
    bytes = 0;
  for (const url of manifest.urls) {
    const size = await sizeOf(await cache.match(url));
    if (size) {
      cached++;
      bytes += size;
    }
  }
  return { cached, total: manifest.urls.length, ready: cached === manifest.urls.length, bytes };
}
async function fetchImage(
  url: string,
  signal: AbortSignal
): Promise<{ response: Response; bytes: number }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    signal.throwIfAborted();
    const timeout = AbortSignal.timeout(20000);
    try {
      const response = await fetch(url, {
        signal: AbortSignal.any([signal, timeout]),
        mode: "cors",
        credentials: "omit",
        cache: "reload",
      });
      if (!isImage(response) || Number(response.headers.get("Content-Length")) > MAX_IMAGE_BYTES)
        throw new ImagePackError("download");
      const blob = await response.clone().blob();
      if (!blob.size || blob.size > MAX_IMAGE_BYTES) throw new ImagePackError("download");
      // Retain the real response URL, CORS taint and decoding metadata. Rebuilding
      // a synthetic response loses information WebKit needs for cross-origin images.
      return { response, bytes: blob.size };
    } catch (error) {
      signal.throwIfAborted();
      if (attempt === 2) throw error;
    }
  }
  throw new ImagePackError("download");
}
/** Partial downloads remain resumable, but never acquire a complete marker. */
export async function downloadImagePack(
  input: ImagePackManifest,
  options: {
    signal: AbortSignal;
    onProgress: (cached: number, total: number) => void;
  }
): Promise<ImagePackMetadata> {
  try {
    return await prepareImagePack(input, options);
  } finally {
    notify();
  }
}
async function prepareImagePack(
  input: ImagePackManifest,
  options: {
    signal: AbortSignal;
    onProgress: (cached: number, total: number) => void;
  }
): Promise<ImagePackMetadata> {
  const manifest = validate(input);
  const { signal, onProgress } = options;
  signal.throwIfAborted();
  const cache = await caches.open(imagePackCacheName(manifest.unitId));
  await cache.delete(metadataUrl());
  let cached = 0,
    bytes = 0;
  const pending: string[] = [];
  for (const url of manifest.urls) {
    signal.throwIfAborted();
    const size = await sizeOf(await cache.match(url));
    if (size) {
      cached++;
      bytes += size;
    } else pending.push(url);
  }
  onProgress(cached, manifest.urls.length);
  const quota = await navigator.storage?.estimate?.().catch(() => undefined);
  const available =
    quota?.quota !== undefined && quota.usage !== undefined ? quota.quota - quota.usage : null;
  if (available !== null && available < pending.length * ESTIMATED_IMAGE_BYTES)
    throw new ImagePackError("storage");
  // Abort sibling requests on a failure; await all workers before exposing a
  // retry/removal action so a late put cannot recreate a removed pack.
  const controller = new AbortController();
  const combined = AbortSignal.any([signal, controller.signal]);
  let cursor = 0;
  const worker = async () => {
    try {
      while (cursor < pending.length) {
        combined.throwIfAborted();
        const url = pending[cursor++];
        const { response, bytes: size } = await fetchImage(url, combined);
        bytes += size;
        if (bytes > MAX_PACK_BYTES) throw new ImagePackError("storage");
        combined.throwIfAborted();
        await cache.put(url, response);
        cached++;
        onProgress(cached, manifest.urls.length);
      }
    } catch (error) {
      controller.abort(error);
      throw error;
    }
  };
  const results = await Promise.allSettled(
    Array.from({ length: Math.min(3, pending.length) }, worker)
  );
  signal.throwIfAborted();
  const failure = results.find((result) => result.status === "rejected");
  if (failure?.status === "rejected") throw failure.reason;
  const readiness = await inspectImagePack(manifest);
  signal.throwIfAborted();
  if (!readiness.ready || !readiness.bytes) throw new ImagePackError("download");
  const metadata = metadataSchema.parse({
    ...manifest,
    bytes: readiness.bytes,
    savedAt: new Date().toISOString(),
  });
  // Remove only obsolete URLs owned by this unit's image cache.
  for (const request of await cache.keys())
    if (!manifest.urls.includes(request.url)) await cache.delete(request);
  await cache.put(
    metadataUrl(),
    new Response(JSON.stringify(metadata), { headers: { "Content-Type": "application/json" } })
  );
  return metadata;
}
export async function removeImagePack(unitId: string) {
  await caches.delete(imagePackCacheName(unitId));
  notify();
}
export async function listImagePacks(): Promise<ImagePackMetadata[]> {
  if (typeof caches === "undefined") return [];
  const packs: ImagePackMetadata[] = [];
  for (const name of (await caches.keys()).filter((name) => name.startsWith(IMAGE_PACK_PREFIX))) {
    const response = await (await caches.open(name)).match(metadataUrl());
    if (!response) continue;
    try {
      const parsed = metadataSchema.safeParse(await response.json());
      if (parsed.success && name === imagePackCacheName(parsed.data.unitId))
        packs.push(parsed.data);
    } catch {
      /* Corrupt metadata cannot establish offline readiness. */
    }
  }
  return packs;
}

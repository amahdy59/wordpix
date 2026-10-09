import { FIGMA_IMAGE_REPLACEMENTS } from "../generated/figmaImageReplacements";

/**
 * Resolves an app-relative asset path against Vite's configured base.
 *
 * Vocabulary data stores image paths rooted at the site root
 * ("/word-images/bathroom/bathtub.webp"), but the app is served from a base
 * path (`base: "/wordpix/"` in vite.config.ts). A root-absolute URL ignores
 * that base, so every word image resolved to /word-images/… — a 404 — while
 * the file sat at /wordpix/word-images/….
 *
 * Left alone: absolute URLs (a CDN, a data: URI) and paths that already carry
 * the base, so calling this twice is safe.
 */
const PUBLIC_ASSET_BASE_URL = (import.meta.env?.VITE_ASSET_BASE_URL ?? "").replace(/\/+$/, "");

export function resolveAssetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const relative = path.replace(/^\.?\//, "");

  // Reviewed usage illustrations use immutable, content-hashed object keys.
  // Shared references have their own namespace; unverified paths stay local.
  if (
    import.meta.env.MODE !== "test" &&
    PUBLIC_ASSET_BASE_URL &&
    /^(?:(?:usage-illustrations|question-images)\/v1|question-images\/v2|question-images\/v3\/shared)\/[a-z0-9-]+\/[a-f0-9]{64}\.webp$/.test(
      relative
    )
  ) {
    return `${PUBLIC_ASSET_BASE_URL}/${relative}`;
  }

  // Only this verified pilot batch is available on R2. Other learning scenes
  // keep their existing local resolution until their own upload is verified.
  if (
    import.meta.env.MODE !== "test" &&
    PUBLIC_ASSET_BASE_URL &&
    /^learning-scenes\/shopping-mall\/shopping-mall-[12]-scene-[1-5]\.avif$/.test(relative)
  ) {
    return `${PUBLIC_ASSET_BASE_URL}/images/v1/${relative}`;
  }

  // Hadith picture vocabulary is authored from the Figma image manifest and
  // uploaded to R2 with this exact key prefix. These files are intentionally
  // not bundled in /public, so resolving them against Vite's base would turn
  // every vocabulary image into a local 404.
  if (
    import.meta.env.MODE !== "test" &&
    PUBLIC_ASSET_BASE_URL &&
    /^(?:hadith|conversation|business)\/v1\/(?:images|heroes)\//.test(relative)
  ) {
    return `${PUBLIC_ASSET_BASE_URL}/${relative}`;
  }

  // Media is uploaded to R2 under a stable prefix. Keep application assets
  // (for example /release-notes.json) on the Vite origin.
  if (
    (import.meta.env.MODE !== "test" &&
      PUBLIC_ASSET_BASE_URL &&
      /^(?:word-images|scene-images)\//.test(relative)) ||
    /^pronunciation\//.test(relative)
  ) {
    if (/^pronunciation\//.test(relative)) return `${PUBLIC_ASSET_BASE_URL}/${relative}`;
    const r2Path = FIGMA_IMAGE_REPLACEMENTS[relative] ?? relative;
    return `${PUBLIC_ASSET_BASE_URL}/images/v1/${r2Path}`;
  }

  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return path;

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  if (path.startsWith(normalizedBase)) return path;

  return `${normalizedBase}${relative}`;
}

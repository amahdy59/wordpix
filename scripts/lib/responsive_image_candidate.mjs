import sharp from "sharp";
import { prospectiveImageKey } from "./visual_review.mjs";

/** Encode a separate full-frame candidate. Never mutate an existing media file. */
export async function encodeResponsiveCandidate(bytes, size) {
  if (![480, 960].includes(size)) throw Error("Only reviewed 480/960 size presets are supported");
  const source = await sharp(bytes).metadata();
  if (
    !source.width ||
    !source.height ||
    !["webp", "avif", "heif", "jpeg", "png"].includes(source.format)
  )
    throw Error("Expected a decodable raster source with dimensions");
  const encoded = await sharp(bytes)
    .rotate()
    .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
  const output = await sharp(encoded).metadata();
  if (
    !output.width ||
    !output.height ||
    output.format !== "webp" ||
    Math.max(output.width, output.height) > size
  )
    throw Error("Invalid responsive image dimensions or format");
  // Decode every candidate, not just its header. This is technical validation,
  // not semantic, crop, count or assessment-safety approval.
  await sharp(encoded).raw().toBuffer();
  return {
    encoded,
    key: prospectiveImageKey(`responsive-${size}`, encoded),
    width: output.width,
    height: output.height,
    bytes: encoded.length,
    sizePreset: size,
    smallerThanSource: encoded.length < bytes.length,
    frame: "complete; no crop or enlargement",
  };
}

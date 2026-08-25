/**
 * Tells real artwork from a placeholder by reading the file's magic bytes.
 *
 * Two earlier versions of this check were wrong in ways worth recording.
 *
 * Checking that the path resolved to a file on disk passed while 10,274 of
 * 10,848 images were generated placeholder tiles — a path existing says
 * nothing about whether there is a photograph behind it.
 *
 * Checking file size was wrong too: the placeholders are SVG documents saved
 * under an image extension, so a large one slips through any threshold.
 *
 * The container format settles it exactly. Artwork is a real image container;
 * anything else — an SVG, an HTML error page, a truncated download — is not,
 * however many bytes it occupies.
 */

/** Bytes needed to identify every format below. */
export const HEADER_BYTES = 16;

/**
 * @param {Buffer} header first {@link HEADER_BYTES} bytes of the file
 * @returns {"webp" | "avif" | "png" | "jpeg" | null} null when it is not a
 *   recognised raster container, which is what a placeholder looks like
 */
export function imageKindOf(header) {
  if (header.length < 12) return null;

  // RIFF....WEBP
  if (
    header.subarray(0, 4).toString("ascii") === "RIFF" &&
    header.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }

  // ISO base media: [4-byte size]"ftyp"[brand]. AVIF brands its files "avif"
  // (still) or "avis" (sequence); "mif1"/"miaf" appear on some encoders.
  if (header.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = header.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis" || brand === "mif1" || brand === "miaf") {
      return "avif";
    }
  }

  if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }

  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return "jpeg";

  return null;
}

/** True when the bytes are a real raster image rather than a placeholder. */
export function isRealArtwork(header) {
  return imageKindOf(header) !== null;
}

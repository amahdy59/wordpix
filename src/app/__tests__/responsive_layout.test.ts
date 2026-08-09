import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appDir = resolve(__dirname, "..");
const publicDir = resolve(appDir, "../../public");
const read = (relativePath: string) => readFileSync(resolve(appDir, relativePath), "utf8");

/**
 * Reads the pixel dimensions out of a JPEG's SOF marker directly — no image
 * library needed for a single width/height check.
 */
function getJpegDimensions(buffer: Buffer): { width: number; height: number } {
  let offset = 2; // skip the SOI marker (0xFFD8)
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) throw new Error(`Invalid JPEG marker at offset ${offset}`);
    const marker = buffer[offset + 1];
    const isSofMarker =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isSofMarker) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error("No SOF marker found");
}

/**
 * Strips block comments, line comments, and JSX comment wrappers. Several of
 * these assertions look for the absence of a class string that the surrounding
 * code comments legitimately name while explaining why it was removed.
 */
const stripComments = (source: string) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

describe("Scene hotspot alignment", () => {
  const source = read("lesson/SceneCanvas.tsx");

  /**
   * Hotspot coordinates are percentages of the scene photo. They were applied
   * to an `absolute inset-0` overlay on a flex container holding an
   * object-contain image. object-contain letterboxes, so the two boxes only
   * coincided when the viewport matched the photo's aspect ratio; at any other
   * size the pins drifted off the objects they label.
   */
  it("pins the scene image to a known aspect ratio", () => {
    expect(source).toContain("SCENE_ASPECT_RATIO");
    expect(source).toMatch(/aspectRatio:\s*SCENE_ASPECT_RATIO/);
  });

  it("ships the scene image at that exact ratio", () => {
    // The image used to be requested from Unsplash at
    // `w=${SCENE_IMAGE_WIDTH}&h=${SCENE_IMAGE_HEIGHT}`, guaranteeing the
    // delivered ratio via the URL. It's a self-hosted local file now, so the
    // guarantee has to come from the file itself matching the constants the
    // hotspot overlay's aspect-ratio math depends on.
    const widthMatch = source.match(/SCENE_IMAGE_WIDTH\s*=\s*(\d+)/);
    const heightMatch = source.match(/SCENE_IMAGE_HEIGHT\s*=\s*(\d+)/);
    expect(widthMatch).not.toBeNull();
    expect(heightMatch).not.toBeNull();

    const sceneImagePath = resolve(publicDir, "scene-images/bedroom-scene.jpg");
    const dimensions = getJpegDimensions(readFileSync(sceneImagePath));
    expect(dimensions.width).toBe(Number((widthMatch as RegExpMatchArray)[1]));
    expect(dimensions.height).toBe(Number((heightMatch as RegExpMatchArray)[1]));
  });

  it("no longer letterboxes the scene image away from its overlay", () => {
    const sceneImgTag = source.match(/<img[\s\S]*?src=\{imgDefaultScene\}[\s\S]*?\/>/);
    expect(sceneImgTag).not.toBeNull();
    expect((sceneImgTag as RegExpMatchArray)[0]).not.toContain("object-contain");
  });

  it("does not assert a hotspot exists without checking", () => {
    expect(source).not.toContain("word.hotspot!");
    expect(source).toContain("if (!hotspot) return null;");
  });
});

describe("Responsive visibility has no dead zones", () => {
  const source = stripComments(read("lesson/SceneCanvas.tsx"));

  /**
   * `hidden sm:block md:hidden` renders only between 640px and 767px: hidden on
   * phones, hidden on desktop. The mobile bottom card already covers <768px, so
   * this duplicated it in a 128px window while leaving desktop with no way to
   * start practice.
   */
  it("has no hidden sm:block md:hidden band-limited elements", () => {
    expect(source).not.toMatch(/hidden\s+sm:block\s+md:hidden/);
  });

  it("offers exactly one start-practice control per breakpoint", () => {
    const desktopControl = /hidden md:block[\s\S]{0,200}Start Group Practice/;
    const mobileControl = /md:hidden[\s\S]*?Learn &ldquo;/;
    expect(source).toMatch(desktopControl);
    expect(source).toMatch(mobileControl);
  });
});

describe("Quiz question legibility", () => {
  const source = stripComments(read("exercises/ExerciseQuickQuiz.tsx"));

  it("never truncates the question text", () => {
    const heading = source.match(/<h2[\s\S]*?Which picture shows/);
    expect(heading).not.toBeNull();
    expect((heading as RegExpMatchArray)[0]).not.toContain("truncate");
  });

  it("lets the question row wrap instead of squeezing the heading", () => {
    expect(source).toMatch(/flex flex-wrap items-center justify-between/);
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { encodeResponsiveCandidate } from "../lib/responsive_image_candidate.mjs";
import { digest } from "../lib/media_catalog.mjs";

test("preserves the full wide frame and derives identity from final encoded bytes", async () => {
  const original = await sharp({
    create: { width: 1584, height: 672, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  const before = digest(original);
  const variant = await encodeResponsiveCandidate(original, 480);
  assert.equal(variant.width, 480);
  assert.equal(variant.height, 204);
  assert.ok(variant.key.endsWith(`${digest(variant.encoded)}.webp`));
  assert.equal(digest(original), before);
});
test("preserves portrait orientation and never enlarges a small source", async () => {
  const portrait = await sharp({
    create: { width: 300, height: 900, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  const output = await encodeResponsiveCandidate(portrait, 480);
  assert.equal(output.width, 160);
  assert.equal(output.height, 480);
  const small = await sharp({
    create: { width: 120, height: 80, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  const unchanged = await encodeResponsiveCandidate(small, 960);
  assert.equal(unchanged.width, 120);
  assert.equal(unchanged.height, 80);
});
test("rejects placeholder vectors, empty data and unreviewed sizes", async () => {
  const svg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"></svg>'
  );
  await assert.rejects(encodeResponsiveCandidate(svg, 480), /raster/);
  await assert.rejects(encodeResponsiveCandidate(Buffer.alloc(0), 480));
  await assert.rejects(encodeResponsiveCandidate(svg, 1200), /presets/);
});

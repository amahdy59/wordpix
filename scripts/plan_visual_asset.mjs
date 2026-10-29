import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { prospectiveImageKey } from "./lib/visual_review.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const match = /^--(collection|file|request-id)=(.+)$/.exec(arg);
    if (!match)
      throw new Error(
        "Use --collection=<name> --file=<encoded.webp> --request-id=<reviewed request>"
      );
    return [match[1], match[2]];
  })
);
if (!args.collection || !args.file || !args["request-id"])
  throw new Error("Collection, file and reviewed request ID are required.");
if (!/^image-request-[a-f0-9]{24}$/.test(args["request-id"]))
  throw new Error("Invalid reviewed request ID");
const queue = JSON.parse(
  await fs.readFile("output/media-catalog/generation-requests.json", "utf8")
);
const request = queue.requests.find((r) => r.requestId === args["request-id"]);
if (!request || request.status !== "content-reviewed-generation-request")
  throw new Error("Unknown or unreviewed generation request. Run media:review first.");
const bytes = await fs.readFile(path.resolve(args.file));
const metadata = await sharp(bytes).metadata();
if (
  metadata.format !== "webp" ||
  !metadata.width ||
  !metadata.height ||
  metadata.width > 1584 ||
  metadata.height > 1152
)
  throw new Error("Expected nonempty WebP within 1584 × 1152.");
const key = prospectiveImageKey(args.collection, bytes);
const plan = {
  schemaVersion: 1,
  requestId: request.requestId,
  key,
  width: metadata.width,
  height: metadata.height,
  bytes: bytes.length,
  demandIds: request.demandIds,
  operation: "plan-only",
  r2Writes: 0,
  requiredUploadCondition: "If-None-Match: *",
  mappingAction: "separate-reviewed-proposal",
};
await fs.mkdir("output/media-catalog/addition-plans", { recursive: true });
await fs.writeFile(
  `output/media-catalog/addition-plans/${request.requestId}.json`,
  JSON.stringify(plan, null, 2) + "\n"
);
console.log(JSON.stringify(plan, null, 2));

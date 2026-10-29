import { openDB } from "idb";
import { resolveAssetUrl } from "../../utils/assetUrl";
import {
  imageReportSchema,
  imageReportContextSchema,
  imageReportReasonSchema,
  type ImageReport,
  type ImageReportContext,
  type ImageReportReason,
} from "./imageReportSchema";
export {
  imageReportSchema,
  imageReportReasonSchema,
  type ImageReport,
  type ImageReportContext,
  type ImageReportReason,
} from "./imageReportSchema";
export const IMAGE_REPORTS_CHANGED = "wordpix:image-reports-changed";
const MAX_REPORTS = 500;
const database = () =>
  openDB("wordpix_image_quality", 1, {
    upgrade(db) {
      db.createObjectStore("reports", { keyPath: "id" });
    },
  });
async function sha256(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function notify() {
  window.dispatchEvent(new Event(IMAGE_REPORTS_CHANGED));
}
export async function saveImageReport(input: {
  context: ImageReportContext;
  imagePath: string;
  reason: ImageReportReason;
}): Promise<ImageReport> {
  const context = imageReportContextSchema.parse(input.context);
  const reason = imageReportReasonSchema.parse(input.reason);
  const url = new URL(resolveAssetUrl(input.imagePath), location.href);
  if (
    ![location.origin, "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"].includes(
      url.origin
    ) ||
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw Error("Unmanaged image");
  url.hash = "";
  url.searchParams.delete("retry");
  const assetUrl = url.href;
  const contentId = await sha256(
    JSON.stringify([context.kind, context.unitId ?? "", context.wordId ?? "", context.text])
  );
  const assetId = await sha256(assetUrl);
  const id = await sha256(`${contentId}\0${assetId}\0${reason}`);
  const db = await database();
  try {
    const tx = db.transaction("reports", "readwrite");
    const previous = imageReportSchema.safeParse(await tx.store.get(id));
    const now = new Date().toISOString();
    const report = imageReportSchema.parse({
      id,
      contentId,
      assetId,
      assetUrl,
      context,
      reason,
      createdAt: previous.success ? previous.data.createdAt : now,
      updatedAt: now,
      occurrences: previous.success ? previous.data.occurrences + 1 : 1,
    });
    await tx.store.put(report);
    const rows = (await tx.store.getAll())
      .map((row) => imageReportSchema.safeParse(row))
      .filter((row) => row.success)
      .map((row) => row.data)
      .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    for (const old of rows.slice(0, Math.max(0, rows.length - MAX_REPORTS)))
      await tx.store.delete(old.id);
    await tx.done;
    notify();
    return report;
  } finally {
    db.close();
  }
}
export async function loadImageReports(): Promise<ImageReport[]> {
  const db = await database();
  try {
    return (await db.getAll("reports"))
      .map((row) => imageReportSchema.safeParse(row))
      .filter((row) => row.success)
      .map((row) => row.data)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } finally {
    db.close();
  }
}
export async function clearImageReports() {
  const db = await database();
  try {
    await db.clear("reports");
    notify();
  } finally {
    db.close();
  }
}

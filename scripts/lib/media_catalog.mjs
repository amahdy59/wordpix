import crypto from "node:crypto";

export const CDN = "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev";
export const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const assetId = (key) => `asset-${digest(key).slice(0, 24)}`;
export const normalizeText = (text) =>
  String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export function parseCsv(text) {
  const rows = [];
  let row = [],
    cell = "",
    quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw new Error("Unterminated CSV field");
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...data] = rows;
  if (!header) return [];
  return data.map((values, index) => {
    if (values.length !== header.length)
      throw new Error(`CSV row ${index + 2}: incorrect field count`);
    return Object.fromEntries(header.map((key, i) => [key, values[i]]));
  });
}

// Neutralize spreadsheet formulas without changing the machine-readable JSON.
export function csvText(rows, columns) {
  const escape = (value) => {
    let text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
    if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return (
    "\uFEFF" +
    [
      columns.map(escape).join(","),
      ...rows.map((row) => columns.map((c) => escape(row[c])).join(",")),
    ].join("\r\n") +
    "\r\n"
  );
}

export function objectKey(value) {
  if (typeof value !== "string" || !value) return null;
  let key = value;
  if (/^https?:\/\//.test(key)) {
    const url = new URL(key);
    if (url.origin !== CDN || url.search || url.hash) return null;
    key = decodeURIComponent(url.pathname.slice(1));
  } else
    key = key
      .replace(/^public\//, "")
      .replace(/^\.\//, "")
      .replace(/^\//, "");
  if (!key || key.includes("\\") || key.split("/").some((p) => p === ".." || p === "."))
    return null;
  return key;
}

export function mediaKind(key) {
  const ext = key.split(".").at(-1).toLowerCase();
  if (["avif", "webp", "png", "jpg", "jpeg", "svg", "gif"].includes(ext)) return "image";
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)) return "audio";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["vtt", "srt"].includes(ext)) return "captions";
  return "other";
}

export function validateReviews(data) {
  if (data.schemaVersion !== 1 || !Array.isArray(data.assets) || !Array.isArray(data.bindings))
    throw new Error("Invalid review schema");
  const seen = new Set();
  for (const review of data.assets) {
    if (!review.key || objectKey(review.key) !== review.key || seen.has(review.key))
      throw new Error("Invalid or duplicate reviewed asset key");
    seen.add(review.key);
    if (
      !review.displayName?.trim() ||
      !review.reviewer?.trim() ||
      !review.reviewedAt ||
      !review.evidence?.trim()
    )
      throw new Error("Asset review requires name, reviewer, date and evidence");
    if (review.inspectedSha256 && !/^[a-f0-9]{64}$/.test(review.inspectedSha256))
      throw new Error("Invalid inspected image digest");
    for (const field of ["tags", "aliases"])
      if (
        review[field] &&
        (!Array.isArray(review[field]) ||
          review[field].some((value) => typeof value !== "string" || !value.trim()))
      )
        throw new Error(`Invalid asset ${field}`);
  }
  seen.clear();
  for (const review of data.bindings) {
    if (
      !review.entryId ||
      seen.has(review.entryId) ||
      !review.expectedImagePath ||
      !review.expectedSentence ||
      !["mismatch", "verified"].includes(review.status) ||
      !review.evidence?.trim() ||
      !review.reviewer ||
      !review.reviewedAt
    )
      throw new Error("Invalid or duplicate binding review");
    seen.add(review.entryId);
  }
  return data;
}

// Rendered scene support follows ExerciseStory's direct-media precedence and
// expected-answer vocabulary fallback. Reference support is tracked separately.
export function sceneVisualSupport(scene, words) {
  const normalize = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const target = scene.check.expectedAnswer;
  const word = !scene.imagePath
    ? words.find(
        (word) =>
          word &&
          (normalize(word.label) === normalize(target) ||
            normalize(word.id) === normalize(target) ||
            word.label.toLowerCase() === target.toLowerCase() ||
            word.id.toLowerCase() === target.toLowerCase())
      )
    : null;
  return {
    imagePath: scene.imagePath ?? word?.img,
    referenceOnly: scene.imagePurpose === "word-reference" || Boolean(!scene.imagePath && word),
    imageSupport: scene.imagePath
      ? "direct-scene-media"
      : word
        ? "runtime-word-reference-fallback"
        : "none",
  };
}

export function finalizeAssets(assets, reviews) {
  const annotations = new Map(reviews.assets.map((r) => [r.key, r]));
  const groups = new Map();
  for (const asset of assets) {
    if (asset.localSha256) {
      const group = groups.get(asset.localSha256) ?? [];
      group.push(asset.key);
      groups.set(asset.localSha256, group);
    }
  }
  return assets
    .sort((a, b) => a.key.localeCompare(b.key, "en"))
    .map((asset) => {
      const annotation = annotations.get(asset.key);
      const parts = asset.key.split("/");
      const filename = parts.at(-1).replace(/\.[^.]+$/, "");
      const inferred = /^[a-f0-9]{40,64}$/.test(filename)
        ? `${parts.at(-2) ?? "unclassified"} / ${assetId(asset.key)}`
        : filename.replaceAll("-", " ");
      const duplicates = asset.localSha256 ? groups.get(asset.localSha256) : [];
      return {
        ...asset,
        assetId: assetId(asset.key),
        kind: mediaKind(asset.key),
        collection: parts.slice(0, -1).join("/"),
        displayName: annotation?.displayName ?? inferred,
        nameStatus: annotation ? "reviewed" : "inferred-from-key",
        review: annotation ?? null,
        tags: annotation?.tags ?? [],
        aliases: annotation?.aliases ?? [],
        duplicateGroup: duplicates?.length > 1 ? `local-sha256:${asset.localSha256}` : null,
        duplicateKeys:
          duplicates?.length > 1 ? duplicates.filter((k) => k !== asset.key).sort() : [],
        duplicateEvidence:
          duplicates?.length > 1
            ? "identical local bytes; remote equality unverified"
            : asset.localSha256
              ? "no identical local copy indexed"
              : "not checked",
        url: `${CDN}/${asset.key.split("/").map(encodeURIComponent).join("/")}`,
      };
    });
}

export function reconcileBindings(registry, reviews) {
  const first = new Map();
  const annotations = new Map(reviews.bindings.map((r) => [r.entryId, r]));
  const bindings = Object.entries(registry).map(([entryId, entry]) => {
    const identity = JSON.stringify([entry.wordId, entry.sentence]);
    const shadowedBy = first.get(identity) ?? null;
    if (!shadowedBy) first.set(identity, entryId);
    const review = annotations.get(entryId);
    if (
      review &&
      (review.expectedImagePath !== entry.imagePath || review.expectedSentence !== entry.sentence)
    )
      throw new Error(`Stale binding review: ${entryId}`);
    return {
      entryId,
      wordId: entry.wordId,
      sentence: entry.sentence,
      imageKey: objectKey(entry.imagePath),
      shadowedBy,
      status: review?.status ?? "semantic-review-required",
      evidence: review?.evidence ?? "",
      storedFallbacks: entry.imageFallbacks?.length ?? 0,
    };
  });
  for (const review of reviews.bindings)
    if (!registry[review.entryId]) throw new Error(`Unknown reviewed binding: ${review.entryId}`);
  return bindings;
}

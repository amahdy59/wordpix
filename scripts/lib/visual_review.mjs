import { z } from "zod";
import { assetId, digest, normalizeText, CDN } from "./media_catalog.mjs";

const text = z.string().trim().min(1);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const review = z.object({ reviewer: text, reviewedAt: z.iso.datetime(), evidence: text }).strict();
const context = z
  .object({
    demandId: text,
    kind: text,
    unitId: text,
    lessonId: text,
    wordId: text,
    text: text,
    expectedResolvedUrl: z.string().nullable(),
    contentSha256: sha256,
  })
  .strict();
const checks = z
  .object({
    subject: z.literal(true),
    action: z.literal(true),
    quantity: z.literal(true),
    context: z.literal(true),
    assessmentSafe: z.literal(true),
    altText: z.literal(true),
  })
  .strict();
export const candidateRejectionsSchema = z
  .object({
    schemaVersion: z.literal(1),
    rejections: z.array(
      z
        .object({
          demandId: text,
          contentSha256: sha256,
          key: text,
          assetSha256: sha256,
          reviewer: text,
          reviewedAt: z.iso.datetime(),
          evidence: text,
        })
        .strict()
    ),
  })
  .strict();
export const visualDecisionsSchema = z
  .object({
    schemaVersion: z.literal(1),
    decisions: z.array(
      z.discriminatedUnion("decision", [
        z
          .object({
            decision: z.literal("content-repair"),
            content: context,
            issues: z.array(text).min(1),
            review,
            resolution: z.object({ replacement: context, review }).strict().optional(),
          })
          .strict(),
        z
          .object({
            decision: z.literal("reuse"),
            content: context,
            assetId: text,
            key: text,
            assetSha256: sha256,
            imageAlt: text,
            checks,
            review,
          })
          .strict(),
        z
          .object({
            decision: z.literal("generate"),
            content: context,
            searchEvidence: text,
            rejectedCandidates: z.array(z.object({ assetId: text, reason: text }).strict()),
            visualBrief: text,
            acceptanceCriteria: z.array(text).min(1),
            imageAlt: text,
            contentReview: review,
            review,
          })
          .strict(),
      ])
    ),
  })
  .strict();

export function contentDigest(demand) {
  return digest(
    JSON.stringify([demand.kind, demand.unitId, demand.lessonId, demand.wordId, demand.text])
  );
}

export function contentSnapshot(demand) {
  return {
    demandId: demand.demandId,
    kind: demand.kind,
    unitId: demand.unitId,
    lessonId: demand.lessonId,
    wordId: demand.wordId,
    text: demand.text,
    expectedResolvedUrl: demand.resolvedUrl ?? null,
    contentSha256: contentDigest(demand),
  };
}

export function prospectiveImageKey(collection, bytes) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(collection) || collection === "library-images")
    throw new Error("A descriptive lowercase-hyphenated collection is required");
  if (!(bytes instanceof Uint8Array) || !bytes.byteLength)
    throw new Error("Nonempty encoded image bytes required");
  if (
    bytes.byteLength < 12 ||
    Buffer.from(bytes.subarray(0, 4)).toString("ascii") !== "RIFF" ||
    Buffer.from(bytes.subarray(8, 12)).toString("ascii") !== "WEBP"
  )
    throw new Error("Encoded WebP bytes required");
  return `question-images/v2/${collection}/${digest(bytes)}.webp`;
}

export function validateVisualDecisions(data, demands, assets) {
  const parsed = visualDecisionsSchema.parse(data);
  const byDemand = new Map(demands.map((d) => [d.demandId, d]));
  const byAsset = new Map(assets.map((a) => [a.assetId, a]));
  const seen = new Set();
  const search = createCandidateSearch(assets);
  for (const decision of parsed.decisions) {
    const id = decision.content.demandId;
    if (seen.has(id)) throw new Error(`Conflicting decisions for ${id}`);
    seen.add(id);
    if (decision.decision === "content-repair" && decision.resolution) {
      const replacement = decision.resolution.replacement;
      const current = byDemand.get(replacement.demandId);
      if (
        byDemand.has(id) ||
        decision.content.contentSha256 !== contentDigest(decision.content) ||
        !current ||
        JSON.stringify(contentSnapshot(current)) !== JSON.stringify(replacement) ||
        ["kind", "unitId", "lessonId", "wordId"].some(
          (key) => replacement[key] !== decision.content[key]
        ) ||
        replacement.text === decision.content.text
      )
        throw new Error(`Stale content repair resolution: ${id}`);
      continue;
    }
    const demand = byDemand.get(id);
    const snapshot = demand ? contentSnapshot(demand) : null;
    const appliedReuse =
      decision.decision === "reuse" && snapshot?.expectedResolvedUrl === `${CDN}/${decision.key}`;
    if (appliedReuse) snapshot.expectedResolvedUrl = decision.content.expectedResolvedUrl;
    if (!demand || JSON.stringify(snapshot) !== JSON.stringify(decision.content))
      throw new Error(`Stale or unknown content decision: ${id}`);
    if (demand.generationHold && decision.decision !== "content-repair")
      throw new Error(`Content is on hold: ${id}`);
    if (decision.decision === "reuse") {
      const asset = byAsset.get(decision.assetId);
      if (
        !asset ||
        asset.kind !== "image" ||
        !asset.remoteListed ||
        asset.key !== decision.key ||
        assetId(asset.key) !== decision.assetId
      )
        throw new Error(`Invalid reuse asset for ${id}`);
      if (
        asset.localSha256 !== decision.assetSha256 &&
        asset.review?.inspectedSha256 !== decision.assetSha256
      )
        throw new Error(`Stale image bytes for ${id}`);
    } else if (decision.decision === "generate") {
      if (demand.resolvedUrl)
        throw new Error(`Assigned content requires a binding review before generation: ${id}`);
      const rejected = new Set(decision.rejectedCandidates.map((c) => c.assetId));
      const discovered = new Set([
        ...(demand.candidateKeys ?? []),
        ...search(demand).map((r) => r.key),
      ]);
      for (const candidate of discovered)
        if (!rejected.has(assetId(candidate)))
          throw new Error(`Unreviewed candidate for ${id}: ${candidate}`);
      for (const candidate of decision.rejectedCandidates)
        if (!byAsset.has(candidate.assetId))
          throw new Error(`Unknown rejected asset: ${candidate.assetId}`);
    }
  }
  return parsed.decisions;
}

export function validateCandidateRejections(data, demands, assets) {
  const parsed = candidateRejectionsSchema.parse(data);
  const byDemand = new Map(demands.map((d) => [d.demandId, d]));
  const byKey = new Map(assets.map((a) => [a.key, a]));
  const seen = new Set();
  for (const r of parsed.rejections) {
    const identity = JSON.stringify([r.demandId, r.key]);
    if (seen.has(identity)) throw new Error(`Duplicate rejection: ${r.demandId}`);
    seen.add(identity);
    const demand = byDemand.get(r.demandId),
      asset = byKey.get(r.key);
    if (
      !demand ||
      !asset ||
      r.contentSha256 !== contentDigest(demand) ||
      r.assetSha256 !== asset.localSha256
    )
      throw new Error(`Stale rejection: ${r.demandId}`);
  }
  return parsed.rejections;
}

const stop = new Set(
  "the a an and or of to in on at for from with as is are was were be been this that these those it its by into after before during while she he they their his her can you your we our according instructions".split(
    " "
  )
);
export const searchTokens = (value) => [
  ...new Set(
    normalizeText(value)
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t) && !/^[a-f0-9]{20,}$/.test(t))
  ),
];

// Search evidence only. Names and historic associations can be wrong; scores
// never turn into approvals. Token lookup cannot assess image contents.
export function createCandidateSearch(assets) {
  const index = new Map();
  const byKey = new Map();
  for (const asset of assets.filter((a) => a.kind === "image" && a.remoteListed)) {
    byKey.set(asset.key, asset);
    for (const token of searchTokens(
      [
        asset.key,
        asset.review?.displayName ?? "",
        ...(asset.review?.tags ?? []),
        ...asset.contexts,
      ].join(" ")
    )) {
      const keys = index.get(token) ?? new Set();
      keys.add(asset.key);
      index.set(token, keys);
    }
  }
  return (demand, limit = 8) => {
    const target = new Set(searchTokens(demand.wordId.replace(/^scene-\d+$/, "")));
    const tokens = searchTokens(`${demand.text} ${demand.wordId}`);
    const scores = new Map();
    for (const token of tokens) {
      const keys = index.get(token);
      if (!keys) continue;
      const weight = Math.log(1 + byKey.size / keys.size) * (target.has(token) ? 2 : 1);
      for (const key of keys) {
        const entry = scores.get(key) ?? { key, score: 0, matchedTokens: [] };
        entry.score += weight;
        entry.matchedTokens.push(token);
        scores.set(key, entry);
      }
    }
    return [...scores.values()]
      .filter((r) => r.key !== demand.imageKey)
      .sort((a, b) => b.score - a.score || a.key.localeCompare(b.key, "en"))
      .slice(0, limit)
      .map((r) => ({
        ...r,
        score: Number(r.score.toFixed(3)),
        assetId: byKey.get(r.key).assetId,
        evidence: "lexical retrieval only; visual review required",
      }));
  };
}

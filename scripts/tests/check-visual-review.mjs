import test from "node:test";
import assert from "node:assert/strict";
import { assetId, digest } from "../lib/media_catalog.mjs";
import {
  contentSnapshot,
  createCandidateSearch,
  prospectiveImageKey,
  validateCandidateRejections,
  validateVisualDecisions,
} from "../lib/visual_review.mjs";

const demand = {
  demandId: "demand-stable",
  kind: "sentence",
  unitId: "camping-site",
  lessonId: "camping-site-1",
  wordId: "sleeping-bag",
  text: "This is a sleeping bag.",
  resolvedUrl: null,
  candidateKeys: [],
};
const key = "images/v1/word-images/camping-site/sleeping-bag.avif";
const asset = {
  assetId: assetId(key),
  key,
  kind: "image",
  remoteListed: true,
  localSha256: "a".repeat(64),
  contexts: [],
  review: null,
};
const review = {
  reviewer: "Reviewer",
  reviewedAt: "2026-10-29T04:00:00.000Z",
  evidence: "Visually inspected image",
};
const reuse = () => ({
  decision: "reuse",
  content: contentSnapshot(demand),
  assetId: asset.assetId,
  key,
  assetSha256: asset.localSha256,
  imageAlt: "A rolled insulated bedding bundle.",
  checks: {
    subject: true,
    action: true,
    quantity: true,
    context: true,
    assessmentSafe: true,
    altText: true,
  },
  review,
});
const run = (decisions, demands = [demand], assets = [asset]) =>
  validateVisualDecisions({ schemaVersion: 1, decisions }, demands, assets);
test("resolved content repair preserves the old review and pins the real replacement", () => {
  const previous = { ...demand, demandId: "demand-old", text: "This is a firewood." };
  const current = { ...demand, demandId: "demand-new", text: "This is firewood." };
  const decision = {
    decision: "content-repair",
    content: contentSnapshot(previous),
    issues: ["Mass noun"],
    review,
    resolution: { replacement: contentSnapshot(current), review },
  };
  assert.equal(run([decision], [current]).length, 1);
  assert.throws(() => run([decision], [previous, current]), /Stale content repair/);
  assert.throws(
    () => run([decision], [{ ...current, text: "Different text." }]),
    /Stale content repair/
  );
  assert.throws(
    () =>
      run(
        [
          {
            ...decision,
            resolution: {
              ...decision.resolution,
              replacement: { ...decision.resolution.replacement, wordId: "different" },
            },
          },
        ],
        [current]
      ),
    /Stale content repair/
  );
});
test("reuse decision binds exact content and asset bytes without mutating sources", () => {
  const before = structuredClone(demand);
  assert.equal(run([reuse()]).length, 1);
  assert.deepEqual(demand, before);
});
test("changed text, lesson identity or existing assignment invalidates approval", () => {
  for (const change of [
    { text: "This is a tent." },
    { lessonId: "camping-site-2" },
    { resolvedUrl: "different.webp" },
  ])
    assert.throws(() => run([reuse()], [{ ...demand, ...change }]), /Stale/);
});
test("wrong asset ID, changed bytes and unlisted objects cannot be reused", () => {
  assert.throws(() => run([{ ...reuse(), assetId: "other" }]), /Invalid reuse/);
  assert.throws(
    () => run([reuse()], [demand], [{ ...asset, localSha256: "b".repeat(64) }]),
    /Stale image/
  );
  assert.throws(
    () => run([reuse()], [demand], [{ ...asset, remoteListed: false }]),
    /Invalid reuse/
  );
});
test("a separately inspected remote digest can differ from a local encoding", () => {
  const remoteSha = "b".repeat(64);
  assert.equal(
    run(
      [{ ...reuse(), assetSha256: remoteSha }],
      [demand],
      [{ ...asset, review: { inspectedSha256: remoteSha } }]
    ).length,
    1
  );
  assert.throws(
    () =>
      run(
        [{ ...reuse(), assetSha256: "c".repeat(64) }],
        [demand],
        [{ ...asset, review: { inspectedSha256: remoteSha } }]
      ),
    /Stale image/
  );
});
test("all visual checks and alt text are required, and holds block approval", () => {
  const d = reuse();
  delete d.checks.quantity;
  assert.throws(() => run([d]));
  assert.throws(() => run([{ ...reuse(), imageAlt: "" }]));
  assert.throws(
    () => run([reuse()], [{ ...demand, generationHold: "Content review pending" }]),
    /on hold/
  );
});
test("conflicting decisions for one content item fail", () =>
  assert.throws(() => run([reuse(), reuse()]), /Conflicting/));
test("generation requires recorded rejection of both exact and search candidates", () => {
  const generate = {
    decision: "generate",
    content: contentSnapshot(demand),
    searchEvidence: "Searched local catalogue and source decks.",
    rejectedCandidates: [],
    visualBrief: "An unrolled insulated bedding item beside a campsite.",
    acceptanceCriteria: ["No written answers"],
    imageAlt: "An insulated bedding item.",
    contentReview: review,
    review,
  };
  assert.throws(() => run([generate]), /Unreviewed candidate/);
  assert.equal(
    run([
      {
        ...generate,
        rejectedCandidates: [{ assetId: asset.assetId, reason: "The candidate is damaged." }],
      },
    ]).length,
    1
  );
  test("the approved reuse remains auditable after applying only its exact URL", () => {
    const applied = {
      ...demand,
      resolvedUrl: `https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/${key}`,
    };
    assert.equal(run([reuse()], [applied]).length, 1);
    assert.throws(() => run([reuse()], [{ ...applied, text: "This is a backpack." }]), /Stale/);
  });
});
test("generation cannot skip content review or apply to an existing assignment", () => {
  const generate = {
    decision: "generate",
    content: contentSnapshot({ ...demand, resolvedUrl: "old.webp" }),
    searchEvidence: "Search",
    rejectedCandidates: [],
    visualBrief: "Brief",
    acceptanceCriteria: ["A criterion"],
    imageAlt: "Alt",
    contentReview: review,
    review,
  };
  assert.throws(() => run([generate], [{ ...demand, resolvedUrl: "old.webp" }]), /binding review/);
  const invalid = { ...generate };
  delete invalid.contentReview;
  assert.throws(() => run([invalid]));
});
test("source content defects create a repair decision without authorizing generation", () => {
  const bad = { ...demand, text: "This is a firewood.", generationHold: "Review needed" };
  const decision = {
    decision: "content-repair",
    content: contentSnapshot(bad),
    issues: ["Use a natural mass-noun phrase."],
    review,
  };
  const result = run([decision], [bad]);
  assert.equal(result[0].decision, "content-repair");
  assert.equal(result[0].decision === "generate", false);
});
test("new object naming hashes final WebP bytes and rejects unsafe collection names", () => {
  const bytes = Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8 ")]);
  assert.equal(
    prospectiveImageKey("camping-equipment", bytes),
    `question-images/v2/camping-equipment/${digest(bytes)}.webp`
  );
  for (const name of ["../other", "CamelCase", "with spaces", "library-images"])
    assert.throws(() => prospectiveImageKey(name, bytes));
  assert.throws(() => prospectiveImageKey("camping", Buffer.from("not a webp")), /WebP/);
  assert.throws(() => prospectiveImageKey("camping", Buffer.alloc(0)), /Nonempty/);
});
test("search uses content metadata and filters unavailable objects without approving matches", () => {
  const search = createCandidateSearch([
    asset,
    { ...asset, key: "x.webp", assetId: "x", remoteListed: false },
  ]);
  const result = search(demand);
  assert.equal(result[0].key, key);
  assert.match(result[0].evidence, /visual review required/);
  assert.equal(
    result.some((r) => r.assetId === "x"),
    false
  );
});
test("rejections pin both image bytes and content and reject duplicate evidence records", () => {
  const r = {
    demandId: demand.demandId,
    contentSha256: contentSnapshot(demand).contentSha256,
    key,
    assetSha256: asset.localSha256,
    ...review,
  };
  const validate = (rejections) =>
    validateCandidateRejections({ schemaVersion: 1, rejections }, [demand], [asset]);
  assert.equal(validate([r]).length, 1);
  assert.throws(() => validate([r, r]), /Duplicate/);
  assert.throws(() => validate([{ ...r, assetSha256: "b".repeat(64) }]), /Stale/);
  assert.throws(() => validate([{ ...r, contentSha256: "b".repeat(64) }]), /Stale/);
});

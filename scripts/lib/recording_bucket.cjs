/** Prove credentials address the app's existing audio bucket before any new upload. */
async function assertRecordingBucket(client) {
  if (client.config.bucket !== "wordpix")
    throw Error("Refusing an audio upload to a different product bucket");
  const key = "audio/95/95c2b56254d1be66abce9849f785c26326e8f3d7ffb2c3ff35975dea196c3cec.mp3";
  const signed = await client.head(key);
  const base = (
    process.env.VITE_ASSET_BASE_URL || "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"
  ).replace(/\/$/, "");
  const publicResponse = await fetch(`${base}/${key}`, {
    method: "HEAD",
    signal: AbortSignal.timeout(30000),
  });
  if (
    !/^[a-f0-9]{32}$/.test(signed?.etag?.replaceAll('"', "") ?? "") ||
    !signed ||
    !publicResponse.ok ||
    Number(signed["content-length"]) <= 512 ||
    signed.etag?.replaceAll('"', "") !== publicResponse.headers.get("etag")?.replaceAll('"', "")
  )
    throw Error(
      "R2 credentials do not match the app's verified audio bucket; no recordings will be uploaded"
    );
}
module.exports = { assertRecordingBucket };

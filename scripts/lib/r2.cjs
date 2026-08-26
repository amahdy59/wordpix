/**
 * Minimal S3 client for Cloudflare R2.
 *
 * R2 speaks the S3 API, so this signs requests with AWS Signature V4. It is
 * hand-rolled rather than pulled from @aws-sdk/client-s3 because the whole
 * surface needed here is single-part PUT, HEAD and GET of objects under 100 KB
 * — no multipart, no streaming, no pagination — and the SDK would add tens of
 * megabytes to every CI install for that.
 *
 * Correctness of a hand-rolled signer is not obvious by inspection, so
 * `verify()` does a real PUT/HEAD/GET/DELETE round trip against the bucket.
 * Run it before trusting a bulk upload.
 */
const crypto = require("crypto");

const SERVICE = "s3";
// R2 has no regions; the S3 API still requires a region in the credential
// scope, and Cloudflare documents "auto".
const REGION = "auto";

const sha256Hex = (data) => crypto.createHash("sha256").update(data).digest("hex");
const hmac = (key, data) => crypto.createHmac("sha256", key).update(data).digest();

/**
 * Percent-encodes a path segment per AWS's rules, which differ from
 * encodeURIComponent: the unreserved set keeps -_.~ and nothing else.
 */
function encodeSegment(segment) {
  return encodeURIComponent(segment).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function encodeKey(key) {
  return key.split("/").map(encodeSegment).join("/");
}

function readConfig(env = process.env) {
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET;
  const missing = Object.entries({
    R2_ACCOUNT_ID: accountId,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_BUCKET: bucket,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(
      "Missing R2 configuration: " +
        missing.join(", ") +
        "\nSet them in .env.local (local runs) or as repository secrets (CI)."
    );
  }
  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
}

/** Builds the Authorization header for one request. */
function sign({ config, method, key, payloadHash, extraHeaders = {}, now }) {
  const url = new URL(`${config.endpoint}/${config.bucket}/${encodeKey(key)}`);
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const headers = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    ...extraHeaders,
  };

  // Canonical headers must be lowercase, trimmed and sorted by name.
  const sortedNames = Object.keys(headers)
    .map((h) => h.toLowerCase())
    .sort();
  const lower = {};
  for (const [k, v] of Object.entries(headers)) lower[k.toLowerCase()] = String(v).trim();
  const canonicalHeaders = sortedNames.map((n) => `${n}:${lower[n]}\n`).join("");
  const signedHeaders = sortedNames.join(";");

  const canonicalRequest = [
    method,
    url.pathname,
    "", // no query string is used by any call here
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  let signingKey = hmac(`AWS4${config.secretAccessKey}`, dateStamp);
  signingKey = hmac(signingKey, REGION);
  signingKey = hmac(signingKey, SERVICE);
  signingKey = hmac(signingKey, "aws4_request");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  return {
    url: url.toString(),
    headers: {
      ...headers,
      Authorization:
        `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${scope}, ` +
        `SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
  };
}

function createClient(env = process.env) {
  const config = readConfig(env);

  async function request(method, key, { body, extraHeaders, expect } = {}) {
    const payload = body ?? Buffer.alloc(0);
    const { url, headers } = sign({
      config,
      method,
      key,
      payloadHash: sha256Hex(payload),
      extraHeaders,
      now: new Date(),
    });

    const res = await fetch(url, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : payload,
    });

    if (expect && !expect.includes(res.status)) {
      const text = res.status === 404 ? "" : await res.text().catch(() => "");
      throw new Error(`R2 ${method} ${key} -> ${res.status} ${res.statusText} ${text.slice(0, 300)}`);
    }
    return res;
  }

  return {
    config,

    /** True when the object already exists, so callers can skip re-uploading. */
    async exists(key) {
      const res = await request("HEAD", key, { expect: [200, 404] });
      return res.status === 200;
    },

    /**
     * Uploads one object. Content-addressed keys never change contents, so
     * they are marked immutable and cached for a year.
     */
    async put(key, body, { contentType, immutable = true } = {}) {
      const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
      await request("PUT", key, {
        body: buffer,
        extraHeaders: {
          "content-type": contentType || "application/octet-stream",
          "content-length": String(buffer.length),
          "cache-control": immutable
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600",
        },
        expect: [200, 201],
      });
      return buffer.length;
    },

    async get(key) {
      const res = await request("GET", key, { expect: [200, 404] });
      if (res.status === 404) return null;
      return Buffer.from(await res.arrayBuffer());
    },

    async remove(key) {
      await request("DELETE", key, { expect: [200, 204, 404] });
    },

    /**
     * Round-trips a throwaway object. Signing bugs surface here rather than
     * halfway through an 11,000-object upload.
     */
    async verify() {
      const key = `_healthcheck/${Date.now()}.txt`;
      const payload = Buffer.from("wordpix r2 verify\n");
      await this.put(key, payload, { contentType: "text/plain", immutable: false });
      const present = await this.exists(key);
      const roundTripped = await this.get(key);
      await this.remove(key);
      const ok = present && roundTripped && roundTripped.equals(payload);
      if (!ok) throw new Error("R2 round trip failed: object did not come back intact");
      return { bucket: config.bucket, endpoint: config.endpoint };
    },
  };
}

module.exports = { createClient, readConfig, encodeKey, sha256Hex };

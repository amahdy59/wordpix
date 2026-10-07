/** Decode local recordings and verify browser playback without changing R2. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("@playwright/test");
const { loadEnv } = require("./lib/env.cjs");

async function main() {
  const { directory, course } = require("./lib/conversationBatch.cjs");
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
  const local = manifest.items.filter((item) =>
    fs.existsSync(path.join(directory, `${item.hash}.mp3`))
  );
  const remote = process.argv.includes("--remote");
  const mediaUrls = new Map();
  if (remote) {
    loadEnv();
    const uploaded = JSON.parse(
      fs.readFileSync(`src/app/learning/${course}/${course}ReadingAudioManifest.json`, "utf8")
    );
    const catalog = require("./lib/specialistAudioCatalog.cjs");
    const base = (process.env.VITE_ASSET_BASE_URL || "").replace(/\/$/, "");
    if (!base) throw new Error("Public R2 asset URL missing");
    for (const item of local) {
      const unitId = catalog.find((unit) => unit.unitNumber === item.unit).id;
      const entry =
        item.track === "full"
          ? uploaded.units[unitId].full
          : uploaded.units[unitId].paragraphs[Number(item.track.split("-")[1]) - 1];
      mediaUrls.set(item.hash, `${base}/${entry.key}`);
    }
  }
  if (local.length !== manifest.items.length && !process.argv.includes("--partial")) {
    throw new Error(`Incomplete batch: ${local.length}/${manifest.items.length} recordings saved`);
  }
  const alignments = new Map();
  for (const item of local) {
    const metadata = JSON.parse(
      fs.readFileSync(path.join(directory, `${item.hash}.alignment.json`), "utf8")
    );
    const alignment = metadata.normalized_alignment || metadata.alignment;
    const starts = alignment?.character_start_times_seconds;
    const ends = alignment?.character_end_times_seconds;
    const characters = alignment?.characters;
    if (
      !Array.isArray(characters) ||
      !characters.length ||
      !Array.isArray(starts) ||
      !Array.isArray(ends) ||
      characters.length !== starts.length ||
      starts.length !== ends.length
    ) {
      throw new Error(`Missing or inconsistent speech alignment: ${item.hash}`);
    }
    for (let index = 0; index < starts.length; index++) {
      if (
        !Number.isFinite(starts[index]) ||
        !Number.isFinite(ends[index]) ||
        starts[index] < 0 ||
        ends[index] < starts[index] ||
        (index > 0 && starts[index] < starts[index - 1])
      ) {
        throw new Error(`Invalid speech timestamp: ${item.hash}, character ${index}`);
      }
    }
    // Segment the provider's aligned transcript, preserving UTF-16 offsets.
    const transcript = characters.join("");
    const offsets = [];
    let offset = 0;
    for (const character of characters) {
      offsets.push(offset);
      offset += character.length;
    }
    const lowerBound = (target) => {
      let left = 0;
      let right = offsets.length;
      while (left < right) {
        const middle = Math.floor((left + right) / 2);
        if (offsets[middle] < target) left = middle + 1;
        else right = middle;
      }
      return left;
    };
    const segments = (granularity) =>
      [...new Intl.Segmenter("en", { granularity }).segment(transcript)]
        .filter((segment) =>
          granularity === "sentence" ? segment.segment.trim() : segment.isWordLike
        )
        .map((segment) => {
          const leading = segment.segment.length - segment.segment.trimStart().length;
          const from = segment.index + leading;
          const to = segment.index + segment.segment.trimEnd().length;
          const first = lowerBound(from);
          const last = lowerBound(to) - 1;
          return {
            text: segment.segment.trim(),
            startSeconds: starts[first],
            endSeconds: ends[last],
          };
        });
    fs.writeFileSync(
      path.join(directory, `${item.hash}.timing.json`),
      JSON.stringify(
        {
          schemaVersion: 1,
          source: "elevenlabs-character-alignment",
          model: manifest.profile.modelId,
          unit: item.unit,
          track: item.track,
          transcript,
          words: segments("word"),
          sentences: segments("sentence"),
        },
        null,
        2
      )
    );
    alignments.set(item.hash, { characters: characters.length, endSeconds: Math.max(...ends) });
  }
  const allowed = new Set(local.map((item) => `/${item.hash}.mp3`));
  const server = http.createServer((request, response) => {
    if (request.url === "/") {
      response.setHeader("content-type", "text/html");
      response.end("<!doctype html><title>Local audio verification</title>");
    } else if (allowed.has(request.url)) {
      response.setHeader("content-type", "audio/mpeg");
      fs.createReadStream(path.join(directory, request.url.slice(1))).pipe(response);
    } else {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const recordings = await page.evaluate(async (items) => {
      const context = new AudioContext();
      const results = [];
      try {
        for (const item of items) {
          const response = await fetch(`/${item.hash}.mp3`);
          const buffer = await context.decodeAudioData(await response.arrayBuffer());
          let peak = 0;
          const samples = buffer.getChannelData(0);
          for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
          if (buffer.duration <= 0 || peak === 0)
            throw new Error(`Empty or silent recording: ${item.hash}`);
          results.push({
            hash: item.hash,
            unit: item.unit,
            track: item.track,
            durationSeconds: buffer.duration,
            sampleRate: buffer.sampleRate,
            channels: buffer.numberOfChannels,
            peak,
          });
        }
        return results;
      } finally {
        await context.close();
      }
    }, local);
    for (const recording of recordings) {
      const alignment = alignments.get(recording.hash);
      if (alignment.endSeconds > recording.durationSeconds + 0.25) {
        throw new Error(`Speech alignment exceeds audio duration: ${recording.hash}`);
      }
      recording.alignedCharacters = alignment.characters;
      recording.speechEndSeconds = alignment.endSeconds;
    }
    const playback = [];
    for (const item of local) {
      const result = await page.evaluate(
        async ({ hash, url, remote }) => {
          const audio = new Audio(url);
          try {
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(
                () =>
                  reject(
                    new Error(
                      `Playback did not advance: ${hash}; readyState=${audio.readyState}, networkState=${audio.networkState}, paused=${audio.paused}, error=${audio.error?.message || "none"}`
                    )
                  ),
                remote ? 30000 : 10000
              );
              const finish = (callback) => {
                clearTimeout(timeout);
                callback();
              };
              audio.addEventListener("timeupdate", () => {
                if (!audio.paused && audio.currentTime > 0.05) finish(resolve);
              });
              audio.addEventListener(
                "error",
                () => finish(() => reject(new Error(`Media error: ${hash}`))),
                { once: true }
              );
              audio.play().catch((error) => finish(() => reject(error)));
            });
            return { hash, currentTime: audio.currentTime, durationSeconds: audio.duration };
          } finally {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
          }
        },
        { hash: item.hash, url: mediaUrls.get(item.hash) || `/${item.hash}.mp3`, remote }
      );
      playback.push({ unit: item.unit, track: item.track, ...result });
    }
    const report = {
      verifiedAt: new Date().toISOString(),
      source: remote ? "public-r2" : "local",
      complete: local.length === manifest.items.length,
      localRecordings: recordings.length,
      pendingRecordings: manifest.items.length - local.length,
      playback,
      recordings,
    };
    const reportPath = path.join(
      directory,
      remote ? `remote-verification-${Date.now()}.json` : "verification.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(
      JSON.stringify({
        source: report.source,
        decoded: recordings.length,
        playbackPassed: playback.length,
        report: reportPath,
      })
    );
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

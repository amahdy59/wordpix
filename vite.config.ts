import { defineConfig, type PluginOption } from "vite";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function scenarioAudioServer(): PluginOption {
  const handler = (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
    const rawUrl = req.url || "";
    const cleanUrl = rawUrl.split("?")[0];
    const prefix1 = "/wordpix/assets/audio/scenarios/";
    const prefix2 = "/assets/audio/scenarios/";
    let subPath: string | null = null;
    if (cleanUrl.startsWith(prefix1)) {
      subPath = cleanUrl.slice(prefix1.length);
    } else if (cleanUrl.startsWith(prefix2)) {
      subPath = cleanUrl.slice(prefix2.length);
    }
    if (!subPath) return next();

    const decoded = decodeURIComponent(subPath);
    const filePath = path.resolve(__dirname, "assets/audio/scenarios", decoded);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return next();
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
      });
      res.end();
      return;
    }

    const stat = fs.statSync(filePath);
    let contentType = "application/octet-stream";
    if (filePath.endsWith(".mp3")) contentType = "audio/mpeg";
    else if (filePath.endsWith(".vtt")) contentType = "text/vtt";
    else if (filePath.endsWith(".srt")) contentType = "text/plain";

    const commonHeaders: Record<string, string | number> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
      "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": contentType,
    };

    if (req.method === "HEAD") {
      res.writeHead(200, {
        ...commonHeaders,
        "Content-Length": stat.size,
      });
      res.end();
      return;
    }

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      res.writeHead(206, {
        ...commonHeaders,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": chunksize,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        ...commonHeaders,
        "Content-Length": stat.size,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  };

  return {
    name: "scenario-audio-server",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

function buildProvenance() {
  return {
    name: "wordpix-build-provenance",
    apply: "build" as const,
    generateBundle(this: { emitFile: (asset: object) => void }) {
      const environmentSha = process.env.WORDPIX_BUILD_SHA || process.env.GITHUB_SHA;
      const gitSha =
        environmentSha || execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
      if (!/^[a-f0-9]{40}$/i.test(gitSha)) {
        throw new Error("Build provenance requires a full 40-character Git commit SHA.");
      }
      this.emitFile({
        type: "asset",
        fileName: "build-info.json",
        source: `${JSON.stringify({ commitSha: gitSha.toLowerCase() }, null, 2)}\n`,
      });
    },
  };
}

export default defineConfig(async () => {
  // Bundle analysis only: activated by `pnpm run analyze` (ANALYZE=1).
  // Loaded dynamically so normal builds never require the optional
  // rollup-plugin-visualizer dependency. Normal builds are unaffected.
  const extraPlugins: PluginOption[] = [];
  if (process.env.ANALYZE) {
    try {
      const { visualizer } = await import("rollup-plugin-visualizer");
      extraPlugins.push(visualizer({ filename: "dist/bundle-stats.html", gzipSize: true }));
    } catch {
      console.warn(
        "[vite] ANALYZE=1 requested but rollup-plugin-visualizer is not installed; skipping bundle report."
      );
    }
  }
  return {
    base: "/wordpix/",
    plugins: [
      buildProvenance(),
      figmaAssetResolver(),
      scenarioAudioServer(),
      react(),
      tailwindcss(),
      ...extraPlugins,
    ],
    // Must stay in step with the "paths" block in tsconfig.json. Three of the
    // previous six aliases (@shared, @types, @constants) pointed at directories
    // that do not exist — the real locations are src/app/shared, src/app/types.ts,
    // and src/app/constants.ts — so any import using them would have failed.
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@shared": path.resolve(__dirname, "./src/app/shared"),
        "@i18n": path.resolve(__dirname, "./src/i18n"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
    build: {
      // Opt-in for release sessions that must preserve every existing local file.
      emptyOutDir: process.env.WORDPIX_PRESERVE_BUILD_FILES !== "1",
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(rawId) {
            const id = rawId.replace(/\\/g, "/");
            if (id.includes("node_modules")) {
              if (
                id.includes("/react/") ||
                id.includes("/react-dom/") ||
                id.includes("/scheduler/")
              ) {
                return "vendor-react";
              }
              if (id.includes("/framer-motion/")) {
                return "vendor-motion";
              }
              if (id.includes("/lucide-react/")) {
                return "vendor-icons";
              }
              if (id.includes("/@tanstack/")) {
                return "vendor-query";
              }
              if (id.includes("/@supabase/") || id.includes("/idb/")) {
                return "vendor-storage";
              }
              if (id.includes("/i18next")) {
                return "vendor-i18n";
              }
              return "vendor-deps";
            }
            if (id.includes("src/app/data/lexiconDictionary")) {
              return "lexicon-dictionary";
            }
            if (id.includes("src/app/data/courseCatalog")) {
              return "course-lessons";
            }
            if (id.includes("conversationCatalog.units-01-20.json")) {
              return "conversation-units-01-20";
            }
            if (id.includes("conversationCatalog.units-21-40.json")) {
              return "conversation-units-21-40";
            }
            if (id.includes("businessCatalog.units-01-20.json")) {
              return "business-units-01-20";
            }
            if (id.includes("businessCatalog.units-21-40.json")) {
              return "business-units-21-40";
            }
            if (id.includes("src/generated/figmaImageReplacements")) {
              return "asset-manifest";
            }
            if (id.includes("curriculumAudioManifest")) {
              return "curriculum-audio-manifest";
            }
            if (id.includes("curriculumScenarios.units-001-050")) {
              return "curriculum-scenarios-001-050";
            }
            if (id.includes("curriculumScenarios.units-051-100")) {
              return "curriculum-scenarios-051-100";
            }
            if (id.includes("curriculumScenarios.units-101-150")) {
              return "curriculum-scenarios-101-150";
            }
            if (id.includes("curriculumScenarios.units-151-200")) {
              return "curriculum-scenarios-151-200";
            }
            if (id.includes("src/i18n/")) {
              // en.json ships synchronously (default + fallback locale); ar.json
              // arrives via dynamic import() on language switch and must not be
              // folded back into the initial chunk.
              if (id.endsWith("/ar.json")) return "i18n-locale-ar";
              return "i18n-locales";
            }
          },
        },
      },
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});

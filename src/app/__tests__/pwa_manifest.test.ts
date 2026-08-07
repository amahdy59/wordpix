import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(__dirname, "../../..");
const publicDir = resolve(projectRoot, "public");
const readPublic = (file: string) => readFileSync(resolve(publicDir, file), "utf8");

describe("PWA manifest", () => {
  const manifest = JSON.parse(readPublic("manifest.json"));

  it("exists (its absence broke service worker install entirely)", () => {
    expect(existsSync(resolve(publicDir, "manifest.json"))).toBe(true);
  });

  it("declares the fields required for installability", () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it("ships both an any-purpose and a maskable icon, and both files exist", () => {
    const purposes = manifest.icons.map((i: { purpose: string }) => i.purpose);
    expect(purposes).toContain("any");
    expect(purposes).toContain("maskable");

    manifest.icons.forEach((icon: { src: string }) => {
      expect(existsSync(resolve(publicDir, icon.src))).toBe(true);
    });
  });

  it("uses relative paths so it works under the /wordpix/ GitHub Pages base", () => {
    expect(manifest.start_url.startsWith("./")).toBe(true);
    manifest.icons.forEach((icon: { src: string }) => {
      expect(icon.src.startsWith("./")).toBe(true);
    });
  });

  it("is linked from index.html alongside an icon and theme-color", () => {
    const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");
    expect(html).toContain('rel="manifest"');
    expect(html).toContain("manifest.json");
    expect(html).toContain('rel="icon"');
    expect(html).toContain('name="theme-color"');
  });
});

describe("Service worker", () => {
  const sw = readPublic("sw.js");
  // Comments in this file discuss addAll by name; assert against code only.
  const swCode = sw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

  // The original worker precached ["./", "./index.html", "./manifest.json"] with
  // cache.addAll(). manifest.json did not exist; addAll is atomic, so install
  // rejected, the worker never activated, and offline support silently did not
  // exist. Precaching must not be all-or-nothing.
  it("does not use atomic addAll for the app shell", () => {
    expect(swCode).not.toMatch(/\.addAll\s*\(/);
  });

  it("tolerates an individual precache failure", () => {
    expect(swCode).toContain("allSettled");
    expect(swCode).toMatch(/cache\.add\(/);
  });

  it("only precaches files that actually exist", () => {
    const shellMatch = swCode.match(/const APP_SHELL = \[([\s\S]*?)\];/);
    expect(shellMatch).not.toBeNull();

    const entries = (shellMatch as RegExpMatchArray)[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);

    entries
      .filter((entry) => entry !== "./")
      .forEach((entry) => {
        expect(existsSync(resolve(publicDir, entry)) || existsSync(resolve(projectRoot, entry))).toBe(true);
      });
  });

  it("caches opaque cross-origin responses so vocabulary imagery works offline", () => {
    expect(swCode).toContain('response.type === "opaque"');
  });

  it("falls back to the cached shell for SPA navigations", () => {
    expect(swCode).toContain('request.mode === "navigate"');
  });
});

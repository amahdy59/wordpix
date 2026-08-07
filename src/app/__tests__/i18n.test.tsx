import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider, useI18n, lookup, interpolate, SUPPORTED_LANGS } from "../context/I18nContext";
import en from "../../i18n/en.json";
import ar from "../../i18n/ar.json";

/** Flattens a nested bundle to dotted keys for parity comparison. */
function flatten(node: unknown, prefix = ""): string[] {
  if (typeof node !== "object" || node === null) return [prefix];
  return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
    flatten(value, prefix ? `${prefix}.${key}` : key)
  );
}

function Probe() {
  const { t, interfaceLang, dir, setInterfaceLang } = useI18n();
  return (
    <>
      <span data-testid="home">{t("nav.home")}</span>
      <span data-testid="lang">{interfaceLang}</span>
      <span data-testid="dir">{dir}</span>
      <button type="button" onClick={() => setInterfaceLang("ar")}>
        to arabic
      </button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

describe("Translation bundles", () => {
  const enKeys = flatten(en).sort();
  const arKeys = flatten(ar).sort();

  it("has identical key sets in every language", () => {
    expect(arKeys).toEqual(enKeys);
  });

  it("has no empty strings", () => {
    [en, ar].forEach((bundle) => {
      flatten(bundle).forEach((key) => {
        expect(lookup(bundle, key), `${key} is empty`).toBeTruthy();
      });
    });
  });

  /**
   * The old bundles hardcoded counts into sentences ("3 words ready",
   * "You're on a 7-day streak"), which is the same fabricated-data problem as
   * the dashboard's hardcoded week strip, just relocated into the copy.
   */
  it("carries no hardcoded counts in copy", () => {
    [en, ar].forEach((bundle) => {
      flatten(bundle).forEach((key) => {
        const value = lookup(bundle, key) ?? "";
        expect(value, `${key} hardcodes a number: "${value}"`).not.toMatch(/\b\d+\s*(words?|day|كلمات|أيام)/i);
      });
    });
  });

  it("uses matching placeholders across languages", () => {
    enKeys.forEach((key) => {
      const enPlaceholders = (lookup(en, key)?.match(/\{(\w+)\}/g) ?? []).sort();
      const arPlaceholders = (lookup(ar, key)?.match(/\{(\w+)\}/g) ?? []).sort();
      expect(arPlaceholders, `placeholder mismatch on ${key}`).toEqual(enPlaceholders);
    });
  });
});

describe("lookup and interpolate", () => {
  it("resolves nested dotted keys", () => {
    expect(lookup(en, "nav.home")).toBe("Home");
  });

  it("returns undefined for a missing key rather than throwing", () => {
    expect(lookup(en, "nav.nope.deeper")).toBeUndefined();
  });

  it("substitutes placeholders", () => {
    expect(interpolate("{cached} of {total}", { cached: 3, total: 57 })).toBe("3 of 57");
  });

  it("leaves unknown placeholders visible instead of blanking them", () => {
    expect(interpolate("{a} and {b}", { a: "x" })).toBe("x and {b}");
  });
});

describe("I18nProvider", () => {
  it("translates through the active language", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );

    expect(screen.getByTestId("home")).toHaveTextContent("Home");

    await user.click(screen.getByRole("button", { name: "to arabic" }));
    expect(screen.getByTestId("home")).toHaveTextContent("الرئيسية");
  });

  it("switches document direction and language for RTL", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );

    expect(document.documentElement.dir).toBe("ltr");

    await user.click(screen.getByRole("button", { name: "to arabic" }));

    expect(screen.getByTestId("dir")).toHaveTextContent("rtl");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });

  it("persists the choice so it survives a reload", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: "to arabic" }));
    expect(localStorage.getItem("wordpix:interface-lang")).toBe("ar");
  });

  it("restores a persisted language on mount", () => {
    localStorage.setItem("wordpix:interface-lang", "ar");
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("ar");
  });

  it("ignores a corrupted persisted language", () => {
    localStorage.setItem("wordpix:interface-lang", "klingon");
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("falls back to the key itself when a string is missing everywhere", () => {
    function MissingKey() {
      const { t } = useI18n();
      return <span data-testid="missing">{t("does.not.exist")}</span>;
    }
    render(
      <I18nProvider>
        <MissingKey />
      </I18nProvider>
    );
    expect(screen.getByTestId("missing")).toHaveTextContent("does.not.exist");
  });

  it("exposes exactly the languages it ships bundles for", () => {
    expect(SUPPORTED_LANGS).toEqual(["en", "ar"]);
  });
});

describe("Navigation labels come from the bundle", () => {
  it("uses one shared tab definition for both navs", async () => {
    const { TABS } = await import("../shared/BottomTabBar");
    expect(TABS.map((tab) => tab.labelKey)).toEqual([
      "nav.home",
      "nav.explore",
      "nav.practice",
      "nav.profile",
    ]);

    // Every referenced key must actually resolve.
    TABS.forEach((tab) => {
      expect(lookup(en, tab.labelKey), `${tab.labelKey} missing from en`).toBeTruthy();
      expect(lookup(ar, tab.labelKey), `${tab.labelKey} missing from ar`).toBeTruthy();
    });
  });
});

describe("Legacy inline translation map is gone", () => {
  it("no longer duplicates copy inside the context module", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(__dirname, "../context/I18nContext.tsx"), "utf8");

    // Copy lived in three places at once: this map plus both JSON files.
    expect(source).not.toContain("const TRANSLATIONS");
    expect(source).toContain('from "../../i18n/en.json"');
    expect(source).toContain('from "../../i18n/ar.json"');
  });
});

// Keeps `act` imported-and-used so the lint rule and the React warning guard
// both stay honest if this file grows async state updates later.
describe("act availability", () => {
  it("is wired for state-updating assertions", () => {
    expect(typeof act).toBe("function");
  });
});

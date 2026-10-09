import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ReleaseNotesPage } from "../core/ReleaseNotesPage";
import { ReleaseNotesCard } from "../core/ReleaseNotesCard";
import { I18nProvider } from "../context/I18nContext";
import releaseNotes from "../data/releaseNotes.json";
import en from "../../i18n/en.json";
import ar from "../../i18n/ar.json";

beforeEach(() => localStorage.clear());

describe("Permanent bilingual release history", () => {
  it("publishes the same update summary and history used by the page", () => {
    const published = JSON.parse(readFileSync(resolve("public/release-notes.json"), "utf8"));
    expect(published).toEqual(releaseNotes);
    expect(published.releases[0].version).toBe(published.version);
    expect(new Set(published.releases.map((release: { id: string }) => release.id)).size).toBe(
      published.releases.length
    );
    for (const release of published.releases) {
      expect(release.title.en.trim()).not.toBe("");
      expect(release.title.ar.trim()).not.toBe("");
      for (const change of release.changes) {
        expect(change.en.trim()).not.toBe("");
        expect(change.ar.trim()).not.toBe("");
        expect(["added", "improved", "fixed"]).toContain(change.category);
      }
    }
  });

  it.each(["en", "ar"] as const)(
    "renders every release in %s and returns to Profile",
    async (lang) => {
      localStorage.setItem("wordpix:interface-lang", lang);
      const dispatch = vi.fn();
      render(
        <I18nProvider>
          <ReleaseNotesPage dispatch={dispatch} />
        </I18nProvider>
      );
      const locale = lang === "ar" ? ar : en;
      expect(
        await screen.findByRole("heading", { name: locale.releaseNotes.pageTitle })
      ).toBeVisible();
      for (const release of releaseNotes.releases) {
        expect(screen.getByRole("heading", { name: release.title[lang] })).toBeVisible();
      }
      fireEvent.click(screen.getByRole("button", { name: locale.releaseNotes.backToProfile }));
      expect(dispatch).toHaveBeenCalledWith({ type: "GO", to: "profile" });
      expect(document.documentElement.dir).toBe(lang === "ar" ? "rtl" : "ltr");
    }
  );

  it("keeps all history available after dismissing the latest notification", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => releaseNotes,
    } as Response);
    try {
      render(
        <I18nProvider>
          <ReleaseNotesCard />
          <ReleaseNotesPage dispatch={vi.fn()} />
        </I18nProvider>
      );
      const link = await screen.findByRole("link", { name: en.releaseNotes.viewAll });
      expect(link).toHaveAttribute("href", "#/release-notes");
      fireEvent.click(screen.getByRole("button", { name: en.releaseNotes.dismiss }));
      expect(localStorage.getItem("wordpix_last_seen_version")).toBe(releaseNotes.version);
      expect(screen.queryByRole("link", { name: en.releaseNotes.viewAll })).not.toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: releaseNotes.releases[0].title.en })
      ).toBeVisible();
    } finally {
      fetchMock.mockRestore();
    }
  });
});

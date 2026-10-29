import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { saveImageReport, loadImageReports, clearImageReports } from "../media/imageReports";
import { ImageReportButton } from "../shared/ImageReportButton";
import { I18nProvider } from "../context/I18nContext";

const context = {
  kind: "sentence" as const,
  unitId: "bedroom",
  wordId: "pillow",
  text: "A folded cover rests on a bed.",
};
beforeEach(async () => {
  await clearImageReports();
});
afterEach(() => vi.restoreAllMocks());
describe("private image reports", () => {
  it("keeps report-form keys away from background lesson shortcuts", async () => {
    const user = userEvent.setup(),
      shortcut = vi.fn();
    render(
      <I18nProvider>
        <ImageReportButton imagePath="/one.webp" context={context} />
      </I18nProvider>
    );
    await user.click(screen.getByRole("button", { name: "Report image" }));
    window.addEventListener("keydown", shortcut);
    try {
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "1", bubbles: true });
      expect(shortcut).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("keydown", shortcut);
    }
  });
  it("deduplicates stable content and URL identities, retaining occurrence counts", async () => {
    const first = await saveImageReport({
      context,
      imagePath: "/cover.webp?retry=1",
      reason: "mismatch",
    });
    const second = await saveImageReport({ context, imagePath: "/cover.webp", reason: "mismatch" });
    expect(first.id).toBe(second.id);
    expect(second.occurrences).toBe(2);
    expect(first.assetUrl).not.toContain("retry=");
    expect(Object.keys(first)).not.toEqual(expect.arrayContaining(["userId", "email"]));
    await saveImageReport({
      context: { ...context, text: "Another sentence." },
      imagePath: "/cover.webp",
      reason: "mismatch",
    });
    expect(await loadImageReports()).toHaveLength(2);
  });
  it("rejects unexpected personal data and unmanaged image URLs", async () => {
    await expect(
      saveImageReport({
        context: { ...context, email: "someone@example.test" } as typeof context,
        imagePath: "/one.webp",
        reason: "unclear",
      })
    ).rejects.toThrow();
    await expect(
      saveImageReport({
        context,
        imagePath: "https://unmanaged.example/image.webp",
        reason: "unclear",
      })
    ).rejects.toThrow();
    expect(await loadImageReports()).toEqual([]);
  });
  it("saves through an accessible dialog and restores focus without sending a report", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <ImageReportButton imagePath="/one.webp" context={context} />
      </I18nProvider>
    );
    const trigger = screen.getByRole("button", { name: "Report image" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Report image");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "What needs attention?" }),
      "cropped"
    );
    await user.click(screen.getByRole("button", { name: "Save report" }));
    expect(await screen.findByText(/Report saved on this device/)).toBeVisible();
    await user.click(screen.getAllByRole("button", { name: "Close" }).at(-1)!);
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(await loadImageReports()).toMatchObject([{ reason: "cropped" }]);
    expect(fetch).not.toHaveBeenCalled();
  });
});

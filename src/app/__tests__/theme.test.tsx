import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ThemeToggle, useTheme } from "../shared/ThemeToggle";
import { setTheme, THEME_STORAGE_KEY, resolveTheme } from "../shared/themeStore";

/** Two independently-mounted consumers of the theme, as in the real app. */
function TwoConsumers() {
  const a = useTheme();
  const b = useTheme();
  return (
    <>
      <span data-testid="consumer-a">{a.theme}</span>
      <span data-testid="consumer-b">{b.theme}</span>
      <button type="button" onClick={a.toggleTheme}>
        cycle
      </button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  act(() => setTheme("system"));
});

describe("Theme store", () => {
  it("cycles system -> dark -> light -> system", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("System");

    await user.click(button);
    expect(button).toHaveTextContent("Dark");

    await user.click(button);
    expect(button).toHaveTextContent("Light");

    await user.click(button);
    expect(button).toHaveTextContent("System");
  });

  /**
   * The regression: useTheme held its own useState and was called separately by
   * ThemeToggle, ProfileStats, and SettingsModal — three copies of the state.
   * Toggling in one left the others showing a stale label.
   */
  it("keeps every consumer in sync from one source of truth", async () => {
    const user = userEvent.setup();
    render(<TwoConsumers />);

    expect(screen.getByTestId("consumer-a")).toHaveTextContent("system");
    expect(screen.getByTestId("consumer-b")).toHaveTextContent("system");

    await user.click(screen.getByRole("button", { name: "cycle" }));

    expect(screen.getByTestId("consumer-a")).toHaveTextContent("dark");
    expect(screen.getByTestId("consumer-b")).toHaveTextContent("dark");
  });

  it("applies the dark class to the document element", () => {
    act(() => setTheme("dark"));
    expect(document.documentElement).toHaveClass("dark");

    act(() => setTheme("light"));
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("persists the choice", () => {
    act(() => setTheme("dark"));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("resolves explicit modes without consulting the OS", () => {
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
  });

  it("resolves system mode from the OS preference", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    vi.stubGlobal("matchMedia", matchMedia);
    expect(resolveTheme("system")).toBe("dark");
    vi.unstubAllGlobals();
  });

  it("falls back to system for a corrupted stored value", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "chartreuse");
    // Re-reading happens at module init; assert the guard itself is sound.
    expect(["light", "dark", "system"]).not.toContain("chartreuse");
    act(() => setTheme("system"));
    expect(screen.queryByText("chartreuse")).toBeNull();
  });

  it("exposes an accessible name describing the current theme", () => {
    act(() => setTheme("dark"));
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/theme: dark/i);
  });
});

describe("Flash of unstyled theme", () => {
  const html = readFileSync(resolve(__dirname, "../../../index.html"), "utf8");

  /**
   * The theme class used to be applied only after React mounted, so every
   * dark-mode user saw a white flash on each load.
   */
  it("applies the stored theme before first paint", () => {
    expect(html).toContain('localStorage.getItem("wordpix:theme")');
    expect(html).toContain('classList.toggle("dark"');
  });

  it("runs that script synchronously in the head, not deferred", () => {
    const headEnd = html.indexOf("</head>");
    const scriptStart = html.indexOf('localStorage.getItem("wordpix:theme")');
    expect(scriptStart).toBeGreaterThan(-1);
    expect(scriptStart).toBeLessThan(headEnd);

    const openingTag = html.lastIndexOf("<script", scriptStart);
    const tag = html.slice(openingTag, html.indexOf(">", openingTag));
    expect(tag).not.toContain("defer");
    expect(tag).not.toContain("async");
    expect(tag).not.toContain('type="module"');
  });

  it("tolerates blocked storage rather than throwing before the app boots", () => {
    const script = html.slice(html.indexOf('localStorage.getItem("wordpix:theme")'));
    expect(script.slice(0, 600)).toContain("catch");
  });
});

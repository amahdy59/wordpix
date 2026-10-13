import { afterEach, describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "../../pwa";

const originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, "serviceWorker");

function mockServiceWorker() {
  const registration = { addEventListener: vi.fn(), installing: null };
  const register = vi.fn().mockResolvedValue(registration);
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { register },
  });
  return register;
}

afterEach(() => {
  vi.restoreAllMocks();
  if (originalServiceWorker) {
    Object.defineProperty(navigator, "serviceWorker", originalServiceWorker);
  } else {
    Reflect.deleteProperty(navigator, "serviceWorker");
  }
});

describe("service worker registration", () => {
  it("offers an installed update when optional release metadata is unavailable", async () => {
    const worker = { state: "installed", addEventListener: vi.fn() };
    const registration = { installing: worker, addEventListener: vi.fn() };
    const register = vi.fn().mockResolvedValue(registration);
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register, controller: {} },
    });
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Load failed"));
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const offered = vi.fn();
    window.addEventListener("wp-update-available", offered, { once: true });

    registerServiceWorker();
    await new Promise((resolve) => setTimeout(resolve, 0));
    registration.addEventListener.mock.calls[0][1]();
    await worker.addEventListener.mock.calls[0][1]();

    expect(offered).toHaveBeenCalledOnce();
    expect(offered.mock.calls[0][0].detail).toEqual({ worker, notes: [] });
    expect(error).not.toHaveBeenCalled();
  });
  it("keeps the app usable when worker registration is disabled", async () => {
    const register = mockServiceWorker();
    register.mockResolvedValue(undefined);
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    registerServiceWorker();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(register).toHaveBeenCalledOnce();
    expect(error).not.toHaveBeenCalled();
  });
  it("registers immediately when React mounts after window load", () => {
    const register = mockServiceWorker();
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");

    registerServiceWorker();

    expect(register).toHaveBeenCalledOnce();
    expect(register).toHaveBeenCalledWith("./sw.js");
  });

  it("waits for load when the document is not complete and registers once", () => {
    const register = mockServiceWorker();
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");

    registerServiceWorker();
    expect(register).not.toHaveBeenCalled();

    window.dispatchEvent(new Event("load"));
    window.dispatchEvent(new Event("load"));

    expect(register).toHaveBeenCalledOnce();
  });
});

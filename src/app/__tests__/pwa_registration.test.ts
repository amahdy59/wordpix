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

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "../context/I18nContext";
import { NetworkStatusBanner } from "../shared/NetworkStatusBanner";
import { getDB, SYNC_QUEUE_CHANGED_EVENT } from "../../lib/persistence/db";

const retrySync = vi.hoisted(() => vi.fn());
vi.mock("../../lib/persistence/sync", () => ({ retryFailedSyncOperations: retrySync }));

const originalOnline = Object.getOwnPropertyDescriptor(window.navigator, "onLine");

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", { configurable: true, value });
}

afterEach(async () => {
  retrySync.mockReset();
  const db = await getDB();
  await db?.clear("mutation_queue");
  if (originalOnline) Object.defineProperty(window.navigator, "onLine", originalOnline);
  else Reflect.deleteProperty(window.navigator, "onLine");
  localStorage.removeItem("wordpix:interface-lang");
});

describe("NetworkStatusBanner", () => {
  it("announces that offline progress remains safe on the device", () => {
    setOnline(false);
    render(
      <I18nProvider>
        <NetworkStatusBanner />
      </I18nProvider>
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("data-network-state", "offline");
    expect(status).toHaveTextContent("You're offline");
    expect(status).toHaveTextContent("Your progress is saved on this device");
  });

  it("announces reconnection after an offline session", () => {
    setOnline(false);
    render(
      <I18nProvider>
        <NetworkStatusBanner />
      </I18nProvider>
    );

    act(() => {
      setOnline(true);
      window.dispatchEvent(new Event("online"));
    });

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("data-network-state", "restored");
    expect(status).toHaveTextContent("Back online");
    expect(status).toHaveTextContent("sync any pending progress");
  });

  it("offers an accessible retry for authorization failures", async () => {
    setOnline(true);
    const db = (await getDB())!;
    await db.put("mutation_queue", {
      id: "authorization-failure",
      ownerId: "alice",
      payloadVersion: 1,
      type: "add_xp",
      payload: { xp: 25 },
      createdAt: "2026-09-27T00:00:00.000Z",
      status: "failed",
      retryCount: 1,
      lastErrorCategory: "authorization",
    });
    retrySync.mockResolvedValue({ pending: 0, failed: 0, retryableFailed: 0 });
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <NetworkStatusBanner />
      </I18nProvider>
    );
    act(() => window.dispatchEvent(new Event(SYNC_QUEUE_CHANGED_EVENT)));

    const status = await screen.findByRole("status");
    expect(status).toHaveAttribute("data-network-state", "sync-failed");
    expect(status).toHaveTextContent("Your progress is still safe on this device");
    await user.click(screen.getByRole("button", { name: "Retry sync" }));

    expect(retrySync).toHaveBeenCalledOnce();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

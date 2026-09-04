import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "../../features/auth/AuthModal";
import { supabase } from "../../lib/supabase/client";
import { migrateGuestToAccount } from "../../lib/persistence/sync";

vi.mock("../../lib/supabase/client", () => ({
  supabase: { auth: { signInWithPassword: vi.fn(), signUp: vi.fn() } },
}));
vi.mock("../../lib/persistence/sync", () => ({ migrateGuestToAccount: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

async function fillCredentials() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email address"), "learner@example.com");
  await user.type(screen.getByLabelText("Password"), "test-password");
  return user;
}

describe("email authentication", () => {
  it("submits credentials and waits for guest migration before reloading", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: "existing-user" }, session: { access_token: "test-token" } },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);
    let completeMigration!: () => void;
    vi.mocked(migrateGuestToAccount).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          completeMigration = resolve;
        })
    );
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    const close = vi.fn();
    render(<AuthModal onClose={close} />);
    const user = await fillCredentials();
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "learner@example.com",
      password: "test-password",
    });
    expect(migrateGuestToAccount).toHaveBeenCalledWith("existing-user");
    expect(reload).not.toHaveBeenCalled();
    completeMigration();
    await screen.findByRole("alert");
    expect(close).toHaveBeenCalled();
    expect(reload).toHaveBeenCalledOnce();
    reload.mockRestore();
  });

  it("keeps a failed migration open and retries sync without another login", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: "existing-user" }, session: { access_token: "test-token" } },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);
    vi.mocked(migrateGuestToAccount).mockRejectedValueOnce(new Error("Sync pending"));
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    const close = vi.fn();
    render(<AuthModal onClose={close} />);
    const user = await fillCredentials();
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Sync pending");
    expect(reload).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    vi.mocked(migrateGuestToAccount).mockResolvedValueOnce();
    await user.click(screen.getByRole("button", { name: "Retry sync" }));
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledOnce();
    expect(reload).toHaveBeenCalledOnce();
    reload.mockRestore();
  });

  it("preserves input and guest data after a rejected login", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue(new Error("Invalid credentials"));
    const close = vi.fn();
    render(<AuthModal onClose={close} />);
    const user = await fillCredentials();
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
    expect(screen.getByLabelText("Email address")).toHaveValue("learner@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("test-password");
    expect(migrateGuestToAccount).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });

  it("waits for email confirmation without migrating an unauthenticated signup", async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: "new-user" }, session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signUp>>);
    const close = vi.fn();
    render(<AuthModal onClose={close} />);
    const user = await fillCredentials();
    await user.click(screen.getByRole("button", { name: /Don't have an account/ }));
    await user.click(screen.getByRole("button", { name: "Create Account" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Check your email");
    expect(migrateGuestToAccount).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });
});

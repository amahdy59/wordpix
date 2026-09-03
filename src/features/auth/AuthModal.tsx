import React, { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { migrateGuestToAccount } from "../../lib/persistence/sync";
import { User, X } from "lucide-react";
import { useModalA11y } from "../../app/shared/useModalA11y";

interface AuthModalProps {
  onClose: () => void;
}

type AuthState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

type AuthMode = "login" | "signup";

export function AuthModal({ onClose }: AuthModalProps) {
  const containerRef = useModalA11y({ isOpen: true, onDismiss: onClose });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [state, setState] = useState<AuthState>({ status: "idle" });

  const isLogin = mode === "login";
  const isLoading = state.status === "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setState({ status: "submitting" });

    try {
      let authUserId: string | undefined;

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        authUserId = data.user?.id;
        setState({ status: "success", message: "Signed in successfully!" });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setState({
            status: "success",
            message:
              "Check your email to confirm your account, then sign in. Your progress remains on this device.",
          });
          return;
        }
        authUserId = data.user?.id;
        setState({ status: "success", message: "Account created successfully!" });
      }

      // Guest to Account Migration
      if (authUserId) {
        try {
          await migrateGuestToAccount(authUserId);
        } catch (e) {
          console.error("Failed to migrate guest data", e);
        }
      }

      // For MVP, reload to re-initialize contexts and pull fresh data if needed,
      // or at least to reflect the logged in state cleanly without complex re-renders.
      window.location.reload();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setState({ status: "error", message: err.message });
      } else {
        setState({ status: "error", message: "An unknown error occurred." });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={containerRef}
        className="bg-background rounded-2xl p-6 w-full max-w-md shadow-xl border border-border relative max-h-[92dvh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 end-4 size-10 min-h-[44px] min-w-[44px] rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
        >
          <X className="size-5" aria-hidden />
        </button>
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-primary/10 text-primary rounded-full mb-2">
            <User className="size-8" />
          </div>
          <h2 id="auth-title" className="text-xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            {isLogin
              ? "Sign in to sync your progress across devices."
              : "Sign up to save your offline progress permanently."}
          </p>
        </div>

        {state.status === "error" && (
          <div
            className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg"
            role="alert"
          >
            {state.message}
          </div>
        )}
        {state.status === "success" && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-600 text-sm rounded-lg" role="alert">
            {state.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="text-sm text-primary font-medium hover:underline min-h-[44px]"
            onClick={() => {
              setMode(isLogin ? "signup" : "login");
              setState({ status: "idle" });
            }}
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>

          <button
            type="button"
            className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors min-h-[44px]"
            onClick={onClose}
            disabled={isLoading}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

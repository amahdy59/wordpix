import React, { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { migrateGuestToAccount } from "../../lib/persistence/sync";
import { User } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let authUserId: string | undefined;

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        authUserId = data.user?.id;
        setSuccess("Signed in successfully!");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        authUserId = data.user?.id;
        setSuccess("Account created successfully!");
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
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-xl border border-border" role="dialog" aria-modal="true" aria-labelledby="auth-title">
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

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-600 text-sm rounded-lg" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="text-sm text-primary font-medium hover:underline"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          
          <button
            type="button"
            className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

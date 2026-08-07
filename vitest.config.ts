import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  // Kept identical to vite.config.ts and tsconfig.json; a test-only alias set
  // that drifts is how "works in tests, fails in build" happens.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/app/shared"),
      "@i18n": path.resolve(__dirname, "./src/i18n"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});

import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 180000,
    hookTimeout: 180000,
    teardownTimeout: 180000,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    exclude: [...configDefaults.exclude, "tests/**", "e2e/**", "scratch/**"],
  },
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

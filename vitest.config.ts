import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Route-level acceptance tests render whole pages and drive them with real
    // user events. Under parallel workers those runs occasionally exceed the
    // 5s default on slower machines, which reports a scheduling delay as a
    // product failure. The budget is raised so a red test means a real defect.
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});

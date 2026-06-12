import swc from "unplugin-swc";
import {defineConfig} from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    swc
  ],
  test: {
    mockReset: true,
    globals: true,
    environment: "node",
    include: ["**/*.spec.ts", "**/*.test.ts"],
    setupFiles: ["./test/vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    },
  },
});
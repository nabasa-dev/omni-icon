import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  test: {
    include: ["test/**/*.test.ts"],
  },
  pack: {
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    format: ["esm"],
    sourcemap: true,
  },
});

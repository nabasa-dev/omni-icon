import type { Plugin, UserConfig } from "vite-plus";

import { describe, expect, it } from "vite-plus/test";

import { wordpress } from "../src";
import { shouldInjectReactRefresh } from "../src/plugin/react-refresh";

function getConfigPlugin(options?: Parameters<typeof wordpress>[0]): Plugin {
  const plugin = wordpress(options).find(
    (candidate): candidate is Plugin =>
      candidate !== null &&
      candidate !== undefined &&
      typeof candidate === "object" &&
      "name" in candidate &&
      candidate.name === "vp-wp:config",
  );

  if (!plugin) {
    throw new Error("vp-wp:config plugin not found.");
  }

  return plugin;
}

async function resolveConfig(
  options?: Parameters<typeof wordpress>[0],
  userConfig: UserConfig = {},
) {
  const plugin = getConfigPlugin(options);
  const configHook = plugin.config;

  if (typeof configHook !== "function") {
    throw new Error("vp-wp:config hook is not callable.");
  }

  return await configHook.call({} as never, userConfig, {
    command: "build",
    mode: "test",
  } as never);
}

describe("wordpress", () => {
  it("applies WordPress-friendly defaults", async () => {
    const config = await resolveConfig();

    expect(config).toMatchObject({
      base: "./",
      build: {
        outDir: "dist",
        manifest: "manifest.json",
        modulePreload: false,
        rollupOptions: {
          input: "src/main.js",
        },
        sourcemap: true,
      },
      css: {
        devSourcemap: true,
      },
    });
  });

  it("lets explicit Vite config win over defaults", async () => {
    const config = await resolveConfig(
      {
        entry: "resources/app.ts",
        outDir: "assets/build",
      },
      {
        base: "/plugin/",
        build: {
          manifest: "custom-manifest.json",
          outDir: "public/build",
          sourcemap: false,
        },
      },
    );

    expect(config).toMatchObject({
      base: "/plugin/",
      build: {
        manifest: "custom-manifest.json",
        outDir: "public/build",
        rollupOptions: {
          input: "resources/app.ts",
        },
        sourcemap: false,
      },
    });
  });

  it("detects React refresh plugins automatically", () => {
    expect(shouldInjectReactRefresh("auto", [{ name: "vite:react-babel" } as Plugin])).toBe(true);

    expect(shouldInjectReactRefresh("auto", [{ name: "vite:vue" } as Plugin])).toBe(false);
  });
});

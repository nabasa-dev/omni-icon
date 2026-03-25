import type { Plugin, PluginOption, UserConfig } from "vite-plus";

import type { ResolvedWordPressPluginOptions, WordPressPluginOptions } from "../shared/types";
import { DEFAULT_ENTRY, DEFAULT_OUT_DIR, resolveWordPressOptions } from "./config-defaults";
import { devManifestPlugin } from "./dev-manifest";

export function wordpress(options: WordPressPluginOptions = {}): PluginOption[] {
  const resolved = resolveWordPressOptions(options);

  const configPlugin: Plugin = {
    name: "vp-wp:config",
    enforce: "pre",

    config(userConfig) {
      return createWordPressConfig(userConfig, resolved);
    },
  };

  const plugins: PluginOption[] = [configPlugin];

  if (resolved.devManifest) {
    plugins.push(devManifestPlugin(resolved));
  }

  return plugins;
}

export function createWordPressConfig(
  userConfig: UserConfig,
  options: ResolvedWordPressPluginOptions,
): UserConfig {
  const input = userConfig.build?.rollupOptions?.input ?? options.entry ?? DEFAULT_ENTRY;
  const outDir = userConfig.build?.outDir ?? options.outDir ?? DEFAULT_OUT_DIR;

  return {
    base: userConfig.base ?? options.base,
    build: {
      outDir,
      emptyOutDir: userConfig.build?.emptyOutDir ?? options.clean,
      manifest: userConfig.build?.manifest ?? options.manifest,
      modulePreload: userConfig.build?.modulePreload ?? false,
      rollupOptions: {
        input,
      },
      sourcemap: userConfig.build?.sourcemap ?? options.sourcemap,
    },
    css: {
      devSourcemap: userConfig.css?.devSourcemap ?? true,
    },
  };
}

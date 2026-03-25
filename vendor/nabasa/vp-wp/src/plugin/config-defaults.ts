import type { ResolvedWordPressPluginOptions, WordPressPluginOptions } from "../shared/types";

export const DEFAULT_ENTRY = "src/main.js";
export const DEFAULT_OUT_DIR = "dist";
export const DEFAULT_BASE = "./";
export const DEFAULT_MANIFEST_FILE = "manifest.json";
export const DEFAULT_DEV_MANIFEST_FILE = "vite-dev-server.json";

export function resolveWordPressOptions(
  options: WordPressPluginOptions = {},
): ResolvedWordPressPluginOptions {
  return {
    entry: options.entry,
    outDir: options.outDir,
    base: options.base ?? DEFAULT_BASE,
    clean: options.clean ?? true,
    manifest: resolveFileNameOption(options.manifest, DEFAULT_MANIFEST_FILE),
    devManifest: resolveFileNameOption(options.devManifest, DEFAULT_DEV_MANIFEST_FILE),
    injectReactRefresh: options.injectReactRefresh ?? "auto",
    sourcemap: options.sourcemap ?? true,
  };
}

function resolveFileNameOption(
  option: boolean | string | undefined,
  defaultFileName: string,
): string | false {
  if (option === false) {
    return false;
  }

  if (typeof option === "string") {
    return option;
  }

  return defaultFileName;
}

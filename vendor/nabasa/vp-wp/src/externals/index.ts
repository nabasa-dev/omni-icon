import type { Plugin, PluginOption } from "vite-plus";

import type { WordPressExternalsOptions, WordPressGlobalsMap } from "../shared/types";
import { getWordPressGlobals } from "./wp-globals";

export async function wordpressExternals(
  options: WordPressExternalsOptions = {},
): Promise<PluginOption[]> {
  const globals = resolveWordPressExternals(options);
  const { default: externalGlobals } = await import("rollup-plugin-external-globals");
  const { default: viteExternal } = await import("vite-plugin-external");

  const configPlugin: Plugin = {
    name: "vp-wp:externals",
    apply: "build",

    config() {
      return {
        build: {
          rollupOptions: {
            external: Object.keys(globals),
            output: {
              globals,
            },
          },
        },
      };
    },
  };

  return [
    configPlugin,
    externalGlobals(globals) as unknown as PluginOption,
    viteExternal({
      development: {
        externals: globals,
      },
    }) as unknown as PluginOption,
  ];
}

export function resolveWordPressExternals(
  options: WordPressExternalsOptions = {},
): WordPressGlobalsMap {
  const { exclude = [], include = {}, preset = "wordpress+react" } = options;

  const globals = {
    ...getWordPressGlobals(preset),
    ...include,
  };

  for (const packageName of exclude) {
    delete globals[packageName];
  }

  return globals;
}

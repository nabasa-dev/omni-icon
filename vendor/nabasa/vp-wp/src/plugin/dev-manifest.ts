import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { Plugin, ResolvedConfig, ViteDevServer } from "vite-plus";

import type { DevManifestData, ResolvedWordPressPluginOptions } from "../shared/types";
import { DEFAULT_DEV_MANIFEST_FILE, DEFAULT_OUT_DIR } from "./config-defaults";
import { shouldInjectReactRefresh } from "./react-refresh";

export function devManifestPlugin(options: ResolvedWordPressPluginOptions): Plugin {
  let config: ResolvedConfig;
  let manifestPath = "";

  return {
    name: "vp-wp:dev-manifest",
    apply: "serve",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    configureServer(server) {
      const cleanup = () => {
        if (!manifestPath) {
          return;
        }

        void removeDevManifestFile(manifestPath);
      };

      const writeManifest = () => {
        const outDir = options.outDir ?? config.build.outDir ?? DEFAULT_OUT_DIR;
        const fileName = options.devManifest || DEFAULT_DEV_MANIFEST_FILE;

        manifestPath = resolveDevManifestPath(config.root, outDir, fileName);

        const data: DevManifestData = {
          base: config.base,
          origin: getDevServerOrigin(server),
          reactRefresh: shouldInjectReactRefresh(options.injectReactRefresh, config.plugins),
        };

        void writeDevManifestFile(manifestPath, data);
      };

      if (server.httpServer) {
        const onListening = () => {
          queueMicrotask(writeManifest);
        };

        if (server.httpServer.listening) {
          onListening();
        } else {
          server.httpServer.once("listening", onListening);
        }

        server.httpServer.once("close", cleanup);
      }
    },
  };
}

export function getDevServerOrigin(server: ViteDevServer): string {
  const url = server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0];

  if (!url) {
    throw new Error("vp-wp could not resolve the dev server URL.");
  }

  return new URL(url).origin;
}

export function resolveDevManifestPath(root: string, outDir: string, fileName: string): string {
  return resolve(root, outDir, fileName);
}

export async function writeDevManifestFile(filePath: string, data: DevManifestData): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function removeDevManifestFile(filePath: string): Promise<void> {
  await rm(filePath, { force: true });
}

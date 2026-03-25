export type WordPressEntry = string | string[] | Record<string, string>;

export type InjectReactRefreshOption = boolean | "auto";

export type WordPressGlobalsMap = Record<string, string>;

export interface WordPressPluginOptions {
  entry?: WordPressEntry;
  outDir?: string;
  base?: string;
  clean?: boolean;
  manifest?: boolean | string;
  devManifest?: boolean | string;
  injectReactRefresh?: InjectReactRefreshOption;
  sourcemap?: boolean;
}

export interface ResolvedWordPressPluginOptions {
  entry?: WordPressEntry;
  outDir?: string;
  base: string;
  clean: boolean;
  manifest: string | false;
  devManifest: string | false;
  injectReactRefresh: InjectReactRefreshOption;
  sourcemap: boolean;
}

export interface DevManifestData {
  base: string;
  origin: string;
  reactRefresh: boolean;
}

export interface WordPressExternalsOptions {
  preset?: "wordpress" | "wordpress+react";
  include?: WordPressGlobalsMap;
  exclude?: string[];
}

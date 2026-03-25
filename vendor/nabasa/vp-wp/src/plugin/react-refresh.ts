import type { Plugin } from "vite-plus";

import type { InjectReactRefreshOption } from "../shared/types";

export function shouldInjectReactRefresh(
  option: InjectReactRefreshOption,
  plugins: readonly Plugin[],
): boolean {
  if (option === true || option === false) {
    return option;
  }

  return plugins.some(
    (plugin) => plugin.name.startsWith("vite:react") || plugin.name.includes("react-refresh"),
  );
}

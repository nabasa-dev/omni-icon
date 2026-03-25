import { describe, expect, it } from "vite-plus/test";

import { resolveWordPressExternals } from "../src/externals";

describe("resolveWordPressExternals", () => {
  it("uses the wordpress+react preset by default", () => {
    const globals = resolveWordPressExternals();

    expect(globals["@wordpress/data"]).toBe("wp.data");
    expect(globals.react).toBe("React");
    expect(globals["react-dom/client"]).toBe("ReactDOM");
  });

  it("supports the wordpress preset without React globals", () => {
    const globals = resolveWordPressExternals({ preset: "wordpress" });

    expect(globals["@wordpress/element"]).toBe("wp.element");
    expect(globals.react).toBeUndefined();
  });

  it("supports include and exclude overrides", () => {
    const globals = resolveWordPressExternals({
      exclude: ["lodash"],
      include: {
        "@acme/ui": "AcmeUI",
      },
    });

    expect(globals["@acme/ui"]).toBe("AcmeUI");
    expect(globals.lodash).toBeUndefined();
  });
});

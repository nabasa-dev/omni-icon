import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vite-plus/test";

import { removeDevManifestFile, writeDevManifestFile } from "../src/plugin/dev-manifest";

let temporaryDirectory = "";

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { force: true, recursive: true });
    temporaryDirectory = "";
  }
});

describe("dev manifest helpers", () => {
  it("writes and removes the manifest file", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "vp-wp-"));

    const manifestPath = join(temporaryDirectory, "nested", "vite-dev-server.json");

    await writeDevManifestFile(manifestPath, {
      base: "./",
      origin: "http://localhost:5173",
      reactRefresh: true,
    });

    const content = await readFile(manifestPath, "utf8");

    expect(JSON.parse(content)).toEqual({
      base: "./",
      origin: "http://localhost:5173",
      reactRefresh: true,
    });

    await removeDevManifestFile(manifestPath);

    await expect(readFile(manifestPath, "utf8")).rejects.toThrow();
  });
});

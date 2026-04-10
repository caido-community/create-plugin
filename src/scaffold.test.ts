import fsPromises from "fs/promises";
import path from "path";
import os from "os";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { toPluginId, updateTemplateValues } from "./scaffold";

describe("toPluginId", () => {
  it("converts a simple name to lowercase", () => {
    expect(toPluginId("MyPlugin")).toBe("myplugin");
  });

  it("converts spaces to hyphens", () => {
    expect(toPluginId("My Cool Scanner")).toBe("my-cool-scanner");
  });

  it("removes special characters", () => {
    expect(toPluginId("my@plugin!name")).toBe("my-plugin-name");
  });

  it("collapses consecutive hyphens", () => {
    expect(toPluginId("my---plugin")).toBe("my-plugin");
  });

  it("trims leading and trailing hyphens", () => {
    expect(toPluginId("--my-plugin--")).toBe("my-plugin");
  });

  it("handles mixed case with spaces and special characters", () => {
    expect(toPluginId("Amr Elsagaei's Plugin!")).toBe("amr-elsagaei-s-plugin");
  });

  it("preserves numbers", () => {
    expect(toPluginId("plugin123")).toBe("plugin123");
  });

  it("handles already valid ids", () => {
    expect(toPluginId("my-plugin")).toBe("my-plugin");
  });
});

describe("updateTemplateValues", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "scaffold-test-"));
  });

  afterEach(async () => {
    await fsPromises.rm(tmpDir, { recursive: true });
  });

  it("updates caido.config.ts and package.json for frontend-vue template", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "caido.config.ts"),
      `const id = "frontend-vue";
export default defineConfig({
  id,
  name: "Frontend Vue",
});\n`,
    );
    await fsPromises.writeFile(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "frontend-vue", version: "0.0.0" }, null, 2) +
        "\n",
    );

    await updateTemplateValues(tmpDir, {
      packageName: "My Cool Scanner",
      frontend: { framework: "vue" },
    });

    const configContent = await fsPromises.readFile(
      path.join(tmpDir, "caido.config.ts"),
      "utf-8",
    );
    expect(configContent).toContain('"my-cool-scanner"');
    expect(configContent).toContain('"My Cool Scanner"');
    expect(configContent).not.toContain('"frontend-vue"');
    expect(configContent).not.toContain('"Frontend Vue"');

    const packageJson = JSON.parse(
      await fsPromises.readFile(path.join(tmpDir, "package.json"), "utf-8"),
    );
    expect(packageJson.name).toBe("my-cool-scanner");
  });

  it("updates caido.config.ts and package.json for no-frontend template", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "caido.config.ts"),
      `export default defineConfig({
  id: "no-frontend",
  name: "No Frontend",
});\n`,
    );
    await fsPromises.writeFile(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "no-frontend", version: "0.0.0" }, null, 2) +
        "\n",
    );

    await updateTemplateValues(tmpDir, {
      packageName: "background-worker",
    });

    const configContent = await fsPromises.readFile(
      path.join(tmpDir, "caido.config.ts"),
      "utf-8",
    );
    expect(configContent).toContain('"background-worker"');
    expect(configContent).not.toContain('"no-frontend"');
    expect(configContent).not.toContain('"No Frontend"');

    const packageJson = JSON.parse(
      await fsPromises.readFile(path.join(tmpDir, "package.json"), "utf-8"),
    );
    expect(packageJson.name).toBe("background-worker");
  });

  it("preserves other package.json fields", async () => {
    const original = {
      name: "frontend-vue",
      version: "0.0.0",
      private: true,
      scripts: { build: "caido-dev build" },
    };
    await fsPromises.writeFile(
      path.join(tmpDir, "caido.config.ts"),
      `const id = "frontend-vue";\n`,
    );
    await fsPromises.writeFile(
      path.join(tmpDir, "package.json"),
      JSON.stringify(original, null, 2) + "\n",
    );

    await updateTemplateValues(tmpDir, {
      packageName: "test-plugin",
      frontend: { framework: "vue" },
    });

    const packageJson = JSON.parse(
      await fsPromises.readFile(path.join(tmpDir, "package.json"), "utf-8"),
    );
    expect(packageJson.name).toBe("test-plugin");
    expect(packageJson.version).toBe("0.0.0");
    expect(packageJson.private).toBe(true);
    expect(packageJson.scripts.build).toBe("caido-dev build");
  });
});

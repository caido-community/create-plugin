import { confirm, input } from "@inquirer/prompts";

import { toPluginId } from "./scaffold";
import { type ScaffoldConfig } from "./types";

export const prompt = async (): Promise<ScaffoldConfig> => {
  const packageName = await input({
    message: "What is the name of your plugin package?",
    validate: (value) => {
      if (value.length === 0) {
        return "Package name is required";
      }

      return true;
    },
  });

  const pluginId = await input({
    message: "What is the ID of your plugin package?",
    default: toPluginId(packageName),
    validate: (value) => {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return "Plugin ID must be lowercase letters, numbers and hyphens (e.g. my-plugin)";
      }

      return true;
    },
  });

  const hasFrontend = await confirm({
    message: "Will your plugin package customize the Caido UI?",
  });

  return {
    packageName,
    pluginId,
    frontend: hasFrontend ? { framework: "vue" } : undefined,
  };
};

import { confirm, input } from "@inquirer/prompts";

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

  const hasFrontend = await confirm({
    message: "Will your plugin package customize the Caido UI?",
  });

  return {
    packageName,
    frontend: hasFrontend ? { framework: "vue" } : undefined,
  };
};

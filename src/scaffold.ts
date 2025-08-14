import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { type ScaffoldConfig } from "./types";

export const scaffold = async (config: ScaffoldConfig) => {
  const templatePath = getTemplatePath(config);
  const destinationPath = getDestinationPath(config);

  console.log(`[*] Creating template in ${destinationPath}`);
  await fsPromises.cp(templatePath, destinationPath, {
    recursive: true,
    errorOnExist: true,
  });

  await copySharedCursorRules(destinationPath);

  console.log(`[*] Template created in ${destinationPath}`);
  console.log(`[*] Run the following commands to get started:`);
  console.log(`[*] - cd ${destinationPath}`);
  console.log(`[*] - pnpm install`);
  console.log(`[*] - pnpm build`);
  console.log(
    `[*] This will generate a "dist/plugin_package.zip" file ready to be installed in Caido`,
  );
};

const getTemplatePath = (config: ScaffoldConfig) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templateDir = path.join(__dirname, "../", "templates");

  if (config.frontend) {
    return path.join(templateDir, "frontend-vue");
  } else {
    return path.join(templateDir, "no-frontend");
  }
};

const getDestinationPath = (config: ScaffoldConfig) => {
  const sanitizedPackageName = config.packageName.replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  );
  return path.join(process.cwd(), sanitizedPackageName);
};

const getSharedCursorRulesPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "../", "templates", "shared", "cursor-rules");
};

const copySharedCursorRules = async (destinationPath: string) => {
  const sharedRulesSource = getSharedCursorRulesPath();
  try {
    await fsPromises.access(sharedRulesSource);
  } catch {
    return;
  }

  const rulesDestination = path.join(destinationPath, ".cursor", "rules");
  await fsPromises.mkdir(rulesDestination, { recursive: true });
  await fsPromises.cp(sharedRulesSource, rulesDestination, {
    recursive: true,
    errorOnExist: false,
  });
};

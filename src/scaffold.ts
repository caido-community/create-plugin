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

  await updateTemplateValues(destinationPath, config);
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

const toPluginId = (packageName: string) => {
  return packageName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getTemplateId = (config: ScaffoldConfig) => {
  return config.frontend ? "frontend-vue" : "no-frontend";
};

const getTemplateName = (config: ScaffoldConfig) => {
  return config.frontend ? "Frontend Vue" : "No Frontend";
};

const updateTemplateValues = async (
  destinationPath: string,
  config: ScaffoldConfig,
) => {
  const pluginId = toPluginId(config.packageName);
  const templateId = getTemplateId(config);
  const templateName = getTemplateName(config);

  const configPath = path.join(destinationPath, "caido.config.ts");
  let configContent = await fsPromises.readFile(configPath, "utf-8");
  configContent = configContent.replaceAll(`"${templateId}"`, `"${pluginId}"`);
  configContent = configContent.replaceAll(
    `"${templateName}"`,
    `"${config.packageName}"`,
  );
  await fsPromises.writeFile(configPath, configContent);

  const packageJsonPath = path.join(destinationPath, "package.json");
  let packageJsonContent = await fsPromises.readFile(packageJsonPath, "utf-8");
  packageJsonContent = packageJsonContent.replace(
    `"name": "${templateId}"`,
    `"name": "${pluginId}"`,
  );
  await fsPromises.writeFile(packageJsonPath, packageJsonContent);
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

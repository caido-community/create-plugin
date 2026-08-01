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
  await copySharedSkills(destinationPath, config);

  console.log(`[*] Template created in ${destinationPath}`);
  console.log(
    `[*] We recommend mise to manage the Node.js & pnpm toolchain: https://mise.jdx.dev/`,
  );
  console.log(`[*] Run the following commands to get started:`);
  console.log(`[*] - cd ${destinationPath}`);
  console.log(`[*] - mise trust && mise install`);
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

export const toPluginId = (packageName: string) => {
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

export const updateTemplateValues = async (
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
  const packageJsonContent = await fsPromises.readFile(
    packageJsonPath,
    "utf-8",
  );
  const packageJson = JSON.parse(packageJsonContent);
  packageJson.name = pluginId;
  await fsPromises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );

  const specPath = getSpecPath(destinationPath, config);
  let specContent = await fsPromises.readFile(specPath, "utf-8");
  specContent = specContent.replaceAll(
    `manifestId: "${templateId}"`,
    `manifestId: "${pluginId}"`,
  );
  await fsPromises.writeFile(specPath, specContent);
};

// The plugin Spec (and its `manifestId`) lives in the `shared` package when the
// plugin has a frontend, and in the backend package otherwise.
const getSpecPath = (destinationPath: string, config: ScaffoldConfig) => {
  return config.frontend
    ? path.join(destinationPath, "packages", "shared", "src", "index.ts")
    : path.join(destinationPath, "packages", "backend", "src", "spec.ts");
};

const getSharedSkillsPath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "../", "templates", "shared", "skills");
};

const getSharedSkills = (config: ScaffoldConfig) => {
  const skills = ["caido-plugin-development"];
  if (config.frontend) {
    skills.push("caido-vue-ui");
  }
  return skills;
};

export const copySharedSkills = async (
  destinationPath: string,
  config: ScaffoldConfig,
) => {
  const sharedSkillsSource = getSharedSkillsPath();
  try {
    await fsPromises.access(sharedSkillsSource);
  } catch {
    return;
  }

  const skillsDestination = path.join(destinationPath, ".agents", "skills");
  await fsPromises.mkdir(skillsDestination, { recursive: true });

  for (const skill of getSharedSkills(config)) {
    await fsPromises.cp(
      path.join(sharedSkillsSource, skill),
      path.join(skillsDestination, skill),
      { recursive: true, errorOnExist: false },
    );
  }
};

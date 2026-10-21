export type ScaffoldConfig = {
  packageName: string;
  pluginId: string;
  frontend?: {
    framework: "vue" | "none";
  };
};

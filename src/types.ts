export type ScaffoldConfig = {
  packageName: string;
  frontend?: {
    framework: "vue" | "none";
  };
};

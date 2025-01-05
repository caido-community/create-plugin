import { defineConfig } from '@caido-community/dev';

export default defineConfig({
  id: "no-frontend",
  name: "No Frontend",
  description: "Plugin template with no frontend",
  version: "0.0.0",
  author: {
    name: "Caido Labs Inc.",
    email: "dev@caido.io",
    url: "https://caido.io",
  },
  plugins: [
    {
      kind: "backend",
      id: "backend",
      root: "packages/backend",
    },
  ]
});
import { defineConfig } from '@caido-community/dev';
import tailwindcss from "tailwindcss";
// @ts-expect-error no declared types at this time
import tailwindPrimeui from "tailwindcss-primeui";
import tailwindCaido from "@caido/tailwindcss";
import path from "path";
import prefixwrap from "postcss-prefixwrap";

// This is the ID of the plugin
// It must be unique and not conflict with other plugins
const id = "frontend-vanilla";

export default defineConfig({
  id,
  name: "Frontend Vanilla",
  description: "Plugin template with vanilla frontend",
  version: "0.0.1",
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
    {
      kind: 'frontend',
      id: "frontend",
      root: 'packages/frontend',
      backend: {
        id: "backend",
      },
      vite: {
        build: {
          rollupOptions: {
            external: ['@caido/frontend-sdk']
          }
        },
        resolve: {
          alias: [
            {
              find: "@",
              replacement: path.resolve(__dirname, "packages/frontend/src"),
            },
          ],
        },
        css: {
          postcss: {
            plugins: [
              // This plugin wraps the root element in a unique ID
              // This is necessary to prevent styling conflicts between plugins
              prefixwrap(`#plugin--${id}`),

              tailwindcss({
                corePlugins: {
                  preflight: false,
                },
                content: [
                  './packages/frontend/src/**/*.{vue,ts}',
                  './node_modules/@caido/primevue/dist/primevue.mjs'
                ],
                // Check the [data-mode="dark"] attribute on the <html> element to determine the mode
                // This attribute is set in the Caido core application
                darkMode: ["selector", '[data-mode="dark"]'],
                plugins: [

                  // This plugin injects the necessary Tailwind classes for PrimeVue components
                  tailwindPrimeui,

                  // This plugin injects the necessary Tailwind classes for the Caido theme
                  tailwindCaido,
                ],
              })
            ]
          }
        }
      }
    }
  ]
});
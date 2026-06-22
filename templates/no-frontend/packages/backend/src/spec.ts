import type { DefinePluginPackageSpec } from "@caido/sdk-shared";

// The backend API.
export type API = {
  generateRandomString: (length: number) => string;
};

export type Events = Record<string, never>;

export type Spec = DefinePluginPackageSpec<{
  manifestId: "no-frontend";
  api: API;
  events: Events;
}>;

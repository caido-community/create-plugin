import type { SDK } from "caido:plugin";

import type { Spec } from "./spec";

function generateRandomString(sdk: SDK, length: number): string {
  const value = Math.random()
    .toString(36)
    .substring(2, length + 2);
  sdk.console.log(`Generating random string: ${value}`);
  return value;
}

export function init(sdk: SDK<Spec>) {
  sdk.api.register("generateRandomString", generateRandomString);
}

import tailwindcss from "tailwindcss";
import prefixwrap from "postcss-prefixwrap";

import manifest from "../../manifest.json" with { type: "json" };

export default {
  plugins: [
    // This plugin injects the necessary Tailwind classes
    tailwindcss(),

    // This plugin wraps the root element in a unique ID
    // This is necessary to prevent styling conflicts between plugins
    prefixwrap(`#plugin--${manifest.id}`),
  ],
}

import tailwindcss from "tailwindcss";
import prefixwrap from "postcss-prefixwrap";

import manifest from "../manifest.json";

export default {
  plugins: [
    tailwindcss(),
    prefixwrap(`#plugin--${manifest.id}`),
  ],
}

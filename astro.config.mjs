import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      config: { applyBaseStyles: false, path: "./tailwind.config.cjs" },
    }),
  ],
  site: "https://www.foursilverstrings.com.au",
});

import type { Config } from "tailwindcss";
import preset from "../../packages/config/tailwind.preset.js";

const config: Config = {
  presets: [preset],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Tajawal", "Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
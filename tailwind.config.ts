import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2BD17E",
        error: "#EB5757",
        background: "#093545",
        inputColor: "#224957",
        cardColor: "#092C39",
      },
    },
  },
  plugins: [],
};
export default config;

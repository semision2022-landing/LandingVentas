import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        navy: "#18224C",
        "navy-light": "#1B3A5C",
        cyan: "#00D0FF",
        purple: "#5F4EDA",
        green: {
          brand: "#579601",
        },
      },
    },
  },
  plugins: [],
};
export default config;

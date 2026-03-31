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
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
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
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-4px) rotate(-1deg)" },
          "75%": { transform: "translateY(4px) rotate(1deg)" },
        },
        marqueeSlide: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(var(--marquee-offset))" },
        },
      },
      animation: {
        "wave": "wave 4s ease-in-out infinite",
        "marquee": "marqueeSlide 6s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;

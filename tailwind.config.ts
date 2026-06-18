import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#05020a",
        obsidian: "#0b0714",
        nexus: {
          400: "#bb7cff",
          500: "#8b3dff",
          600: "#6f22db",
          700: "#4d159d"
        }
      },
      boxShadow: {
        glow: "0 0 42px rgba(139, 61, 255, 0.32)"
      },
      backgroundImage: {
        "radial-grid": "radial-gradient(circle at 18% 12%, rgba(139,61,255,.24), transparent 28%), radial-gradient(circle at 84% 8%, rgba(236,72,153,.14), transparent 24%), linear-gradient(180deg, #05020a 0%, #090512 48%, #05020a 100%)"
      }
    }
  },
  plugins: []
};

export default config;

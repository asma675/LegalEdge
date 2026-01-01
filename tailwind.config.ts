import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,.25), 0 20px 60px rgba(0,0,0,.35)",
      }
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#16a34a",
          greenDark: "#15803d",
          greenSoft: "#dcfce7",
          blue: "#2563eb",
          blueSoft: "#dbeafe",
          yellow: "#eab308",
          yellowSoft: "#fef9c3",
          ink: "#0f172a",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -8px rgba(15, 23, 42, 0.08)",
        card: "0 1px 3px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.03)",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
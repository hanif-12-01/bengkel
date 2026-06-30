/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--text) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        surfaceSoft: "hsl(var(--surface-soft) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          dark: "hsl(var(--primary-dark) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
        info: "hsl(var(--info) / <alpha-value>)",
        text: "hsl(var(--text) / <alpha-value>)",
      },
      boxShadow: {
        premium: '0 18px 45px -28px hsl(var(--shadow-color) / 0.55)',
        soft: '0 12px 24px -18px hsl(var(--shadow-color) / 0.45)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.5rem',
        sm: '0.25rem',
      }
    },
  },
  plugins: [],
}

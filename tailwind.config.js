/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(0.165 0.028 258)",
        foreground: "oklch(0.98 0.003 258)",
        "muted-foreground": "oklch(0.72 0.02 258)",
        primary: "oklch(0.68 0.17 253)",
        "primary-foreground": "oklch(0.18 0.03 258)",
        card: "oklch(0.205 0.03 258)",
        border: "oklch(0.3 0.025 258 / 0.5)",
        success: "oklch(0.72 0.17 152)",
        warning: "oklch(0.78 0.16 70)",
        error: "oklch(0.66 0.2 25)",
        accent: "oklch(0.6 0.14 200)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

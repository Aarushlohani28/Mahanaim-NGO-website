import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic tokens (map to CSS variables) ── */
        background:          "var(--background)",
        foreground:          "var(--foreground)",
        card:                "var(--card)",
        "card-foreground":   "var(--card-foreground)",
        secondary:           "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted:               "var(--muted)",
        "muted-foreground":  "var(--muted-foreground)",
        primary:             "var(--primary)",
        "primary-foreground":"var(--primary-foreground)",
        accent:              "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border:              "var(--border)",
        ring:                "var(--ring)",

        /* ── Brand palette (raw values, for explicit usage) ── */
        cream: {
          50:  "#FFFDF9",
          100: "#FFFBF5",
          200: "#FAF5EC",
          300: "#F5ECE0",
        },
        gold: {
          400: "#F3A23A",
          500: "#E88D23",
          600: "#D47B15",
          700: "#B8650E",
        },
        brandRed: {
          50:  "#FFF0F0",
          100: "#FFE0E0",
          500: "#FF6F61",
          600: "#E56357",
          700: "#CC594E",
        },
        brandTeal: {
          50:  "#F0FDFA",
          100: "#CCFBF1",
          500: "#0D9488",
          600: "#0F766E",
          700: "#115E59",
        },
        sage: {
          100: "#EAF2EE",
          500: "#5E9B8B",
          600: "#4F8678",
          700: "#3D6A5F",
        },
        skyAccent: {
          100: "#EBF5FC",
          500: "#3B9AE1",
          600: "#2B87CC",
        },
        coralAccent: {
          100: "#FDF0F0",
          500: "#E06B75",
          600: "#C75A64",
        },
        brandDark:  "#1F2937",
        footerDark: "#141A22",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Geist"',
          '"Inter"',
          "var(--font-outfit)",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        apple:      "0 8px 30px rgba(0, 0, 0, 0.04)",
        appleHover: "0 20px 40px rgba(0, 0, 0, 0.08)",
        soft:       "0 10px 30px -10px rgba(0, 0, 0, 0.04)",
        cardHover:  "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        glass:      "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
        glassDark:  "0 8px 32px 0 rgba(0, 0, 0, 0.40)",
        cardDark:   "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleUp: {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn:  "fadeIn 0.6s ease-out forwards",
        scaleUp: "scaleUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

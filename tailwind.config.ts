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
        // Brand colors
        primary: {
          DEFAULT: "#0EA5E9",
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        // Dark mode surfaces
        dark: {
          bg: "#070B14",
          surface: "#0D1220",
          elevated: "#131927",
          border: "rgba(255,255,255,0.06)",
          hover: "#1A2235",
        },
        // Light mode surfaces
        light: {
          bg: "#F0F4FF",
          surface: "#FFFFFF",
          elevated: "#F8FAFF",
          border: "rgba(14,165,233,0.10)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-ring-slow": "pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(14, 165, 233, 0.4), 0 0 40px rgba(14, 165, 233, 0.15)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.15)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.15)",
        "glow-violet": "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)",
        "card": "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        "card-dark": "0 4px 32px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
        "card-hover": "0 8px 40px rgba(14, 165, 233, 0.12), 0 2px 8px rgba(0,0,0,0.06)",
        "nav": "0 -1px 0 rgba(255,255,255,0.05), 0 -4px 20px rgba(0,0,0,0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

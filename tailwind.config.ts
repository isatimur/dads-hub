import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#546E7A", // Professional blue-gray
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#78909C", // Lighter blue-gray
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#C62828", // Mature red
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#ECEFF1", // Light blue-gray
          foreground: "#546E7A",
        },
        accent: {
          DEFAULT: "#90A4AE", // Medium blue-gray
          foreground: "#263238",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#263238",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "bounce-subtle": {
          "0%, 100%": {
            transform: "translateX(-5%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "bounce-subtle": "bounce-subtle 1s infinite",
        heartbeat: "heartbeat 1s ease-in-out",
        shimmer: "shimmer 2s infinite",
      },
      boxShadow: {
        'dad': '0 2px 4px rgba(38, 50, 56, 0.1)',
        'dad-hover': '0 4px 8px rgba(38, 50, 56, 0.15)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#263238',
            h1: {
              color: '#263238',
            },
            h2: {
              color: '#37474F',
            },
            h3: {
              color: '#455A64',
            },
            strong: {
              color: '#455A64',
            },
            a: {
              color: '#546E7A',
              '&:hover': {
                color: '#37474F',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
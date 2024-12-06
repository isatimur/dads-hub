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
          DEFAULT: "#37474F", // Deeper blue-gray for trust
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#607D8B", // Professional blue-gray
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#B71C1C", // Mature dark red
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#F5F7F9", // Softer background
          foreground: "#37474F",
        },
        accent: {
          DEFAULT: "#455A64", // Rich blue-gray
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#263238",
        },
      },
      boxShadow: {
        'dad': '0 2px 8px rgba(55, 71, 79, 0.08)',
        'dad-hover': '0 4px 12px rgba(55, 71, 79, 0.12)',
        'dad-active': '0 1px 4px rgba(55, 71, 79, 0.1)',
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
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
            transform: "translateY(-2%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.05)" },
          "50%": { transform: "scale(0.98)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "bounce-subtle": "bounce-subtle 2s infinite",
        heartbeat: "heartbeat 0.8s ease-in-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#263238',
            h1: {
              color: '#263238',
              fontWeight: '700',
            },
            h2: {
              color: '#37474F',
              fontWeight: '600',
            },
            h3: {
              color: '#455A64',
              fontWeight: '600',
            },
            strong: {
              color: '#455A64',
              fontWeight: '600',
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
      borderRadius: {
        'dad': '0.75rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
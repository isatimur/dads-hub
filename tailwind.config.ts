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
          DEFAULT: "#8B5CF6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#B71C1C",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#F5F7F9",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#D6BCFA",
          foreground: "#1A1F2C",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1A1F2C",
        },
      },
      boxShadow: {
        'glass': '0 4px 24px -1px rgba(0, 0, 0, 0.05)',
        'glass-hover': '0 8px 32px -1px rgba(0, 0, 0, 0.1)',
        'glass-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
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
            color: '#1A1F2C',
            h1: {
              color: '#1A1F2C',
              fontWeight: '700',
            },
            h2: {
              color: '#8B5CF6',
              fontWeight: '600',
            },
            h3: {
              color: '#7E69AB',
              fontWeight: '600',
            },
            strong: {
              color: '#7E69AB',
              fontWeight: '600',
            },
            a: {
              color: '#8B5CF6',
              '&:hover': {
                color: '#7E69AB',
              },
            },
          },
        },
      },
      borderRadius: {
        'glass': '1rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
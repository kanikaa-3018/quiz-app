// tailwind.config.js
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          background: "oklch(var(--background) / <alpha-value>)",
          foreground: "oklch(var(--foreground) / <alpha-value>)",
          card: "oklch(var(--card) / <alpha-value>)",
          "card-foreground": "oklch(var(--card-foreground) / <alpha-value>)",
          border: "oklch(var(--border) / <alpha-value>)",
          input: "oklch(var(--input) / <alpha-value>)",
          primary: "oklch(var(--primary) / <alpha-value>)",
          "primary-foreground": "oklch(var(--primary-foreground) / <alpha-value>)",
          secondary: "oklch(var(--secondary) / <alpha-value>)",
          "secondary-foreground": "oklch(var(--secondary-foreground) / <alpha-value>)",
          muted: "oklch(var(--muted) / <alpha-value>)",
          "muted-foreground": "oklch(var(--muted-foreground) / <alpha-value>)",
          accent: "oklch(var(--accent) / <alpha-value>)",
          "accent-foreground": "oklch(var(--accent-foreground) / <alpha-value>)",
          destructive: "oklch(var(--destructive) / <alpha-value>)",
          "destructive-foreground": "oklch(var(--destructive-foreground) / <alpha-value>)",
          ring: "oklch(var(--ring) / <alpha-value>)",
  
          // Custom scales
          "primary-50": "oklch(var(--primary-50) / <alpha-value>)",
          "primary-100": "oklch(var(--primary-100) / <alpha-value>)",
          "primary-500": "oklch(var(--primary-500) / <alpha-value>)",
          "primary-600": "oklch(var(--primary-600) / <alpha-value>)",
          "primary-700": "oklch(var(--primary-700) / <alpha-value>)",
  
          "success-100": "oklch(var(--success-100) / <alpha-value>)",
          "success-500": "oklch(var(--success-500) / <alpha-value>)",
          "success-600": "oklch(var(--success-600) / <alpha-value>)",
  
          "warning-100": "oklch(var(--warning-100) / <alpha-value>)",
          "warning-500": "oklch(var(--warning-500) / <alpha-value>)",
          "warning-600": "oklch(var(--warning-600) / <alpha-value>)",
  
          "error-100": "oklch(var(--error-100) / <alpha-value>)",
          "error-500": "oklch(var(--error-500) / <alpha-value>)",
          "error-600": "oklch(var(--error-600) / <alpha-value>)",
  
          "purple-100": "oklch(var(--purple-100) / <alpha-value>)",
          "purple-600": "oklch(var(--purple-600) / <alpha-value>)",
        },
      },
    },
    plugins: [],
  }
  
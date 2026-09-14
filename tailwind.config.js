/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-text)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // shadcn-style semantic colours used by components/smoothui/*.
      // Values live in app/globals.css as --sh-* HSL triplets (dark + light).
      colors: {
        background: 'hsl(var(--sh-background) / <alpha-value>)',
        foreground: 'hsl(var(--sh-foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--sh-card) / <alpha-value>)',
          foreground: 'hsl(var(--sh-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--sh-muted) / <alpha-value>)',
          foreground: 'hsl(var(--sh-muted-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--sh-border) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--sh-primary) / <alpha-value>)',
          foreground: 'hsl(var(--sh-primary-foreground) / <alpha-value>)',
        },
        ring: 'hsl(var(--sh-ring) / <alpha-value>)',
        brand: 'hsl(var(--sh-primary) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

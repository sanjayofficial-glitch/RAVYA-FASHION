import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        'canvas-alt': 'rgb(var(--canvas-alt) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-2': 'rgb(var(--ink-2) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
        sale: 'rgb(var(--sale) / <alpha-value>)',
        ok: 'rgb(var(--ok) / <alpha-value>)',
        pine: 'rgb(var(--pine) / <alpha-value>)',
        'pine-deep': 'rgb(var(--pine-deep) / <alpha-value>)',
        ochre: 'rgb(var(--ochre) / <alpha-value>)',
        'ochre-soft': 'rgb(var(--ochre-soft) / <alpha-value>)',
        clay: 'rgb(var(--clay) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'var(--font-jakarta)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'var(--font-syne)',
          'var(--font-jakarta)',
          '-apple-system',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        pill: '999px',
      },
      boxShadow: {
        lift: '0 8px 24px rgba(26,26,26,0.08)',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
export default config;

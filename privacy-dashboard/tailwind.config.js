/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cid-base': '#0A0E14',
        'cid-surface': '#141922',
        'cid-border': 'rgba(255,255,255,0.08)',
        'cid-text': 'rgba(255,255,255,0.85)',
        'cid-muted': 'rgba(255,255,255,0.4)',
        'persona-dylan': '#4A90E2',
        'persona-sarah': '#E89B7A',
        'persona-alex': '#D4A547',
        'zone-corporate': '#B8860B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

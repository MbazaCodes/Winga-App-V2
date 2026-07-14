import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#0A8F4D',
        'primary-dark':  '#077A40',
        'primary-light': '#2DA968',
        'primary-soft':  '#E6F4EC',
        gold:      '#FDBA12',
        'text-dark':  '#1A1A2E',
        'text-mid':   '#4A4560',
        'text-muted': '#8A8A9A',
        'input-bg':   '#F5F5FA',
        'card-border':'#EFEFEF',
        success: '#22C55E',
        danger:  '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        card:    '0 2px 12px rgba(0,0,0,0.06)',
        'card-md': '0 8px 28px rgba(10,143,77,0.12)',
        'card-lg': '0 16px 48px rgba(10,143,77,0.16)',
        input:   '0 0 0 3px rgba(10,143,77,0.12)',
      },
    },
  },
  plugins: [],
}

export default config

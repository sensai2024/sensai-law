/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // User Defined Theme Tokens
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        border: 'var(--border)',
        
        // Brand & Status (using variables defined in index.css)
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          muted: 'var(--primary-muted)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        status: {
          success: 'var(--success)',
          error: 'var(--error)',
          warning: 'var(--warning)',
          processing: 'var(--processing)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -5px var(--shadow-premium)',
        'soft': '0 2px 10px -2px var(--shadow-soft)',
        'gold-glow': '0 0 15px -3px rgba(207, 181, 59, 0.3)',
      }
    },
  },
  plugins: [
    typography,
  ],
}
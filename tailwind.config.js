/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LegalTech Premium SaaS Palette
        background: '#09090b', // Deep Charcoal
        surface: {
          DEFAULT: '#121214',  // Slightly lighter charcoal
          highlight: '#1c1c1f', // Elevation surface
          accent: '#27272a',    // Border/Action surface
        },
        primary: {
          DEFAULT: '#cfb53b',   // Gold
          hover: '#eab308',     // Amber
          muted: '#85732a',     // Darkened gold
        },
        secondary: {
          DEFAULT: '#3b82f6',   // Secondary Blue
          hover: '#2563eb',
        },
        border: '#27272a',      // Subtle dark border
        text: {
          primary: '#f4f4f5',   // Off-white
          secondary: '#a1a1aa', // Muted silver
          muted: '#71717a',    // Dim gray
        },
        status: {
          success: '#10b981',   // Emerald
          error: '#ef4444',     // Red
          warning: '#f59e0b',   // Amber
          processing: '#3b82f6', // Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -5px rgba(0, 0, 0, 0.7)',
        'gold-glow': '0 0 15px -3px rgba(207, 181, 59, 0.3)',
      }
    },
  },
  plugins: [
    typography,
  ],
}
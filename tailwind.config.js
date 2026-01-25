/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legal Tech Dark Theme Palette
        background: '#0f172a', // Slate 950
        surface: '#1e293b',    // Slate 800
        surfaceHighlight: '#334155', // Slate 700
        primary: '#3b82f6',    // Blue 500
        primaryHover: '#2563eb', // Blue 600
        border: '#1e293b',     // Slate 800
        text: {
          primary: '#f8fafc',  // Slate 50
          secondary: '#94a3b8', // Slate 400
          muted: '#64748b',    // Slate 500
        },
        status: {
          success: '#10b981', // Emerald 500
          warning: '#f59e0b', // Amber 500
          error: '#ef4444',   // Red 500
          info: '#3b82f6',    // Blue 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
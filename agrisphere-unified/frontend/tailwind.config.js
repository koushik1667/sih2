/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        organic: {
          bg: '#FDFCF8',           // Rice Paper / Off-white
          fg: '#2C2C24',           // Deep Loam / Charcoal
          card: '#FEFEFA',         // Light Warm Parchment
          primary: '#5D7052',      // Moss Green
          'primary-fg': '#F3F4F1', // Pale Mist
          secondary: '#C18C5D',    // Terracotta / Clay
          'secondary-fg': '#FFFFFF',// White
          accent: '#E6DCCD',       // Sand / Beige
          'accent-fg': '#4A4A40',  // Bark
          muted: '#F0EBE5',        // Stone
          'muted-fg': '#78786C',   // Dried Grass
          border: '#DED8CF',       // Raw Timber
          destructive: '#A85448',  // Burnt Sienna
        },
        // Backwards compatibility aliases
        agri: {
          50: '#FDFCF8',
          100: '#F3F4F1',
          200: '#E6DCCD',
          300: '#C5D0BE',
          400: '#8E9F84',
          500: '#5D7052', // Moss Green
          600: '#4D5E44',
          700: '#3E4C37',
          800: '#2F3A2A',
          900: '#2C2C24',
          950: '#1B1B16',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'organic-sm': '1.25rem',
        'organic-md': '2rem',
        'organic-lg': '2.5rem',
        'organic-xl': '3.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(93, 112, 82, 0.15)',
        'float': '0 10px 40px -10px rgba(193, 140, 93, 0.2)',
        'stone': '0 6px 24px -4px rgba(44, 44, 36, 0.08)',
        'glow-emerald': '0 4px 20px -2px rgba(93, 112, 82, 0.25)',
      }
    },
  },
  plugins: [],
}


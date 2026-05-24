/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Swiss Palette
        bg: {
          DEFAULT: '#FFFFFF',
          dark: '#000000',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#000000',
        },
        muted: {
          DEFAULT: '#F2F2F2',
          dark: '#111111',
        },
        accent: {
          DEFAULT: '#FF3000',
          hover: '#CC2600',
          light: '#FFF0ED',
        },
        // Remove terra completely and rely on pure BW+Red
        terra: {
          DEFAULT: '#FF3000',
          light: '#FFF0ED',
        },
        text: {
          primary: '#000000',
          secondary: '#333333',
          muted: '#666666',
        },
        border: {
          DEFAULT: '#000000',
          dark: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'], // Enforce sans everywhere
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.05em', fontWeight: '900' }],
        '9xl': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.05em', fontWeight: '900' }],
        '8xl': ['6rem', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '900' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'hero': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'title': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        // Strict geometric
        'card': '0px',
        'btn': '0px',
        'input': '0px',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '8': '8px',
      },
      boxShadow: {
        // Flat shadows or none
        'card': 'none',
        'card-hover': 'none',
        'navbar': 'none',
        'btn': 'none',
        'swiss': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      transitionDuration: {
        DEFAULT: '150ms', // Snappy
      },
      maxWidth: {
        'reading': '800px',
        'content': '1400px', // Wider grid
      },
    },
  },
  plugins: [],
};

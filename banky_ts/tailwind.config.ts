/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
    theme: {
    extend: {
      colors: {
        green: {
          600: '#16a34a', // instead of oklch
          700: '#15803d',
        },
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          600: '#4b5563',
          700: '#374151',
        }
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwind-animate'),
  ],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
  },
  plugins: [],
}
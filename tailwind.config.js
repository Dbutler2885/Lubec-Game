/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.action-button': {
          '@apply w-full text-center p-1 min-h-[2rem] overflow-hidden flex items-center justify-center': {}
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
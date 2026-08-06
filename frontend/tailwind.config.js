/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter","system-ui","sans-serif"] },
      borderRadius: { '2xl': '16px' }
    }
  },
  plugins: []
}
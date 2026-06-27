/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "#0a0a0a",
          card: "rgba(20, 20, 20, 0.75)",
          border: "rgba(212, 175, 55, 0.15)",
          gold: {
            light: "#f3e5ab",
            DEFAULT: "#d4af37",
            dark: "#8a660d",
            secondary: "#aa7c11"
          },
          emerald: "#04140e",
          crimson: "#14040a",
          sapphire: "#040d1a"
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'Montserrat', 'Inter', 'sans-serif'],
        script: ['var(--font-alex-brush)', 'Alex Brush', 'cursive']
      },
      boxShadow: {
        gold: '0 0 15px rgba(212, 175, 55, 0.25)',
        'gold-heavy': '0 0 30px rgba(212, 175, 55, 0.45)'
      }
    },
  },
  plugins: [],
}

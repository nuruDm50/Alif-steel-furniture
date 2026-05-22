module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          offwhite: '#F9F9FB',
          dark: '#0B0B0C',
          red: '#D92525',
          muted: '#65656A',
          border: '#E4E4E7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(11, 11, 12, 0.05)',
        'floating': '0 10px 30px -5px rgba(217, 37, 37, 0.2)'
      }
    },
  },
  plugins: [],
}
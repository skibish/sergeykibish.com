module.exports = {
  purge: [
    './layouts/**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: "Montserrat"
      },
      colors: {
        main: "#2171a4",
        accent: "#c7ba9d",
        txt: "#f8f5f3",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
